'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, MapPin, Play, User, BookOpen, Languages } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaPaypal } from 'react-icons/fa';
import { SiZoom, SiWise } from 'react-icons/si';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HOMEPAGE_BG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

interface Instructor {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  expertise?: string;
  teaching_style?: string;
  years_experience?: number;
  language?: string;
  is_native?: boolean;
  price?: number;
  country?: string;
  qualifications?: string;
  description?: string;
  demo_video_url?: string;
  zoom_link?: string;
}

export default function TutorsList() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDemoVideo, setOpenDemoVideo] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('Instructor').select('*');
        if (error) {
          setError(error.message);
          return;
        }
        if (data) {
          const tutorsWithDefaults = data.map((t: Instructor) => ({
            ...t,
            demo_video_url: t.demo_video_url || '/default-demo.mp4',
            zoom_link: t.zoom_link || 'zoommtg://zoom.us',
          }));
          setInstructors(tutorsWithDefaults);
        }
      } catch {
        setError('Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const filtered = instructors
    .filter(inst => languageFilter === 'all' || (inst.language || '').toLowerCase() === languageFilter.toLowerCase())
    .filter(inst => countryFilter === 'all' || (inst.country || '').toLowerCase() === countryFilter.toLowerCase())
    .filter(inst => (inst.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (inst.language || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'experience') return (b.years_experience || 0) - (a.years_experience || 0);
    if (sortOption === 'priceAsc') return (a.price || 0) - (b.price || 0);
    if (sortOption === 'priceDesc') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const uniqueLanguages = Array.from(new Set(instructors.map(i => i.language).filter(Boolean)));
  const uniqueCountries = Array.from(new Set(instructors.map(i => i.country).filter(Boolean)));

  if (loading)
    return (
      <div className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6 md:px-8" style={{ backgroundImage: `url(${HOMEPAGE_BG})` }}>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">Our Tutors</h1>
        <div className="space-y-4 max-w-5xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full p-4 animate-pulse"><div className="h-24 bg-muted rounded"></div></Card>
          ))}
        </div>
      </div>
    );

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!sorted.length) return <div className="text-center mt-10 text-white">No tutors found.</div>;

  return (
    <div className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6 md:px-8" style={{ backgroundImage: `url(${HOMEPAGE_BG})` }}>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">Our Tutors</h1>

      {/* Filters */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center mb-4 flex-wrap">
          <Input type="text" placeholder="Search by name or language..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/3" />
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-full md:w-1/5">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {uniqueLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full md:w-1/5">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-1/5">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="priceAsc">Price Low → High</SelectItem>
              <SelectItem value="priceDesc">Price High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tutors List */}
      <AnimatePresence>
        <div className="max-w-5xl mx-auto space-y-6">
          {sorted.map((tutor, index) => (
            <TutorCard key={tutor.id} tutor={tutor} setOpenDemoVideo={setOpenDemoVideo} delay={index * 0.2} />
          ))}
        </div>
      </AnimatePresence>

      {/* Demo Video Modal */}
      <Dialog open={!!openDemoVideo} onOpenChange={() => setOpenDemoVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden relative">
          <DialogTitle className="sr-only">Demo Video</DialogTitle>
          <DialogClose className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">X</DialogClose>
          {openDemoVideo && <video src={openDemoVideo} controls autoPlay className="w-full h-auto rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TutorCardProps {
  tutor: Instructor;
  setOpenDemoVideo: (url: string) => void;
  delay?: number;
}

function TutorCard({ tutor, setOpenDemoVideo, delay = 0 }: TutorCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const avatarUrl = tutor.image_url
    ? supabase.storage.from('instructor-images').getPublicUrl(tutor.image_url).data.publicUrl
    : '/default-avatar.png';

  // Mobile-friendly Zoom click handler
  const handleZoomClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      let mobileZoomUrl: string;
      
      // For iOS devices
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        mobileZoomUrl = tutor.zoom_link || 'zoomus://zoom.us/join';
      }
      // For Android devices
      else if (/Android/.test(navigator.userAgent)) {
        // Use intent URL for better Android support
        mobileZoomUrl = tutor.zoom_link || 'intent://zoom.us/join#Intent;scheme=zoomus;package=us.zoom.videomeetings;end';
      }
      // Fallback for other mobile devices
      else {
        mobileZoomUrl = tutor.zoom_link || 'zoomus://zoom.us/join';
      }
      
      // Try to open Zoom app
      window.location.href = mobileZoomUrl;
      
      // Fallback to web version after 2.5 seconds if app doesn't open
      setTimeout(() => {
        if (!document.hidden) {
          window.open('https://zoom.us/join', '_blank');
        }
      }, 2500);
    } else {
      // For desktop - use web version or custom link
      const desktopZoomUrl = tutor.zoom_link || 'https://zoom.us/join';
      window.open(desktopZoomUrl, '_blank');
    }
  };

  const badgeColors = ['bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-800', 'bg-pink-100 text-pink-700'];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      whileHover={{ scale: 1.03 }}
    >
      <Card className="w-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 bg-gradient-to-tr from-white via-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Left side */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
              <Link href={`/tutors/${tutor.slug}`} className="relative cursor-pointer">
                <Avatar className="w-28 h-28 sm:w-32 sm:h-32 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <AvatarImage src={avatarUrl} alt={tutor.name} style={{ objectFit: 'cover' }} />
                  <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground line-clamp-1">{tutor.name}</h3>
                    <p className="text-primary text-sm font-medium">{tutor.expertise || 'Language Tutor'}</p>
                  </div>
                  {tutor.price && <Badge className="text-base px-3 py-1 bg-primary text-primary-foreground border-primary self-center sm:self-start"><span className="font-bold">${tutor.price}</span><span className="text-xs opacity-90">/hr</span></Badge>}
                </div>

                {/* Tutor Info with Native badge */}
                <div className="flex flex-wrap gap-2 mt-1 items-center">
                  {tutor.years_experience && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[0]}`}><Clock className="w-3 h-3" />{tutor.years_experience} yrs</Badge>}
                  {tutor.country && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[1]}`}><MapPin className="w-3 h-3" />{tutor.country}</Badge>}
                  {tutor.language && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[2]}`}><Languages className="w-3 h-3" />{tutor.language}</Badge>}
                  {tutor.teaching_style && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[3]}`}><BookOpen className="w-3 h-3" />{tutor.teaching_style}</Badge>}
                  {tutor.is_native && <Badge className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Native</Badge>}
                </div>

                <p className="text-muted-foreground text-sm mt-2">{tutor.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button asChild size="sm" className="flex-1 hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-400 hover:text-white transition-all">
                    <Link href={`/tutors/${tutor.slug}`}><User className="w-4 h-4 mr-1" />View Profile</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-400 hover:text-white transition-all"
                    onClick={handleZoomClick}
                  >
                    <SiZoom className="w-4 h-4 mr-1 text-blue-500" />Zoom Call
                  </Button>
                  <Button variant="outline" asChild size="sm" className="flex-1 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 hover:text-white transition-all">
                    <a href="#" target="_blank" rel="noreferrer"><FaPaypal className="w-4 h-4 mr-1 text-yellow-600" />PayPal</a>
                  </Button>
                  <Button variant="outline" asChild size="sm" className="flex-1 hover:bg-gradient-to-r hover:from-green-400 hover:to-lime-400 hover:text-white transition-all">
                    <a href="#" target="_blank" rel="noreferrer"><SiWise className="w-4 h-4 mr-1 text-green-500" />Wise</a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Demo video */}
            {tutor.demo_video_url && (
              <motion.div whileHover={{ scale: 1.03 }} className="md:w-44 lg:w-52 bg-gradient-to-br from-purple-50 via-yellow-50 to-pink-50 p-3 rounded-lg flex flex-col justify-between cursor-pointer" onClick={() => setOpenDemoVideo(tutor.demo_video_url!)}>
                <h4 className="text-xs font-semibold text-foreground mb-1">Demo Video</h4>
                <Card className="overflow-hidden relative" style={{ paddingBottom: '75%' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/30 flex items-center justify-center group-hover:animate-pulse">
                    <Play className="w-6 h-6 text-foreground/70 transition-colors group-hover:text-primary" />
                  </div>
                </Card>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">Watch introduction video</p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}