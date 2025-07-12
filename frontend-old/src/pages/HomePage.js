//HomePage.js

// frontend/src/pages/HomePage.js
import React from 'react';

function HomePage({ onFindTutorsClick }) {
  return (
    <>
      {/* Hero Section */}
      <section id="hero-section" className="hero-section">
        <div className="hero-content">
          <h2>Master Any Language, Anywhere.</h2>
          <p>Connect with professional tutors for personalized 1-on-1 online lessons.</p>
          <button className="cta-button" onClick={onFindTutorsClick}>
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
            <button className="secondary-cta-button" onClick={onFindTutorsClick}>
              Browse All Tutors
            </button>
          </div>
          <div className="why-choose-us-image">
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
        <div className="testimonials-carousel">
          <div className="testimonial-card">
            <p>"LangZone is a game-changer! My English speaking skills have improved dramatically. Highly recommended!"</p>
            <div className="testimonial-author">
              <img src="https://via.placeholder.com/50?text=A" alt="Student Avatar" />
              <span>Anna P. - Student</span>
            </div>
          </div>
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
      </section>
    </>
  );
}

export default HomePage;