import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://skillnest-backend-9xud.onrender.com/api/courses')
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
      <style>{`
        .hero {
          padding: 70px 40px 50px;
          text-align: center;
          background: linear-gradient(135deg, #fafaf8 0%, #f0ede8 100%);
        }
        .hero-title {
          font-size: 44px;
          font-weight: 300;
          letter-spacing: -1.5px;
          margin-bottom: 12px;
          color: #1a1a1a;
          line-height: 1.2;
        }
        .hero-title span { color: #f5a623; font-weight: 700; }
        .hero-sub { color: #888; font-size: 16px; margin-bottom: 28px; }
        .search-box {
          display: flex;
          max-width: 480px;
          margin: 0 auto;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }
        .search-box input {
          flex: 1;
          padding: 13px 16px;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: inherit;
        }
        .search-box button {
          padding: 13px 22px;
          background: #1a1a1a;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        .hero-stats {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin-top: 16px;
          font-size: 13px;
          color: #aaa;
          flex-wrap: wrap;
        }
        .section { padding: 40px; }
        .section-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #888;
          margin-bottom: 20px;
        }
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .course-card {
          border: 1.5px solid #e8e8e8;
          border-radius: 10px;
          overflow: hidden;
          background: white;
        }
        .course-card img, .card-img-placeholder {
          width: 100%;
          height: 110px;
          object-fit: cover;
        }
        .card-img-placeholder {
          background: #f0ede8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #aaa;
        }
        .card-body { padding: 16px; }
        .card-tag {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #f5a623;
          margin-bottom: 6px;
        }
        .card-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #1a1a1a;
        }
        .card-meta { font-size: 12px; color: #888; margin-bottom: 14px; }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
        .price { font-size: 16px; font-weight: 700; color: #1a1a1a; }
        .btn-orange {
          padding: 6px 14px;
          background: #f5a623;
          color: #1a1a1a;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }
        .btn-primary {
          padding: 12px 28px;
          background: #1a1a1a;
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
        }
        .view-all { text-align: center; margin-top: 32px; }

        @media (max-width: 768px) {
          .hero { padding: 40px 16px 30px; }
          .hero-title { font-size: 28px; letter-spacing: -0.5px; }
          .hero-sub { font-size: 14px; }
          .search-box { max-width: 100%; }
          .search-box input { font-size: 13px; padding: 10px 12px; }
          .search-box button { padding: 10px 14px; font-size: 13px; }
          .section { padding: 24px 16px; }
          .courses-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 12px; font-size: 12px; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .courses-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-title { font-size: 36px; }
          .section { padding: 32px 24px; }
        }
      `}</style>

      {/* HERO */}
      <div className="hero">
        <h1 className="hero-title">
          Find Your <span>Next Skill</span><br />Learn Smarter
        </h1>
        <p className="hero-sub">Discover short courses & workshops from expert instructors</p>
        <div className="search-box">
          <input
            placeholder="Search courses, topics, skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="hero-stats">
          <span>✓ 500+ Courses</span>
          <span>✓ Expert Instructors</span>
          <span>✓ Certificates</span>
        </div>
      </div>

      {/* FEATURED COURSES */}
      <div className="section">
        <div className="section-title">Featured Courses</div>
        <div className="courses-grid">
          {courses.length > 0 ? courses.map(course => (
            <div key={course._id} className="course-card">
              {course.image ? (
                <img src={course.image} alt={course.title} />
              ) : (
                <div className="card-img-placeholder">[ Course Thumbnail ]</div>
              )}
              <div className="card-body">
                <div className="card-tag">{course.category}</div>
                <div className="card-title">{course.title}</div>
                <div className="card-meta">⭐ {course.rating} · {course.duration} · {course.students} students</div>
                <div className="card-footer">
                  <div className="price">₹{course.price}</div>
                  <Link to={`/courses/${course._id}`} className="btn-orange">View Course</Link>
                </div>
              </div>
            </div>
          )) : (
            ['React.js for Beginners', 'UI/UX Design Fundamentals', 'Python & Data Science'].map((title, i) => (
              <div key={i} className="course-card">
                <div className="card-img-placeholder">[ Course Thumbnail ]</div>
                <div className="card-body">
                  <div className="card-tag">{['Web Dev', 'Design', 'Data'][i]}</div>
                  <div className="card-title">{title}</div>
                  <div className="card-meta">⭐ 4.8 · 12h · 1,200 students</div>
                  <div className="card-footer">
                    <div className="price">₹499</div>
                    <Link to="/courses" className="btn-orange">View Course</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="view-all">
          <Link to="/courses" className="btn-primary">View All Courses →</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;