// app/tutors/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Initialize Supabase client (replace env vars as needed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  country?: string | null;
  language?: string | null;
  is_native: boolean;
  expertise?: string | null;
  qualifications?: string | null;
  years_experience?: number | null;
  price?: number | null;
  description?: string | null;
  video_intro_url?: string | null;
  social_links?: string | null;
  slug: string;
  image_url?: string | null;
  rating?: number | null;
  createdAt?: string | null;
}

interface Props {
  params: { slug: string };
}

export default async function InstructorProfilePage({ params }: Props) {
  const { slug } = params;

  // Fetch instructor by slug
  const { data, error } = await supabase
    .from<Instructor>('Instructor')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find an instructor with that profile.</p>
          <a href="/tutors" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse All Tutors
          </a>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    phone_number,
    country,
    language,
    is_native,
    expertise,
    qualifications,
    years_experience,
    price,
    description,
    video_intro_url,
    social_links,
    image_url,
    rating,
    createdAt,
  } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {image_url ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL || ''}/instructor-images/${image_url}`}
                    alt={`${name} profile picture`}
                    width={160}
                    height={160}
                    className="rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-3">{name}</h1>
                <div className="space-y-2 text-blue-100">
                  {expertise && (
                    <p className="text-xl font-medium">{expertise}</p>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-1 md:space-y-0 text-sm">
                    {language && (
                      <span className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                        </svg>
                        {language} {is_native && '(Native)'}
                      </span>
                    )}
                    {country && (
                      <span className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {country}
                      </span>
                    )}
                  </div>
                  {rating !== null && rating !== undefined && (
                    <div className="flex items-center justify-center md:justify-start mt-3">
                      <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                        <svg className="w-5 h-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="font-semibold">{rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              {price !== null && price !== undefined && (
                <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                  <p className="text-blue-100 text-sm uppercase tracking-wide font-medium mb-1">Hourly Rate</p>
                  <p className="text-3xl font-bold text-white">${price.toFixed(0)}</p>
                  <p className="text-blue-100 text-sm">per hour</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {description && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  About Me
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                </div>
              </div>
            )}

            {/* Video Introduction */}
            {video_intro_url && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Video Introduction
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden shadow-inner">
                  <iframe
                    src={video_intro_url}
                    title={`${name} Video Introduction`}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800 font-medium break-all transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                {phone_number && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-900 font-medium">{phone_number}</p>
                    </div>
                  </div>
                )}

                {social_links && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Social</p>
                      {social_links.split(',').map((link, idx) => {
                        const trimmed = link.trim();
                        return (
                          <a
                            key={idx}
                            href={trimmed}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium break-all transition-colors block"
                          >
                            {trimmed.replace(/^https?:\/\//, '')}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Book a Session
                </button>
              </div>
            </div>

            {/* Professional Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Professional Details
              </h3>
              
              <div className="space-y-4">
                {qualifications && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Qualifications</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{qualifications}</p>
                  </div>
                )}
                
                {years_experience !== null && years_experience !== undefined && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Experience</h4>
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">{years_experience}</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {years_experience} {years_experience === 1 ? 'year' : 'years'} of teaching experience
                      </p>
                    </div>
                  </div>
                )}

                {language && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Languages</h4>
                    <div className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      {language} {is_native && '• Native Speaker'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {years_experience || 0}+
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {rating ? rating.toFixed(1) : '5.0'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {createdAt && (
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              Profile created on {new Date(createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}