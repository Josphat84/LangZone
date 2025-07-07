// File: frontend/src/App.js
// This file contains the main application component for the LangZone Tutors app.
// It includes user authentication, tutor listing, filtering, and commenting functionality.
// It uses React hooks for state management and the Google OAuth library for authentication.
// It also fetches tutor data from a backend API and allows users to create new tutors.
// It is styled with a separate CSS file and includes a form for creating new tutors.
// FOR NOW, ALL CONTENT IS KEPT WITHIN APP.JS, AND NAVIGATION LINKS ARE PLACEHOLDERS OR ANCHORS.

import React, { useState, useEffect, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './App.css'; // Make sure this CSS file is comprehensive
import CreateTutorForm from './CreateTutorForm'; // Assuming this component is separate


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

  // State to hold the tutors fetched from the API
  const [apiTutors, setApiTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [tutorsError, setTutorsError] = useState('');

  // Function to fetch tutors from the backend API
  const fetchTutors = async () => {
    setLoadingTutors(true);
    setTutorsError('');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tutors/`);
      const fetchedData = response.data.map(tutor => ({
        ...tutor,
        avatar: tutor.avatar || 'https://via.placeholder.com/150', // Default avatar
        reviews: tutor.reviews || [],
        lessons: tutor.lessons || 0,
        students: tutor.students || 0,
        rating: tutor.rating || 0.0, // Default rating
      }));
      setApiTutors(fetchedData);
      console.log('Tutors fetched from API:', fetchedData);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setTutorsError('Failed to load tutors from the server. Please ensure the backend is running and accessible.');
    } finally {
      setLoadingTutors(false);
    }
  };

  // Use useEffect to fetch tutors when the component mounts
  useEffect(() => {
    fetchTutors();
  }, []); // Empty dependency array means this runs once on mount

  // Pass this function to CreateTutorForm so it can trigger a re-fetch
  const handleTutorCreated = () => {
    fetchTutors(); // Re-fetch tutors after a new one is created
  };

  const allLanguages = useMemo(() => {
    const langsSet = new Set();
    apiTutors.forEach(tutor => {
      if (tutor.languages && typeof tutor.languages === 'string') {
        tutor.languages.split(',').map(l => l.trim()).forEach(lang => langsSet.add(lang));
      }
    });
    return ['All', ...Array.from(langsSet).sort()];
  }, [apiTutors]);

  const filteredTutors = useMemo(() => {
    return apiTutors.filter(tutor => {
      const searchLower = filters.search.toLowerCase();
      if (
        filters.search &&
        !(
          tutor.name.toLowerCase().includes(searchLower) ||
          tutor.bio.toLowerCase().includes(searchLower) ||
          (tutor.languages && tutor.languages.toLowerCase().includes(searchLower))
        )
      ) return false;

      if (
        filters.language !== 'All' &&
        (!tutor.languages || !tutor.languages.toLowerCase().includes(filters.language.toLowerCase()))
      ) return false;

      if (filters.onlineOnly && !tutor.online) return false;

      if (Number(tutor.price) > filters.maxPrice) return false;

      return true;
    });
  }, [filters, apiTutors]);

  function handleAddComment(tutorId) {
    if (!newComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [tutorId]: [...(prev[tutorId] || []), newComment.trim()],
    }));
    setNewComment('');
  }

  function handleReadMore(tutor) {
    alert(`\n🌍 ${tutor.name}'s Full Bio\n\n${tutor.bio}\n\n🗣️ Languages: ${tutor.languages}\n📚 Total Lessons: ${tutor.lessons ? tutor.lessons.toLocaleString() : 0}\n👥 Students: ${tutor.students || 0}\n⭐ Rating: ${tutor.rating ? tutor.rating.toFixed(1) : 'N/A'}`);
  }

  function handleLoginSuccess(credentialResponse) {
    try {
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
    } catch (error) {
      console.error('Error parsing credential response:', error);
    }
  }

  function handleLogout() {
    setUser(null);
  }

  // Render the login page if no user is logged in
  if (!user) {
    return (
      <GoogleOAuthProvider clientId="128684987220-q3q3vk24u44a1miu2a5kmbimr9ku00hv.apps.googleusercontent.com">
        <div className="app">
          <header className="header no-auth-header"> {/* Added class for specific styling */}
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
                      alert('Google login failed. Please try again.');
                    }}
                    useOneTap
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
          <footer className="footer login-footer"> {/* Simplified footer for login page */}
            <p>© {new Date().getFullYear()} LangZone — Empowering learners globally.</p>
          </footer>
        </div>
      </GoogleOAuthProvider>
    );
  }

  // Render the fully featured homepage and tutor listing once a user is logged in
  return (
    <GoogleOAuthProvider clientId="128684987220-q3q3vk24u44a1miu2a5kmbimr9ku00hv.apps.googleusercontent.com">
      <div className="app">
        {/* TOP NAVIGATION BAR */}
        <header className="main-header">
          <div className="header-container">
            <div className="logo">
              <a href="/">LangZone Tutors</a> {/* Clickable logo/name to go to top of page */}
            </div>
            <nav className="main-nav">
              <ul>
                <li><a href="#hero-section">Home</a></li>
                <li><a href="#how-it-works-section">How It Works</a></li>
                <li><a href="#tutor-list-section">Find Tutors</a></li> {/* Link to the tutor list */}
                {/* ABOUT US LINK - NOW POINTS TO ANCHOR ID WITHIN THIS SAME PAGE */}
                <li><a href="#about-us-section">About Us</a></li>
                <li><a href="#contact-section">Contact</a></li>
              </ul>
            </nav>
            <div className="user-profile">
              <img src={user.picture} alt={user.name} className="user-avatar" />
              <span className="user-name">Hello, {user.name.split(' ')[0]}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </header>

        <main className="main-content">
          {/* Hero Section */}
          <section id="hero-section" className="hero-section">
            <div className="hero-content">
              <h2>Master Any Language, Anywhere.</h2>
              <p>Connect with professional tutors for personalized 1-on-1 online lessons.</p>
              <button className="cta-button" onClick={() => {
                document.getElementById('tutor-list-section').scrollIntoView({ behavior: 'smooth' });
              }}>
                Start Your Free Trial
              </button>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works-section" className="section-spacing how-it-works-section">
            <h2>Your Path to Fluency in 3 Simple Steps</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-icon">1</div>
                <h3>Find Your Ideal Tutor</h3>
                <p>Browse diverse profiles, filter by language, price, and expertise.</p>
              </div>
              <div className="step-card">
                <div className="step-icon">2</div>
                <h3>Connect & Plan</h3>
                <p>Message tutors, discuss your goals, and find the perfect match.</p>
              </div>
              <div className="step-card">
                <div className="step-icon">3</div>
                <h3>Learn & Grow</h3>
                <p>Enjoy engaging online lessons tailored to your pace and needs.</p>
              </div>
            </div>
          </section>

          {/* Why Choose LangZone Section */}
          <section className="section-spacing why-choose-us-section">
            <div className="content-wrapper">
              <div className="why-choose-us-text">
                <h2>Why LangZone is Your Best Choice</h2>
                <p>We're dedicated to providing a superior language learning experience:</p>
                <ul>
                  <li>✅ **Expert Tutors:** Hand-picked, certified professionals.</li>
                  <li>✅ **Flexible Scheduling:** Learn anytime, anywhere.</li>
                  <li>✅ **Personalized Learning:** Lessons designed just for you.</li>
                  <li>✅ **Affordable & Transparent:** Clear pricing, no hidden fees.</li>
                  <li>✅ **Interactive Platform:** Engage with tools for effective learning.</li>
                </ul>
                <button className="secondary-cta-button" onClick={() => {
                  document.getElementById('tutor-list-section').scrollIntoView({ behavior: 'smooth' });
                }}>
                  Browse All Tutors
                </button>
              </div>
              <div className="why-choose-us-image">
                {/* You can add an image here, e.g., <img src="path/to/image.jpg" alt="Language Learning" /> */}
                <img src="https://via.placeholder.com/400x300?text=Engaging+Lessons" alt="Engaging Lessons" />
              </div>
            </div>
          </section>

          {/* Popular Languages/Subjects Section */}
          <section className="section-spacing popular-languages-section">
            <h2>Explore Popular Languages</h2>
            <div className="language-cards-grid">
              <div className="language-card">
                <h3>Spanish</h3>
                <p>Speak with confidence for travel and business.</p>
              </div>
              <div className="language-card">
                <h3>French</h3>
                <p>Immerse yourself in culture and conversation.</p>
              </div>
              <div className="language-card">
                <h3>English</h3>
                <p>Master global communication for career and life.</p>
              </div>
              <div className="language-card">
                <h3>German</h3>
                <p>Unlock opportunities in Europe's leading economy.</p>
              </div>
              <div className="language-card">
                <h3>Japanese</h3>
                <p>Dive into a rich culture and unique language.</p>
              </div>
              <div className="language-card">
                <h3>Mandarin</h3>
                <p>Connect with the world's most spoken language.</p>
              </div>
            </div>
          </section>


          {/* Testimonials Section */}
          <section className="section-spacing testimonials-section">
            <h2>Hear From Our Happy Learners</h2>
            <div className="testimonials-carousel"> {/* Can be styled as a carousel or grid */}
              <div className="testimonial-card">
                <p>"LangZone is a game-changer! My English speaking skills have improved dramatically. Highly recommended!"</p>
                <div className="testimonial-author">
                  <img src="https://via.placeholder.com/50?text=A" alt="Student Avatar" />
                  <span>Anna P. - Student</span>
                </div>
              </div>
              <div className="testimonial-card">
                <p>"The best platform for learning. My Spanish tutor is incredibly patient and the lessons are always fun."</p>
                <div className="testimonial-card">
                  <p>"The best platform for learning. My Spanish tutor is incredibly patient and the lessons are always fun."</p>
                  <div className="testimonial-author">
                    <img src="https://via.placeholder.com/50?text=B" alt="Student Avatar" />
                    <span>Ben K. - Professional</span>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p>"Finally found a Japanese tutor who understands my pace. LangZone makes learning accessible and effective."</p>
                  <div className="testimonial-author">
                    <img src="https://via.placeholder.com/50?text=C" alt="Student Avatar" />
                    <span>Chloe M. - Traveler</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action before Tutor List */}
          <section className="section-spacing find-tutors-cta-section">
            <h2>Ready to Start Your Language Journey?</h2>
            <p>Browse our extensive list of professional tutors and find your perfect match today!</p>
            <button className="cta-button" onClick={() => {
              document.getElementById('tutor-list-section').scrollIntoView({ behavior: 'smooth' });
            }}>
              Find My Tutor
            </button>
          </section>


          {/* Create Tutor Form - Keep this for now, perhaps move to a dedicated "Become a Tutor" page later */}
          <section className="section-spacing">
            <CreateTutorForm onTutorCreated={handleTutorCreated} />
          </section>


          {/* Tutor Listing Section */}
          <section id="tutor-list-section" className="section-spacing tutor-listing-section">
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

          {/* ABOUT US SECTION - ADDED CONTENT HERE */}
          <section id="about-us-section" className="section-spacing about-us-section">
            <h1>About LangZone Tutors</h1>
            <p>Welcome to LangZone Tutors, where we believe that language learning should be accessible, engaging, and personalized for everyone.</p>

            <section>
              <h2>Our Story</h2>
              <p>Founded in **[Year]** by **[Founder's Name/Team]**, LangZone Tutors began with a simple yet powerful idea: to connect passionate and experienced language educators with eager learners from across the globe. Frustrated by generic, one-size-fits-all language apps, we set out to create a platform that prioritizes human connection and tailored instruction. What started as a small initiative has grown into a vibrant community dedicated to breaking down language barriers and fostering global communication.</p>
            </section>

            <section>
              <h2>Our Mission</h2>
              <p>Our mission is to **empower individuals to achieve fluency and cultural understanding** through high-quality, personalized online language education. We strive to create a supportive and effective learning environment where every student can unlock their linguistic potential.</p>
            </section>

            <section>
              <h2>Our Values</h2>
              <ul className="values-list">
                <li><strong>Excellence:</strong> We are committed to providing top-tier tutoring and a seamless learning experience.</li>
                <li><strong>Personalization:</strong> Every learner is unique, and so should their language journey be.</li>
                <li><strong>Accessibility:</strong> We aim to make quality language education available to anyone, anywhere.</li>
                <li><strong>Community:</strong> We foster a global community where learners and tutors connect and grow together.</li>
                <li><strong>Passion:</strong> We are passionate about languages and dedicated to inspiring that same passion in our students.</li>
              </ul>
            </section>

            <section>
              <h2>Meet Our Team (Optional - Add if you have team info)</h2>
              <div className="team-grid">
                {/* Example Team Member Card */}
                {/* <div className="team-member-card">
                  <img src="https://via.placeholder.com/100" alt="Team Member Name" />
                  <h3>Jane Doe</h3>
                  <p>Co-Founder & CEO</p>
                  <p>Jane is passionate about connecting people through language.</p>
                </div> */}
                <p>Our team is comprised of dedicated educators, innovative developers, and supportive customer service professionals, all working together to make your language learning journey exceptional.</p>
              </div>
            </section>

            <section>
              <h2>Why Choose LangZone?</h2>
              <p>Beyond our commitment to personalized learning, LangZone offers:</p>
              <ul>
                <li>A rigorously vetted network of professional, certified tutors.</li>
                <li>Flexible scheduling to fit your busy life.</li>
                <li>An interactive and user-friendly online learning platform.</li>
                <li>Transparent pricing with no hidden fees.</li>
                <li>A supportive community dedicated to your success.</li>
              </ul>
            </section>

            <section className="about-cta">
              <p>Ready to start your language adventure?</p>
              <button className="cta-button" onClick={() => document.getElementById('tutor-list-section').scrollIntoView({ behavior: 'smooth' })}>
                Find Your Tutor Today!
              </button>
            </section>
          </section>

          {/* CONTACT SECTION - ADDED CONTENT HERE */}
          <section id="contact-section" className="section-spacing contact-section">
            <h2>Contact Us</h2>
            <p>We're here to help! Reach out to us with any questions, feedback, or support needs.</p>

            <div className="contact-info-grid">
              <div className="contact-card">
                <h3>Email Us</h3>
                <p>For general inquiries, support, or partnership opportunities.</p>
                <p><a href="mailto:info@langzone.com">info@langzone.com</a></p>
              </div>
              <div className="contact-card">
                <h3>Call Us</h3>
                <p>Speak to a representative during business hours.</p>
                <p>+1 (123) 456-7890</p>
              </div>
              <div className="contact-card">
                <h3>Visit Us</h3>
                <p>Our main office location (by appointment only).</p>
                <p>123 Language Lane, Global City, GC 12345</p>
              </div>
            </div>

            <div className="contact-form-section">
              <h3>Send Us a Message</h3>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="cta-button">Send Message</button>
              </form>
            </div>
          </section>


        </main>

        {/* FULL FEATURED FOOTER */}
        <footer className="main-footer">
          <div className="footer-container">
            <div className="footer-col about-langzone">
              <h3>LangZone Tutors</h3>
              <p>Empowering learners globally through personalized online language education.</p>
            </div>
            <div className="footer-col quick-links">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#hero-section">Home</a></li>
                <li><a href="#tutor-list-section">Find a Tutor</a></li>
                <li><a href="#how-it-works-section">How it Works</a></li>
                {/* Footer link to About Us section */}
                <li><a href="#about-us-section">About Us</a></li>
                {/* Footer link to Contact section */}
                <li><a href="#contact-section">Contact</a></li>
                <li><a href="#">Become a Tutor</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-col contact-info">
              <h3>Contact Us</h3>
              <p>Email: <a href="mailto:info@langzone.com">info@langzone.com</a></p>
              <p>Phone: +1 (123) 456-7890</p>
              <p>Address: 123 Language Lane, Global City</p>
            </div>
            <div className="footer-col social-media">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} LangZone. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;