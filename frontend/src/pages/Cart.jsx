import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useCart();

  if (!cart.length) {
    return (
      <div className="card">
        <p>Your cart is empty.</p>
        <Link className="btn" to="/products">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <section className="card">
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
            Clear
          </button>
          <Link className="btn" to="/checkout">
            Checkout
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cart;
