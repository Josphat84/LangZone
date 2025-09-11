"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  Menu,
  Users,
  HelpCircle,
  FileText,
  UserPlus,
} from "lucide-react";

import LanguageSwitcher from "@/components/LanguageSwitcher"; // ✅ Import

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

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-600/85 to-teal-500/85 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / Title */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300">
          No Name Yet
        </Link>

        {/* Desktop Navigation + LanguageSwitcher */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="space-x-6">
              {/* Find Instructors */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-yellow-200 hover:bg-white/10 font-medium transition-all duration-200">
                  <Users className="w-4 h-4 mr-2" />
                  Find Instructors
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Available Instructors
                    </h4>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {instructors.length} instructors
                    </Badge>
                    <Separator className="mb-2" />
                    {instructors.length > 0 ? (
                      instructors.map((instructor) => (
                        <NavigationMenuLink key={instructor.id} asChild>
                          <Link
                            href={`/tutors/${instructor.slug}`}
                            className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-teal-50 hover:text-teal-700"
                          >
                            {instructor.name}
                          </Link>
                        </NavigationMenuLink>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        Loading instructors...
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Other nav links */}
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
                  href="/help-center"
                  className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
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
              {/* Find Instructors Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    Find Instructors
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 max-h-60 overflow-y-auto bg-white">
                  {instructors.length > 0 ? (
                    instructors.map((instructor) => (
                      <DropdownMenuItem key={instructor.id} asChild>
                        <Link
                          href={`/tutors/${instructor.slug}`}
                          className="flex items-center px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {instructor.name}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">Loading...</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Other mobile nav links */}
              <SheetClose asChild>
                <Link href="/create-new-profile">
                  <Button variant="ghost" className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full">
                    <UserPlus className="w-4 h-4 mr-3" />
                    Become an Instructor
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/help-center">
                  <Button variant="ghost" className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full">
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Help Center
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
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
