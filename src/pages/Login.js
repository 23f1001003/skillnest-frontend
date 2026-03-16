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
      const res = await axios.post(`http://localhost:5000${url}`, formData);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>Skill<span style={styles.orange}>Nest</span></Link>
        <h2 style={styles.leftTitle}>Welcome<br /><span style={styles.orange}>Back!</span></h2>
        <p style={styles.leftSub}>Login to continue your learning journey and access all your enrolled courses.</p>
        <div style={styles.featureList}>
          {['Access 500+ courses', 'Track your progress', 'Earn certificates', 'Learn at your pace'].map((f, i) => (
            <div key={i} style={styles.feature}>
              <div style={styles.dot}></div>{f}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <h3 style={styles.rightTitle}>{isLogin ? 'Sign in to SkillNest' : 'Create your account'}</h3>
        <p style={styles.rightSub}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.switchLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register free' : 'Login'}
          </span>
        </p>

        {/* TABS */}
        <div style={styles.tabs}>
          <div style={{ ...styles.tab, ...(isLogin ? styles.tabActive : {}) }} onClick={() => setIsLogin(true)}>Login</div>
          <div style={{ ...styles.tab, ...(!isLogin ? styles.tabActive : {}) }} onClick={() => setIsLogin(false)}>Register</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login →' : 'Register →')}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: '#1a1a1a', padding: '60px 48px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  logo: { fontSize: '22px', fontWeight: '700', color: 'white', textDecoration: 'none', marginBottom: '40px', display: 'block' },
  orange: { color: '#f5a623' },
  leftTitle: { fontSize: '36px', fontWeight: '300', color: 'white', letterSpacing: '-1px', marginBottom: '12px', lineHeight: 1.2 },
  leftSub: { color: '#666', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  feature: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#aaa' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#f5a623', flexShrink: 0 },
  right: { flex: 1, padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  rightTitle: { fontSize: '24px', fontWeight: '600', marginBottom: '6px', color: '#1a1a1a' },
  rightSub: { fontSize: '13px', color: '#888', marginBottom: '28px' },
  switchLink: { color: '#f5a623', fontWeight: '600', cursor: 'pointer' },
  tabs: { display: 'flex', borderBottom: '2px solid #f0f0f0', marginBottom: '24px' },
  tab: { padding: '8px 24px', fontSize: '14px', fontWeight: '500', color: '#aaa', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-2px' },
  tabActive: { color: '#1a1a1a', borderColor: '#1a1a1a' },
  error: { background: '#fce8e8', color: '#991f1f', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#444', letterSpacing: '0.5px' },
  input: { border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  btnPrimary: {
    padding: '13px', background: '#1a1a1a', color: 'white', border: 'none',
    borderRadius: '7px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginTop: '4px',
  },
};

export default Login;