import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../supabase-client';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const getInitialDarkMode = () => {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) return saved === 'true';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const MainLayout = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <Header
        userId={userId}
        userName={userName}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleLogout={handleLogout}
      />
      <div className="max-w-5xl mx-auto py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;