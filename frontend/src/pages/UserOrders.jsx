import { useEffect, useState } from 'react';
import { Api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const UserOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await Api.getMyOrders(token);
        setOrders(data);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div style={{ background: '#f6f7f9', minHeight: 'calc(100vh - 70px)', paddingTop: '3rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 0' }}>
        <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '2.5rem', textAlign: 'left', color: '#222' }}>Orders</h2>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: '3rem 2rem', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h3 style={{ fontWeight: 600, fontSize: '1.35rem', marginBottom: '1.2rem', color: '#222' }}>No orders yet</h3>
              <p style={{ color: '#555', fontSize: '1.08rem' }}>Go to store to place an order.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ background: '#f6f7f9' }}>
                  <th style={{ padding: '0.75rem' }}>Order #</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Total</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{order.id}</td>
                    <td style={{ padding: '0.75rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem' }}>${order.total}</td>
                    <td style={{ padding: '0.75rem' }}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
