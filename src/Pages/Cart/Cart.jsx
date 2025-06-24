import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaTrash } from "react-icons/fa";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      const { data } = await supabase
        .from('cart')
        .select('id, product_id, quantity, products(name, price, image_url)')
        .eq('user_id', userData.user.id);
      setCartItems(data || []);
    };
    fetchCart();
  }, []);

  const checkoutItems = async () => {
    navigate('/checkout');
  };

  const navigateHome = () => {
    navigate('/home');
  };

  const increaseQuantity = async (item) => {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: item.quantity + 1 })
      .eq('id', item.id)
      .select();
    if (!error && data) {
      setCartItems(cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    }
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity === 1) {
      if (window.confirm('Você vai remover a última unidade, tem certeza?')) {
        await supabase.from('cart').delete().eq('id', item.id);
        setCartItems(cartItems.filter(i => i.id !== item.id));
      }
    } else {
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: item.quantity - 1 })
        .eq('id', item.id)
        .select();
      if (!error && data) {
        setCartItems(cartItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
      }
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + (item.products?.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Seu Carrinho</h2>
        <button
          onClick={navigateHome}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition font-semibold"
        >
          <FaArrowLeft />
          Voltar
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {cartItems.length === 0 ? (
          <li className="col-span-full text-center text-gray-600 backdrop-blur-md rounded shadow p-8">
            Você ainda não tem nada no carrinho, adicione algo primeiro.
          </li>
        ) : (
          cartItems.map(item => (
            <li
              key={item.id}
              className="backdrop-blur-md rounded shadow p-4 flex flex-col items-center justify-between"
              style={{ minHeight: 420 }}
            >
              <img
                src={item.products?.image_url}
                alt={item.products?.name}
                className="w-48 h-48 object-cover rounded mb-4"
              />
              <div className="font-semibold text-lg mb-1 text-center">{item.products?.name}</div>
              <div className="text-blue-700 font-bold mb-2">
                R$ {(item.products?.price || 0).toFixed(2).replace('.', ',')}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => decreaseQuantity(item)}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg font-bold text-gray-800"
                >-</button>
                <span className="font-semibold text-lg mb-1 text-center">{item.quantity || 1}</span>
                <button
                  onClick={() => increaseQuantity(item)}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg font-bold text-gray-800"
                >+</button>
              </div>
              <button
                onClick={() => decreaseQuantity({ ...item, quantity: 1 })}
                className="flex items-center gap-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition font-semibold mb-2"
              >
                <FaTrash />
                Remover item
              </button>
            </li>
          ))
        )}
      </ul>
      {cartItems.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-xl font-bold">
            Total: <span className="text-blue-700">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <button
            onClick={checkoutItems}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold w-full sm:w-auto"
          >
            Finalizar compra
          </button>
        </div>
      )}
    </div>
  );
}