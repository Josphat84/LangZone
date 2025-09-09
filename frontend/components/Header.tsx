//frontend/components/Header.tsx  

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ChevronDown, Menu } from 'lucide-react';

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

  const linkClasses =
    "relative hover:text-teal-200 hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full font-medium";

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
          No Name Yet
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className={`${linkClasses} flex items-center`}>
                Find Instructors
                <ChevronDown 
                  className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
                  }`}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto mt-3"
            >
              {instructors.length > 0 ? (
                instructors.map((instructor) => (
                  <DropdownMenuItem key={instructor.id} asChild className="p-0">
                    <Link
                      href={`/tutors/${instructor.slug}`}
                      className={dropdownItemClasses}
                    >
                      {instructor.name}
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/create-new-profile" className={linkClasses}>
            Become an Instructor
          </Link>
          <Link href="/help-center" className={linkClasses}>
            Help Center
          </Link>
          <Link href="/blog" className={linkClasses}>
            Blog
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="hover:text-teal-200 focus:outline-none text-white">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="bg-teal-600/90 backdrop-blur-lg border-l border-white/10 w-[85%] sm:w-[400px] p-0"
          >
            <div className="flex flex-col p-4 space-y-3">
              <div className="flex justify-between items-center mb-4">
                <Link
                  href="/"
                  className="text-xl font-bold text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  No Name Yet
                </Link>
                <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <span className="text-white">Close</span>
                </SheetClose>
              </div>
              
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white hover:text-teal-200 font-medium text-left relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200 flex items-center"
              >
                Find Instructors
                <ChevronDown 
                  className={`ml-1 h-4 w-4 transform transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
                  }`}
                />
              </button>
              
              <div
                className={`ml-4 overflow-hidden transition-[max-height] duration-300 ease-out ${
                  isDropdownOpen ? 'max-h-72' : 'max-h-0'
                }`}
              >
                {instructors.length > 0 ? (
                  instructors.map((instructor) => (
                    <SheetClose asChild key={instructor.id}>
                      <Link
                        href={`/tutors/${instructor.slug}`}
                        className="block px-3 py-2 text-gray-700 rounded-md transition-all duration-200 hover:bg-teal-100 hover:shadow-[0_0_12px_rgba(0,0,0,0.15)] hover:text-teal-700"
                      >
                        {instructor.name}
                      </Link>
                    </SheetClose>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">Loading...</div>
                )}
              </div>
              
              <SheetClose asChild>
                <Link
                  href="/create-new-profile"
                  className="text-white hover:text-teal-200 font-medium relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200"
                >
                  Become an Instructor
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link
                  href="/help-center"
                  className="text-white hover:text-teal-200 font-medium relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200"
                >
                  Help Center
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link
                  href="/blog"
                  className="text-white hover:text-teal-200 font-medium relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all hover:before:w-full hover:shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-200"
                >
                  Blog
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}