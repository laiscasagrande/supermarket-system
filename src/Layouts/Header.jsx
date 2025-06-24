import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoon } from "react-icons/fa";

const Header = ({
  userId,
  userName,
  darkMode,
  setDarkMode,
  handleLogout
}) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div
      className={`flex flex-wrap items-center justify-between p-4 shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
      style={{ minHeight: 70 }}
    >
      <div className="flex-1 flex items-center min-w-[180px]">
        {userId && (
          <span className="font-semibold text-sm sm:text-base">
            Bem vindo de volta, <br className="block sm:hidden" />
            <b>{userName}</b>
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition cursor-pointer text-sm"
          title="Home"
        >
          Home
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition cursor-pointer text-sm"
          title="Carrinho"
        >
          Carrinho
        </button>
        <button
          onClick={() => navigate('/createitem')}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition cursor-pointer text-sm"
        >
          Cadastro de produto
        </button>
        <button
          onClick={() => navigate('/edititem')}
          className="flex items-center gap-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition cursor-pointer text-sm"
          title="Editar produtos"
        >
          Editar produtos
        </button>
      </div>
      <div className="flex-1 flex justify-end items-center gap-2 min-w-[120px]">
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
              className={`dot absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition`}
              style={{
                transition: 'transform 0.2s',
                transform: darkMode ? 'translateX(20px)' : 'translateX(0px)'
              }}
            ></span>
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer text-sm"
          title="Sair"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Header;