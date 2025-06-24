import React from "react";
import { supabase } from '../../supabase-client';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
            toast.error('Erro ao adicionar produto: ' + error.message);
        } else {
            setItemName("");
            setItemPrice("");
            setItemDescription("");
            setItemImage("");
            toast.success('Produto adicionado com sucesso!');
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Cadastro de produto</h2>
                <button
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition font-semibold"
                    onClick={() => navigate('/home')}
                >
                    Voltar
                </button>
            </div>
            <div className="rounded shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Cadastro de produtos a serem disponibilizados para compra</h3>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(addProduct)}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col flex-1">
                            <input
                                className="w-full p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400"
                                type='text'
                                placeholder='Nome do produto...'
                                {...register('itemName')}
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                            {errors.itemName && <span className="text-red-500">{errors.itemName.message}</span>}
                        </div>
                        <div className="flex flex-col w-full sm:w-40">
                            <input
                                className="w-full p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400"
                                type='text'
                                placeholder='Preço (ex: 10,99)'
                                {...register('itemPrice')}
                                value={itemPrice}
                                onChange={(e) => setItemPrice(e.target.value)}
                            />
                            {errors.itemPrice && <span className="text-red-500">{errors.itemPrice.message}</span>}
                        </div>
                    </div>
                    <textarea
                        className="w-full p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400"
                        placeholder='Descrição'
                        {...register('itemDescription')}
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                    />
                    {errors.itemDescription && <span className="text-red-500">{errors.itemDescription.message}</span>}
                    <input
                        className="w-full p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400"
                        type='text'
                        placeholder='Link da imagem'
                        {...register('itemImage')}
                        value={itemImage}
                        onChange={(e) => setItemImage(e.target.value)}
                    />
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-40 rounded-md bg-green-500 p-2 flex justify-center text-white hover:bg-green-600 transition font-semibold"
                        >
                            Adicionar Produto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateItem;