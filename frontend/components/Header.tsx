'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Menu, Users, FileText, UserPlus, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { AuthButtons } from '@/components/AuthButtons';
import { useTranslation } from '@/app/context/TranslationContext';
import GoogleTranslate from './GoogleTranslate';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation() || { t: (key: string) => key };

  const navItems = [
    { href: '/instructors', key: 'findInstructors', label: t('findInstructors'), Icon: Users },
    { href: '/create-new-profile', key: 'becomeInstructor', label: t('becomeInstructor'), Icon: UserPlus },
    { href: '/blog', key: 'blog', label: t('blog'), Icon: FileText },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-teal-600/95 dark:bg-teal-800/95 backdrop-blur-lg border-b border-teal-700/50 dark:border-teal-900/50 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-white hover:text-teal-100 transition-all tracking-wide"
          onClick={closeMenu}
        >
          {t('AppName')}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu className="relative z-10">
            <NavigationMenuList className="flex space-x-6">
              {navItems.map(({ href, key, label, Icon }) => (
                <NavigationMenuItem key={key}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    {label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Separator orientation="vertical" className="h-6 bg-white/20" />

          <div className="flex items-center gap-4">
            {/* Google Translate Widget - fully inline styled */}
            <div className="flex-shrink-0 w-48">
              <GoogleTranslate isMobile={false} />
            </div>

            <AuthButtons />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <div className="flex-shrink-0 w-40">
            <GoogleTranslate isMobile={true} />
          </div>
          <AuthButtons />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-teal-700/95 dark:bg-teal-900/95 backdrop-blur-lg p-0 border-l border-teal-600/50"
            >
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-6 border-b border-teal-600/50">
                  <Link href="/" className="text-2xl font-bold text-white" onClick={closeMenu}>
                    {t('AppName')}
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    {navItems.map(({ href, key, label, Icon }) => (
                      <SheetClose asChild key={key}>
                        <Link
                          href={href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white"
                          onClick={closeMenu}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-lg font-medium">{label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  <Separator className="bg-white/20" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Translate</h3>
                    <div className="w-full">
                      <GoogleTranslate isMobile={true} />
                    </div>
                  </div>
                </nav>

                <div className="p-6 border-t border-teal-600/50">
                  <AuthButtons isMobile={true} onAction={closeMenu} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
