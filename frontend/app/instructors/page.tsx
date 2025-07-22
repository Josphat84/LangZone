// Instructors Page
// This page lists all instructors and allows for searching and filtering.
//app/instructors/page.tsx

// app/instructors/page.tsx
'use client';

import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Instructor {
  id: string;
  name: string;
  email: string;
  language: string;
  expertise: string;
  price: number;
  description: string;
  country: string;
  is_native: boolean;
  image_url: string | null;
  createdAt: string;
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Instructor')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching instructors:', error);
        setError('Failed to load instructors');
        return;
      }

      setInstructors(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    const { data } = supabase.storage
      .from('instructor-images')
      .getPublicUrl(imagePath);
    return data.publicUrl;
  };

  // Filter instructors based on search term and language
  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = !languageFilter || instructor.language === languageFilter;
    
    return matchesSearch && matchesLanguage;
  });

  // Get unique languages for filter
  const availableLanguages = [...new Set(instructors.map(i => i.language))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading instructors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchInstructors}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Language Instructors</h1>
              <p className="mt-1 text-gray-600">
                Find your perfect language teacher ({filteredInstructors.length} instructor{filteredInstructors.length !== 1 ? 's' : ''})
              </p>
            </div>
            <Link
              href="/create-new-profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Become an Instructor
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, expertise, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <label htmlFor="language-filter" className="sr-only">
              Filter by language
            </label>
            <select
              id="language-filter"
              aria-label="Filter by language"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Languages</option>
              {availableLanguages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Instructors Grid */}
        {filteredInstructors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {instructors.length === 0 ? 'No instructors found.' : 'No instructors match your search criteria.'}
            </p>
            {instructors.length === 0 && (
              <Link
                href="/create-new-profile"
                className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Be the First Instructor
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map((instructor) => (
              <div key={instructor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Profile Image */}
                <div className="h-48 bg-gray-200 relative">
                  {instructor.image_url ? (
                    <img
                      src={getImageUrl(instructor.image_url) || ''}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <div className="text-blue-600 text-4xl font-bold">
                        {instructor.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  {instructor.is_native && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Native
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{instructor.name}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">${instructor.price}/hr</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {instructor.language}
                    </span>
                    <span className="text-gray-500 text-sm">• {instructor.country}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{instructor.expertise}</p>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {instructor.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      Joined {new Date(instructor.createdAt).toLocaleDateString()}
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}