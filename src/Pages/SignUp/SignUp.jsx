import React from 'react'
import { supabase } from '../../supabase-client';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const checkLogged = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) navigate('/home');
        };
        checkLogged();
    }, [navigate]);

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
    });

    function handleChange(event) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                    }
                }
            });
            if (error) {
                alert(error.message);
                return;
            } else {
                alert('Usuário registrado com sucesso!');
                navigate('/home');
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Cadastro
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-3" >
                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="nome"
                                className="block text-sm/6 font-medium text-gray-900">
                                Nome
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="nome"
                                name="name"
                                type="text"
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            required
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                            Registrar
                        </button>
                    </div>
                </form>
                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Já possui uma conta? <Link to={'/'} className="font-semibold text-indigo-600 hover:text-indigo-500">Faça login</Link>
                </p>
            </div>

            
        </div>
    );
};

export default SignUp