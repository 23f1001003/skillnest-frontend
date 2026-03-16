import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 40px;
          border-bottom: 1px solid #eee;
          background: white;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          font-size: 20px;
          font-weight: 700;
          text-decoration: none;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }
        .nav-logo span { color: #f5a623; }
        .nav-links {
          display: flex;
          gap: 28px;
        }
        .nav-links a {
          text-decoration: none;
          color: #555;
          font-size: 14px;
        }
        .nav-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .btn-outline {
          padding: 7px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          border: 1.5px solid #1a1a1a;
          color: #1a1a1a;
          text-decoration: none;
          background: transparent;
          cursor: pointer;
        }
        .btn-primary-nav {
          padding: 7px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          background: #1a1a1a;
          color: white;
          text-decoration: none;
        }
        .user-name { font-size: 13px; color: #555; }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
        }
        .hamburger span {
          width: 22px;
          height: 2px;
          background: #1a1a1a;
          border-radius: 2px;
          display: block;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: white;
          border-bottom: 1px solid #eee;
          padding: 16px 20px;
          gap: 12px;
        }
        .mobile-menu a, .mobile-menu button {
          text-decoration: none;
          color: #555;
          font-size: 15px;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }
        .mobile-menu-open { display: flex; }

        @media (max-width: 768px) {
          .navbar { padding: 12px 16px; }
          .nav-links { display: none; }
          .nav-buttons { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className="navbar">
        <Link to="/" className="nav-logo">
          Skill<span>Nest</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          {user && user.role === 'user' && <Link to="/dashboard">Dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="nav-buttons">
          {!user ? (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary-nav">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="user-name">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn-outline">Logout</button>
            </>
          )}
        </div>

        {/* HAMBURGER */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
        {user && user.role === 'user' && (
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
        )}
        {!user ? (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </>
        ) : (
          <>
            <span style={{ fontSize: '14px', color: '#888' }}>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;