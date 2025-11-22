import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0.5rem 0', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2rem', position: 'relative' }}>
        {/* Centered Logo shifted 1cm left */}
        <Link to="/" style={{ fontWeight: 900, fontSize: '1.7rem', color: '#1a2233', textDecoration: 'none', letterSpacing: '0.02em', flex: 1, textAlign: 'center', position: 'relative', left: '-1.5cm' }}>NovaShop</Link>
        {/* Navigation shifted 2cm right of center */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.2rem', position: 'absolute', left: 'calc(50% + 2cm)', top: '50%', transform: 'translateY(-50%)' }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 700,
              fontSize: '1.18rem',
              letterSpacing: '0.02em',
              color: isActive ? '#1a2233' : '#222',
              textDecoration: isActive ? 'underline' : 'none',
              textUnderlineOffset: '6px',
              padding: '0.5rem 0',
              transition: 'color 0.2s',
            })}
          >
            Shop
          </NavLink>
          <NavLink
            to="/orders"
            style={({ isActive }) => ({
              fontWeight: 700,
              fontSize: '1.18rem',
              letterSpacing: '0.02em',
              color: isActive ? '#1a2233' : '#222',
              textDecoration: isActive ? 'underline' : 'none',
              textUnderlineOffset: '6px',
              padding: '0.5rem 0',
              transition: 'color 0.2s',
            })}
          >
            Orders
          </NavLink>
        </nav>
        {/* Desktop user menu only (hidden on mobile/tablet via CSS) */}
        <div className="nav-user-menu-desktop">
          {user && (
            <>
              <span style={{ fontWeight: 600, fontSize: '1.08rem', color: '#1a2233' }}>{user.name}</span>
              <button
                className="user-menu-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', marginLeft: 8 }}
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="User menu"
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: '#f6f7f9', border: '1px solid #ddd' }}>
                  <svg width="24" height="24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
                </span>
                <svg
                  width="16"
                  height="16"
                  style={{ marginLeft: 6, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    top: 44,
                    right: 0,
                    minWidth: 260,
                    background: '#fff',
                    borderRadius: 14,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    padding: 0,
                    textAlign: 'left',
                    border: '1px solid #e5e7eb',
                    fontFamily: 'Segoe UI, Arial, sans-serif',
                    fontSize: '0.97rem',
                    opacity: 1,
                    transform: 'translateY(0)',
                    pointerEvents: 'auto',
                    transition: 'opacity 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1)',
                    display: 'block',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '1rem 1rem 0.7rem 1rem', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#f6f7f9', border: '1px solid #ddd' }}>
                      <svg width="24" height="24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '0.99rem', color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 170, fontFamily: 'inherit' }}>{user.email}</span>
                  </div>
                  <div style={{ borderBottom: '1px solid #ececec', margin: '0 1rem 0.4rem 1rem' }} />
                  <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '1.07rem', color: '#222', transition: 'background 0.15s', fontFamily: 'inherit' }}
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    onMouseOver={e => e.currentTarget.style.background = '#f6f7f9'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Profile
                  </div>
                  <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '1.07rem', color: '#222', transition: 'background 0.15s', fontFamily: 'inherit' }}
                    onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                    onMouseOver={e => e.currentTarget.style.background = '#f6f7f9'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Settings
                  </div>
                  <div style={{ borderBottom: '1px solid #ececec', margin: '0 1rem 0.4rem 1rem' }} />
                  <div style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '1.07rem', color: '#d32f2f', fontWeight: 600, transition: 'background 0.15s', fontFamily: 'inherit' }}
                    onClick={logout}
                    onMouseOver={e => e.currentTarget.style.background = '#fbe9e7'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Sign out
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
