import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        const data = await Api.fetchProducts(params);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const handleChange = (event) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      <div className="card">
        <h2>Filter</h2>
        <div className="form-control">
          <label htmlFor="search">Search</label>
          <input
            name="search"
            id="search"
            placeholder="Product name or SKU"
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="category">Category</label>
          <input
            name="category"
            id="category"
            placeholder="e.g. Electronics"
            value={filters.category}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h2>Products</h2>
        {loading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="grid products">
            {products.map((product) => (
              <article key={product.id} className="card product-card">
                <h3>{product.name}</h3>
                <p>{product.description?.slice(0, 80)}</p>
                <p style={{ fontWeight: 700 }}>${Number(product.price).toFixed(2)}</p>
                <small>SKU: {product.sku}</small>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link className="btn outline" to={`/products/${product.id}`}>
                    View
                  </Link>
                  <button className="btn" onClick={() => addToCart(product)}>
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
