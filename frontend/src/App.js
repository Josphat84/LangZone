import React, { useState } from 'react';

// Tutor data (same as before)
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

function Sidebar({ isOpen, toggleSidebar, onNavigate }) {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-260px',
        width: '260px',
        height: '100%',
        background: '#2c3e50',
        color: 'white',
        padding: '2rem 1rem',
        transition: 'left 0.3s ease',
        zIndex: 1500,
        overflowY: 'auto',
      }}
      aria-label="Main sidebar navigation"
    >
      <button
        onClick={() => toggleSidebar(false)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.8rem',
          marginBottom: '1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
        aria-label="Close sidebar"
      >
        &times;
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {['home', 'tutors', 'bookings', 'contact'].map((item) => (
          <li key={item} style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => onNavigate(item)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.1rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer
      style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: '#2c3e50',
        color: 'white',
        textAlign: 'center',
        fontSize: '0.9rem',
      }}
    >
      <p>© {new Date().getFullYear()} LangZone Zimbabwe. All rights reserved.</p>
      <div style={{ marginTop: '0.5rem' }}>
        <a
          href="https://www.facebook.com/langzonezimbabwe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          style={{ margin: '0 8px', color: 'white', fontSize: '1.4rem', textDecoration: 'none' }}
        >
          👍
        </a>
        <a
          href="https://twitter.com/langzonezimbabwe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          style={{ margin: '0 8px', color: 'white', fontSize: '1.4rem', textDecoration: 'none' }}
        >
          🐦
        </a>
        <a
          href="https://www.instagram.com/langzonezimbabwe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          style={{ margin: '0 8px', color: 'white', fontSize: '1.4rem', textDecoration: 'none' }}
        >
          📸
        </a>
      </div>
    </footer>
  );
}

