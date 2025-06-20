import React, { useState, useEffect } from 'react';
import './App.css';

const tutors = [
  {
    id: 1,
    name: "Rutendo Moyo",
    bio: "MA in English Literature, University of Zimbabwe. 8 years experience in IELTS, TOEFL, and conversational fluency.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    reviews: [
      "Her lessons are fun and practical. I passed IELTS with Band 8!",
      "Very patient and knows how to help you improve."
    ]
  },
  {
    id: 2,
    name: "Tawanda Ncube",
    bio: "Certified TEFL instructor with a focus on spoken English and business communication. Based in Bulawayo.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    reviews: [
      "Tawanda helped me gain confidence speaking in interviews.",
      "Highly recommended for professional English training."
    ]
  },
  {
    id: 3,
    name: "Nyasha Chikore",
    bio: "Trilingual (English, Shona, Spanish). Specialist in beginner and intermediate learners. Uses visual learning methods.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5.0,
    reviews: [
      "She makes learning so easy. I love her interactive style!",
      "Helped me a lot with pronunciation and confidence."
    ]
  },
  {
    id: 4,
    name: "Tanaka Dube",
    bio: "TEFL & TESOL certified. Offers tailored lesson plans for young learners and adults. Based in Harare.",
    avatar: "https://randomuser.me/api/portraits/men/74.jpg",
    rating: 4.7,
    reviews: [
      "My kids enjoy his classes and have improved so much.",
      "Organized, friendly, and very clear in explanations."
    ]
  }
];

function TutorProfiles({ onConnect }) {
  return (
    <section className="tutor-profiles" style={{ margin: '4rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Meet Our Zimbabwean Tutors</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {tutors.map(tutor => (
          <div key={tutor.id} style={{
            border: '1px solid #eee',
            borderRadius: '1rem',
            padding: '2rem',
            width: '300px',
            textAlign: 'center',
            background: '#fafbfc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <img
              src={tutor.avatar}
              alt={tutor.name}
              style={{ width: '90px', height: '90px', borderRadius: '50%', marginBottom: '1rem' }}
            />
            <h3 style={{ marginBottom: '0.3rem' }}>{tutor.name}</h3>
            <p style={{ fontSize: '0.95rem', color: '#555', minHeight: '70px' }}>{tutor.bio}</p>
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#ffaa00' }}>⭐ {tutor.rating.toFixed(1)}</p>
            <ul style={{ textAlign: 'left', fontSize: '0.85rem', padding: '0 1rem', marginTop: '0.5rem' }}>
              {tutor.reviews.map((review, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', listStyle: 'disc' }}>{review}</li>
              ))}
            </ul>
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

function App() {
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    rating: 0
  });
  const [showCall, setShowCall] = useState(false);
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

  return (
    <div className="app">
      <header style={{ textAlign: 'center', padding: '2rem 0', background: '#f8f8f8' }}>
        <h1>LangZone Zimbabwe</h1>
        <p>Empowering language learners through live tutoring</p>
      </header>

      <section style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2>Live English Video Tutoring</h2>
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

      <TutorProfiles onConnect={() => setShowCall(true)} />

      <footer className="footer" style={{ textAlign: 'center', padding: '1.5rem 0', background: '#eee' }}>
        <p>© {new Date().getFullYear()} (c) 2025 LangZone Zimbabwe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
