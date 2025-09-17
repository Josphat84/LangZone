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

  // Helper function to get video URL from Supabase storage
  const getVideoUrl = (filename: string) => {
    // Ensure the filename has .mp4 extension
    const finalFilename = filename.endsWith('.mp4') ? filename : filename + '.mp4';
    
    const { data } = supabase.storage.from('demos').getPublicUrl(finalFilename);
    
    console.log(`📹 Project URL: ${supabaseUrl}`);
    console.log(`📹 Bucket: demos`);
    console.log(`📹 Original filename: "${filename}"`);
    console.log(`📹 Final filename: "${finalFilename}"`);
    console.log(`📹 Full URL: "${data.publicUrl}"`);
    
    // Test the URL by trying to fetch it
    fetch(data.publicUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log(`✅ Video file accessible: ${finalFilename}`);
          console.log(`✅ Content-Type: ${response.headers.get('content-type')}`);
          console.log(`✅ Content-Length: ${response.headers.get('content-length')} bytes`);
        } else {
          console.error(`❌ Video file not accessible (HTTP ${response.status}): ${finalFilename}`);
          console.error(`❌ Make sure your 'demos' bucket is PUBLIC in Supabase Dashboard`);
          console.error(`❌ Check that the file '${finalFilename}' exists in the bucket`);
        }
      })
      .catch(err => {
        console.error(`❌ Network error checking video file: ${finalFilename}`, err);
        console.error(`❌ This might be a CORS or network connectivity issue`);
      });
    
    return data.publicUrl;
  };

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        
        // First, let's list all files in the demos bucket to see exact names
        console.log('🔍 Checking files in demos bucket...');
        const { data: files, error: filesError } = await supabase.storage.from('demos').list();
        
        if (filesError) {
          console.error('Error listing files:', filesError);
        } else {
          console.log('📁 Files in demos bucket:', files);
          files?.forEach(file => {
            console.log(`📄 File: "${file.name}" (${file.metadata?.size} bytes)`);
          });
        }
        
        const { data, error } = await supabase.from('Instructor').select('*');
        if (error) {
          setError(error.message);
          return;
        }
        if (data) {
          // Map tutors to their demo videos from Supabase storage
          const tutorsWithVideos = data.map((t: Instructor) => {
            // Set demo video URLs using the new short filenames
            if (t.name === 'Benson') {
              // Use the new filename: teach.mp4
              t.demo_video_url = getVideoUrl('teach');
              console.log('🎬 Benson setup with teach.mp4');
            } else if (t.name === 'James Brown') {
              // Use the new filename: know.mp4
              t.demo_video_url = getVideoUrl('know');
              console.log('🎬 James Brown setup with know.mp4');
            }
            // Only set demo_video_url for Benson and James Brown
            
            t.zoom_link = t.zoom_link || 'zoommtg://zoom.us';
            return t;
          });
          setInstructors(tutorsWithVideos);
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
            <SelectTrigger className="w-full md:w-1/5"><SelectValue placeholder="All Languages" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {uniqueLanguages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full md:w-1/5"><SelectValue placeholder="All Countries" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-1/5"><SelectValue placeholder="Sort By" /></SelectTrigger>
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
          <DialogClose className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 z-50 text-sm">×</DialogClose>
          {openDemoVideo && (
            <div className="relative">
              <video
                key={`modal-${openDemoVideo}-${Date.now()}`}
                src={`${openDemoVideo}?v=${Date.now()}`}
                controls
                autoPlay
                muted={false} // Start unmuted since user clicked to play
                preload="auto" // Changed back to 'auto' for streaming
                playsInline
                webkit-playsinline="true"
                width="100%"
                height="auto"
                className="w-full h-auto rounded-lg bg-black"
                style={{ 
                  aspectRatio: '16/9',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
                onLoadStart={() => {
                  console.log('🎬 Video loading started - streaming mode');
                }}
                onProgress={(e) => {
                  const video = e.target as HTMLVideoElement;
                  if (video.buffered.length > 0) {
                    const bufferedEnd = video.buffered.end(0);
                    const duration = video.duration || 0;
                    const percentBuffered = duration > 0 ? (bufferedEnd / duration * 100).toFixed(1) : 0;
                    console.log(`📊 Buffering: ${percentBuffered}% (${bufferedEnd.toFixed(1)}s of ${duration.toFixed(1)}s)`);
                  }
                }}
                onCanPlay={() => {
                  console.log('▶️ Video can start playing (streaming)');
                  const video = document.querySelector('video') as HTMLVideoElement;
                  if (video && video.paused) {
                    video.play().catch(e => console.log('Auto-play prevented:', e));
                  }
                }}
                onCanPlayThrough={() => console.log('✅ Video fully buffered')}
                onWaiting={() => console.log('⏳ Buffering more data...')}
                onPlaying={() => console.log('🎥 Video playing while streaming')}
                onLoadedData={() => {
                  console.log('📥 Initial data loaded - should start playing');
                }}
                onSuspend={() => console.log('⏸️ Download suspended (normal for streaming)')}
                onStalled={() => console.log('🚧 Download stalled - network issue?')}
                onError={(e) => {
                  const video = e.target as HTMLVideoElement;
                  console.error('❌ Video error:', video.error?.code, video.error?.message);
                }}
                onDoubleClick={(e) => e.preventDefault()}
              />
              <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                {openDemoVideo.split('/').pop()}
              </div>
              {/* Fallback message if video doesn't render properly */}
              <div className="absolute bottom-4 right-4 bg-yellow-600/80 text-white px-2 py-1 rounded text-xs">
                If video doesn't show, try: Right-click → "Show controls" or download file
              </div>
            </div>
          )}
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

  const handleZoomClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      const mobileZoomUrl = tutor.zoom_link || 'zoomus://zoom.us/join';
      window.location.href = mobileZoomUrl;
      setTimeout(() => {
        if (!document.hidden) window.open('https://zoom.us/join', '_blank');
      }, 4500);
    } else {
      window.open(tutor.zoom_link || 'https://zoom.us/join', '_blank');
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
                  {/* Price info commented */}
                  {/* {tutor.price && <Badge className="text-base px-3 py-1 bg-primary text-primary-foreground border-primary self-center sm:self-start"><span className="font-bold">${tutor.price}</span><span className="text-xs opacity-90">/hr</span></Badge>} */}
                </div>

                <div className="flex flex-wrap gap-2 mt-1 items-center">
                  {tutor.years_experience && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[0]}`}><Clock className="w-3 h-3" />{tutor.years_experience} yrs</Badge>}
                  {tutor.country && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[1]}`}><MapPin className="w-3 h-3" />{tutor.country}</Badge>}
                  {tutor.language && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[2]}`}><Languages className="w-3 h-3" />{tutor.language}</Badge>}
                  {tutor.teaching_style && <Badge className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColors[3]}`}><BookOpen className="w-3 h-3" />{tutor.teaching_style}</Badge>}
                  {tutor.is_native && <Badge className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Native</Badge>}
                </div>

                <p className="text-muted-foreground text-sm mt-2">{tutor.description}</p>

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

            {/* Right side - Demo video thumbnail - Show for ALL tutors */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="md:w-44 lg:w-52 bg-gradient-to-br from-purple-50 via-yellow-50 to-pink-50 p-3 rounded-lg flex flex-col justify-between cursor-pointer"
              onClick={() => {
                if (tutor.demo_video_url) {
                  setOpenDemoVideo(tutor.demo_video_url);
                } else {
                  console.log('Demo video coming soon for:', tutor.name);
                  // You could show a "Coming Soon" modal here
                }
              }}
            >
              <h4 className="text-xs font-semibold text-foreground mb-1">Demo Video</h4>
              <Card className="overflow-hidden relative" style={{ paddingBottom: '75%' }}>
                {tutor.demo_video_url ? (
                  // Show actual video thumbnail if video exists
                  <>
                    <video
                      key={`${tutor.name}-${tutor.demo_video_url}`}
                      src={`${tutor.demo_video_url}?v=${Date.now()}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      preload="metadata" // Changed from 'auto' to 'metadata' for faster loading
                      muted
                      playsInline
                      onLoadedData={() => console.log('Thumbnail video loaded for:', tutor.name, tutor.demo_video_url)}
                      onError={(e) => {
                        console.error('Thumbnail video failed for:', tutor.name, tutor.demo_video_url);
                        console.error('Error event:', e);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/10 transition-colors">
                      <div className="bg-white/90 rounded-full p-2 shadow-lg">
                        <Play className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    {/* Debug overlay */}
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] px-1 rounded max-w-full overflow-hidden">
                      {tutor.demo_video_url.split('/').pop()}
                    </div>
                  </>
                ) : (
                  // Show placeholder for tutors without videos
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs text-blue-800 font-medium">Coming Soon</p>
                      </div>
                    </div>
                  </>
                )}
              </Card>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                {tutor.demo_video_url ? 'Watch introduction video' : 'Demo video coming soon'}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}