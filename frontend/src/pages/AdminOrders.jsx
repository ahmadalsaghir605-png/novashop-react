import { useEffect, useState } from 'react';

import { Api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await Api.getAdminOrders(token);
        setOrders(data);
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: error.message }));
      }
    };

    if (token) {
      loadOrders();
    }
  }, [token]);

  const selectOrder = async (orderId) => {
    try {
      setStatus({ loading: true, error: '' });
      const data = await Api.getAdminOrder(orderId, token);
      setSelectedOrder(data);
      setStatus({ loading: false, error: '' });
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <section className="grid" style={{ gap: '1.5rem' }}>
      <h1>Orders</h1>
      {status.error && <p className="alert error">{status.error}</p>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer_name}</td>
                <td>${Number(order.total).toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn outline" onClick={() => selectOrder(order.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {status.loading && <p>Loading order...</p>}

      {selectedOrder && (
        <article className="card">
          <h2>Order #{selectedOrder.id}</h2>
          <p>
            {selectedOrder.customer_name} {selectedOrder.last_name} · {selectedOrder.customer_email}
          </p>
          <p>Phone: {selectedOrder.customer_phone}</p>
          <p>
            Address: {selectedOrder.customer_address}, Building {selectedOrder.building}, Floor {selectedOrder.floor},{' '}
            {selectedOrder.postal_code}
          </p>
          <p>Payment: {selectedOrder.payment_method}</p>
          <p>Status: {selectedOrder.status}</p>
          <h3>Items</h3>
          <ul>
            {(selectedOrder.items || []).map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity} @ ${Number(item.unit_price).toFixed(2)}
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
};

export default AdminOrders;
