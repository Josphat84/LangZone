'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import InteractiveBookingCalendar from './InteractiveBookingCalendar';
import {
  FaEnvelope,
  FaPhone,
  FaStar,
  FaVideo,
  FaHeart,
  FaComment,
  FaPaypal,
  FaMoneyBillWave,
  FaInfoCircle
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Instructor {
  id: string;
  name: string;
  email: string;
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
  image_url?: string;
  zoom_meeting_id?: string; 
  createdAt?: string;
}

export default function TutorPage() {
  const { slug } = useParams();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('Instructor')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) {
          setError(`Failed to load instructor profile: ${fetchError.message}`);
          return;
        }

        if (data) {
          setInstructor(data);
          if (data.image_url) {
            const { data: publicUrlData } = supabase.storage
              .from('instructor-images')
              .getPublicUrl(data.image_url);
            setAvatarUrl(publicUrlData.publicUrl);
          }
        } else {
          setError('No instructor found with this slug');
        }
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchInstructor();
  }, [slug]);

  const handleLike = () => {
    setLikes(prev => userLiked ? prev - 1 : prev + 1);
    setUserLiked(prev => !prev);
  };

  const handleRating = (value: number) => {
    setRating(value);
  };

  const zoomUrl = instructor?.zoom_meeting_id
    ? `zoommtg://zoom.us/join?confno=${instructor.zoom_meeting_id}`
    : 'https://zoom.us/';

  if (loading) return <div className="text-center mt-20 text-gray-400 animate-pulse text-lg">Loading profile...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-lg">{error}</div>;
  if (!instructor) return <div className="text-center mt-20 text-gray-400 text-lg">Instructor not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 p-6 rounded-xl shadow-lg text-center">
            <img
              src={avatarUrl || '/default-avatar.png'}
              alt={instructor.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white">{instructor.name}</h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-lg ${userLiked ? 'text-red-400' : 'text-gray-200'} hover:text-red-500 transition`}
              >
                <FaHeart /> {likes}
              </button>
              <div className="flex items-center gap-1 text-yellow-400">
                {[1,2,3,4,5].map((i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer ${i <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                    onClick={() => handleRating(i)}
                  />
                ))}
              </div>
            </div>
            {instructor.price && <p className="text-white text-lg mt-2">${instructor.price}/hr</p>}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-2">
            <h2 className="text-xl font-bold">About</h2>
            <p className="text-gray-300">{instructor.description || 'No bio available yet.'}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-2">
            <h2 className="text-xl font-bold">Professional Info</h2>
            {instructor.expertise && <p><span className="font-semibold">Expertise:</span> {instructor.expertise}</p>}
            {instructor.years_experience && <p><span className="font-semibold">Experience:</span> {instructor.years_experience} years</p>}
            {instructor.qualifications && <p><span className="font-semibold">Qualifications:</span> {instructor.qualifications}</p>}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-2">
            <h2 className="text-xl font-bold">Languages & Location</h2>
            {instructor.language && <p><span className="font-semibold">Language:</span> {instructor.language} {instructor.is_native && <span className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded-full">Native</span>}</p>}
            {instructor.country && <p><span className="font-semibold">Country:</span> {instructor.country}</p>}
          </div>
        </div>

        {/* Center Content */}
        <div className="md:col-span-5 space-y-6">
          {/* Calendar */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-md relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Schedule a Lesson</h2>
            {showCalendar && (
              <InteractiveBookingCalendar tutorId={instructor.id} isTutor={false} />
            )}
          </div>

          {/* Reviews & Comments */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold mb-3">Reviews & Comments</h2>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 rounded-lg bg-gray-900 text-white outline-none"
              />
              <button
                onClick={() => {}}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition"
              >
                <FaComment />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-4 space-y-6">
          {/* Demo Video with Tooltip */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-md relative">
            <h2 className="text-xl font-bold text-center mb-2 flex items-center justify-center gap-2">
              Demo Video <FaInfoCircle data-tooltip-id="demo-tooltip" className="cursor-pointer text-gray-400 hover:text-white" />
            </h2>
            <Tooltip id="demo-tooltip" place="top" effect="solid">
              {`Likes: ${likes} | Rating: ${rating}/5 | Expertise: ${instructor.expertise || 'N/A'} | Experience: ${instructor.years_experience || 'N/A'} yrs`}
            </Tooltip>
            {instructor.video_intro_url ? (
              <video
                src={instructor.video_intro_url}
                controls
                className="w-full h-[400px] rounded-xl object-cover"
              />
            ) : (
              <p className="text-gray-400 text-center">No demo video uploaded yet.</p>
            )}
          </div>

          {/* Payment & Zoom Links */}
          <div className="flex flex-col gap-4">
            <a
              href="https://www.paypal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-500 transition flex items-center justify-center gap-2"
            >
              <FaPaypal /> PayPal
            </a>
            <a
              href="https://wise.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-green-500 transition flex items-center justify-center gap-2"
            >
              <FaMoneyBillWave /> Wise
            </a>
            <a
              href={zoomUrl}
              className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-purple-500 transition flex items-center justify-center gap-2"
            >
              <FaVideo /> Zoom
            </a>
          </div>

          {/* Book Lesson */}
          <button
            onClick={() => setShowCalendar(true)}
            className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition w-full mt-4"
          >
            Book a Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
