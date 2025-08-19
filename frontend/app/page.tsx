'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

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

  const testimonials = [
    { name: "Sarah M.", feedback: "I finally learned French thanks to my amazing tutor!", language: "French" },
    { name: "David L.", feedback: "Flexible scheduling made learning Spanish so easy.", language: "Spanish" },
    { name: "Aisha K.", feedback: "Personalized lessons helped me progress quickly.", language: "English" },
  ];

  const popularLanguages = [
    { name: "English", flag: "🇬🇧" },
    { name: "French", flag: "🇫🇷" },
    { name: "Spanish", flag: "🇪🇸" },
    { name: "German", flag: "🇩🇪" },
    { name: "Chinese", flag: "🇨🇳" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Italian", flag: "🇮🇹" },
    { name: "Russian", flag: "🇷🇺" },
    { name: "Arabic", flag: "🇸🇦" },
    { name: "Portuguese", flag: "🇵🇹" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">

      {/* Floating shapes */}
      <motion.div 
        className="absolute w-64 h-64 bg-teal-200 rounded-full top-10 left-10 opacity-20"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute w-80 h-80 bg-blue-300 rounded-full bottom-0 right-0 opacity-20"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div 
        className="absolute w-96 h-96 bg-purple-200 rounded-full top-1/3 right-1/4 opacity-10"
        animate={{ y: [0, -15, 0], x: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 flex flex-col-reverse md:flex-row items-center">
          <div className="text-center md:text-left md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
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

              {/* Search Box */}
              <div className="max-w-md mx-auto md:mx-0 relative">
                <input
                  type="text"
                  placeholder="What language do you want to learn?"
                  className="w-full px-5 py-4 pr-16 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-lg transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-2 hover:bg-teal-700 transition-all shadow-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>

              <div className="mt-4 text-center md:text-left">
                <Link href="/instructors" className="inline-flex items-center text-teal-600 hover:text-teal-500 font-medium">
                  Or browse all instructors
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                alt="Language learning" 
                className="w-full max-w-lg mx-auto rounded-xl shadow-2xl border-8 border-white transform rotate-2"
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg z-10"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center">
                  <div className="bg-teal-100 p-2 rounded-full mr-3">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Book anytime</p>
                    <p className="text-sm text-gray-600">24/7 availability</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg z-10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Global tutors</p>
                    <p className="text-sm text-gray-600">Native speakers</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Why Choose Us</h2>
            <h3 className="text-3xl font-bold text-gray-900">The Best Way to Learn a Language</h3>
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-1 bg-teal-500 rounded-full"></div>
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg transition-transform"
            >
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
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Process</h2>
          <h3 className="text-3xl font-bold text-gray-900">How It Works</h3>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-1 bg-teal-500 rounded-full"></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorks.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }} 
              className="bg-white p-6 rounded-lg text-center shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500"></div>
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 mt-2">
                {step.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {i < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Success Stories</h2>
          <h3 className="text-3xl font-bold text-gray-900">What Our Students Say</h3>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-1 bg-teal-500 rounded-full"></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }} 
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl mr-4">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <span className="text-teal-600 text-sm">{t.language}</span>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t.feedback}"</p>
              <div className="mt-4 flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Languages */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Languages</h2>
          <h3 className="text-3xl font-bold text-gray-900">Popular Languages</h3>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-1 bg-teal-500 rounded-full"></div>
          </div>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-4">
          {popularLanguages.map((lang, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.1 }} 
              className="bg-white text-gray-800 px-6 py-3 rounded-full shadow-md cursor-pointer flex items-center hover:bg-teal-50 hover:text-teal-600 transition-all"
            >
              <span className="text-2xl mr-2">{lang.flag}</span>
              {lang.name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-4"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Tutors</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-4"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Students</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-4"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">25+</div>
              <div className="text-gray-600">Languages</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-4"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">50K+</div>
              <div className="text-gray-600">Lessons Taught</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-16 relative z-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to start your language journey?</h2>
            <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
              Join thousands of students learning with our expert tutors today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/instructors" 
                className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
              >
                Browse All Instructors
              </Link>
              <Link 
                href="/free-trial" 
                className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors transform hover:scale-105"
              >
                Try a Free Lesson
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}