import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) setSearch(searchParam);

    axios.get('https://skillnest-backend-9xud.onrender.com/api/courses')
      .then(res => { setCourses(res.data); setFiltered(res.data); })
      .catch(err => console.log(err));

    axios.get('https://skillnest-backend-9xud.onrender.com/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, [location.search]);

  useEffect(() => {
    let result = courses;
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [category, search, courses]);

  return (
    <div>
      <style>{`
        .filter-bar {
          padding: 16px 40px;
          background: #fafafa;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-input {
          padding: 8px 16px;
          border: 1.5px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          width: 220px;
        }
        .cat-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .cat-btn {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          border: 1px solid #ddd;
          background: white;
          color: #666;
        }
        .cat-btn.active {
          background: #1a1a1a;
          color: white;
          border: 1px solid #1a1a1a;
        }
        .count { margin-left: auto; font-size: 12px; color: #888; }
        .courses-section { padding: 32px 40px; }
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
        .course-card img { width: 100%; height: 110px; object-fit: cover; }
        .card-img-placeholder {
          height: 110px;
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
        .card-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; color: #1a1a1a; }
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
        .empty { text-align: center; padding: 60px 0; color: #888; }

        @media (max-width: 768px) {
          .filter-bar { padding: 12px 16px; flex-direction: column; align-items: flex-start; }
          .search-input { width: 100%; }
          .count { margin-left: 0; }
          .courses-section { padding: 20px 16px; }
          .courses-grid { grid-template-columns: 1fr; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .courses-grid { grid-template-columns: repeat(2, 1fr); }
          .courses-section { padding: 24px; }
        }
      `}</style>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="cat-filters">
          <span
            className={`cat-btn ${category === 'All' ? 'active' : ''}`}
            onClick={() => setCategory('All')}
          >All</span>
          {categories.map(cat => (
            <span
              key={cat._id}
              className={`cat-btn ${category === cat.name ? 'active' : ''}`}
              onClick={() => setCategory(cat.name)}
            >{cat.name}</span>
          ))}
        </div>
        <span className="count">Showing {filtered.length} courses</span>
      </div>

      <div className="courses-section">
        {filtered.length > 0 ? (
          <div className="courses-grid">
            {filtered.map(course => (
              <div key={course._id} className="course-card">
                {course.image ? (
                  <img src={course.image} alt={course.title} />
                ) : (
                  <div className="card-img-placeholder">[ Thumbnail ]</div>
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
            ))}
          </div>
        ) : (
          <div className="empty">No courses found!</div>
        )}
      </div>
    </div>
  );
};

export default Courses;