'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/app/context/TranslationContext';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  const { t, lang, availableLanguages, setLang } = useTranslation();

  const socialIcons = [
    { label: 'Facebook', href: 'https://facebook.com', icon: <FaFacebookF />, color: '#1877F2' },
    { label: 'X', href: 'https://x.com', icon: <FaTwitter />, color: '#1DA1F2' },
    { label: 'Instagram', href: 'https://instagram.com', icon: <FaInstagram />, color: 'linear-gradient(45deg, #feda75, #d62976, #8134af, #517fa4, #2d77a5)' },
    { label: 'YouTube', href: 'https://youtube.com', icon: <FaYoutube />, color: '#FF0000' },
    { label: 'WhatsApp', href: 'https://wa.me/1234567890', icon: <FaWhatsapp />, color: '#25D366' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: <FaLinkedinIn />, color: '#0A66C2' },
  ];

  return (
    <footer className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand & Socials */}
          <div className="lg:col-span-2">
            <h6 className="font-bold text-3xl mb-4">{t("langZone")}</h6>
            <p className="text-teal-200 text-sm mb-6 max-w-xs">{t("footerDescription")}</p>
            <div className="flex space-x-4">
              {socialIcons.map(({ label, href, icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-transform duration-300 transform hover:scale-110 shadow-lg"
                  style={{ background: color }}
                >
                  <span className="text-xl text-white">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h6 className="font-semibold text-lg mb-4">{t("learn")}</h6>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/learning-guides', key: 'learningGuides' },
                { href: '/courses', key: 'courses' },
                { href: '/resources', key: 'resources' },
                { href: '/practice', key: 'practiceExercises' },
              ].map(({ href, key }) => (
                <li key={key}>
                  <Link href={href} className="hover:text-teal-400 transition-colors">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h6 className="font-semibold text-lg mb-4">{t("company")}</h6>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/about-us', key: 'aboutUs' },
                { href: '/careers', key: 'careers' },
                { href: '/blog', key: 'blog' },
                { href: '/sitemap', key: 'sitemap' },
              ].map(({ href, key }) => (
                <li key={key}>
                  <Link href={href} className="hover:text-teal-400 transition-colors">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h6 className="font-semibold text-lg mb-4">{t("support")}</h6>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/faq', key: 'faq' },
                { href: '/contact-us', key: 'contactUs' },
                { href: '/help-center', key: 'helpCenter' },
                { href: '/terms-of-service', key: 'termsOfService' },
                { href: '/privacy-policy', key: 'privacyPolicy' },
              ].map(({ href, key }) => (
                <li key={key}>
                  <Link href={href} className="hover:text-teal-400 transition-colors">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Bottom Bar */}
        <div className="mt-16">
          <Separator className="bg-white/20 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-xl mb-1">{t("stayUpdated")}</h3>
              <p className="text-sm text-teal-200">{t("subscribeNewsletter")}</p>
            </div>
            <form className="flex w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder={t("yourEmail")} 
                className="rounded-full rounded-r-none text-gray-800 w-full md:w-72 border-none px-4 py-3 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
                required 
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white rounded-full rounded-l-none px-6 py-3 shadow-md hover:shadow-lg transition-all"
              >
                {t("subscribe")}
              </Button>
            </form>
          </div>
          
          <Separator className="bg-white/20 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-teal-300">
            <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} LangZone. All rights reserved.</p>
            <div className="flex space-x-4">
              {availableLanguages.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`hover:text-white transition-colors ${lang === code ? "font-bold text-white" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}