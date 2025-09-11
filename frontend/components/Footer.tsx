'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { HelpCircle } from "lucide-react";

export default function Footer() {
  const socialIcons = [
    {
      href: 'https://facebook.com',
      label: 'Facebook',
      svgPath: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
    },
    {
      href: 'https://twitter.com',
      label: 'Twitter',
      svgPath: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
    },
    {
      href: 'https://instagram.com',
      label: 'Instagram',
      svgPath: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white py-14 px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400/30 via-teal-300/50 to-teal-400/30 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-teal-500/10 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
      <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-teal-400/10 animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />

      <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-teal-300/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
      <div className="absolute top-3/4 right-1/4 w-1 h-1 rounded-full bg-teal-200/30 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
      <div className="absolute top-1/2 left-3/4 w-2 h-2 rounded-full bg-teal-400/25 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '2.5s' }} />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Card className="bg-white/10 border-none p-2 rounded-lg mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </Card>
              <h6 className="font-extrabold text-2xl bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                LangZone
              </h6>
            </div>
            <p className="text-teal-200 mb-6 font-normal leading-relaxed text-sm max-w-sm">
              Bridging language barriers and connecting cultures through innovative learning solutions.
            </p>
            <div className="flex space-x-3">
              {/* Social buttons with consistent size and spacing */}
              {socialIcons.map(({ href, label, svgPath }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="bg-white/10 hover:bg-teal-500 transition-all duration-300 p-3 rounded-full border-none"
                  aria-label={`Visit our ${label} page`}
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d={svgPath} clipRule="evenodd" />
                    </svg>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Learn Section */}
          <div>
            <div className="flex items-center mb-4">
              <Card className="bg-white/10 border-none p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </Card>
              <h6 className="font-semibold text-xl">Learn</h6>
            </div>
            <ul className="space-y-2">
              {[
                { href: "/learning-guides", label: "Learning Guides" },
                { href: "/courses", label: "Courses" },
                { href: "/resources", label: "Resources" },
                { href: "/practice", label: "Practice Exercises" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Button
                    variant="ghost"
                    asChild
                    className="h-auto p-0 justify-start hover:bg-transparent hover:text-teal-400 transition-colors duration-300 font-medium group"
                  >
                    <Link href={href} className="flex items-center">
                      <Badge className="w-2 h-2 bg-teal-300 rounded-full mr-3 group-hover:scale-110 transition-transform border-none p-0" />
                      {label}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h6 className="font-semibold text-xl mb-4">Company</h6>
            <ul className="space-y-2">
              {[
                { href: "/about-us", label: "About Us" },
                { href: "/careers", label: "Careers" },
                { href: "/blog", label: "Blog" },
                { href: "/sitemap", label: "Sitemap" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Button
                    variant="ghost"
                    asChild
                    className="h-auto p-0 py-1 justify-start hover:bg-transparent hover:text-teal-400 transition-colors duration-300 font-medium"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <div className="flex items-center mb-4">
              <Card className="bg-white/10 border-none p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </Card>
              <h6 className="font-semibold text-xl">Support</h6>
            </div>
            <ul className="space-y-2">
              {[
                { href: "/faq", label: "FAQ" },
                { href: "/contact-us", label: "Contact Us" },
                { href: "/help-center", label: "Help Center" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/privacy-policy", label: "Privacy Policy" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Button
                    variant="ghost"
                    asChild
                    className="h-auto p-0 py-1 justify-start hover:bg-transparent hover:text-teal-400 transition-colors duration-300 font-medium"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-10 pt-8">
          <Separator className="bg-white/20 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div>
              <h3 className="font-semibold text-lg mb-1">Stay Updated</h3>
              <p className="text-teal-300 max-w-md text-sm">
                Subscribe to our newsletter for language learning tips and updates.
              </p>
            </div>
            <form className="flex w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-l-md rounded-r-none focus:ring-2 focus:ring-teal-400 text-gray-800 w-full md:w-64 border-none"
                aria-label="Email address"
                required
              />
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-400 transition-colors duration-300 rounded-r-md font-semibold border-none"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Divider and Copyright */}
        <Separator className="bg-white/20 mt-8 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center text-teal-300 text-sm font-medium tracking-wide">
          <p className="mb-4 md:mb-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} No Name Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            {["English", "Español", "Français"].map((lang) => (
              <React.Fragment key={lang}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent hover:text-white transition-colors"
                >
                  {lang}
                </Button>
                {lang !== "Français" && (
                  <Separator orientation="vertical" className="bg-white h-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}