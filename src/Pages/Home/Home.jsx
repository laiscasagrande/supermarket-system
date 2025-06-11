import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const registerProduct = useNavigate();

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

  const navigateToRegisterProduct = () => {
    registerProduct('/createitem')
  }

  return (
    <div>
      <div>
        {userId ? (
          <>
            Bem vindo de volta, <b>{userName}</b>
            <button onClick={handleLogout}>Sair</button>
            <button onClick={navigateCart}>Carrinho</button>
            <button onClick={navigateToRegisterProduct}>Cadastro de produto</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/')}>Login</button>
            <button onClick={() => navigate('/signup')}>Cadastro</button>
          </>
        )}
      </div>
      <h2>Produtos</h2>
      <ul>
        {products.map(prod => (
          <li key={prod.id}>
            <img src={prod.image_url} alt={prod.name} style={{width: 280, height: 280, objectFit: 'cover'}} />
            <div>
              <b>{prod.name}</b> - R$ {(prod.price).toFixed(2).replace('.', ',')}
            </div>
            <div>{prod.description}</div>
            <button onClick={() => addToCart(prod.id)}>Adicionar ao carrinho</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;