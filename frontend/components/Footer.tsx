'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
// Removed old translation context - using Google Translate instead
// import { useTranslation } from '@/app/context/TranslationContext';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaWhatsapp, 
  FaLinkedinIn 
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // ✅ official X logo
import { SiZoom } from 'react-icons/si';

export default function Footer() {
  // Removed old translation system - using Google Translate now
  // const { t, lang, availableLanguages, setLang } = useTranslation();

  // Zoom app + fallback
  const openZoom = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'zoomus://zoom.us'; // Try Zoom app
    setTimeout(() => {
      window.open('https://zoom.us', '_blank'); // Fallback web
    }, 500);
  };

  return (
    <footer className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand & Socials */}
          <div className="lg:col-span-2">
            <h6 className="font-bold text-3xl mb-4">LangZone</h6>
            <p className="text-teal-200 text-sm mb-6 max-w-xs">Connect with language instructors worldwide and master new languages through personalized learning experiences.</p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] transition-transform duration-300 transform hover:scale-110 shadow-lg"
              >
                <FaFacebookF className="text-white text-xl" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF0000] transition-transform duration-300 transform hover:scale-110 shadow-lg"
              >
                <FaYoutube className="text-white text-xl" />
              </a>

              {/* WhatsApp ✅ refined official look */}
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] transition-transform duration-300 transform hover:scale-110 shadow-lg"
              >
                <FaWhatsapp className="text-white text-xl" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A66C2] transition-transform duration-300 transform hover:scale-110 shadow-lg"
              >
                <FaLinkedinIn className="text-white text-xl" />
              </a>

              {/* Instagram official gradient */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-transform duration-300 transform hover:scale-110 shadow-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
              >
                <FaInstagram className="text-white text-xl" />
              </a>

              {/* X (Twitter → X) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black transition-transform duration-300 transform hover:scale-110 shadow-lg"
              >
                <FaXTwitter className="text-white text-xl" />
              </a>

              {/* Zoom */}
              <button
                onClick={openZoom}
                aria-label="Zoom"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2D8CFF] transition-transform duration-300 transform hover:scale-110 shadow-lg"
              >
                <SiZoom className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h6 className="font-semibold text-lg mb-4">Learn</h6>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/learning-guides" className="hover:text-teal-400 transition-colors">Learning Guides</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-teal-400 transition-colors">Courses</Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-teal-400 transition-colors">Resources</Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-teal-400 transition-colors">Practice Exercises</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h6 className="font-semibold text-lg mb-4">Company</h6>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about-us" className="hover:text-teal-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-teal-400 transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-teal-400 transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-teal-400 transition-colors">Sitemap</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h6 className="font-semibold text-lg mb-4">Support</h6>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="hover:text-teal-400 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-teal-400 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/help-center" className="hover:text-teal-400 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Bottom Bar */}
        <div className="mt-16">
          <Separator className="bg-white/20 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-xl mb-1">Stay Updated</h3>
              <p className="text-sm text-teal-200">Subscribe to our newsletter for the latest updates and language learning tips.</p>
            </div>
            <form className="flex w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="rounded-full rounded-r-none text-gray-800 w-full md:w-72 border-none px-4 py-3 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
                required 
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white rounded-full rounded-l-none px-6 py-3 shadow-md hover:shadow-lg transition-all"
              >
                Subscribe
              </Button>
            </form>
          </div>
          
          <Separator className="bg-white/20 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-teal-300">
            <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} LangZone. All rights reserved.</p>
            {/* Removed old language switcher - Google Translate in header handles all translation now */}
            <div className="text-teal-200">
              <p>Use the translate button in the header to view this page in other languages</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}