function App() {
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showCall, setShowCall] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roomName = "LJConnect" + Date.now();
  const jitsiURL = `https://meet.jit.si/${roomName}`;

  const commentBtn = {
    width: '100%',
    padding: '0.6rem 1rem',
    borderRadius: '0.75rem',
    border: '2px solid #4864f4',
    background: 'rgba(72, 100, 244, 0.85)',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const liveCallBtn = {
    ...commentBtn,
    border: '2px solid #2e7d32',
    background: 'rgba(46, 125, 50, 0.85)',
    color: 'white',
  };

  const bookBtn = {
    ...commentBtn,
    border: '2px solid #efb500',
    background: 'rgba(239, 181, 0, 0.85)',
    color: '#4a3d00',
  };

  const payBtn = {
    ...commentBtn,
    border: '2px solid #d32f2f',
    background: 'rgba(211, 47, 47, 0.85)',
    color: 'white',
  };

  function handleAddComment(tutorId) {
    if (newComment.trim() === '') return;
    setComments(prev => ({
      ...prev,
      [tutorId]: [...(prev[tutorId] || []), newComment.trim()]
    }));
    setNewComment('');
  }

  function handleBookingSubmit() {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time.');
      return;
    }
    setBookingConfirmed(true);
  }

  function scrollToSection(id) {
    setSidebarOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} onNavigate={scrollToSection} />

      <div
        style={{
          marginLeft: sidebarOpen ? '260px' : '0',
          transition: 'margin-left 0.3s ease',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          background: 'linear-gradient(135deg, #e0e4ff 0%, #fefeff 100%)',
          minHeight: '100vh',
          color: '#333',
          userSelect: 'none',
          padding: '1.5rem 2rem',
        }}
        id="home"
      >
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              fontSize: '1.8rem',
              padding: '0.3rem 0.7rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#4864f4',
              color: 'white',
              cursor: 'pointer',
              zIndex: 1600,
            }}
            aria-label="Open sidebar"
          >
            &#9776;
          </button>
          <h1 style={{ fontWeight: '700', color: '#2c3e50' }}>LangZone Zimbabwe</h1>
          <p style={{ color: '#333', fontWeight: '600', fontSize: '1.2rem' }}>
            Empowering language learners through live tutoring
          </p>
        </header>

        <section id="tutors" style={{ marginBottom: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#4864f4' }}>
            Meet Our Zimbabwean Tutors
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
              gap: '2rem',
              maxWidth: '1100px',
              margin: '0 auto',
            }}
          >
            {tutors.map(tutor => (
              <div
                key={tutor.id}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '15px',
                  padding: '1.6rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem' }}
                  loading="lazy"
                />
                <h3 style={{ margin: '0 0 0.3rem 0', color: '#003366' }}>{tutor.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#555', minHeight: '70px', marginBottom: '0.7rem', textAlign: 'center' }}>
                  {tutor.bio}
                </p>
                <p style={{ fontWeight: '700', color: '#ffbb00', marginBottom: '0.8rem' }}>⭐ {tutor.rating.toFixed(1)}</p>

                <div
                  style={{
                    width: '100%',
                    maxHeight: '90px',
                    overflowY: 'auto',
                    fontSize: '0.8rem',
                    color: '#444',
                    marginBottom: '0.8rem',
                    paddingLeft: '1rem',
                    textAlign: 'left',
                  }}
                >
                  <strong>Reviews:</strong>
                  <ul style={{ marginTop: '0.2rem' }}>
                    {tutor.reviews.map((review, idx) => (
                      <li key={idx} style={{ marginBottom: '0.3rem' }}>
                        {review}
                      </li>
                    ))}
                    {(comments[tutor.id] || []).map((comment, idx) => (
                      <li key={`c${idx}`} style={{ fontStyle: 'italic', color: '#4864f4' }}>
                        {comment}
                      </li>
                    ))}
                  </ul>
                </div>

                <input
                  type="text"
                  placeholder="Add comment"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.7rem',
                    borderRadius: '10px',
                    border: '2px solid #4864f4',
                    marginBottom: '0.6rem',
                    outline: 'none',
                    fontSize: '0.85rem',
                    boxShadow: 'inset 0 2px 5px rgba(72,100,244,0.25)',
                  }}
                  aria-label={`Add comment for ${tutor.name}`}
                />
                <button
                  style={commentBtn}
                  onClick={() => handleAddComment(tutor.id)}
                  aria-label={`Add comment button for ${tutor.name}`}
                >
                  Add Comment
                </button>

                <button
                  style={{ ...liveCallBtn, marginTop: '0.6rem' }}
                  onClick={() => setShowCall(true)}
                  aria-label={`Connect live button for ${tutor.name}`}
                >
                  Connect Live
                </button>

                <button
                  style={{ ...bookBtn, marginTop: '0.6rem' }}
                  onClick={() => setShowBooking(true)}
                  aria-label={`Book session button for ${tutor.name}`}
                >
                  Book Session
                </button>

                <button
                  style={{ ...payBtn, marginTop: '0.6rem' }}
                  onClick={() => alert('Simulated Payment')}
                  aria-label={`Pay button for ${tutor.name}`}
                >
                  Pay
                </button>
              </div>
            ))}
          </div>
        </section>

        {showCall && (
          <section
            style={{
              margin: '3rem auto',
              maxWidth: '960px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              borderRadius: '1rem',
              overflow: 'hidden',
            }}
          >
            <iframe
              src={jitsiURL}
              style={{ width: '100%', height: '70vh', border: 'none' }}
              allow="camera; microphone; fullscreen; display-capture"
              title="Jitsi Meeting"
            />
            <button
              onClick={() => setShowCall(false)}
              style={{
                ...payBtn,
                margin: '1rem auto',
                display: 'block',
                width: '200px',
                fontWeight: '700',
              }}
              aria-label="End live call button"
            >
              End Call
            </button>
          </section>
        )}

        {showBooking && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 1200,
            }}
            id="bookings"
          >
            <div
              style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '1rem',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <h3>Book Your Session</h3>

              <label htmlFor="booking-date" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Select Date
              </label>
              <input
                id="booking-date"
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
                min={new Date().toISOString().split("T")[0]} // disable past dates
              />

              <label htmlFor="booking-time" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Select Time
              </label>
              <input
                id="booking-time"
                type="time"
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
              />

              <button style={bookBtn} onClick={handleBookingSubmit}>Confirm Booking</button>
              <button
                style={{ ...payBtn, marginTop: '0.5rem' }}
                onClick={() => {
                  setShowBooking(false);
                  setBookingConfirmed(false);
                  setSelectedDate('');
                  setSelectedTime('');
                }}
              >
                Cancel
              </button>

              {bookingConfirmed && (
                <p style={{ marginTop: '1rem', color: '#28a745', fontWeight: '700' }}>
                  ✔ Booked for {selectedDate} at {selectedTime}
                </p>
              )}
            </div>
          </div>
        )}

        <section id="contact" style={{ maxWidth: '960px', margin: '3rem auto', textAlign: 'center', color: '#555' }}>
          <h2>Contact Us</h2>
          <p>
            Have questions? Reach out via email at{' '}
            <a href="mailto:info@langzone.co.zw" style={{ color: '#4864f4', fontWeight: '700' }}>
              info@langzone.co.zw
            </a>
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default App;
