// app/tutors/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import ClientFeatures from './ClientFeatures';

// Initialize Supabase client
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
    .from('Instructor')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Instructor Not Found</h2>
          <p className="text-white/80 mb-8 leading-relaxed">We couldn't find an instructor with that profile. Let's get you back to our amazing tutors.</p>
          <a href="/tutors" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse All Tutors
          </a>
        </div>
      </div>
    );
  }

  const instructor = data as Instructor;
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
  } = instructor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-12 hover:shadow-3xl transition-all duration-500">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-16 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full"></div>
              </div>
              
                              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10">
                {/* Enhanced Profile Image */}
                <div className="flex-shrink-0 relative group">
                  {image_url ? (
                    <div className="relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL || ''}/instructor-images/${image_url}`}
                        alt={`${name} profile picture`}
                        width={160}
                        height={160}
                        className="rounded-3xl object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-violet-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-white border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                  
                  {/* Online status indicator */}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg animate-pulse">
                    <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-30"></div>
                  </div>
                </div>

                {/* Enhanced Profile Info */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{name}</h1>
                    {expertise && (
                      <p className="text-lg font-medium text-blue-100 mb-3">{expertise}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-3 md:space-y-0">
                    {language && (
                      <div className="flex items-center justify-center md:justify-start bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                        </svg>
                        <span className="font-medium">{language} {is_native && '(Native)'}</span>
                      </div>
                    )}
                    {country && (
                      <div className="flex items-center justify-center md:justify-start bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span className="font-medium">{country}</span>
                      </div>
                    )}
                  </div>

                  {rating !== null && rating !== undefined && (
                    <div className="flex items-center justify-center md:justify-start">
                      <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-6 py-3 shadow-lg">
                        <div className="flex items-center space-x-1 mr-3">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-white' : 'text-white/40'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="font-bold text-white text-lg">{rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Pricing */}
                {price !== null && price !== undefined && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/30 shadow-xl">
                    <div className="mb-2">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <p className="text-blue-100 text-sm uppercase tracking-wider font-medium mb-2">Hourly Rate</p>
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">${price.toFixed(0)}</p>
                    <p className="text-blue-100 text-sm">per session</p>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-semibold">Best Value</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Enhanced About Section */}
              {description && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    About Me
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">{description}</p>
                  </div>
                </div>
              )}

              {/* Enhanced Video Introduction */}
              {video_intro_url && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    Video Introduction
                  </h2>
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 hover:border-purple-200 transition-colors duration-300">
                    <iframe
                      src={video_intro_url}
                      title={`${name} Video Introduction`}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Professional Details Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  Professional Details
                </h3>
                
                <div className="space-y-6">
                  {qualifications && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                          </svg>
                        </div>
                        Qualifications
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{qualifications}</p>
                    </div>
                  )}
                  
                  {years_experience !== null && years_experience !== undefined && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        Experience
                      </h4>
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-12 h-12 flex items-center justify-center mr-4 shadow-lg">
                          <span className="text-white font-bold text-lg">{years_experience}</span>
                        </div>
                        <p className="text-gray-700">
                          {years_experience} {years_experience === 1 ? 'year' : 'years'} of professional teaching experience
                        </p>
                      </div>
                    </div>
                  )}

                  {language && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                          </svg>
                        </div>
                        Languages
                      </h4>
                      <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-medium shadow-lg">
                        {language} {is_native && '• Native Speaker'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Interactive Features */}
            <div className="xl:col-span-1 space-y-8">
              {/* Enhanced Contact Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2 font-medium">Email Address</p>
                      <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800 font-medium break-all transition-colors duration-200 hover:underline">
                        {email}
                      </a>
                    </div>
                  </div>

                  {phone_number && (
                    <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-all duration-200">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2 font-medium">Phone Number</p>
                        <p className="text-gray-900 font-medium">{phone_number}</p>
                      </div>
                    </div>
                  )}

                  {social_links && (
                    <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-md transition-all duration-200">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2 font-medium">Social Links</p>
                        <div className="space-y-2">
                          {social_links.split(',').map((link, idx) => {
                            const trimmed = link.trim();
                            return (
                              <a
                                key={idx}
                                href={trimmed}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 font-medium break-all transition-colors duration-200 hover:underline block"
                              >
                                {trimmed.replace(/^https?:\/\//, '')}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Contact Button */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Book a Session
                    </span>
                  </button>
                </div>
              </div>

              {/* Enhanced Quick Stats Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                  </div>
                  Quick Stats
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl font-bold text-white mb-2">
                      {years_experience || 0}+
                    </div>
                    <div className="text-blue-100 font-medium">Years Experience</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl font-bold text-white mb-2">
                      {rating ? rating.toFixed(1) : '5.0'}
                    </div>
                    <div className="text-green-100 font-medium">Rating</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl font-bold text-white mb-2">
                      24/7
                    </div>
                    <div className="text-purple-100 font-medium">Available</div>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  Achievements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800 text-center">Verified Tutor</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800 text-center">Top Rated</span>
                  </div>
                  {is_native && (
                    <div className="col-span-2 flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800 text-center">Native Speaker</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Features */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
                <ClientFeatures instructor={instructor} />
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          {createdAt && (
            <div className="text-center mt-16">
              <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-lg">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 font-medium">
                  Profile created on {new Date(createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}