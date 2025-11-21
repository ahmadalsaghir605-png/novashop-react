import { useEffect, useState } from 'react';

import { Api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: '',
  sku: '',
  stock: 0,
  is_active: 1
};

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const loadProducts = async () => {
    try {
      const data = await Api.fetchProducts();
      setProducts(data);
    } catch (error) {
      setStatus((prev) => ({ ...prev, error: error.message }));
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? Number(checked) : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setStatus({ loading: true, error: '', success: '' });
      if (editingId) {
        await Api.updateProduct(editingId, form, token);
        setStatus({ loading: false, error: '', success: 'Product updated' });
      } else {
        await Api.createProduct(form, token);
        setStatus({ loading: false, error: '', success: 'Product created' });
      }
      setForm(emptyProduct);
      setEditingId(null);
      loadProducts();
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sku: product.sku,
      stock: product.stock,
      is_active: product.is_active
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Archive this product?')) return;
    try {
      await Api.deleteProduct(productId, token);
      setStatus({ loading: false, error: '', success: 'Product archived' });
      loadProducts();
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <section className="grid" style={{ gap: '1.5rem' }}>
      <h1>Products</h1>
      {status.error && <p className="alert error">{status.error}</p>}
      {status.success && <p className="alert success">{status.success}</p>}

      <form className="card grid" style={{ gap: '1rem' }} onSubmit={handleSubmit}>
        <h2>{editingId ? 'Update product' : 'Create product'}</h2>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input name="name" id="name" required value={form.name} onChange={handleChange} />
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" rows="3" value={form.description} onChange={handleChange} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div className="form-control">
            <label htmlFor="price">Price</label>
            <input name="price" id="price" type="number" step="0.01" required value={form.price} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label htmlFor="category">Category</label>
            <input name="category" id="category" value={form.category} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label htmlFor="sku">SKU</label>
            <input name="sku" id="sku" required value={form.sku} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label htmlFor="stock">Stock</label>
            <input name="stock" id="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
          </div>
        </div>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="checkbox" name="is_active" checked={Boolean(form.is_active)} onChange={handleChange} /> Active
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" disabled={status.loading}>
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              className="btn outline"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyProduct);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <h2>Active products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>{product.stock}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn outline" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn outline" onClick={() => handleDelete(product.id)}>
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminProducts;
