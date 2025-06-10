import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
    };
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUserId(userData.user.id);
        setUserName(userData.user.user_metadata?.name || userData.user.email || '');
      } else {
        setUserId(null);
        setUserName('');
      }
    };
    fetchProducts();
    fetchUser();
  }, []);

  const addToCart = async (productId) => {
    if (!userId) {
      navigate('/');
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
        alert('Erro ao atualizar quantidade: ' + updateError.message);
      } else {
        alert('Quantidade aumentada no carrinho!');
      }
    } else {
      const { error: insertError } = await supabase
        .from('cart')
        .insert([{ product_id: productId, user_id: userId, quantity: 1 }]);
      if (insertError) {
        alert('Erro ao adicionar ao carrinho: ' + insertError.message);
      } else {
        alert('Adicionado ao carrinho!');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const navigateCart = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        {userId ? (
          <div className="flex items-center gap-4">
            <span>
              Bem vindo de volta, <b>{userName}</b>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Sair
            </button>
            <button
              onClick={navigateCart}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Carrinho
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
            >
              Cadastro
            </button>
          </div>
        )}
      </div>
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Produtos</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(prod => (
            <li key={prod.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
              <img
                src={prod.image_url}
                alt={prod.name}
                className="w-48 h-48 object-cover rounded mb-4"
              />
              <div className="font-semibold text-lg mb-1">{prod.name}</div>
              <div className="text-blue-700 font-bold mb-2">
                R$ {(prod.price).toFixed(2).replace('.', ',')}
              </div>
              <div className="text-gray-600 mb-4 text-center">{prod.description}</div>
              <button
                onClick={() => addToCart(prod.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Adicionar ao carrinho
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;