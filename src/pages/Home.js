import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => setCourses(res.data.slice(0, 3)))
      .catch(err => console.log(err));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/courses?search=${searchQuery}`);
    } else {
      navigate('/courses');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Find Your <span style={styles.orange}>Next Skill</span><br />Learn Smarter
        </h1>
        <p style={styles.heroSub}>Discover short courses & workshops from expert instructors</p>
        <div style={styles.searchBox}>
          <input
            placeholder="Search courses, topics, skills..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
        </div>
        <div style={styles.heroStats}>
          <span>✓ 500+ Courses</span>
          <span>✓ Expert Instructors</span>
          <span>✓ Certificates</span>
        </div>
      </div>

      {/* FEATURED COURSES */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Featured Courses</div>
        <div style={styles.grid}>
          {courses.length > 0 ? courses.map(course => (
            <div key={course._id} style={styles.card}>
              {course.image ? (
                <img src={course.image} alt={course.title} style={styles.cardImg} />
              ) : (
                <div style={styles.cardImgPlaceholder}>[ Course Thumbnail ]</div>
              )}
              <div style={styles.cardBody}>
                <div style={styles.cardTag}>{course.category}</div>
                <div style={styles.cardTitle}>{course.title}</div>
                <div style={styles.cardMeta}>⭐ {course.rating} · {course.duration} · {course.students} students</div>
                <div style={styles.cardFooter}>
                  <div style={styles.price}>₹{course.price}</div>
                  <Link to={`/courses/${course._id}`} style={styles.btnOrange}>View Course</Link>
                </div>
              </div>
            </div>
          )) : (
            ['React.js for Beginners', 'UI/UX Design Fundamentals', 'Python & Data Science'].map((title, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.cardImgPlaceholder}>[ Course Thumbnail ]</div>
                <div style={styles.cardBody}>
                  <div style={styles.cardTag}>{['Web Dev', 'Design', 'Data'][i]}</div>
                  <div style={styles.cardTitle}>{title}</div>
                  <div style={styles.cardMeta}>⭐ 4.8 · 12h · 1,200 students</div>
                  <div style={styles.cardFooter}>
                    <div style={styles.price}>₹499</div>
                    <Link to="/courses" style={styles.btnOrange}>View Course</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/courses" style={styles.btnPrimary}>View All Courses →</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    padding: '70px 40px 50px', textAlign: 'center',
    background: 'linear-gradient(135deg, #fafaf8 0%, #f0ede8 100%)',
  },
  heroTitle: { fontSize: '44px', fontWeight: '300', letterSpacing: '-1.5px', marginBottom: '12px', color: '#1a1a1a' },
  orange: { color: '#f5a623', fontWeight: '700' },
  heroSub: { color: '#888', fontSize: '16px', marginBottom: '28px' },
  searchBox: {
    display: 'flex', maxWidth: '480px', margin: '0 auto',
    border: '1.5px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: 'white',
  },
  searchInput: {
    flex: 1, padding: '13px 16px', border: 'none', outline: 'none',
    fontSize: '14px', fontFamily: 'inherit',
  },
  searchBtn: {
    padding: '13px 22px', background: '#1a1a1a', color: 'white',
    border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
  },
  heroStats: { display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '16px', fontSize: '13px', color: '#aaa' },
  section: { padding: '40px' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { border: '1.5px solid #e8e8e8', borderRadius: '10px', overflow: 'hidden', background: 'white' },
  cardImg: { width: '100%', height: '110px', objectFit: 'cover' },
  cardImgPlaceholder: { height: '110px', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#aaa' },
  cardBody: { padding: '16px' },
  cardTag: { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#f5a623', marginBottom: '6px' },
  cardTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '6px', color: '#1a1a1a' },
  cardMeta: { fontSize: '12px', color: '#888', marginBottom: '14px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f0f0f0' },
  price: { fontSize: '16px', fontWeight: '700', color: '#1a1a1a' },
  btnOrange: { padding: '6px 14px', background: '#f5a623', color: '#1a1a1a', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' },
  btnPrimary: { padding: '12px 28px', background: '#1a1a1a', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textDecoration: 'none' },
};

export default Home;