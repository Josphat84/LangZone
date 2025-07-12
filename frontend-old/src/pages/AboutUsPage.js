//AboutUs.js

// frontend/src/pages/AboutUsPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function AboutUsPage() {
  return (
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
        <Link to="/tutors" className="cta-button">
          Find Your Tutor Today!
        </Link>
      </section>
    </section>
  );
}

export default AboutUsPage;