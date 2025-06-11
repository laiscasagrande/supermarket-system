import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      setUserId(userData.user.id);
      const { data } = await supabase
        .from('cart')
        .select('id, product_id, quantity, products(name, price, image_url)')
        .eq('user_id', userData.user.id);
      setCartItems(data || []);
    };
    fetchCart();
  }, []);

  const checkoutItems = async () => {
    if (!userId) return;
    await supabase.from('cart').delete().eq('user_id', userId);
    setCartItems([]);
    alert('Compra finalizada!');
    navigate('/home');
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
        <div className="w-full max-w-3xl bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Seu Carrinho</h2>
            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600 mb-6">
                    Você ainda não tem nada no carrinho, adicione algo primeiro.
                </p>
            ) : (
                <>
                    <ul className="space-y-6 mb-6">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4">
                                <img
                                    src={item.products?.image_url}
                                    alt={item.products?.name}
                                    className="w-32 h-32 object-cover rounded shadow"
                                />
                                
                                <div className="flex-1 flex flex-col items-center sm:items-start">
                                    <button class=" end-4 top-4 text-gray-600 transition hover:scale-110">
                                        <span class="sr-only">Close cart</span>

                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke-width="1.5"
                                          stroke="currentColor"
                                          class="size-5"
                                        >
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    <div className="font-semibold text-lg">{item.products?.name}</div>
                                    <div className="text-blue-700 font-bold mb-2">
                                        R$ {(item.products?.price || 0).toFixed(2).replace('.', ',')}
                                    </div>
                                     
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => decreaseQuantity(item)}
                                            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-lg font-bold"
                                        >-</button>
                                        <span className="mx-2 text-lg">{item.quantity || 1}</span>
                                        <button
                                            onClick={() => increaseQuantity(item)}
                                            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-lg font-bold"
                                        >+</button>

                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Total:</h3>
                        <span className="text-xl font-bold text-green-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button
                        onClick={checkoutItems}
                        className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 transition mb-4"
                    >
                        Finalizar compra
                    </button>
                </>
            )}
            <button
                onClick={navigateHome}
                className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
            >
                Voltar
            </button>
        </div>
    </div>
    );
}