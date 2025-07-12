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
  const [filters, setFilters] = useState<FiltersState>({
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
  const [allInstructors, setAllInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedInstructors, setLikedInstructors] = useState<Record<number, boolean>>({});
  const [activeChat, setActiveChat] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const instructorsPerPage = 10;

  // Scroll handler for hiding header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible]);

  // Mock instructor data
  useEffect(() => {
    const mockInstructors = [
      {
        id: 1, name: "Sofía Gonzalez", language: "Spanish", expertise: "Certified Educator", country: "Argentina", price: 29, rating: 4.8, reviews: 100, likes: 1200, numStudents: 500, numLessons: 2500, is_native: true, is_online: true, gender: 'female',
        description: "Hola! I'm Sofía, a passionate and certified Spanish educator from Argentina with 10+ years of experience. My lessons are dynamic and immersive, focusing on conversational fluency, grammar mastery, and cultural insights.",
        image_url: null,
      },
      // ... (keep all your existing mock instructor data)
    ];
    setAllInstructors(mockInstructors);
  }, []);

  // Emoji avatars
  const emojiAvatars = [
    '😀', '😎', '🤓', '😇', '🥳', '👩‍🎤', '👨‍💻', '🧑‍🔬', '🧙‍♀️', '👨‍🎓',
    '👩‍🍳', '👨‍🚀', '🤹', '🎤', '🎨', '🎧', '⚽', '📚', '🌍', '🌟',
    '💡', '🚀', '💯', '🌈', '🎓', '🎶', '🗣️', '💬', '📖', '🧑‍🤝‍🧑'
  ];

  // Filter handlers
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setCurrentPage(1);
  }, []);

  const handlePriceRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: Number(value)
    }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleLikeClick = useCallback((instructorId: number) => {
    setLikedInstructors(prev => ({
      ...prev,
      [instructorId]: !prev[instructorId]
    }));
  }, []);

  const handleChatClick = useCallback((instructor: any) => {
    setActiveChat(instructor);
  }, []);

  const handleChatSend = useCallback((message: string, instructorName: string) => {
    alert(`Message to ${instructorName}: "${message}" sent! (This is a simulation)`);
    const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
    if (chatInput) chatInput.value = '';
  }, []);

  const handleTranslateMessage = useCallback((message: string) => {
    alert(`Translating: "${message}"... (Simulation: translated text would appear here)`);
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedInstructors = useMemo(() => {
    let filtered = allInstructors.filter(instructor => {
      if (searchTerm) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        if (!(
          instructor.name.toLowerCase().includes(lowerCaseSearch) ||
          instructor.language.toLowerCase().includes(lowerCaseSearch) ||
          instructor.expertise.toLowerCase().includes(lowerCaseSearch) ||
          instructor.country.toLowerCase().includes(lowerCaseSearch) ||
          instructor.description.toLowerCase().includes(lowerCaseSearch)
        ) {
          return false;
        }
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
      default: filtered.sort((a, b) => b.reviews - a.reviews); break;
    }

    return filtered;
  }, [filters, searchTerm, sortBy, allInstructors]);

  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredAndSortedInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);
  const totalPages = Math.ceil(filteredAndSortedInstructors.length / instructorsPerPage);

  const paginate = useCallback((pageNumber: number) => setCurrentPage(pageNumber), []);

  const renderStars = (rating: number) => {
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

  // Data for dropdowns
  const languages = ["English", "Spanish", "French", "German", "Japanese", "Korean", "Mandarin", "Arabic", "Russian", "Italian", "Portuguese", "Hindi", "Swedish"];
  const allCountries = ["United States", "Canada", "United Kingdom", /* ... */].sort();
  const expertiseOptions = ["Community Instructor", "Native Speaker", /* ... */];

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Top Banner */}
      <div className="bg-teal-50 text-teal-700 p-3 text-center text-sm">
        <span>Enhance your learning experience! Explore our new interactive exercises.</span>
      </div>

      {/* Header with mobile menu */}
      <header className={`bg-white shadow-sm py-4 px-6 border-b border-gray-100 sticky top-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-extrabold text-teal-700">
            <svg className="w-9 h-9 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
              <circle cx="12" cy="12" r="7" strokeWidth="1" opacity="0.6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 2v20M2 12h20" opacity="0.6" />
            </svg>
            <span>LangZone</span>
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-teal-600">Find Instructors</Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-teal-600">How It Works</Link>
            <Link href="/pricing" className="text-gray-700 hover:text-teal-600">Pricing</Link>
            <Link href="/create-new-profile" className="text-gray-700 hover:text-teal-600 font-bold">Become an Instructor</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/saved-instructors" className="text-gray-600 hover:text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </Link>
            <button className="bg-teal-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-teal-700">Sign In</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg z-50">
            <div className="container mx-auto px-6 py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-teal-600 py-2">Find Instructors</Link>
                <Link href="/how-it-works" className="text-gray-700 hover:text-teal-600 py-2">How It Works</Link>
                <Link href="/pricing" className="text-gray-700 hover:text-teal-600 py-2">Pricing</Link>
                <Link href="/for-businesses" className="text-gray-700 hover:text-teal-600 py-2">For Businesses</Link>
                <Link href="/resources" className="text-gray-700 hover:text-teal-600 py-2">Resources</Link>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href="/signin" className="block w-full bg-teal-600 text-white py-2 px-4 rounded-lg text-center">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 px-6 text-center shadow-sm border-b border-gray-100">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Find the perfect <span className="text-teal-600">language instructor</span> for you
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setFiltersOpen(true)}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold"
          >
            Show Filters
          </button>
        </div>

        {/* Filters Panel */}
        <div className={`fixed lg:relative inset-0 lg:inset-auto z-40 bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6 transition-transform duration-300 ${filtersOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto`}>
          <button 
            onClick={() => setFiltersOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-5">Filters</h2>
          
          {/* All your filter inputs go here */}
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

          {/* ... (include all your other filters) ... */}

          <button
            onClick={() => setFilters({
              language: '', country: '', minPrice: 0, maxPrice: 50, expertise: '', 
              isNativeSpeaker: false, rating: 0, likes: 0, numStudents: 0, 
              numLessons: 0, isOnline: null, gender: ''
            })}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {/* Instructor Listings */}
        <div className="lg:w-3/4 xl:w-4/5">
          {/* Sort and results count */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              {loading ? "Loading..." : `${filteredAndSortedInstructors.length} Instructors Found`}
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

          {/* Instructor Cards */}
          {!loading && !error && currentInstructors.length > 0 && (
            <div className="flex flex-col gap-6">
              {currentInstructors.map((instructor) => (
                <div key={instructor.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 w-full md:w-56 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-6xl text-gray-500 leading-none">
                      {emojiAvatars[instructor.id % emojiAvatars.length]}
                    </span>
                    <button
                      onClick={() => handleLikeClick(instructor.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 transition-colors ${
                        likedInstructors[instructor.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <svg className="w-6 h-6" fill={likedInstructors[instructor.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
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
                      <span><span className="font-semibold">{instructor.numStudents}</span> students</span>
                      <span><span className="font-semibold">{instructor.numLessons}</span> lessons</span>
                      <span><span className="font-semibold">{instructor.likes}</span> likes</span>
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
                        {/* Video Call Button with Zoom Integration */}
                        <button
                          onClick={() => {
                            const meetingNumber = '1234567890'; // Replace with actual meeting ID
                            const passcode = '1234'; // Replace with actual passcode
                            const username = 'Guest';
                            
                            // Zoom URI scheme
                            const zoomUri = `zoommtg://zoom.us/join?confno=${meetingNumber}&pwd=${passcode}&uname=${encodeURIComponent(username)}`;
                            const zoomWebUrl = `https://zoom.us/j/${meetingNumber}?pwd=${passcode}`;
                            
                            // Try to open the app first
                            window.location.href = zoomUri;
                            
                            // Fallback to web after delay
                            setTimeout(() => {
                              window.open(zoomWebUrl, '_blank');
                            }, 200);
                          }}
                          className="min-w-[48px] min-h-[48px] bg-purple-500 text-white p-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors shadow-md flex items-center justify-center"
                          title="Start a video call"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2H4z"></path>
                          </svg>
                        </button>

                        {/* Chat Button */}
                        <button
                          onClick={() => handleChatClick(instructor)}
                          className="min-w-[48px] min-h-[48px] bg-green-500 text-white p-2 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md flex items-center justify-center"
                          title="Chat with instructor"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                        </button>

                        {/* Book Trial Button */}
                        <button className="min-h-[48px] bg-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-md">
                          Book Trial
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

      {/* Chat Interface */}
      {activeChat && (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 ${activeChat ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Chat with {activeChat.name}</h3>
              <button
                onClick={() => setActiveChat(null)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
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
                  My teaching methodology focuses on immersive conversation and practical application. We'll speak as much as possible, even from the first lesson!
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows={2}
                placeholder="Type your message..."
                id="chatInput"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
                    if (chatInput?.value) handleTranslateMessage(chatInput.value);
                  }}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Translate
                </button>
                <button
                  onClick={() => {
                    const chatInput = document.getElementById('chatInput') as HTMLTextAreaElement;
                    if (chatInput?.value) {
                      handleChatSend(chatInput.value, activeChat.name);
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

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10 px-6 mt-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left mb-8">
            {/* Footer sections */}
            <div>
              <h6 className="font-bold text-white mb-4 text-lg">LangZone</h6>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            {/* More footer columns... */}
          </div>
          <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              © {new Date().getFullYear()} LangZone. All rights reserved.
            </p>
            <div className="flex space-x-5 text-gray-400">
              {/* Social media icons */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}