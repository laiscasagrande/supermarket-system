import React from "react";
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
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
        toast.error(error.message);
        return;
      } else {
        if (setToken) setToken(data);
        navigate('/home');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              {/* <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                SUPER MARKET
              </h1> */}
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Acesse sua conta
              </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900">
                    Email
                  </label>
                </div>
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
            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Ainda não possui uma conta?{' '}
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500"
                onClick={handleRegister}>
                  Criar conta
                </a>
              </p>
          </div>

        </div>

    </div>
  );
};

export default Login;