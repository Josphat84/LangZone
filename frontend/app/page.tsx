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

  const [blogs, setBlogs] = useState<BlogPost[]>([
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
    { question: 'What is the pricing for lessons?', answer: 'Pricing varies by instructor. Most lessons start at $15/hr. You can see each tutor’s rates on their profile.', bgGradient: 'from-orange-400 to-orange-500' },
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
          image_url: t.image_url ? supabase.storage.from('instructor-images').getPublicUrl(t.image_url).data.publicUrl : '/default-avatar.png',
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
      temp = temp.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.language?.toLowerCase().includes(searchQuery.toLowerCase()) || t.expertise?.toLowerCase().includes(searchQuery.toLowerCase()));
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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
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
  }, []);

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
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <input 
                type="text" 
                placeholder="Search by name, language, or expertise..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full md:w-1/3 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-400" 
              />

              <input 
                type="number" 
                placeholder="Max price ($)" 
                value={priceFilter ?? ''} 
                onChange={e => setPriceFilter(e.target.value ? parseInt(e.target.value) : null)} 
                className="w-full md:w-1/6 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder-gray-400" 
              />

              <select 
                value={nativeFilter} 
                onChange={e => setNativeFilter(e.target.value as any)} 
                className="w-full md:w-1/6 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 bg-white hover:ring-teal-500 transition"
              >
                <option value="any">Any</option>
                <option value="native">Native</option>
                <option value="non-native">Non-Native</option>
              </select>
            </div>

            <div className="flex flex-col gap-6">
              {filteredTutors.map(tutor => <TutorCard key={tutor.id} tutor={tutor} setOpenDemoVideo={setOpenDemoVideo} />)}
            </div>
          </>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence>
              {draggableSlide(<InfoSlideComponent slide={infoSlides[infoIndex]} />, infoIndex)}
            </AnimatePresence>
            <div className="flex justify-center gap-3 mt-4">
              {infoSlides.map((_, idx) => (
                <span key={idx} onClick={() => setInfoIndex(idx)} className={`w-3 h-3 rounded-full cursor-pointer ${infoIndex === idx ? 'bg-teal-600' : 'bg-gray-300'}`}></span>
              ))}
            </div>
          </div>
        )}

        {/* Steps Tab */}
        {activeTab === 'steps' && (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence>
              {draggableSlide(<StepSlideComponent slide={stepsSlides[stepIndex]} />, stepIndex)}
            </AnimatePresence>
            <div className="flex justify-center gap-3 mt-4">
              {stepsSlides.map((_, idx) => (
                <span key={idx} onClick={() => setStepIndex(idx)} className={`w-3 h-3 rounded-full cursor-pointer ${stepIndex === idx ? 'bg-teal-600' : 'bg-gray-300'}`}></span>
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
            <motion.div key={idx} layout className={`p-6 rounded-xl shadow-lg cursor-pointer bg-gradient-to-r ${item.bgGradient} text-white`} onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}>
              <motion.h3 layout className="font-semibold text-lg">{item.question}</motion.h3>
              <AnimatePresence>
                {openFAQIndex === idx && (
                  <motion.p layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 text-white/90">{item.answer}</motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10" id="blog">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Latest from Our Blog</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((post, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-white rounded-3xl shadow-lg p-8 text-gray-800 hover:shadow-2xl hover:scale-105 transition transform">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h3>
              <p className="text-gray-600">{post.summary}</p>
              
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {openDemoVideo && (
          <motion.div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <video src={openDemoVideo} controls autoPlay className="w-full h-auto rounded-3xl object-cover" />
              <button onClick={() => setOpenDemoVideo(null)} className="absolute top-4 right-4 text-white bg-red-500 px-3 py-1 rounded-full hover:bg-red-600 transition">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} mode={authMode} />}
    </div>
  );
}

// --- TutorCard ---
function TutorCard({ tutor, setOpenDemoVideo }: { tutor: Instructor; setOpenDemoVideo: (url: string) => void }) {
  const zoomLink = tutor.zoom_link?.startsWith('zoommtg://') 
    ? tutor.zoom_link 
    : `zoommtg://zoom.us/join?confno=${tutor.zoom_link?.split('/').pop() || ''}`;

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -2, boxShadow: '0 15px 25px rgba(0,0,0,0.2)' }} 
      className="flex flex-col md:flex-row bg-white rounded-3xl shadow-lg p-6 gap-6 items-start transition cursor-pointer"
    >
      {/* Left column */}
      <div className="flex flex-col items-center md:items-start gap-4 flex-shrink-0 w-full md:w-1/3">
        <img 
          src={tutor.image_url} 
          alt={tutor.name} 
          className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-2 ring-teal-500 hover:ring-4 transition cursor-pointer" 
        />
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-800">{tutor.name}</h3>
          <p className="text-gray-600">{tutor.expertise || 'Language Tutor'} • {tutor.years_experience ?? 0} yrs</p>
          <p className="text-gray-500 text-sm">{tutor.language} {tutor.is_native ? '(Native)' : ''} • {tutor.country}</p>
          <p className="text-teal-600 font-semibold text-lg mt-1">${tutor.price ?? 0}/hr</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-2 mt-2 w-full">
          <Link href={`/tutors/${tutor.slug}`} className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition font-semibold text-sm text-center">View Profile</Link>
          <a href={zoomLink} target="_blank" rel="noreferrer" className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold text-sm text-center">Join Zoom</a>
          <button onClick={() => setOpenDemoVideo(tutor.demo_video_url!)} className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition font-semibold text-sm">Demo Video</button>
        </div>
      </div>

      {/* Right column */}
      {tutor.demo_video_url && (
        <div className="flex-1 w-full md:w-2/3 h-48 md:h-36 rounded-xl overflow-hidden shadow-lg">
          <video src={tutor.demo_video_url} controls className="w-full h-full object-cover rounded-xl" />
        </div>
      )}
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
