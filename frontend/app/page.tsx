// frontend/app/page.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';

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
  const [likedInstructors, setLikedInstructors] = useState({});
  const [activeChat, setActiveChat] = useState(null);

  const instructorsPerPage = 10;

  // Fetch instructors from API (with graceful fallback)
  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        // Commented out for development - will be enabled when API is ready
        // const response = await axios.get('/api/instructors');
        // setAllInstructors(response.data);
        
        // Fallback empty array for development
        setAllInstructors([]);
      } catch (err) {
        console.log('API not available yet - using demo mode');
        setAllInstructors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstructors();
  }, []);

  // --- Array of diverse emojis for unique avatars ---
  const emojiAvatars = [
    '😀', '😎', '🤓', '😇', '🥳', '👩‍🎤', '👨‍💻', '🧑‍🔬', '🧙‍♀️', '👨‍🎓',
    '👩‍🍳', '👨‍🚀', '🤹', '🎤', '🎨', '🎧', '⚽', '📚', '🌍', '🌟',
    '💡', '🚀', '💯', '🌈', '🎓', '🎶', '🗣️', '💬', '📖', '🧑‍🤝‍🧑'
  ];

  // --- Filter and Sort Handlers ---
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

  const handleLikeClick = useCallback((instructorId) => {
    setLikedInstructors(prev => ({
      ...prev,
      [instructorId]: !prev[instructorId]
    }));
  }, []);

  const handleChatClick = useCallback((instructor) => {
    setActiveChat(instructor);
  }, []);

  const handleChatSend = useCallback((message, instructorName) => {
    alert(`Message to ${instructorName}: "${message}" sent! (This is a simulation)`);
  }, []);

  const handleTranslateMessage = useCallback((message) => {
    alert(`Translating: "${message}"... (Simulation: translated text would appear here)`);
  }, []);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedInstructors = useMemo(() => {
    let filtered = allInstructors.filter(instructor => {
      if (searchTerm) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        const matches =
          instructor.name.toLowerCase().includes(lowerCaseSearch) ||
          instructor.language.toLowerCase().includes(lowerCaseSearch) ||
          instructor.expertise.toLowerCase().includes(lowerCaseSearch) ||
          instructor.country.toLowerCase().includes(lowerCaseSearch) ||
          instructor.description.toLowerCase().includes(lowerCaseSearch);
        if (!matches) return false;
      }

      if (filters.language && instructor.language.toLowerCase() !== filters.language.toLowerCase()) return false;
      if (filters.country && instructor.country.toLowerCase() !== filters.country.toLowerCase()) return false;
      if (instructor.price < filters.minPrice || instructor.price > filters.maxPrice) return false;
      if (filters.expertise && instructor.expertise.toLowerCase() !== filters.expertise.toLowerCase()) return false;
      if (filters.isNativeSpeaker && !instructor.is_native) return false;
      if (filters.rating > 0 && instructor.rating < filters.rating) return false;
      if (filters.likes > 0 && instructor.likes < filters.likes) return false;
      if (filters.numStudents > 0 && instructor.numStudents < filters.numStudents) return false;
      if (filters.numLessons > 0 && instructor.numLessons < filters.numLessons) return false;
      if (filters.isOnline !== null && filters.isOnline !== instructor.is_online) return false;
      if (filters.gender && instructor.gender.toLowerCase() !== filters.gender.toLowerCase()) return false;

      return true;
    });

    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'likes-desc': filtered.sort((a, b) => b.likes - a.likes); break;
      case 'students-desc': filtered.sort((a, b) => b.numStudents - a.numStudents); break;
      case 'lessons-desc': filtered.sort((a, b) => b.numLessons - a.numLessons); break;
      case 'popular':
      default: filtered.sort((a, b) => b.reviews - a.reviews); break;
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

  // Data for dropdowns
  const languages = ["English", "Spanish", "French", "German", "Japanese", "Korean", "Mandarin", "Arabic", "Russian", "Italian", "Portuguese", "Hindi", "Swedish"];
  const allCountries = [
    "United States", "Canada", "United Kingdom", "Australia", "New Zealand",
    "Argentina", "Brazil", "Mexico", "Colombia", "Spain", "France", "Germany",
    "Italy", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria",
    "Sweden", "Norway", "Denmark", "Finland", "Ireland", "Poland", "Ukraine",
    "Russia", "China", "Japan", "South Korea", "India", "Indonesia", "Thailand",
    "Vietnam", "Philippines", "Egypt", "South Africa", "Nigeria", "Kenya",
    "Morocco", "Saudi Arabia", "United Arab Emirates", "Turkey", "Israel",
    "Greece", "Czech Republic", "Hungary", "Romania", "Chile", "Peru", "Venezuela",
    "Ecuador", "Bolivia", "Uruguay", "Cuba", "Dominican Republic"
  ].filter((value, index, self) => self.indexOf(value) === index).sort();

  const expertiseOptions = ["Community Instructor", "Native Speaker", "Certified Educator", "Language Specialist", "ESL Specialist", "Business English", "Conversational Spanish", "JLPT Prep", "French Culture & Travel", "Italian for Beginners", "Everyday Hindi", "HSK Preparation", "Modern Standard Arabic", "Russian for Travel", "K-Pop & K-Drama Korean", "Accent Reduction", "Business Russian", "German for Professionals", "Brazilian Portuguese", "Medical Spanish", "IELTS/TOEFL Prep", "Levantine Arabic", "Business Mandarin", "General English", "Spanish Literature", "General Korean", "German for Travel", "European Portuguese", "Russian for Beginners", "Hindi Culture & History", "General Swedish", "Conversational Japanese"];

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
      {/* Top Banner */}
      <div className="bg-teal-50 text-teal-700 p-3 text-center text-sm">
        <span>Enhance your learning experience! Explore our new interactive exercises.</span>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-y-4">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-extrabold text-teal-700 flex-shrink-0">
            <svg className="w-9 h-9 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18s-3.332.477-4.5 1.253"/>
              <circle cx="12" cy="12" r="7" strokeWidth="1" opacity="0.6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 2v20M2 12h20" opacity="0.6"/>
            </svg>
            <span>LangZone</span>
          </Link>

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

          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link href="/rewards" className="text-gray-600 hover:text-teal-600 transition-colors hidden lg:block text-sm">Rewards</Link>
            <div className="relative hidden md:block">
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

      {/* Hero Section */}
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

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Filters */}
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

            {/* Price Range Filter */}
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
                    href="/create-new-profile"
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

        {/* Right Column: Instructor Listings */}
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
            <div className="col-span-full text-center py-10">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mt-4">No instructors available yet</h3>
                <p className="text-gray-500 mt-2">
                  We're preparing our instructor database. Check back soon!
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => alert('This would open instructor registration in a real app')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Become an Instructor
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && currentInstructors.length > 0 && (
            <div className="flex flex-col gap-6">
              {currentInstructors.map((instructor) => (
                <div key={instructor.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 w-full md:w-56 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-6xl text-gray-500 leading-none">
                        {emojiAvatars[instructor.id % emojiAvatars.length]}
                    </span>
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
                  <div className="p-5 flex flex-col flex-grow">
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
                        <button
                          onClick={() => alert(`Opening calendar for ${instructor.name}. (Integration with booking system like Calendly would go here.)`)}
                          className="bg-blue-500 text-white p-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Book a lesson"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </button>
                        <button
                          onClick={() => {
                            const zoomMeetingId = 'YOUR_MEETING_ID_HERE';
                            window.open(`zoommtg://zoom.us/join?action=join&confno=${zoomMeetingId}`, '_blank');
                            alert(`Attempting to open Zoom for a call with ${instructor.name}. (Requires Zoom app installed.)`);
                          }}
                          className="bg-purple-500 text-white p-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Start a video call"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2H4z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleChatClick(instructor)}
                          className="bg-green-500 text-white p-2 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Chat with instructor"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </button>
                        <button
                          onClick={() => alert(`Initiating payment for ${instructor.name}'s lesson. (Integration with a payment gateway like Stripe/PayPal would go here.)`)}
                          className="bg-yellow-500 text-white p-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md text-sm flex items-center justify-center"
                          title="Pay for lesson"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </button>
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

          {/* Pagination */}
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
                      document.getElementById('chatInput').value = '';
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
    </div>
  );
}