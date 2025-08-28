'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useSwipeable } from 'react-swipeable';
import InteractiveBookingCalendar from './InteractiveBookingCalendar';
import {
  FaStar,
  FaVideo,
  FaHeart,
  FaPaypal,
  FaMoneyBillWave,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaLanguage,
  FaGraduationCap,
  FaBriefcase,
  FaCalendarAlt,
  FaArrowRight,
  FaArrowLeft,
  FaSearch,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showCalendar, setShowCalendar] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [allSlugs, setAllSlugs] = useState<string[]>([]);
  const [direction, setDirection] = useState<1 | -1>(1);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextTutor(),
    onSwipedRight: () => handlePrevTutor(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const CACHE_TTL = 1000 * 60 * 3; // 3 minutes
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

  const handleRating = (value: number) => setRating(value);

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

  const openZoomApp = () => {
    if (instructor?.zoom_meeting_id) {
      window.location.href = `zoommtg://zoom.us/join?confno=${instructor.zoom_meeting_id}`;
    }
  };

  const bgClass = darkMode ? 'bg-gray-950 text-gray-200' : 'bg-gray-100 text-gray-900';
  const cardClass = darkMode ? 'bg-white/10 backdrop-blur-md text-gray-200' : 'bg-white/50 backdrop-blur-md text-gray-900';
  const btnPurple = darkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-500 hover:bg-purple-400';

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className={`${cardClass} p-6 rounded-xl shadow-lg text-center`}>
        <div className="w-32 h-32 mx-auto rounded-full bg-gray-700/50" />
        <div className="h-6 w-40 bg-gray-700/50 rounded mx-auto mt-4" />
        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <div className="h-5 w-16 bg-gray-700/50 rounded" />
          <div className="h-5 w-24 bg-gray-700/50 rounded" />
        </div>
      </div>
      <div className={`${cardClass} p-6 rounded-xl shadow-md`}>
        <div className="h-5 w-28 bg-gray-700/50 rounded mb-3" />
        <div className="h-4 w-full bg-gray-700/40 rounded" />
        <div className="h-4 w-5/6 bg-gray-700/40 rounded mt-2" />
      </div>
    </div>
  );

  if (error) return <div className="text-center mt-20 text-lg text-red-500">{error}</div>;

  return (
    <div {...handlers} className={`${bgClass} min-h-screen px-4 py-8 transition-colors duration-500 relative`}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Instructor Profile</h1>
        <button
          onClick={() => router.push('/instructors')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-500 transition transform hover:scale-105"
          data-tooltip-id="find-tip"
          data-tooltip-content="Browse all instructors"
        >
          <FaSearch /> Find Instructors
        </button>
        <Tooltip id="find-tip" />
      </div>

      {/* Dark/Light Toggle */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="px-4 py-3 rounded-full shadow-2xl bg-gray-900 text-white hover:bg-gray-800 transition flex items-center gap-2 border border-white/10 transform hover:scale-105"
          data-tooltip-id="theme-tip"
          data-tooltip-content={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <Tooltip id="theme-tip" place="left" />
      </div>

      {navigating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[9000]">
          <div className="text-white text-xl font-semibold animate-pulse">Loading tutor…</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={loading ? 'loading-left' : instructor?.slug || 'no-slug-left'}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
            >
              {loading || !instructor ? <LoadingSkeleton /> : <InstructorLeftCard />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={loading ? 'loading-right' : (instructor?.slug || 'no-slug-right') + '-right'}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
            >
              {loading || !instructor ? <LoadingSkeleton /> : <InstructorRightCard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Previous / Next Buttons */}
      <motion.div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50">
        <motion.button
          onClick={handlePrevTutor}
          whileHover={{ scale: 1.2 }}
          className="w-12 h-12 rounded-full bg-yellow-500/80 text-gray-900 flex items-center justify-center shadow-lg border border-yellow-400/50"
        >
          <FaArrowLeft />
        </motion.button>
      </motion.div>
      <motion.div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
        <motion.button
          onClick={handleNextTutor}
          whileHover={{ scale: 1.2 }}
          className="w-12 h-12 rounded-full bg-yellow-500/80 text-gray-900 flex items-center justify-center shadow-lg border border-yellow-400/50"
        >
          <FaArrowRight />
        </motion.button>
      </motion.div>

      {/* Helper components */}
      {InstructorLeftCard && InstructorRightCard && null}
    </div>
  );

  function InstructorLeftCard() {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 20px 30px rgba(0,0,0,0.4)' }}
          className={`p-6 rounded-xl shadow-lg text-center relative overflow-hidden ${cardClass}`}
        >
          {/* Purple pulse blur */}
          <motion.div
            className="absolute -inset-10 rounded-full bg-purple-600 opacity-30 blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <img
            src={avatarUrl || '/default-avatar.png'}
            alt={instructor?.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white/80 shadow-xl mx-auto mb-4 relative z-10"
          />
          <h2 className="text-3xl font-bold relative z-10">{instructor?.name}</h2>
          <div className="flex items-center justify-center gap-4 mt-3 flex-wrap relative z-10">
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={handleLike}
              className={`flex items-center gap-1 text-xl ${userLiked ? 'text-red-400' : 'text-gray-400'} hover:text-red-500 transition`}
              data-tooltip-id="like-tip"
              data-tooltip-content={userLiked ? 'Unlike' : 'Like'}
            >
              <FaHeart /> {likes}
            </motion.button>
            <Tooltip id="like-tip" />
            <div className="flex items-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.span whileHover={{ scale: 1.3 }} key={i}>
                  <FaStar
                    className={`cursor-pointer ${i <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                    onClick={() => handleRating(i)}
                    data-tooltip-id={`rate-${i}`}
                    data-tooltip-content={`Rate ${i} star${i > 1 ? 's' : ''}`}
                  />
                  <Tooltip id={`rate-${i}`} />
                </motion.span>
              ))}
            </div>
          </div>
          {instructor?.price && <p className="text-lg mt-2 font-semibold relative z-10">${instructor.price}/hr</p>}
        </motion.div>

        {/* About & Info Sections */}
        <motion.div whileHover={{ scale: 1.01 }} className={`p-6 rounded-xl shadow-md space-y-3 mt-4 ${cardClass}`}>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaInfoCircle /> About
          </h3>
          <p>{instructor?.description || 'No bio available yet.'}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className={`p-6 rounded-xl shadow-md space-y-2 ${cardClass}`}>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaBriefcase /> Professional Info
          </h3>
          {instructor?.expertise && (
            <p>
              <FaGraduationCap className="inline mr-1 text-green-500" />
              <span className="font-semibold">Expertise:</span> {instructor.expertise}
            </p>
          )}
          {instructor?.years_experience && (
            <p>
              <FaBriefcase className="inline mr-1 text-green-500" />
              <span className="font-semibold">Experience:</span> {instructor.years_experience} yrs
            </p>
          )}
          {instructor?.qualifications && (
            <p>
              <FaGraduationCap className="inline mr-1 text-green-500" />
              <span className="font-semibold">Qualifications:</span> {instructor.qualifications}
            </p>
          )}
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className={`p-6 rounded-xl shadow-md space-y-2 ${cardClass}`}>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaLanguage /> Languages & Location
          </h3>
          {instructor?.language && (
            <p>
              <FaLanguage className="inline mr-1 text-green-500" />
              <span className="font-semibold">Language:</span> {instructor.language}{' '}
              {instructor.is_native ? '(Native)' : ''}
            </p>
          )}
          {instructor?.country && (
            <p>
              <FaMapMarkerAlt className="inline mr-1 text-green-500" />
              <span className="font-semibold">Country:</span> {instructor.country}
            </p>
          )}
        </motion.div>
      </>
    );
  }

  function InstructorRightCard() {
    return (
      <>
        {instructor?.video_intro_url && (
          <motion.div whileHover={{ scale: 1.01 }} className={`p-6 rounded-xl shadow-md ${cardClass}`}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <FaVideo /> Video Intro
            </h3>
            <video
              src={instructor.video_intro_url}
              controls
              className="w-full rounded-lg shadow-lg"
              poster={avatarUrl || '/default-avatar.png'}
            />
          </motion.div>
        )}

        {/* Booking Calendar */}
        <motion.div whileHover={{ scale: 1.01 }} className={`p-6 rounded-xl shadow-md ${cardClass}`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaCalendarAlt /> Booking
          </h3>
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-sm text-white/80 hover:text-white transition"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
            <span className="text-gray-400 text-sm">{instructor?.price ? `$${instructor.price}/hr` : ''}</span>
          </div>

          {showCalendar && instructor?.id && <InteractiveBookingCalendar instructorId={instructor.id} />}
        </motion.div>

        {/* Payment */}
        <motion.div whileHover={{ scale: 1.01 }} className={`p-6 rounded-xl shadow-md ${cardClass}`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaPaypal /> Payment
          </h3>
          <p className="mb-2">Secure your session via PayPal or direct payment.</p>
          <button className={`${btnPurple} px-4 py-2 rounded-lg shadow transform hover:scale-105 transition`}>
            Pay Now
          </button>
        </motion.div>

        {/* Zoom Link */}
        {instructor?.zoom_meeting_id && (
          <motion.div whileHover={{ scale: 1.01 }} className={`p-6 rounded-xl shadow-md ${cardClass}`}>
            <button
              onClick={openZoomApp}
              className={`${btnPurple} w-full px-4 py-3 rounded-lg shadow transform hover:scale-105 transition`}
            >
              Join Zoom Session
            </button>
          </motion.div>
        )}
      </>
    );
  }
}
