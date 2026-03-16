import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`https://skillnest-backend-9xud.onrender.com/api/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await axios.post(
        `https://skillnest-backend-9xud.onrender.com/api/courses/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
      setMessage('Successfully enrolled!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error enrolling');
    }
  };

  if (!course) return <div style={styles.loading}>Loading...</div>;

  return (
    <div>
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroInfo}>
          <div style={styles.tag}>{course.category} · Beginner</div>
          <h1 style={styles.title}>{course.title}</h1>
          <p style={styles.desc}>{course.description}</p>
          <div style={styles.meta}>
            <div style={styles.metaItem}><strong>Rating</strong>⭐ {course.rating}/5</div>
            <div style={styles.metaItem}><strong>Students</strong>{course.students}</div>
            <div style={styles.metaItem}><strong>Duration</strong>{course.duration}</div>
            <div style={styles.metaItem}><strong>Instructor</strong>{course.instructor}</div>
          </div>
        </div>

        {/* ENROLL CARD */}
        <div style={styles.enrollCard}>
          {/* THUMBNAIL IMAGE */}
          {course.image ? (
            <img src={course.image} alt={course.title} style={styles.thumbnail} />
          ) : (
            <div style={styles.thumbnailPlaceholder}>[ No Image ]</div>
          )}

          <div style={styles.enrollPrice}>₹{course.price}</div>
          <div style={styles.enrollNote}>Limited time offer!</div>

          {message && (
            <div style={{
              ...styles.msg,
              background: enrolled ? '#dcfce7' : '#fce8e8',
              color: enrolled ? '#166534' : '#991f1f'
            }}>
              {message}
            </div>
          )}

          {/* ENROLL BUTTON — ONLY FOR LOGGED IN USER */}
          {user?.role !== 'admin' && (
            <button onClick={handleEnroll} style={{
              ...styles.enrollBtn,
              background: enrolled ? '#888' : '#f5a623',
              cursor: enrolled ? 'not-allowed' : 'pointer'
            }} disabled={enrolled}>
              {enrolled ? '✓ Enrolled!' : 'Enroll Now'}
            </button>
          )}

          {!user && (
            <button onClick={() => navigate('/login')} style={styles.enrollBtn}>
              Login to Enroll
            </button>
          )}

          <div style={styles.includes}>
            <div style={styles.includesTitle}>This course includes</div>
            {['On-demand video', 'Downloadable resources', 'Certificate of completion', 'Lifetime access'].map((item, i) => (
              <div key={i} style={styles.includeItem}>✓ {item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CURRICULUM */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Course Curriculum</div>
        {['Introduction & Setup', 'Core Concepts', 'Building Projects', 'Advanced Topics', 'Final Project'].map((item, i) => (
          <div key={i} style={styles.currItem}>
            <span>{i + 1}. {item}</span>
            <span style={styles.currTime}>{(i + 1) * 45} min</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  loading: { padding: '60px', textAlign: 'center', color: '#888' },
  hero: { background: '#1a1a1a', padding: '40px', display: 'flex', gap: '32px', alignItems: 'flex-start' },
  heroInfo: { flex: 1 },
  tag: { fontSize: '12px', color: '#f5a623', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' },
  title: { fontSize: '28px', fontWeight: '600', color: 'white', letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.3 },
  desc: { fontSize: '14px', color: '#aaa', lineHeight: '1.7', marginBottom: '20px' },
  meta: { display: 'flex', gap: '24px' },
  metaItem: { fontSize: '13px', color: '#666', display: 'flex', flexDirection: 'column', gap: '2px' },
  enrollCard: { width: '240px', background: 'white', borderRadius: '10px', padding: '20px', flexShrink: 0 },
  thumbnail: { width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', marginBottom: '16px' },
  thumbnailPlaceholder: { height: '130px', background: '#f0ede8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#aaa', marginBottom: '16px' },
  enrollPrice: { fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' },
  enrollNote: { fontSize: '12px', color: '#888', marginBottom: '14px' },
  msg: { padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '10px' },
  enrollBtn: { width: '100%', padding: '12px', background: '#f5a623', color: '#1a1a1a', border: 'none', borderRadius: '7px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' },
  includes: { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' },
  includesTitle: { fontSize: '12px', fontWeight: '600', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  includeItem: { fontSize: '13px', color: '#666', padding: '3px 0' },
  section: { padding: '32px 40px' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '16px' },
  currItem: { border: '1px solid #eee', borderRadius: '7px', padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', marginBottom: '8px' },
  currTime: { fontSize: '12px', color: '#888' },
};

export default CourseDetail;