import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
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
      // login should return user info including role
      const user = await login(form.email, form.password);
      setStatus({ loading: false, error: '' });
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else if (user && user.role === 'user') {
        navigate('/orders');
      } else {
        navigate('/');
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f7f9' }}>
      <section className="card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto', borderRadius: '16px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', background: '#fff', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '0.04em', color: '#222', display: 'block', marginBottom: '0.5rem' }}>NovaShop</span>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: '1.35rem', marginBottom: '0.5rem' }}>Sign in</h2>
        <div style={{ color: '#555', fontSize: '1rem', marginBottom: '1.5rem' }}>Choose how you'd like to sign in</div>
        {status.error && <p className="alert error">{status.error}</p>}
        <form className="grid" style={{ gap: '1rem' }} onSubmit={handleSubmit}>
          <GoogleSignInButton />
          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
            <span style={{ margin: '0 1rem', color: '#888', fontSize: '0.95rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
          </div>
          <div className="form-control" style={{ marginBottom: '0.5rem' }}>
            <input
              name="email"
              id="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              style={{ fontSize: '1.08rem', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
          </div>
          <div className="form-control" style={{ marginBottom: '0.5rem' }}>
            <input
              name="password"
              id="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              style={{ fontSize: '1.08rem', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
          </div>
          <button
            className="btn primary"
            type="submit"
            style={{ fontWeight: 700, fontSize: '1.08rem', marginTop: '0.5rem', background: '#222', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.85rem' }}
            disabled={status.loading}
          >
            {status.loading ? 'Signing in...' : 'Login'}
          </button>
          <button className="btn outline" type="button" style={{ fontWeight: 700, fontSize: '1.08rem', marginTop: '0.5rem', background: '#f6f7f9', color: '#222', border: '1px solid #e5e7eb' }} onClick={() => navigate('/register')}>
            Need an account? Register
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
