'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import InteractiveBookingCalendar from './InteractiveBookingCalendar';
import {
  FaEnvelope, FaPhone, FaStar, FaGlobe, FaLinkedin, FaInstagram,
  FaVideo
} from 'react-icons/fa';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Tutor {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  email: string;
  phone?: string;
  rating?: number;
  hourly_rate?: number;
  languages?: string[];
  linkedin?: string;
  instagram?: string;
  website?: string;
  slug?: string;
  zoom_link?: string;
}

export default function TutorPage() {
  const { slug } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('Instructor')
          .select('*')
          .eq('slug', slug)
          .single();
        if (fetchError) {
          setError('Failed to load tutor profile');
          return;
        }
        if (data) setTutor(data);
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [slug]);

  if (loading) return <div className="text-center mt-10 text-gray-400 animate-pulse">Loading profile...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!tutor) return <div className="text-center mt-10 text-gray-400">Tutor not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-white text-2xl md:text-3xl font-bold truncate">
            {tutor.name}'s Profile
          </h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-6 py-8 bg-gray-800 rounded-xl shadow-lg mt-6 space-y-6">
        {/* Top Row: Avatar & Info */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={tutor.avatar_url || '/default-avatar.png'}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold break-words">{tutor.name}</h2>
            {tutor.rating && (
              <div className="flex items-center mt-1 text-yellow-400">
                <FaStar className="mr-1" /> {tutor.rating}
              </div>
            )}
            {tutor.hourly_rate && (
              <p className="text-teal-400 text-xl md:text-2xl font-semibold mt-2">${tutor.hourly_rate}/hr</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {tutor.bio && (
          <div className="whitespace-pre-wrap text-gray-300">{tutor.bio}</div>
        )}

        {/* Languages */}
        {tutor.languages && tutor.languages.length > 0 && (
          <p className="text-gray-400"><strong>Languages:</strong> {tutor.languages.join(', ')}</p>
        )}

        {/* Contact & Social Links */}
        <div className="flex flex-wrap gap-4 mt-4 text-gray-400">
          {tutor.email && <a href={`mailto:${tutor.email}`} className="flex items-center gap-2 hover:text-teal-400"><FaEnvelope /> Email</a>}
          {tutor.phone && <a href={`tel:${tutor.phone}`} className="flex items-center gap-2 hover:text-teal-400"><FaPhone /> Phone</a>}
          {tutor.linkedin && <a href={tutor.linkedin} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-teal-400"><FaLinkedin /> LinkedIn</a>}
          {tutor.instagram && <a href={tutor.instagram} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-teal-400"><FaInstagram /> Instagram</a>}
          {tutor.website && <a href={tutor.website} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-teal-400"><FaGlobe /> Website</a>}
          {tutor.zoom_link && <a href={tutor.zoom_link} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-blue-400"><FaVideo /> Zoom Call</a>}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={() => setShowCalendar(prev => !prev)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            {showCalendar ? 'Hide Calendar' : 'Book a Lesson'}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200">
            Message Tutor
          </button>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <div className="mt-6 bg-gray-700 rounded-lg p-4 shadow-inner relative">
            <InteractiveBookingCalendar tutorId={tutor.id} isTutor={false} />
          </div>
        )}
      </div>
    </div>
  );
}
