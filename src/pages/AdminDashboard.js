import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', price: '',
    instructor: '', duration: '', status: 'published', image: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchCourses();
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://skillnest-backend-9xud.onrender.com/api/courses');
      setCourses(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://skillnest-backend-9xud.onrender.com/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://skillnest-backend-9xud.onrender.com/api/categories');
      setCategories(res.data);
    } catch (err) { console.log(err); }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post('https://skillnest-backend-9xud.onrender.com/api/categories',
        { name: newCategory.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      alert('Category already exists or error!');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`https://skillnest-backend-9xud.onrender.com/api/categories/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCategories();
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await axios.put(`https://skillnest-backend-9xud.onrender.com/api/courses/${editCourse._id}`, formData,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessage('Course updated successfully!');
      } else {
        await axios.post('https://skillnest-backend-9xud.onrender.com/api/courses', formData,
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
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`https://skillnest-backend-9xud.onrender.com/api/courses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Course deleted successfully!');
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
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>Skill<span style={styles.orange}>Nest</span></div>
        <div style={styles.sideSection}>Main</div>
        {[
          { label: 'Dashboard', tab: 'dashboard' },
          { label: 'Courses', tab: 'courses' },
          { label: 'Users', tab: 'users' },
        ].map((item) => (
          <div key={item.tab}
            style={{ ...styles.sideItem, ...(activeTab === item.tab ? styles.sideActive : {}) }}
            onClick={() => { setActiveTab(item.tab); setShowForm(false); }}>
            <div style={{ ...styles.sideIcon, ...(activeTab === item.tab ? styles.sideIconActive : {}) }}></div>
            {item.label}
          </div>
        ))}
        <div style={styles.sideSection}>Account</div>
        <div style={styles.sideItem} onClick={() => { logout(); navigate('/'); }}>
          <div style={styles.sideIcon}></div>Logout
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* ---- DASHBOARD TAB ---- */}
        {activeTab === 'dashboard' && (
          <>
            <div style={styles.topBar}>
              <div>
                <h2 style={styles.title}>Admin Dashboard</h2>
                <p style={styles.sub}>Welcome, {user?.name}</p>
              </div>
              <button style={styles.btnOrange} onClick={() => { setActiveTab('courses'); setShowForm(true); resetForm(); }}>
                + Add New Course
              </button>
            </div>
            <div style={styles.stats}>
              {[
                { label: 'Total Courses', value: courses.length },
                { label: 'Published', value: courses.filter(c => c.status === 'published').length },
                { label: 'Total Users', value: users.length },
                { label: 'Total Students', value: courses.reduce((a, c) => a + (c.students || 0), 0) },
              ].map((stat, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={styles.statLabel}>{stat.label}</div>
                  <div style={styles.statNum}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <div style={styles.tableTitle}>Recent Courses</div>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Course Title', 'Category', 'Price', 'Students', 'Status', 'Actions'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? courses.slice(0, 5).map(course => (
                    <tr key={course._id}>
                      <td style={styles.td}>{course.title}</td>
                      <td style={styles.td}>{course.category}</td>
                      <td style={styles.td}>₹{course.price}</td>
                      <td style={styles.td}>{course.students}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...(course.status === 'published' ? styles.badgeGreen : styles.badgeAmber) }}>
                          {course.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button style={styles.editBtn} onClick={() => handleEdit(course)}>Edit</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(course._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#aaa', padding: '32px' }}>No courses yet!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ---- COURSES TAB ---- */}
        {activeTab === 'courses' && (
          <>
            <div style={styles.topBar}>
              <div>
                <h2 style={styles.title}>Course Management</h2>
                <p style={styles.sub}>{courses.length} total courses</p>
              </div>
              <button style={styles.btnOrange} onClick={() => { setShowForm(!showForm); setEditCourse(null); resetForm(); }}>
                {showForm ? '✕ Cancel' : '+ Add New Course'}
              </button>
            </div>

            {message && (
              <div style={styles.msg} onClick={() => setMessage('')}>{message} ✕</div>
            )}

            {showForm && (
              <div style={styles.formCard}>
                <div style={styles.formTitle}>{editCourse ? 'Edit Course' : 'Add New Course'}</div>
                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Course Title *</label>
                      <input style={styles.input} placeholder="e.g. React.js for Beginners"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Category *</label>
                      <select style={styles.input} value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                        <option value="">Select category</option>
                        {categories.map(c => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Price (₹) *</label>
                      <input style={styles.input} type="number" placeholder="499"
                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Instructor *</label>
                      <input style={styles.input} placeholder="Instructor name"
                        value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Duration</label>
                      <input style={styles.input} placeholder="e.g. 12h"
                        value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Status</label>
                      <select style={styles.input} value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Thumbnail Image URL</label>
                    <input style={styles.input} placeholder="https://example.com/image.jpg"
                      value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                    {formData.image && (
                      <img src={formData.image} alt="preview"
                        style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                    )}
                    <small style={{ color: '#aaa', fontSize: '11px' }}>Tip: Paste any image URL — e.g. from unsplash.com</small>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Description *</label>
                    <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                      placeholder="Course description..." value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                  </div>
                  <button type="submit" style={styles.btnPrimary}>
                    {editCourse ? 'Update Course' : 'Add Course'}
                  </button>
                </form>
              </div>
            )}

            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Thumbnail', 'Course Title', 'Category', 'Price', 'Students', 'Status', 'Actions'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? courses.map(course => (
                    <tr key={course._id}>
                      <td style={styles.td}>
                        {course.image ? (
                          <img src={course.image} alt={course.title}
                            style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '35px', background: '#f0ede8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' }}>N/A</div>
                        )}
                      </td>
                      <td style={styles.td}>{course.title}</td>
                      <td style={styles.td}>{course.category}</td>
                      <td style={styles.td}>₹{course.price}</td>
                      <td style={styles.td}>{course.students}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...(course.status === 'published' ? styles.badgeGreen : styles.badgeAmber) }}>
                          {course.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button style={styles.editBtn} onClick={() => handleEdit(course)}>Edit</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(course._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#aaa', padding: '32px' }}>No courses yet!</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CATEGORY MANAGEMENT */}
            <div style={{ marginTop: '24px' }}>
              <div style={styles.formCard}>
                <div style={styles.formTitle}>Manage Categories</div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Add new category e.g. Business"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button style={styles.btnOrange} onClick={handleAddCategory}>
                    + Add Category
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {categories.map((cat) => (
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

        {/* ---- USERS TAB ---- */}
        {activeTab === 'users' && (
          <>
            <div style={styles.topBar}>
              <div>
                <h2 style={styles.title}>User Management</h2>
                <p style={styles.sub}>{users.length} registered users</p>
              </div>
            </div>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Name', 'Email', 'Role', 'Enrolled Courses'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map(u => (
                    <tr key={u._id}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', color: '#888' }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...(u.role === 'admin' ? styles.badgeAmber : styles.badgeGreen) }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{u.enrolledCourses?.length || 0} courses</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#aaa', padding: '32px' }}>
                        No users registered yet!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '210px', background: '#1a1a1a', padding: '24px 0', flexShrink: 0 },
  sidebarLogo: { fontSize: '18px', fontWeight: '700', color: 'white', padding: '0 20px 20px', borderBottom: '1px solid #2a2a2a' },
  orange: { color: '#f5a623' },
  sideSection: { padding: '16px 20px 8px', fontSize: '10px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase' },
  sideItem: { padding: '10px 20px', fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  sideActive: { color: 'white', background: '#2a2a2a', borderLeft: '3px solid #f5a623' },
  sideIcon: { width: '16px', height: '16px', background: '#333', borderRadius: '3px', flexShrink: 0 },
  sideIconActive: { background: '#f5a623' },
  main: { flex: 1, padding: '28px 32px', background: '#fafaf8' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '600', color: '#1a1a1a' },
  sub: { fontSize: '13px', color: '#888', marginTop: '4px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  statCard: { background: 'white', border: '1px solid #eee', borderRadius: '8px', padding: '16px' },
  statLabel: { fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
  statNum: { fontSize: '26px', fontWeight: '700', color: '#1a1a1a' },
  msg: { background: '#dcfce7', color: '#166534', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', cursor: 'pointer' },
  formCard: { background: 'white', border: '1px solid #eee', borderRadius: '10px', padding: '24px', marginBottom: '24px' },
  formTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#444', letterSpacing: '0.5px' },
  input: { border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '10px 14px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' },
  btnOrange: { padding: '9px 20px', background: '#f5a623', color: '#1a1a1a', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  btnPrimary: { padding: '11px 24px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '7px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', alignSelf: 'flex-start' },
  tableCard: { background: 'white', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' },
  tableHeader: { padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tableTitle: { fontSize: '15px', fontWeight: '600' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', background: '#fafafa', borderBottom: '1px solid #f0f0f0' },
  td: { padding: '13px 16px', fontSize: '13px', color: '#333', borderBottom: '1px solid #f8f8f8' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' },
  badgeGreen: { background: '#dcfce7', color: '#166534' },
  badgeAmber: { background: '#fef3c7', color: '#92400e' },
  actions: { display: 'flex', gap: '6px' },
  editBtn: { padding: '4px 12px', background: '#e6f1fb', color: '#0c447c', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
  deleteBtn: { padding: '4px 12px', background: '#fce8e8', color: '#991f1f', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
};

export default AdminDashboard;