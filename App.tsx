import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProductItem from './components/ProductItem';
import CartSummary from './components/CartSummary';
import CheckoutModal from './components/CheckoutModal';
import KitchenView from './components/KitchenView';
import { MENU_DATA } from './data';
import { MenuItem, CartItem, Order, OrderStatus, CustomerData } from './types';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, orderBy, query, updateDoc, doc, FirestoreError } from 'firebase/firestore';

const App: React.FC = () => {
  const [view, setView] = useState<'client' | 'kitchen'>('client');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Helper para salvar localmente
  const saveLocal = (newOrders: Order[]) => {
    localStorage.setItem('restaurant_orders', JSON.stringify(newOrders));
  };

  // Helper para ler localmente
  const getLocal = (): Order[] => {
    const saved = localStorage.getItem('restaurant_orders');
    return saved ? JSON.parse(saved) : [];
  };

  // Load Orders
  useEffect(() => {
    // 1. Carregar dados locais imediatamente (para evitar tela branca ou delay)
    const localOrders = getLocal();
    setOrders(localOrders);

    // 2. Tentar conexão com Firebase
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Sucesso: Sincronizar dados da nuvem
      const newOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(newOrders);
      saveLocal(newOrders); // Atualiza backup local
      setError(null);
    }, (err: FirestoreError) => {
      // Erro: Manter dados locais e avisar
      console.warn("Firebase Offline/Permissão:", err.message);
      
      if (err.code === 'permission-denied') {
        setError("Modo Offline (Permissões pendentes). Dados salvos apenas neste dispositivo.");
      } else {
        setError("Sem conexão. Funcionando em modo offline.");
      }
      // Não limpamos 'orders', mantemos a versão local
    });

    return () => unsubscribe();
  }, []);

  // Order Actions
  const addOrder = async (data: { customer: CustomerData; items: CartItem[]; total: number }) => {
    // Objeto do pedido
    const tempId = Math.random().toString(36).substr(2, 9);
    const newOrder: any = {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      // Tenta enviar para Firebase
      await addDoc(collection(db, 'orders'), newOrder);
    } catch (e) {
      console.error("Falha no Firebase, salvando localmente:", e);
      // Fallback: Salvar no estado local e LocalStorage
      const orderWithId = { ...newOrder, id: tempId };
      setOrders(prev => {
        const updated = [orderWithId, ...prev];
        saveLocal(updated);
        return updated;
      });
      alert("Pedido salvo no dispositivo (Modo Offline).");
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (e) {
      console.error("Falha ao atualizar status online:", e);
      // Fallback Local
      setOrders(prev => {
        const updated = prev.map(o => o.id === id ? { ...o, status } : o);
        saveLocal(updated);
        return updated;
      });
    }
  };

  // Cart Actions
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeOneFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const deleteFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleAdminAccess = () => {
    const password = prompt("Senha da Cozinha (Teste: 1234):");
    if (password === '1234') {
      setView('kitchen');
    } else if (password) {
      alert("Senha incorreta");
    }
  };

  // Derived State
  const total = useMemo(() => cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0), [cart]);
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  if (view === 'kitchen') {
    return (
      <KitchenView 
        orders={orders} 
        updateStatus={updateStatus} 
        onLogout={() => setView('client')} 
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Header onAdminClick={handleAdminAccess} />
      
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {MENU_DATA.map((category) => (
          <section key={category.categoria} id={category.categoria.toLowerCase()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
              {category.categoria}
            </h2>
            <div className="grid gap-4">
              {category.itens.map(item => (
                <ProductItem 
                  key={item.id} 
                  item={item} 
                  onAdd={addToCart} 
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <CartSummary 
        count={count} 
        total={total} 
        onOpen={() => setIsCheckoutOpen(true)} 
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        onAdd={(item) => addToCart(item)}
        onRemove={removeOneFromCart}
        onDelete={deleteFromCart}
        onClear={clearCart}
        onOrderComplete={addOrder}
      />
    </div>
  );
};

export default App;