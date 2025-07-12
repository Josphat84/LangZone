//ContactUs.js

// frontend/src/pages/ContactPage.js
import React from 'react';

function ContactPage() {
  return (
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
  );
}

export default ContactPage;