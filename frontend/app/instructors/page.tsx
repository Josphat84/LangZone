'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Range, getTrackBackground } from 'react-range';
import { motion } from 'framer-motion';

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
}

export default function TutorsList() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setInstructors(data);
          const prices = data.map(d => d.price || 0);
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
    <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 md:gap-8 animate-pulse h-60">
      <div className="w-40 h-40 rounded-full bg-gray-300" />
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-4 bg-gray-300 rounded w-1/4" />
        <div className="h-4 bg-gray-300 rounded w-1/6" />
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen py-10 px-4 sm:px-6 md:px-10 grid gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
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
        {sorted.map(tutor => {
          const avatarUrl = tutor.image_url
            ? supabase.storage.from('instructor-images').getPublicUrl(tutor.image_url).data.publicUrl
            : '/default-avatar.png';

          return (
            <Link key={tutor.id} href={`/tutors/${tutor.slug}`} className="w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-lg w-full cursor-pointer transition"
              >
                <img
                  src={avatarUrl}
                  alt={tutor.name}
                  loading="lazy"
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-teal-600 shadow flex-shrink-0"
                />
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{tutor.name}</h3>
                  {tutor.expertise && (
                    <p className="text-gray-700 mt-1 sm:mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                      {tutor.expertise.split(',').map((tag, idx) => (
                        <span key={idx} className="inline-block bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">{tag.trim()}</span>
                      ))}
                    </p>
                  )}
                  {tutor.qualifications && <p className="text-gray-500 text-sm">{tutor.qualifications}</p>}
                  <p className="text-gray-500">{tutor.years_experience ? `${tutor.years_experience} years experience` : 'Experience N/A'}</p>
                  {tutor.language && (
                    <p className="text-gray-500">
                      Language: {tutor.language} {tutor.is_native && <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">Native</span>}
                    </p>
                  )}
                  {tutor.price && <p className="text-teal-600 font-semibold text-lg">${tutor.price}/hr</p>}
                  {tutor.country && <p className="text-gray-400 text-sm">{tutor.country}</p>}
                  <span className="inline-block mt-3 px-6 py-2 bg-teal-600 text-white rounded-xl shadow hover:bg-teal-500 transition">View Profile</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
