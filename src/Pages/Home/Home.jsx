import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { FaShoppingCart } from "react-icons/fa";
import { toast } from 'react-toastify';

const DESCRIPTION_LIMIT = 100;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
    };
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUserId(userData.user.id);
      } else {
        setUserId(null);
      }
    };
    fetchProducts();
    fetchUser();
  }, []);

  const addToCart = async (productId) => {
    if (!userId) {
      return;
    }
    const { data } = await supabase
      .from('cart')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (data) {
      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity: data.quantity + 1 })
        .eq('id', data.id);
      if (updateError) {
        toast.error('Erro ao atualizar quantidade: ' + updateError.message);
      } else {
        toast.success('Quantidade aumentada no carrinho!');
      }
    } else {
      const { error: insertError } = await supabase
        .from('cart')
        .insert([{ product_id: productId, user_id: userId, quantity: 1 }]);
      if (insertError) {
        toast.error('Erro ao adicionar ao carrinho: ' + insertError.message);
      } else {
        toast.success('Adicionado ao carrinho!');
      }
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Produtos</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(prod => (
          <li
            key={prod.id}
            className="rounded shadow p-4 flex flex-col items-center justify-between"
            style={{ minHeight: 420 }}
          >
            <img
              src={prod.image_url}
              alt={prod.name}
              className="w-48 h-48 object-cover rounded mb-4"
            />
            <div className="font-semibold text-lg mb-1 text-center">{prod.name}</div>
            <div className="text-blue-700 font-bold mb-2">
              R$ {(prod.price).toFixed(2).replace('.', ',')}
            </div>
            <div className="text-gray-600 mb-4 text-center" style={{ minHeight: 48 }}>
              {prod.description && prod.description.length > DESCRIPTION_LIMIT && !expanded[prod.id] ? (
                <>
                  {prod.description.slice(0, DESCRIPTION_LIMIT)}...
                  <button
                    className="text-blue-500 underline ml-1"
                    onClick={() => toggleExpand(prod.id)}
                    style={{ fontSize: 13 }}
                  >
                    Ler mais
                  </button>
                </>
              ) : prod.description && prod.description.length > DESCRIPTION_LIMIT && expanded[prod.id] ? (
                <>
                  {prod.description}
                  <button
                    className="text-blue-500 underline ml-1"
                    onClick={() => toggleExpand(prod.id)}
                    style={{ fontSize: 13 }}
                  >
                    Mostrar menos
                  </button>
                </>
              ) : (
                prod.description
              )}
            </div>
            <div className="flex flex-1 items-end w-full">
              <button
                onClick={() => addToCart(prod.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer w-full flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                Adicionar ao carrinho
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;