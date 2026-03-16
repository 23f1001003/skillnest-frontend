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
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(
  JSON.parse(localStorage.getItem('profileData')) || {
    name: '', phone: '', bio: '', location: '', photo: ''
  }
);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/courses/user/enrolled', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { setEnrolledCourses(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, []);

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div style={styles.userName}>{user?.name}</div>
        <div style={styles.userEmail}>{user?.email}</div>
        <div style={styles.divider}></div>
        {[
          { label: 'My Courses', tab: 'courses' },
          { label: 'Profile', tab: 'profile' },
          { label: 'Certificates', tab: 'certificates' },
        ].map((item) => (
          <div key={item.tab}
            style={{ ...styles.menuItem, ...(activeTab === item.tab ? styles.menuActive : {}) }}
            onClick={() => setActiveTab(item.tab)}>
            <div style={{ ...styles.menuDot, ...(activeTab === item.tab ? styles.menuDotActive : {}) }}></div>
            {item.label}
          </div>
        ))}
        <div style={styles.divider}></div>
        <div style={styles.menuItem} onClick={() => { logout(); navigate('/'); }}>
          <div style={styles.menuDot}></div>Logout
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* ---- MY COURSES TAB ---- */}
        {activeTab === 'courses' && (
          <>
            <div style={styles.header}>
              <div>
                <h2 style={styles.title}>My Dashboard</h2>
                <p style={styles.sub}>Welcome back, {user?.name}!</p>
              </div>
              <Link to="/courses" style={styles.btnOrange}>+ Explore Courses</Link>
            </div>

            <div style={styles.stats}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Enrolled Courses</div>
                <div style={styles.statNum}>{enrolledCourses.length}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>In Progress</div>
                <div style={styles.statNum}>{enrolledCourses.length}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Completed</div>
                <div style={styles.statNum}>0</div>
              </div>
            </div>

            <div style={styles.sectionTitle}>My Enrolled Courses</div>
            {loading ? (
              <p style={{ color: '#888' }}>Loading your courses...</p>
            ) : enrolledCourses.length > 0 ? (
              <div style={styles.grid}>
                {enrolledCourses.map(course => (
                  <div key={course._id} style={styles.card}>
                    {course.image ? (
                      <img src={course.image} alt={course.title} style={styles.cardImg} />
                    ) : (
                      <div style={styles.cardImgPlaceholder}>[ Thumbnail ]</div>
                    )}
                    <div style={styles.cardBody}>
                      <div style={styles.cardTag}>{course.category}</div>
                      <div style={styles.cardTitle}>{course.title}</div>
                      <div style={styles.cardMeta}>⭐ {course.rating} · {course.duration}</div>
                      <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: '40%' }}></div>
                      </div>
                      <div style={styles.progressText}>40% Complete</div>
                      <Link to={`/courses/${course._id}`} style={styles.btnPrimary}>Continue →</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.empty}>
                <p style={{ color: '#888', marginBottom: '16px' }}>You have not enrolled in any courses yet!</p>
                <Link to="/courses" style={styles.btnOrange}>Browse Courses</Link>
              </div>
            )}
          </>
        )}

        {/* ---- PROFILE TAB ---- */}
{activeTab === 'profile' && (
  <>
    <div style={styles.header}>
      <div>
        <h2 style={styles.title}>My Profile</h2>
        <p style={styles.sub}>Your account information</p>
      </div>
      <button style={styles.btnOrange} onClick={() => setEditingProfile(!editingProfile)}>
        {editingProfile ? '✕ Cancel' : '✏️ Edit Profile'}
      </button>
    </div>

    <div style={styles.profileCard}>
      {/* AVATAR */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        {profileData.photo ? (
          <img src={profileData.photo} alt="avatar"
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e0e0' }} />
        ) : (
          <div style={styles.profileAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        )}
        {editingProfile && (
          <div style={{ flex: 1 }}>
            <div style={styles.profileLabel}>Profile Photo URL</div>
            <input style={styles.editInput} placeholder="https://example.com/photo.jpg"
              value={profileData.photo}
              onChange={e => setProfileData({ ...profileData, photo: e.target.value })} />
          </div>
        )}
      </div>

      <div style={styles.profileInfo}>
        {/* NAME */}
        <div style={styles.profileRow}>
          <div style={styles.profileLabel}>Full Name</div>
          {editingProfile ? (
            <input style={styles.editInput} value={profileData.name}
              onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
          ) : (
            <div style={styles.profileValue}>{profileData.name || user?.name}</div>
          )}
        </div>

        {/* EMAIL */}
        <div style={styles.profileRow}>
          <div style={styles.profileLabel}>Email Address</div>
          <div style={styles.profileValue}>{user?.email}</div>
        </div>

        {/* PHONE */}
        <div style={styles.profileRow}>
          <div style={styles.profileLabel}>Phone Number</div>
          {editingProfile ? (
            <input style={styles.editInput} placeholder="Enter phone number"
              value={profileData.phone}
              onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
          ) : (
            <div style={styles.profileValue}>{profileData.phone || 'Not added yet'}</div>
          )}
        </div>

        {/* BIO */}
        <div style={styles.profileRow}>
          <div style={styles.profileLabel}>Bio</div>
          {editingProfile ? (
            <textarea style={{ ...styles.editInput, height: '80px', resize: 'vertical' }}
              placeholder="Tell us about yourself..."
              value={profileData.bio}
              onChange={e => setProfileData({ ...profileData, bio: e.target.value })} />
          ) : (
            <div style={styles.profileValue}>{profileData.bio || 'Not added yet'}</div>
          )}
        </div>

        {/* LOCATION */}
        <div style={styles.profileRow}>
          <div style={styles.profileLabel}>Location</div>
          {editingProfile ? (
            <input style={styles.editInput} placeholder="e.g. Delhi, India"
              value={profileData.location}
              onChange={e => setProfileData({ ...profileData, location: e.target.value })} />
          ) : (
            <div style={styles.profileValue}>{profileData.location || 'Not added yet'}</div>
          )}
        </div>

        {/* ROLE & COURSES */}
        <div style={styles.profileRow}>
          <div style={styles.profileLabel}>Account Type</div>
          <div style={styles.profileValue}>
            <span style={styles.roleBadge}>{user?.role}</span>
          </div>
        </div>

        <div style={styles.profileRow}>
          <div style={styles.profileLabel}>Enrolled Courses</div>
          <div style={styles.profileValue}>{enrolledCourses.length} courses</div>
        </div>
      </div>

      {editingProfile && (
        <button style={{ ...styles.btnOrange, marginTop: '20px', width: '100%', padding: '12px' }}
          onClick={() => {
            localStorage.setItem('profileData', JSON.stringify(profileData));
            setEditingProfile(false);
          }}>
          Save Changes
        </button>
      )}
    </div>
  </>
)}

        {/* ---- CERTIFICATES TAB ---- */}
        {activeTab === 'certificates' && (
          <>
            <div style={styles.header}>
              <div>
                <h2 style={styles.title}>My Certificates</h2>
                <p style={styles.sub}>Certificates you have earned</p>
              </div>
            </div>
            {enrolledCourses.length > 0 ? (
              <div style={styles.grid}>
                {enrolledCourses.map(course => (
                  <div key={course._id} style={styles.certCard}>
                    <div style={styles.certIcon}>🎓</div>
                    <div style={styles.certTitle}>{course.title}</div>
                    <div style={styles.certSub}>Instructor: {course.instructor}</div>
                    <div style={styles.certStatus}>In Progress — Complete the course to earn certificate</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.empty}>
                <p style={{ color: '#888', marginBottom: '16px' }}>No certificates yet. Enroll and complete a course first!</p>
                <Link to="/courses" style={styles.btnOrange}>Browse Courses</Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', background: '#fafaf8' },
  sidebar: { width: '220px', background: 'white', borderRight: '1px solid #eee', padding: '28px 0', flexShrink: 0 },
  avatar: { width: '52px', height: '52px', borderRadius: '50%', background: '#f0ede8', border: '2px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#888', margin: '0 auto 10px' },
  userName: { textAlign: 'center', fontSize: '14px', fontWeight: '600', padding: '0 16px' },
  userEmail: { textAlign: 'center', fontSize: '11px', color: '#aaa', marginBottom: '16px', padding: '0 16px' },
  divider: { height: '1px', background: '#f0f0f0', margin: '8px 0' },
  menuItem: { padding: '10px 20px', fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  menuActive: { color: '#1a1a1a', background: '#f0ede8', borderLeft: '3px solid #f5a623', fontWeight: '500' },
  menuDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#ddd', flexShrink: 0 },
  menuDotActive: { background: '#f5a623' },
  main: { flex: 1, padding: '28px 32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '600', color: '#1a1a1a' },
  sub: { fontSize: '13px', color: '#888', marginTop: '4px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' },
  statCard: { background: 'white', border: '1px solid #eee', borderRadius: '8px', padding: '16px' },
  statLabel: { fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
  statNum: { fontSize: '26px', fontWeight: '700', color: '#1a1a1a' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  card: { border: '1.5px solid #e8e8e8', borderRadius: '10px', overflow: 'hidden', background: 'white' },
  cardImg: { width: '100%', height: '110px', objectFit: 'cover' },
  cardImgPlaceholder: { height: '110px', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#aaa' },
  cardBody: { padding: '14px' },
  cardTag: { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#f5a623', marginBottom: '4px' },
  cardTitle: { fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#1a1a1a' },
  cardMeta: { fontSize: '12px', color: '#888', marginBottom: '10px' },
  progressBar: { height: '4px', background: '#f0f0f0', borderRadius: '2px', marginBottom: '4px' },
  progressFill: { height: '100%', background: '#f5a623', borderRadius: '2px' },
  progressText: { fontSize: '11px', color: '#aaa', marginBottom: '10px' },
  btnPrimary: { display: 'block', textAlign: 'center', padding: '8px', background: '#1a1a1a', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' },
  btnOrange: { padding: '8px 18px', background: '#f5a623', color: '#1a1a1a', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' },
  empty: { textAlign: 'center', padding: '48px 0' },
  profileCard: { background: 'white', border: '1px solid #eee', borderRadius: '10px', padding: '32px', maxWidth: '500px' },
  profileAvatar: { width: '72px', height: '72px', borderRadius: '50%', background: '#f0ede8', border: '2px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#888', marginBottom: '24px' },
  profileInfo: { display: 'flex', flexDirection: 'column', gap: '16px' },
  profileRow: { display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' },
  profileLabel: { fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' },
  profileValue: { fontSize: '15px', color: '#1a1a1a', fontWeight: '500' },
  roleBadge: { background: '#f0ede8', color: '#888', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  certCard: { background: 'white', border: '1.5px solid #e8e8e8', borderRadius: '10px', padding: '24px', textAlign: 'center' },
  certIcon: { fontSize: '32px', marginBottom: '12px' },
  certTitle: { fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '6px' },
  certSub: { fontSize: '12px', color: '#888', marginBottom: '10px' },
  certStatus: { fontSize: '11px', color: '#f5a623', fontWeight: '500' },
  editInput: { border: '1.5px solid #e0e0e0', borderRadius: '7px', padding: '10px 14px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', width: '100%' },
};

export default Dashboard;