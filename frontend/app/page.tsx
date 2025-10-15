'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Star, Check, ArrowRight, ChevronDown, Users, BookOpen, Globe, Zap,
  TrendingUp, MessageCircle, Award
} from 'lucide-react';

export default function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('packages');
  const [selectedPackage, setSelectedPackage] = useState('weekly');
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [packageIndex, setPackageIndex] = useState(0);

  const packages = [
    {
      id: 'single',
      name: 'Single Lesson',
      price: 25,
      lessons: 1,
      duration: '60 minutes',
      features: ['One 60-minute lesson', 'Choose any available tutor', 'Flexible scheduling', 'Perfect for trying out'],
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'weekly',
      name: 'Weekly Core',
      price: 90,
      discountedPrice: 80,
      lessons: 4,
      duration: '4 weeks',
      features: ['Four 60-minute lessons', 'Same tutor for consistency', 'Weekly progress tracking', '10% discount on single rate'],
      popular: true,
      bgGradient: 'from-black to-gray-800'
    },
    {
      id: 'monthly',
      name: 'Monthly Intensive',
      price: 300,
      discountedPrice: 250,
      lessons: 12,
      duration: '4 weeks',
      features: ['Twelve 60-minute lessons', '3 lessons per week', 'Personalized learning plan', 'Progress reports'],
      bgGradient: 'from-gray-700 to-gray-900'
    },
    {
      id: 'premium',
      name: 'Premium Mastery',
      price: 500,
      discountedPrice: 450,
      lessons: 20,
      duration: '2 months',
      features: ['Twenty 60-minute lessons', 'Dedicated tutor', 'Custom curriculum', 'Weekly assessments', 'Certificate'],
      bgGradient: 'from-slate-800 to-black'
    }
  ];

  const infoSlides = [
    {
      title: 'Who We Are',
      description: 'Connecting learners with certified instructors worldwide, making quality language education accessible to everyone.',
      icon: Users,
      bgGradient: 'from-black to-gray-800'
    },
    {
      title: 'What We Offer',
      description: 'Personalized lessons, flexible scheduling, expert guidance, and comprehensive learning resources.',
      icon: BookOpen,
      bgGradient: 'from-gray-800 to-black'
    },
  ];

  const stepsSlides = [
    {
      step: 1,
      title: 'Browse Tutors',
      description: 'Explore instructor profiles, read reviews, and choose your ideal tutor based on expertise and feedback.'
    },
    {
      step: 2,
      title: 'Schedule Lessons',
      description: 'Pick convenient times, book your sessions easily, and receive instant confirmation.'
    },
    {
      step: 3,
      title: 'Learn & Practice',
      description: 'Engage in interactive lessons with real-time feedback and personalized guidance.'
    },
    {
      step: 4,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed reports and actionable feedback from tutors.'
    }
  ];

  const faqItems = [
    {
      question: 'What is the pricing for lessons?',
      answer: 'Pricing varies by instructor. Most lessons start at $15/hr. You can see each tutor\'s rates on their profile.'
    },
    {
      question: 'Which devices and internet speed are required?',
      answer: 'Desktop, tablet, or mobile. Webcam and mic required. Stable 5Mbps+ internet recommended.'
    },
    {
      question: 'How do I find a tutor?',
      answer: 'Use the "Find Instructors" button to browse tutors by language, expertise, and reviews.'
    },
    {
      question: 'How do I book a lesson?',
      answer: 'Select a tutor, choose a convenient slot, and confirm your booking.'
    },
    {
      question: 'Can I book weekly lessons in advance?',
      answer: 'Yes! You can select multiple time slots for recurring weekly lessons.'
    }
  ];

  const blogs = [
    {
      title: 'Top Tips to Learn Languages Fast',
      slug: 'tips-learn-fast',
      summary: 'Discover strategies that make language learning efficient and fun. Focus on listening, speaking, and active practice.',
      icon: Award
    },
    {
      title: 'How to Practice Speaking Every Day',
      slug: 'practice-speaking',
      summary: 'Speaking regularly is crucial. Practice with a tutor, record yourself, or join language groups for consistent improvement.',
      icon: MessageCircle
    },
    {
      title: 'Choosing the Right Tutor',
      slug: 'choose-tutor',
      summary: 'Select a tutor who matches your learning goals, schedule, and language level for productive lessons.',
      icon: Users
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Expert Tutors',
      desc: 'Native speakers with teaching certification and years of experience'
    },
    {
      icon: Zap,
      title: 'Fast Learning',
      desc: 'Personalized curriculum designed for maximum retention and fluency'
    },
    {
      icon: Globe,
      title: 'Learn Anywhere',
      desc: 'Flexible scheduling with 24/7 access to lessons and materials'
    },
    {
      icon: BookOpen,
      title: 'Rich Resources',
      desc: 'Comprehensive learning materials including videos, quizzes, and exercises'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      desc: 'Real-time feedback and detailed analytics to monitor your improvement'
    },
    {
      icon: MessageCircle,
      title: '24/7 Support',
      desc: 'Dedicated support team ready to help you succeed'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-6"
              >
                <div className="px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">🎯 Learn Any Language, Anywhere</span>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
                Master New <span className="bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">Languages</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with expert tutors, learn at your own pace, and achieve fluency with personalized lessons tailored to your goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-900 transition font-semibold flex items-center justify-center gap-2">
                  <span>Get Started</span>
                 
                </button>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="px-8 py-4 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition font-semibold flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  <span>Watch Demo</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Learning"
                  className="w-full h-96 object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVideoOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition group cursor-pointer"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Play size={40} className="text-black fill-black" />
                  </div>
                </motion.button>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white px-6 py-4 rounded-xl shadow-lg border border-gray-100"
              >
                
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to master a language, all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-xl border border-gray-200 hover:border-black hover:shadow-lg transition"
                >
                  <div className="text-black mb-4"><Icon size={32} /></div>
                  <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Tabs */}
          <div id="courses" className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-12">
              Unlock Your Learning Journey
            </h2>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-4 flex-wrap mb-12">
              {[
                { value: 'packages', label: 'Pricing' },
                { value: 'info', label: 'About Us' },
                { value: 'steps', label: 'How It Works' }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    activeTab === tab.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {packages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`rounded-2xl p-8 flex flex-col transition-all ${
                      selectedPackage === pkg.id
                        ? 'ring-2 ring-black shadow-2xl scale-105'
                        : 'bg-white border border-gray-200 hover:border-black'
                    } ${pkg.popular ? `bg-gradient-to-br ${pkg.bgGradient} text-white` : 'text-gray-900'}`}
                  >
                    {pkg.popular && (
                      <div className="mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          pkg.popular ? 'bg-white text-black' : 'bg-gray-100 text-gray-900'
                        }`}>
                          Most Popular
                        </span>
                      </div>
                    )}

                    <h3 className={`text-2xl font-bold mb-3 ${pkg.popular ? 'text-white' : 'text-black'}`}>
                      {pkg.name}
                    </h3>

                    <div className="mb-6">
                      <div className={`text-4xl font-bold ${pkg.popular ? 'text-white' : 'text-black'}`}>
                        ${pkg.discountedPrice || pkg.price}
                      </div>
                      {pkg.discountedPrice && (
                        <div className={`text-sm line-through ${pkg.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                          ${pkg.price}
                        </div>
                      )}
                    </div>

                    <p className={`mb-6 text-sm ${pkg.popular ? 'text-gray-200' : 'text-gray-600'}`}>
                      {pkg.duration} • {pkg.lessons} Lessons
                    </p>

                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check size={20} className={pkg.popular ? 'text-white' : 'text-black'} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`py-3 rounded-lg font-semibold transition ${
                        selectedPackage === pkg.id
                          ? pkg.popular
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-black text-white hover:bg-gray-900'
                          : pkg.popular
                          ? 'bg-white text-black hover:bg-gray-100'
                          : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      {selectedPackage === pkg.id ? 'Selected' : 'Choose'}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* About Tab */}
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {infoSlides.map((slide, idx) => {
                  const Icon = slide.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className={`bg-gradient-to-br ${slide.bgGradient} text-white p-8 rounded-2xl`}
                    >
                      <Icon size={40} className="mb-4" />
                      <h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
                      <p className="text-gray-200 text-lg leading-relaxed">{slide.description}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Steps Tab */}
            {activeTab === 'steps' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {stepsSlides.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border-l-4 border-black p-8 rounded-lg hover:shadow-lg transition"
                  >
                    <div className="inline-block mb-4 px-4 py-2 bg-black text-white rounded-full text-sm font-bold">
                      Step {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Blog Section */}
          <section id="blog" className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-black text-center">
              Latest from the Blog
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, idx) => {
                const Icon = blog.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-black hover:shadow-lg transition"
                  >
                    <div className="bg-gradient-to-br from-black to-gray-800 text-white p-6 flex items-center gap-4">
                      <Icon size={40} />
                      <h3 className="text-lg font-bold">{blog.title}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 leading-relaxed">{blog.summary}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-black text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group border border-gray-200 rounded-lg p-6 hover:border-black transition"
                >
                  <summary className="flex items-center justify-between cursor-pointer font-bold text-black">
                    {item.question}
                    <ChevronDown size={20} className="group-open:rotate-180 transition" />
                  </summary>
                  <p className="text-gray-600 mt-4">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-black text-white py-16 px-8 rounded-2xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Speak Fluently?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of language learners on their journey to fluency
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              Start Your Free Trial Today
            </motion.button>
          </section>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-black rounded-2xl overflow-hidden">
                <iframe
                  width="100%"
                  height="600"
                  src="https://www.youtube.com/embed/oER7tVRGVmk?autoplay=1"
                  title="LangZone - Learn Languages Like Never Before"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}