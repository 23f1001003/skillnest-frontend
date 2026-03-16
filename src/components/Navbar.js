import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Skill<span style={styles.logoSpan}>Nest</span>
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/courses" style={styles.link}>Courses</Link>
        {user && user.role === 'user' && (
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" style={styles.link}>Admin</Link>
        )}
      </div>

      <div style={styles.buttons}>
        {!user ? (
          <>
            <Link to="/login" style={styles.btnOutline}>Login</Link>
            <Link to="/register" style={styles.btnPrimary}>Sign Up</Link>
          </>
        ) : (
          <>
            <span style={styles.userName}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btnOutline}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 40px', borderBottom: '1px solid #eee',
    background: 'white', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontSize: '20px', fontWeight: '700', textDecoration: 'none', color: '#1a1a1a', letterSpacing: '-0.5px' },
  logoSpan: { color: '#f5a623' },
  links: { display: 'flex', gap: '28px' },
  link: { textDecoration: 'none', color: '#555', fontSize: '14px' },
  buttons: { display: 'flex', gap: '10px', alignItems: 'center' },
  btnOutline: {
    padding: '7px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
    border: '1.5px solid #1a1a1a', color: '#1a1a1a', textDecoration: 'none',
    background: 'transparent', cursor: 'pointer',
  },
  btnPrimary: {
    padding: '7px 18px', borderRadius: '6px', fontSize: '13px',
    fontWeight: '500', background: '#1a1a1a', color: 'white', textDecoration: 'none',
  },
  userName: { fontSize: '13px', color: '#555' },
};

export default Navbar;