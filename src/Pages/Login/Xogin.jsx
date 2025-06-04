import React from 'react'
import { supabase } from '../../supabase-client';
import { Link, useNavigate } from 'react-router-dom';

const Xogin = ({ setToken }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    React.useEffect(() => {
        const checkLogged = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) navigate('/home');
        };
        checkLogged();
    }, [navigate]);

    function handleChange(event) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            if (error) {
                alert(error.message);
                return;
            } else {
                setToken(data);
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
                    Login
                </button>
            </form>
            <p>
                Não tem uma conta? <Link to={'/signup'}>Faça cadastro</Link>
            </p>
        </div>
    )
}

export default Xogin