import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    description: '',
    image_url: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setError('');
    const { data, error } = await supabase.from('products').select('*');
    if (error) setError('Erro ao carregar produtos');
    setProducts(data || []);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price.toString().replace('.', ','),
      description: product.description || '',
      image_url: product.image_url || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    setError('');
    const price = parseFloat(editForm.price.replace(',', '.')) || 0;
    const { error } = await supabase
      .from('products')
      .update({
        name: editForm.name,
        price,
        description: editForm.description,
        image_url: editForm.image_url
      })
      .eq('id', id);
    if (error) {
      setError('Erro ao salvar alterações');
      toast.error('Erro ao salvar alterações!');
    } else {
      setEditingId(null);
      fetchProducts();
      toast.success('Produto atualizado com sucesso!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    setError('');
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setError('Erro ao excluir produto');
      toast.error('Erro ao excluir produto!');
    } else {
      fetchProducts();
      toast.success('Produto excluído com sucesso!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Editar Produtos</h2>
        <button
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition font-semibold"
          onClick={() => navigate('/home')}
        >
          Voltar
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((prod) => (
          <li
            key={prod.id}
            className="rounded shadow p-4 flex flex-col items-center justify-between"
            style={{ minHeight: 420 }}
          >
            {editingId === prod.id ? (
              <>
                <input
                  className="mb-2 p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400 dark:placeholder-white w-full"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Nome"
                />
                <input
                  className="mb-2 p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400 dark:placeholder-white w-full"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                  placeholder="Preço (ex: 10,99)"
                />
                <textarea
                  className="mb-2 p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400 dark:placeholder-white w-full"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Descrição"
                />
                <input
                  className="mb-2 p-2 rounded-md border-2 border-sky-500 focus:outline-none placeholder-gray-400 dark:placeholder-white w-full"
                  name="image_url"
                  value={editForm.image_url}
                  onChange={handleEditChange}
                  placeholder="Link da imagem"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 font-semibold"
                    onClick={() => handleEditSave(prod.id)}
                  >
                    Salvar
                  </button>
                  <button
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 font-semibold"
                    onClick={() => setEditingId(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="w-32 h-32 object-cover rounded mb-2"
                />
                <div className="font-semibold text-lg mb-1 text-center">{prod.name}</div>
                <div className="text-blue-700 font-bold mb-2">
                  R$ {(prod.price).toFixed(2).replace('.', ',')}
                </div>
                <div className="text-gray-600 mb-2 text-center">{prod.description}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 font-semibold"
                    onClick={() => handleEditClick(prod)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-semibold"
                    onClick={() => handleDelete(prod.id)}
                  >
                    Excluir
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditProducts;