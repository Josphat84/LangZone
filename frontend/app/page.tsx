'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon, LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';

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

export default function Home() {
  const [tutors, setTutors] = useState<Instructor[]>([]);
  const [tutorIndex, setTutorIndex] = useState(0);
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'tutors' | 'steps'>('info');
  const [isTutorPaused, setIsTutorPaused] = useState(false);
  const [isInfoPaused, setIsInfoPaused] = useState(false);
  const [isStepPaused, setIsStepPaused] = useState(false);

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
      if (!isTutorPaused && activeTab === 'tutors') setTutorIndex((prev) => (prev + 1) % tutors.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [tutors, isTutorPaused, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isInfoPaused && activeTab === 'info') setInfoIndex((prev) => (prev + 1) % infoSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [infoSlides, isInfoPaused, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isStepPaused && activeTab === 'steps') setStepIndex((prev) => (prev + 1) % stepsSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [stepsSlides, isStepPaused, activeTab]);

  const tutorAvatarUrl = (tutor: Instructor) =>
    tutor.image_url
      ? supabase.storage.from('instructor-images').getPublicUrl(tutor.image_url).data.publicUrl
      : '/default-avatar.png';

  // Detect touch device for mobile swipe
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const draggableSlide = (
    children: React.ReactNode,
    index: number,
    setIndex: (idx: number) => void,
    length: number
  ) => (
    <motion.div
      key={index}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="w-full flex items-center justify-center relative"
      drag={isTouchDevice ? 'x' : false}  // mobile swipe
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (!isTouchDevice) return;
        if (offset.x < -50 || velocity.x < -500) setIndex((prev) => (prev + 1) % length);
        else if (offset.x > 50 || velocity.x > 500) setIndex((prev) => (prev - 1 + length) % length);
      }}
    >
      {children}
      {/* Arrow Left */}
      <motion.div
        className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-24 bg-white/30 backdrop-blur-md rounded-3xl shadow-lg cursor-pointer flex items-center justify-center z-20"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.5)' }}
        onClick={() => setIndex((prev) => (prev - 1 + length) % length)}
      >
        ‹
      </motion.div>
      {/* Arrow Right */}
      <motion.div
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-24 bg-white/30 backdrop-blur-md rounded-3xl shadow-lg cursor-pointer flex items-center justify-center z-20"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.5)' }}
        onClick={() => setIndex((prev) => (prev + 1) % length)}
      >
        ›
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">

      {/* Hero Section */}
      <section className="py-32 text-center relative z-10">
        <h1 className="text-6xl md:text-7xl font-bold text-teal-600 mb-6">Master New Languages</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
        </p>
        <Link href="/instructors" className="inline-block bg-teal-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-teal-700 transition">
          Find Instructors
        </Link>
      </section>

      {/* Tabs */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="flex justify-center gap-8 mb-10 flex-wrap">
          <button
            onMouseEnter={() => setActiveTab('info')}
            className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'info' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            About Us
          </button>
          <button
            onMouseEnter={() => setActiveTab('tutors')}
            className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'tutors' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Featured Tutors
          </button>
          <button
            onMouseEnter={() => setActiveTab('steps')}
            className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'steps' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            How It Works
          </button>
        </div>

        <div className="relative">
          {activeTab === 'info' && (
            <div
              className="relative max-w-4xl mx-auto"
              onMouseEnter={() => setIsInfoPaused(true)}
              onMouseLeave={() => setIsInfoPaused(false)}
            >
              <AnimatePresence mode="wait">
                {draggableSlide(
                  (() => {
                    const info = infoSlides[infoIndex];
                    const Icon = info.icon;
                    return (
                      <div className={`p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-[15px_15px_30px_rgba(0,0,0,0.15)] text-white bg-gradient-to-r ${info.bgGradient}`}>
                        <div className="flex-shrink-0">
                          <Icon className="w-24 h-24 mx-auto md:mx-0" />
                        </div>
                        <div className="text-center md:text-left flex-1">
                          <h3 className="text-3xl md:text-4xl font-bold mb-2">{info.title}</h3>
                          <p className="text-lg">{info.description}</p>
                        </div>
                      </div>
                    );
                  })(),
                  infoIndex,
                  setInfoIndex,
                  infoSlides.length
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'tutors' && tutors.length > 0 && (
            <div
              className="relative max-w-5xl mx-auto"
              onMouseEnter={() => setIsTutorPaused(true)}
              onMouseLeave={() => setIsTutorPaused(false)}
            >
              <AnimatePresence mode="wait">
                {draggableSlide(
                  (() => {
                    const tutor = tutors[tutorIndex];
                    return (
                      <div className="relative bg-white rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 shadow-[15px_15px_30px_rgba(0,0,0,0.25)]">
                        <Link href={`/tutors/${tutor.slug}`}>
                          <img
                            src={tutorAvatarUrl(tutor)}
                            alt={tutor.name}
                            className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-teal-600 shadow-lg"
                          />
                        </Link>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-3xl font-bold text-gray-900">{tutor.name}</h3>
                          {tutor.expertise && <p className="text-gray-700 mt-2">{tutor.expertise}</p>}
                          {tutor.qualifications && <p className="text-gray-500 text-sm mt-1">{tutor.qualifications}</p>}
                          <p className="text-gray-500 mt-2">
                            {tutor.years_experience ? `${tutor.years_experience} years experience` : 'Experience N/A'} | 
                            {tutor.language ? ` Language: ${tutor.language}` : ''} {tutor.is_native ? '(Native)' : ''}
                          </p>
                          {tutor.price && <p className="text-teal-600 font-semibold mt-2">${tutor.price}/hr</p>}
                          {tutor.country && <p className="text-gray-400 text-sm mt-1">{tutor.country}</p>}
                        </div>
                      </div>
                    );
                  })(),
                  tutorIndex,
                  setTutorIndex,
                  tutors.length
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'steps' && (
            <div
              className="relative max-w-5xl mx-auto"
              onMouseEnter={() => setIsStepPaused(true)}
              onMouseLeave={() => setIsStepPaused(false)}
            >
              <AnimatePresence mode="wait">
                {draggableSlide(
                  (() => {
                    const step = stepsSlides[stepIndex];
                    return (
                      <div className="p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-[15px_15px_30px_rgba(0,0,0,0.25)] bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-black">
                        <div className="flex-shrink-0 text-center md:text-left">
                          <div className="text-4xl md:text-5xl font-bold mb-2">{step.step}</div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-3xl md:text-4xl font-bold mb-2">{step.title}</h3>
                          <p className="text-lg">{step.description}</p>
                        </div>
                      </div>
                    );
                  })(),
                  stepIndex,
                  setStepIndex,
                  stepsSlides.length
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
