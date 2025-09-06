'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, Session, User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import AuthModal from '@/components/AuthModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Instructor {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  expertise?: string;
  years_experience?: number;
  language?: string;
  is_native?: boolean;
  price?: number;
  country?: string;
  qualifications?: string;
  demo_video_url?: string;
  zoom_link?: string;
}

interface InfoSlide {
  title: string;
  description: string;
  icon: any;
  bgGradient: string;
}

interface StepSlide {
  step: number;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
  bgGradient?: string;
}

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
}

export default function Home() {
  const [tutors, setTutors] = useState<Instructor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Instructor[]>([]);
  const [activeTab, setActiveTab] = useState<'tutors' | 'info' | 'steps'>('tutors');
  const [heroTipIndex, setHeroTipIndex] = useState(0);
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-up' | 'sign-in'>('sign-up');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [nativeFilter, setNativeFilter] = useState<'any' | 'native' | 'non-native'>('any');
  const [openDemoVideo, setOpenDemoVideo] = useState<string | null>(null);

  const [blogs] = useState<BlogPost[]>([
    { title: 'Top Tips to Learn Languages Fast', slug: 'tips-learn-fast', summary: 'Discover strategies that make language learning efficient and fun. Focus on listening, speaking, and active practice. Use repetition and context to remember vocabulary quickly. Keep lessons consistent and track your progress to stay motivated.' },
    { title: 'How to Practice Speaking Every Day', slug: 'practice-speaking', summary: 'Speaking regularly is crucial. Practice with a tutor, record yourself, or join language groups. Repeat phrases, use shadowing techniques, and get feedback. Small daily steps lead to big improvement.' },
    { title: 'Choosing the Right Tutor', slug: 'choose-tutor', summary: 'Select a tutor who matches your learning goals, schedule, and language level. Check reviews, expertise, and teaching style. A compatible tutor ensures lessons are productive and enjoyable.' },
  ]);

  const infoSlides: InfoSlide[] = [
    { title: 'Who We Are', description: 'Connecting learners with certified instructors worldwide.', icon: UserGroupIcon, bgGradient: 'from-teal-400 to-teal-600' },
    { title: 'What We Offer', description: 'Personalized lessons, flexible scheduling, expert guidance.', icon: LightBulbIcon, bgGradient: 'from-purple-400 to-pink-500' },
  ];

  const stepsSlides: StepSlide[] = [
    { step: 1, title: 'Browse Tutors', description: 'Explore instructor profiles, read reviews, and choose your ideal tutor based on expertise, availability, and student feedback.' },
    { step: 2, title: 'Schedule Lessons', description: 'Pick convenient times, book your sessions easily, and receive instant confirmation from tutors.' },
    { step: 3, title: 'Learn & Practice', description: 'Engage in interactive lessons with real-time feedback, practice exercises, and personalized guidance to achieve your goals.' },
    { step: 4, title: 'Track Progress', description: 'Monitor your improvement with detailed reports, session summaries, and actionable feedback from tutors.' },
  ];

  const heroTips: string[] = [
    'Learn at your own pace with personalized lessons.',
    'Track your progress with actionable feedback.',
    'Choose from native-speaking instructors.',
    'Flexible scheduling to fit your lifestyle.',
  ];

  const faqItems: FAQItem[] = [
    { question: 'What is the pricing for lessons?', answer: 'Pricing varies by instructor. Most lessons start at $15/hr. You can see each tutor\'s rates on their profile.', bgGradient: 'from-orange-400 to-orange-500' },
    { question: 'Which devices and internet speed are required?', answer: 'Desktop, tablet, or mobile. Webcam and mic required. Stable 5Mbps+ internet recommended.', bgGradient: 'from-orange-400 to-orange-500' },
    { question: 'How do I find a tutor?', answer: 'Use the "Find Instructors" button to browse tutors by language, expertise, and reviews.', bgGradient: 'from-orange-400 to-orange-500' },
    { question: 'How do I book a lesson?', answer: 'Select a tutor, choose a convenient slot, and confirm your booking.', bgGradient: 'from-orange-400 to-orange-500' },
    { question: 'Can I book weekly lessons in advance?', answer: 'Yes! You can select multiple time slots for recurring weekly lessons.', bgGradient: 'from-orange-400 to-orange-500' },
  ];

  useEffect(() => {
    const fetchTutors = async () => {
      const { data } = await supabase.from('Instructor').select('*').limit(10);
      if (data) {
        const tutorsWithImages = data.map((t: Instructor) => ({
          ...t,
          image_url: t.image_url ? `${supabaseUrl}/storage/v1/object/public/instructor-images/${t.image_url}` : '/default-avatar.png',
          demo_video_url: t.demo_video_url || '/default-demo.mp4',
          zoom_link: t.zoom_link || 'https://zoom.us/',
        }));
        setTutors(tutorsWithImages);
        setFilteredTutors(tutorsWithImages);
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    let temp = [...tutors];
    if (searchQuery) {
      temp = temp.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.language?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.expertise?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (priceFilter) temp = temp.filter(t => t.price && t.price <= priceFilter);
    if (nativeFilter !== 'any') temp = temp.filter(t => nativeFilter === 'native' ? t.is_native : !t.is_native);
    setFilteredTutors(temp);
  }, [searchQuery, priceFilter, nativeFilter, tutors]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTipIndex(prev => (prev + 1) % heroTips.length);
      setInfoIndex(prev => (prev + 1) % infoSlides.length);
      setStepIndex(prev => (prev + 1) % stepsSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroTips.length, infoSlides.length, stepsSlides.length]);

  const slideVariants = {
    enter: { x: 400, opacity: 0, scale: 0.9 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -400, opacity: 0, scale: 0.85 },
  };

  const draggableSlide = (children: React.ReactNode, index: number) => (
    <motion.div
      key={index}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="w-full flex flex-col md:flex-row items-center justify-center relative"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Hero */}
      <section className="py-20 md:py-32 text-center px-4 sm:px-6 md:px-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-teal-600 mb-6">Master New Languages</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
        </p>
        <div className="max-w-3xl mx-auto mb-8 relative h-14">
          <AnimatePresence mode="wait">
            <motion.p key={heroTipIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} className="text-teal-600 font-semibold text-lg sm:text-xl">{heroTips[heroTipIndex]}</motion.p>
          </AnimatePresence>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/instructors" className="inline-block bg-teal-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-teal-700 transition">Find Instructors</Link>
          {!user && (
            <>
              <button onClick={() => { setIsAuthModalOpen(true); setAuthMode('sign-up'); }} className="inline-block bg-white text-teal-600 border border-teal-600 py-3 px-8 rounded-full font-semibold hover:bg-teal-50 transition">Sign Up</button>
              <button onClick={() => { setIsAuthModalOpen(true); setAuthMode('sign-in'); }} className="inline-block bg-teal-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-teal-700 transition">Sign In</button>
            </>
          )}
          {user && (
            <>
              <span className="inline-block py-3 px-8 rounded-full font-semibold text-teal-800 bg-white shadow">Hi, {user.email}</span>
              <button onClick={handleSignOut} className="inline-block bg-red-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600 transition">Sign Out</button>
            </>
          )}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10">
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <button onClick={() => setActiveTab('tutors')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'tutors' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tutors</button>
          <button onClick={() => setActiveTab('info')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'info' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>About Us</button>
          <button onClick={() => setActiveTab('steps')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'steps' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>How It Works</button>
        </div>

        {/* Tutors Tab */}
        {activeTab === 'tutors' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <input
                type="text"
                placeholder="Search by name, language, or expertise..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full md:w-1/3 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-400 shadow-sm"
              />

              <input
                type="number"
                placeholder="Max price ($)"
                value={priceFilter ?? ''}
                onChange={e => setPriceFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full md:w-1/6 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-400 shadow-sm"
              />

              <select
                value={nativeFilter}
                onChange={e => setNativeFilter(e.target.value as 'any' | 'native' | 'non-native')}
                className="w-full md:w-1/6 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 bg-white hover:ring-teal-500 transition shadow-sm"
              >
                <option value="any">Any</option>
                <option value="native">Native</option>
                <option value="non-native">Non-Native</option>
              </select>
            </div>

            {/* Enhanced Tutor Grid */}
            <div className="grid grid-cols-1 gap-8">
              {filteredTutors.map(tutor => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  setOpenDemoVideo={setOpenDemoVideo}
                />
              ))}
            </div>
          </>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {draggableSlide(<InfoSlideComponent slide={infoSlides[infoIndex]} />, infoIndex)}
            </AnimatePresence>
            <div className="flex justify-center gap-3 mt-4">
              {infoSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setInfoIndex(idx)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${infoIndex === idx ? 'bg-teal-600' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Steps Tab */}
        {activeTab === 'steps' && (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {draggableSlide(<StepSlideComponent slide={stepsSlides[stepIndex]} />, stepIndex)}
            </AnimatePresence>
            <div className="flex justify-center gap-3 mt-4">
              {stepsSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStepIndex(idx)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${stepIndex === idx ? 'bg-teal-600' : 'bg-gray-300'}`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10" id="faq">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqItems.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              className={`p-6 rounded-xl shadow-lg cursor-pointer bg-gradient-to-r ${item.bgGradient} text-white`}
              onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}
            >
              <motion.h3 layout className="font-semibold text-lg">{item.question}</motion.h3>
              <AnimatePresence>
                {openFAQIndex === idx && (
                  <motion.p
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-white/90"
                  >
                    {item.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10" id="blog">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Latest from Our Blog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-8 text-gray-800 hover:shadow-2xl hover:scale-105 transition transform"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h3>
              <p className="text-gray-600">{post.summary}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {openDemoVideo && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenDemoVideo(null)}
          >
            <motion.div
              className="bg-white rounded-3xl overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <video src={openDemoVideo} controls autoPlay className="w-full h-auto rounded-3xl object-cover" />
              <button
                onClick={() => setOpenDemoVideo(null)}
                className="absolute top-4 right-4 text-white bg-red-500 px-3 py-1 rounded-full hover:bg-red-600 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          setIsOpen={setIsAuthModalOpen}
          mode={authMode}
        />
      )}
    </div>
  );
}

// --- Enhanced TutorCard Component with Improved Demo Video Layout ---
function TutorCard({ tutor, setOpenDemoVideo }: { tutor: Instructor; setOpenDemoVideo: (url: string) => void }) {
  const zoomLink = tutor.zoom_link?.startsWith('zoommtg://')
    ? tutor.zoom_link
    : `zoommtg://zoom.us/join?confno=${tutor.zoom_link?.split('/').pop() || ''}`;

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -8,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-teal-200 transition-all duration-300"
    >
      <div className="flex flex-col">
        {/* Header Section with Profile and Basic Info */}
        <div className="flex flex-col md:flex-row px-6 pt-6 pb-4 bg-gradient-to-r from-teal-50 to-blue-50">
          {/* Profile Image */}
          <div className="relative flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur-sm opacity-75"></div>
            <img
              src={tutor.image_url}
              alt={tutor.name}
              className="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
            {/* Online Status Indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 rounded-full ring-2 ring-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
            
            {/* Native Speaker Badge */}
            {tutor.is_native && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                Native Speaker
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
              <div className="mb-2 sm:mb-0">
                <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
                <p className="text-teal-600 font-medium text-sm">{tutor.expertise || 'Language Tutor'}</p>
              </div>

              {/* Price Tag */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1.5 rounded-full shadow-lg self-start">
                <span className="text-lg font-bold">${tutor.price ?? 0}</span>
                <span className="text-xs opacity-90">/hr</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">4.9</span>
                <span className="text-gray-400">(127 reviews)</span>
              </div>

              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{tutor.years_experience ?? 0} years exp</span>
              </div>
            </div>

            {/* Language & Location */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{tutor.language}</span>
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{tutor.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Video Section - Now integrated better with the content */}
        {tutor.demo_video_url && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Introduction Video</h4>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                DEMO
              </span>
            </div>
            <div className="relative group w-full rounded-xl overflow-hidden shadow-md cursor-pointer">
              <video
                src={tutor.demo_video_url}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                poster="/video-thumbnail.jpg"
                onClick={() => setOpenDemoVideo(tutor.demo_video_url!)}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transform hover:scale-110 transition-all duration-200"
                  aria-label="Play Demo Video"
                >
                  <svg className="w-6 h-6 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l7-5-7-5z" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                1:24
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to watch my introduction and teaching style</p>
          </div>
        )}

        {/* Qualifications & Specialties */}
        <div className="px-6 py-4">
          {tutor.qualifications && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Qualifications</h4>
              <p className="text-sm text-gray-600">{tutor.qualifications}</p>
            </div>
          )}

          {/* Specialties */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">Conversation</span>
              <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">Grammar</span>
              <span className="bg-pink-100 text-pink-700 text-xs font-medium px-2 py-1 rounded-full">Business</span>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">IELTS Prep</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/tutors/${tutor.slug}`}
              className="col-span-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book a Lesson
            </Link>

            <Link
              href={`/tutors/${tutor.slug}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium text-center transition-all duration-200 text-sm"
            >
              View Profile
            </Link>

            <a
              href={zoomLink}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2.5 px-4 rounded-xl font-medium text-center transition-all duration-200 text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 000 2h8a1 1 0 100-2H5z" />
              </svg>
              Join Call
            </a>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Save
            </button>

            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>

            <button className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Rate
            </button>
          </div>
        </div>
      </div>

      {/* Availability Indicator */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
    </motion.div>
  );
}

// --- InfoSlideComponent ---
function InfoSlideComponent({ slide }: { slide: InfoSlide }) {
  const Icon = slide.icon;
  return (
    <div className={`flex flex-col md:flex-row items-center justify-center gap-6 p-6 rounded-3xl shadow-lg bg-gradient-to-r ${slide.bgGradient} text-white`}>
      <Icon className="w-16 h-16 md:w-20 md:h-20" />
      <div className="text-center md:text-left max-w-xl">
        <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
        <p className="text-white/90">{slide.description}</p>
      </div>
    </div>
  );
}

// --- StepSlideComponent ---
function StepSlideComponent({ slide }: { slide: StepSlide }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 rounded-3xl shadow-lg bg-white">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-600 text-white text-xl font-bold">{slide.step}</div>
      <div className="text-center md:text-left max-w-xl">
        <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
        <p className="text-gray-700">{slide.description}</p>
      </div>
    </div>
  );
}