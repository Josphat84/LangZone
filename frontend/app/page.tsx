'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createClient, Session } from '@supabase/supabase-js';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  UserGroupIcon, LightBulbIcon, CheckBadgeIcon, PlusIcon, MinusIcon,
  GlobeAltIcon, AcademicCapIcon, CalendarDaysIcon, BookOpenIcon, SparklesIcon,
  TrophyIcon, ChatBubbleBottomCenterTextIcon, BriefcaseIcon, HomeIcon,
  BuildingLibraryIcon, QuestionMarkCircleIcon, NewspaperIcon,
  ChevronRightIcon, ChevronLeftIcon, ArrowRightIcon, UserCircleIcon, MegaphoneIcon,
} from '@heroicons/react/24/outline';

// Shadcn UI Imports (Assuming path is correctly aliased)
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';


// Supabase Setup (Using environment variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// *** BACKGROUND IMAGE URL (REMAINS THE SAME) ***
const HOMEPAGE_BG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

// --- Interface Definitions (omitted for brevity) ---
interface InfoSlide { title: string; description: string; icon: any; bgGradient: string; }
interface StepSlide { step: number; title: string; description: string; }
interface FAQItem { question: string; answer: string; }
interface BlogPost { title: string; slug: string; summary: string; icon: JSX.Element; }
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
interface AuthModalProps { isOpen: boolean; onClose: () => void; mode: 'sign-up' | 'sign-in'; }

