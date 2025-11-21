import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await Api.fetchProducts();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>NovaShop</h1>
        <p>Modern storefront starter kit with Express, MySQL and React.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link className="btn" to="/products">
            Shop Products
          </Link>
          <Link className="btn outline" to="/admin">
            Admin Portal
          </Link>
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Featured products</h2>
          <Link to="/products">View all</Link>
        </div>
        {loading ? (
          <p>Loading latest inventory...</p>
        ) : (
          <div className="grid products">
            {products.map((product) => (
              <article key={product.id} className="card product-card">
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{product.category}</p>
                <h3>{product.name}</h3>
                <p>${Number(product.price).toFixed(2)}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link className="btn outline" to={`/products/${product.id}`}>
                    Details
                  </Link>
                  <button className="btn" onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
