import React from "react";
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    // Se já está logado, redireciona para home
    const checkLogged = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) navigate('/home');
    };
    checkLogged();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) {
        alert(error.message);
        return;
      } else {
        if (setToken) setToken(data);
        navigate('/home');
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">SuperMarket-System</h2>
        <p className="login-subtitle">Faça login para continuar</p>

        <form onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Senha</label>
          <input
            type="password"
            className="login-input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">Ou</span>
          <div className="divider-line"></div>
        </div>

        <button className="register-button" onClick={handleRegister}>
          Registrar-se
        </button>
      </div>
    </div>
  );
};

export default Login;