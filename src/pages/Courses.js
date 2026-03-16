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
    // URL se search query lo
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
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <input
            placeholder="Search courses..."
            style={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.categories}>
          <span
            style={{ ...styles.catBtn, ...(category === 'All' ? styles.catActive : {}) }}
            onClick={() => setCategory('All')}
          >
            All
          </span>
          {categories.map(cat => (
            <span
              key={cat._id}
              style={{ ...styles.catBtn, ...(category === cat.name ? styles.catActive : {}) }}
              onClick={() => setCategory(cat.name)}
            >
              {cat.name}
            </span>
          ))}
        </div>
        <span style={styles.count}>Showing {filtered.length} courses</span>
      </div>

      <div style={styles.section}>
        {filtered.length > 0 ? (
          <div style={styles.grid}>
            {filtered.map(course => (
              <div key={course._id} style={styles.card}>
                {course.image ? (
                  <img src={course.image} alt={course.title} style={styles.cardImg} />
                ) : (
                  <div style={styles.cardImgPlaceholder}>[ Thumbnail ]</div>
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
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <p style={{ color: '#888', fontSize: '16px' }}>No courses found!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  filterBar: { padding: '16px 40px', background: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  searchBox: { display: 'flex' },
  searchInput: { padding: '8px 16px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '220px' },
  categories: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: { padding: '6px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: '1px solid #ddd', background: 'white', color: '#666' },
  catActive: { background: '#1a1a1a', color: 'white', border: '1px solid #1a1a1a' },
  count: { marginLeft: 'auto', fontSize: '12px', color: '#888' },
  section: { padding: '32px 40px' },
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
  empty: { textAlign: 'center', padding: '60px 0' },
};

export default Courses;