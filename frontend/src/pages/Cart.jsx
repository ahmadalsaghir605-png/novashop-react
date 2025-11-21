import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const buildNamePieces = (fullName = '') => {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { first: '', last: '' };
  }
  const [first, ...rest] = trimmed.split(' ');
  return { first, last: rest.join(' ') };
};

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useCart();
  const { token, user } = useAuth();
  const namePieces = useMemo(() => buildNamePieces(user?.name || ''), [user?.name]);
  const [form, setForm] = useState({
    firstName: namePieces.first,
    lastName: namePieces.last,
    email: user?.email || '',
    phone: '',
    address: '',
    building: '',
    floor: '',
    postalCode: '',
    paymentMethod: 'cash'
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      firstName: namePieces.first,
      lastName: namePieces.last,
      email: user?.email || prev.email
    }));
  }, [namePieces.first, namePieces.last, user?.email]);

  if (!cart.length) {
    return (
      <div className="card">
        {status.success ? (
          <>
            <p className="alert success" style={{ marginBottom: '1rem' }}>
              {status.success}
            </p>
            <p>Your cart is empty. Add new items whenever you are ready.</p>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
        <Link className="btn" to="/products">
          Browse products
        </Link>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      setStatus({ loading: false, error: 'Add items to your cart before checking out.', success: '' });
      return;
    }

    if (form.paymentMethod !== 'cash') {
      setStatus({
        loading: false,
        error: 'Card payments are temporarily disabled while we finalize the bank address.',
        success: ''
      });
      return;
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'building', 'floor', 'postalCode'];
    const missingField = requiredFields.find((field) => !form[field]?.trim());
    if (missingField) {
      setStatus({ loading: false, error: 'Please complete all checkout fields.', success: '' });
      return;
    }

    try {
      setStatus({ loading: true, error: '', success: '' });
      const payload = {
        customer_name: form.firstName.trim(),
        customer_last_name: form.lastName.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim(),
        customer_address: form.address.trim(),
        building: form.building.trim(),
        floor: form.floor.trim(),
        postal_code: form.postalCode.trim(),
        payment_method: form.paymentMethod,
        cart: cart.map((item) => ({ productId: item.productId, quantity: item.qty }))
      };

      const response = await Api.checkout(payload, token);
      clearCart();
      setForm((prev) => ({
        ...prev,
        phone: '',
        address: '',
        building: '',
        floor: '',
        postalCode: '',
        paymentMethod: 'cash'
      }));
      setStatus({
        loading: false,
        error: '',
        success: `Order #${response.orderId} created. Total $${Number(response.total).toFixed(2)}.`
      });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' });
    }
  };

  return (
    <section className="grid" style={{ gap: '1.5rem' }}>
      <div className="card">
        <h2>Your cart</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(event) => updateQty(item.productId, Number(event.target.value))}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>${Number(item.price * item.qty).toFixed(2)}</td>
                <td>
                  <button className="btn outline" onClick={() => removeFromCart(item.productId)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <strong>Total: ${cartTotal.toFixed(2)}</strong>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn outline" onClick={clearCart}>
              Clear cart
            </button>
            <Link className="btn" to="/products">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <form className="card grid" style={{ gap: '1rem' }} onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        {status.error && <p className="alert error">{status.error}</p>}
        {status.success && <p className="alert success">{status.success}</p>}

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <div className="form-control">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-control">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            rows="2"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div className="form-control">
            <label htmlFor="building">Building</label>
            <input id="building" name="building" value={form.building} onChange={handleChange} required />
          </div>
          <div className="form-control">
            <label htmlFor="floor">Floor</label>
            <input id="floor" name="floor" value={form.floor} onChange={handleChange} required />
          </div>
          <div className="form-control">
            <label htmlFor="postalCode">Postal code</label>
            <input id="postalCode" name="postalCode" value={form.postalCode} onChange={handleChange} required />
          </div>
        </div>

        <div className="card" style={{ background: '#f9fafb', border: '1px dashed #d1d5db' }}>
          <h3 style={{ marginTop: 0 }}>Payment</h3>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
            <input type="radio" name="paymentMethod" value="card" disabled />
            Pay with Visa / Mastercard (temporarily unavailable)
          </label>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
            Card payments are paused while we finalize the banking address.
          </p>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={form.paymentMethod === 'cash'}
              onChange={handleChange}
            />
            Cash on delivery
          </label>
        </div>

        <button className="btn" disabled={status.loading}>
          {status.loading ? 'Processing...' : 'Place order'}
        </button>
      </form>
    </section>
  );
};

export default Cart;
