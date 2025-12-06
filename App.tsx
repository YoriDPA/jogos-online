import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ProductItem from './components/ProductItem';
import CartSummary from './components/CartSummary';
import CheckoutModal from './components/CheckoutModal';
import { MENU_DATA } from './data';
import { MenuItem, CartItem } from './types';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  // Derived State
  const total = useMemo(() => cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0), [cart]);
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return (
    <div className="min-h-screen font-sans">
      <Header />
      
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
      />
    </div>
  );
};

export default App;