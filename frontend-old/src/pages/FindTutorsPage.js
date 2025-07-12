//FindTutorsPage.js

// frontend/src/pages/FindTutorsPage.js
import React from 'react';
import CreateTutorForm from '../CreateTutorForm'; // Make sure the path is correct

function FindTutorsPage({
  apiTutors,
  loadingTutors,
  tutorsError,
  filters,
  setFilters,
  allLanguages,
  filteredTutors,
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  handleReadMore,
  handleTutorCreated,
}) {
  return (
    <section id="tutor-list-section" className="section-spacing tutor-listing-section">
      {/* Call to Action before Tutor List */}
      <section className="find-tutors-cta-section">
        <h2>Ready to Start Your Language Journey?</h2>
        <p>Browse our extensive list of professional tutors and find your perfect match today!</p>
      </section>

      {/* Create Tutor Form - Keep this for now, perhaps move to a dedicated "Become a Tutor" page later */}
      <section className="section-spacing">
        <CreateTutorForm onTutorCreated={handleTutorCreated} />
      </section>

      <h2>Our Professional Tutors</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, language, or keyword..."
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

      {loadingTutors ? (
        <p className="loading-message">Loading tutors...</p>
      ) : tutorsError ? (
        <p className="error-message">{tutorsError}</p>
      ) : (
        <div className="tutor-list">
          {filteredTutors.length === 0 && <p className="no-results-message">No tutors found matching your filters.</p>}
          {filteredTutors.map(tutor => (
            <div className="tutor-card" key={tutor.id}>
              <div className="card-left">
                <img src={tutor.avatar || 'https://via.placeholder.com/150'} alt={tutor.name} className="avatar" />
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
                <p className="meta">{tutor.students || 0} active students • {tutor.lessons ? tutor.lessons.toLocaleString() : 0} lessons</p>
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
                  {(tutor.reviews || []).map((r, i) => (
                    <li key={i}>"{r}"</li>
                  ))}
                  {(comments[tutor.id] || []).map((c, i) => (
                    <li key={`c${i}`} className="user-comment">
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="price-box">
                  <span className="rating">⭐ {tutor.rating ? tutor.rating.toFixed(1) : 'N/A'}</span>
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
      )}
    </section>
  );
}

export default FindTutorsPage;