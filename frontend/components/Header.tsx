// frontend/components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-teal-700">
            <Image src="/icons/logo-icon.svg" alt="App Logo" width={28} height={28} />
            <span>LangZone</span>
          </Link>
          <nav className="hidden md:flex space-x-5">
            <Link href="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Find Instructors</Link>
            <Link href="/enterprise" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Enterprise Solutions</Link>
            <Link href="/courses" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Courses</Link>
            <Link href="/create-new-profile" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Become an Instructor</Link>
            <Link href="/about-us" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">About Us</Link>
            <Link href="/contact" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Contact Us</Link>
            <Link href="/help-center" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Help Center</Link>
            <Link href="/blog" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Blog</Link>
            <Link href="/learning-guides" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Learning Guides</Link> {/* New Link */}
          </nav>
        </div>
        <div className="flex items-center space-x-5">
          <Link href="/rewards" className="text-gray-600 hover:text-teal-600 transition-colors hidden sm:block">Rewards</Link>
          <div className="relative">
            <select
              className="border border-gray-200 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none bg-white pr-8"
              aria-label="Language and Currency"
            >
              <option>English ($USD)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
            </div>
          </div>
          <Link href="/saved-instructors" className="text-gray-600 hover:text-red-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </Link>
          <Link href="/alerts" className="text-gray-600 hover:text-teal-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </Link>
          <button className="bg-teal-600 text-white py-2 px-5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md">Sign In</button>
        </div>
      </div>
    </header>
  );
}