'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Users, FileText, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { AuthButtons } from '@/components/AuthButtons';
import { useTranslation } from '@/app/context/TranslationContext';
import { createClient } from '@supabase/supabase-js';

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
    <header className="sticky top-0 z-50 bg-teal-600/90 dark:bg-teal-800/90 backdrop-blur-xl border-b border-teal-700 dark:border-teal-900">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <Link href="/" className="text-xl font-bold text-white hover:text-teal-200 transition-colors">
          {t("AppName")}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              {navItems.map(({ href, key, Icon }) => (
                <NavigationMenuItem key={key}>
                  <Link href={href} className="flex items-center text-sm font-medium text-white hover:text-teal-200 transition-colors">
                    <Icon className="w-4 h-4 mr-2 opacity-90" />
                    {t(key)}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <LanguageSwitcher />
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-teal-600/95 dark:bg-teal-800/95 border-l border-teal-700 dark:border-teal-900 w-[85%] sm:w-[350px] p-6">
            <SheetTitle className="text-lg font-semibold text-white mb-6">{t("menu")}</SheetTitle>
            <div className="flex flex-col space-y-4">
              {navItems.map(({ href, key, Icon }) => (
                <SheetClose key={key} asChild>
                  <Link href={href} className="flex items-center text-white hover:text-teal-200 transition-colors">
                    <Icon className="w-4 h-4 mr-2 opacity-90" />
                    {t(key)}
                  </Link>
                </SheetClose>
              ))}

              <div className="pt-4 border-t border-teal-700 dark:border-teal-900">
                <LanguageSwitcher />
              </div>
              <div className="pt-4 border-t border-teal-700 dark:border-teal-900">
                <AuthButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
