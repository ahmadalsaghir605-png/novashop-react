import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setStatus({ loading: true, error: '' });
      await register(form.name, form.email, form.password);
      setStatus({ loading: false, error: '' });
      navigate('/');
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <section className="card" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <h2>Create account</h2>
      {status.error && <p className="alert error">{status.error}</p>}
      <form className="grid" style={{ gap: '1rem' }} onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            id="name"
            required
            value={form.name}
            onChange={handleChange}
          />
        </div>
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
          {status.loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </section>
  );
};

export default Register;
