'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Instructor {
  id: string;
  name: string;
  slug: string;
}

export default function Header() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data, error } = await supabase
        .from('Instructor')
        .select('id, name, slug')
        .order('name', { ascending: true });

      if (!error && data) setInstructors(data);
    };
    fetchInstructors();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClasses =
    "relative hover:text-teal-200 hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full";

  const desktopDropdownBase =
    "absolute mt-3 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto " +
    "opacity-0 scale-95 translate-y-1 transition-all duration-200 ease-out";

  const dropdownItemClasses =
    "block px-4 py-2 text-gray-700 rounded-md transition-all duration-200 hover:bg-teal-50 hover:text-teal-700 hover:shadow-[0_0_12px_rgba(0,0,0,0.15)] hover:scale-[1.02]";

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-600/80 to-teal-500/80 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Site Name with Glow Animation */}
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:text-teal-200 transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,255,255,0.7)] hover:animate-pulse-slow"
        >
          LangZone
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`${linkClasses} font-medium flex items-center`}
            >
              Find Instructors
              <svg
                className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180 scale-110 hover:shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'rotate-0 scale-100 hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className={`${desktopDropdownBase} opacity-100 scale-105 translate-y-0 animate-bounce-in`}>
                {instructors.length > 0 ? (
                  instructors.map((instructor) => (
                    <Link
                      key={instructor.id}
                      href={`/tutors/${instructor.slug}`}
                      className={dropdownItemClasses}
                    >
                      {instructor.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Loading...</div>
                )}
              </div>
            )}
          </div>

          <Link href="/create-new-profile" className={linkClasses + " font-medium"}>
            Become an Instructor
          </Link>
          <Link href="/help-center" className={linkClasses + " font-medium"}>
            Help Center
          </Link>
          <Link href="/blog" className={linkClasses + " font-medium"}>
            Blog
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden hover:text-teal-200 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation with Slide Down Animation */}
      <div
        className={`md:hidden bg-teal-600/90 backdrop-blur-lg border-t border-white/10 shadow-sm overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
          isMenuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-3">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-teal-200 font-medium text-left relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200"
          >
            Find Instructors
            <svg
              className={`ml-1 inline h-4 w-4 transform transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180 scale-110 hover:shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'rotate-0 scale-100 hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
              isDropdownOpen ? 'max-h-72 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
            }`}
          >
            {instructors.length > 0 ? (
              instructors.map((instructor) => (
                <Link
                  key={instructor.id}
                  href={`/tutors/${instructor.slug}`}
                  className="block px-3 py-2 text-gray-700 rounded-md transition-all duration-200 hover:bg-teal-100 hover:shadow-[0_0_12px_rgba(0,0,0,0.15)] hover:text-teal-700 hover:scale-[1.02]"
                >
                  {instructor.name}
                </Link>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">Loading...</div>
            )}
          </div>
          <Link
            href="/create-new-profile"
            className="text-white hover:text-teal-200 font-medium relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200"
          >
            Become an Instructor
          </Link>
          <Link
            href="/help-center"
            className="text-white hover:text-teal-200 font-medium relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200"
          >
            Help Center
          </Link>
          <Link
            href="/blog"
            className="text-white hover:text-teal-200 font-medium relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
