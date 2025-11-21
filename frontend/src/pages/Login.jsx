import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setStatus({ loading: true, error: '' });
      await login(form.email, form.password);
      setStatus({ loading: false, error: '' });
      navigate('/');
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <section className="card" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <h2>Login</h2>
      {status.error && <p className="alert error">{status.error}</p>}
      <form className="grid" style={{ gap: '1rem' }} onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button className="btn" disabled={status.loading}>
          {status.loading ? 'Signing in...' : 'Login'}
        </button>
        <button
          type="button"
          className="btn outline"
          onClick={() => navigate('/register')}
        >
          Need an account? Register
        </button>
      </form>
    </section>
  );
};

export default Login;
