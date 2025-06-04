import React from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleSubmit = () => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">SuperMarket-System</h2>
        <p className="mt-2 text-center text-sm/6 text-gray-600">
          Entre com sua conta ou registre-se
        </p>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                      id="email"
                      name="email"
                      type="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
              />
            </div>
          </div>
      <div>
        <div className="flex items-center justify-between">
          <label 
            htmlFor="senha" 
            className="block text-sm/6 font-medium text-gray-900">
            Senha
          </label>
          <div className="text-sm/6">
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Esqueci minha senha
            </a>
          </div>
        </div>
          <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />  
          </div>
        </div>
        <div>
            <button 
              type="submit" 
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              Entrar
            </button>
        </div>
        </form>
        
       </div>
        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">Ou</span>
          <div className="divider-line"></div>
        </div>

        <button 
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Registrar-se</button>
      </div>

  );
};

export default Login;
