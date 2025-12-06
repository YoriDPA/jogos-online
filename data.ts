import { MenuCategory } from './types';

export const MENU_DATA: MenuCategory[] = [
  {
    categoria: "Pizzas",
    itens: [
      { id: "p1", nome: "Margherita", descricao: "Molho, mussarela, tomate fresco e manjericão", preco: 30.00 },
      { id: "p2", nome: "Calabresa", descricao: "Calabresa fatiada, cebola e mussarela", preco: 35.00 },
      { id: "p3", nome: "Quatro Queijos", descricao: "Mussarela, provolone, parmesão e gorgonzola", preco: 38.00 },
      { id: "p4", nome: "Frango com Catupiry", descricao: "Frango desfiado temperado com catupiry original", preco: 36.00 }
    ]
  },
  {
    categoria: "Bebidas",
    itens: [
      { id: "b1", nome: "Coca-Cola", descricao: "Lata 350ml", preco: 5.00 },
      { id: "b2", nome: "Guaraná Antarctica", descricao: "Lata 350ml", preco: 5.00 },
      { id: "b3", nome: "Água Mineral", descricao: "Garrafa 500ml sem gás", preco: 3.00 },
      { id: "b4", nome: "Suco de Laranja", descricao: "Natural 300ml", preco: 8.00 }
    ]
  },
  {
    categoria: "Sobremesas",
    itens: [
      { id: "s1", nome: "Pudim de Leite", descricao: "Fatia generosa de pudim caseiro", preco: 12.00 },
      { id: "s2", nome: "Mousse de Chocolate", descricao: "Cremoso com raspas de chocolate", preco: 10.00 }
    ]
  }
];