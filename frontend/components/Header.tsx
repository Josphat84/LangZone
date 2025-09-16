'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Users, FileText, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { AuthButtons } from '@/components/AuthButtons';
import { useTranslation } from '@/app/context/TranslationContext';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Instructor {
  id: string;
  name: string;
  slug: string;
}

// Dynamically import the GoogleTranslate component with ssr: false
const GoogleTranslate = dynamic(() => import('@/components/GoogleTranslate'), {
  ssr: false,
});

export default function Header() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  }, []);

  const navItems = [
    { href: '/instructors', key: 'findInstructors', Icon: Users },
    { href: '/create-new-profile', key: 'becomeInstructor', Icon: UserPlus },
    { href: '/blog', key: 'blog', Icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-teal-600/95 dark:bg-teal-800/95 backdrop-blur-lg border-b border-teal-700/50 dark:border-teal-900/50 shadow-sm pt-4 md:pt-4">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-2xl font-bold text-white hover:text-teal-100 transition-colors tracking-wide">
          {t('AppName')}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              {navItems.map(({ href, key, Icon }) => (
                <NavigationMenuItem key={key}>
                  <Link href={href} className="flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors duration-200">
                    <Icon className="w-4 h-4 mr-2 opacity-80" />
                    {t(key)}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* This component is now dynamically imported to prevent hydration errors */}
          <GoogleTranslate />
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-teal-600/95 dark:bg-teal-800/95 backdrop-blur-lg border-l border-teal-700/50 dark:border-teal-900/50 w-[85%] sm:w-[350px] p-6 text-white pt-4">
            <SheetTitle className="text-lg font-semibold text-white/95 mb-6">{t('menu')}</SheetTitle>
            <div className="flex flex-col space-y-6">
              {navItems.map(({ href, key, Icon }) => (
                <SheetClose key={key} asChild>
                  <Link href={href} className="flex items-center text-white/90 hover:text-white transition-colors text-base font-medium">
                    <Icon className="w-4 h-4 mr-3 opacity-80" />
                    {t(key)}
                  </Link>
                </SheetClose>
              ))}
              
              <div className="pt-6 border-t border-teal-700/50 dark:border-teal-900/50">
                <div className="text-sm text-white/70 mb-2">Translate Page:</div>
                {/* This component is also dynamically imported here */}
                <GoogleTranslate />
              </div>

              <div className="pt-6 border-t border-teal-700/50 dark:border-teal-900/50">
                <AuthButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}