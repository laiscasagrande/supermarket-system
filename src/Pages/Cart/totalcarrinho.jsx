import React from 'react';

const TotalCarrinho = ({ itensDoCarrinho }) => {
  const valorTotal = itensDoCarrinho.reduce(
    (acumulador, item) => acumulador + (item.produto?.preco || 0) * (item.quantidade || 1),
    0
  );

  return (
    <div>
      <h3>Resumo do Carrinho</h3>
      {itensDoCarrinho.length === 0 ? (
        <p>Seu carrinho está vazio!</p>
      ) : (
        <h4>Valor Total: R$ {valorTotal.toFixed(2)}</h4>
      )}
    </div>
  );
};

const Cart = ({ itensDoCarrinho }) => {
  return (
    <div>
      <h2>Carrinho de Compras</h2>
      <p>Aqui você pode ver os itens que adicionou ao seu carrinho.</p>
      {itensDoCarrinho.length === 0 ? (
        <p>Nenhum item no carrinho.</p>
      ) : (
        <div>
          {itensDoCarrinho.map((item, indice) => (
            <div key={indice}>
              <span>{item.produto.name} (x{item.quantidade})</span>
              <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      <TotalCarrinho itensDoCarrinho={itensDoCarrinho} />
      <button>Finalizar Compra</button>
    </div>
  );
};

export default Cart;
