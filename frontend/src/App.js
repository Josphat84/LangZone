import React, { useState, useMemo } from 'react';
import './App.css';



const tutors = [
  // Original 10 tutors
  {
    id: 1,
    name: "Isabelle Laurent",
    bio: "TEFL certified instructor with 8 years of experience. Passionate about helping you master English with confidence. Focuses on fluency, vocabulary development, and immersive conversations. Has helped 100+ students pass English proficiency exams including IELTS and TOEFL.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    lessons: 7034,
    students: 46,
    languages: "English (Native), French",
    price: 50,
    online: true,
    reviews: ["Passed IELTS with Band 8!", "Patient and supportive teacher."]
  },
  {
    id: 2,
    name: "Luca Romano",
    bio: "Business English and interview prep expert with 10+ years in corporate communication. Specializes in presentation skills and executive coaching for global professionals. Conducted over 4000 lessons for learners in over 15 countries.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    lessons: 4500,
    students: 38,
    languages: "English (Native), Italian",
    price: 40,
    online: false,
    reviews: ["Boosted my confidence for job interviews!", "Sharp and helpful in business contexts."]
  },
  {
    id: 3,
    name: "Delilah Moreno",
    bio: "Trilingual tutor with a master's in education. Uses storytelling, music, and visuals to teach beginner and intermediate learners. Based in Mexico City. Her approach has made learning enjoyable for children and adults alike.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5.0,
    lessons: 3120,
    students: 20,
    languages: "English, Spanish, Portuguese",
    price: 45,
    online: true,
    reviews: ["She makes learning so easy!", "Excellent for pronunciation coaching."]
  },
  {
    id: 4,
    name: "James Okoro",
    bio: "TESOL certified. Offers engaging, structured lessons for young learners and adult beginners. Special focus on African learners aiming to study abroad. Available evenings and weekends.",
    avatar: "https://randomuser.me/api/portraits/men/74.jpg",
    rating: 4.7,
    lessons: 1890,
    students: 16,
    languages: "English, Yoruba",
    price: 38,
    online: false,
    reviews: ["My kids love him!", "Very friendly and organized."]
  },
  {
    id: 5,
    name: "Amina Rahmani",
    bio: "Conversational English mentor with a degree in applied linguistics. Has worked with professionals in healthcare, law, and tech to polish their speaking and listening skills. Based in Morocco.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 4.6,
    lessons: 2200,
    students: 30,
    languages: "English, Arabic, French",
    price: 35,
    online: true,
    reviews: ["Friendly and clear communicator!", "Really helpful feedback."]
  },
  {
    id: 6,
    name: "Kenji Nakamura",
    bio: "IELTS & TOEFL trainer based in Osaka, Japan. Known for structured, data-driven methods that help students consistently improve scores. Provides mock tests, speaking drills, and writing feedback.",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 4.8,
    lessons: 3700,
    students: 24,
    languages: "English, Japanese",
    price: 42,
    online: true,
    reviews: ["Improved my IELTS band!", "Very professional."]
  },
  {
    id: 7,
    name: "Priya Mehta",
    bio: "Specialist in business English and presentation training. Teaches startup founders, MBA students, and professionals in India and abroad. Also offers written English editing.",
    avatar: "https://randomuser.me/api/portraits/women/53.jpg",
    rating: 4.9,
    lessons: 4100,
    students: 35,
    languages: "English, Hindi",
    price: 55,
    online: false,
    reviews: ["Great for business English!", "Clear and articulate."]
  },
  {
    id: 8,
    name: "Emmanuel Mensah",
    bio: "Energetic teacher focused on helping African teens and young adults improve fluency. Integrates pop culture, games, and social media into learning.",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    rating: 4.5,
    lessons: 1280,
    students: 18,
    languages: "English, Twi",
    price: 30,
    online: true,
    reviews: ["My son loves learning now!", "Fun and effective lessons."]
  },
  {
    id: 9,
    name: "Beatrice Hoffman",
    bio: "Pronunciation coach and accent reduction expert from Germany. Helps students gain a clear, confident speaking voice. Has helped over 200 clients get promoted internationally.",
    avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    rating: 4.8,
    lessons: 2900,
    students: 28,
    languages: "English, German",
    price: 48,
    online: true,
    reviews: ["My accent has improved a lot!", "Very detailed and sharp."]
  },
  {
    id: 10,
    name: "Carlos Silva",
    bio: "Former university lecturer from Brazil now offering English grammar bootcamps and one-on-one coaching for Cambridge exams. Clear, concise, and fun lessons.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 4.9,
    lessons: 5000,
    students: 42,
    languages: "English, Portuguese",
    price: 60,
    online: false,
    reviews: ["Feels like a university class!", "Helped me master tricky grammar."]
  },

  // New 18 tutors
  {
    id: 11,
    name: "Sofia Ivanova",
    bio: "Russian-English bilingual with a passion for literature and culture. Helps students improve conversational skills and reading comprehension. Based in Moscow.",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    rating: 4.7,
    lessons: 2100,
    students: 22,
    languages: "English, Russian",
    price: 40,
    online: true,
    reviews: ["Great with storytelling!", "Improved my Russian fast."]
  },
  {
    id: 12,
    name: "Mateo Gonzalez",
    bio: "Spanish and English teacher specializing in exam prep and business communication. Over 12 years experience teaching adults worldwide.",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    rating: 4.9,
    lessons: 5200,
    students: 50,
    languages: "English, Spanish",
    price: 55,
    online: false,
    reviews: ["Excellent business English tips!", "Patient and thorough."]
  },
  {
    id: 13,
    name: "Chloe Johnson",
    bio: "Certified TESOL tutor focusing on children’s language acquisition and phonetics. Offers interactive lessons with games and songs.",
    avatar: "https://randomuser.me/api/portraits/women/77.jpg",
    rating: 5.0,
    lessons: 2800,
    students: 40,
    languages: "English",
    price: 35,
    online: true,
    reviews: ["My daughter loves her lessons!", "Engaging and fun."]
  },
  {
    id: 14,
    name: "Takumi Saito",
    bio: "Native Japanese speaker with fluency in English and Korean. Focuses on language exchange and cultural immersion.",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    rating: 4.6,
    lessons: 1900,
    students: 15,
    languages: "Japanese, English, Korean",
    price: 45,
    online: false,
    reviews: ["Very helpful and patient.", "Great cultural insights."]
  },
  {
    id: 15,
    name: "Lina Ahmed",
    bio: "Experienced Arabic and English tutor with background in linguistics and translation. Helps students build practical conversation skills.",
    avatar: "https://randomuser.me/api/portraits/women/43.jpg",
    rating: 4.8,
    lessons: 3500,
    students: 28,
    languages: "Arabic, English",
    price: 38,
    online: true,
    reviews: ["Clear explanations.", "Excellent feedback."]
  },
  {
    id: 16,
    name: "David Miller",
    bio: "British English accent coach specializing in pronunciation and intonation. Has helped many professionals improve clarity and confidence.",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    rating: 4.7,
    lessons: 2700,
    students: 32,
    languages: "English",
    price: 60,
    online: true,
    reviews: ["Helped me get a promotion!", "Very detailed and patient."]
  },
  {
    id: 17,
    name: "Ana Pereira",
    bio: "Portuguese native with 8 years teaching experience. Specializes in conversational practice and exam prep for CELPE-Bras.",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    rating: 4.9,
    lessons: 3100,
    students: 25,
    languages: "Portuguese, English",
    price: 42,
    online: false,
    reviews: ["Very supportive and encouraging.", "Excellent lesson plans."]
  },
  {
    id: 18,
    name: "Kofi Agyeman",
    bio: "Ghanaian tutor fluent in English and Twi, focusing on spoken fluency and everyday communication. Brings cultural context into lessons.",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    rating: 4.5,
    lessons: 1400,
    students: 19,
    languages: "English, Twi",
    price: 28,
    online: true,
    reviews: ["Friendly and clear.", "My speaking improved fast."]
  },
  {
    id: 19,
    name: "Elena Petrova",
    bio: "Native Bulgarian with excellent English skills. Focuses on grammar, writing skills, and vocabulary building.",
    avatar: "https://randomuser.me/api/portraits/women/39.jpg",
    rating: 4.7,
    lessons: 2300,
    students: 18,
    languages: "Bulgarian, English",
    price: 36,
    online: false,
    reviews: ["Helped me improve writing.", "Great explanations."]
  },
  {
    id: 20,
    name: "Mohamed Hassan",
    bio: "Egyptian teacher of Arabic and English. Experienced in teaching beginner to advanced students with an emphasis on conversation.",
    avatar: "https://randomuser.me/api/portraits/men/72.jpg",
    rating: 4.6,
    lessons: 2000,
    students: 20,
    languages: "Arabic, English",
    price: 34,
    online: true,
    reviews: ["Patient and thorough.", "Good with difficult grammar."]
  },
  {
    id: 21,
    name: "Jasmine Lee",
    bio: "Canadian tutor with Korean and English fluency. Offers bilingual lessons, helping students build conversational skills and cultural understanding.",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 4.8,
    lessons: 3000,
    students: 27,
    languages: "English, Korean",
    price: 44,
    online: false,
    reviews: ["Very approachable.", "Loved her cultural stories."]
  },
  {
    id: 22,
    name: "Omar Al-Farsi",
    bio: "Omani Arabic and English tutor with extensive experience teaching business professionals and university students.",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 4.7,
    lessons: 1600,
    students: 15,
    languages: "Arabic, English",
    price: 40,
    online: true,
    reviews: ["Practical lessons.", "Very knowledgeable."]
  },
  {
    id: 23,
    name: "Maya Thompson",
    bio: "English tutor specializing in creative writing and exam prep. Passionate about helping students develop their own voice.",
    avatar: "https://randomuser.me/api/portraits/women/57.jpg",
    rating: 5.0,
    lessons: 3400,
    students: 30,
    languages: "English",
    price: 50,
    online: false,
    reviews: ["Inspired me to write more!", "Excellent feedback."]
  },
  {
    id: 24,
    name: "Tariq Saeed",
    bio: "Pakistani tutor focused on improving English speaking and listening skills for exams and job interviews.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    rating: 4.6,
    lessons: 1800,
    students: 22,
    languages: "English, Urdu",
    price: 32,
    online: true,
    reviews: ["Very clear explanations.", "Helped me pass my exam."]
  },
  {
    id: 25,
    name: "Nina Volkova",
    bio: "Russian native offering business English and presentation skills coaching with a patient, encouraging style.",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    rating: 4.8,
    lessons: 2700,
    students: 20,
    languages: "Russian, English",
    price: 48,
    online: true,
    reviews: ["Made my presentations confident!", "Very helpful."]
  },
  {
    id: 26,
    name: "Lucas Fernandez",
    bio: "Argentinian tutor teaching conversational Spanish and English with emphasis on real-life communication.",
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    rating: 4.5,
    lessons: 2200,
    students: 18,
    languages: "Spanish, English",
    price: 38,
    online: false,
    reviews: ["Great conversational practice.", "Patient and friendly."]
  },
  {
    id: 27,
    name: "Zara Khan",
    bio: "British-Pakistani English tutor specialized in IELTS preparation and academic writing.",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    rating: 4.9,
    lessons: 4100,
    students: 40,
    languages: "English, Urdu",
    price: 55,
    online: true,
    reviews: ["Helped me score 7.5!", "Clear and encouraging."]
  },
  {
    id: 28,
    name: "Henrik Sørensen",
    bio: "Danish tutor focusing on English fluency and pronunciation for Scandinavians. Uses immersive conversation techniques.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4.7,
    lessons: 2600,
    students: 22,
    languages: "Danish, English",
    price: 45,
    online: false,
    reviews: ["Improved my accent a lot!", "Very friendly and helpful."]
  }
];

