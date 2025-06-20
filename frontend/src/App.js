import React, { useState, useEffect } from 'react';
import './App.css';



const tutors = [
  {
    id: 1,
    name: "Emily Carter",
    bio: "Certified English tutor with 8 years of experience. Specializes in conversational English and exam prep.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    languages: ["English", "French"],
    experience: "8 years",
    qualifications: ["CELTA", "MA Applied Linguistics"],
    interests: ["Traveling", "Reading", "Cooking"],
    rating: 4.9,
    reviews: 120
  },
  {
    id: 2,
    name: "James Lee",
    bio: "Native speaker and TEFL certified. Passionate about helping students achieve fluency.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    languages: ["English", "Mandarin"],
    experience: "5 years",
    qualifications: ["TEFL", "BA English Literature"],
    interests: ["Music", "Hiking", "Photography"],
    rating: 4.8,
    reviews: 98
  },
  {
    id: 3,
    name: "Sophia Martinez",
    bio: "Bilingual English/Spanish tutor. Focus on business English and pronunciation.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    languages: ["English", "Spanish"],
    experience: "6 years",
    qualifications: ["TESOL", "MBA"],
    interests: ["Dancing", "Tech", "Volunteering"],
    rating: 4.95,
    reviews: 143
  }
];

function TutorProfiles({ onConnect }) {
  return (
    <section className="tutor-profiles" style={{ margin: '3rem 0' }}>
      <h2 style={{ textAlign: 'center' }}>Meet Our Tutors</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {tutors.map(tutor => (
          <div key={tutor.id} style={{
            border: '1px solid #eee',
            borderRadius: '1rem',
            padding: '2rem',
            width: '320px',
            textAlign: 'center',
            background: '#fafbfc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <img
              src={tutor.avatar}
              alt={tutor.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }}
            />
            <h3 style={{ margin: '0.5rem 0' }}>{tutor.name}</h3>
            <p style={{ fontSize: '0.95rem', color: '#555', minHeight: '60px' }}>{tutor.bio}</p>
            <div style={{ fontSize: '0.92rem', color: '#444', margin: '0.5rem 0' }}>
              <strong>Languages:</strong> {tutor.languages.join(', ')}<br />
              <strong>Experience:</strong> {tutor.experience}<br />
              <strong>Qualifications:</strong> {tutor.qualifications.join(', ')}<br />
              <strong>Interests:</strong> {tutor.interests.join(', ')}
            </div>
            <div style={{ margin: '0.5rem 0', color: '#f5b301', fontWeight: 'bold' }}>
              ⭐ {tutor.rating} ({tutor.reviews} reviews)
            </div>
            <button
              onClick={onConnect}
              className="connect-btn"
              style={{
                marginTop: '1rem',
                padding: '0.7rem 1.5rem',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Connect Live
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// All your existing homepage logic and icons here...


// 💡 I’m skipping icon and testimonial logic for brevity — keep them unchanged in your file.



function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    rating: 0
  });
  const [showCall, setShowCall] = useState(false); // 👈 New state for Jitsi
  const roomName = "LJConnect" + Date.now();
  const jitsiURL = `https://meet.jit.si/${roomName}`;

  useEffect(() => {
    const targets = { students: 50000, courses: 1200, instructors: 800, rating: 4.9 };
    const steps = 60;
    const duration = 2000;
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      {/* Your existing LearnForge homepage code: nav, hero, features, courses, testimonials, footer */}
      {/* Keep all your current JSX here — icons, badges, etc. */}

      {/* ✅ Add this section wherever you want the video call to appear */}
      <section className="video-call-section" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Talk to your English Tutor live </h2>
        {!showCall && (
          <button
            onClick={() => setShowCall(true)}
            className="start-btn"
            style={{ padding: '1rem 2rem', fontSize: '1rem', marginTop: '1rem' }}
          >
            Start Video Call
          </button>
        )}

        {showCall && (
          <iframe
            src={jitsiURL}
            style={{ width: '100%', height: '80vh', border: '0', marginTop: '1rem' }}
            allow="camera; microphone; fullscreen; display-capture"
            title="Jitsi Meeting"
          />
        )}
      </section>

      {/* 👇 Use TutorProfiles component here */}
      <TutorProfiles onConnect={() => setShowCall(true)} />

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            {/* Optional: add your icon */}
            <span>LangZone</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
