'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Range, getTrackBackground } from 'react-range';

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
  zoom_meeting_id?: string;
}

export default function TutorsList() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const STEP = 1;

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('Instructor').select('*');

        if (error) {
          setError(`Error fetching tutors: ${error.message}`);
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

    fetchInstructors();
  }, []);

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

  if (loading) return <div className="text-center mt-10 text-gray-400 animate-pulse">Loading tutors...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Our Tutors</h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6 flex-wrap">
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

      {/* Dual Price Range Slider */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <span className="text-gray-700 font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
        <Range
          step={STEP}
          min={Math.min(...instructors.map(i => i.price || 0))}
          max={Math.max(...instructors.map(i => i.price || 0))}
          values={priceRange}
          onChange={values => setPriceRange(values as [number, number])}
          renderTrack={({ props: trackProps, children }) => (
            <div
              {...trackProps}
              className="w-64 h-2 bg-gray-300 rounded-full relative"
              style={{
                ...trackProps.style,
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
          renderThumb={({ props: thumbProps }) => (
            <div
              {...thumbProps}
              className="h-5 w-5 bg-teal-600 rounded-full shadow-md"
            />
          )}
        />
      </div>

      {sorted.length === 0 ? (
        <div className="text-center mt-10 text-gray-400">No tutors found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map(inst => {
            const avatarUrl = inst.image_url
              ? supabase.storage.from('instructor-images').getPublicUrl(inst.image_url).data.publicUrl
              : '/default-avatar.png';

            return (
              <Link
                key={inst.id}
                href={`/tutors/${inst.slug}`}
                className="flex p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition shadow-md gap-4"
              >
                <img
                  src={avatarUrl}
                  alt={inst.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{inst.name}</h2>
                    {inst.expertise && <p className="text-gray-300 text-sm">{inst.expertise}</p>}
                    {inst.qualifications && <p className="text-gray-400 text-xs">{inst.qualifications}</p>}
                    <p className="text-gray-400 text-sm">
                      {inst.years_experience ? `${inst.years_experience} yrs experience` : 'Experience N/A'}
                    </p>
                    {inst.language && (
                      <p className="text-gray-400 text-sm">
                        Language: {inst.language} {inst.is_native && <span className="px-1 bg-green-600 text-white rounded-full text-xs">Native</span>}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex gap-4 items-center">
                    {inst.price && <p className="text-gray-200 font-semibold text-sm">${inst.price}/hr</p>}
                    {inst.country && <p className="text-gray-400 text-xs">{inst.country}</p>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}