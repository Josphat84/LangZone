'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Menu, Users, FileText, UserPlus, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { AuthButtons } from '@/components/AuthButtons';
import StyledGoogleTranslate from '@/components/StyledGoogleTranslate';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/instructors', label: 'Find Instructors', Icon: Users },
    { href: '/create-new-profile', label: 'Become an Instructor', Icon: UserPlus },
    { href: '/blog', label: 'Blog', Icon: FileText },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-teal-600/95 dark:bg-teal-800/95 backdrop-blur-lg border-b border-teal-700/50 dark:border-teal-900/50 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-8 px-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-4xl font-extrabold text-white hover:text-teal-100 transition-all tracking-wide flex-shrink-0"
          onClick={closeMenu}
        >
          Home
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center flex-1 justify-end">
          {/* Nav Links */}
          <div className="flex items-center space-x-8 relative z-20">
            {navItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-lg font-medium text-white/90 hover:text-white transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/10"
              >
                <Icon className="w-5 h-5 opacity-80" />
                {label}
              </Link>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8 mx-8 bg-white/20" />

          {/* Google Translate + Auth Buttons Group */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <StyledGoogleTranslate isMobile={false} />
            <AuthButtons />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
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
                <div className="flex justify-between items-center p-8 border-b border-teal-600/50">
                  <Link href="/" className="text-3xl font-bold text-white" onClick={closeMenu}>
                    TUTORLY
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex flex-col gap-3">
                    {navItems.map(({ href, label, Icon }) => (
                      <SheetClose asChild key={href}>
                        <Link
                          href={href}
                          className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition-colors text-white"
                          onClick={closeMenu}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-lg font-medium">{label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  <Separator className="bg-white/20" />
                  {/* Google Translate in mobile sheet */}
                  <div className="mt-4">
                    <StyledGoogleTranslate isMobile={true} />
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