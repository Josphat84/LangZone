'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, Session, User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon, LightBulbIcon, CheckBadgeIcon, PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

// Updated to a language learning themed background image
const HOMEPAGE_BG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

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

// Enhanced AuthModal Component with shadcn
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
        onClose(); // Close modal on successful sign in
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
    
    // Info and Steps slides change much slower (60 seconds/1 minute) to allow more reading time
    const infoAndStepsInterval = setInterval(() => {
      setInfoIndex(prev => (prev + 1) % infoSlides.length);
      setStepIndex(prev => (prev + 1) % stepsSlides.length);
    }, 60000); // 60 seconds/1 minute
    
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
      {/* Partial background image - updated to language learning themed image */}
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

      {/* Enhanced Floating Auth Controls with shadcn */}
      <div className="fixed top-20 right-4 z-50 flex items-center gap-2">
        {!user ? (
          <>
            <Button
              onClick={() => { setIsAuthModalOpen(true); setAuthMode('sign-up'); }}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur border-teal-600 text-teal-700 hover:bg-white shadow-md"
            >
              Sign Up
            </Button>
            <Button
              onClick={() => { setIsAuthModalOpen(true); setAuthMode('sign-in'); }}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 shadow-md"
            >
              Sign In
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur border border-teal-200 rounded-full px-4 py-2 shadow-md">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-teal-100 text-teal-800 text-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-teal-800 hidden sm:inline">
                Hi, {user.email?.split('@')[0]}
              </span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="destructive"
              size="sm"
              className="shadow-md"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Hero Section */}
      <section className="py-20 md:py-32 text-center px-4 sm:px-6 md:px-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-teal-700 drop-shadow-sm mb-6"
        >
          Master New Languages
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8"
        >
          Connect with certified language instructors for personalized 1-on-1 lessons tailored to your goals and schedule.
        </motion.p>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3 rounded-full">
            <Link href="/instructors">
              Find Instructors
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Enhanced Tabs Section with shadcn */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-10">
            <TabsTrigger value="packages" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Our Courses
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              About Us
            </TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              How It Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-6">
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

      {/* Enhanced FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10" id="faq">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {faqItems.map((item, idx) => (
            <Collapsible key={idx} open={openFAQIndex === idx} onOpenChange={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}>
              <Card className={`cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-r ${item.bgGradient} text-white border-none`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-white">{item.question}</CardTitle>
                      <div className="ml-4 flex-shrink-0">
                        {openFAQIndex === idx ? (
                          <MinusIcon className="w-5 h-5 text-white" />
                        ) : (
                          <PlusIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-white/90">{item.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </section>

      {/* Enhanced Blog Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 relative z-10" id="blog">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Latest from Our Blog</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur border-none">
                <CardHeader>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        setIsOpen={setIsAuthModalOpen}
        mode={authMode}
      />
    </div>
  );
}

// Enhanced PackageCard Component
function PackageCard({ pkg, selected, onSelect }: { pkg: Package; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative transition-all duration-300 ${selected ? 'scale-105' : 'hover:scale-105'}`}
      onClick={onSelect}
    >
      <Card className={`overflow-hidden cursor-pointer transition-all ${
        selected ? 'ring-4 ring-teal-500 shadow-xl' : 'hover:shadow-xl'
      }`}>
        {pkg.popular && (
          <Badge className="absolute top-4 right-4 z-10 bg-yellow-500 hover:bg-yellow-500 text-yellow-900">
            MOST POPULAR
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
        
        <CardContent className="p-6">
          <ul className="space-y-3 mb-6">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckBadgeIcon className="w-5 h-5 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            className={`w-full ${
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

// Enhanced InfoSlideComponent
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

// Enhanced StepSlideComponent
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