import React from "react";
import { supabase } from '../../supabase-client';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const CreateItem = () => {
    const [itemName, setItemName] = React.useState("");
    const [itemPrice, setItemPrice] = React.useState("");
    const [itemDescription, setItemDescription] = React.useState("");
    const [itemImage, setItemImage] = React.useState("");
    const navigate = useNavigate();

    const registerProductSchema = z.object({
        itemName: z.string().min(1, 'O nome do produto é obrigatório'),
        itemPrice: z.string().min(1, 'O preço do produto é obrigatório'),
        itemDescription: z.string().min(1, 'A descrição do produto é obrigatória'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerProductSchema)
    })

    const addProduct = async () => {
        const price = parseFloat(itemPrice.replace(',', '.')) || 0;
        const newProduct = {
            name: itemName,
            price,
            description: itemDescription,
            image_url: itemImage,
        };
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) {
            alert('Erro ao adicionar produto: ' + error.message);
        } else {
            setItemName("");
            setItemPrice("");
            setItemDescription("");
            setItemImage("");
            alert('Produto cadastrado!');
        }
    }

    return (
        <main>
            <section className="flex items-start flex-col p-5 gap-2">
                <h1 className="text-blue-700 font-bold text-3xl">Cadastro de produto</h1>
                <h2 className="">Cadastro de produtos a serem disponibilizados para compra</h2>
            </section>
            <form className="flex flex-col items-start p-5" onSubmit={handleSubmit(addProduct)}>
                <article className="flex gap-5">
                    <div className="flex flex-col items-start">
                        <input
                            className="w-[20rem] p-2 rounded-md border-2 border-sky-500 focus:outline-none"
                            type='text'
                            placeholder='Nome do produto...'
                            {...register('itemName')}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        {errors.itemName && <span className="text-red-500">{errors.itemName.message}</span>}
                    </div>
                    <div className="flex flex-col">
                        <input
                            className="w-[10rem] p-2 rounded-md border-2 border-sky-500 focus:outline-none"
                            type='text'
                            placeholder='Preço (ex: 10,99)'
                            {...register('itemPrice')}
                            onChange={(e) => setItemPrice(e.target.value)}
                        />
                        {errors.itemPrice && <span className="text-red-500">{errors.itemPrice.message}</span>}
                    </div>
                </article>
                <textarea
                    className="w-[31.3rem] p-2 rounded-md border-2 border-sky-500 mt-5 focus:outline-none"
                    type='text'
                    placeholder='Descrição'
                    {...register('itemDescription')}
                    onChange={(e) => setItemDescription(e.target.value)}
                />
                {errors.itemDescription && <span className="text-red-500">{errors.itemDescription.message}</span>}
                <input
                    className="w-[15rem] p-2 rounded-md border-2 border-sky-500 mt-5 focus:outline-none"
                    type='text'
                    placeholder='Link da imagem'
                    {...register('itemImage')}
                    onChange={(e) => setItemImage(e.target.value)}
                />
                <button type="submit" className="w-[10rem] rounded-md bg-sky-500 p-2 flex justify-center mt-5 text-white hover:bg-blue-600 transition">
                    Adicionar Produto
                </button>
                <button
                    className="w-[10rem] rounded-md bg-sky-500 p-2 flex justify-center mt-5 text-white hover:bg-blue-600 transition"
                    onClick={() => navigate('/home')}
                >
                    Voltar
                </button>
            </form>
        </main>
    )
}

export default CreateItem