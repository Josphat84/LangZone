// app/tutors/[slug]/page.tsx

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
  const [darkMode, setDarkMode] = useState(false); // default to light to match homepage vibe
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

  // --- THEME aligned with homepage ---
  const bgClass = darkMode
    ? 'from-gray-900 via-gray-950 to-black'
    : 'from-gray-50 to-gray-100';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const subtextClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  const cardBase =
    'rounded-3xl shadow-xl transition-transform duration-300 relative overflow-hidden';
  const cardClass = darkMode
    ? `${cardBase} bg-white/10 backdrop-blur-md border border-white/10`
    : `${cardBase} bg-white/80 backdrop-blur-md border border-black/5`;

  const btnPrimary = darkMode
    ? 'bg-teal-600 hover:bg-teal-500 text-white'
    : 'bg-teal-600 hover:bg-teal-700 text-white';

  const btnPurple = darkMode
    ? 'bg-purple-600 hover:bg-purple-500 text-white'
    : 'bg-purple-500 hover:bg-purple-400 text-white';

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.96 }),
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className={`${cardClass} p-6 text-center`}>
        <div className="w-32 h-32 mx-auto rounded-full bg-gray-300/30" />
        <div className="h-6 w-40 bg-gray-300/30 rounded mx-auto mt-4" />
        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <div className="h-5 w-16 bg-gray-300/30 rounded" />
          <div className="h-5 w-24 bg-gray-300/30 rounded" />
        </div>
      </div>
      <div className={`${cardClass} p-6`}>
        <div className="h-5 w-28 bg-gray-300/30 rounded mb-3" />
        <div className="h-4 w-full bg-gray-300/30 rounded" />
        <div className="h-4 w-5/6 bg-gray-300/30 rounded mt-2" />
      </div>
    </div>
  );

  if (error) return <div className="text-center mt-20 text-lg text-red-500">{error}</div>;

  return (
    <div
      {...handlers}
      className={`min-h-screen relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background gradient like homepage */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgClass}`} />

      {/* Soft animated blobs (homepage vibe) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-3xl"
        style={{ background: 'linear-gradient(135deg, rgba(45,212,191,0.35), rgba(59,130,246,0.25))' }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.85, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 w-[34rem] h-[34rem] rounded-full blur-3xl"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.28), rgba(236,72,153,0.22))' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top bar / Hero header (matches homepage typography + CTA) */}
      <section className="relative z-10 px-4 sm:px-6 md:px-10 pt-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500`}
            >
              Instructor Profile
            </motion.h1>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`px-3 py-2 rounded-full shadow-md border ${
                  darkMode ? 'bg-gray-900 text-white border-white/10' : 'bg-white text-gray-700 border-black/10'
                } hover:scale-105 transition-transform flex items-center gap-2`}
                data-tooltip-id="theme-tip"
                data-tooltip-content={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>

              <button
                onClick={() => router.push('/instructors')}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full shadow-lg ${btnPrimary} hover:shadow-xl transition`}
                data-tooltip-id="find-tip"
                data-tooltip-content="Browse all instructors"
              >
                <FaSearch />
                Find Instructors
              </button>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`max-w-3xl ${subtextClass}`}
          >
            Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
          </motion.p>
        </div>
        <Tooltip id="find-tip" />
        <Tooltip id="theme-tip" place="left" />
      </section>

      {navigating && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9000]">
          <div className="text-white text-xl font-semibold animate-pulse">Loading tutor…</div>
        </div>
      )}

      {/* Main grid (keeps your original two-column structure) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-24 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {loading || !instructor ? (
                  <LoadingSkeleton />
                ) : (
                  <InstructorLeftCard
                    cardClass={cardClass}
                    textClass={textClass}
                    subtextClass={subtextClass}
                  />
                )}
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
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {loading || !instructor ? (
                  <LoadingSkeleton />
                ) : (
                  <InstructorRightCard
                    cardClass={cardClass}
                    btnPurple={btnPurple}
                    showCalendar={showCalendar}
                    setShowCalendar={setShowCalendar}
                    openZoomApp={openZoomApp}
                    avatarUrl={avatarUrl}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Glassmorphism side arrows (homepage feel; also work with swipe) */}
      <motion.div className="fixed top-1/2 -translate-y-1/2 left-3 sm:left-4 z-50">
        <motion.button
          onClick={handlePrevTutor}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.98 }}
          className="w-10 h-20 sm:w-11 sm:h-24 rounded-3xl bg-white/30 backdrop-blur-md text-gray-900 flex items-center justify-center shadow-lg border border-white/40"
          aria-label="Previous tutor"
        >
          <FaArrowLeft />
        </motion.button>
      </motion.div>
      <motion.div className="fixed top-1/2 -translate-y-1/2 right-3 sm:right-4 z-50">
        <motion.button
          onClick={handleNextTutor}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.98 }}
          className="w-10 h-20 sm:w-11 sm:h-24 rounded-3xl bg-white/30 backdrop-blur-md text-gray-900 flex items-center justify-center shadow-lg border border-white/40"
          aria-label="Next tutor"
        >
          <FaArrowRight />
        </motion.button>
      </motion.div>

      {/* helper render refs */}
      {InstructorLeftCard && InstructorRightCard && null}
    </div>
  );

  // ---- COMPONENTS (use your original content, just re-styled to match homepage) ----

  function InstructorLeftCard({
    cardClass,
    textClass,
    subtextClass,
  }: {
    cardClass: string;
    textClass: string;
    subtextClass: string;
  }) {
    return (
      <>
        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`${cardClass} p-6 text-center`}
        >
          {/* Subtle animated halo */}
          <motion.div
            aria-hidden="true"
            className="absolute -inset-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-20 blur-3xl"
            animate={{ scale: [1, 1.06, 1], opacity: [0.18, 0.25, 0.18] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <img
            src={avatarUrl || '/default-avatar.png'}
            alt={instructor?.name}
            className="relative z-10 w-32 h-32 rounded-full object-cover border-4 border-white/70 shadow-xl mx-auto mb-4"
          />
          <h2 className={`relative z-10 text-3xl font-bold ${textClass}`}>{instructor?.name}</h2>

          {/* Likes + Rating */}
          <div className="relative z-10 flex items-center justify-center gap-5 mt-3 flex-wrap">
            <motion.button
              whileTap={{ scale: 1.15 }}
              onClick={handleLike}
              className={`flex items-center gap-2 text-lg ${userLiked ? 'text-pink-500' : 'text-gray-400'} hover:text-pink-500 transition`}
              data-tooltip-id="like-tip"
              data-tooltip-content={userLiked ? 'Unlike' : 'Like'}
            >
              <FaHeart />
              <span className={`${textClass}`}>{likes}</span>
            </motion.button>
            <Tooltip id="like-tip" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.span whileHover={{ scale: 1.15 }} key={i}>
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

          {instructor?.price && (
            <p className={`relative z-10 text-lg mt-2 font-semibold text-teal-600`}>
              ${instructor.price}/hr
            </p>
          )}
        </motion.div>

        {/* About */}
        <motion.div whileHover={{ scale: 1.005 }} className={`${cardClass} p-6 space-y-3`}>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaInfoCircle className="text-teal-500" /> About
          </h3>
          <p className={subtextClass}>{instructor?.description || 'No bio available yet.'}</p>
        </motion.div>

        {/* Professional Info */}
        <motion.div whileHover={{ scale: 1.005 }} className={`${cardClass} p-6 space-y-2`}>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaBriefcase className="text-teal-500" /> Professional Info
          </h3>
          {instructor?.expertise && (
            <p className={subtextClass}>
              <FaGraduationCap className="inline mr-2 text-green-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Expertise:</span>{' '}
              {instructor.expertise}
            </p>
          )}
          {instructor?.years_experience && (
            <p className={subtextClass}>
              <FaBriefcase className="inline mr-2 text-green-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Experience:</span>{' '}
              {instructor.years_experience} yrs
            </p>
          )}
          {instructor?.qualifications && (
            <p className={subtextClass}>
              <FaGraduationCap className="inline mr-2 text-green-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Qualifications:</span>{' '}
              {instructor.qualifications}
            </p>
          )}
        </motion.div>

        {/* Languages & Location */}
        <motion.div whileHover={{ scale: 1.005 }} className={`${cardClass} p-6 space-y-2`}>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaLanguage className="text-teal-500" /> Languages & Location
          </h3>
          {instructor?.language && (
            <p className={subtextClass}>
              <FaLanguage className="inline mr-2 text-green-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Language:</span>{' '}
              {instructor.language} {instructor.is_native ? '(Native)' : ''}
            </p>
          )}
          {instructor?.country && (
            <p className={subtextClass}>
              <FaMapMarkerAlt className="inline mr-2 text-green-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Country:</span>{' '}
              {instructor.country}
            </p>
          )}
        </motion.div>
      </>
    );
  }

  function InstructorRightCard({
    cardClass,
    btnPurple,
    showCalendar,
    setShowCalendar,
    openZoomApp,
    avatarUrl,
  }: {
    cardClass: string;
    btnPurple: string;
    showCalendar: boolean;
    setShowCalendar: (v: boolean) => void;
    openZoomApp: () => void;
    avatarUrl: string;
  }) {
    return (
      <>
        {/* Video Intro */}
        {instructor?.video_intro_url && (
          <motion.div whileHover={{ scale: 1.005 }} className={`${cardClass} p-6`}>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <FaVideo className="text-teal-500" /> Video Intro
            </h3>
            <video
              src={instructor.video_intro_url}
              controls
              className="w-full rounded-2xl shadow-lg"
              poster={avatarUrl || '/default-avatar.png'}
            />
          </motion.div>
        )}

        {/* Booking */}
        <motion.div whileHover={{ scale: 1.005 }} className={`${cardClass} p-6`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaCalendarAlt className="text-teal-500" /> Booking
          </h3>
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-sm text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 transition"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
            <span className="text-gray-500 dark:text-gray-300 text-sm">
              {instructor?.price ? `$${instructor.price}/hr` : ''}
            </span>
          </div>

          {showCalendar && instructor?.id && (
            <div className="rounded-2xl border border-black/5 dark:border-white/10 p-2">
              <InteractiveBookingCalendar instructorId={instructor.id} />
            </div>
          )}
        </motion.div>

        {/* Payment */}
        <motion.div whileHover={{ scale: 1.005 }} className={`${cardClass} p-6`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaPaypal className="text-teal-500" /> Payment
          </h3>
          <p className="mb-3 text-gray-600 dark:text-gray-300">
            Secure your session via PayPal or direct payment.
          </p>
          <button className={`${btnPurple} px-4 py-2 rounded-full shadow hover:shadow-lg transform hover:scale-[1.02] transition`}>
            Pay Now
          </button>
        </motion.div>

        {/* Zoom */}
        {instructor?.zoom_meeting_id && (
          <motion.div whileHover={{ scale: 1.005 }} className={`${cardClass} p-6`}>
            <button
              onClick={openZoomApp}
              className={`${btnPurple} w-full px-4 py-3 rounded-full shadow hover:shadow-lg transform hover:scale-[1.02] transition`}
            >
              Join Zoom Session
            </button>
          </motion.div>
        )}
      </>
    );
  }
}
