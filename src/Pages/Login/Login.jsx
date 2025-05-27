import React from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleSubmit = () => {
    e.preventDefault();
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

        <button className="register-button">Registrar-se</button>
      </div>
    </div>
  );
};

export default Login;
