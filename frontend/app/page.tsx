// File Name: page.tsx

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createClient, Session, User } from '@supabase/supabase-js';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  ArrowRightIcon,
  UserCircleIcon,
  MegaphoneIcon, 
} from '@heroicons/react/24/outline';

// shadcn imports (Assuming these components are configured)
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
import Trans from '@/components/Trans'; // Assuming this component exists for translation/footer, etc.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HOMEPAGE_BG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

// --- Type Definitions (Kept for component clarity) ---
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
  hoverBgGradient?: string;
}
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsOpen?: (open: boolean) => void;
  mode: 'sign-up' | 'sign-in';
}
// --- End Type Definitions ---


// --- 1. COMPONENT: AuthModal (Unchanged) ---
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
        const { error } = await supabase.auth.signUp({ email, password, });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password, });
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
            <UserCircleIcon className='h-6 w-6 text-teal-600'/>
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
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your email address"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password"/>
          </div>
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('error') 
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}>
              {message}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
            {loading ? 'Processing...' : currentMode === 'sign-up' ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <Separator className="my-4" />
        <div className="text-center">
          <Button type="button" variant="link" onClick={() => setCurrentMode(currentMode === 'sign-up' ? 'sign-in' : 'sign-up')} className="text-teal-600 hover:text-teal-700">
            {currentMode === 'sign-up' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


// --- 2. COMPONENT: WhyLangZoneSection (Hero - Header Scrolls with Page) ---
function WhyLangZoneSection() {
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
    }, 6000); 
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden" id="top" ref={ref}>
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${HOMEPAGE_BG})`,
          y,
          backgroundPosition: 'center 50%',
        }}
        aria-hidden="true"
      />
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true"></div> 
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-xl mb-4"
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
                  className="text-lg sm:text-xl text-white/90 max-w-xl mb-4"
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
                  className="bg-teal-600 hover:bg-teal-700 text-lg px-6 py-2 rounded-xl flex-shrink-0 shadow-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.7)]" 
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
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <Card className="shadow-2xl border-2 border-white/50 bg-white/95 backdrop-blur-md">
                <CardHeader className="p-5 flex flex-row items-center space-x-4 bg-teal-50/50">
                  <GlobeAltIcon className="w-8 h-8 text-teal-600 flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Global Learning</CardTitle>
                    <CardDescription className="text-gray-600">
                      Connect with tutors from around the world.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                  <p className="text-gray-700 italic mb-4 border-l-4 border-teal-500 pl-3">
                    "Our expert tutors create a custom learning plan just for you, so you can achieve your language goals faster and more effectively."
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">Certified Tutors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">Flexible Schedule</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpenIcon className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">Rich Resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">Engaging Lessons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        {/* Demo Video Section */}
        <div className="mt-16 flex justify-center">
            <div className="w-full max-w-3xl">
                <div className="aspect-video w-full rounded-lg shadow-2xl overflow-hidden border-4 border-white/50">
                    <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/VyFGfxM_VLA?si=Qv54l6Y96J5-jU5s" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

// --- 3. COMPONENT: Sidebar (Sticky Quick Navigation - Glassmorphism REMOVED) ---
const Sidebar = () => {
  return (
    // Replaced Glassmorphism with a clean, solid background
    <aside className="w-48 p-3 rounded-xl **bg-gray-50** text-gray-800 h-fit sticky top-20 hidden lg:block shadow-xl z-30 border border-gray-200">
      <h3 className="font-bold text-base mb-3 text-teal-800 border-b border-gray-200 pb-2">Quick Navigation</h3>
      <nav>
        <ScrollArea className="h-full max-h-[calc(100vh-150px)]"> 
          <ul className="space-y-1">
            <li>
              <a href="#top" className="flex items-center p-2 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium text-gray-700 hover:text-teal-700">
                <HomeIcon className="w-4 h-4 mr-2 text-teal-600" />
                <span>Top</span>
              </a>
            </li>
            <li>
              <a href="#courses" className="flex items-center p-2 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium text-gray-700 hover:text-teal-700">
                <BuildingLibraryIcon className="w-4 h-4 mr-2 text-blue-600" />
                <span>Courses</span>
              </a>
            </li>
            <li>
              <a href="#faq" className="flex items-center p-2 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium text-gray-700 hover:text-teal-700">
                <QuestionMarkCircleIcon className="w-4 h-4 mr-2 text-indigo-600" />
                <span>FAQ</span>
              </a>
            </li>
            <li>
              <a href="#blog" className="flex items-center p-2 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium text-gray-700 hover:text-teal-700">
                <NewspaperIcon className="w-4 h-4 mr-2 text-orange-600" />
                <span>Blog</span>
              </a>
            </li>
          </ul>
        </ScrollArea>
      </nav>
    </aside>
  );
};

// --- 4. COMPONENT: InfoSlideComponent (About Us) ---
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

// --- 5. COMPONENT: StepSlideComponent (How It Works) ---
function StepSlideComponent({ slide }: { slide: StepSlide }) {
  return (
    <Card className="relative w-full p-6 bg-white shadow-xl border-t-4 border-teal-600">
      <CardHeader className="text-center p-0">
        <Badge className="mx-auto w-fit px-4 py-1.5 text-base font-bold bg-teal-600 text-white shadow-md">
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

// --- 6. COMPONENT: PackageCard (Unchanged) ---
function PackageCard({ pkg, selected, onSelect }: { pkg: Package, selected: boolean, onSelect: () => void }) {
  const Icon = pkg.popular ? CheckBadgeIcon : BookOpenIcon;

  return (
    <Card 
      className={`relative w-full h-full p-0 flex flex-col overflow-hidden transition-all duration-300 ${
        selected 
          ? 'ring-4 ring-teal-600 shadow-2xl scale-[1.03]' 
          : 'hover:shadow-2xl hover:scale-[1.015] hover:border-teal-300'
      }`}
    >
      {pkg.popular && (
        <Badge className="absolute top-0 right-0 rounded-none rounded-bl-lg bg-yellow-500 text-yellow-900 font-bold z-10 text-xs py-1 px-3">
          Popular Choice
        </Badge>
      )}
      <CardHeader 
        className={`p-6 text-white ${pkg.bgGradient} bg-gradient-to-r transition-all duration-300 ${
            !selected && !pkg.popular ? 'group-hover:' + pkg.hoverBgGradient : ''
        }`}
      >
        <CardTitle className="flex items-center justify-between text-2xl font-extrabold">
          {pkg.name}
        </CardTitle>
        <CardDescription className="text-gray-100">
          {pkg.duration} - {pkg.lessons} Lessons
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex flex-col mb-4">
          <div className="text-4xl font-extrabold text-gray-900 flex items-end">
            ${pkg.discountedPrice || pkg.price}
            <span className='text-base font-normal text-gray-500 ml-1'>/ total</span>
          </div>
          {pkg.discountedPrice && (
            <div className="text-sm text-gray-500 line-through">
              ${pkg.price} (Save ${pkg.price - pkg.discountedPrice})
            </div>
          )}
        </div>
        
        <ul className="space-y-3 mb-6 text-sm text-gray-700">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className="w-full bg-teal-600 hover:bg-teal-700 mt-auto shadow-md hover:shadow-lg"
          onClick={onSelect}
        >
          {selected ? 'Selected' : 'Choose Package'}
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// --- 7. COMPONENT: BlogCard (Top Edge Improved & 'Click to Explore' Removed) ---
function BlogCard({ blog, colorClass }: { blog: BlogPost, colorClass: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={`/blog/${blog.slug}`} 
      className="block h-full perspective-1000"
      aria-label={`Read blog post: ${blog.title}`}
    >
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
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(20, 184, 166, 0.5)",
        }}
        initial={{ scale: 1, rotateX: 0, rotateY: 0, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)" }}
      >
        {/* Shadow Layer (Back Card) - for the 3D depth effect */}
        <div 
            className={`absolute inset-0 z-0 rounded-xl transition-all duration-300 ${colorClass}`} 
            style={{ transform: 'translateZ(-10px)' }}
        >
            <div className='absolute inset-0 bg-black/10 rounded-xl'></div>
        </div>

        {/* Main Card (The visible surface) */}
        <Card 
          // Improved top edge by making the border-t-8 thicker and removing the subtle footer
          className="flex flex-col h-full overflow-hidden shadow-none border-t-12 **border-t-teal-600** transition-all duration-300 relative z-10 rounded-xl"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          {/* Header Section */}
          <div 
            className={`p-6 bg-gradient-to-r ${colorClass} text-white flex items-start space-x-4 border-b border-white/20`}
          >
            {blog.icon}
            <h3 className="text-xl font-bold leading-snug">{blog.title}</h3>
          </div>
          
          {/* Content Section */}
          <CardContent className="flex-1 p-6 space-y-3 bg-white">
            <p className="text-sm text-gray-600 leading-relaxed">{blog.summary}</p>
          </CardContent>
          
          {/* REMOVED: The subtle action footer ('Click to Explore') */}
        </Card>
      </motion.div>
    </Link>
  );
}


// --- 8. COMPONENT: MainContent (Glassmorphism REMOVED) ---
const MainContent = () => {
  const [activeTab, setActiveTab] = useState<'packages' | 'info' | 'steps'>('packages');
  const [infoIndex, setInfoIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [packageIndex, setPackageIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null); 
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const blogColors = [
    'from-teal-600 to-blue-600',
    'from-blue-600 to-indigo-600',
    'from-green-600 to-teal-600',
  ];

  const packages: Package[] = [
    { id: 'single', name: 'Single Lesson', type: 'single', price: 25, lessons: 1, duration: '60 minutes', features: ['One 60-minute lesson', 'Choose any available tutor', 'Flexible scheduling', 'Perfect for trying out'], bgGradient: 'from-blue-500 to-blue-600', hoverBgGradient: 'from-blue-600 to-blue-700' },
    { id: 'weekly', name: 'Weekly Core', type: 'weekly', price: 90, discountedPrice: 80, lessons: 4, duration: '4 weeks', features: ['Four 60-minute lessons', 'Same tutor for consistency', 'Weekly progress tracking', '10% discount on single rate'], popular: true, bgGradient: 'from-teal-600 to-teal-700', hoverBgGradient: 'from-teal-700 to-teal-800' },
    { id: 'monthly', name: 'Monthly Intensive', type: 'monthly', price: 300, discountedPrice: 250, lessons: 12, duration: '4 weeks', features: ['Twelve 60-minute lessons', '3 lessons per week', 'Personalized learning plan', 'Progress reports', '20% discount on single rate'], bgGradient: 'from-indigo-600 to-indigo-700', hoverBgGradient: 'from-indigo-700 to-indigo-800' },
    { id: 'premium', name: 'Premium Mastery', type: 'premium', price: 500, discountedPrice: 450, lessons: 20, duration: '2 months', features: ['Twenty 60-minute lessons', 'Dedicated tutor', 'Custom curriculum', 'Weekly progress assessments', 'Learning materials included', 'Certificate of completion'], bgGradient: 'from-orange-500 to-amber-600', hoverBgGradient: 'from-orange-600 to-amber-700' }
  ];

  const infoSlides: InfoSlide[] = [
    { title: 'Who We Are', description: 'Connecting learners with certified instructors worldwide.', icon: UserGroupIcon, bgGradient: 'from-teal-600 to-teal-700' },
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
    { 
      title: 'Top Tips to Learn Languages Fast', 
      slug: 'tips-learn-fast', 
      summary: 'Discover strategies that make language learning efficient and fun. Focus on listening, speaking, and active practice. Use repetition and context to remember vocabulary quickly. Keep lessons consistent and track your progress to stay motivated.', 
      icon: <TrophyIcon className="w-10 h-10 text-white" /> 
    },
    { 
      title: 'How to Practice Speaking Every Day', 
      slug: 'practice-speaking', 
      summary: 'Speaking regularly is crucial. Practice with a tutor, record yourself, or join language groups. Repeat phrases, use shadowing techniques, and get feedback. Small daily steps lead to big improvement.', 
      icon: <ChatBubbleBottomCenterTextIcon className="w-10 h-10 text-white" /> 
    },
    { 
      title: 'Choosing the Right Tutor', 
      slug: 'choose-tutor', 
      summary: 'Select a tutor who matches your learning goals, schedule, and language level. Check reviews, expertise, and teaching style. A compatible tutor ensures lessons are productive and enjoyable.', 
      icon: <MegaphoneIcon className="w-10 h-10 text-white" /> 
    },
  ];

  // Set all carousel intervals to 50 seconds
  const SLIDE_INTERVAL = 50000; 

  // Auto-slide effect 
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
  }, [infoSlides.length, stepsSlides.length, packages.length]);
  
  const [direction, setDirection] = useState(0);

  // Smooth slide variants (Fading-slide)
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }, 
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    })
  };


  const handleSwipe = useCallback((setIndex: (cb: (prev: number) => number) => number, itemsLength: number) => (event: any, info: any) => {
    const swipe = info.velocity.x;
    if (Math.abs(swipe) > 500) {
      const newDirection = swipe > 0 ? -1 : 1;
      setDirection(newDirection);
      setIndex(prev => (prev + newDirection + itemsLength) % itemsLength);
    }
  }, []);

  const handleNextPackage = () => { setDirection(1); setPackageIndex(prev => (prev + 1) % packages.length); };
  const handlePrevPackage = () => { setDirection(-1); setPackageIndex(prev => (prev - 1 + packages.length) % packages.length); };


  return (
    // Replaced Glassmorphism with a clean, solid background
    <div className="flex-1 space-y-16 rounded-2xl p-4 md:p-10 **bg-white shadow-2xl border border-gray-100** min-h-[80vh]">

      {/* --- COURSES/TABS SECTION --- */}
      <section id="courses" className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b pb-2">
          Choose Your Path to Fluency
        </h2>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          {/* Tabs List */}
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-10 **bg-gray-100** p-1 shadow-md rounded-xl border border-gray-200">
            <TabsTrigger value="packages" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-sm font-semibold rounded-lg py-2 transition-all">
              Packages
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-sm font-semibold rounded-lg py-2 transition-all">
              About Us
            </TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-sm font-semibold rounded-lg py-2 transition-all">
              How It Works
            </TabsTrigger>
          </TabsList>

          {/* Packages Content (Slider) */}
          <TabsContent value="packages" className="space-y-6 pt-4">
            <div className="relative flex items-center justify-center">
              {/* Prev Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevPackage}
                className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full text-teal-600 bg-white shadow-xl transition-all hover:bg-teal-600 hover:text-white border-teal-300"
                aria-label="Previous package"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <div className="relative w-full max-w-lg mx-auto overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={packages[packageIndex].id}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full group"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleSwipe((cb) => setPackageIndex(cb), packages.length)}
                    custom={direction}
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
                variant="outline"
                size="lg"
                onClick={handleNextPackage}
                className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full text-teal-600 bg-white shadow-xl transition-all hover:bg-teal-600 hover:text-white border-teal-300"
                aria-label="Next package"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {packages.map((_, idx) => (
                <Button
                  key={idx}
                  onClick={() => { setDirection(idx > packageIndex ? 1 : -1); setPackageIndex(idx); }}
                  variant="ghost"
                  size="icon"
                  className={`w-3 h-3 p-0 rounded-full transition-all duration-300 ${
                    packageIndex === idx ? 'bg-teal-600 w-6' : 'bg-gray-300 hover:bg-teal-300'
                  }`}
                  aria-label={`Go to package ${idx + 1}`}
                />
              ))}
            </div>
          </TabsContent>

          {/* About Us Content (Slider) */}
          <TabsContent value="info" className="space-y-6 pt-4">
            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={infoIndex}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full flex flex-col md:flex-row items-center justify-center relative"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleSwipe((cb) => setInfoIndex(cb), infoSlides.length)}
                  custom={direction}
                >
                  <InfoSlideComponent slide={infoSlides[infoIndex]} />
                </motion.div>
              </AnimatePresence>
              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {infoSlides.map((_, idx) => (
                  <Button
                    key={idx}
                    onClick={() => { setDirection(idx > infoIndex ? 1 : -1); setInfoIndex(idx); }}
                    variant="ghost"
                    size="icon"
                    className={`w-3 h-3 p-0 rounded-full transition-all duration-300 ${
                      infoIndex === idx ? 'bg-teal-600 w-6' : 'bg-gray-300 hover:bg-teal-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* How It Works Content (Slider) */}
          <TabsContent value="steps" className="space-y-6 pt-4">
            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={stepIndex}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full flex flex-col md:flex-row items-center justify-center relative"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleSwipe((cb) => setStepIndex(cb), stepsSlides.length)}
                  custom={direction}
                >
                  <StepSlideComponent slide={stepsSlides[stepIndex]} />
                </motion.div>
              </AnimatePresence>
              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {stepsSlides.map((_, idx) => (
                  <Button
                    key={idx}
                    onClick={() => { setDirection(idx > stepIndex ? 1 : -1); setStepIndex(idx); }}
                    variant="ghost"
                    size="icon"
                    className={`w-3 h-3 p-0 rounded-full transition-all duration-300 ${
                      stepIndex === idx ? 'bg-teal-600 w-6' : 'bg-gray-300 hover:bg-teal-300'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b pb-2">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {faqItems.map((item, idx) => (
            <Collapsible 
              key={idx} 
              open={openFAQIndex === idx} 
              onOpenChange={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}
            >
              <Card className="**bg-white** shadow-lg transition-all duration-300 hover:shadow-xl rounded-xl border border-gray-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className={`py-4 px-5 flex flex-row items-center justify-between cursor-pointer transition-colors ${openFAQIndex === idx ? 'bg-teal-50' : 'hover:bg-gray-50'}`}>
                    <CardTitle className="text-base font-semibold text-gray-800">
                      {item.question}
                    </CardTitle>
                    <div className="ml-4 flex-shrink-0">
                      {openFAQIndex === idx ? (
                        <MinusIcon className="h-5 w-5 text-teal-600 transition-transform duration-300" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-teal-600 transition-transform duration-300" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent className='overflow-hidden transition-all duration-300 ease-in-out'>
                  <CardContent className="px-5 pb-5 pt-3 border-t border-gray-100 bg-white">
                    <p className="text-gray-700 text-sm">{item.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </section>

      <Separator />

      {/* --- BLOG SECTION --- */}
      <section id="blog" className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center border-b pb-2">
          Latest from Our Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <BlogCard 
              key={blog.slug} 
              blog={blog} 
              colorClass={blogColors[index % blogColors.length]}
            />
          ))}
        </div>
        <div className="flex justify-center pt-4">
            <Button asChild size="lg" variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:shadow-md">
                <Link href="/blog">
                    View All Articles
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
            </Button>
        </div>
      </section>

    </div>
  );
};


// --- 9. FINAL EXPORT COMPONENT (Page Structure) ---
export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <WhyLangZoneSection />
      
      <div className="container mx-auto max-w-7xl pt-10 pb-20 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8"> 
          <div className="flex-1 min-w-0">
            <MainContent />
          </div>
          <Sidebar />
        </div>
      </div>
      <Trans /> 
    </div>
  );
}