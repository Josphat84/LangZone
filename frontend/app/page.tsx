'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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

export default function Home() {
  const [tutors, setTutors] = useState<Instructor[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      const { data } = await supabase.from('Instructor').select('*').limit(10);
      if (data) setTutors(data);
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    if (!tutors.length) return;
    const interval = setInterval(() => {
      if (!isPaused) nextTutor();
    }, 12000); // 12 seconds
    return () => clearInterval(interval);
  }, [tutors, isPaused]);

  const nextTutor = () => setCurrent((prev) => (prev + 1) % tutors.length);
  const prevTutor = () => setCurrent((prev) => (prev - 1 + tutors.length) % tutors.length);
  const goToTutor = (index: number) => setCurrent(index);

  const currentTutor = tutors[current];
  const avatarUrl = currentTutor?.image_url
    ? supabase.storage.from('instructor-images').getPublicUrl(currentTutor.image_url).data.publicUrl
    : '/default-avatar.png';

  const slideVariants = {
    enter: { x: 400, opacity: 0, scale: 0.9 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -400, opacity: 0, scale: 0.85 },
  };

  const features = [
    { title: 'Expert Tutors', description: 'Certified language experts with years of teaching experience.' },
    { title: 'Flexible Scheduling', description: 'Book lessons at your convenience, 24/7 availability.' },
    { title: 'Personalized Learning', description: 'Customized lesson plans tailored to your goals.' },
    { title: 'Affordable Pricing', description: 'Competitive rates with flexible payment options.' },
  ];

  const howItWorks = [
    { step: '1', title: 'Choose Your Tutor', description: 'Browse profiles and select your perfect match' },
    { step: '2', title: 'Schedule Lessons', description: 'Pick times that fit your schedule' },
    { step: '3', title: 'Start Learning', description: 'Begin your language journey with expert guidance' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">

      {/* Hero Section */}
      <section className="py-32 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-teal-600 mb-6">
          Master New Languages
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
        </p>
        <Link href="/instructors" className="inline-block bg-teal-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-teal-700 transition">
          Find Instructors
        </Link>
      </section>

      {/* Featured Tutors Carousel */}
      {currentTutor && (
        <section className="py-16 bg-gray-50">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Featured Tutors</h2>
          <div 
            className="relative max-w-5xl mx-auto" 
            ref={carouselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTutor.id}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsPaused(true)}
                onDragEnd={(e, info) => {
                  setIsPaused(false);
                  if (info.offset.x < -100) nextTutor();
                  if (info.offset.x > 100) prevTutor();
                }}
                className="relative bg-white rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 cursor-grab shadow-[15px_15px_30px_rgba(0,0,0,0.25)]"
              >
                <Link href={`/tutors/${currentTutor.slug}`}>
                  <motion.img
                    src={avatarUrl}
                    alt={currentTutor.name}
                    className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-teal-600 shadow-lg"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 1.2 }}
                  />
                </Link>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gray-900">{currentTutor.name}</h3>
                  {currentTutor.expertise && <p className="text-gray-700 mt-2">{currentTutor.expertise}</p>}
                  {currentTutor.qualifications && <p className="text-gray-500 text-sm mt-1">{currentTutor.qualifications}</p>}
                  <p className="text-gray-500 mt-2">
                    {currentTutor.years_experience ? `${currentTutor.years_experience} years experience` : 'Experience N/A'} | 
                    {currentTutor.language ? ` Language: ${currentTutor.language}` : ''} {currentTutor.is_native ? '(Native)' : ''}
                  </p>
                  {currentTutor.price && <p className="text-teal-600 font-semibold mt-2">${currentTutor.price}/hr</p>}
                  {currentTutor.country && <p className="text-gray-400 text-sm mt-1">{currentTutor.country}</p>}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hover Arrows */}
            <motion.div
              className="absolute -left-16 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-xl p-4 hover:bg-gray-100 transition cursor-pointer z-20"
              whileHover={{ scale: 1.1 }}
              onMouseEnter={prevTutor}
            >
              <ChevronLeftIcon className="w-8 h-8 text-teal-600" />
            </motion.div>
            <motion.div
              className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-xl p-4 hover:bg-gray-100 transition cursor-pointer z-20"
              whileHover={{ scale: 1.1 }}
              onMouseEnter={nextTutor}
            >
              <ChevronRightIcon className="w-8 h-8 text-teal-600" />
            </motion.div>

          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 gap-3">
            {tutors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToTutor(idx)}
                className={`w-4 h-4 rounded-full transition ${idx === current ? 'bg-teal-600 shadow-md' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i*0.1 }} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-4">
          {howItWorks.map((step, i) => (
            <motion.div key={i} className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center flex-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}>
              <div className="w-12 h-12 mx-auto mb-2 sm:mb-4 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full font-bold text-lg sm:text-xl">{step.step}</div>
              <h4 className="text-gray-900 font-semibold mb-1 sm:mb-2">{step.title}</h4>
              <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
