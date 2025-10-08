'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaLinkedinIn,
  FaUserShield,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiZoom } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion'; // <-- added for animation

export default function Footer() {
  const newsletterRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [glowVisible, setGlowVisible] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!glowVisible) setGlowVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (newsletterRef.current) observer.observe(newsletterRef.current);
    return () => observer.disconnect();
  }, [glowVisible]);

  const socialLinks = [
    { href: 'https://facebook.com', icon: <FaFacebookF />, label: 'Facebook', color: '#1877F2' },
    { href: 'https://youtube.com', icon: <FaYoutube />, label: 'YouTube', color: '#FF0000' },
    { href: 'https://wa.me/1234567890', icon: <FaWhatsapp />, label: 'WhatsApp', color: '#25D366' },
    { href: 'https://linkedin.com', icon: <FaLinkedinIn />, label: 'LinkedIn', color: '#0A66C2' },
    {
      href: 'https://instagram.com',
      icon: <FaInstagram />,
      label: 'Instagram',
      color: 'conic-gradient(from 45deg at 50% 50%, #F58529, #DD2A7B, #8134AF, #515BD4, #F58529)',
    },
    { href: 'https://x.com', icon: <FaXTwitter />, label: 'X', color: '#000000' },
    { href: 'zoomus://zoom.us', icon: <SiZoom />, label: 'Zoom', color: '#2D8CFF', isZoom: true },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white antialiased overflow-hidden">
      <div className="container mx-auto px-6 pt-20 pb-12 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-16">
          {/* Brand & Socials */}
          <div className="lg:col-span-2 relative z-20">
            <h6 className="font-light text-3xl mb-4 tracking-tight leading-tight">LangZone</h6>
            <p className="text-teal-200 text-sm mb-6 max-w-xs leading-relaxed">
              Connect with language instructors worldwide and master new languages through personalized learning experiences.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 relative z-20">
              {socialLinks.map(({ href, icon, label, color, isZoom }) => (
                <div key={label} className="relative group">
                  {glowVisible && (
                    <span
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: color,
                        filter: 'blur(14px)',
                        opacity: 0.25,
                        transition: 'opacity 1.5s ease-out',
                        zIndex: -1,
                      }}
                    />
                  )}

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={(e) => {
                      if (isZoom) {
                        e.preventDefault();
                        window.location.href = 'zoomus://zoom.us';
                        setTimeout(() => {
                          window.open('https://zoom.us', '_blank');
                        }, 500);
                      }
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full
                               transform transition-all duration-500 hover:scale-110"
                    style={{
                      background: label === 'Instagram' ? color : undefined,
                      backgroundColor: label !== 'Instagram' ? color : undefined,
                      border: 'none',
                      boxShadow: `
                        0 4px 6px rgba(0,0,0,0.3),
                        0 8px 15px rgba(0,0,0,0.25),
                        0 12px 25px rgba(0,0,0,0.2),
                        0 18px 40px rgba(0,0,0,0.15)
                      `,
                    }}
                  >
                    <span
                      className="text-white text-sm sm:text-base relative z-10"
                      style={{
                        textShadow: '0 0 1px rgba(0,0,0,0.2)',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      {icon}
                    </span>
                  </a>

                  <span
                    className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-40 transition-all duration-500"
                    style={{
                      boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                      transform: 'translateY(2px)',
                      zIndex: -1,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h6 className="font-normal text-lg mb-4 tracking-tight leading-snug">Learn</h6>
            <ul className="space-y-2 text-teal-200 text-sm leading-relaxed">
              <li><Link href="/learning-guides" className="hover:text-white transition-colors">Learning Guides</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link href="/ai-practice-tools" className="hover:text-white transition-colors">Practice Exercises</Link></li>
              <li><Link href="/kids" className="hover:text-white transition-colors">Kids Activities</Link></li>
              <li><Link href='/community' className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h6 className="font-normal text-lg mb-4 tracking-tight leading-snug">Company</h6>
            <ul className="space-y-2 text-teal-200 text-sm leading-relaxed">
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link></li>

              {/* Admin Dropdown */}
              <li
                className="relative"
                onMouseEnter={() => setAdminDropdownOpen(true)}
                onMouseLeave={() => setAdminDropdownOpen(false)}
              >
                <button
                  onClick={() => setAdminDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-orange-400 font-bold text-2xl hover:text-orange-300 transition-colors focus:outline-none"
                >
                  <FaUserShield className="h-5 w-5" />
                  Admin
                </button>

                <AnimatePresence>
                  {adminDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 bg-teal-900 border border-teal-700 rounded-md shadow-lg z-50"
                    >
                      <li>
                        <Link
                          href="/admin/search-analytics"
                          className="block px-4 py-2 text-teal-200 hover:bg-teal-800 hover:text-white transition-colors"
                        >
                          Search Analytics
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/feedback"
                          className="block px-4 py-2 text-teal-200 hover:bg-teal-800 hover:text-white transition-colors"
                        >
                          Feedback
                        </Link>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h6 className="font-normal text-lg mb-4 tracking-tight leading-snug">Support</h6>
            <ul className="space-y-2 text-teal-200 text-sm leading-relaxed">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div
          ref={newsletterRef}
          className={`mt-16 sm:mt-20 transition-all duration-700 ease-out transform ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <Separator className="bg-white/20 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <h3 className="font-normal text-xl mb-2 tracking-tight leading-snug">Stay Updated</h3>
              <p className="text-teal-200 text-sm leading-relaxed">
                Subscribe to our newsletter for the latest updates and language learning tips.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row w-full md:w-auto gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-full rounded-r-none text-black w-full sm:w-72 border-none px-4 py-3 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none font-normal tracking-normal"
                required
              />
              <Button
                type="submit"
                className="bg-teal-600 text-white hover:bg-teal-500 rounded-full rounded-l-none px-6 py-3 shadow-md font-normal tracking-normal"
              >
                Subscribe
              </Button>
            </form>
          </div>

          <Separator className="bg-white/20 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-teal-200 leading-relaxed gap-2 md:gap-0 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Software Inc. All rights reserved.</p>
            <p>Use the translate button in the header to view this page in other languages</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
