const menuData = [
  {
    categoria: "Pizzas",
    itens: [
      { nome: "Margherita", descricao: "Molho, queijo e tomate", preco: 30.00 },
      { nome: "Calabresa", descricao: "Calabresa, cebola e queijo", preco: 35.00 }
    ]
  },
  {
    categoria: "Bebidas",
    itens: [
      { nome: "Coca-Cola", descricao: "Lata 350ml", preco: 5.00 },
      { nome: "Água", descricao: "Garrafa 500ml", preco: 3.00 }
    ]
  }
  // Adicione mais categorias e itens aqui!
];

function carregarMenu() {
  const menu = document.getElementById('menu');
  menuData.forEach(cat => {
    const divCat = document.createElement('div');
    divCat.classList.add('categoria');
    divCat.innerHTML = `<h2>${cat.categoria}</h2>`;
    cat.itens.forEach(item => {
      const divItem = document.createElement('div');
      divItem.classList.add('item');
      divItem.innerHTML = `
        <div class="item-info">
          <h3>${item.nome}</h3>
          <p>${item.descricao} - R$ ${item.preco.toFixed(2)}</p>
        </div>
        <button class="add-btn" onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">Adicionar</button>
      `;
      divCat.appendChild(divItem);
    });
    menu.appendChild(divCat);
  });
}

window.addEventListener('load', carregarMenu);