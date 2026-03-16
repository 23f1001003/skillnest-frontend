import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'https://skillnest-backend-9xud.onrender.com';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', price: '',
    instructor: '', duration: '', status: 'published', image: ''
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchCourses();
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/api/courses`);
      setCourses(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      setCategories(res.data);
    } catch (err) { console.log(err); }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API}/api/categories`,
        { name: newCategory.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory('');
      fetchCategories();
    } catch (err) { alert('Category already exists!'); }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API}/api/categories/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await axios.put(`${API}/api/courses/${editCourse._id}`, formData,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessage('Course updated successfully!');
      } else {
        await axios.post(`${API}/api/courses`, formData,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessage('Course added successfully!');
      }
      setShowForm(false);
      setEditCourse(null);
      resetForm();
      fetchCourses();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/api/courses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Course deleted!');
      fetchCourses();
    } catch (err) { console.log(err); }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setFormData({
      title: course.title, description: course.description,
      category: course.category, price: course.price,
      instructor: course.instructor, duration: course.duration,
      status: course.status, image: course.image || ''
    });
    setShowForm(true);
    setActiveTab('courses');
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: '', price: '', instructor: '', duration: '', status: 'published', image: '' });
  };

  return (
    <div>
      <style>{`
        .admin-wrapper { display: flex; min-height: 100vh; position: relative; }
        .admin-sidebar {
          width: 210px;
          background: #1a1a1a;
          padding: 24px 0;
          flex-shrink: 0;
        }
        .sidebar-logo { font-size: 18px; font-weight: 700; color: white; padding: 0 20px 20px; border-bottom: 1px solid #2a2a2a; }
        .sidebar-logo span { color: #f5a623; }
        .side-section { padding: 16px 20px 8px; font-size: 10px; color: #444; letter-spacing: 2px; text-transform: uppercase; }
        .side-item { padding: 10px 20px; font-size: 13px; color: #888; display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .side-item.active { color: white; background: #2a2a2a; border-left: 3px solid #f5a623; }
        .side-icon { width: 16px; height: 16px; background: #333; border-radius: 3px; flex-shrink: 0; }
        .side-icon.active { background: #f5a623; }
        .admin-main { flex: 1; padding: 28px 32px; background: #fafaf8; min-width: 0; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .admin-title { font-size: 22px; font-weight: 600; color: #1a1a1a; }
        .admin-sub { font-size: 13px; color: #888; margin-top: 4px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { background: white; border: 1px solid #eee; border-radius: 8px; padding: 16px; }
        .stat-label { font-size: 11px; color: #888; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .stat-num { font-size: 26px; font-weight: 700; color: #1a1a1a; }
        .msg { background: #dcfce7; color: #166534; padding: 10px 16px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; cursor: pointer; }
        .form-card { background: white; border: 1px solid #eee; border-radius: 10px; padding: 24px; margin-bottom: 24px; }
        .form-title { font-size: 15px; font-weight: 600; margin-bottom: 20px; color: #1a1a1a; }
        .form-inner { display: flex; flex-direction: column; gap: 16px; }
        .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-label { font-size: 12px; font-weight: 600; color: #444; letter-spacing: 0.5px; }
        .form-input { border: 1.5px solid #e0e0e0; border-radius: 7px; padding: 10px 14px; font-size: 13px; font-family: inherit; outline: none; width: 100%; }
        .btn-orange { padding: 9px 20px; background: #f5a623; color: #1a1a1a; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-dark { padding: 11px 24px; background: #1a1a1a; color: white; border: none; border-radius: 7px; font-size: 14px; font-weight: 500; cursor: pointer; align-self: flex-start; }
        .table-card { background: white; border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
        .table-header { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .table-title { font-size: 15px; font-weight: 600; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 10px 16px; font-size: 11px; color: #888; letter-spacing: 1px; text-transform: uppercase; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
        .admin-table td { padding: 13px 16px; font-size: 13px; color: #333; border-bottom: 1px solid #f8f8f8; }
        .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-amber { background: #fef3c7; color: #92400e; }
        .action-btns { display: flex; gap: 6px; }
        .edit-btn { padding: 4px 12px; background: #e6f1fb; color: #0c447c; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; }
        .delete-btn { padding: 4px 12px; background: #fce8e8; color: #991f1f; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; }
        .mobile-toggle { display: none; background: none; border: none; font-size: 22px; cursor: pointer; margin-bottom: 16px; color: #1a1a1a; }
        .sidebar-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99; }
        .sidebar-overlay.open { display: block; }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0; left: -210px;
            height: 100%;
            z-index: 100;
            transition: left 0.3s ease;
          }
          .admin-sidebar.open { left: 0; }
          .mobile-toggle { display: block; }
          .admin-main { padding: 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .form-grid { grid-template-columns: 1fr; }
          .admin-title { font-size: 18px; }
          .admin-table { display: block; overflow-x: auto; white-space: nowrap; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .form-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-main { padding: 20px; }
        }
      `}</style>

      <div className="admin-wrapper">
        {/* OVERLAY */}
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}></div>

        {/* SIDEBAR */}
        <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">Skill<span>Nest</span></div>
          <div className="side-section">Main</div>
          {[
            { label: 'Dashboard', tab: 'dashboard' },
            { label: 'Courses', tab: 'courses' },
            { label: 'Users', tab: 'users' },
          ].map((item) => (
            <div key={item.tab}
              className={`side-item ${activeTab === item.tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.tab); setShowForm(false); setSidebarOpen(false); }}>
              <div className={`side-icon ${activeTab === item.tab ? 'active' : ''}`}></div>
              {item.label}
            </div>
          ))}
          <div className="side-section">Account</div>
          <div className="side-item" onClick={() => { logout(); navigate('/'); }}>
            <div className="side-icon"></div>Logout
          </div>
        </div>

        {/* MAIN */}
        <div className="admin-main">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>☰ Menu</button>

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <>
              <div className="top-bar">
                <div>
                  <div className="admin-title">Admin Dashboard</div>
                  <div className="admin-sub">Welcome, {user?.name}</div>
                </div>
                <button className="btn-orange" onClick={() => { setActiveTab('courses'); setShowForm(true); resetForm(); }}>
                  + Add New Course
                </button>
              </div>
              <div className="stats-grid">
                {[
                  { label: 'Total Courses', value: courses.length },
                  { label: 'Published', value: courses.filter(c => c.status === 'published').length },
                  { label: 'Total Users', value: users.length },
                  { label: 'Total Students', value: courses.reduce((a, c) => a + (c.students || 0), 0) },
                ].map((stat, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-num">{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="table-card">
                <div className="table-header"><div className="table-title">Recent Courses</div></div>
                <table className="admin-table">
                  <thead>
                    <tr>{['Title', 'Category', 'Price', 'Students', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {courses.slice(0, 5).map(course => (
                      <tr key={course._id}>
                        <td>{course.title}</td>
                        <td>{course.category}</td>
                        <td>₹{course.price}</td>
                        <td>{course.students}</td>
                        <td><span className={`badge ${course.status === 'published' ? 'badge-green' : 'badge-amber'}`}>{course.status}</span></td>
                        <td>
                          <div className="action-btns">
                            <button className="edit-btn" onClick={() => handleEdit(course)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(course._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <>
              <div className="top-bar">
                <div>
                  <div className="admin-title">Course Management</div>
                  <div className="admin-sub">{courses.length} total courses</div>
                </div>
                <button className="btn-orange" onClick={() => { setShowForm(!showForm); setEditCourse(null); resetForm(); }}>
                  {showForm ? '✕ Cancel' : '+ Add New Course'}
                </button>
              </div>

              {message && <div className="msg" onClick={() => setMessage('')}>{message} ✕</div>}

              {showForm && (
                <div className="form-card">
                  <div className="form-title">{editCourse ? 'Edit Course' : 'Add New Course'}</div>
                  <form onSubmit={handleSubmit} className="form-inner">
                    <div className="form-grid">
                      <div className="input-group">
                        <label className="input-label">Course Title *</label>
                        <input className="form-input" placeholder="e.g. React.js for Beginners"
                          value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Category *</label>
                        <select className="form-input" value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                          <option value="">Select category</option>
                          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Price (₹) *</label>
                        <input className="form-input" type="number" placeholder="499"
                          value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Instructor *</label>
                        <input className="form-input" placeholder="Instructor name"
                          value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} required />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Duration</label>
                        <input className="form-input" placeholder="e.g. 12h"
                          value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Status</label>
                        <select className="form-input" value={formData.status}
                          onChange={e => setFormData({ ...formData, status: e.target.value })}>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Thumbnail Image URL</label>
                      <input className="form-input" placeholder="https://example.com/image.jpg"
                        value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                      {formData.image && (
                        <img src={formData.image} alt="preview"
                          style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                      )}
                      <small style={{ color: '#aaa', fontSize: '11px' }}>Tip: Paste any image URL from unsplash.com</small>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Description *</label>
                      <textarea className="form-input" style={{ height: '80px', resize: 'vertical' }}
                        placeholder="Course description..." value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn-dark">
                      {editCourse ? 'Update Course' : 'Add Course'}
                    </button>
                  </form>
                </div>
              )}

              <div className="table-card">
                <table className="admin-table">
                  <thead>
                    <tr>{['Thumbnail', 'Title', 'Category', 'Price', 'Students', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? courses.map(course => (
                      <tr key={course._id}>
                        <td>
                          {course.image ? (
                            <img src={course.image} alt={course.title} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            <div style={{ width: '50px', height: '35px', background: '#f0ede8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' }}>N/A</div>
                          )}
                        </td>
                        <td>{course.title}</td>
                        <td>{course.category}</td>
                        <td>₹{course.price}</td>
                        <td>{course.students}</td>
                        <td><span className={`badge ${course.status === 'published' ? 'badge-green' : 'badge-amber'}`}>{course.status}</span></td>
                        <td>
                          <div className="action-btns">
                            <button className="edit-btn" onClick={() => handleEdit(course)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(course._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="7" style={{ textAlign: 'center', color: '#aaa', padding: '32px' }}>No courses yet!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* CATEGORY MANAGEMENT */}
              <div style={{ marginTop: '24px' }}>
                <div className="form-card">
                  <div className="form-title">Manage Categories</div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <input className="form-input" style={{ flex: 1, minWidth: '200px' }}
                      placeholder="Add new category e.g. Business"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddCategory()} />
                    <button className="btn-orange" onClick={handleAddCategory}>+ Add Category</button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                      <div key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#f0ede8', borderRadius: '20px', fontSize: '13px' }}>
                        {cat.name}
                        <span style={{ cursor: 'pointer', color: '#991f1f', fontWeight: '700' }}
                          onClick={() => handleDeleteCategory(cat._id)}>×</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <>
              <div className="top-bar">
                <div>
                  <div className="admin-title">User Management</div>
                  <div className="admin-sub">{users.length} registered users</div>
                </div>
              </div>
              <div className="table-card">
                <table className="admin-table">
                  <thead>
                    <tr>{['Name', 'Email', 'Role', 'Enrolled'].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', color: '#888', flexShrink: 0 }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-amber' : 'badge-green'}`}>{u.role}</span></td>
                        <td>{u.enrolledCourses?.length || 0}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" style={{ textAlign: 'center', color: '#aaa', padding: '32px' }}>No users yet!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;