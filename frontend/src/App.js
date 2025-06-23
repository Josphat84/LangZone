import React, { useState } from 'react';

const tutors = [
  {
    id: 1,
    name: "Tracy Byrant",
    bio: "MA in English Literature, University of Miami. 8 years experience in IELTS, TOEFL, and conversational fluency.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    reviews: [
      "Her lessons are fun and practical. I passed IELTS with Band 8!",
      "Very patient and knows how to help you improve."
    ]
  },
  {
    id: 2,
    name: "Holly Borla",
    bio: "Certified TEFL instructor with a focus on spoken English and business communication. Based in Soweto.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    reviews: [
      "Holly helped me gain confidence speaking in interviews.",
      "Highly recommended for professional English training."
    ]
  },
  {
    id: 3,
    name: "Delarian Burton",
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
    name: "Danielle Kimmey",
    bio: "TEFL & TESOL certified. Offers tailored lesson plans for young learners and adults. Based in Seattle.",
    avatar: "https://randomuser.me/api/portraits/men/74.jpg",
    rating: 4.7,
    reviews: [
      "My kids enjoy his classes and have improved so much.",
      "Organized, friendly, and very clear in explanations."
    ]
  }
];

function App() {
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [likes, setLikes] = useState({});
  const [ratings, setRatings] = useState({});

  const roomName = "LJConnect" + Date.now();
  const jitsiURL = `https://meet.jit.si/${roomName}`;

  const handleAddComment = (tutorId) => {
    if (!newComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [tutorId]: [...(prev[tutorId] || []), newComment.trim()]
    }));
    setNewComment('');
  };

  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time.');
      return;
    }
    setBookingConfirmed(true);
  };

  const toggleLike = (tutorId) => {
    setLikes(prev => ({
      ...prev,
      [tutorId]: (prev[tutorId] || 0) + 1
    }));
  };

  const setRating = (tutorId, value) => {
    setRatings(prev => ({
      ...prev,
      [tutorId]: value
    }));
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f4f7ff', color: '#333' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '1rem 1.5rem', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: '1 1 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#2c3e50' }}>LangZone</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Master languages. Connect globally.</p>
        </div>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {["Home", "Tutors", "Courses", "Pricing", "Features", "Community", "Testimonials", "Blog", "FAQs", "Login", "Sign Up"].map(item => (
            <button key={item} style={{ background: 'none', border: 'none', color: '#003366', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>{item}</button>
          ))}
        </nav>
      </header>

      <main style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#003366' }}>Welcome to LangZone</h2>
          <p style={{ fontSize: '1rem', maxWidth: '700px', margin: '1rem auto' }}>
            LangZone connects language learners with expert tutors from around the world. Whether you're preparing for exams, traveling, or enhancing your professional communication, we’ve got a tutor just for you.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#003366', textAlign: 'center' }}>Meet Our Tutors</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {tutors.map(tutor => (
              <div key={tutor.id} style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                <img src={tutor.avatar} alt={tutor.name} style={{ width: '100%', borderRadius: '0.5rem', marginBottom: '0.5rem' }} />
                <h4>{tutor.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#555' }}>{tutor.bio}</p>
                <p style={{ fontWeight: 'bold', color: '#f0b400' }}>⭐ {tutor.rating.toFixed(1)}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <button onClick={() => toggleLike(tutor.id)} style={{ padding: '0.3rem 0.6rem', borderRadius: '0.3rem', background: '#f0f0f0', border: '1px solid #ccc' }}>👍 {likes[tutor.id] || 0}</button>
                  {[1, 2, 3, 4, 5].map(n => (
                    <span key={n} onClick={() => setRating(tutor.id, n)} style={{ cursor: 'pointer', color: ratings[tutor.id] >= n ? '#f0b400' : '#ccc' }}>★</span>
                  ))}
                </div>
                <ul style={{ fontSize: '0.8rem', color: '#333', paddingLeft: '1rem' }}>
                  {tutor.reviews.map((r, i) => <li key={i}>{r}</li>)}
                  {(comments[tutor.id] || []).map((c, i) => <li key={`c${i}`} style={{ fontStyle: 'italic', color: '#3366cc' }}>{c}</li>)}
                </ul>
                <input type="text" placeholder="Add comment" value={newComment} onChange={e => setNewComment(e.target.value)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.4rem', borderRadius: '0.5rem' }} />
                <button onClick={() => handleAddComment(tutor.id)} style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#003366', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Comment</button>
                <button onClick={() => setShowCall(true)} style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '0.5rem' }}>Connect Live</button>
                <button onClick={() => setShowBooking(true)} style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0b400', color: '#333', border: 'none', borderRadius: '0.5rem' }}>Book</button>
              </div>
            ))}
          </div>
        </section>

        {showBooking && (
          <section style={{ background: '#fff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3>Book Your Session</h3>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ margin: '0.5rem', padding: '0.4rem', borderRadius: '0.4rem' }} />
            <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} style={{ margin: '0.5rem', padding: '0.4rem', borderRadius: '0.4rem' }} />
            <button onClick={handleBookingSubmit} style={{ margin: '0.5rem', padding: '0.5rem 1rem', background: '#003366', color: 'white', border: 'none', borderRadius: '0.5rem' }}>Confirm</button>
            {bookingConfirmed && <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>✔ Booked for {selectedDate} at {selectedTime}</p>}
          </section>
        )}

        {showCall && (
          <section style={{ marginBottom: '2rem' }}>
            <iframe src={jitsiURL} allow="camera; microphone; fullscreen; display-capture" style={{ width: '100%', height: '500px', border: 'none', borderRadius: '1rem' }} title="Jitsi Meeting"></iframe>
          </section>
        )}
      </main>

      <footer style={{ background: '#2c3e50', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
          {["Company", "Product", "Support", "Legal", "Follow"].map((section, i) => (
            <div key={i} style={{ flex: '1 1 150px', padding: '1rem' }}>
              <h4>{section}</h4>
              {section === "Company" && ["About Us", "Careers", "Press", "Partnerships"].map(p => <p key={p}>{p}</p>)}
              {section === "Product" && ["How It Works", "Live Sessions", "One-on-One", "Business Solutions"].map(p => <p key={p}>{p}</p>)}
              {section === "Support" && ["Help Center", "Contact Us", "Status", "Community"].map(p => <p key={p}>{p}</p>)}
              {section === "Legal" && ["Terms", "Privacy", "Cookies", "Security"].map(p => <p key={p}>{p}</p>)}
              {section === "Follow" && ["Facebook", "Twitter", "Instagram", "LinkedIn"].map(p => <p key={p}>{p}</p>)}
            </div>
          ))}
        </div>
        <hr style={{ borderColor: '#444', maxWidth: '900px', margin: '1rem auto' }} />
        <p style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} LangZone Inc. Empowering learners across Africa and beyond.</p>
      </footer>
    </div>
  );
}

export default App;
