import './App.css';




import React, { useState, useEffect } from 'react';

export default function ELearningHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    rating: 0
  });

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Data Scientist",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "LearnForge transformed my career. The AI courses were incredibly comprehensive and practical.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "The quality of instruction and community support here is unmatched. Highly recommend!",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "I love how engaging and interactive the courses are. Learning has never been this enjoyable.",
      rating: 5
    }
  ];

  // Animate statistics on load
  useEffect(() => {
    const targets = { students: 50000, courses: 1200, instructors: 800, rating: 4.9 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      students: targets.students / steps,
      courses: targets.courses / steps,
      instructors: targets.instructors / steps,
      rating: targets.rating / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setAnimatedStats({
          students: Math.floor(increment.students * currentStep),
          courses: Math.floor(increment.courses * currentStep),
          instructors: Math.floor(increment.instructors * currentStep),
          rating: Math.min(increment.rating * currentStep, 4.9)
        });
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const courses = [
    {
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Alex Thompson",
      students: "12,547",
      rating: 4.8,
      price: "$89",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      badge: "Bestseller"
    },
    {
      title: "Machine Learning & AI Fundamentals",
      instructor: "Prof. Maya Patel",
      students: "8,932",
      rating: 4.9,
      price: "$129",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      badge: "Hot"
    },
    {
      title: "Digital Marketing Mastery",
      instructor: "Sarah Williams",
      students: "15,623",
      rating: 4.7,
      price: "$79",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      badge: "New"
    }
  ];

  // Simple inline SVG icons for some uses
  const IconBook = () => (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" fill="currentColor">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M4 4.5A2.5 2.5 0 016.5 7H20" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 7v10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  const IconMenu = () => (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );

  const IconClose = () => (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const IconArrowRight = () => (
    <svg viewBox="0 0 24 24" className="icon-small" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  const IconPlay = () => (
    <svg viewBox="0 0 24 24" className="icon-small" aria-hidden="true" fill="currentColor">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );

  const IconStar = () => (
    <svg viewBox="0 0 24 24" className="icon-small star-icon" aria-hidden="true" fill="gold" stroke="gold" strokeWidth="1">
      <polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 8.5 12 2" />
    </svg>
  );

  const IconCheckCircle = () => (
    <svg viewBox="0 0 24 24" className="icon-small" aria-hidden="true" fill="white" stroke="white" strokeWidth="2">
      <circle cx="12" cy="12" r="10" fill="none" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );

  const IconZap = () => (
    <svg viewBox="0 0 24 24" className="icon-small" aria-hidden="true" fill="yellow">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );

  const IconTarget = () => (
    <svg viewBox="0 0 24 24" className="icon-small" aria-hidden="true" fill="white" stroke="white" strokeWidth="2">
      <circle cx="12" cy="12" r="10" fill="none" />
      <circle cx="12" cy="12" r="6" fill="none" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );

  const IconHeart = () => (
    <svg viewBox="0 0 24 24" className="icon-small" aria-hidden="true" fill="red" stroke="red" strokeWidth="1">
      <path d="M12 21s-8-6.5-8-11a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.5-8 11-8 11z" />
    </svg>
  );

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo-area">
            <div className="logo-icon">
              <IconBook />
            </div>
            <span className="logo-text">LearnForge</span>
          </div>

          <div className="nav-links desktop-only">
            <a href="#">Courses</a>
            <a href="#">Instructors</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <button className="login-btn">Login</button>
            <button className="start-btn">Get Started</button>
          </div>

          <button
            className="menu-btn mobile-only"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#">Courses</a>
            <a href="#">Instructors</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <button className="login-btn mobile">Login</button>
            <button className="start-btn mobile">Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="badge">
              <IconZap />
              <span>New courses every week</span>
            </div>

            <h1 className="hero-title">
              Master New
              <br />
              <span className="highlight">Skills Today</span>
            </h1>

            <p className="hero-description">
              Join over 50,000 students learning from world-class instructors.
              Build skills that matter with hands-on projects and real-world applications.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">
                Start Learning Free <IconArrowRight />
              </button>
              <button className="secondary-btn">
                <IconPlay /> Watch Demo
              </button>
            </div>

            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">{animatedStats.students.toLocaleString()}+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{animatedStats.courses}+</div>
                <div className="stat-label">Courses</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{animatedStats.instructors}+</div>
                <div className="stat-label">Instructors</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{animatedStats.rating.toFixed(1)}</div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Students learning online"
                className="hero-image"
              />
              <div className="course-completed">
                <div className="check-icon">
                  <IconCheckCircle />
                </div>
                <div>
                  <div className="completed-text">Course Completed!</div>
                  <div className="completed-subtext">+500 XP earned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Why Choose LearnForge?</h2>
          <p>Experience learning like never before with our cutting-edge platform designed for modern learners</p>
        </div>

        <div className="features-grid">
          <div className="feature-card personalized">
            <div className="feature-icon">
              <IconTarget />
            </div>
            <h3>Personalized Learning</h3>
            <p>AI-powered recommendations and adaptive learning paths tailored to your goals and learning style.</p>
          </div>

          <div className="feature-card instructors">
            <div className="feature-icon">
              <svg width="24" height="24" fill="white" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 018 0v2" />
              </svg>
            </div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals and renowned educators with real-world experience.</p>
          </div>

          <div className="feature-card certified">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" className="icon-small" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" />
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <h3>Certified Success</h3>
            <p>Earn industry-recognized certificates and build a portfolio that showcases your achievements.</p>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="popular-courses">
        <div className="section-header">
          <h2>Popular Courses</h2>
          <p>Discover our most loved courses by thousands of students</p>
        </div>

        <div className="courses-grid">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className="course-image-wrapper">
                <img src={course.image} alt={course.title} className="course-image" />
                <span className={`course-badge badge-${course.badge.toLowerCase()}`}>{course.badge}</span>
                <div className="course-overlay">
                  <IconPlay />
                </div>
              </div>

              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">by {course.instructor}</p>
                <div className="course-rating">
                  {[...Array(Math.floor(course.rating))].map((_, i) => (
                    <IconStar key={i} />
                  ))}
                  <span className="rating-value">{course.rating}</span>
                  <span className="student-count">({course.students} students)</span>
                </div>
                <div className="course-footer">
                  <span className="course-price">{course.price}</span>
                  <button className="enroll-btn">
                    Enroll Now <IconArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <h2>What Our Students Say</h2>
          <p>Join thousands of satisfied learners worldwide</p>
        </div>

        <div className="testimonial-card">
          <img
            src={testimonials[currentTestimonial].image}
            alt={testimonials[currentTestimonial].name}
            className="testimonial-image"
          />
          <div className="testimonial-stars">
            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
              <IconStar key={i} />
            ))}
          </div>
          <blockquote className="testimonial-text">"{testimonials[currentTestimonial].text}"</blockquote>
          <div className="testimonial-author">
            <div className="author-name">{testimonials[currentTestimonial].name}</div>
            <div className="author-role">{testimonials[currentTestimonial].role}</div>
          </div>
        </div>

        <div className="testimonial-buttons">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
              aria-label={`Show testimonial ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Learning Journey?</h2>
          <p>Join our community of learners and unlock your potential with courses designed for success</p>

          <div className="cta-buttons">
            <button className="primary-btn">
              <IconHeart />
              Join Free Today <IconArrowRight />
            </button>
            <button className="secondary-btn">Browse All Courses</button>
          </div>
        </div>
      </section>

  {/* Footer */}
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-logo">
        <IconBook />
        <span>LearnForge</span>
      </div>
    </div>
  </footer>
    </div>
  );
}
