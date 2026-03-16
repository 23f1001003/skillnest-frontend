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

  if (!course) return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading...</div>;

  return (
    <div>
      <style>{`
        .detail-hero {
          background: #1a1a1a;
          padding: 40px;
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .detail-info { flex: 1; }
        .detail-tag {
          font-size: 12px;
          color: #f5a623;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .detail-title {
          font-size: 28px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .detail-desc {
          font-size: 14px;
          color: #aaa;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .detail-meta { display: flex; gap: 24px; flex-wrap: wrap; }
        .detail-meta-item {
          font-size: 13px;
          color: #666;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .enroll-card {
          width: 240px;
          background: white;
          border-radius: 10px;
          padding: 20px;
          flex-shrink: 0;
        }
        .enroll-thumb {
          width: 100%;
          height: 130px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .enroll-thumb-placeholder {
          height: 130px;
          background: #f0ede8;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #aaa;
          margin-bottom: 16px;
        }
        .enroll-price {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .enroll-note { font-size: 12px; color: #888; margin-bottom: 14px; }
        .enroll-msg {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 10px;
        }
        .enroll-btn {
          width: 100%;
          padding: 12px;
          background: #f5a623;
          color: #1a1a1a;
          border: none;
          border-radius: 7px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .enroll-btn:disabled { background: #888; cursor: not-allowed; }
        .includes { margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
        .includes-title {
          font-size: 12px;
          font-weight: 600;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .include-item { font-size: 13px; color: #666; padding: 3px 0; }
        .curriculum-section { padding: 32px 40px; }
        .section-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #888;
          margin-bottom: 16px;
        }
        .curr-item {
          border: 1px solid #eee;
          border-radius: 7px;
          padding: 13px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .curr-time { font-size: 12px; color: #888; }

        @media (max-width: 768px) {
          .detail-hero {
            flex-direction: column;
            padding: 24px 16px;
          }
          .detail-title { font-size: 20px; }
          .enroll-card { width: 100%; }
          .detail-meta { gap: 16px; }
          .curriculum-section { padding: 20px 16px; }
        }
      `}</style>

      <div className="detail-hero">
        <div className="detail-info">
          <div className="detail-tag">{course.category} · Beginner</div>
          <h1 className="detail-title">{course.title}</h1>
          <p className="detail-desc">{course.description}</p>
          <div className="detail-meta">
            <div className="detail-meta-item"><strong>Rating</strong>⭐ {course.rating}/5</div>
            <div className="detail-meta-item"><strong>Students</strong>{course.students}</div>
            <div className="detail-meta-item"><strong>Duration</strong>{course.duration}</div>
            <div className="detail-meta-item"><strong>Instructor</strong>{course.instructor}</div>
          </div>
        </div>

        <div className="enroll-card">
          {course.image ? (
            <img src={course.image} alt={course.title} className="enroll-thumb" />
          ) : (
            <div className="enroll-thumb-placeholder">[ No Image ]</div>
          )}
          <div className="enroll-price">₹{course.price}</div>
          <div className="enroll-note">Limited time offer!</div>
          {message && (
            <div className="enroll-msg" style={{
              background: enrolled ? '#dcfce7' : '#fce8e8',
              color: enrolled ? '#166534' : '#991f1f'
            }}>{message}</div>
          )}
          {user?.role !== 'admin' && (
            <button className="enroll-btn" onClick={handleEnroll} disabled={enrolled}>
              {enrolled ? '✓ Enrolled!' : 'Enroll Now'}
            </button>
          )}
          {!user && (
            <button className="enroll-btn" onClick={() => navigate('/login')}>
              Login to Enroll
            </button>
          )}
          <div className="includes">
            <div className="includes-title">This course includes</div>
            {['On-demand video', 'Downloadable resources', 'Certificate of completion', 'Lifetime access'].map((item, i) => (
              <div key={i} className="include-item">✓ {item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="curriculum-section">
        <div className="section-title">Course Curriculum</div>
        {['Introduction & Setup', 'Core Concepts', 'Building Projects', 'Advanced Topics', 'Final Project'].map((item, i) => (
          <div key={i} className="curr-item">
            <span>{i + 1}. {item}</span>
            <span className="curr-time">{(i + 1) * 45} min</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;