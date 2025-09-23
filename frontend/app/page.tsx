// File Name: page.tsx

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
  ChevronRightIcon,
  ChevronLeftIcon,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import Trans from '@/components/Trans';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HOMEPAGE_BG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

// Type definitions (omitted for brevity)
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
    <section className="py-16 md:py-24 px-4 md:px-8 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${HOMEPAGE_BG})`,
        }}
        aria-hidden="true"
      />
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-black/20" aria-hidden="true"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-sm mb-4"
            >
              Master New Languages
            </motion.h1>
            
            <div className="h-16 flex items-start justify-center lg:justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={heroTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-lg sm:text-xl text-white max-w-xl mb-4"
                >
                  {heroTexts[heroTextIndex].text}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-md mt-2"
            >
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center lg:justify-start">
                <Button
                  size="lg"
                  asChild
                  className="bg-teal-600 hover:bg-teal-700 text-lg px-6 py-2 rounded-full flex-shrink-0"
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
              className="w-full max-w-md"
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Expert Tutors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Flexible Schedule</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpenIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Rich Resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5 text-yellow-600" />
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
    <aside className="w-48 p-3 rounded-lg bg-white/70 text-gray-800 h-fit sticky top-20 hidden lg:block backdrop-blur-sm">
      <h3 className="font-bold text-base mb-3">Quick Navigation</h3>
      <nav>
        <ul className="space-y-1">
          <li>
            <a href="#top" className="flex items-center p-2 rounded-md hover:bg-gray-200 transition-colors text-sm">
              <HomeIcon className="w-4 h-4 mr-2 text-teal-600" />
              <span>Top</span>
            </a>
          </li>
          <li>
            <a href="#courses" className="flex items-center p-2 rounded-md hover:bg-gray-200 transition-colors text-sm">
              <BuildingLibraryIcon className="w-4 h-4 mr-2 text-sky-600" />
              <span>Courses</span>
            </a>
          </li>
          <li>
            <a href="#faq" className="flex items-center p-2 rounded-md hover:bg-gray-200 transition-colors text-sm">
              <QuestionMarkCircleIcon className="w-4 h-4 mr-2 text-purple-600" />
              <span>FAQ</span>
            </a>
          </li>
          <li>
            <a href="#blog" className="flex items-center p-2 rounded-md hover:bg-gray-200 transition-colors text-sm">
              <NewspaperIcon className="w-4 h-4 mr-2 text-orange-600" />
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
  const [packageIndex, setPackageIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const blogColors = ['bg-cyan-100', 'bg-purple-100', 'bg-orange-100'];

  const blogs: BlogPost[] = [
    { 
      title: 'Top Tips to Learn Languages Fast', 
      slug: 'tips-learn-fast', 
      summary: 'Discover strategies that make language learning efficient and fun. Focus on listening, speaking, and active practice. Use repetition and context to remember vocabulary quickly. Keep lessons consistent and track your progress to stay motivated.', 
      icon: <TrophyIcon className="w-10 h-10 text-teal-600" /> 
    },
    { 
      title: 'How to Practice Speaking Every Day', 
      slug: 'practice-speaking', 
      summary: 'Speaking regularly is crucial. Practice with a tutor, record yourself, or join language groups. Repeat phrases, use shadowing techniques, and get feedback. Small daily steps lead to big improvement.', 
      icon: <ChatBubbleBottomCenterTextIcon className="w-10 h-10 text-teal-600" /> 
    },
    { 
      title: 'Choosing the Right Tutor', 
      slug: 'choose-tutor', 
      summary: 'Select a tutor who matches your learning goals, schedule, and language level. Check reviews, expertise, and teaching style. A compatible tutor ensures lessons are productive and enjoyable.', 
      icon: <BriefcaseIcon className="w-10 h-10 text-teal-600" /> 
    },
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
      bgGradient: 'from-blue-500 to-blue-600'
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
      bgGradient: 'from-teal-500 to-teal-600'
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
      bgGradient: 'from-purple-500 to-purple-600'
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
      bgGradient: 'from-orange-500 to-orange-600'
    }
  ];

  const infoSlides: InfoSlide[] = [
    { title: 'Who We Are', description: 'Connecting learners with certified instructors worldwide.', icon: UserGroupIcon, bgGradient: 'from-teal-500 to-teal-600' },
    { title: 'What We Offer', description: 'Personalized lessons, flexible scheduling, expert guidance.', icon: LightBulbIcon, bgGradient: 'from-sky-500 to-sky-600' },
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
    // Info and steps slider interval
    const infoAndStepsInterval = setInterval(() => {
      setInfoIndex(prev => (prev + 1) % infoSlides.length);
      setStepIndex(prev => (prev + 1) % stepsSlides.length);
    }, 50000); 
    
    // Packages slider interval
    const packagesInterval = setInterval(() => {
      setPackageIndex(prev => (prev + 1) % packages.length);
    }, 50000);

    return () => {
      clearInterval(infoAndStepsInterval);
      clearInterval(packagesInterval);
    };
  }, [infoSlides.length, stepsSlides.length, packages.length]);
  
  // Handlers for package slider
  const handleNextPackage = () => {
    setPackageIndex(prev => (prev + 1) % packages.length);
  };

  const handlePrevPackage = () => {
    setPackageIndex(prev => (prev - 1 + packages.length) % packages.length);
  };

  // Handlers for info slider
  const handleNextInfo = () => {
    setInfoIndex(prev => (prev + 1) % infoSlides.length);
  };

  const handlePrevInfo = () => {
    setInfoIndex(prev => (prev - 1 + infoSlides.length) % infoSlides.length);
  };

  // Handlers for steps slider
  const handleNextStep = () => {
    setStepIndex(prev => (prev + 1) % stepsSlides.length);
  };

  const handlePrevStep = () => {
    setStepIndex(prev => (prev - 1 + stepsSlides.length) % stepsSlides.length);
  };

  const slideVariants = {
    enter: { x: 400, opacity: 0, scale: 0.9 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -400, opacity: 0, scale: 0.85 },
  };

  return (
    <div className="flex-1 space-y-14 rounded-lg p-4 md:p-8 bg-transparent">
      <section id="courses" className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Courses</h2>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="packages" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-sm">
              Packages
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-sm">
              About Us
            </TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-sm">
              How It Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Prev Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevPackage}
                className="absolute left-0 z-10 hidden md:block text-gray-700 hover:text-teal-600"
                aria-label="Previous package"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </Button>
              <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={packages[packageIndex].id}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="w-full"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => {
                      if (info.velocity.x > 500) {
                        handlePrevPackage();
                      } else if (info.velocity.x < -500) {
                        handleNextPackage();
                      }
                    }}
                  >
                    <PackageCard 
                      pkg={packages[packageIndex]} 
                      selected={selectedPackage === packages[packageIndex].id}
                      onSelect={() => setSelectedPackage(packages[packageIndex].id)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Next Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPackage}
                className="absolute right-0 z-10 hidden md:block text-gray-700 hover:text-teal-600"
                aria-label="Next package"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </Button>
            </div>
            {/* Dot Indicators */}
            <div className="flex justify-center gap-3 mt-4">
              {packages.map((_, idx) => (
                <Button
                  key={idx}
                  onClick={() => setPackageIndex(idx)}
                  variant={packageIndex === idx ? "default" : "outline"}
                  size="sm"
                  className={`w-3 h-3 p-0 rounded-full ${
                    packageIndex === idx ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to package ${idx + 1}`}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={infoIndex}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="w-full flex flex-col md:flex-row items-center justify-center relative"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(event, info) => {
                    if (info.velocity.x > 500) {
                      handlePrevInfo();
                    } else if (info.velocity.x < -500) {
                      handleNextInfo();
                    }
                  }}
                >
                  <InfoSlideComponent slide={infoSlides[infoIndex]} />
                </motion.div>
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
                <motion.div
                  key={stepIndex}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="w-full flex flex-col md:flex-row items-center justify-center relative"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(event, info) => {
                    if (info.velocity.x > 500) {
                      handlePrevStep();
                    } else if (info.velocity.x < -500) {
                      handleNextStep();
                    }
                  }}
                >
                  <StepSlideComponent slide={stepsSlides[stepIndex]} />
                </motion.div>
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

      ---

      <section id="faq" className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {faqItems.map((item, idx) => (
            <Collapsible key={idx} open={openFAQIndex === idx} onOpenChange={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}>
              <Card className="bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-lg border border-transparent hover:border-teal-500">
                <CollapsibleTrigger asChild>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-teal-50">
                    <CardTitle className="text-sm font-semibold text-gray-800">
                      {item.question}
                    </CardTitle>
                    <div className="ml-4 flex-shrink-0">
                      {openFAQIndex === idx ? (
                        <MinusIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="px-4 pb-4 pt-4">
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </section>

      ---

      <section id="blog" className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Latest from Our Blog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 flex flex-col">
                <div className={`p-4 flex-shrink-0 flex items-center justify-center rounded-t-lg ${blogColors[idx % blogColors.length]}`}>
                  {post.icon}
                </div>
                <CardHeader className="flex-grow p-4">
                  <CardTitle className="text-lg font-bold text-gray-900">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="text-gray-600 text-sm">{post.summary}</CardDescription>
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
  const [isAuthModalOpen, setIsAuthModal] = useState(false);
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
    <div id="top" className="min-h-screen bg-transparent">
      <WhyLangZoneSection />
      
      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-12">
        <Sidebar />
        <MainContent />
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModal(false)}
        setIsOpen={setIsAuthModal}
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
      className={`relative h-full flex flex-col transition-all duration-300 w-full max-w-sm mx-auto`} 
      onClick={onSelect}
    >
      <Card className={`h-full overflow-hidden cursor-pointer transition-all border-0 ${
        selected ? 'ring-2 ring-teal-500 shadow-lg' : 'hover:shadow-lg hover:scale-105'
      }`}>
        {pkg.popular && (
          <Badge className="absolute top-3 right-3 z-10 bg-teal-600 hover:bg-teal-600 text-white text-xs">
            POPULAR
          </Badge>
        )}
        
        <CardHeader className={`bg-gradient-to-r ${pkg.bgGradient} text-white p-4`}>
          <CardTitle className="text-lg font-bold">{pkg.name}</CardTitle>
          <div className="flex items-end mb-2">
            {pkg.discountedPrice ? (
              <>
                <span className="text-2xl font-bold">${pkg.discountedPrice}</span>
                <span className="text-sm line-through ml-2 opacity-80">${pkg.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold">${pkg.price}</span>
            )}
          </div>
          <CardDescription className="text-white/90 text-sm">
            {pkg.lessons} lessons • {pkg.duration}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 flex-grow flex flex-col bg-white/80 backdrop-blur-sm">
          <ul className="space-y-2 mb-4 flex-grow">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckBadgeIcon className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-xs text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            className={`w-full mt-auto text-sm ${
              selected 
                ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            variant={selected ? "default" : "secondary"}
            size="sm"
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
    <Card className={`border-0 bg-gradient-to-r ${slide.bgGradient} text-white shadow-lg`}>
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-4 p-6">
        <Icon className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0" />
        <div className="text-center md:text-left max-w-xl">
          <CardTitle className="text-xl font-bold mb-2 text-white">{slide.title}</CardTitle>
          <CardDescription className="text-white/90 text-sm">{slide.description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}

function StepSlideComponent({ slide }: { slide: StepSlide }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="flex flex-col md:flex-row items-center justify-center gap-4 p-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-600 text-white text-lg font-bold flex-shrink-0">
          {slide.step}
        </div>
        <div className="text-center md:text-left max-w-xl">
          <CardTitle className="text-xl font-bold mb-2">{slide.title}</CardTitle>
          <CardDescription className="text-gray-700 text-sm">{slide.description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}