import { useState } from 'react';

import { Api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: ''
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cart.length) {
      setStatus({ loading: false, error: 'Cart is empty', success: '' });
      return;
    }

    try {
      setStatus({ loading: true, error: '', success: '' });
      const payload = {
        ...form,
        cart: cart.map((item) => ({ productId: item.productId, quantity: item.qty }))
      };
      const response = await Api.checkout(payload, token);
      clearCart();
      setStatus({ loading: false, error: '', success: `Order #${response.orderId} created. Total $${response.total}` });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <section className="card">
      <h2>Checkout</h2>
      {status.error && <p className="alert error">{status.error}</p>}
      {status.success && <p className="alert success">{status.success}</p>}
      <form onSubmit={handleSubmit} className="grid" style={{ gap: '1rem' }}>
        <div className="form-control">
          <label htmlFor="customer_name">Name</label>
          <input
            name="customer_name"
            id="customer_name"
            required
            value={form.customer_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="customer_email">Email</label>
          <input
            type="email"
            name="customer_email"
            id="customer_email"
            required
            value={form.customer_email}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="customer_phone">Phone</label>
          <input
            name="customer_phone"
            id="customer_phone"
            required
            value={form.customer_phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Items: {cart.length}</p>
          <p>Total: ${cartTotal.toFixed(2)}</p>
        </div>
        <button className="btn" type="submit" disabled={status.loading}>
          {status.loading ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </section>
  );
};

export default Checkout;
