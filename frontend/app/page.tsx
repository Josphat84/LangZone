// frontend/app/page.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';

// In app/page.tsx or a types file

interface FiltersState {
  language: string;
  country: string;
  minPrice: number;
  maxPrice: number;
  expertise: string;
  isNativeSpeaker: boolean;
  rating: number;
  likes: number;
  numStudents: number;
  numLessons: number;
  isOnline: boolean | null;
  gender: string;
}


export default function Home() {
  const [filters, setFilters] = useState({
    language: '',
    country: '',
    minPrice: 0,
    maxPrice: 50,
    expertise: '',
    isNativeSpeaker: false,
    rating: 0,
    likes: 0,
    numStudents: 0,
    numLessons: 0,
    isOnline: null,
    gender: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [allInstructors, setAllInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedInstructors, setLikedInstructors] = useState({}); // New state for liked instructors
  const [activeChat, setActiveChat] = useState(null); // New state for active chat

  const instructorsPerPage = 10;

  // --- MOCK INSTRUCTOR DATA (30 profiles) with all image_url removed and gender added ---
  useEffect(() => {
    const mockInstructors = [
      {
        id: 1, name: "Sofía Gonzalez", language: "Spanish", expertise: "Certified Educator", country: "Argentina", price: 29, rating: 4.8, reviews: 100, likes: 1200, numStudents: 500, numLessons: 2500, is_native: true, is_online: true, gender: 'female',
        description: "Hola! I'm Sofía, a passionate and certified Spanish educator from Argentina with 10+ years of experience. My lessons are dynamic and immersive, focusing on conversational fluency, grammar mastery, and cultural insights. Whether you're a complete beginner or looking to perfect your accent, I tailor each session to your unique learning style and goals. Let's make learning Spanish fun and effective!",
        image_url: null,
      },
      {
        id: 2, name: "Kenji Tanaka", language: "Japanese", expertise: "JLPT Prep", country: "Japan", price: 35, rating: 4.9, reviews: 85, likes: 950, numStudents: 400, numLessons: 2000, is_native: true, is_online: true, gender: 'male',
        description: "Konnichiwa! I'm Kenji, a native Japanese speaker specializing in JLPT preparation (N5-N1) and practical conversational Japanese. With a patient and structured approach, I'll guide you through grammar, vocabulary, and kanji, ensuring you gain confidence in speaking and understanding. My goal is to make complex Japanese concepts easy to grasp and enjoyable to learn.",
        image_url: null,
      },
      {
        id: 3, name: "Marie Dubois", language: "French", expertise: "French Culture & Travel", country: "France", price: 28, rating: 4.7, reviews: 110, likes: 1100, numStudents: 480, numLessons: 2300, is_native: true, is_online: true, gender: 'female',
        description: "Bonjour! I'm Marie, a native French tutor living in the heart of Paris. My lessons go beyond grammar, immersing you in French culture, history, and daily life. Perfect for travelers, culture enthusiasts, or anyone wanting to sound more authentic. We'll practice real-life dialogues, explore French media, and build your confidence to speak French naturally.",
        image_url: null,
      },
      {
        id: 4, name: "Liam O'Connell", language: "English", expertise: "ESL Specialist", country: "Ireland", price: 32, rating: 4.6, reviews: 90, likes: 880, numStudents: 350, numLessons: 1800, is_native: true, is_online: true, gender: 'male',
        description: "Top o' the morning! I'm Liam, an experienced ESL specialist from Ireland. I focus on improving your English pronunciation, accent reduction, and conversational fluency. Whether you're preparing for IELTS/TOEFL or just want to speak with more confidence, my lessons are engaging, supportive, and tailored to your specific needs. Let's conquer English together!",
        image_url: null,
      },
      {
        id: 5, name: "Fatima Al-Fassi", language: "Arabic", expertise: "Modern Standard Arabic", country: "Egypt", price: 30, rating: 4.8, reviews: 75, likes: 750, numStudents: 300, numLessons: 1500, is_native: true, is_online: true, gender: 'female',
        description: "Ahlan wa sahlan! I'm Fatima, a native Arabic speaker from Egypt, specializing in Modern Standard Arabic (MSA). My lessons provide a solid foundation in grammar, vocabulary, and reading, enabling you to understand and communicate effectively across the Arab world. I use a blend of classical texts and modern media to make learning engaging and relevant.",
        image_url: null,
      },
      {
        id: 6, name: "Luca Rossi", language: "Italian", expertise: "Italian for Beginners", country: "Italy", price: 27, rating: 4.7, reviews: 60, likes: 600, numStudents: 250, numLessons: 1200, is_native: true, is_online: true, gender: 'male',
        description: "Ciao! I'm Luca, a friendly native Italian tutor ready to introduce you to the beauty of my language. My 'Italian for Beginners' course is designed to get you speaking from day one, focusing on practical phrases, basic grammar, and pronunciation. We'll use real-life scenarios to build your confidence for your next trip to Italy!",
        image_url: null,
      },
      {
        id: 7, name: "Olga Petrova", language: "Russian", expertise: "Russian for Travel", country: "Russia", price: 33, rating: 4.5, reviews: 55, likes: 550, numStudents: 220, numLessons: 1100, is_native: true, is_online: true, gender: 'female',
        description: "Здравствуйте! I'm Olga, a native Russian tutor who loves helping travelers prepare for their adventures. My 'Russian for Travel' lessons focus on essential phrases, cultural etiquette, and practical tips for navigating Russia. We'll cover everything from ordering food to asking for directions, ensuring you have a smooth and enjoyable journey.",
        image_url: null,
      },
      {
        id: 8, name: "Diego Garcia", language: "Spanish", expertise: "Conversational Spanish", country: "Mexico", price: 26, rating: 4.7, reviews: 95, likes: 900, numStudents: 450, numLessons: 2100, is_native: true, is_online: true, gender: 'male',
        description: "¡Qué onda! I'm Diego, a lively Spanish tutor from Mexico, passionate about helping you achieve conversational fluency. My lessons are relaxed, engaging, and packed with real-world expressions and idioms. We'll discuss current events, movies, music, and more – anything to get you speaking naturally and confidently.",
        image_url: null,
      },
      {
        id: 9, name: "Chen Li", language: "Mandarin", expertise: "HSK Preparation", country: "China", price: 38, rating: 4.9, reviews: 80, likes: 980, numStudents: 380, numLessons: 1900, is_native: true, is_online: true, gender: 'male',
        description: "你好! I'm Chen, a dedicated Mandarin instructor with extensive experience in HSK preparation (all levels). I provide clear explanations of grammar, effective strategies for character memorization, and ample speaking practice. My students consistently achieve high scores on the HSK exams and gain practical communication skills.",
        image_url: null,
      },
      {
        id: 10, name: "Aisha Khan", language: "Hindi", expertise: "Everyday Hindi", country: "India", price: 25, rating: 4.6, reviews: 70, likes: 700, numStudents: 280, numLessons: 1400, is_native: true, is_online: true, gender: 'female',
        description: "Namaste! I'm Aisha, your guide to 'Everyday Hindi.' My lessons are perfect for those who want to learn practical Hindi for daily conversations, travel, or connecting with Indian culture. We'll focus on common phrases, basic grammar, and pronunciation, making sure you feel comfortable speaking in various situations.",
        image_url: null,
      },
      {
        id: 11, name: "Bjorn Svensson", language: "Swedish", expertise: "General Swedish", country: "Sweden", price: 30, rating: 4.7, reviews: 50, likes: 500, numStudents: 200, numLessons: 1000, is_native: true, is_online: true, gender: 'male',
        description: "Hej! I'm Bjorn, a native Swedish speaker offering comprehensive 'General Swedish' lessons. Whether you're planning to move to Sweden, have Swedish relatives, or simply love the language, I can help you build a strong foundation in grammar, vocabulary, and conversational skills. We'll make learning Swedish engaging and rewarding.",
        image_url: null,
      },
      {
        id: 12, name: "Maria Clara", language: "Portuguese", expertise: "Brazilian Portuguese", country: "Brazil", price: 28, rating: 4.8, reviews: 65, likes: 650, numStudents: 260, numLessons: 1300, is_native: true, is_online: true, gender: 'female',
        description: "Olá! I'm Maria Clara, your friendly Brazilian Portuguese tutor. My lessons are full of the vibrant energy of Brazil! We'll focus on conversational Portuguese, popular expressions, and cultural nuances. Perfect for travelers, music lovers, or anyone wanting to truly experience Brazil through its language.",
        image_url: null,
      },
      {
        id: 13, name: "Min-joon Kim", language: "Korean", expertise: "K-Pop & K-Drama Korean", country: "South Korea", price: 34, rating: 4.9, reviews: 70, likes: 800, numStudents: 300, numLessons: 1600, is_native: true, is_online: true, gender: 'male',
        description: "Annyeonghaseyo! I'm Min-joon, a passionate Korean tutor. My specialty is making learning Korean fun through K-Pop lyrics, K-Drama dialogues, and Korean webtoons. You'll learn authentic conversational Korean, slang, and cultural insights, all while enjoying your favorite media. Let's make your Korean dreams a reality!",
        image_url: null,
      },
      {
        id: 14, name: "Sarah Johnson", language: "English", expertise: "Business English", country: "USA", price: 40, rating: 4.9, reviews: 150, likes: 1500, numStudents: 600, numLessons: 3000, is_native: true, is_online: true, gender: 'female',
        description: "Hello! I'm Sarah, a highly experienced Business English coach from the USA. My lessons are designed to elevate your professional communication skills for meetings, presentations, emails, and negotiations. I provide practical strategies, industry-specific vocabulary, and role-playing scenarios to boost your confidence in global business environments.",
        image_url: null,
      },
      {
        id: 15, name: "Johann Schmidt", language: "German", expertise: "German for Professionals", country: "Germany", price: 36, rating: 4.8, reviews: 90, likes: 1000, numStudents: 420, numLessons: 2100, is_native: true, is_online: true, gender: 'male',
        description: "Guten Tag! I'm Johann, a native German speaker and tutor specializing in 'German for Professionals.' Whether you need to prepare for job interviews, communicate with German colleagues, or conduct business in Germany, my structured lessons will equip you with the advanced vocabulary, formal grammar, and cultural understanding necessary for success.",
        image_url: null,
      },
      {
        id: 16, name: "Juan Carlos", language: "Spanish", expertise: "Medical Spanish", country: "Colombia", price: 31, rating: 4.7, reviews: 70, likes: 720, numStudents: 290, numLessons: 1450, is_native: true, is_online: true, gender: 'male',
        description: "Saludos! I'm Juan Carlos, a tutor dedicated to 'Medical Spanish.' If you're a healthcare professional, my lessons will help you confidently communicate with Spanish-speaking patients. We'll cover medical terminology, patient history taking, empathetic communication, and cultural considerations in a healthcare setting.",
        image_url: null,
      },
      {
        id: 17, name: "Chloe Dupont", language: "French", expertise: "Conversational French", country: "Canada", price: 29, rating: 4.6, reviews: 80, likes: 850, numStudents: 340, numLessons: 1700, is_native: true, is_online: true, gender: 'female',
        description: "Bonjour! I'm Chloe, a Canadian French tutor focused on 'Conversational French.' My goal is to get you speaking fluently and naturally. We'll engage in lively discussions, role-play everyday situations, and explore various topics to expand your vocabulary and improve your pronunciation, making every conversation enjoyable.",
        image_url: null,
      },
      {
        id: 18, name: "Mohammed Hassan", language: "Arabic", expertise: "Levantine Arabic", country: "Jordan", price: 32, rating: 4.7, reviews: 60, likes: 600, numStudents: 240, numLessons: 1200, is_native: true, is_online: true, gender: 'male',
        description: "Marhaba! I'm Mohammed, a native speaker of 'Levantine Arabic' from Jordan. This dialect is widely spoken across the Levant region. My lessons are highly practical, focusing on daily conversation, common phrases, and cultural context, enabling you to connect deeply with locals in countries like Jordan, Syria, Lebanon, and Palestine.",
        image_url: null,
      },
      {
        id: 19, name: "Eva Kova", language: "Russian", expertise: "Business Russian", country: "Ukraine", price: 35, rating: 4.6, reviews: 50, likes: 520, numStudents: 210, numLessons: 1050, is_native: true, is_online: true, gender: 'female',
        description: "Здравствуйте! I'm Eva, an experienced tutor for 'Business Russian.' If you're working with Russian-speaking partners or clients, I can help you master the formal vocabulary, negotiation phrases, and cultural etiquette essential for the Russian business world. My lessons are tailored to your industry and specific professional goals.",
        image_url: null,
      },
      {
        id: 20, name: "David Miller", language: "English", expertise: "IELTS/TOEFL Prep", country: "United Kingdom", price: 38, rating: 4.9, reviews: 100, likes: 1100, numStudents: 450, numLessons: 2200, is_native: true, is_online: true, gender: 'male',
        description: "Greetings! I'm David, an expert tutor from the UK specializing in 'IELTS/TOEFL Preparation.' I provide comprehensive guidance on all sections of the exams (Reading, Writing, Listening, Speaking), offer proven strategies for success, and conduct mock tests to ensure you achieve your target score. Let's get you ready for your academic or professional future!",
        image_url: null,
      },
      {
        id: 21, name: "Linda Wong", language: "Mandarin", expertise: "Business Mandarin", country: "Taiwan", price: 37, rating: 4.8, reviews: 75, likes: 800, numStudents: 320, numLessons: 1600, is_native: true, is_online: true, gender: 'female',
        description: "你好! I'm Linda, a native Mandarin speaker from Taiwan with a focus on 'Business Mandarin.' My lessons will equip you with the essential vocabulary and phrases for business meetings, presentations, negotiations, and networking in the Chinese-speaking world. We'll also cover important cultural protocols to help you succeed.",
        image_url: null,
      },
      {
        id: 22, name: "Rajesh Kumar", language: "Hindi", expertise: "Hindi Culture & History", country: "India", price: 26, rating: 4.5, reviews: 55, likes: 550, numStudents: 230, numLessons: 1150, is_native: true, is_online: true, gender: 'male',
        description: "Namaste! I'm Rajesh, and I invite you to explore the rich tapestry of 'Hindi Culture & History' through language. My lessons intertwine Hindi language learning with fascinating insights into Indian traditions, festivals, mythology, and historical events. It's a holistic approach to truly understand the language in its cultural context.",
        image_url: null,
      },
      {
        id: 23, name: "Sophia Lee", language: "Korean", expertise: "General Korean", country: "South Korea", price: 30, rating: 4.7, reviews: 60, likes: 620, numStudents: 250, numLessons: 1250, is_native: true, is_online: true, gender: 'female',
        description: "Annyeonghaseyo! I'm Sophia, a dedicated 'General Korean' tutor. Whether you're starting from scratch or looking to improve, my lessons cover all aspects: reading, writing, listening, and speaking. We'll focus on foundational grammar, practical vocabulary, and pronunciation drills to ensure you build a strong and confident command of the Korean language.",
        image_url: null,
      },
      {
        id: 24, name: "Carlos Sanchez", language: "Spanish", expertise: "Spanish Literature", country: "Spain", price: 33, rating: 4.8, reviews: 45, likes: 480, numStudents: 180, numLessons: 900, is_native: true, is_online: true, gender: 'male',
        description: "¡Hola! I'm Carlos, a passionate academic specializing in 'Spanish Literature.' Join me to delve into the masterpieces of Spanish and Latin American authors, from Cervantes to García Márquez. We'll analyze texts, discuss themes, and expand your vocabulary, deepening your appreciation for the Spanish language and its profound literary heritage.",
        image_url: null,
      },
      {
        id: 25, name: "Eva Rodriguez", language: "Spanish", expertise: "Community Instructor", country: "Argentina", price: 22, rating: 4.5, reviews: 150, likes: 1300, numStudents: 600, numLessons: 2800, is_native: true, is_online: true, gender: 'female',
        description: "¡Hola a todos! I'm Eva, your friendly 'Community Instructor' for Spanish. My lessons are relaxed and casual, perfect for anyone who wants to practice speaking without pressure. We'll chat about everyday topics, share experiences, and improve your conversational fluency in a supportive and encouraging environment. All levels are welcome!",
        image_url: null,
      },
      {
        id: 26, name: "Hiroshi Sato", language: "Japanese", expertise: "Conversational Japanese", country: "Japan", price: 30, rating: 4.7, reviews: 90, likes: 900, numStudents: 380, numLessons: 1900, is_native: true, is_online: true, gender: 'male',
        description: "Konnichiwa! I'm Hiroshi, a patient native Japanese speaker dedicated to 'Conversational Japanese.' My lessons focus on getting you comfortable with speaking naturally. We'll use role-playing, current events, and daily scenarios to expand your practical vocabulary and refine your pronunciation, making every conversation enjoyable and effective.",
        image_url: null,
      },
      {
        id: 27, name: "Anna Müller", language: "German", expertise: "German for Travel", country: "Germany", price: 29, rating: 4.6, reviews: 70, likes: 700, numStudents: 300, numLessons: 1500, is_native: true, is_online: true, gender: 'female',
        description: "Guten Tag! I'm Anna, your personal guide to 'German for Travel.' Prepare for your German adventure with practical phrases, useful vocabulary for common situations (ordering food, asking for directions, shopping), and essential cultural tips. My lessons ensure you'll navigate Germany with confidence and enjoy your trip to the fullest.",
        image_url: null,
      },
      {
        id: 28, name: "David Miller", language: "English", expertise: "Accent Reduction", country: "USA", price: 35, rating: 4.8, reviews: 80, likes: 850, numStudents: 330, numLessons: 1650, is_native: true, is_online: true, gender: 'male',
        description: "Hi there! I'm David, an expert in 'Accent Reduction' for English. If you want to refine your pronunciation, reduce your accent, and sound more like a native speaker, my tailored lessons will help. We'll focus on specific sounds, intonation patterns, and rhythm, giving you the clarity and confidence to communicate effectively.",
        image_url: null,
      },
      {
        id: 29, name: "Elena Volkov", language: "Russian", expertise: "Russian for Beginners", country: "Russia", price: 28, rating: 4.5, reviews: 60, likes: 600, numStudents: 240, numLessons: 1200, is_native: true, is_online: true, gender: 'female',
        description: "Привет! I'm Elena, your friendly 'Russian for Beginners' tutor. Start your journey into the Russian language with simple, clear, and engaging lessons. We'll cover the Cyrillic alphabet, basic greetings, essential vocabulary, and fundamental grammar, building a strong foundation for your future learning. Patience and encouragement are guaranteed!",
        image_url: null,
      },
      {
        id: 30, name: "Paulo Mendes", language: "Portuguese", expertise: "European Portuguese", country: "Portugal", price: 32, rating: 4.7, reviews: 50, likes: 500, numStudents: 200, numLessons: 1000, is_native: true, is_online: true, gender: 'male',
        description: "Olá! I'm Paulo, a native tutor specializing in 'European Portuguese.' My lessons focus on the distinct pronunciation, grammar, and vocabulary of Portugal. Whether you're planning to live in Lisbon, visit Porto, or simply appreciate the sounds of European Portuguese, I'll provide structured and engaging lessons tailored to your needs.",
        image_url: null,
      },
    ];
    setAllInstructors(mockInstructors);
  }, []);

  // --- Array of diverse emojis for unique avatars ---
  const emojiAvatars = [
    '😀', '😎', '🤓', '😇', '🥳', '👩‍🎤', '👨‍💻', '🧑‍🔬', '🧙‍♀️', '👨‍🎓',
    '👩‍🍳', '👨‍🚀', '🤹', '🎤', '🎨', '🎧', '⚽', '📚', '🌍', '🌟',
    '💡', '🚀', '💯', '🌈', '🎓', '🎶', '🗣️', '💬', '📖', '🧑‍🤝‍🧑'
  ];

  // --- Filter and Sort Handlers (unchanged from previous) ---
  const handleFilterChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setCurrentPage(1);
  }, []);

  const handlePriceRangeChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: Number(value)
    }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }, []);

  // --- NEW: Handle Like Button Click ---
  const handleLikeClick = useCallback((instructorId) => {
    setLikedInstructors(prev => ({
      ...prev,
      [instructorId]: !prev[instructorId]
    }));
  }, []);

  // --- NEW: Handle Chat Button Click ---
  const handleChatClick = useCallback((instructor) => {
    setActiveChat(instructor);
  }, []);

  // --- Handle Chat Send ---
  const handleChatSend = useCallback((message, instructorName) => {
    alert(`Message to ${instructorName}: "${message}" sent! (This is a simulation)`);
    // In a real app, this would send to a backend chat service
  }, []);

  // --- Handle Translate Message ---
  const handleTranslateMessage = useCallback((message) => {
    alert(`Translating: "${message}"... (Simulation: translated text would appear here)`);
    // In a real app, this would call a translation API
  }, []);


  // --- Filtering and Sorting Logic (unchanged from previous) ---
  const filteredAndSortedInstructors = useMemo(() => {
    let filtered = allInstructors.filter(instructor => {
      // General Search Term
      if (searchTerm) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const matches =
          instructor.name.toLowerCase().includes(lowerCaseSearch) ||
          instructor.language.toLowerCase().includes(lowerCaseSearch) ||
          instructor.expertise.toLowerCase().includes(lowerCaseSearch) ||
          instructor.country.toLowerCase().includes(lowerCaseSearch) ||
          instructor.description.toLowerCase().includes(lowerCaseSearch);
        if (!matches) {
          return false;
        }
      }

      // Language Filter
      if (filters.language && instructor.language.toLowerCase() !== filters.language.toLowerCase()) {
        return false;
      }
      // Country Filter
      if (filters.country && instructor.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
      // Price Range Filter
      if (instructor.price < filters.minPrice || instructor.price > filters.maxPrice) {
        return false;
      }
      // Expertise Filter
      if (filters.expertise && instructor.expertise.toLowerCase() !== filters.expertise.toLowerCase()) {
        return false;
      }
      // Native Speaker Filter
      if (filters.isNativeSpeaker && !instructor.is_native) {
        return false;
      }
      // Minimum Rating Filter
      if (filters.rating > 0 && instructor.rating < filters.rating) {
        return false;
      }
      // Likes Filter (Minimum Likes)
      if (filters.likes > 0 && instructor.likes < filters.likes) {
        return false;
      }
      // Number of Students Filter (Minimum Students)
      if (filters.numStudents > 0 && instructor.numStudents < filters.numStudents) {
        return false;
      }
      // Number of Lessons Filter (Minimum Lessons)
      if (filters.numLessons > 0 && instructor.numLessons < filters.numLessons) {
        return false;
      }
      // Online/Offline Filter
      if (filters.isOnline !== null) {
        if (filters.isOnline !== instructor.is_online) {
          return false;
        }
      }
      // Gender Filter
      if (filters.gender && instructor.gender.toLowerCase() !== filters.gender.toLowerCase()) {
        return false;
      }

      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'likes-desc':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'students-desc':
        filtered.sort((a, b) => b.numStudents - a.numStudents);
        break;
      case 'lessons-desc':
        filtered.sort((a, b) => b.numLessons - a.numLessons);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return filtered;
  }, [filters, searchTerm, sortBy, allInstructors]);

  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredAndSortedInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);
  const totalPages = Math.ceil(filteredAndSortedInstructors.length / instructorsPerPage);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // --- Data for Select Dropdowns ---
  const languages = ["English", "Spanish", "French", "German", "Japanese", "Korean", "Mandarin", "Arabic", "Russian", "Italian", "Portuguese", "Hindi", "Swedish"];
  // Deduplicated and sorted countries for unique keys
  const allCountries = [
    "United States", "Canada", "United Kingdom", "Australia", "New Zealand",
    "Argentina", "Brazil", "Mexico", "Colombia", "Spain", "France", "Germany",
    "Italy", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria",
    "Sweden", "Norway", "Denmark", "Finland", "Ireland", "Poland", "Ukraine",
    "Russia", "China", "Japan", "South Korea", "India", "Indonesia", "Thailand",
    "Vietnam", "Philippines", "Egypt", "South Africa", "Nigeria", "Kenya",
    "Morocco", "Saudi Arabia", "United Arab Emirates", "Turkey", "Israel",
    "Greece", "Czech Republic", "Hungary", "Romania", "Chile", "Peru", "Venezuela",
    "Ecuador", "Bolivia", "Uruguay", "Cuba", "Dominican Republic",
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Armenia", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
    "Belize", "Benin", "Bhutan", "Bosnia and Herzegovina", "Botswana", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic",
    "Chad", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia",
    "Cyprus", "Djibouti", "Dominica", "East Timor (Timor-Leste)", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Gabon",
    "Gambia", "Georgia", "Ghana", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Iceland", "Iran", "Iraq", "Ivory Coast", "Jamaica",
    "Jordan", "Kazakhstan", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
    "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Nicaragua", "Niger",
    "North Korea", "North Macedonia", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
    "Papua New Guinea", "Paraguay", "Qatar", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Sudan", "Sri Lanka", "Sudan", "Suriname", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
    "Turkmenistan", "Tuvalu", "Uganda", "Uzbekistan", "Vanuatu",
    "Vatican City", "Yemen", "Zambia", "Zimbabwe"
  ].filter((value, index, self) => self.indexOf(value) === index).sort();

  const expertiseOptions = ["Community Instructor", "Native Speaker", "Certified Educator", "Language Specialist", "ESL Specialist", "Business English", "Conversational Spanish", "JLPT Prep", "French Culture & Travel", "Italian for Beginners", "Everyday Hindi", "HSK Preparation", "Modern Standard Arabic", "Russian for Travel", "K-Pop & K-Drama Korean", "Accent Reduction", "Business Russian", "German for Professionals", "Brazilian Portuguese", "Medical Spanish", "IELTS/TOEFL Prep", "Levantine Arabic", "Business Mandarin", "General English", "Spanish Literature", "General Korean", "German for Travel", "European Portuguese", "Russian for Beginners", "Hindi Culture & History", "General Swedish", "Conversational Japanese"];


  // --- Helper for Star Rating Display ---
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<svg key={`full-${i}`} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.536 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.781.565-1.836-.197-1.536-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>);
    }
    if (hasHalfStar) {
      stars.push(<svg key="half" className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-.22 0-.44.02-.66.07A9.993 9.993 0 002.3 12.3c-.05.22-.07.44-.07.66 0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8 0-4.043 3.013-7.382 6.903-7.933L12 4.07V20z"/></svg>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.536 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.781.565-1.836-.197-1.536-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>);
    }
    return stars;
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Top Banner (unchanged) */}
      <div className="bg-teal-50 text-teal-700 p-3 text-center text-sm">
        <span>Enhance your learning experience! Explore our new interactive exercises.</span>
      </div>

      {/* Header - ENHANCED */}
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-y-4">
          {/* LangZone Logo - Elegant SVG Icon */}
          <Link href="/" className="flex items-center space-x-2 text-2xl font-extrabold text-teal-700 flex-shrink-0">
            <svg
              className="w-9 h-9 text-teal-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Book Icon Path */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18s-3.332.477-4.5 1.253"
              />
              {/* Subtle Globe Overlay (simplified) */}
              <circle cx="12" cy="12" r="7" strokeWidth="1" opacity="0.6" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 2v20M2 12h20"
                opacity="0.6"
              />
            </svg>
            <span>LangZone</span>
          </Link>

          {/* Primary Navigation - Centered & Flexible */}
          <nav className="flex-grow flex justify-center order-last md:order-none w-full md:w-auto">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base font-medium">
              <li><Link href="/" className="text-gray-700 hover:text-teal-600 transition-colors px-2 py-1 rounded-md">Find Instructors</Link></li>
              <li><Link href="/how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors px-2 py-1 rounded-md">How It Works</Link></li>
              <li><Link href="/pricing" className="text-gray-700 hover:text-teal-600 transition-colors px-2 py-1 rounded-md">Pricing</Link></li>
              <li><Link href="/for-businesses" className="text-gray-700 hover:text-teal-600 transition-colors px-2 py-1 rounded-md">For Businesses</Link></li>
              <li><Link href="/resources" className="text-gray-700 hover:text-teal-600 transition-colors px-2 py-1 rounded-md">Resources</Link></li>
              <li><Link href="/blog" className="text-gray-700 hover:text-teal-600 transition-colors px-2 py-1 rounded-md">Blog</Link></li>
              <li><Link href="/trust-safety" className="text-gray-700 hover:text-teal-600 transition-colors px-2 py-1 rounded-md">Trust & Safety</Link></li>
              <li><Link href="/create-new-profile" className="text-gray-700 hover:text-teal-600 font-bold transition-colors px-2 py-1 rounded-md">Become an Instructor</Link></li>
            </ul>
          </nav>

          {/* Right-aligned User Actions */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link href="/rewards" className="text-gray-600 hover:text-teal-600 transition-colors hidden lg:block text-sm">Rewards</Link>
            <div className="relative hidden md:block"> {/* Hide on very small screens */}
              <select className="border border-gray-200 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none bg-white pr-8">
                <option>English ($USD)</option>
                <option>Spanish (€EUR)</option>
                <option>French (£GBP)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
              </div>
            </div>
            <Link href="/saved-instructors" className="text-gray-600 hover:text-red-500 transition-colors" title="Saved Instructors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </Link>
            <Link href="/alerts" className="text-gray-600 hover:text-teal-600 transition-colors" title="Alerts">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </Link>
            <button className="bg-teal-600 text-white py-2.5 px-6 rounded-lg text-base font-semibold hover:bg-teal-700 transition-colors shadow-md">Sign In</button>
          </div>
        </div>
      </header>


      {/* Hero Section (unchanged) */}
      <section className="bg-white py-16 px-6 text-center shadow-sm border-b border-gray-100">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Find the perfect <span className="text-teal-600">language instructor</span> for you
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Learn any language, anytime, anywhere. Personalized 1-on-1 lessons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Search by name, language, or expertise..."
              className="w-full sm:w-96 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="bg-teal-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-teal-700 transition-colors shadow-md">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area: Filters (Left) and Instructor Listings (Right) (unchanged layout from previous) */}
      <div className="container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">

        {/* Left Column: Sticky Filters */}
        <div className="lg:w-1/4 xl:w-1/5 flex-shrink-0">
          <div className="sticky top-28 bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Filters</h2>

            {/* Language Filter */}
            <div>
              <label htmlFor="language" className={labelClasses}>Language:</label>
              <div className="relative">
                <select
                  id="language"
                  name="language"
                  value={filters.language}
                  onChange={handleFilterChange}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  <option value="">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <label htmlFor="country" className={labelClasses}>Country:</label>
              <div className="relative">
                <select
                  id="country"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  <option value="">All Countries</option>
                  {allCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Price Range Filter (Slider) */}
            <div>
              <label className={labelClasses}>Price per lesson ($USD): ${filters.minPrice} - ${filters.maxPrice}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  name="minPrice"
                  min="0"
                  max="100"
                  value={filters.minPrice}
                  onChange={handlePriceRangeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                />
                <input
                  type="range"
                  name="maxPrice"
                  min="0"
                  max="100"
                  value={filters.maxPrice}
                  onChange={handlePriceRangeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                />
              </div>
            </div>

            {/* Expertise Filter */}
            <div>
              <label htmlFor="expertise" className={labelClasses}>Expertise:</label>
              <div className="relative">
                <select
                  id="expertise"
                  name="expertise"
                  value={filters.expertise}
                  onChange={handleFilterChange}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  <option value="">Any Expertise</option>
                  {expertiseOptions.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Native Speaker Filter */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNativeSpeaker"
                name="isNativeSpeaker"
                checked={filters.isNativeSpeaker}
                onChange={handleFilterChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="isNativeSpeaker" className="ml-2 block text-sm text-gray-900">
                Native Speaker Only
              </label>
            </div>

            {/* Online/Offline Filter */}
            <div>
              <label htmlFor="isOnline" className={labelClasses}>Availability:</label>
              <div className="relative">
                <select
                  id="isOnline"
                  name="isOnline"
                  value={filters.isOnline === null ? '' : filters.isOnline.toString()}
                  onChange={(e) => setFilters(prev => ({ ...prev, isOnline: e.target.value === '' ? null : e.target.value === 'true' }))}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  <option value="">Any</option>
                  <option value="true">Online</option>
                  <option value="false">Offline</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label htmlFor="gender" className={labelClasses}>Gender:</label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  <option value="">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                </div>
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <label htmlFor="rating" className={labelClasses}>Minimum Rating: {filters.rating > 0 ? `${filters.rating} stars` : 'Any'}</label>
              <input
                type="range"
                id="rating"
                name="rating"
                min="0"
                max="5"
                step="0.5"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              />
            </div>

            {/* Minimum Likes Filter */}
            <div>
              <label htmlFor="likes" className={labelClasses}>Minimum Likes: {filters.likes > 0 ? filters.likes : 'Any'}</label>
              <input
                type="range"
                id="likes"
                name="likes"
                min="0"
                max="2000"
                step="50"
                value={filters.likes}
                onChange={handleFilterChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              />
            </div>

            {/* Minimum Number of Students Filter */}
            <div>
              <label htmlFor="numStudents" className={labelClasses}>Minimum Students: {filters.numStudents > 0 ? filters.numStudents : 'Any'}</label>
              <input
                type="range"
                id="numStudents"
                name="numStudents"
                min="0"
                max="1000"
                step="50"
                value={filters.numStudents}
                onChange={handleFilterChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              />
            </div>

            {/* Minimum Number of Lessons Filter */}
            <div>
              <label htmlFor="numLessons" className={labelClasses}>Minimum Lessons: {filters.numLessons > 0 ? filters.numLessons : 'Any'}</label>
              <input
                type="range"
                id="numLessons"
                name="numLessons"
                min="0"
                max="5000"
                step="100"
                value={filters.numLessons}
                onChange={handleFilterChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              />
            </div>

            <button
              onClick={() => setFilters({ language: '', country: '', minPrice: 0, maxPrice: 50, expertise: '', isNativeSpeaker: false, rating: 0, likes: 0, numStudents: 0, numLessons: 0, isOnline: null, gender: '' })}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>

            {/* Quick Actions Section */}
            <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <Link
                    href="/create-new-profile" // Corrected link to match the new profile page route
                    className="block bg-teal-500 text-white text-center py-2.5 px-4 rounded-lg font-semibold hover:bg-teal-600 transition-colors mb-3"
                >
                    Become an Instructor
                </Link>
                <Link
                    href="/ai-practice"
                    className="block border border-teal-500 text-teal-600 text-center py-2.5 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                >
                    Try AI Practice
                </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Instructor Listings & Sort By */}
        <div className="lg:w-3/4 xl:w-4/5">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              {loading ? "Loading Instructors..." : `${filteredAndSortedInstructors.length} Instructors Found`}
            </h2>
            <div className="flex items-center space-x-3">
              <label htmlFor="sortBy" className="text-gray-700 text-sm font-medium">Sort by:</label>
              <div className="relative">
                <select
                  id="sortBy"
                  name="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className={`${inputClasses} text-sm py-1.5 appearance-none pr-8`}
                >
                  <option value="popular">Popular (Reviews)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="likes-desc">Most Liked</option>
                  <option value="students-desc">Most Students</option>
                  <option value="lessons-desc">Most Lessons</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {loading && !error && (
            <div className="text-center py-10 text-gray-600 text-lg">
              <svg className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching instructors...
            </div>
          )}

          {!loading && !error && currentInstructors.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-600 text-lg">
              No instructors found matching your criteria. Try adjusting your filters!
            </div>
          )}

          {!loading && !error && currentInstructors.length > 0 && (
            <div className="flex flex-col gap-6"> {/* Main change: flex-col for stacking cards */}
              {currentInstructors.map((instructor, index) => (
                <div key={instructor.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 w-full md:w-56 flex-shrink-0 bg-gray-200 flex items-center justify-center"> {/* Image container */}
                    {/* Unique Emoji Avatar */}
                    <span className="text-6xl text-gray-500 leading-none">
                        {emojiAvatars[instructor.id % emojiAvatars.length]}
                    </span>
                    {/* Like Button Overlay */}
                    <button
                      onClick={() => handleLikeClick(instructor.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 transition-colors ${
                        likedInstructors[instructor.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={likedInstructors[instructor.id] ? "Unlike" : "Like"}
                    >
                      <svg
                        className="w-6 h-6"
                        fill={likedInstructors[instructor.id] ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-grow"> {/* Text content container */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">{instructor.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        {renderStars(instructor.rating)}
                        <span className="text-gray-700 font-semibold ml-1">{instructor.rating?.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm ml-1">({instructor.reviews})</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-semibold">{instructor.language}</span> - {instructor.expertise} from {instructor.country}
                    </p>
                    <div className="flex flex-wrap items-center text-gray-600 text-sm mb-3 gap-x-4 gap-y-1">
                      <span>
                        <span className="font-semibold">{instructor.numStudents}</span> students
                      </span>
                      <span>
                        <span className="font-semibold">{instructor.numLessons}</span> lessons
                      </span>
                      <span>
                        <span className="font-semibold">{instructor.likes}</span> likes
                      </span>
                      {instructor.is_online ? (
                        <span className="flex items-center text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"></circle></svg>
                          Online Now
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 011-1h0a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1V5z"></path></svg>
                          Offline
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-4 flex-grow line-clamp-3">{instructor.description}</p>
                    <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-100">
                      <span className="text-2xl font-bold text-teal-600 mb-3 sm:mb-0">${instructor.price}<span className="text-base text-gray-500 font-normal">/lesson</span></span>
                      <div className="flex space-x-2">
                         {/* Calendar Booking Button */}
                        <button
                          onClick={() => alert(`Opening calendar for ${instructor.name}. (Integration with booking system like Calendly would go here.)`)}
                          className="bg-blue-500 text-white p-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Book a lesson"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </button>
                        {/* Video Call Button (Zoom Integration) */}
                        <button
                          onClick={() => {
                            // In a real application, you'd dynamically get the meeting ID
                            // and securely initiate the call. This is a placeholder.
                            const zoomMeetingId = 'YOUR_MEETING_ID_HERE'; // Replace with actual meeting ID
                            window.open(`zoommtg://zoom.us/join?action=join&confno=${zoomMeetingId}`, '_blank');
                            alert(`Attempting to open Zoom for a call with ${instructor.name}. (Requires Zoom app installed.)`);
                          }}
                          className="bg-purple-500 text-white p-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Start a video call"
                        >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2H4z"></path></svg>
                        </button>
                        {/* Chat Feature Button */}
                        <button
                          onClick={() => handleChatClick(instructor)}
                          className="bg-green-500 text-white p-2 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Chat with instructor"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </button>
                         {/* Payment Button (Conceptual) */}
                        <button
                          onClick={() => alert(`Initiating payment for ${instructor.name}'s lesson. (Integration with a payment gateway like Stripe/PayPal would go here.)`)}
                          className="bg-yellow-500 text-white p-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Pay for lesson"
                        >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </button>
                        {/* Book Trial Button */}
                        <button className="bg-teal-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-md">
                          Book a Trial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination (unchanged) */}
          {!loading && !error && filteredAndSortedInstructors.length > instructorsPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white text-teal-600 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === i + 1 ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white text-teal-600 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface Modal */}
      {activeChat && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col h-3/4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Chat with {activeChat.name}</h3>
              <button
                onClick={() => setActiveChat(null)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {/* Mock Chat Messages */}
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[70%]">
                  Hi there! How can I help you with your language learning journey today?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-teal-100 text-teal-800 p-3 rounded-lg max-w-[70%]">
                  Hello {activeChat.name}! I'm interested in learning {activeChat.language}. What's your teaching methodology?
                </div>
              </div>
               <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[70%]">
                 My teaching methodology focuses on immersive conversation and practical application. We'll speak as much as possible, even from the first lesson, to build your confidence and fluency quickly. I also incorporate grammar and vocabulary exercises tailored to your needs.
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows="2"
                placeholder="Type your message..."
                id="chatInput"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    const message = document.getElementById('chatInput').value;
                    if (message) handleTranslateMessage(message);
                  }}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Translate
                </button>
                <button
                  onClick={() => {
                    const message = document.getElementById('chatInput').value;
                    if (message) {
                      handleChatSend(message, activeChat.name);
                      document.getElementById('chatInput').value = ''; // Clear input
                    }
                  }}
                  className="bg-teal-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-700 transition-colors text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Footer - ENHANCED */}
      <footer className="bg-gray-800 text-gray-300 py-10 px-6 mt-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left mb-8">
            {/* Company Section */}
            <div>
              <h6 className="font-bold text-white mb-4 text-lg">LangZone</h6>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Learn Languages Section */}
            <div>
              <h6 className="font-bold text-white mb-4 text-lg">Learn Languages</h6>
              <ul className="space-y-2 text-sm">
                <li><Link href="/learn/english" className="hover:text-white transition-colors">Learn English</Link></li>
                <li><Link href="/learn/spanish" className="hover:text-white transition-colors">Learn Spanish</Link></li>
                <li><Link href="/learn/french" className="hover:text-white transition-colors">Learn French</Link></li>
                <li><Link href="/learn/german" className="hover:text-white transition-colors">Learn German</Link></li>
                <li><Link href="/learn/japanese" className="hover:text-white transition-colors">Learn Japanese</Link></li>
                <li><Link href="/all-languages" className="hover:text-white transition-colors">All Languages</Link></li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h6 className="font-bold text-white mb-4 text-lg">Resources</h6>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Learning Guides</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community Forum</Link></li>
                <li><Link href="/ai-practice" className="hover:text-white transition-colors">AI Practice Tools</Link></li>
                <li><Link href="/refer-a-friend" className="hover:text-white transition-colors">Refer a Friend</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h6 className="font-bold text-white mb-4 text-lg">Support</h6>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/report-issue" className="hover:text-white transition-colors">Report an Issue</Link></li>
                <li><Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link></li>
              </ul>
            </div>

            {/* Why Choose Us */}
            <div>
              <h6 className="font-bold text-white mb-4 text-lg">Why Choose Us?</h6>
              <ul className="space-y-2 text-sm">
                <li><Link href="/why-us/experienced-instructors" className="hover:text-white transition-colors">Experienced Instructors</Link></li>
                <li><Link href="/why-us/flexible-scheduling" className="hover:text-white transition-colors">Flexible Scheduling</Link></li>
                <li><Link href="/why-us/personalized-lessons" className="hover:text-white transition-colors">Personalized Lessons</Link></li>
                <li><Link href="/why-us/affordable-pricing" className="hover:text-white transition-colors">Affordable Pricing</Link></li>
                <li><Link href="/why-us/global-community" className="hover:text-white transition-colors">Global Community</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media and Copyright */}
          <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              © {new Date().getFullYear()} LangZone. All rights reserved.
            </p>
            <div className="flex space-x-5 text-gray-400">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885V5H9v3z"/></svg>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.892-.959-2.173-1.559-3.591-1.559-3.447 0-6.227 2.78-6.227 6.227 0 .486.058.96.173 1.411-5.18-.26-9.77-2.73-12.898-6.472-.538.924-.848 1.996-.848 3.13 0 2.152 1.097 4.045 2.766 5.158-.807-.025-1.568-.247-2.228-.616v.086c0 3.02 2.13 5.544 4.935 6.107-.464.12-.953.187-1.456.187-.359 0-.709-.035-1.05-.1 1.04-.325 1.92-1.274 2.144-2.268 2.457 1.921 5.626 3.324 9.407 3.324 11.3 0 17.5-9.314 17.5-17.498 0-.486-.025-.96-.075-1.424.97-.699 1.81-1.593 2.47-2.585z"/></svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.251-.148-4.77-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.685-.073 4.948 0 3.26-.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.685.072 4.948.072s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.684.073-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.685-.073-4.947-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.44-.645 1.44-1.44s-.645-1.44-1.44-1.44z"/></svg>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.136-.318-6.269-.318-9.404 0C6.68 3.502 4.924 4.887 3.513 6.3c-.157.17-.306.347-.449.529-.623.77-.962 1.714-.962 2.707v5.338c0 .993.339 1.937.962 2.707.143.182.292.359.449.529 1.412 1.413 3.167 2.798 6.732 3.116 3.135.318 6.269.318 9.404 0 3.565-.318 5.32-1.703 6.732-3.116.143-.182.292-.359.449-.529.623-.77.962-1.714.962-2.707V9.54c0-.993-.339-1.937-.962-2.707-.143-.182-.292-.359-.449-.529-1.412-1.413-3.167-2.798-6.732-3.116zm-7.615 11.816v-6l5 3-5 3z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}