'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, Users, FileText, UserPlus, HelpCircle } from "lucide-react";

import LanguageSwitcher from "@/components/LanguageSwitcher"; 
import { AuthButtons } from "@/components/AuthButtons"; // ✅ use named import (case-sensitive)

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

  useEffect(() => {
    const fetchInstructors = async () => {
      const { data, error } = await supabase
        .from("Instructor")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (!error && data) setInstructors(data);
    };
    fetchInstructors();
  }, []);

  // Extracted Help Center element (still usable in footer if needed)
  const helpCenterLink = (
    <Link
      href="/help-center"
      className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200"
    >
      <HelpCircle className="w-4 h-4 mr-2" />
      Help Center
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-600/85 to-teal-500/85 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / Title */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300">
          No Name Yet
        </Link>

        {/* Desktop Navigation + LanguageSwitcher + Auth */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              <NavigationMenuItem>
                <Link
                  href="/instructors"
                  className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find Instructors
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/create-new-profile"
                  className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Become an Instructor
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/blog"
                  className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Blog
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* ✅ LanguageSwitcher */}
          <LanguageSwitcher />

          {/* ✅ Auth Buttons */}
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-gradient-to-b from-teal-600/95 to-teal-500/95 backdrop-blur-lg border-l border-white/10 w-[85%] sm:w-[400px]">
            <SheetTitle className="text-white text-xl font-bold mb-6">
              Navigation Menu
            </SheetTitle>

            <div className="flex flex-col space-y-4">
              <SheetClose asChild>
                <Link href="/find-instructors">
                  <Button variant="ghost" className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full">
                    <Users className="w-4 h-4 mr-3" />
                    Find Instructors
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/create-new-profile">
                  <Button variant="ghost" className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full">
                    <UserPlus className="w-4 h-4 mr-3" />
                    Become an Instructor
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/blog">
                  <Button variant="ghost" className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full">
                    <FileText className="w-4 h-4 mr-3" />
                    Blog
                  </Button>
                </Link>
              </SheetClose>

              {/* ✅ Mobile LanguageSwitcher */}
              <LanguageSwitcher />

              {/* ✅ Mobile Auth Buttons */}
              <div className="pt-4 border-t border-white/20">
                <AuthButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