function App() {
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    language: 'All',
    onlineOnly: false,
    maxPrice: 100,
  });

  // Extract unique languages from tutors
  const allLanguages = useMemo(() => {
    const langsSet = new Set();
    tutors.forEach(tutor => {
      tutor.languages.split(',').map(l => l.trim()).forEach(lang => langsSet.add(lang));
    });
    return ['All', ...Array.from(langsSet).sort()];
  }, []);

  // Filter tutors based on filters
  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const searchLower = filters.search.toLowerCase();
      if (
        filters.search &&
        !(
          tutor.name.toLowerCase().includes(searchLower) ||
          tutor.bio.toLowerCase().includes(searchLower)
        )
      ) {
        return false;
      }

      if (
        filters.language !== 'All' &&
        !tutor.languages.toLowerCase().includes(filters.language.toLowerCase())
      ) {
        return false;
      }

      if (filters.onlineOnly && !tutor.online) {
        return false;
      }

      if (tutor.price > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [filters]);

  function handleAddComment(tutorId) {
    if (!newComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [tutorId]: [...(prev[tutorId] || []), newComment.trim()]
    }));
    setNewComment('');
  }

  function handleReadMore(tutor) {
    alert(`\n🌍 ${tutor.name}'s Full Bio\n\n${tutor.bio}\n\n🗣️ Languages: ${tutor.languages}\n📚 Total Lessons: ${tutor.lessons.toLocaleString()}\n👥 Students: ${tutor.students}\n⭐ Rating: ${tutor.rating}`);
  }

  return (
    <div className="app">
      <header className="header">
        <h1>LangZone Tutors</h1>
        <p>Find the right tutor to help you succeed in your language journey.</p>
      </header>

      <main className="main">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or keyword..."
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

        <div className="tutor-list">
          {filteredTutors.length === 0 && <p>No tutors found matching your filters.</p>}

          {filteredTutors.map(tutor => (
            <div className="tutor-card" key={tutor.id}>
              <div className="card-left">
                <img src={tutor.avatar} alt={tutor.name} className="avatar" />
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
                <p className="meta">{tutor.students} active students • {tutor.lessons.toLocaleString()} lessons</p>
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
                  {tutor.reviews.map((r, i) => (
                    <li key={i}>"{r}"</li>
                  ))}
                  {(comments[tutor.id] || []).map((c, i) => (
                    <li key={`c${i}`} className="user-comment">
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="price-box">
                  <span className="rating">⭐ {tutor.rating.toFixed(1)}</span>
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
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} LangZone — Empowering learners globally.</p>
      </footer>
    </div>
  );
}

export default App;
