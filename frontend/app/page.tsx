'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, Session, User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon, 
  LightBulbIcon, 
  CheckBadgeIcon, 
  PlusIcon, 
  MinusIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  SparklesIcon,
  TrophyIcon,
  ChatBubbleBottomCenterTextIcon,
  BriefcaseIcon,
  HomeIcon,
  BuildingLibraryIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// shadcn imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HOMEPAGE_BG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

// Type definitions
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
}

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  icon: JSX.Element;
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsOpen?: (open: boolean) => void;
  mode: 'sign-up' | 'sign-in';
}

function AuthModal({ isOpen, onClose, setIsOpen, mode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentMode, setCurrentMode] = useState(mode);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (currentMode === 'sign-up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {currentMode === 'sign-up' ? 'Create Account' : 'Sign In'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentMode === 'sign-up' 
              ? 'Join our community of language learners' 
              : 'Welcome back! Please sign in to continue'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('error') 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}>
              {message}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {loading ? 'Processing...' : currentMode === 'sign-up' ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        
        <Separator className="my-4" />
        
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCurrentMode(currentMode === 'sign-up' ? 'sign-in' : 'sign-up')}
            className="text-teal-600 hover:text-teal-700"
          >
            {currentMode === 'sign-up' 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WhyLangZoneSection() {
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroTexts = [
    { text: "Personalized lessons with certified instructors tailored to your goals and schedule." },
    { text: "Learn any language, from Spanish to Mandarin, with native speakers who make learning fun." },
    { text: "Accelerate your fluency with custom-built learning plans and real-time feedback." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex(prev => (prev + 1) % heroTexts.length);
    }, 60000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 md:px-10">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-16">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-700 drop-shadow-sm mb-6"
            >
              Master New Languages
            </motion.h1>
            
            <div className="h-20 flex items-start justify-center lg:justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={heroTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-lg sm:text-xl text-gray-700 max-w-xl mb-4"
                >
                  {heroTexts[heroTextIndex].text}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-md mt-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                <Button
                  size="lg"
                  asChild
                  className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3 rounded-full flex-shrink-0"
                >
                  <Link href="/instructors">
                    Find Instructors
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center items-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1, ease: "easeOut" }}
              className="w-full max-w-lg"
            >
              <Card className="shadow-lg border-none bg-white/90 backdrop-blur-sm">
                <CardHeader className="p-4 flex flex-row items-center space-x-4">
                  <GlobeAltIcon className="w-8 h-8 text-teal-600 flex-shrink-0" />
                  <div>
                    <CardTitle className="text-base font-semibold">Global Learning</CardTitle>
                    <CardDescription className="text-gray-600">
                      Connect with tutors from around the world.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 italic mb-4">
                    "Our expert tutors create a custom learning plan just for you, so you can achieve your language goals faster and more effectively."
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Expert Tutors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="w-6 h-6 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Flexible Schedule</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpenIcon className="w-6 h-6 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Rich Resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-6 h-6 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Engaging Lessons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Sidebar = () => {
  return (
    <aside className="w-56 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 h-fit sticky top-24 hidden lg:block">
      <h3 className="font-bold text-lg mb-4">Quick Navigation</h3>
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#top" className="flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <HomeIcon className="w-5 h-5 mr-2 text-teal-600" />
              <span>Top</span>
            </a>
          </li>
          <li>
            <a href="#courses" className="flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <BuildingLibraryIcon className="w-5 h-5 mr-2 text-sky-600" />
              <span>Courses</span>
            </a>
          </li>
          <li>
            <a href="#faq" className="flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2 text-purple-600" />
              <span>FAQ</span>
            </a>
          </li>
          <li>
            <a href="#blog" className="flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <NewspaperIcon className="w-5 h-5 mr-2 text-orange-600" />
              <span>Blog</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const MainContent = () => {
  const [activeTab, setActiveTab] = useState<'packages' | 'info' | 'steps'>('packages');
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const blogs: BlogPost[] = [
    { title: 'Top Tips to Learn Languages Fast', slug: 'tips-learn-fast', summary: 'Discover strategies that make language learning efficient and fun. Focus on listening, speaking, and active practice. Use repetition and context to remember vocabulary quickly. Keep lessons consistent and track your progress to stay motivated.', icon: <TrophyIcon className="w-12 h-12 text-teal-600" /> },
    { title: 'How to Practice Speaking Every Day', slug: 'practice-speaking', summary: 'Speaking regularly is crucial. Practice with a tutor, record yourself, or join language groups. Repeat phrases, use shadowing techniques, and get feedback. Small daily steps lead to big improvement.', icon: <ChatBubbleBottomCenterTextIcon className="w-12 h-12 text-teal-600" /> },
    { title: 'Choosing the Right Tutor', slug: 'choose-tutor', summary: 'Select a tutor who matches your learning goals, schedule, and language level. Check reviews, expertise, and teaching style. A compatible tutor ensures lessons are productive and enjoyable.', icon: <BriefcaseIcon className="w-12 h-12 text-teal-600" /> },
  ];

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
      bgGradient: 'from-sky-400 to-sky-600'
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
    { title: 'What We Offer', description: 'Personalized lessons, flexible scheduling, expert guidance.', icon: LightBulbIcon, bgGradient: 'from-sky-400 to-sky-600' },
  ];

  const stepsSlides: StepSlide[] = [
    { step: 1, title: 'Browse Tutors', description: 'Explore instructor profiles, read reviews, and choose your ideal tutor based on expertise, availability, and student feedback.' },
    { step: 2, title: 'Schedule Lessons', description: 'Pick convenient times, book your sessions easily, and receive instant confirmation from tutors.' },
    { step: 3, title: 'Learn & Practice', description: 'Engage in interactive lessons with real-time feedback, practice exercises, and personalized guidance to achieve your goals.' },
    { step: 4, title: 'Track Progress', description: 'Monitor your improvement with detailed reports, session summaries, and actionable feedback from tutors.' },
  ];

  const faqItems: FAQItem[] = [
    { question: 'What is the pricing for lessons?', answer: 'Pricing varies by instructor. Most lessons start at $15/hr. You can see each tutor\'s rates on their profile.' },
    { question: 'Which devices and internet speed are required?', answer: 'Desktop, tablet, or mobile. Webcam and mic required. Stable 5Mbps+ internet recommended.' },
    { question: 'How do I find a tutor?', answer: 'Use the "Find Instructors" button to browse tutors by language, expertise, and reviews.' },
    { question: 'How do I book a lesson?', answer: 'Select a tutor, choose a convenient slot, and confirm your booking.' },
    { question: 'Can I book weekly lessons in advance?', answer: 'Yes! You can select multiple time slots for recurring weekly lessons.' },
  ];

  useEffect(() => {
    const infoAndStepsInterval = setInterval(() => {
      setInfoIndex(prev => (prev + 1) % infoSlides.length);
      setStepIndex(prev => (prev + 1) % stepsSlides.length);
    }, 60000);
    
    return () => {
      clearInterval(infoAndStepsInterval);
    };
  }, [infoSlides.length, stepsSlides.length]);

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
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="w-full flex flex-col md:flex-row items-center justify-center relative"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="flex-1 space-y-20">
      <section id="courses" className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Our Courses</h2>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-10 bg-gray-100">
            <TabsTrigger value="packages" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Packages
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              About Us
            </TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              How It Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {packages.map((pkg) => (
                <PackageCard 
                  key={pkg.id} 
                  pkg={pkg} 
                  selected={selectedPackage === pkg.id}
                  onSelect={() => setSelectedPackage(pkg.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {draggableSlide(<InfoSlideComponent slide={infoSlides[infoIndex]} />, infoIndex)}
              </AnimatePresence>
              <div className="flex justify-center gap-3 mt-4">
                {infoSlides.map((_, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setInfoIndex(idx)}
                    variant={infoIndex === idx ? "default" : "outline"}
                    size="sm"
                    className={`w-3 h-3 p-0 rounded-full ${
                      infoIndex === idx ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-6">
            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {draggableSlide(<StepSlideComponent slide={stepsSlides[stepIndex]} />, stepIndex)}
              </AnimatePresence>
              <div className="flex justify-center gap-3 mt-4">
                {stepsSlides.map((_, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setStepIndex(idx)}
                    variant={stepIndex === idx ? "default" : "outline"}
                    size="sm"
                    className={`w-3 h-3 p-0 rounded-full ${
                      stepIndex === idx ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section id="faq" className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqItems.map((item, idx) => (
            <Collapsible key={idx} open={openFAQIndex === idx} onOpenChange={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}>
              <Card className={`cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-r from-teal-400 to-teal-500 text-white border-none`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="py-4 px-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-white">
                        {item.question}
                      </CardTitle>
                      <div className="ml-4 flex-shrink-0">
                        {openFAQIndex === idx ? (
                          <MinusIcon className="h-6 w-6 text-white" />
                        ) : (
                          <PlusIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="px-6 pb-4 pt-0">
                    <p className="text-white/90 text-sm">{item.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </section>

      <section id="blog" className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Latest from Our Blog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur border-none flex flex-col">
                <div className="p-6 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-t-lg">
                  {post.icon}
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-xl font-bold text-gray-800">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{post.summary}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-up' | 'sign-in'>('sign-up');

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

  return (
    <div id="top" className="min-h-screen relative overflow-hidden bg-gray-50">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${HOMEPAGE_BG})`,
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 80%)'
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/60 via-white/50 to-white" />

      <div className="h-16 relative z-10" />

      <WhyLangZoneSection />
      
      <div className="flex flex-col lg:flex-row container mx-auto gap-12 px-4 sm:px-6 md:px-10 py-16">
        <Sidebar />
        <MainContent />
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        setIsOpen={setIsAuthModalOpen}
        mode={authMode}
      />
    </div>
  );
}

function PackageCard({ pkg, selected, onSelect }: { pkg: Package; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative h-full flex flex-col transition-all duration-300 ${selected ? 'scale-105' : 'hover:scale-105'}`}
      onClick={onSelect}
    >
      <Card className={`h-full overflow-hidden cursor-pointer transition-all ${
        selected ? 'ring-4 ring-teal-500 shadow-xl' : 'hover:shadow-xl'
      }`}>
        {pkg.popular && (
          <Badge className="absolute top-4 right-4 z-10 bg-yellow-500 hover:bg-yellow-500 text-yellow-900">
            POPULAR
          </Badge>
        )}
        
        <CardHeader className={`bg-gradient-to-br ${pkg.bgGradient} text-white p-6`}>
          <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
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
          <CardDescription className="text-white/90">
            {pkg.lessons} lessons • {pkg.duration}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 flex-grow flex flex-col">
          <ul className="space-y-3 mb-6 flex-grow">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckBadgeIcon className="w-5 h-5 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            className={`w-full mt-auto ${
              selected 
                ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            variant={selected ? "default" : "secondary"}
          >
            {selected ? 'Selected' : 'Select Package'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoSlideComponent({ slide }: { slide: InfoSlide }) {
  const Icon = slide.icon;
  return (
    <Card className={`border-none bg-gradient-to-r ${slide.bgGradient} text-white shadow-lg`}>
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 p-8">
        <Icon className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0" />
        <div className="text-center md:text-left max-w-xl">
          <CardTitle className="text-2xl font-bold mb-2 text-white">{slide.title}</CardTitle>
          <CardDescription className="text-white/90">{slide.description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}

function StepSlideComponent({ slide }: { slide: StepSlide }) {
  return (
    <Card className="shadow-lg border-gray-200">
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 p-8">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-teal-600 text-white text-xl font-bold flex-shrink-0">
          {slide.step}
        </div>
        <div className="text-center md:text-left max-w-xl">
          <CardTitle className="text-2xl font-bold mb-2">{slide.title}</CardTitle>
          <CardDescription className="text-gray-700">{slide.description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}