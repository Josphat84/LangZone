'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline';

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
  const [tutorIndex, setTutorIndex] = useState(0);
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'tutors' | 'steps'>('info');
  const [heroTipIndex, setHeroTipIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [blogIndex, setBlogIndex] = useState(0);
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
      if (data) setTutors(data);
    };
    fetchTutors();
  }, []);

  const slideVariants = {
    enter: { x: 400, opacity: 0, scale: 0.9 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -400, opacity: 0, scale: 0.85 },
  };

  useEffect(() => {
    if (!tutors.length) return;
    const interval = setInterval(() => {
      if (activeTab === 'tutors') setTutorIndex((prev) => (prev + 1) % tutors.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [tutors, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'info') setInfoIndex((prev) => (prev + 1) % infoSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [infoSlides, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'steps') setStepIndex((prev) => (prev + 1) % stepsSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [stepsSlides, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTipIndex((prev) => (prev + 1) % heroTips.length);
      setBlogIndex((prev) => (prev + 1) % blogs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const tutorAvatarUrl = (tutor: Instructor) =>
    tutor.image_url
      ? supabase.storage.from('instructor-images').getPublicUrl(tutor.image_url).data.publicUrl
      : '/default-avatar.png';

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const draggableSlide = (children: React.ReactNode, index: number, setIndex: (idx: number) => void, length: number) => (
    <motion.div
      key={index}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="w-full flex flex-col md:flex-row items-center justify-center relative"
      drag={isTouchDevice ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (!isTouchDevice) return;
        if (offset.x < -50 || velocity.x < -500) setIndex((prev) => (prev + 1) % length);
        else if (offset.x > 50 || velocity.x > 500) setIndex((prev) => (prev - 1 + length) % length);
      }}
    >
      {children}
      {/* Left Arrow */}
      <motion.div
        className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/30 backdrop-blur-md rounded-3xl shadow-lg cursor-pointer flex items-center justify-center z-20"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.5)' }}
        onMouseEnter={() => setIndex((prev) => (prev - 1 + length) % length)}
      >
        ‹
      </motion.div>
      {/* Right Arrow */}
      <motion.div
        className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/30 backdrop-blur-md rounded-3xl shadow-lg cursor-pointer flex items-center justify-center z-20"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.5)' }}
        onMouseEnter={() => setIndex((prev) => (prev + 1) % length)}
      >
        ›
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center relative z-10 px-4 sm:px-6 md:px-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-teal-600 mb-6">Master New Languages</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
        </p>
        <div className="max-w-3xl mx-auto mb-8 relative h-14">
          <AnimatePresence mode="wait">
            <motion.p key={heroTipIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} className="text-teal-600 font-semibold text-lg sm:text-xl">{heroTips[heroTipIndex]}</motion.p>
          </AnimatePresence>
        </div>
        <Link href="/instructors" className="inline-block bg-teal-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-teal-700 transition">Find Instructors</Link>
      </section>

      {/* Tabs Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10">
        <div className="flex justify-center gap-4 md:gap-8 mb-10 flex-wrap">
          <button onMouseEnter={() => setActiveTab('info')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'info' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>About Us</button>
          <button onMouseEnter={() => setActiveTab('tutors')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'tutors' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Featured Tutors</button>
          <button onMouseEnter={() => setActiveTab('steps')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'steps' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>How It Works</button>
        </div>

        <div className="relative">
          {activeTab === 'info' && <div className="relative max-w-4xl mx-auto">{draggableSlide(<InfoSlideComponent slide={infoSlides[infoIndex]} />, infoIndex, setInfoIndex, infoSlides.length)}</div>}
          {activeTab === 'tutors' && tutors.length > 0 && <div className="relative max-w-5xl mx-auto">{draggableSlide(<TutorSlideComponent tutor={tutors[tutorIndex]} />, tutorIndex, setTutorIndex, tutors.length)}</div>}
          {activeTab === 'steps' && <div className="relative max-w-5xl mx-auto">{draggableSlide(<StepSlideComponent step={stepsSlides[stepIndex]} />, stepIndex, setStepIndex, stepsSlides.length)}</div>}
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-center text-gray-900 mb-12">Latest Blog Posts</h2>
        <div className="relative max-w-4xl mx-auto">
          {draggableSlide(
            <div className="p-8 sm:p-10 rounded-3xl flex flex-col gap-6 shadow-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white transform transition-transform hover:scale-105">
              <h3 className="text-2xl md:text-3xl font-bold">{blogs[blogIndex].title}</h3>
              <p className="text-base sm:text-lg">{blogs[blogIndex].summary}</p>
            </div>,
            blogIndex,
            setBlogIndex,
            blogs.length
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {faqItems.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              className="rounded-3xl shadow-xl cursor-pointer overflow-hidden transform transition-transform duration-500 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${item.bgGradient?.replace('from-', '')?.replace('to-', '') || 'gray-200,gray-400'})` }}
              onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}
            >
              <div className="px-6 py-5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-black drop-shadow-lg">{item.question}</h3>
                <span className="text-black text-2xl">{openFAQIndex === idx ? '−' : '+'}</span>
              </div>
              <AnimatePresence>
                {openFAQIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="px-6 pb-5 text-black text-base drop-shadow-md"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Slide Components
const InfoSlideComponent = ({ slide }: { slide: InfoSlide }) => {
  const Icon = slide.icon;
  return (
    <div className={`p-6 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-lg text-white bg-gradient-to-r ${slide.bgGradient}`}>
      <div className="flex-shrink-0"><Icon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto md:mx-0" /></div>
      <div className="text-center md:text-left flex-1">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{slide.title}</h3>
        <p className="text-base sm:text-lg">{slide.description}</p>
      </div>
    </div>
  );
};

const TutorSlideComponent = ({ tutor }: { tutor: Instructor }) => {
  const tutorAvatarUrl = tutor.image_url ? supabase.storage.from('instructor-images').getPublicUrl(tutor.image_url).data.publicUrl : '/default-avatar.png';
  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-lg">
      <Link href={`/tutors/${tutor.slug}`}><img src={tutorAvatarUrl} alt={tutor.name} className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-teal-600 shadow-lg" /></Link>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900">{tutor.name}</h3>
        {tutor.expertise && <p className="text-gray-700 mt-1 sm:mt-2">{tutor.expertise}</p>}
        {tutor.qualifications && <p className="text-gray-500 text-sm mt-1">{tutor.qualifications}</p>}
        <p className="text-gray-500 mt-1 sm:mt-2">{tutor.years_experience ? `${tutor.years_experience} years experience` : 'Experience N/A'} | {tutor.language ? ` Language: ${tutor.language}` : ''} {tutor.is_native ? '(Native)' : ''}</p>
        {tutor.price && <p className="text-teal-600 font-semibold mt-1 sm:mt-2">${tutor.price}/hr</p>}
        {tutor.country && <p className="text-gray-400 text-sm mt-1">{tutor.country}</p>}
      </div>
    </div>
  );
};

const StepSlideComponent = ({ step }: { step: StepSlide }) => (
  <div className="p-6 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-black">
    <div className="flex-shrink-0 text-center md:text-left"><div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{step.step}</div></div>
    <div className="flex-1 text-center md:text-left">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{step.title}</h3>
      <p className="text-base sm:text-lg">{step.description}</p>
    </div>
  </div>
);
