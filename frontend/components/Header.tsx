//app/components/Header.tsx


"use client";


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
// ❌ FIX 1: Change the import from { supabase } to { getSupabaseClient }
import { getSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Menu,
  Users,
  FileText,
  UserPlus,
  X,
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  BellRing,
  ChevronDown,
  Globe,
  Zap,
  MessageSquare,
  Search,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { AuthButtons } from '@/components/AuthButtons';
import StyledGoogleTranslate from '@/components/StyledGoogleTranslate';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import NotificationDropdown from '@/components/NotificationDropdown';
import SearchBar from '@/components/SearchBar';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// --- Type Definitions ---
interface Notification {
  id: number;
  name: string;
  email: string;
  type: string;
  message: string;
  created_at: string;
  resolved: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  starred?: boolean;
  archived?: boolean;
}

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

// --- Configuration Constants ---
const NAV_ITEMS: NavItem[] = [
  { href: '/instructors', label: 'Find Instructors', Icon: Users },
  { href: '/create-new-profile', label: 'Become an Instructor', Icon: UserPlus },
  { href: '/blog', label: 'Blog', Icon: FileText },
];

const TYPE_COLORS: Record<string, string> = {
  Complaint: 'bg-red-600 text-white',
  Suggestion: 'bg-yellow-400 text-gray-900',
  Experience: 'bg-teal-500 text-white',
  Bug: 'bg-purple-600 text-white',
  Feature: 'bg-blue-600 text-white',
};

// --- Custom Hooks ---
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// --- Utility Functions ---
const isWithinQuietHours = (quietHours: { start: string; end: string }): boolean => {
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const startQuiet = parseInt(quietHours.start.replace(':', ''));
  const endQuiet = parseInt(quietHours.end.replace(':', ''));

  if (startQuiet > endQuiet) {
    return currentTime >= startQuiet || currentTime <= endQuiet;
  }
  return currentTime >= startQuiet && currentTime <= endQuiet;
};

const playNotificationSound = async (enabled: boolean): Promise<void> => {
  if (!enabled) return;
  
  try {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.volume = 0.5;
    await audio.play();
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

// --- Main Component ---
export default function Header() {
  // 🔑 FIX 2: Call getSupabaseClient() and memoize the instance.
  const supabase = useMemo(() => getSupabaseClient(), []); 

  // --- State Management ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- Persisted State ---
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme-dark-mode', false);
  const [notificationPreferences, setNotificationPreferences] = useLocalStorage(
    'notification-preferences', 
    {
      soundEnabled: true,
      emailNotifications: true,
      pushNotifications: true,
      quietHours: { start: '22:00', end: '08:00' },
      maxDisplayCount: 50,
    }
  );

  // --- Memoized Values ---
  const unreadCount = useMemo(() => 
    notifications.filter((n) => !n.resolved && !n.archived).length, 
    [notifications]
  );

  const hasHighPriority = useMemo(() => 
    notifications.some((n) => n.priority === 'high' && !n.resolved && !n.archived),
    [notifications]
  );

  // --- Event Handlers ---
  const handleNotificationUpdate = useCallback((notification: Notification) => {
    // Check if running on the client side
    if (typeof window === 'undefined') return;

    if (!isWithinQuietHours(notificationPreferences.quietHours) && notificationPreferences.soundEnabled) {
      playNotificationSound(true);
    }

    const priority = notification.priority || 'medium';
    const toastOptions = {
      duration: priority === 'high' ? 8000 : 4000,
      icon: priority === 'high' ? '🚨' : '📢',
    };

    toast.success(
      `New ${notification.type}: ${notification.message.slice(0, 50)}${notification.message.length > 50 ? '...' : ''}`,
      toastOptions
    );
  }, [notificationPreferences]);

  // --- Effects ---
  useEffect(() => {
    // Prevent running on server/if client is null
    if (!supabase) return;

    // Fetch initial notifications
    const fetchInitialNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(notificationPreferences.maxDisplayCount);

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching initial notifications:', error);
      }
    };

    fetchInitialNotifications();

    // Set up real-time subscription
    const subscription = supabase
      .channel('feedback-channel')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'feedback' }, 
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT': {
              const newNotification = payload.new as Notification;
              setNotifications(prev => [newNotification, ...prev]);
              handleNotificationUpdate(newNotification);
              break;
            }
            case 'UPDATE': {
              setNotifications(prev => 
                prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
              );
              break;
            }
            case 'DELETE': {
              setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
              break;
            }
          }
        }
      )
      .subscribe();

    // 🔑 FIX 3: Include supabase in the cleanup function
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [notificationPreferences.maxDisplayCount, handleNotificationUpdate, supabase]); // 🔑 FIX 4: Add supabase to dependencies

  // Apply dark mode to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  // --- JSX ---
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 backdrop-blur-lg border-b border-teal-700/50 dark:border-teal-900/50 shadow-lg">
      {/* Top Layer - Utilities */}
      <div className="border-b border-teal-600/30 dark:border-teal-800/30">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-sm font-medium">
              Welcome to Home Platform
            </div>
            
            {/* Top Right - Utilities */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 h-8 w-8 p-0"
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Google Translate */}
              <div className="hidden md:block">
                <StyledGoogleTranslate isMobile={false} />
              </div>

              {/* Notification Dropdown */}
              <NotificationDropdown
                unreadCount={unreadCount}
                hasHighPriority={hasHighPriority}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                notifications={notifications}
                setNotifications={setNotifications}
                isDarkMode={isDarkMode}
              />

              {/* Auth Buttons */}
              <div className="hidden md:block">
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layer - Main Navigation */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3"
            aria-label="Home Platform"
          >
            <div className="text-3xl lg:text-4xl font-extrabold text-white hover:text-teal-100 transition-all duration-300 tracking-wide flex items-center gap-2">
              <Zap className="w-7 h-7 lg:w-8 lg:h-8 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
              Home
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center space-x-1">
            {NAV_ITEMS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-2 text-base lg:text-lg font-medium text-white/90 hover:text-white transition-all duration-200 px-4 py-2.5 rounded-lg hover:bg-white/10 hover:shadow-md"
              >
                <Icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
            {/* Search Bar - Positioned here */}
            <div className="flex-1 min-w-[200px] ml-4">
              <SearchBar />
            </div>
          </nav>

          {/* Mobile Menu Button & Auth */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Auth */}
            <AuthButtons />
            
            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 h-9 w-9 p-0"
                  aria-label="Open main menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[380px] bg-gradient-to-b from-teal-900/95 to-teal-950/95 backdrop-blur-lg p-0 border-l border-teal-600/50"
              >
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex justify-between items-center p-6 border-b border-teal-600/50">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-2xl font-bold text-white group"
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="Home Platform"
                    >
                      <Zap className="w-6 h-6 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
                      HOME
                    </Link>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white hover:bg-white/10 h-9 w-9 p-0"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="space-y-1">
                      {/* Search Bar for Mobile */}
                      <div className="p-4 rounded-xl bg-white/10">
                        <SearchBar />
                      </div>
                      
                      {NAV_ITEMS.map(({ href, label, Icon }) => (
                        <SheetClose asChild key={href}>
                          <Link
                            href={href}
                            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-white group"
                          >
                            <Icon className="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <span className="text-lg font-medium">{label}</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    <Separator className="bg-white/20 my-4" />

                    {/* Mobile Utilities */}
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Language
                        </h3>
                        <StyledGoogleTranslate isMobile={true} />
                      </div>

                      <div className="bg-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Quick Settings
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/80">
                              {notificationPreferences.soundEnabled ? (
                                <Volume2 className="w-4 h-4" />
                              ) : (
                                <VolumeX className="w-4 h-4" />
                              )}
                              <span className="text-sm">Sound</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setNotificationPreferences(prev => ({
                                  ...prev,
                                  soundEnabled: !prev.soundEnabled,
                                }))
                              }
                              className={cn(
                                "text-xs px-3 py-1 h-auto",
                                notificationPreferences.soundEnabled 
                                  ? 'bg-white/20 text-white' 
                                  : 'text-white/60'
                              )}
                            >
                              {notificationPreferences.soundEnabled ? 'ON' : 'OFF'}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/80">
                              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                              <span className="text-sm">Theme</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsDarkMode(!isDarkMode)}
                              className="text-xs px-3 py-1 h-auto text-white/60 hover:text-white"
                            >
                              {isDarkMode ? 'DARK' : 'LIGHT'}
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/80">
                              <BellRing className="w-4 h-4" />
                              <span className="text-sm">Push</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setNotificationPreferences(prev => ({
                                  ...prev,
                                  pushNotifications: !prev.pushNotifications,
                                }))
                              }
                              className={cn(
                                "text-xs px-3 py-1 h-auto",
                                notificationPreferences.pushNotifications 
                                  ? 'bg-white/20 text-white' 
                                  : 'text-white/60'
                              )}
                            >
                              {notificationPreferences.pushNotifications ? 'ON' : 'OFF'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Stats */}
                      {unreadCount > 0 && (
                        <div className="bg-white/10 rounded-xl p-4">
                          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Notifications
                          </h3>
                          <ul className="space-y-2 max-h-60 overflow-y-auto">
                            {notifications.slice(0, 5).map(n => (
                              <li
                                key={n.id}
                                className={cn(
                                  "p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/20 transition-all duration-200",
                                  !n.resolved && !n.archived ? 'bg-white/20' : 'bg-white/10'
                                )}
                              >
                                <div className="flex-1 pr-2">
                                  <p className="text-sm text-white line-clamp-1">{n.message}</p>
                                  <span className="text-xs text-white/60">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                                </div>
                                {n.priority === 'high' && <span className="text-red-400 font-bold ml-2">!</span>}
                              </li>
                            ))}
                          </ul>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 w-full text-white/80 hover:text-white hover:bg-white/10"
                            onClick={() => setIsDropdownOpen(true)}
                          >
                            View All Notifications
                          </Button>
                        </div>
                      )}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}