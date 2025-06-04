import React from 'react'
import { supabase } from '../../supabase-client';

const CreateItem = () => {
    const [itemName, setItemName] = React.useState("");
    const [itemPrice, setItemPrice] = React.useState("");
    const [itemDescription, setItemDescription] = React.useState("");
    const [itemImage, setItemImage] = React.useState("");

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
        <div>
            <input
                type='text'
                placeholder='Nome do produto...'
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <br />
            <input
                type='text'
                placeholder='Preço (ex: 10,99)'
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
            />
            <br />
            <input
                type='text'
                placeholder='Descrição'
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
            />
            <br />
            <input
                type='text'
                placeholder='Link da imagem'
                value={itemImage}
                onChange={(e) => setItemImage(e.target.value)}
            />
            <br />
            <button onClick={addProduct}>
                Adicionar Produto
            </button>
        </div>
    )
}

export default CreateItem