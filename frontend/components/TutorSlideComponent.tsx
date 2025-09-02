//app/components/TutorSlideComponent.tsx


// components/TutorSlideComponent.tsx
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Instructor {
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
}

export const TutorSlideComponent = ({ tutor }: { tutor: Instructor }) => {
  const tutorAvatarUrl = tutor.image_url
    ? supabase.storage.from('instructor-images').getPublicUrl(tutor.image_url).data.publicUrl
    : '/default-avatar.png';

  return (
    <div className="relative bg-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-lg">
      <Link href={`/tutors/${tutor.slug}`}>
        <img
          src={tutorAvatarUrl}
          alt={tutor.name}
          className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-teal-600 shadow-lg"
        />
      </Link>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900">{tutor.name}</h3>
        {tutor.expertise && <p className="text-gray-700 mt-1 sm:mt-2">{tutor.expertise}</p>}
        {tutor.qualifications && <p className="text-gray-500 text-sm mt-1">{tutor.qualifications}</p>}
        <p className="text-gray-500 mt-1 sm:mt-2">
          {tutor.years_experience ? `${tutor.years_experience} years experience` : 'Experience N/A'} |{' '}
          {tutor.language ? `Language: ${tutor.language}` : ''} {tutor.is_native ? '(Native)' : ''}
        </p>
        {tutor.price && <p className="text-teal-600 font-semibold mt-1 sm:mt-2">${tutor.price}/hr</p>}
        {tutor.country && <p className="text-gray-400 text-sm mt-1">{tutor.country}</p>}
      </div>
    </div>
  );
};
