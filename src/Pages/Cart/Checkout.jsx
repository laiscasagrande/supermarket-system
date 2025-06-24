import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Checkout() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [parcelas, setParcelas] = useState(1);
  const [metodoPagamento, setMetodoPagamento] = useState('pix'); // Novo estado
  const navegar = useNavigate();

  useEffect(() => {
    const buscarCarrinho = async () => {
      const { data: dadosUsuario } = await supabase.auth.getUser();
      if (!dadosUsuario?.user) return;
      setUsuarioId(dadosUsuario.user.id);

      const { data } = await supabase
        .from('cart')
        .select('id, product_id, quantity, products(name, price, image_url)')
        .eq('user_id', dadosUsuario.user.id);
      setItensCarrinho(data || []);
    };
    buscarCarrinho();
  }, []);

  const total = itensCarrinho.reduce(
    (acumulador, item) => acumulador + (item.products?.price || 0) * (item.quantity || 1),
    0
  );

  const calcularParcela = () => {
    return (total / parcelas).toFixed(2).replace('.', ',');
  };

  const confirmarCompra = async () => {
    await supabase.from('cart').delete().eq('user_id', usuarioId);
    setItensCarrinho([]);
    toast.success(`Compra confirmada via ${metodoPagamento.toUpperCase()} em ${parcelas}x de R$ ${calcularParcela()} sem juros!`);
    navegar('/home');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Seu Carrinho</h2>
      {itensCarrinho.length === 0 ? (
        <p className="text-center text-gray-500">Carrinho vazio.</p>
      ) : (
        <>
          <ul className="space-y-4 max-w-3xl mx-auto">
            {itensCarrinho.map(item => (
              <li key={item.id} className="bg-white rounded shadow p-4 flex items-center gap-4">
                <img
                  src={item.products?.image_url}
                  alt={item.products?.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <div className="font-semibold text-lg">{item.products?.name}</div>
                  <div className="text-blue-700 font-bold">
                    R$ {item.products?.price.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-gray-600">Qtd: {item.quantity}</div>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold text-center mt-6">
            Total: R$ {total.toFixed(2).replace('.', ',')}
          </h3>

          <div className="flex justify-center mt-4 items-center gap-2">
            <label className="font-medium">Parcelar em:</label>
            <select
              value={parcelas}
              onChange={(e) => setParcelas(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(numero => (
                <option key={numero} value={numero}>{numero}x</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mt-4 items-center gap-2">
            <label className="font-medium">Método de pagamento:</label>
            <select
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="pix">PIX</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>

          <p className="text-center mt-2 text-gray-700">
            Valor por parcela: <b>R$ {calcularParcela()}</b> (sem juros)
          </p>

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={confirmarCompra}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Confirmar compra
            </button>
            <button
              onClick={() => navegar('/home')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Voltar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
