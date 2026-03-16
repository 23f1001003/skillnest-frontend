import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(
    JSON.parse(localStorage.getItem('profileData')) || {
      name: '', phone: '', bio: '', location: '', photo: ''
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('https://skillnest-backend-9xud.onrender.com/api/courses/user/enrolled', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { setEnrolledCourses(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, []);

  return (
    <div>
      <style>{`
        .dashboard-wrapper { display: flex; min-height: 100vh; background: #fafaf8; position: relative; }
        .sidebar {
          width: 220px;
          background: white;
          border-right: 1px solid #eee;
          padding: 28px 0;
          flex-shrink: 0;
        }
        .avatar {
          width: 52px; height: 52px; border-radius: 50%;
          background: #f0ede8; border: 2px solid #e0e0e0;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 700; color: #888;
          margin: 0 auto 10px;
        }
        .user-name { text-align: center; font-size: 14px; font-weight: 600; padding: 0 16px; }
        .user-email { text-align: center; font-size: 11px; color: #aaa; margin-bottom: 16px; padding: 0 16px; word-break: break-all; }
        .divider { height: 1px; background: #f0f0f0; margin: 8px 0; }
        .menu-item {
          padding: 10px 20px; font-size: 13px; color: #888;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .menu-item.active { color: #1a1a1a; background: #f0ede8; border-left: 3px solid #f5a623; font-weight: 500; }
        .menu-dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; flex-shrink: 0; }
        .menu-dot.active { background: #f5a623; }
        .dashboard-main { flex: 1; padding: 28px 32px; min-width: 0; }
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .dash-title { font-size: 22px; font-weight: 600; color: #1a1a1a; }
        .dash-sub { font-size: 13px; color: #888; margin-top: 4px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
        .stat-card { background: white; border: 1px solid #eee; border-radius: 8px; padding: 16px; }
        .stat-label { font-size: 11px; color: #888; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .stat-num { font-size: 26px; font-weight: 700; color: #1a1a1a; }
        .section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 16px; }
        .courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .course-card { border: 1.5px solid #e8e8e8; border-radius: 10px; overflow: hidden; background: white; }
        .course-card img { width: 100%; height: 110px; object-fit: cover; }
        .card-img-placeholder { height: 110px; background: #f0ede8; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #aaa; }
        .card-body { padding: 14px; }
        .card-tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #f5a623; margin-bottom: 4px; }
        .card-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #1a1a1a; }
        .card-meta { font-size: 12px; color: #888; margin-bottom: 10px; }
        .progress-bar { height: 4px; background: #f0f0f0; border-radius: 2px; margin-bottom: 4px; }
        .progress-fill { height: 100%; background: #f5a623; border-radius: 2px; width: 40%; }
        .progress-text { font-size: 11px; color: #aaa; margin-bottom: 10px; }
        .btn-primary-full { display: block; text-align: center; padding: 8px; background: #1a1a1a; color: white; border-radius: 6px; font-size: 13px; font-weight: 500; text-decoration: none; }
        .btn-orange { padding: 8px 18px; background: #f5a623; color: #1a1a1a; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; }
        .empty { text-align: center; padding: 48px 0; }
        .profile-card { background: white; border: 1px solid #eee; border-radius: 10px; padding: 32px; max-width: 500px; }
        .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: #f0ede8; border: 2px solid #e0e0e0; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: #888; margin-bottom: 24px; }
        .profile-row { display: flex; flex-direction: column; gap: 4px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; margin-bottom: 4px; }
        .profile-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .profile-value { font-size: 15px; color: #1a1a1a; font-weight: 500; }
        .role-badge { background: #f0ede8; color: #888; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .edit-input { border: 1.5px solid #e0e0e0; border-radius: 7px; padding: 10px 14px; font-size: 14px; font-family: inherit; outline: none; width: 100%; }
        .cert-card { background: white; border: 1.5px solid #e8e8e8; border-radius: 10px; padding: 24px; text-align: center; }
        .cert-icon { font-size: 32px; margin-bottom: 12px; }
        .cert-title { font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .cert-sub { font-size: 12px; color: #888; margin-bottom: 10px; }
        .cert-status { font-size: 11px; color: #f5a623; font-weight: 500; }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          margin-bottom: 16px;
          color: #1a1a1a;
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.4);
          z-index: 99;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0; left: -220px;
            height: 100%;
            z-index: 100;
            transition: left 0.3s ease;
          }
          .sidebar.open { left: 0; }
          .sidebar-overlay.open { display: block; }
          .mobile-menu-btn { display: block; }
          .dashboard-main { padding: 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .courses-grid { grid-template-columns: 1fr; }
          .dash-title { font-size: 18px; }
          .profile-card { padding: 20px; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .courses-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="dashboard-wrapper">
        {/* OVERLAY */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          {profileData.photo ? (
            <img src={profileData.photo} alt="avatar"
              style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e0e0', display: 'block', margin: '0 auto 10px' }} />
          ) : (
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          )}
          <div className="user-name">{user?.name}</div>
          <div className="user-email">{user?.email}</div>
          <div className="divider"></div>
          {[
            { label: 'My Courses', tab: 'courses' },
            { label: 'Profile', tab: 'profile' },
            { label: 'Certificates', tab: 'certificates' },
          ].map((item) => (
            <div key={item.tab}
              className={`menu-item ${activeTab === item.tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}>
              <div className={`menu-dot ${activeTab === item.tab ? 'active' : ''}`}></div>
              {item.label}
            </div>
          ))}
          <div className="divider"></div>
          <div className="menu-item" onClick={() => { logout(); navigate('/'); }}>
            <div className="menu-dot"></div>Logout
          </div>
        </div>

        {/* MAIN */}
        <div className="dashboard-main">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>☰ Menu</button>

          {/* MY COURSES */}
          {activeTab === 'courses' && (
            <>
              <div className="dash-header">
                <div>
                  <div className="dash-title">My Dashboard</div>
                  <div className="dash-sub">Welcome back, {user?.name}!</div>
                </div>
                <Link to="/courses" className="btn-orange">+ Explore Courses</Link>
              </div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Enrolled</div><div className="stat-num">{enrolledCourses.length}</div></div>
                <div className="stat-card"><div className="stat-label">In Progress</div><div className="stat-num">{enrolledCourses.length}</div></div>
                <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-num">0</div></div>
              </div>
              <div className="section-title">My Enrolled Courses</div>
              {loading ? (
                <p style={{ color: '#888' }}>Loading your courses...</p>
              ) : enrolledCourses.length > 0 ? (
                <div className="courses-grid">
                  {enrolledCourses.map(course => (
                    <div key={course._id} className="course-card">
                      {course.image ? (
                        <img src={course.image} alt={course.title} />
                      ) : (
                        <div className="card-img-placeholder">[ Thumbnail ]</div>
                      )}
                      <div className="card-body">
                        <div className="card-tag">{course.category}</div>
                        <div className="card-title">{course.title}</div>
                        <div className="card-meta">⭐ {course.rating} · {course.duration}</div>
                        <div className="progress-bar"><div className="progress-fill"></div></div>
                        <div className="progress-text">40% Complete</div>
                        <Link to={`/courses/${course._id}`} className="btn-primary-full">Continue →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <p style={{ color: '#888', marginBottom: '16px' }}>No courses enrolled yet!</p>
                  <Link to="/courses" className="btn-orange">Browse Courses</Link>
                </div>
              )}
            </>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <>
              <div className="dash-header">
                <div>
                  <div className="dash-title">My Profile</div>
                  <div className="dash-sub">Your account information</div>
                </div>
                <button className="btn-orange" style={{ border: 'none', cursor: 'pointer' }}
                  onClick={() => setEditingProfile(!editingProfile)}>
                  {editingProfile ? '✕ Cancel' : '✏️ Edit Profile'}
                </button>
              </div>
              <div className="profile-card">
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {profileData.photo ? (
                    <img src={profileData.photo} alt="avatar"
                      style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e0e0' }} />
                  ) : (
                    <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                  )}
                  {editingProfile && (
                    <div style={{ flex: 1 }}>
                      <div className="profile-label">Photo URL</div>
                      <input className="edit-input" placeholder="https://example.com/photo.jpg"
                        value={profileData.photo}
                        onChange={e => setProfileData({ ...profileData, photo: e.target.value })} />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Full Name', key: 'name', type: 'input', placeholder: 'Your name', defaultVal: user?.name },
                    { label: 'Email', key: 'email', type: 'static', value: user?.email },
                    { label: 'Phone', key: 'phone', type: 'input', placeholder: 'Enter phone number' },
                    { label: 'Bio', key: 'bio', type: 'textarea', placeholder: 'Tell us about yourself...' },
                    { label: 'Location', key: 'location', type: 'input', placeholder: 'e.g. Delhi, India' },
                  ].map((field, i) => (
                    <div key={i} className="profile-row">
                      <div className="profile-label">{field.label}</div>
                      {field.type === 'static' ? (
                        <div className="profile-value">{field.value}</div>
                      ) : editingProfile ? (
                        field.type === 'textarea' ? (
                          <textarea className="edit-input" style={{ height: '80px', resize: 'vertical' }}
                            placeholder={field.placeholder}
                            value={profileData[field.key]}
                            onChange={e => setProfileData({ ...profileData, [field.key]: e.target.value })} />
                        ) : (
                          <input className="edit-input" placeholder={field.placeholder}
                            value={profileData[field.key]}
                            onChange={e => setProfileData({ ...profileData, [field.key]: e.target.value })} />
                        )
                      ) : (
                        <div className="profile-value">{profileData[field.key] || field.defaultVal || 'Not added yet'}</div>
                      )}
                    </div>
                  ))}
                  <div className="profile-row">
                    <div className="profile-label">Account Type</div>
                    <div className="profile-value"><span className="role-badge">{user?.role}</span></div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-label">Enrolled Courses</div>
                    <div className="profile-value">{enrolledCourses.length} courses</div>
                  </div>
                </div>
                {editingProfile && (
                  <button style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#f5a623', color: '#1a1a1a', border: 'none', borderRadius: '7px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => { localStorage.setItem('profileData', JSON.stringify(profileData)); setEditingProfile(false); }}>
                    Save Changes
                  </button>
                )}
              </div>
            </>
          )}

          {/* CERTIFICATES */}
          {activeTab === 'certificates' && (
            <>
              <div className="dash-header">
                <div>
                  <div className="dash-title">My Certificates</div>
                  <div className="dash-sub">Certificates you have earned</div>
                </div>
              </div>
              {enrolledCourses.length > 0 ? (
                <div className="courses-grid">
                  {enrolledCourses.map(course => (
                    <div key={course._id} className="cert-card">
                      <div className="cert-icon">🎓</div>
                      <div className="cert-title">{course.title}</div>
                      <div className="cert-sub">Instructor: {course.instructor}</div>
                      <div className="cert-status">In Progress — Complete course to earn certificate</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <p style={{ color: '#888', marginBottom: '16px' }}>No certificates yet!</p>
                  <Link to="/courses" className="btn-orange">Browse Courses</Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;