'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              <span className="block">Master New</span>
              <span className="block text-teal-600">Languages</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-8">
              With Expert Tutors
            </h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What language do you want to learn?"
                  className="w-full px-5 py-4 pr-16 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-2 hover:bg-teal-700 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
              <div className="mt-4 text-center">
                <Link href="/instructors" className="inline-flex items-center text-teal-600 hover:text-teal-500 font-medium">
                  Or browse all instructors
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Features Section */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Why Choose Us</h2>
            <h3 className="text-3xl font-bold text-gray-900">The Best Way to Learn a Language</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                ),
                title: "Expert Tutors",
                description: "All our instructors are certified language experts with years of teaching experience."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                ),
                title: "Flexible Scheduling",
                description: "Book lessons at your convenience, 24/7 availability across time zones."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                ),
                title: "Personalized Learning",
                description: "Customized lesson plans tailored to your specific goals and learning style."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                ),
                title: "Affordable Pricing",
                description: "Competitive rates with flexible payment options for every budget."
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 bg-teal-50 p-3 rounded-lg mr-4">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Choose Your Tutor",
                description: "Browse profiles and select your perfect match"
              },
              {
                step: "2",
                title: "Schedule Lessons",
                description: "Pick times that fit your schedule"
              },
              {
                step: "3",
                title: "Start Learning",
                description: "Begin your language journey with expert guidance"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to start your language journey?</h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students learning with our expert tutors today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/instructors" 
              className="inline-block bg-white text-teal-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse All Instructors
            </Link>
            <Link 
              href="/free-trial" 
              className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Try a Free Lesson
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}