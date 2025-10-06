'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveBookingCalendar from './InteractiveBookingCalendar';
import PaymentsZoomButtons from '../../../components/PaymentsZoomButtons';

import { getSupabaseClient } from '@/lib/supabase/client'; // <- singleton client

const supabase = getSupabaseClient()


// shadcn/ui imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

import {
  Heart,
  MapPin,
  Languages,
  GraduationCap,
  Briefcase,
  Info,
  Search,
  Sun,
  Moon,
  Play,
  Globe,
  Clock,
  DollarSign,
  Video,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  Calendar,
  Award,
  BookOpen
} from "lucide-react";

type Instructor = {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  country?: string;
  language?: string;
  is_native?: boolean;
  expertise?: string;
  qualifications?: string;
  years_experience?: number;
  price?: number;
  description?: string;
  video_intro_url?: string;
  social_links?: string;
  slug?: string;
  image_url?: string | null;
  zoom_meeting_id?: string;
  zoom_password?: string;
  createdAt?: string;
  rating?: number;
  total_reviews?: number;
};

type Cached = { instructor: Instructor; avatarUrl: string; cachedAt: number };

export default function TutorPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [allSlugs, setAllSlugs] = useState<string[]>([]);
  const [direction, setDirection] = useState<1 | -1>(1);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNextTutor(),
    onSwipedRight: () => handlePrevTutor(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const CACHE_TTL = 1000 * 60 * 3; // 3 minutes
  const cacheKey = (s: string) => `instructor:${s}`;

  const readCache = (s: string): Cached | null => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem(cacheKey(s));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Cached;
      if (Date.now() - parsed.cachedAt > CACHE_TTL) {
        localStorage.removeItem(cacheKey(s));
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const writeCache = (s: string, data: Cached) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(cacheKey(s), JSON.stringify(data));
    } catch {}
  };

  const preloadImage = (url: string) => {
    if (!url) return;
    try {
      const img = new Image();
      img.src = url;
    } catch {}
  };

  const currentIndex = useMemo(
    () => allSlugs.findIndex((s) => s === slug),
    [allSlugs, slug]
  );

  const nextSlug = useMemo(() => {
    if (!allSlugs.length || currentIndex === -1) return null;
    return allSlugs[(currentIndex + 1) % allSlugs.length];
  }, [allSlugs, currentIndex]);

  const prevSlug = useMemo(() => {
    if (!allSlugs.length || currentIndex === -1) return null;
    return allSlugs[(currentIndex - 1 + allSlugs.length) % allSlugs.length];
  }, [allSlugs, currentIndex]);

  async function fetchAndCacheBySlug(s: string) {
    try {
      const { data, error: fetchError } = await supabase
        .from('Instructor')     // keep the table name you use in DB (was 'Instructor' in your original)
        .select('*')
        .eq('slug', s)
        .single();

      if (fetchError || !data) return null;

      let avatar = '';
      if (data.image_url) {
        // Supabase storage public URL
        const { data: publicUrlData } = supabase.storage
          .from('instructor-images')
          .getPublicUrl(data.image_url);
        // API returns data.publicUrl or data.publicURL (depending on version); safely check both
        // @ts-ignore
        avatar = (publicUrlData?.publicUrl ?? publicUrlData?.publicURL) || '';
      }

      const packed: Cached = { instructor: data, avatarUrl: avatar, cachedAt: Date.now() };
      writeCache(s, packed);
      preloadImage(avatar);
      return packed;
    } catch (err) {
      console.error('fetchAndCacheBySlug error', err);
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError(null);
      setLoading(true);

      const cached = typeof window !== 'undefined' ? readCache(slug) : null;
      if (cached && mounted) {
        setInstructor(cached.instructor);
        setAvatarUrl(cached.avatarUrl);
        setLoading(false);
      }

      const packed = await fetchAndCacheBySlug(slug);
      if (!mounted) return;
      if (packed) {
        setInstructor(packed.instructor);
        setAvatarUrl(packed.avatarUrl);
        setError(null);
      } else if (!cached) {
        setError('Failed to load instructor profile.');
      }
      setLoading(false);
      setNavigating(false);
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    (async () => {
      try {
        const { data: slugsData, error } = await supabase.from('Instructor').select('slug');
        if (error) {
          console.error('Error fetching slugs', error);
          return;
        }
        if (slugsData) setAllSlugs(slugsData.map((i: any) => i.slug).filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (nextSlug && !readCache(nextSlug)) await fetchAndCacheBySlug(nextSlug);
      if (prevSlug && !readCache(prevSlug)) await fetchAndCacheBySlug(prevSlug);
    })();
  }, [nextSlug, prevSlug]);

  const handleLike = () => {
    setLikes((prev) => (userLiked ? prev - 1 : prev + 1));
    setUserLiked((prev) => !prev);
  };

  const handleNextTutor = async () => {
    if (!allSlugs.length || currentIndex === -1) return;
    setDirection(1);
    setNavigating(true);
    // push to next; AnimatePresence mode="wait" will help avoid DOM remove race
    router.push(`/tutors/${nextSlug}`);
  };

  const handlePrevTutor = async () => {
    if (!allSlugs.length || currentIndex === -1) return;
    setDirection(-1);
    setNavigating(true);
    router.push(`/tutors/${prevSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2 text-destructive">Oops! Something went wrong</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/instructors')}>
              Browse All Instructors
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div {...handlers} className="min-h-screen relative">
        <AnimatePresence mode="wait">
          {navigating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="text-foreground text-xl font-semibold animate-pulse">Loading tutor…</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Instructor Profile
                </h1>
              </motion.div>

              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="theme-mode"
                          checked={theme === "dark"}
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        />
                        <Label htmlFor="theme-mode">
                          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Label>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{theme === "dark" ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button onClick={() => router.push('/instructors')}>
                        <Search className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Find Instructors</span>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Browse all instructors</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="secondary" onClick={() => router.push('/dashboard/tutor')}>
                        <User className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to your dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Left Column - Profile Info (3/5 width) */}
            <div className="xl:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={instructor?.slug || 'loading-left'}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {instructor && (
                    <InstructorProfileLeft
                      instructor={instructor}
                      avatarUrl={avatarUrl}
                      likes={likes}
                      userLiked={userLiked}
                      handleLike={handleLike}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column - Booking & Actions (2/5 width) */}
            <div className="xl:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={instructor?.slug || 'loading-right'}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {instructor && (
                    <div className="space-y-6 sticky top-6">
                      {/* Booking Calendar */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="text-primary" />
                              Booking & Schedule
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <InteractiveBookingCalendar instructor={instructor} />
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <PaymentsZoomButtons 
                          instructor={instructor} 
                          avatarUrl={avatarUrl} 
                        />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Navigation Buttons */}
        <motion.div
          className="fixed top-1/2 -translate-y-1/2 left-4 z-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={handlePrevTutor}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-background border shadow-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Previous tutor</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        <motion.div
          className="fixed top-1/2 -translate-y-1/2 right-4 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={handleNextTutor}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-background border shadow-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Next tutor</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}

// Enhanced Left Profile Component with better layout
function InstructorProfileLeft({
  instructor,
  avatarUrl,
  likes,
  userLiked,
  handleLike,
}: {
  instructor: Instructor;
  avatarUrl: string;
  likes: number;
  userLiked: boolean;
  handleLike: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Hero Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar className="w-32 h-32 sm:w-40 sm:h-40 ring-4 ring-primary/20">
                    <AvatarImage 
                      src={avatarUrl || '/default-avatar.png'} 
                      alt={instructor.name}
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                      }}
                    />
                    <AvatarFallback className="text-2xl">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  {/* Online status indicator */}
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-background rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {instructor.name}
                  </h2>
                  
                  {instructor.expertise && (
                    <p className="text-lg text-primary font-medium mt-1">{instructor.expertise}</p>
                  )}

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {instructor.rating || 4.8}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      ({instructor.total_reviews || 124} reviews)
                    </span>
                  </div>
                </div>

                {/* Price and Quick Stats */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {/*instructor.price && (
                    <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {instructor.price}/hour
                    </Badge>
                  )*/}
                  
                  {instructor.years_experience && (
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {instructor.years_experience}+ years
                    </Badge>
                  )}

                  {instructor.is_native && (
                    <Badge variant="success" className="px-3 py-1 text-sm">
                      <Languages className="w-3 h-3 mr-1" />
                      Native Speaker
                    </Badge>
                  )}
                </div>

                {/* Like Button */}
                <div className="flex justify-center lg:justify-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={userLiked ? "destructive" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart 
                        className={`w-4 h-4 ${userLiked ? 'fill-current' : ''}`}
                      />
                      <span>
                        {likes} {likes === 1 ? 'Like' : 'Likes'}
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {instructor.email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${instructor.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              )}
              {instructor.phone_number && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${instructor.phone_number}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
              )}
              {instructor.video_intro_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={instructor.video_intro_url} target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4 mr-2" />
                    Intro Video
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About Section */}
      {instructor.description && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Info className="text-primary" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{instructor.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Personal Info Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Globe className="text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instructor.country && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="text-primary w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-muted-foreground">{instructor.country}</p>
                  </div>
                </div>
              )}
              
              {instructor.language && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Languages className="text-primary w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-muted-foreground">{instructor.language}</p>
                  </div>
                </div>
              )}
              
              {instructor.years_experience && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Briefcase className="text-primary w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Experience</p>
                    <p className="text-muted-foreground">{instructor.years_experience}+ years</p>
                  </div>
                </div>
              )}
              
              {instructor.expertise && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Award className="text-primary w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Expertise</p>
                    <p className="text-muted-foreground">{instructor.expertise}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Qualifications Section */}
      {instructor.qualifications && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <GraduationCap className="text-primary" />
                Qualifications & Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">{instructor.qualifications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Social Links */}
      {instructor.social_links && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="text-primary" />
                Connect With Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href={instructor.social_links} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  View Social Profile
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