// 1. AuthModal Component (omitted for brevity)
function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (currentMode === 'sign-up') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
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
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <UserCircleIcon className="h-6 w-6 text-indigo-600" />
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
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your email address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password" />
          </div>
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.toLowerCase().includes('error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              {message}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? 'Processing...' : currentMode === 'sign-up' ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <Separator className="my-4" />
        <div className="text-center">
          <Button type="button" variant="link" onClick={() => setCurrentMode(currentMode === 'sign-up' ? 'sign-in' : 'sign-up')} className="text-indigo-600 hover:text-indigo-700">
            {currentMode === 'sign-up' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 2. Hero Section (WhyLangZoneSection) - 🚨 CRITICAL TEXT COLOR UPDATE
function WhyLangZoneSection({ onSignUp }: { onSignUp: () => void }) {
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const heroTexts = [
    { text: "Personalized lessons with certified instructors tailored to your goals and schedule." },
    { text: "Learn any language, from Spanish to Mandarin, with native speakers who make learning fun." },
    { text: "Accelerate your fluency with custom-built learning plans and real-time feedback." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex(prev => (prev + 1) % heroTexts.length);
    }, 12000); 
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  return (
    <section className="py-20 px-6 relative overflow-hidden text-center lg:text-left min-h-[80vh]" id="top" ref={ref}>
      <motion.div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat filter brightness-100" // 👈 Increased brightness slightly
        style={{
          // Removed top dark gradient overlay to make the image brighter for dark text
          backgroundImage: `url(${HOMEPAGE_BG})`, 
          y,
        }}
        aria-hidden="true"
      />
      
      {/* 🚨 Added a semi-transparent white/gray overlay for consistent text visibility */}
      <div className="absolute inset-0 -z-10 bg-white/40 backdrop-blur-[1px]" aria-hidden="true"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
        
        {/* 🚨 TEXT COLOR CHANGED TO DARK GRAY */}
        <div className="text-gray-900">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl font-extrabold mb-6 drop-shadow-sm" // Reduced shadow since text is dark
          >
            Master New Languages
          </motion.h1>

          <div className="h-24 overflow-hidden flex items-start justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              <motion.p
                key={heroTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="text-2xl max-w-xl mx-auto lg:mx-0 font-medium drop-shadow-sm" // Slightly heavier font-weight for dark text
              >
                {heroTexts[heroTextIndex].text}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-10 flex justify-center lg:justify-start gap-4"
          >
            {/* Button 1: Dark Primary (Indigo) */}
            <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl transition-shadow font-bold">
              <Link href="/instructors">Find Instructors</Link>
            </Button>
            {/* Button 2: White Secondary (High Contrast) */}
             <Button size="lg" variant="secondary" className="bg-white hover:bg-gray-100 text-indigo-700 shadow-xl transition-shadow" onClick={onSignUp}>
              Start Free Trial
            </Button>
          </motion.div>
        </div>

        <div className="flex justify-center lg:justify-end">
          {/* Card: Adjusted for new palette but remains translucent */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-2xl border border-white/50 w-full max-w-md">
            <CardHeader className="p-5 flex items-center gap-4 bg-indigo-50/70 rounded-t-md border-b border-indigo-100">
              <GlobeAltIcon className="w-8 h-8 text-indigo-600" />
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Global Learning</CardTitle>
                <CardDescription className="text-gray-700">
                  Connect with tutors from around the world.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-4">
              <p className="text-gray-700 italic mb-4 border-l-4 border-indigo-500 pl-3">
                "Our expert tutors create a custom learning plan just for you, so you can achieve your language goals faster and more effectively."
              </p>
              <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm font-medium">
                <div className="flex items-center gap-2"><AcademicCapIcon className="w-5 h-5 text-indigo-600" /> Certified Tutors</div>
                <div className="flex items-center gap-2"><CalendarDaysIcon className="w-5 h-5 text-indigo-600" /> Flexible Schedule</div>
                <div className="flex items-center gap-2"><BookOpenIcon className="w-5 h-5 text-indigo-600" /> Rich Resources</div>
                <div className="flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-indigo-600" /> Engaging Lessons</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// 3. Sidebar Navigation (omitted for brevity)
const Sidebar = () => (
  <aside className="hidden lg:block w-48 p-4 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl sticky top-24 text-gray-800 self-start">
    <h3 className="font-semibold mb-4 border-b border-gray-200 pb-2 text-indigo-700">Quick Navigation</h3>
    <nav>
      <ScrollArea className="max-h-[calc(100vh-150px)]">
        <ul className="space-y-2">
          {[
            { href: '#top', icon: HomeIcon, label: 'Top', iconColor: 'text-indigo-600' },
            { href: '#courses', icon: BuildingLibraryIcon, label: 'Courses', iconColor: 'text-blue-600' },
            { href: '#faq', icon: QuestionMarkCircleIcon, label: 'FAQ', iconColor: 'text-purple-600' },
            { href: '#blog', icon: NewspaperIcon, label: 'Blog', iconColor: 'text-orange-600' },
          ].map(({ href, icon: Icon, label, iconColor }) => (
            <li key={label}>
              <a
                href={href}
                className="flex items-center p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <Icon className={`w-4 h-4 mr-2 ${iconColor}`} />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
  </aside>
);

// 4. InfoSlideComponent (omitted for brevity)
function InfoSlideComponent({ slide }: { slide: InfoSlide }) {
  const Icon = slide.icon;
  return (
    <Card className={`relative w-full overflow-hidden text-white shadow-xl ${slide.bgGradient} transition-all duration-500`}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center p-8 space-y-4 md:space-y-0 md:space-x-8">
        <Icon className="h-16 w-16 text-white flex-shrink-0" />
        <div className="text-center md:text-left">
          <CardTitle className="text-2xl font-bold">{slide.title}</CardTitle>
          <CardDescription className="mt-2 text-gray-200 text-lg">
            {slide.description}
          </CardDescription>
        </div>
      </div>
    </Card>
  );
}

// 5. StepSlideComponent (omitted for brevity)
function StepSlideComponent({ slide }: { slide: StepSlide }) {
  return (
    <Card className="relative w-full p-6 bg-white shadow-xl border-t-4 border-indigo-600">
      <CardHeader className="text-center p-0">
        <Badge className="mx-auto w-fit px-4 py-1.5 text-base font-bold bg-indigo-600 text-white shadow-md">
          Step {slide.step}
        </Badge>
        <CardTitle className="mt-4 text-xl font-bold text-gray-900">
          {slide.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center p-0 pt-3">
        <p className="text-md text-gray-600">
          {slide.description}
        </p>
      </CardContent>
    </Card>
  );
}

// 6. PackageCard (omitted for brevity)
function PackageCard({ pkg, selected, onSelect }: { pkg: Package; selected: boolean; onSelect: () => void }) {
  const Icon = pkg.popular ? CheckBadgeIcon : BookOpenIcon;

  return (
    <Card
      className={`relative w-full h-full p-0 flex flex-col overflow-hidden transition-all duration-300 ${
        selected ? 'ring-4 ring-indigo-600 shadow-2xl scale-[1.03]' : 'hover:shadow-2xl hover:scale-[1.015] hover:border-indigo-300'
      }`}
    >
      {pkg.popular && (
        <Badge className="absolute top-0 right-0 rounded-none rounded-bl-lg bg-yellow-500 text-yellow-900 font-bold z-10 text-xs py-1 px-3">
          Popular Choice
        </Badge>
      )}
      <CardHeader
        className={`p-6 text-white ${pkg.bgGradient} bg-gradient-to-r transition-all duration-300`}
      >
        <CardTitle className="flex items-center justify-between text-2xl font-extrabold">{pkg.name}</CardTitle>
        <CardDescription className="text-gray-100">
          {pkg.duration} - {pkg.lessons} Lessons
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex flex-col mb-4">
          <div className="text-4xl font-extrabold text-gray-900 flex items-end">
            ${pkg.discountedPrice || pkg.price}
            <span className="text-base font-normal text-gray-500 ml-1">/ total</span>
          </div>
          {pkg.discountedPrice && (
            <div className="text-sm text-gray-500 line-through">
              ${pkg.price} (Save {pkg.price - pkg.discountedPrice})
            </div>
          )}
        </div>

        <ul className="space-y-3 mb-6 text-sm text-gray-700">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 mt-auto shadow-md hover:shadow-lg" onClick={onSelect}>
          {selected ? 'Selected' : 'Choose Package'}
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// 7. BlogCard component (omitted for brevity)
function BlogCard({ blog, colorClass }: { blog: BlogPost; colorClass: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/blog/${blog.slug}`} className="block h-full perspective-1000" aria-label={`Read blog post: ${blog.title}`}>
      <motion.div
        className="h-full relative w-full rounded-xl"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{
          scale: 1.05,
          rotateX: isHovered ? -5 : 0,
          rotateY: isHovered ? 5 : 0,
          transition: { duration: 0.5, ease: 'easeOut' },
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(99, 102, 241, 0.5)', 
        }}
        initial={{ scale: 1, rotateX: 0, rotateY: 0, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)' }}
      >
        <div className={`absolute inset-0 z-0 rounded-xl transition-all duration-300 ${colorClass}`} style={{ transform: 'translateZ(-10px)' }}>
          <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
        </div>

        <Card
          className="flex flex-col h-full overflow-hidden shadow-none border-t-12 border-t-indigo-600 transition-all duration-300 relative z-10 rounded-xl"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <div className={`p-6 bg-gradient-to-r ${colorClass} text-white flex items-start space-x-4 border-b border-white/20`}>
            {blog.icon}
            <h3 className="text-xl font-bold leading-snug">{blog.title}</h3>
          </div>

          <CardContent className="flex-1 p-6 space-y-3 bg-white">
            <p className="text-sm text-gray-600 leading-relaxed">{blog.summary}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}


// 8. Main content area (MainContent) (omitted for brevity)
const MainContent = ({ onSignUp }: { onSignUp: () => void }) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'info' | 'steps'>('packages');
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [packageIndex, setPackageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string | null>('weekly');
  const [direction, setDirection] = useState(0);

  // --- Data Definitions (omitted for brevity) ---
  const packages: Package[] = [
    { id: 'single', name: 'Single Lesson', type: 'single', price: 25, lessons: 1, duration: '60 minutes', features: ['One 60-minute lesson', 'Choose any available tutor', 'Flexible scheduling', 'Perfect for trying out'], bgGradient: 'from-blue-500 to-blue-600' },
    { id: 'weekly', name: 'Weekly Core', type: 'weekly', price: 90, discountedPrice: 80, lessons: 4, duration: '4 weeks', features: ['Four 60-minute lessons', 'Same tutor for consistency', 'Weekly progress tracking', '10% discount on single rate'], popular: true, bgGradient: 'from-indigo-600 to-indigo-700' },
    { id: 'monthly', name: 'Monthly Intensive', type: 'monthly', price: 300, discountedPrice: 250, lessons: 12, duration: '4 weeks', features: ['Twelve 60-minute lessons', '3 lessons per week', 'Personalized learning plan', 'Progress reports', '20% discount on single rate'], bgGradient: 'from-purple-600 to-indigo-700' },
    { id: 'premium', name: 'Premium Mastery', type: 'premium', price: 500, discountedPrice: 450, lessons: 20, duration: '2 months', features: ['Twenty 60-minute lessons', 'Dedicated tutor', 'Custom curriculum', 'Weekly progress assessments', 'Learning materials included', 'Certificate of completion'], bgGradient: 'from-pink-500 to-rose-600' }
  ];
  const infoSlides: InfoSlide[] = [
    { title: 'Who We Are', description: 'Connecting learners with certified instructors worldwide.', icon: UserGroupIcon, bgGradient: 'from-indigo-600 to-indigo-700' },
    { title: 'What We Offer', description: 'Personalized lessons, flexible scheduling, expert guidance.', icon: LightBulbIcon, bgGradient: 'from-blue-600 to-sky-600' },
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
  const blogs: BlogPost[] = [
    { title: 'Top Tips to Learn Languages Fast', slug: 'tips-learn-fast', summary: 'Discover strategies that make language learning efficient and fun. Focus on listening, speaking, and active practice. Use repetition and context to remember vocabulary quickly. Keep lessons consistent and track your progress to stay motivated.', icon: <TrophyIcon className="w-10 h-10 text-white" /> },
    { title: 'How to Practice Speaking Every Day', slug: 'practice-speaking', summary: 'Speaking regularly is crucial. Practice with a tutor, record yourself, or join language groups. Repeat phrases, use shadowing techniques, and get feedback. Small daily steps lead to big improvement.', icon: <ChatBubbleBottomCenterTextIcon className="w-10 h-10 text-white" /> },
    { title: 'Choosing the Right Tutor', slug: 'choose-tutor', summary: 'Select a tutor who matches your learning goals, schedule, and language level. Check reviews, expertise, and teaching style. A compatible tutor ensures lessons are productive and enjoyable.', icon: <MegaphoneIcon className="w-10 h-10 text-white" /> },
  ];
  const blogColors = ['from-indigo-600 to-blue-600', 'from-blue-600 to-teal-600', 'from-purple-600 to-indigo-600'];

  // --- Animation Logic (omitted for brevity) ---
  const SLIDE_INTERVAL = 50000;

  useEffect(() => {
    const infoInterval = setInterval(() => {
      setInfoIndex(prev => (prev + 1) % infoSlides.length);
    }, SLIDE_INTERVAL);

    const stepsInterval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % stepsSlides.length);
    }, SLIDE_INTERVAL);

    const packagesInterval = setInterval(() => {
      setPackageIndex(prev => (prev + 1) % packages.length);
    }, SLIDE_INTERVAL);

    return () => {
      clearInterval(infoInterval);
      clearInterval(stepsInterval);
      clearInterval(packagesInterval);
    };
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 500 : -500, opacity: 0, scale: 0.8 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }, },
    exit: (direction: number) => ({ x: direction > 0 ? -500 : 500, opacity: 0, scale: 0.8, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } })
  };
  
  const handleNextSlide = (setIndex: (cb: (prev: number) => number) => void, itemsLength: number) => {
    setDirection(1); 
    setIndex(prev => (prev + 1) % itemsLength); 
  };
  const handlePrevSlide = (setIndex: (cb: (prev: number) => number) => void, itemsLength: number) => {
    setDirection(-1); 
    setIndex(prev => (prev - 1 + itemsLength) % itemsLength); 
  };

  return (
    <div className="flex-1 space-y-20 rounded-2xl p-4 md:p-10 bg-white min-h-[80vh] shadow-2xl border border-gray-100">

      {/* --- Tabs Section --- */}
      <section id="courses" className="space-y-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          <SparklesIcon className='w-8 h-8 inline text-indigo-600 mr-2'/>
          Unlock Your Learning Journey
        </h2>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-12 bg-gray-100 p-1 shadow-lg rounded-full border border-gray-200">
            <TabsTrigger value="packages" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-md font-bold rounded-full py-2.5 transition-all">Pricing</TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-md font-bold rounded-full py-2.5 transition-all">About Us</TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-md font-bold rounded-full py-2.5 transition-all">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="packages" className="space-y-6 pt-4">
            <div className="relative flex items-center justify-center w-full max-w-lg mx-auto">
              <Button
                variant="outline" size="lg" aria-label="Previous package"
                onClick={() => handlePrevSlide(setPackageIndex, packages.length)}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full text-indigo-600 bg-white shadow-xl transition-all hover:bg-indigo-600 hover:text-white border-indigo-300"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <div className="relative w-full overflow-hidden h-[500px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={packages[packageIndex].id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <PackageCard
                      pkg={packages[packageIndex]}
                      selected={selectedPackage === packages[packageIndex].id}
                      onSelect={() => setSelectedPackage(packages[packageIndex].id)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <Button
                variant="outline" size="lg" aria-label="Next package"
                onClick={() => handleNextSlide(setPackageIndex, packages.length)}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full text-indigo-600 bg-white shadow-xl transition-all hover:bg-indigo-600 hover:text-white border-indigo-300"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="info" className="space-y-6 pt-4">
             <div className="relative flex items-center justify-center w-full max-w-2xl mx-auto">
              <Button
                variant="outline" size="lg" aria-label="Previous info slide"
                onClick={() => handlePrevSlide(setInfoIndex, infoSlides.length)}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full text-indigo-600 bg-white shadow-xl transition-all hover:bg-indigo-600 hover:text-white border-indigo-300"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <div className="relative w-full overflow-hidden h-[200px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={infoSlides[infoIndex].title}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <InfoSlideComponent slide={infoSlides[infoIndex]} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <Button
                variant="outline" size="lg" aria-label="Next info slide"
                onClick={() => handleNextSlide(setInfoIndex, infoSlides.length)}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full text-indigo-600 bg-white shadow-xl transition-all hover:bg-indigo-600 hover:text-white border-indigo-300"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="steps" className="space-y-6 pt-4">
             <div className="relative flex items-center justify-center w-full max-w-4xl mx-auto">
              <Button
                variant="outline" size="lg" aria-label="Previous step"
                onClick={() => handlePrevSlide(setStepIndex, stepsSlides.length)}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full text-indigo-600 bg-white shadow-xl transition-all hover:bg-indigo-600 hover:text-white border-indigo-300"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <div className="relative w-full overflow-hidden h-[200px] flex justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={stepsSlides[stepIndex].step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute w-full max-w-sm"
                  >
                    <StepSlideComponent slide={stepsSlides[stepIndex]} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <Button
                variant="outline" size="lg" aria-label="Next step"
                onClick={() => handleNextSlide(setStepIndex, stepsSlides.length)}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full text-indigo-600 bg-white shadow-xl transition-all hover:bg-indigo-600 hover:text-white border-indigo-300"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
          </TabsContent>

        </Tabs>
      </section>

      {/* --- FAQ Section --- */}
      <hr className='border-gray-200' />
      <section id="faq" className="space-y-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          <QuestionMarkCircleIcon className='w-7 h-7 inline text-purple-600 mr-2'/>
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index} className='border-t border-gray-100'>
              <AccordionTrigger className='text-left text-lg font-semibold hover:no-underline py-4'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='pb-4 text-gray-600 text-base'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* --- Blog Section --- */}
      <hr className='border-gray-200' />
      <section id="blog" className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          <NewspaperIcon className='w-7 h-7 inline text-orange-600 mr-2'/>
          Latest from the Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.slug} blog={blog} colorClass={blogColors[index % blogColors.length]} />
          ))}
        </div>
      </section>
      
      {/* --- Call to Action Section (CTA) --- */}
      <hr className='border-gray-200' />
      <section className="py-16 bg-indigo-50/70 rounded-xl shadow-inner max-w-5xl mx-auto text-center border border-indigo-100">
        <h3 className="text-3xl font-extrabold text-indigo-800 mb-4">
          Ready to Start Your Journey?
        </h3>
        <p className="text-lg text-indigo-700 mb-8">
          Book your first personalized lesson today and speak fluently sooner.
        </p>
        <Button size="xl" className="bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-transform hover:scale-[1.03]" onClick={onSignUp}>
            <ArrowRightIcon className="h-5 w-5 mr-2" /> Book a Trial Lesson
        </Button>
      </section>
    </div>
  );
}

// --- Main Page Component ---
export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setIsAuthModalOpen(false); // Close modal on auth change
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = () => {
    setAuthMode('sign-up');
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <main className="min-h-screen pb-20 pt-16">
        <WhyLangZoneSection onSignUp={handleSignUp} />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 mt-12">
          <Sidebar /> 
          <MainContent onSignUp={handleSignUp} />
        </div>
      </main>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
      {/* Floating CTA for Mobile/Small Screens */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <Button size="lg" onClick={handleSignUp} className="bg-indigo-600 hover:bg-indigo-700 shadow-xl rounded-full px-6 py-3 font-bold text-white flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" /> Start Trial
        </Button>
      </div>
    </>
  );
}