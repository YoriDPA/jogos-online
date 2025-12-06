export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
}

export interface MenuCategory {
  categoria: string;
  itens: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CustomerData {
  nome: string;
  telefone: string;
  endereco: string;
  observacoes: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string;
  customer: CustomerData;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
