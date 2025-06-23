import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

// SVG Icons for social media (simple inline SVGs)
const FacebookIcon = () => (
  <svg
    role="img"
    aria-label="Facebook"
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.312h3.59l-.467 3.622h-3.123V24h6.116C23.4 24 24 23.4 24 22.675V1.325C24 .6 23.4 0 22.675 0z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    role="img"
    aria-label="X (Twitter)"
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.951.564-2.005.974-3.127 1.195-.897-.956-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.728 8.087 4.1 6.128 1.67 3.149c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.214 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.388 1.693 4.377 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.316-3.809 2.1-6.102 2.1-.395 0-.779-.023-1.17-.067 2.179 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.496 14-13.985 0-.209 0-.423-.015-.633.962-.695 1.8-1.562 2.46-2.549z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    role="img"
    aria-label="Instagram"
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5a4.25 4.25 0 00-4.25-4.25h-8.5zm8.625 2.125a1.125 1.125 0 11.001 2.25 1.125 1.125 0 01-.001-2.25zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
  </svg>
);

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
  },
  {
    id: 5,
    name: "Chipo Gono",
    bio: "Experienced ESL teacher specializing in business English and exam prep. Based in Mutare.",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 4.8,
    reviews: [
      "Chipo's classes helped me land a great job!",
      "Clear explanations and very motivating."
    ]
  },
  {
    id: 6,
    name: "Simba Mlambo",
    bio: "TESOL certified, passionate about conversational English and cultural exchange.",
    avatar: "https://randomuser.me/api/portraits/men/81.jpg",
    rating: 4.9,
    reviews: [
      "Fun and engaging lessons every time.",
      "Simba is very patient and attentive."
    ]
  },
  {
    id: 7,
    name: "Rudo Zvaita",
    bio: "Native English speaker with years of teaching experience. Focus on fluency and pronunciation.",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    rating: 5.0,
    reviews: [
      "Rudo helped me improve my accent dramatically.",
      "Lessons are very personalized and effective."
    ]
  }
];

