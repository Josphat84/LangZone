// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, Session, User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon, LightBulbIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
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
  zoom_link?: string;
  demo_video?: string;
}

interface InfoSlide { title: string; description: string; icon: any; bgGradient: string }
interface StepSlide { step: number; title: string; description: string }
interface FAQItem { question: string; answer: string; bgGradient?: string }
interface BlogPost { title: string; slug: string; summary: string }

export default function Home() {
  const [tutors, setTutors] = useState<Instructor[]>([]);
  const [activeTab, setActiveTab] = useState<'tutors' | 'info' | 'steps'>('tutors');
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [heroTipIndex, setHeroTipIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-up' | 'sign-in'>('sign-up');
  const [demoVideoTutor, setDemoVideoTutor] = useState<Instructor | null>(null);

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
    { question: 'What is the pricing for lessons?', answer: 'Pricing varies by instructor. Most lessons start at $15/hr. You can see each tutor’s rates on their profile.', bgGradient: 'from-teal-400 to-teal-600' },
    { question: 'Which devices and internet speed are required?', answer: 'Desktop, tablet, or mobile. Webcam and mic required. Stable 5Mbps+ internet recommended.', bgGradient: 'from-teal-400 to-teal-600' },
    { question: 'How do I find a tutor?', answer: 'Use the "Find Instructors" button to browse tutors by language, expertise, and reviews.', bgGradient: 'from-teal-400 to-teal-600' },
    { question: 'How do I book a lesson?', answer: 'Select a tutor, choose a convenient slot, and confirm your booking.', bgGradient: 'from-teal-400 to-teal-600' },
    { question: 'Can I book weekly lessons in advance?', answer: 'Yes! You can select multiple time slots for recurring weekly lessons.', bgGradient: 'from-teal-400 to-teal-600' },
  ];

  // --- Fetch Tutors ---
  useEffect(() => {
    const fetchTutors = async () => {
      const { data } = await supabase.from('Instructor').select('*').limit(10);
      if (data) {
        const tutorsWithDefaults = data.map((t: Instructor) => ({
          ...t,
          image_url: t.image_url ? supabase.storage.from('instructor-images').getPublicUrl(t.image_url).data.publicUrl : '/default-avatar.png',
          zoom_link: t.zoom_link || 'zoommtg://zoom.us/j/1234567890?pwd=demo123', 
          demo_video: t.demo_video || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }));
        setTutors(tutorsWithDefaults);
      }
    };
    fetchTutors();
  }, []);

  // --- Auto-slide ---
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
    <motion.div key={index} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 1.2, ease: 'easeInOut' }} className="w-full flex flex-col md:flex-row items-center justify-center relative">{children}</motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Hero */}
      <section className="py-20 md:py-32 text-center px-4 sm:px-6 md:px-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-teal-600 mb-6">Master New Languages</h1>
        <div className="max-w-3xl mx-auto mb-8 relative h-14">
          <AnimatePresence mode="wait">
            <motion.p key={heroTipIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} className="text-teal-600 font-semibold text-lg sm:text-xl">{heroTips[heroTipIndex]}</motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="flex justify-center gap-4 md:gap-8 mb-10 flex-wrap">
          <button onMouseEnter={() => setActiveTab('tutors')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'tutors' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Featured Tutors</button>
          <button onMouseEnter={() => setActiveTab('info')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'info' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>About Us</button>
          <button onMouseEnter={() => setActiveTab('steps')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'steps' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>How It Works</button>
        </div>

        <div className="relative">
          {activeTab === 'tutors' && tutors.length > 0 && (
            <div className="flex flex-col gap-6">
              {tutors.map((tutor, idx) => (
                <TutorCardWithZoomDemo key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="max-w-4xl mx-auto">
              <AnimatePresence>{draggableSlide(<InfoSlideComponent slide={infoSlides[infoIndex]} />, infoIndex)}</AnimatePresence>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="max-w-4xl mx-auto">
              <AnimatePresence>{draggableSlide(<StepSlideComponent slide={stepsSlides[stepIndex]} />, stepIndex)}</AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {faqItems.map((item, idx) => (
              <motion.div key={idx} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-6 rounded-xl shadow-lg cursor-pointer bg-gradient-to-r ${item.bgGradient} text-white`} onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}>
                <h3 className="font-semibold text-lg">{item.question}</h3>
                {openFAQIndex === idx && <p className="mt-3 text-white/90">{item.answer}</p>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Blog */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Latest from Our Blog</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {blogs.map((post, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-3xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
                <p>{post.summary}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {isAuthModalOpen && <AuthModal mode={authMode} onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

// ---------------- Components ----------------

interface TutorCardWithZoomDemoProps { tutor: Instructor }
function TutorCardWithZoomDemo({ tutor }: TutorCardWithZoomDemoProps) {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
      <Link href={`/tutors/${tutor.slug}`}>
        <img src={tutor.image_url || '/default-avatar.png'} alt={tutor.name} className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6 cursor-pointer" />
      </Link>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{tutor.name}</h3>
          <p className="text-gray-500">{tutor.expertise} • {tutor.years_experience} yrs experience</p>
          <p className="text-gray-500">{tutor.language} {tutor.is_native ? '(Native)' : ''} • {tutor.country}</p>
          <p className="text-teal-600 font-semibold mt-2">${tutor.price}/hr</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/tutors/${tutor.slug}`} className="inline-block bg-teal-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-teal-700 transition text-center">View Profile</Link>
          <a href={tutor.zoom_link} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-700 transition text-center">Join Zoom</a>
          <button onClick={() => setDemoModalOpen(true)} className="inline-flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-purple-700 transition text-center">
            <VideoCameraIcon className="w-5 h-5" /> Demo Video
          </button>
        </div>

        {demoModalOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-4 relative">
              <button onClick={() => setDemoModalOpen(false)} className="absolute top-2 right-2 text-gray-700 font-bold text-xl">&times;</button>
              <h3 className="text-2xl font-bold mb-4">{tutor.name} - Demo Video</h3>
              <div className="aspect-video">
                <iframe src={tutor.demo_video} title="Demo Video" className="w-full h-full rounded-lg" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface InfoSlideComponentProps { slide: InfoSlide }
function InfoSlideComponent({ slide }: InfoSlideComponentProps) {
  const Icon = slide.icon;
  return (
    <div className={`bg-gradient-to-r ${slide.bgGradient} rounded-3xl p-8 text-white text-center`}>
      <Icon className="mx-auto w-16 h-16 mb-4" />
      <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
      <p>{slide.description}</p>
    </div>
  );
}

interface StepSlideComponentProps { slide: StepSlide }
function StepSlideComponent({ slide }: StepSlideComponentProps) {
  return (
    <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-3xl p-8 text-white text-center">
      <h3 className="text-2xl font-bold mb-2">Step {slide.step}: {slide.title}</h3>
      <p>{slide.description}</p>
    </div>
  );
}
