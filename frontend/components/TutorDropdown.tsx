//app/components/TutorDropdown.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Instructor {
  id: string;
  name: string;
  slug: string;
}

export default function TutorDropdown() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data, error } = await supabase
        .from('Instructor')
        .select('id, name, slug')
        .order('name', { ascending: true });

      if (!error && data) {
        setInstructors(data);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Browse Tutors
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-72 overflow-y-auto">
          <div className="py-1">
            {instructors.map((instructor) => (
              <Link
                key={instructor.id}
                href={`/tutors/${instructor.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {instructor.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
