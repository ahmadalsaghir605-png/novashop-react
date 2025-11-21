import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await Api.getAdminStats(token);
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      loadStats();
    }
  }, [token]);

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <h1>Admin dashboard</h1>
      {error && <p className="alert error">{error}</p>}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {stats ? (
          <>
            <article className="card">
              <p>Total Orders</p>
              <strong>{stats.totalOrders}</strong>
            </article>
            <article className="card">
              <p>Total Revenue</p>
              <strong>${Number(stats.totalRevenue).toFixed(2)}</strong>
            </article>
            <article className="card">
              <p>Active Products</p>
              <strong>{stats.totalProducts}</strong>
            </article>
            <article className="card">
              <p>Customers</p>
              <strong>{stats.totalCustomers}</strong>
            </article>
          </>
        ) : (
          <p>Loading stats...</p>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <Link className="card" to="/admin/orders">
          <h3>Manage orders</h3>
          <p>See recent purchases and fulfillment status.</p>
        </Link>
        <Link className="card" to="/admin/products">
          <h3>Manage products</h3>
          <p>Adjust inventory, pricing and availability.</p>
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;
