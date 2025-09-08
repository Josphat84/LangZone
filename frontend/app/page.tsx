'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, Session, User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon, LightBulbIcon, CheckBadgeIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import AuthModal from '@/components/AuthModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// AI-generated background image URL (you can replace with your preferred image)
const HOMEPAGE_BG = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; 

// Add Instructor interface
interface Instructor {
  id: string;
  name: string;
  language?: string;
  expertise?: string;
  price?: number;
  is_native: boolean;
  image_url?: string;
  demo_video_url?: string;
  zoom_link?: string;
  slug: string;
  country?: string;
  years_experience?: number;
  qualifications?: string;
  rating?: number;
  total_students?: number;
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

interface Package {
  id: string;
  name: string;
  type: 'single' | 'weekly' | 'monthly' | 'premium';
  price: number;
  discountedPrice?: number;
  lessons: number;
  duration: string;
  features: string[];
  popular?: boolean;
  bgGradient: string;
}

export default function Home() {
  const [tutors, setTutors] = useState<Instructor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Instructor[]>([]);
  const [activeTab, setActiveTab] = useState<'packages' | 'info' | 'steps'>('packages');
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const [blogs] = useState<BlogPost[]>([
    { title: 'Top Tips to Learn Languages Fast', slug: 'tips-learn-fast', summary: 'Discover strategies that make language learning efficient and fun. Focus on listening, speaking, and active practice. Use repetition and context to remember vocabulary quickly. Keep lessons consistent and track your progress to stay motivated.' },
    { title: 'How to Practice Speaking Every Day', slug: 'practice-speaking', summary: 'Speaking regularly is crucial. Practice with a tutor, record yourself, or join language groups. Repeat phrases, use shadowing techniques, and get feedback. Small daily steps lead to big improvement.' },
    { title: 'Choosing the Right Tutor', slug: 'choose-tutor', summary: 'Select a tutor who matches your learning goals, schedule, and language level. Check reviews, expertise, and teaching style. A compatible tutor ensures lessons are productive and enjoyable.' },
  ]);

  const packages: Package[] = [
    {
      id: 'single',
      name: 'Single Lesson',
      type: 'single',
      price: 25,
      lessons: 1,
      duration: '60 minutes',
      features: [
        'One 60-minute lesson',
        'Choose any available tutor',
        'Flexible scheduling',
        'Perfect for trying out'
      ],
      bgGradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'weekly',
      name: 'Weekly Package',
      type: 'weekly',
      price: 90,
      discountedPrice: 80,
      lessons: 4,
      duration: '4 weeks',
      features: [
        'Four 60-minute lessons',
        'Same tutor for consistency',
        'Weekly progress tracking',
        '10% discount on single rate'
      ],
      popular: true,
      bgGradient: 'from-purple-400 to-purple-600'
    },
    {
      id: 'monthly',
      name: 'Monthly Intensive',
      type: 'monthly',
      price: 300,
      discountedPrice: 250,
      lessons: 12,
      duration: '4 weeks',
      features: [
        'Twelve 60-minute lessons',
        '3 lessons per week',
        'Personalized learning plan',
        'Progress reports',
        '20% discount on single rate'
      ],
      bgGradient: 'from-teal-400 to-teal-600'
    },
    {
      id: 'premium',
      name: 'Premium Program',
      type: 'premium',
      price: 500,
      discountedPrice: 450,
      lessons: 20,
      duration: '2 months',
      features: [
        'Twenty 60-minute lessons',
        'Dedicated tutor',
        'Custom curriculum',
        'Weekly progress assessments',
        'Learning materials included',
        'Certificate of completion'
      ],
      bgGradient: 'from-orange-400 to-orange-600'
    }
  ];

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
    // Hero tips change faster (6 seconds)
    const heroTipInterval = setInterval(() => {
      setHeroTipIndex(prev => (prev + 1) % heroTips.length);
    }, 6000);
    
    // Info and Steps slides change much slower (30 seconds) to allow more reading time
    const infoAndStepsInterval = setInterval(() => {
      setInfoIndex(prev => (prev + 1) % infoSlides.length);
      setStepIndex(prev => (prev + 1) % stepsSlides.length);
    }, 30000); // Changed from 12000 to 30000 (30 seconds)
    
    return () => {
      clearInterval(heroTipInterval);
      clearInterval(infoAndStepsInterval);
    };
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
      transition={{ duration: 1.5, ease: 'easeInOut' }} // Slightly longer transition
      className="w-full flex flex-col md:flex-row items-center justify-center relative"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Partial background image - only covers top portion */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${HOMEPAGE_BG})`,
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 80%)'
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/70 to-white" />

      {/* Header placeholder (adjust positioning as needed) */}
      <div className="h-16 relative z-10" />

      {/* Floating Auth Controls - positioned below header */}
      <div className="fixed top-20 right-4 z-50 flex items-center gap-2">
        {!user ? (
          <>
            <button
              onClick={() => { setIsAuthModalOpen(true); setAuthMode('sign-up'); }}
              className="bg-white/90 backdrop-blur border border-teal-600 text-teal-700 hover:bg-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => { setIsAuthModalOpen(true); setAuthMode('sign-in'); }}
              className="bg-teal-600 text-white hover:bg-teal-700 text-sm font-semibold px-4 py-2 rounded-full shadow-md transition"
            >
              Sign In
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-block text-sm px-4 py-2 rounded-full font-semibold text-teal-800 bg-white/90 backdrop-blur border border-teal-200 shadow">
              Hi, {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white hover:bg-red-600 text-sm font-semibold px-4 py-2 rounded-full shadow-md transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Hero */}
      <section className="py-20 md:py-32 text-center px-4 sm:px-6 md:px-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-teal-700 drop-shadow-sm mb-6">
          Master New Languages
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
          Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
        </p>
        <div className="max-w-3xl mx-auto mb-8 relative h-14">
          <AnimatePresence mode="wait">
            <motion.p
              key={heroTipIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-teal-700 font-semibold text-lg sm:text-xl"
            >
              {heroTips[heroTipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/instructors"
            className="inline-block bg-teal-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-teal-700 transition shadow"
          >
            Find Instructors
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10">
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <button onClick={() => setActiveTab('packages')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'packages' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Our Packages</button>
          <button onClick={() => setActiveTab('info')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'info' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>About Us</button>
          <button onClick={() => setActiveTab('steps')} className={`py-2 px-6 rounded-full font-semibold transition ${activeTab === 'steps' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>How It Works</button>
        </div>

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                pkg={pkg} 
                selected={selectedPackage === pkg.id}
                onSelect={() => setSelectedPackage(pkg.id)}
              />
            ))}
          </div>
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
              <div className="flex items-center justify-between">
                <motion.h3 layout className="font-semibold text-lg">{item.question}</motion.h3>
                <div className="ml-4 flex-shrink-0">
                  {openFAQIndex === idx ? (
                    <MinusIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PlusIcon className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              <AnimatePresence>
                {openFAQIndex === idx && (
                  <motion.p
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
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
              className="bg-white/95 backdrop-blur rounded-3xl shadow-lg p-8 text-gray-800 hover:shadow-2xl hover:scale-105 transition transform"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h3>
              <p className="text-gray-600">{post.summary}</p>
            </motion.div>
          ))}
        </div>
      </section>

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

// PackageCard Component
function PackageCard({ pkg, selected, onSelect }: { pkg: Package; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${selected ? 'ring-4 ring-teal-500 scale-105' : 'hover:shadow-xl'}`}
      onClick={onSelect}
    >
      {pkg.popular && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          MOST POPULAR
        </div>
      )}
      
      <div className={`bg-gradient-to-br ${pkg.bgGradient} text-white p-6`}>
        <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
        <div className="flex items-end mb-4">
          {pkg.discountedPrice ? (
            <>
              <span className="text-3xl font-bold">${pkg.discountedPrice}</span>
              <span className="text-lg line-through ml-2 opacity-80">${pkg.price}</span>
            </>
          ) : (
            <span className="text-3xl font-bold">${pkg.price}</span>
          )}
        </div>
        <p className="text-sm opacity-90">{pkg.lessons} lessons • {pkg.duration}</p>
      </div>
      
      <div className="bg-white p-6">
        <ul className="space-y-3 mb-6">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckBadgeIcon className="w-5 h-5 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          className={`w-full py-3 rounded-lg font-semibold transition ${
            selected 
              ? 'bg-teal-600 text-white hover:bg-teal-700' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {selected ? 'Selected' : 'Select Package'}
        </button>
      </div>
    </motion.div>
  );
}

// InfoSlideComponent
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

// StepSlideComponent
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