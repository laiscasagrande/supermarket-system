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
    <div>
        <h2>Seu Carrinho</h2>
        {cartItems.length === 0 ? (
        <p>Você ainda não tem nada no carrinho, adicione algo primeiro.</p>
        ) : (
        <>
            <ul>
            {cartItems.map(item => (
                <li key={item.id}>
                <img src={item.products?.image_url} alt={item.products?.name} style={{width: 250, height: 250, objectFit: 'cover'}} />
                {item.products?.name} - R$ {item.products?.price}
                <div>
                    <button onClick={() => decreaseQuantity(item)}>-</button>
                    {item.quantity || 1}
                    <button onClick={() => increaseQuantity(item)}>+</button>
                </div>
                </li>
            ))}
            </ul>
            <h3>Total: R$ {total.toFixed(2)}</h3>
            <button onClick={checkoutItems}>Finalizar compra</button>
        </>
        )}
        <button onClick={navigateHome}>Voltar</button>
    </div>
    );
}