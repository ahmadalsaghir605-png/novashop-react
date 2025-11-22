import React, { useState } from 'react';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  // Sidebar overlay style
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '220px',
    background: 'linear-gradient(135deg, #0099f7 0%, #f11712 100%)',
    color: '#fff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
    zIndex: 1200,
    display: open ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: '24px',
    transition: 'left 0.3s',
  };


  // Overlay background when sidebar is open
  const overlayStyle = open
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        zIndex: 1100,
      }
    : {};

  return (
    <>
      {/* Sidebar icon button always visible */}
      <button
        aria-label="Open sidebar"
        className="sidebar-icon-btn"
        style={{
          position: 'fixed',
          top: '18px',
          left: '18px',
          background: 'linear-gradient(135deg, #0099f7 0%, #f11712 100%)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          zIndex: 1300,
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="4" width="24" height="2" rx="1" fill="#fff"/>
          <rect y="11" width="24" height="2" rx="1" fill="#fff"/>
          <rect y="18" width="24" height="2" rx="1" fill="#fff"/>
        </svg>
      </button>
      {/* Overlay background only when sidebar is open */}
      {open && <div style={overlayStyle} onClick={() => setOpen(false)} />}
      {/* Sidebar itself */}
      <div style={sidebarStyle} className="sidebar">
        <button
          aria-label="Close sidebar"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '2rem',
            cursor: 'pointer',
          }}
          onClick={() => setOpen(false)}
        >
          &times;
        </button>
        {/* Sidebar links only on small screens */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginLeft: '24px' }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>Home</a>
          <a href="/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>Products</a>
          <a href="/checkout" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>Checkout</a>
          <a href="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem' }}>Login</a>
        </nav>
      </div>
    </>
  );
};

// ...existing code...

import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if click is outside both the dropdown and the icon button
      const iconButton = dropdownRef.current?.previousSibling;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconButton && !iconButton.contains(event.target)
      ) {
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

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <aside style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: 60, background: 'transparent', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: 18 }}>
      {user && (
        <div style={{ position: 'relative', marginTop: 0, marginLeft: 8 }}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
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
            <div ref={dropdownRef} style={{
              position: 'absolute',
              top: 54,
              right: 0,
              minWidth: 220,
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 100,
              padding: 0,
              textAlign: 'left',
              border: '1px solid #e5e7eb',
              fontFamily: 'Segoe UI, Arial, sans-serif',
              fontSize: '0.97rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 1rem 0.9rem 1rem', whiteSpace: 'nowrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#f6f7f9', border: '1px solid #ddd' }}>
                  <svg width="24" height="24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
                </span>
                <span style={{ fontWeight: 500, fontSize: '0.89rem', color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140, fontFamily: 'inherit' }}>{user.email}</span>
              </div>
              <div style={{ borderBottom: '1px solid #ececec', margin: '0 1rem 0.4rem 1rem' }} />
              <div style={{ padding: '0.75rem 1rem 0.75rem 1rem', cursor: 'pointer', fontSize: '0.97rem', color: '#222', transition: 'background 0.15s', fontFamily: 'inherit' }}
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                onMouseOver={e => e.currentTarget.style.background = '#f6f7f9'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                Profile
              </div>
              <div style={{ padding: '0.75rem 1rem 0.75rem 1rem', cursor: 'pointer', fontSize: '0.97rem', color: '#222', transition: 'background 0.15s', fontFamily: 'inherit' }}
                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                onMouseOver={e => e.currentTarget.style.background = '#f6f7f9'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                Settings
              </div>
              <div style={{ borderBottom: '1px solid #ececec', margin: '0 1rem 0.4rem 1rem' }} />
              <div style={{ padding: '0.75rem 1rem 0.75rem 1rem', cursor: 'pointer', fontSize: '0.97rem', color: '#d32f2f', fontWeight: 600, transition: 'background 0.15s', fontFamily: 'inherit' }}
                onClick={handleLogout}
                onMouseOver={e => e.currentTarget.style.background = '#fbe9e7'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                Sign out
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
export { RightSidebar };
