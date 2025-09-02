// app/tutors/[slug]/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import InteractiveBookingCalendar from './InteractiveBookingCalendar';
import PaymentsZoomButtons from '../../../components/PaymentsZoomButtons';

import {
  FaStar,
  FaHeart,
  FaMapMarkerAlt,
  FaLanguage,
  FaGraduationCap,
  FaBriefcase,
  FaInfoCircle,
  FaSearch,
  FaSun,
  FaMoon,
  FaPlay,
  FaGlobe,
  FaClock,
  FaDollarSign,
  FaVideo,
  FaPhone,
  FaEnvelope,
  FaCircle,
  FaDotCircle,
} from 'react-icons/fa';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  country?: string;
  language?: string;
  is_native?: boolean;
  expertise?: string;
  qualifications?: string;
  years_experience?: number;
  price?: number;
  description?: string;
  video_intro_url?: string;
  social_links?: string;
  slug?: string;
  image_url?: string;
  zoom_meeting_id?: string;
  zoom_password?: string;
  createdAt?: string;
}

type Cached = { instructor: Instructor; avatarUrl: string; cachedAt: number };

export default function TutorPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [allSlugs, setAllSlugs] = useState<string[]>([]);
  const [direction, setDirection] = useState<1 | -1>(1);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextTutor(),
    onSwipedRight: () => handlePrevTutor(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const CACHE_TTL = 1000 * 60 * 3;
  const cacheKey = (s: string) => `instructor:${s}`;

  const readCache = (s: string): Cached | null => {
    try {
      const raw = localStorage.getItem(cacheKey(s));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Cached;
      if (Date.now() - parsed.cachedAt > CACHE_TTL) {
        localStorage.removeItem(cacheKey(s));
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const writeCache = (s: string, data: Cached) => {
    try {
      localStorage.setItem(cacheKey(s), JSON.stringify(data));
    } catch {}
  };

  const preloadImage = (url: string) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  };

  const currentIndex = useMemo(
    () => allSlugs.findIndex((s) => s === slug),
    [allSlugs, slug]
  );

  const nextSlug = useMemo(() => {
    if (!allSlugs.length || currentIndex === -1) return null;
    return allSlugs[(currentIndex + 1) % allSlugs.length];
  }, [allSlugs, currentIndex]);

  const prevSlug = useMemo(() => {
    if (!allSlugs.length || currentIndex === -1) return null;
    return allSlugs[(currentIndex - 1 + allSlugs.length) % allSlugs.length];
  }, [allSlugs, currentIndex]);

  async function fetchAndCacheBySlug(s: string) {
    const { data, error: fetchError } = await supabase
      .from('Instructor')
      .select('*')
      .eq('slug', s)
      .single();
    if (fetchError || !data) return null;

    let avatar = '';
    if (data.image_url) {
      const { data: publicUrlData } = supabase.storage
        .from('instructor-images')
        .getPublicUrl(data.image_url);
      avatar = publicUrlData.publicUrl || '';
    }

    const packed: Cached = { instructor: data, avatarUrl: avatar, cachedAt: Date.now() };
    writeCache(s, packed);
    preloadImage(avatar);
    return packed;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError(null);
      setLoading(true);

      const cached = typeof window !== 'undefined' ? readCache(slug) : null;
      if (cached && mounted) {
        setInstructor(cached.instructor);
        setAvatarUrl(cached.avatarUrl);
        setLoading(false);
      }

      const packed = await fetchAndCacheBySlug(slug);
      if (!mounted) return;
      if (packed) {
        setInstructor(packed.instructor);
        setAvatarUrl(packed.avatarUrl);
        setError(null);
      } else if (!cached) {
        setError('Failed to load instructor profile.');
      }
      setLoading(false);
      setNavigating(false);
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    (async () => {
      const { data: slugsData } = await supabase.from('Instructor').select('slug');
      if (slugsData) setAllSlugs(slugsData.map((i: any) => i.slug));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (nextSlug && !readCache(nextSlug)) await fetchAndCacheBySlug(nextSlug);
      if (prevSlug && !readCache(prevSlug)) await fetchAndCacheBySlug(prevSlug);
    })();
  }, [nextSlug, prevSlug]);

  const handleLike = () => {
    setLikes((prev) => (userLiked ? prev - 1 : prev + 1));
    setUserLiked((prev) => !prev);
  };

  const handleNextTutor = async () => {
    if (!allSlugs.length || currentIndex === -1) return;
    setDirection(1);
    setNavigating(true);
    router.push(`/tutors/${nextSlug}`);
  };

  const handlePrevTutor = async () => {
    if (!allSlugs.length || currentIndex === -1) return;
    setDirection(-1);
    setNavigating(true);
    router.push(`/tutors/${prevSlug}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold mb-2 text-red-500">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/instructors')}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            Browse All Instructors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div {...handlers} className={`min-h-screen relative transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${
          darkMode 
            ? 'from-gray-900 via-gray-800 to-indigo-900' 
            : 'from-blue-50 via-indigo-50 to-purple-50'
        }`} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Instructor Profile
              </h1>
            </motion.div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode((prev) => !prev)}
                className={`px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white'
                }`}
                data-tooltip-id="theme-tip"
                data-tooltip-content={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/instructors')}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full shadow-lg bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-medium transition-all duration-300"
                data-tooltip-id="find-tip"
                data-tooltip-content="Browse all instructors"
              >
                <FaSearch className="text-sm" />
                <span className="hidden sm:inline">Find Instructors</span>
              </motion.button>

              {/* ✅ Dashboard Link (added) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/tutor')}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all duration-300"
                data-tooltip-id="dashboard-tip"
                data-tooltip-content="Go to your dashboard"
              >
                <FaGraduationCap className="text-sm" />
                <span className="hidden sm:inline">Dashboard</span>
              </motion.button>
            </div>
          </div>
        </div>
        <Tooltip id="find-tip" />
        <Tooltip id="theme-tip" place="left" />
        {/* ✅ Tooltip for dashboard */}
        <Tooltip id="dashboard-tip" place="left" />
      </header>

      {/* Navigation Loading Overlay */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9000]"
          >
            <div className="text-white text-xl font-semibold animate-pulse">Loading tutor…</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Profile Info (3/5 width) */}
          <div className="xl:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={instructor?.slug || 'loading-left'}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {instructor && (
                  <InstructorProfileLeft
                    instructor={instructor}
                    avatarUrl={avatarUrl}
                    likes={likes}
                    userLiked={userLiked}
                    handleLike={handleLike}
                    darkMode={darkMode}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Booking & Actions (2/5 width) */}
          <div className="xl:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={instructor?.slug || 'loading-right'}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {instructor && (
                  <div className="space-y-6 sticky top-6">
                    {/* Booking Calendar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`rounded-2xl shadow-xl p-6 ${
                        darkMode 
                          ? 'bg-white/5 backdrop-blur-sm border border-white/10' 
                          : 'bg-white/80 backdrop-blur-sm border border-gray-200'
                      }`}
                    >
                      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <FaClock className="text-teal-500" />
                        Booking & Schedule
                      </h3>
                      <InteractiveBookingCalendar instructor={instructor} darkMode={darkMode} />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <PaymentsZoomButtons 
                        instructor={instructor} 
                        btnClass={`shadow-lg font-bold transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white border border-purple-500/50' 
                            : 'bg-gradient-to-r from-purple-800 to-pink-900 hover:from-purple-900 hover:to-pink-950 text-black border border-purple-700'
                        }`}
                        avatarUrl={avatarUrl} 
                      />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Elegant Navigation Buttons */}
      <motion.div
        className="fixed top-1/2 -translate-y-1/2 left-4 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onHoverStart={handlePrevTutor}
          whileHover={{ scale: 1.1, rotate: -180 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-full shadow-2xl backdrop-blur-xl transition-all duration-700 flex items-center justify-center group relative overflow-hidden ${
            darkMode
              ? 'bg-gradient-to-r from-teal-500/20 to-blue-600/20 hover:from-teal-400/30 hover:to-blue-500/30 text-white border border-white/30'
              : 'bg-gradient-to-r from-teal-100 to-blue-200 hover:from-teal-200 hover:to-blue-300 text-gray-800 border border-gray-300'
          }`}
          data-tooltip-id="prev-tip"
          data-tooltip-content="Previous tutor"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <FaCircle className="text-sm absolute" />
          <FaDotCircle className="text-lg group-hover:animate-pulse" />
        </motion.button>
      </motion.div>

      <motion.div
        className="fixed top-1/2 -translate-y-1/2 right-4 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onHoverStart={handleNextTutor}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-full shadow-2xl backdrop-blur-xl transition-all duration-700 flex items-center justify-center group relative overflow-hidden ${
            darkMode
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-400/30 text-white border border-white/30'
              : 'bg-gradient-to-r from-blue-200 to-purple-300 hover:from-blue-300 hover:to-purple-400 text-gray-800 border border-gray-300'
          }`}
          data-tooltip-id="next-tip"
          data-tooltip-content="Next tutor"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <FaCircle className="text-sm absolute" />
          <FaDotCircle className="text-lg group-hover:animate-pulse" />
        </motion.button>
      </motion.div>

      <Tooltip id="prev-tip" place="right" />
      <Tooltip id="next-tip" place="left" />
    </div>
  );
}

// ----------------------------------
// Enhanced Left Profile Component
// ----------------------------------
function InstructorProfileLeft({
  instructor,
  avatarUrl,
  likes,
  userLiked,
  handleLike,
  darkMode,
}: {
  instructor: Instructor;
  avatarUrl: string;
  likes: number;
  userLiked: boolean;
  handleLike: () => void;
  darkMode: boolean;
}) {
  const cardClass = `rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
    darkMode 
      ? 'bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:shadow-2xl hover:shadow-teal-500/10' 
      : 'bg-gradient-to-br from-white/90 via-white to-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/20'
  }`;
  
  const titleClass = `text-xl font-bold mb-4 flex items-center gap-3 transition-all duration-300 group-hover:scale-105 ${darkMode ? 'text-white' : 'text-gray-900'}`;
  const textClass = `${darkMode ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`;
  const iconClass = 'text-teal-500 text-lg';

  return (
    <div>
      {/* Hero Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${cardClass} group relative overflow-hidden`}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl ring-4 ring-gradient-to-r from-teal-400 via-blue-500 to-purple-600 group-hover:ring-8 transition-all duration-300">
              <img 
                src={avatarUrl || '/default-avatar.png'} 
                alt={instructor.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
            </div>
            {/* Online status indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full animate-pulse"></div>
          </div>

          {/* Name and Basic Info */}
          <div className="space-y-3">
            <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {instructor.name}
            </h2>
            
            {instructor.expertise && (
              <p className="text-lg text-teal-500 font-medium">{instructor.expertise}</p>
            )}

            {instructor.price && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                darkMode 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-green-100 text-green-700'
              }`}>
                <FaDollarSign />
                {instructor.price}/hour
              </div>
            )}

            {/* Simple Like Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  userLiked 
                    ? (darkMode ? 'bg-red-500/20 border border-red-500/50' : 'bg-red-100 border border-red-300')
                    : (darkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-100 border border-gray-300')
                }`}
              >
                <FaHeart 
                  className={`text-xl ${userLiked ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors`} 
                />
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {likes} {likes === 1 ? 'Like' : 'Likes'}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="flex flex-wrap justify-center gap-3 text-sm w-full">
            {instructor.email && (
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${instructor.email}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  darkMode
                    ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border border-teal-500/30'
                    : 'bg-teal-100 text-teal-700 hover:bg-teal-200 border border-teal-300'
                }`}
              >
                <FaEnvelope />
                Email
              </motion.a>
            )}
            {instructor.phone_number && (
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${instructor.phone_number}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  darkMode
                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                }`}
              >
                <FaPhone />
                Call
              </motion.a>
            )}
            {instructor.video_intro_url && (
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={instructor.video_intro_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  darkMode
                    ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                }`}
              >
                <FaPlay />
                Intro Video
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      {instructor.description && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${cardClass} group relative overflow-hidden`}
        >
          {/* Floating particles effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute top-4 left-4 w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="absolute bottom-6 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          
          <div className="relative z-10">
            <h3 className={titleClass}>
              <FaInfoCircle className={`${iconClass} group-hover:rotate-12 transition-transform duration-300`} />
              About Me
            </h3>
            <p className={`${textClass} group-hover:text-opacity-90 transition-all duration-300`}>{instructor.description}</p>
          </div>
        </motion.div>
      )}

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`${cardClass} group relative overflow-hidden`}
      >
        {/* Wave animation background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        
        <div className="relative z-10">
          <h3 className={titleClass}>
            <FaGlobe className={`${iconClass} group-hover:rotate-180 transition-transform duration-500`} />
            Personal Info
          </h3>
          <div className="space-y-3">
            {instructor.country && (
              <motion.div 
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <FaMapMarkerAlt className={`${iconClass} animate-pulse`} />
                <span className={textClass}>{instructor.country}</span>
              </motion.div>
            )}
            {instructor.language && (
              <motion.div 
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <FaLanguage className={`${iconClass} group-hover:animate-pulse`} />
                <div className="flex items-center gap-2">
                  <span className={textClass}>{instructor.language}</span>
                  {instructor.is_native && (
                    <span className={`px-2 py-1 text-xs rounded-full animate-bounce ${
                      darkMode 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      Native
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Experience & Qualifications */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={`${cardClass} group relative overflow-hidden`}
      >
        {/* Gradient orb effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <h3 className={titleClass}>
            <FaGraduationCap className={`${iconClass} group-hover:animate-bounce`} />
            Experience & Qualifications
          </h3>
          <div className="space-y-4">
            {instructor.qualifications && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg transition-all duration-300 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                  <FaGraduationCap className="animate-pulse" />
                  Qualifications
                </h4>
                <p className={textClass}>{instructor.qualifications}</p>
              </motion.div>
            )}
            
            {instructor.years_experience !== undefined && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg transition-all duration-300 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <h4 className={`font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  <FaBriefcase className="group-hover:rotate-12 transition-transform duration-300" />
                  Experience
                </h4>
                <p className={textClass}>{instructor.years_experience}+ years of teaching experience</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      {instructor.social_links && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`${cardClass} group relative overflow-hidden`}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className={titleClass}>
              <FaGlobe className={`${iconClass} group-hover:animate-spin transition-transform duration-1000`} />
              Social Links
            </h3>
            <motion.a 
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              href={instructor.social_links} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:shadow-lg ${
                darkMode
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white'
                  : 'bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white'
              }`}
            >
              <FaGlobe className="animate-pulse" />
              View Social Profile
            </motion.a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
