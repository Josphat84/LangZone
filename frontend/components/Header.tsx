'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose,
  SheetTitle
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
import { ChevronDown, Menu, Users, HelpCircle, FileText, UserPlus } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Instructor {
  id: string;
  name: string;
  slug: string;
}

// Brighter, attention-grabbing subtitle colors
const subtitles = [
  { text: "Application name coming soon", color: "text-orange-300" },
  { text: "Building something amazing", color: "text-purple-300" },
  { text: "Innovation in progress", color: "text-blue-300" },
  { text: "Your learning destination", color: "text-green-200" },
  { text: "Excellence awaits", color: "text-pink-300" },
  { text: "Dream • Learn • Achieve", color: "text-yellow-200" },
  { text: "Where knowledge meets passion", color: "text-cyan-300" },
  { text: "Transforming education daily", color: "text-rose-300" },
];

const animations = [
  { in: "translate-x-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "-translate-x-12 opacity-0 scale-100 rotate-0 skew-x-0", name: "Slide Left" },
  { in: "translate-x-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "translate-x-0 opacity-0 scale-75 rotate-0 skew-x-0", name: "Scale Fade" },
  { in: "translate-x-0 translate-y-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "translate-x-0 -translate-y-8 opacity-0 scale-100 rotate-0 skew-x-0", name: "Slide Up" },
  { in: "translate-x-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "translate-x-0 opacity-0 scale-90 -rotate-12 skew-x-0", name: "Rotate Fade" },
  { in: "translate-x-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "translate-x-0 opacity-0 scale-125 rotate-0 skew-x-0", name: "Bounce Out" },
  { in: "translate-x-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "translate-x-8 opacity-0 scale-90 rotate-6 skew-x-0", name: "Slide Right" },
  { in: "translate-x-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "translate-x-0 opacity-0 scale-100 rotate-0 skew-x-12", name: "Skew Exit" },
  { in: "translate-x-0 opacity-100 scale-100 rotate-0 skew-x-0", out: "translate-x-0 opacity-0 scale-50 rotate-180 skew-x-0", name: "Flip Shrink" },
];

export default function Header() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
        setCurrentAnimation((prev) => (prev + 1) % animations.length);
        setIsAnimating(true);
      }, 500);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-600/85 to-teal-500/85 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Animated Logo Section */}
        <Link href="/" className="group">
          <div className="flex flex-col items-start">
            <div 
              className={`text-2xl font-bold text-white transition-all duration-700 ease-in-out hover:text-yellow-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transform ${
                isAnimating ? animations[currentAnimation].in : animations[currentAnimation].out
              }`}
            >
              No Name Yet
            </div>
            <div 
              className={`text-xs font-medium mt-1 transition-all duration-600 delay-150 ease-in-out ${
                isAnimating 
                  ? 'translate-y-0 opacity-100 blur-0 scale-100' 
                  : 'translate-y-3 opacity-0 blur-sm scale-95'
              } ${subtitles[currentSubtitle].color}`}
            >
              {subtitles[currentSubtitle].text}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-white hover:text-yellow-200 hover:bg-white/10 focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 font-medium transition-all duration-200">
                <Users className="w-4 h-4 mr-2" />
                Find Instructors
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Available Instructors</h4>
                    <Badge variant="secondary" className="text-xs">
                      {instructors.length} instructors found
                    </Badge>
                  </div>
                  <Separator className="mb-3" />
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {instructors.length > 0 ? (
                      instructors.map((instructor) => (
                        <NavigationMenuLink key={instructor.id} asChild>
                          <Link
                            href={`/tutors/${instructor.slug}`}
                            className="block px-3 py-2 text-sm text-gray-700 rounded-md transition-all duration-200 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md"
                          >
                            {instructor.name}
                          </Link>
                        </NavigationMenuLink>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        Loading instructors...
                      </div>
                    )}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/create-new-profile"
                className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200 hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Become an Instructor
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/help-center"
                className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200 hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Center
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/blog"
                className="flex items-center px-4 py-2 text-white hover:text-yellow-200 hover:bg-white/10 rounded-md font-medium transition-all duration-200 hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Blog
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-yellow-200 hover:bg-white/10"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="bg-gradient-to-b from-teal-600/95 to-teal-500/95 backdrop-blur-lg border-l border-white/10 w-[85%] sm:w-[400px]"
          >
            <SheetTitle className="text-white text-xl font-bold mb-6">
              Navigation Menu
            </SheetTitle>
            
            <div className="flex flex-col space-y-4">
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
                <DropdownMenuContent 
                  align="start" 
                  className="w-72 max-h-60 overflow-y-auto bg-white"
                >
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

              <Separator className="bg-white/20" />

              <SheetClose asChild>
                <Link href="/create-new-profile">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-3" />
                    Become an Instructor
                  </Button>
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link href="/help-center">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full"
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Help Center
                  </Button>
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link href="/blog">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-white hover:text-yellow-200 hover:bg-white/10 w-full"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Blog
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
