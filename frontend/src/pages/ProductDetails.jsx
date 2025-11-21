import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await Api.fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadProduct();
  }, [id]);

  if (error) {
    return <p className="alert error">{error}</p>;
  }

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <article className="card">
      <h1>{product.name}</h1>
      <p style={{ color: '#4b5563' }}>{product.description}</p>
      <p>
        <strong>${Number(product.price).toFixed(2)}</strong>
      </p>
      <p>Category: {product.category}</p>
      <p>Stock: {product.stock}</p>
      <button className="btn" onClick={() => addToCart(product)}>
        Add to cart
      </button>
    </article>
  );
};

export default ProductDetails;
