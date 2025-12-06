let carrinho = [];
let total = 0;

function adicionarAoCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  total += preco;
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const itensCarrinho = document.getElementById('itens-carrinho');
  itensCarrinho.innerHTML = '';
  carrinho.forEach((item, index) => {
    const p = document.createElement('p');
    p.innerHTML = `${item.nome} - R$ ${item.preco.toFixed(2)} <button onclick="removerItem(${index})">Remover</button>`;
    itensCarrinho.appendChild(p);
  });
  document.getElementById('total').textContent = `Total: R$ ${total.toFixed(2)}`;
  document.getElementById('carrinho').style.display = carrinho.length > 0 ? 'block' : 'none';
}

function removerItem(index) {
  total -= carrinho[index].preco;
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

document.getElementById('finalizar').addEventListener('click', () => {
  document.getElementById('form-pedido').style.display = 'block';
});

document.getElementById('form-pedido').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const endereco = document.getElementById('endereco').value;
  const observacoes = document.getElementById('observacoes').value;
  
  const pedido = {
    itens: carrinho,
    total,
    cliente: { nome, telefone, endereco, observacoes }
  };
  
  // Aqui você pode enviar o pedido pro WhatsApp, email ou backend
  alert(`Pedido enviado! Detalhes: ${JSON.stringify(pedido)}`);
  // Exemplo real: window.location.href = `https://wa.me/SEU_NUMERO?text=${encodeURIComponent(JSON.stringify(pedido))}`;
  
  // Limpa carrinho
  carrinho = [];
  total = 0;
  atualizarCarrinho();
  document.getElementById('form-pedido').style.display = 'none';
});