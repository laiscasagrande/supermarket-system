import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Checkout() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [parcelas, setParcelas] = useState(1);
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
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
    toast.success(`Compra confirmada via ${metodoPagamento.toUpperCase()}${metodoPagamento === 'credito' ? ` em ${parcelas}x de R$ ${calcularParcela()} sem juros!` : ` no valor de R$ ${total.toFixed(2).replace('.', ',')}`}`);
    navegar('/home');
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Finalizar Compra</h2>
        <button
          onClick={() => navegar('/home')}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition font-semibold"
        >
          Voltar
        </button>
      </div>
      {itensCarrinho.length === 0 ? (
        <div className="text-center text-gray-600 rounded shadow p-8">
          Carrinho vazio.
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {itensCarrinho.map(item => (
              <li key={item.id} className="rounded shadow p-4 flex flex-col items-center gap-4">
                <img
                  src={item.products?.image_url}
                  alt={item.products?.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="w-full flex flex-col items-center">
                  <div className="font-semibold text-lg text-center">{item.products?.name}</div>
                  <div className="text-blue-700 font-bold text-center">
                    R$ {item.products?.price.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-gray-600 text-center">Qtd: {item.quantity}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded shadow p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Total: R$ {total.toFixed(2).replace('.', ',')}
            </h3>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
              <label className="font-medium">Método de pagamento:</label>
              <select
                value={metodoPagamento}
                onChange={(e) => {
                  setMetodoPagamento(e.target.value);
                  if (e.target.value !== 'credito') setParcelas(1);
                }}
                className="border rounded px-2 py-1 text-gray-400"
              >
                <option value="pix">PIX</option>
                <option value="debito">Cartão de Débito</option>
                <option value="credito">Cartão de Crédito</option>
              </select>
              {metodoPagamento === 'credito' && (
                <>
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
                </>
              )}
            </div>

            <p className="text-center mt-2 text-gray-700">
              {metodoPagamento === 'credito'
                ? <>Valor por parcela: <b>R$ {calcularParcela()}</b> (sem juros)</>
                : <>Valor total: <b>R$ {total.toFixed(2).replace('.', ',')}</b></>
              }
            </p>

            <div className="flex flex-col sm:flex-row justify-center mt-6 gap-4">
              <button
                onClick={confirmarCompra}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold w-full sm:w-auto"
              >
                Confirmar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}