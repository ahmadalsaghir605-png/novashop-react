import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 1.5rem'
        }}
      >
        <Link to="/" style={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827' }}>
          NovaShop
        </Link>

        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/checkout">Checkout ({cartCount})</NavLink>
          {user?.role === 'admin' || user?.role === 'manager' ? (
            <NavLink to="/admin">Admin</NavLink>
          ) : null}
          {user ? (
            <>
              <span style={{ fontWeight: 600 }}>{user.name}</span>
              <button className="btn outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
