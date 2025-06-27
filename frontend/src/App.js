import React, { useState, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { tutors } from './tutors';
import './App.css';

function App() {
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    language: 'All',
    onlineOnly: false,
    maxPrice: 100,
  });

  const allLanguages = useMemo(() => {
    const langsSet = new Set();
    tutors.forEach(tutor => {
      tutor.languages.split(',').map(l => l.trim()).forEach(lang => langsSet.add(lang));
    });
    return ['All', ...Array.from(langsSet).sort()];
  }, []);

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const searchLower = filters.search.toLowerCase();
      if (
        filters.search &&
        !(
          tutor.name.toLowerCase().includes(searchLower) ||
          tutor.bio.toLowerCase().includes(searchLower)
        )
      ) return false;

      if (
        filters.language !== 'All' &&
        !tutor.languages.toLowerCase().includes(filters.language.toLowerCase())
      ) return false;

      if (filters.onlineOnly && !tutor.online) return false;

      if (tutor.price > filters.maxPrice) return false;

      return true;
    });
  }, [filters]);

  function handleAddComment(tutorId) {
    if (!newComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [tutorId]: [...(prev[tutorId] || []), newComment.trim()],
    }));
    setNewComment('');
  }

  function handleReadMore(tutor) {
    alert(`\n🌍 ${tutor.name}'s Full Bio\n\n${tutor.bio}\n\n🗣️ Languages: ${tutor.languages}\n📚 Total Lessons: ${tutor.lessons.toLocaleString()}\n👥 Students: ${tutor.students}\n⭐ Rating: ${tutor.rating}`);
  }

  function handleLoginSuccess(credentialResponse) {
    // Decode the JWT token to get user info
    const base64Url = credentialResponse.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const userInfo = JSON.parse(jsonPayload);
    setUser({
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture
    });
    console.log('Login success:', credentialResponse);
  }

  function handleLogout() {
    setUser(null);
  }

  // Show login screen if user is not logged in
  if (!user) {
    return (
      <GoogleOAuthProvider clientId="128684987220-q3q3vk24u44a1miu2a5kmbimr9ku00hv.apps.googleusercontent.com">
        <div className="app">
          <header className="header">
            <h1>LangZone Tutors</h1>
            <p>Find the right tutor to help you succeed in your language journey.</p>
            
            <div className="login-required">
              <div className="login-box">
                <h2>Welcome to LangZone!</h2>
                <p>Please sign in with your Google account to browse our amazing tutors and start your language learning journey.</p>
                
                <div className="google-login">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>
                
                <div className="features">
                  <h3>What you'll get access to:</h3>
                  <ul>
                    <li>🌟 Browse professional tutors from around the world</li>
                    <li>🔍 Advanced search and filtering options</li>
                    <li>💬 Direct messaging with tutors</li>
                    <li>📚 Book trial lessons instantly</li>
                    <li>⭐ Read authentic student reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          <footer className="footer">
            <p>© {new Date().getFullYear()} LangZone — Empowering learners globally.</p>
          </footer>
        </div>
      </GoogleOAuthProvider>
    );
  }

  // Show main app if user is logged in
  return (
    <GoogleOAuthProvider clientId="128684987220-q3q3vk24u44a1miu2a5kmbimr9ku00hv.apps.googleusercontent.com">
      <div className="app">
        <header className="header">
          <div className="header-top">
            <div>
              <h1>LangZone Tutors</h1>
              <p>Find the right tutor to help you succeed in your language journey.</p>
            </div>
            
            <div className="user-info">
              <img src={user.picture} alt={user.name} className="user-avatar" />
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name or keyword..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />

            <select
              value={filters.language}
              onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
            >
              {allLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <label className="online-filter">
              <input
                type="checkbox"
                checked={filters.onlineOnly}
                onChange={e => setFilters(f => ({ ...f, onlineOnly: e.target.checked }))}
              />
              Online Only
            </label>

            <label className="price-filter">
              Max Price: US${filters.maxPrice}
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
              />
            </label>
          </div>

          <div className="tutor-list">
            {filteredTutors.length === 0 && <p>No tutors found matching your filters.</p>}

            {filteredTutors.map(tutor => (
              <div className="tutor-card" key={tutor.id}>
                <div className="card-left">
                  <img src={tutor.avatar} alt={tutor.name} className="avatar" />
                  <span
                    className={`status-dot ${tutor.online ? 'online' : 'away'}`}
                    title={tutor.online ? 'Online' : 'Away'}
                  />
                </div>

                <div className="card-right">
                  <div className="tutor-header">
                    <h2>{tutor.name}</h2>
                    <span className="badge">Professional</span>
                  </div>
                  <p className="meta">{tutor.students} active students • {tutor.lessons.toLocaleString()} lessons</p>
                  <p className="meta">🗣️ {tutor.languages}</p>
                  <p className="bio">
                    {tutor.bio.length > 120 ? `${tutor.bio.slice(0, 120)}...` : tutor.bio}{' '}
                    {tutor.bio.length > 120 && (
                      <button onClick={() => handleReadMore(tutor)} className="read-more">
                        Read more
                      </button>
                    )}
                  </p>

                  <ul className="reviews">
                    {tutor.reviews.map((r, i) => (
                      <li key={i}>"{r}"</li>
                    ))}
                    {(comments[tutor.id] || []).map((c, i) => (
                      <li key={`c${i}`} className="user-comment">
                        {c}
                      </li>
                    ))}
                  </ul>

                  <div className="price-box">
                    <span className="rating">⭐ {tutor.rating.toFixed(1)}</span>
                    <span className="price">
                      US${tutor.price} <small>/ 50-min</small>
                    </span>
                  </div>

                  <div className="actions">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <button onClick={() => handleAddComment(tutor.id)} className="comment-btn">
                      Send message
                    </button>
                    <button className="book-btn">Book trial lesson</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} LangZone — Empowering learners globally.</p>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;