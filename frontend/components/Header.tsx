'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Menu,
  Users,
  FileText,
  UserPlus,
  ArrowRightLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { AuthButtons } from '@/components/AuthButtons';
import { useTranslation } from '@/app/context/TranslationContext';
import { createClient } from '@supabase/supabase-js';
import { GoogleTranslate } from './GoogleTranslate';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', popular: true },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', popular: true },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', popular: true },
  
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', popular: true },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳', popular: true },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', popular: true },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', popular: false },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', popular: false },

  { code: 'sn', name: 'Shona', native: 'chiShona', flag: '🇿🇼', popular: false },
];

interface Instructor {
  id: string;
  name: string;
  slug: string;
}

export default function Header() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data, error } = await supabase
        .from('Instructor')
        .select('id, name, slug')
        .order('name', { ascending: true });
      if (!error && data) setInstructors(data);
    };
    fetchInstructors();

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const navItems = [
    { href: '/instructors', key: 'findInstructors', label: 'Find Instructors', Icon: Users },
    { href: '/create-new-profile', key: 'becomeInstructor', label: 'Become an Instructor', Icon: UserPlus },
    { href: '/blog', key: 'blog', label: 'Blog', Icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-teal-600/95 dark:bg-teal-800/95 backdrop-blur-lg border-b border-teal-700/50 dark:border-teal-900/50 shadow-sm pt-4 md:pt-4">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-2xl font-bold text-white hover:text-teal-100 transition-colors tracking-wide">
          {t('AppName')}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu className="relative z-10">
            <NavigationMenuList className="flex space-x-6">
              {navItems.map(({ href, key, label, Icon }) => (
                <NavigationMenuItem key={key} className="relative">
                  <Link
                    href={href}
                    className="flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/10 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 mr-2 opacity-80" />
                    {key === 'blog' ? t('blog') : label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="w-px h-6 bg-white/20"></div>

          <div className="flex items-center gap-4">
            <GoogleTranslate isMobile={false} languages={languages} />
            <AuthButtons />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <GoogleTranslate isMobile={true} languages={languages} />
          <AuthButtons />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-teal-700/95 dark:bg-teal-900/95 backdrop-blur-lg p-0">
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-6 border-b border-teal-600/50">
                  <Link href="/" className="text-2xl font-bold text-white" onClick={() => setIsMenuOpen(false)}>
                    {t('AppName')}
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <ArrowRightLeft className="h-5 w-5 rotate-90" />
                    </Button>
                  </SheetClose>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    {navItems.map(({ href, key, label, Icon }) => (
                      <SheetClose asChild key={key}>
                        <Link
                          href={href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-lg font-medium">{key === 'blog' ? t('blog') : label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                      Translate
                    </h3>
                    <GoogleTranslate isMobile={true} languages={languages} />
                  </div>
                </div>
                <div className="p-6 border-t border-teal-600/50">
                  <AuthButtons isMobile={true} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}