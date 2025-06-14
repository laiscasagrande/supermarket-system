import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSignOutAlt, FaEdit, FaMoon } from "react-icons/fa";

const DESCRIPTION_LIMIT = 100;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [expanded, setExpanded] = useState({});
  
  const getInitialDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
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

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

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

  const navigateToRegisterProduct = () => {
    navigate('/createitem');
  };

  const navigateToEditProducts = () => {
    navigate('/edititem');
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div
        className={`flex items-center justify-between p-4 bg-white shadow ${darkMode ? 'dark:bg-gray-800 dark:text-white' : ''}`}
        style={{ minHeight: 70 }}
      >
        <div className="flex-1 flex items-center">
          {userId && (
            <span className="font-semibold">
              Bem vindo de volta, <b>{userName}</b>
            </span>
          )}
        </div>
        <div className="flex-1 flex justify-center gap-4">
          {userId && (
            <>
              <button
                onClick={navigateCart}
                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer"
                title="Carrinho"
              >
                <FaShoppingCart />
                Carrinho
              </button>
              <button
                onClick={navigateToRegisterProduct}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
              >
                Cadastro de produto
              </button>
              <button
                onClick={navigateToEditProducts}
                className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition cursor-pointer"
                title="Editar produtos"
              >
                <FaEdit />
                Editar produtos
              </button>
            </>
          )}
        </div>
        <div className="flex-1 flex justify-end items-center gap-3">
          {userId && (
            <>
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`flex items-center gap-2 px-2 py-1 rounded transition cursor-pointer ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                title="Alternar modo escuro/claro"
                style={{ minWidth: 60 }}
              >
                <FaMoon color={darkMode ? "#FFD600" : "#6B7280"} size={20} />
                <span className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode((prev) => !prev)}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <span
                    className={`block w-10 h-5 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-400'} transition`}
                  ></span>
                  <span
                    className={`dot absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition ${darkMode ? 'translate-x-5' : ''}`}
                    style={{
                      transition: 'transform 0.2s',
                      transform: darkMode ? 'translateX(0px)' : 'translateX(0)'
                    }}
                  ></span>
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                title="Sair"
              >
                Sair
                <FaSignOutAlt />
              </button>
            </> 
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Produtos</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(prod => (
            <li
              key={prod.id}
              className={`bg-white rounded shadow p-4 flex flex-col items-center justify-between ${darkMode ? 'dark:bg-gray-800 dark:text-white' : ''}`}
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
    </div>
  );
};

export default Home;