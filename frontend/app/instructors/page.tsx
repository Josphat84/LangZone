'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Range, getTrackBackground } from 'react-range';
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Instructor {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  expertise?: string;
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

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const STEP = 1;

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
          const tutorsWithDemoVideos = data.map((t: Instructor) => ({
            ...t,
            demo_video_url: t.demo_video_url || '/default-demo.mp4',
            zoom_link: t.zoom_link || 'https://zoom.us/',
          }));
          setInstructors(tutorsWithDemoVideos);
          const prices = tutorsWithDemoVideos.map(d => d.price || 0);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
        }
      } catch {
        setError('Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  // Filter and sort tutors
  const filtered = instructors
    .filter(inst => !languageFilter || (inst.language || '').toLowerCase() === languageFilter.toLowerCase())
    .filter(inst => !countryFilter || (inst.country || '').toLowerCase() === countryFilter.toLowerCase())
    .filter(inst =>
      (inst.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.language || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(inst => {
      const price = inst.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'priceAsc') return (a.price || 0) - (b.price || 0);
    if (sortOption === 'priceDesc') return (b.price || 0) - (a.price || 0);
    if (sortOption === 'experience') return (b.years_experience || 0) - (a.years_experience || 0);
    return 0;
  });

  const uniqueLanguages = Array.from(new Set(instructors.map(i => i.language).filter(Boolean)));
  const uniqueCountries = Array.from(new Set(instructors.map(i => i.country).filter(Boolean)));

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 flex flex-col lg:flex-row gap-6 animate-pulse h-80">
      <div className="flex-1 flex flex-col sm:flex-row gap-6">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gray-300 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
      <div className="lg:w-72 bg-gray-300 rounded-xl" />
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 md:px-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-teal-600 mb-10">Our Tutors</h1>
        <div className="grid gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!sorted.length) return <div className="text-center mt-10 text-gray-400">No tutors found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 md:px-10">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-teal-600 mb-10">Our Tutors</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-10 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or language..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 placeholder-gray-400 transition"
        />
        <select
          value={languageFilter}
          onChange={e => setLanguageFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-sm w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 transition"
        >
          <option value="">All Languages</option>
          {uniqueLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
        <select
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-sm w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 transition"
        >
          <option value="">All Countries</option>
          {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-sm w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 transition"
        >
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low → High</option>
          <option value="priceDesc">Price: High → Low</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      {/* Price Slider */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <span className="text-gray-700 font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
        <Range
          step={STEP}
          min={Math.min(...instructors.map(i => i.price || 0))}
          max={Math.max(...instructors.map(i => i.price || 0))}
          values={priceRange}
          onChange={values => setPriceRange(values as [number, number])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="w-64 h-2 bg-gray-300 rounded-full relative"
              style={{
                ...props.style,
                background: getTrackBackground({
                  values: priceRange,
                  colors: ['#22d3ee', '#3b82f6', '#22d3ee'],
                  min: Math.min(...instructors.map(i => i.price || 0)),
                  max: Math.max(...instructors.map(i => i.price || 0)),
                }),
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div {...props} className="h-5 w-5 bg-teal-600 rounded-full shadow-md" />
          )}
        />
      </div>

      {/* Tutors List */}
      <div className="flex flex-col gap-8">
        {sorted.map(tutor => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            setOpenDemoVideo={setOpenDemoVideo}
          />
        ))}
      </div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {openDemoVideo && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenDemoVideo(null)}
          >
            <motion.div
              className="bg-white rounded-3xl overflow-hidden w-11/12 md:w-3/4 lg:w-1/2 relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <video src={openDemoVideo} controls autoPlay className="w-full h-auto rounded-3xl object-cover" />
              <button
                onClick={() => setOpenDemoVideo(null)}
                className="absolute top-4 right-4 text-white bg-red-500 px-3 py-1 rounded-full hover:bg-red-600 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced TutorCard Component with demo video on the right
function TutorCard({ tutor, setOpenDemoVideo }: { tutor: Instructor; setOpenDemoVideo: (url: string) => void }) {
  const avatarUrl = tutor.image_url
    ? supabase.storage.from('instructor-images').getPublicUrl(tutor.image_url).data.publicUrl
    : '/default-avatar.png';

  const zoomLink = tutor.zoom_link?.startsWith('zoommtg://')
    ? tutor.zoom_link
    : `zoommtg://zoom.us/join?confno=${tutor.zoom_link?.split('/').pop() || ''}`;

  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        y: -4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-200 hover:border-teal-200 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Main Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full blur-sm opacity-75"></div>
              <img
                src={avatarUrl}
                alt={tutor.name}
                loading="lazy"
                className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
              />
              
              {/* Online Status */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full ring-2 ring-white shadow-md flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              </div>

              {/* Native Speaker Badge */}
              {tutor.is_native && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                  Native Speaker
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{tutor.name}</h3>
                  <p className="text-teal-600 font-medium">{tutor.expertise || 'Language Tutor'}</p>
                </div>
                
                {/* Price Tag */}
                {tutor.price && (
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full shadow-lg mt-2 sm:mt-0">
                    <span className="text-xl font-bold">${tutor.price}</span>
                    <span className="text-sm opacity-90">/hr</span>
                  </div>
                )}
              </div>

              {/* Stats and Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">4.8</span>
                    <span className="text-gray-400">(89 reviews)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tutor.years_experience ? `${tutor.years_experience} years exp` : 'Experience N/A'}</span>
                  </div>
                </div>

                {/* Languages and Location */}
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                  {tutor.language && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-sm">
                      {tutor.language}
                    </span>
                  )}
                  {tutor.country && (
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{tutor.country}</span>
                    </div>
                  )}
                </div>

                {/* Expertise Tags */}
                {tutor.expertise && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {tutor.expertise.split(',').slice(0, 4).map((tag, idx) => (
                      <span key={idx} className="bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Qualifications */}
                {tutor.qualifications && (
                  <p className="text-gray-600 text-sm leading-relaxed">{tutor.qualifications}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href={`/tutors/${tutor.slug}`}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Book a Lesson
                </Link>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/tutors/${tutor.slug}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium text-center transition-all text-sm"
                  >
                    View Profile
                  </Link>

                  <a
                    href={zoomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-xl font-medium text-center transition-all text-sm flex items-center justify-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Join
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Demo Video Section */}
        {tutor.demo_video_url && (
          <div className="lg:w-72 bg-gradient-to-b from-gray-50 to-gray-100 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Introduction Video</h4>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                DEMO
              </span>
            </div>

            {/* Video Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-md cursor-pointer group mb-3" onClick={() => setOpenDemoVideo(tutor.demo_video_url!)}>
              <div className="relative w-full bg-gray-900" style={{ paddingBottom: '60%' }}>
                <video
                  src={tutor.demo_video_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  poster="/video-thumbnail.jpg"
                  preload="metadata"
                />
              </div>

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  className="bg-white/95 hover:bg-white rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-all duration-200"
                  aria-label="Play Demo Video"
                >
                  <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l7-5-7-5z" />
                  </svg>
                </button>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                1:47
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-3">Watch introduction & teaching style</p>

            {/* Additional Info Boxes */}
            <div className="space-y-2 flex-1">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <h5 className="text-xs font-semibold text-gray-600 mb-1">Teaching Style</h5>
                <p className="text-xs text-gray-700">Interactive conversation with practical examples</p>
              </div>

              <div className="bg-white rounded-lg p-2 shadow-sm">
                <h5 className="text-xs font-semibold text-gray-600 mb-1">Next Available</h5>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-700">Today 3:00 PM</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-2 shadow-sm">
                <h5 className="text-xs font-semibold text-gray-600 mb-1">Student Rating</h5>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  <span className="text-xs font-medium text-green-600">96%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator Bar */}
      <div className="h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
    </motion.div>
  );
}