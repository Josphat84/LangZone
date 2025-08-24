'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
      title: "Expert Tutors",
      description: "All our instructors are certified language experts with years of teaching experience.",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      title: "Flexible Scheduling",
      description: "Book lessons at your convenience, 24/7 availability across time zones.",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      ),
      title: "Personalized Learning",
      description: "Customized lesson plans tailored to your specific goals and learning style.",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      ),
      title: "Affordable Pricing",
      description: "Competitive rates with flexible payment options for every budget.",
    },
  ];

  const howItWorks = [
    { step: "1", title: "Choose Your Tutor", description: "Browse profiles and select your perfect match" },
    { step: "2", title: "Schedule Lessons", description: "Pick times that fit your schedule" },
    { step: "3", title: "Start Learning", description: "Begin your language journey with expert guidance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">

      {/* Floating shapes */}
      <motion.div className="absolute w-64 h-64 bg-teal-200 rounded-full top-10 left-10 opacity-20"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity }} />
      <motion.div className="absolute w-80 h-80 bg-blue-300 rounded-full bottom-0 right-0 opacity-20"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="absolute w-96 h-96 bg-purple-200 rounded-full top-1/3 right-1/4 opacity-10"
        animate={{ y: [0, -15, 0], x: [0, 15, 0] }} transition={{ duration: 15, repeat: Infinity }} />

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 flex flex-col-reverse md:flex-row items-center">
          <div className="text-center md:text-left md:w-1/2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                <span className="block">Master New</span>
                <span className="block text-teal-600">Languages</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-8">
                With Expert Tutors From Around The World
              </h2>
              <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto md:mx-0">
                Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
              </p>

              {/* Prominent Find Instructors Button */}
              <Link href="/instructors" className="inline-block bg-teal-600 text-white font-semibold py-3 px-6 rounded-full text-lg hover:bg-teal-700 transition">
                Find Instructors
              </Link>
            </motion.div>
          </div>

          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="Language learning" className="w-full max-w-lg mx-auto rounded-xl shadow-2xl border-8 border-white transform rotate-2"/>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Why Choose Us</h2>
          <h3 className="text-3xl font-bold text-gray-900">The Best Way to Learn a Language</h3>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-1 bg-teal-500 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i*0.1 }} whileHover={{ scale: 1.05 }} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg transition-transform">
              <div className="flex-shrink-0 bg-teal-50 p-3 rounded-lg mb-4">{feature.icon}</div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-teal-600 text-xs sm:text-sm font-semibold uppercase mb-1">Process</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">How It Works</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-4">
          {howItWorks.map((step, i) => (
            <motion.div key={i} className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center relative flex-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}>
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