function Sidebar({ isOpen, toggleSidebar, onNavigate }) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-260px',
          width: '260px',
          height: '100vh',
          background: 'linear-gradient(180deg, #7f8cfa, #b3b7ff)',
          color: 'white',
          padding: '2rem 1.5rem',
          boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
          transition: 'left 0.3s ease',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          userSelect: 'none',
        }}
      >
        <div>
          <h2
            style={{ cursor: 'pointer', marginBottom: '2rem', userSelect: 'none' }}
            onClick={() => {
              onNavigate('home');
              toggleSidebar(false);
            }}
          >
            LangZone
          </h2>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {[
              { name: 'Home', id: 'home' },
              { name: 'Tutors', id: 'tutors' },
              { name: 'Bookings', id: 'bookings' },
              { name: 'Pricing', id: 'pricing' },
              { name: 'About Us', id: 'about' },
              { name: 'Blog', id: 'blog' },
              { name: 'Contact', id: 'contact' }
            ].map(({ name, id }) => (
              <a
                key={id}
                onClick={() => {
                  onNavigate(id);
                  toggleSidebar(false);
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={e => (e.target.style.color = '#e1e1ff')}
                onMouseLeave={e => (e.target.style.color = 'white')}
              >
                {name}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem' }}>Follow Us</h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '1.8rem' }}>
            <a
              href="https://facebook.com/langzonezw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.target.style.color = '#3b5998')}
              onMouseLeave={e => (e.target.style.color = 'white')}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://twitter.com/langzonezw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.target.style.color = '#1DA1F2')}
              onMouseLeave={e => (e.target.style.color = 'white')}
              aria-label="X (Twitter)"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://instagram.com/langzonezw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.target.style.color = '#C13584')}
              onMouseLeave={e => (e.target.style.color = 'white')}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => toggleSidebar(!isOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: isOpen ? '260px' : '1rem',
          zIndex: 1200,
          background: 'rgba(127, 140, 250, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          userSelect: 'none',
        }}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        {isOpen ? '×' : '☰'}
      </button>
    </>
  );
}

function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #7f8cfa 0%, #b3b7ff 100%)',
      color: 'white',
      padding: '3rem 2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      marginTop: '5rem',
      userSelect: 'none',
      boxShadow: 'inset 0 1px 15px rgba(255,255,255,0.3)'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>
        <div style={{ flex: '1 1 250px' }}>
          <h3 style={{ marginBottom: '1rem' }}>About LangZone</h3>
          <p>LangZone Zimbabwe is your trusted partner for live English tutoring with certified Zimbabwean tutors.</p>
          <p>We help you unlock your potential and gain confidence in English through personalized, live video sessions.</p>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
            {['Home', 'Tutors', 'Bookings', 'Pricing', 'About Us', 'Blog', 'Contact'].map(link => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, '')}`}
                  style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseEnter={e => (e.target.style.color = '#dcdcff')}
                  onMouseLeave={e => (e.target.style.color = 'white')}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: '1 1 250px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Contact Us</h3>
          <p>Email: <a href="mailto:info@langzone.co.zw" style={{ color: 'white' }}>info@langzone.co.zw</a></p>
          <p>Phone: +263 77 123 4567</p>
          <p>Address: 123 Main Street, Harare, Zimbabwe</p>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Follow Us</h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '1.8rem' }}>
            <a
              href="https://facebook.com/langzonezw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.target.style.color = '#3b5998')}
              onMouseLeave={e => (e.target.style.color = 'white')}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://twitter.com/langzonezw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.target.style.color = '#1DA1F2')}
              onMouseLeave={e => (e.target.style.color = 'white')}
              aria-label="X (Twitter)"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://instagram.com/langzonezw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.target.style.color = '#C13584')}
              onMouseLeave={e => (e.target.style.color = 'white')}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
        &copy; {new Date().getFullYear()} LangZone Zimbabwe. All rights reserved.
      </p>
    </footer>
  );
}

function App() {
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showCall, setShowCall] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roomName = "LJConnect" + Date.now();
  const jitsiURL = `https://meet.jit.si/${roomName}`;

  const commentBtn = {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.75rem',
    border: '1.8px solid #809fff',
    background: 'rgba(128, 159, 255, 0.3)',
    color: '#25408f',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const liveCallBtn = {
    ...commentBtn,
    border: '1.8px solid #4c8c4a',
    background: 'rgba(76, 140, 74, 0.3)',
    color: '#2b522b',
  };

  const bookBtn = {
    ...commentBtn,
    border: '1.8px solid #c68a17',
    background: 'rgba(198, 138, 23, 0.3)',
    color: '#6a4b0d',
  };

  const payBtn = {
    ...commentBtn,
    border: '1.8px solid #c44a4a',
    background: 'rgba(196, 74, 74, 0.3)',
    color: '#7a3232',
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
          background: 'linear-gradient(135deg, #e9e9ff 0%, #ffffff 100%)',
          minHeight: '100vh',
          color: '#333',
          userSelect: 'none',
          padding: '1.5rem 2rem',
        }}
        id="home"
      >
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontWeight: '700', color: '#2c3e50' }}>LangZone Zimbabwe</h1>
          <p style={{ color: '#333', fontWeight: '600', fontSize: '1.2rem' }}>
            Empowering language learners through live tutoring
          </p>
        </header>

        <section id="tutors" style={{ marginBottom: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#007bff' }}>
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
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: '15px',
                  padding: '1.6rem',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
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
                      <li key={`c${idx}`} style={{ fontStyle: 'italic', color: '#007bff' }}>
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
                    border: '1px solid #007bff',
                    marginBottom: '0.6rem',
                    outline: 'none',
                    fontSize: '0.85rem',
                    boxShadow: 'inset 0 2px 5px rgba(0,123,255,0.15)',
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

              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                placeholderText="Select Date"
                dateFormat="MMMM d, yyyy"
                withPortal
                style={{ marginBottom: '1rem' }}
              />

              <DatePicker
                selected={selectedTime}
                onChange={time => setSelectedTime(time)}
                placeholderText="Select Time"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                dateFormat="h:mm aa"
                timeCaption="Time"
                withPortal
                style={{ marginBottom: '1rem' }}
              />

              <button style={bookBtn} onClick={handleBookingSubmit}>Confirm Booking</button>
              <button
                style={{ ...payBtn, marginTop: '0.5rem' }}
                onClick={() => {
                  setShowBooking(false);
                  setBookingConfirmed(false);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
              >
                Cancel
              </button>

              {bookingConfirmed && (
                <p style={{ marginTop: '1rem', color: '#28a745' }}>
                  ✔ Booked for {selectedDate?.toLocaleDateString()} at {selectedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        )}

        <section id="contact" style={{ maxWidth: '960px', margin: '3rem auto', textAlign: 'center', color: '#555' }}>
          <h2>Contact Us</h2>
          <p>Have questions? Reach out via email at <a href="mailto:info@langzone.co.zw" style={{ color: '#007bff' }}>info@langzone.co.zw</a></p>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default App;
