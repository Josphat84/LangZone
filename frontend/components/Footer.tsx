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

export default function Footer() {
  const newsletterRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.3 }
    );

    if (newsletterRef.current) observer.observe(newsletterRef.current);
    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { href: 'https://facebook.com', icon: <FaFacebookF />, bg: '#1877F2', label: 'Facebook' },
    { href: 'https://youtube.com', icon: <FaYoutube />, bg: '#FF0000', label: 'YouTube' },
    { href: 'https://wa.me/1234567890', icon: <FaWhatsapp />, bg: '#25D366', label: 'WhatsApp' },
    { href: 'https://linkedin.com', icon: <FaLinkedinIn />, bg: '#0A66C2', label: 'LinkedIn' },
    { href: 'https://instagram.com', icon: <FaInstagram />, bg: 'gradient', label: 'Instagram' },
    { href: 'https://x.com', icon: <FaXTwitter />, bg: 'black', label: 'X' },
    { href: 'zoomus://zoom.us', icon: <SiZoom />, bg: '#2D8CFF', label: 'Zoom', isZoom: true },
  ];

  return (
    <footer className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white antialiased">
      <div className="container mx-auto px-6 pt-20 pb-12 max-w-7xl">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-16">
          
          {/* Brand & Socials */}
          <div className="lg:col-span-2">
            <h6 className="font-light text-3xl mb-4 tracking-tight leading-tight">LangZone</h6>
            <p className="text-teal-200 text-sm mb-6 max-w-xs leading-relaxed">
              Connect with language instructors worldwide and master new languages through personalized learning experiences.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {socialLinks.map(({ href, icon, bg, label, isZoom }) => (
                <a
                  key={label}
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${
                    bg === 'gradient'
                      ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                      : bg === 'black'
                      ? 'bg-black'
                      : `bg-[${bg}]`
                  }`}
                >
                  <span className="text-white text-sm sm:text-base">{icon}</span>
                </a>
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
              <li><Link href="/practice" className="hover:text-white transition-colors">Practice Exercises</Link></li>
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
              <li>
                <Link
                  href="/admin/feedback"
                  className="flex items-center gap-1 text-orange-400 font-bold text-2xl hover:text-orange-300 transition-colors"
                >
                  <FaUserShield className="h-5 w-5" />
                  Admin
                </Link>
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
