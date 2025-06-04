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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='Nome Completo'
                    name='name'
                    onChange={handleChange}
                />
                <input
                    placeholder='Email'
                    name='email'
                    onChange={handleChange}
                />
                <input
                    placeholder='Senha'
                    name='password'
                    type='password'
                    onChange={handleChange}
                />
                <button type='submit'>
                    Registrar
                </button>
            </form>
            <p>
                Já tem uma conta? <Link to={'/'}>Faça login</Link>
            </p>
        </div>
    )
}

export default SignUp