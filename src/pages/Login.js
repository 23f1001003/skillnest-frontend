import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`https://skillnest-backend-9xud.onrender.com${url}`, formData);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div>
      <style>{`
        .auth-wrapper {
          display: flex;
          min-height: 100vh;
        }
        .auth-left {
          flex: 1;
          background: #1a1a1a;
          padding: 60px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-logo {
          font-size: 22px;
          font-weight: 700;
          color: white;
          text-decoration: none;
          margin-bottom: 40px;
          display: block;
        }
        .auth-logo span { color: #f5a623; }
        .auth-left h2 {
          font-size: 36px;
          font-weight: 300;
          color: white;
          letter-spacing: -1px;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        .auth-left h2 strong { color: #f5a623; font-weight: 700; }
        .auth-left p { color: #666; font-size: 14px; line-height: 1.7; margin-bottom: 28px; }
        .feature-list { display: flex; flex-direction: column; gap: 12px; }
        .feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #aaa;
        }
        .feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f5a623;
          flex-shrink: 0;
        }
        .auth-right {
          flex: 1;
          padding: 60px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-right h3 { font-size: 24px; font-weight: 600; margin-bottom: 6px; color: #1a1a1a; }
        .auth-right p { font-size: 13px; color: #888; margin-bottom: 28px; }
        .switch-link { color: #f5a623; font-weight: 600; cursor: pointer; }
        .auth-tabs {
          display: flex;
          border-bottom: 2px solid #f0f0f0;
          margin-bottom: 24px;
        }
        .auth-tab {
          padding: 8px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #aaa;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
        }
        .auth-tab.active { color: #1a1a1a; border-color: #1a1a1a; }
        .auth-error {
          background: #fce8e8;
          color: #991f1f;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-label { font-size: 12px; font-weight: 600; color: #444; letter-spacing: 0.5px; }
        .auth-input {
          border: 1.5px solid #e0e0e0;
          border-radius: 7px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          width: 100%;
        }
        .auth-btn {
          padding: 13px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 7px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 4px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .auth-wrapper { flex-direction: column; }
          .auth-left {
            padding: 32px 20px;
            min-height: auto;
          }
          .auth-left h2 { font-size: 26px; }
          .feature-list { display: none; }
          .auth-right { padding: 32px 20px; }
          .auth-right h3 { font-size: 20px; }
        }
      `}</style>

      <div className="auth-wrapper">
        {/* LEFT */}
        <div className="auth-left">
          <Link to="/" className="auth-logo">Skill<span>Nest</span></Link>
          <h2>Welcome<br /><strong>Back!</strong></h2>
          <p>Login to continue your learning journey and access all your enrolled courses.</p>
          <div className="feature-list">
            {['Access 500+ courses', 'Track your progress', 'Earn certificates', 'Learn at your pace'].map((f, i) => (
              <div key={i} className="feature">
                <div className="feature-dot"></div>{f}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <h3>{isLogin ? 'Sign in to SkillNest' : 'Create your account'}</h3>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register free' : 'Login'}
            </span>
          </p>
          <div className="auth-tabs">
            <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</div>
            <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Register</div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input className="auth-input" type="text" placeholder="Your name"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            )}
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className="auth-input" type="email" placeholder="user@example.com"
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="auth-input" type="password" placeholder="••••••••"
                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login →' : 'Register →')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;