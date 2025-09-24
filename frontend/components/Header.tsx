"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Menu,
  Users,
  FileText,
  UserPlus,
  Bell,
  X,
  Search,
  Settings,
  Moon,
  Sun,
  Filter,
  Archive,
  Trash2,
  CheckCircle2,
  Circle,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  Bookmark,
  Star,
  MessageSquare,
  Clock,
  ChevronDown,
  Globe,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { AuthButtons } from '@/components/AuthButtons';
import StyledGoogleTranslate from '@/components/StyledGoogleTranslate';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// --- Constants ---
const NOTIFICATION_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
const MAX_NOTIFICATION_DISPLAY = 50;
const SEARCH_DEBOUNCE_MS = 300;

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

interface NotificationPreferences {
  soundEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  quietHours: { start: string; end: string };
  maxDisplayCount: number;
}

interface FilterState {
  type: string[];
  priority: string[];
  resolved: boolean | null;
  starred: boolean | null;
  archived: boolean | null;
  dateRange: 'today' | 'week' | 'month' | 'all';
}

interface NavItem {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

// --- Custom Hooks ---
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

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

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

const INITIAL_FILTER_STATE: FilterState = {
  type: [],
  priority: [],
  resolved: null,
  starred: null,
  archived: null,
  dateRange: 'all',
};

const INITIAL_PREFERENCES: NotificationPreferences = {
  soundEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  quietHours: { start: '22:00', end: '08:00' },
  maxDisplayCount: 50,
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
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.5;
    await audio.play();
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

const getDateFilterStartDate = (range: FilterState['dateRange']): Date => {
  const now = new Date();
  switch (range) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(0);
  }
};

// --- Main Component ---
export default function Header() {
  // --- State Management ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<number>>(new Set());
  const [showPreferences, setShowPreferences] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Persisted State ---
  const [isDarkMode, setIsDarkMode] = useLocalStorage('theme-dark-mode', false);
  const [filter, setFilter] = useLocalStorage<FilterState>('notification-filters', INITIAL_FILTER_STATE);
  const [notificationPreferences, setNotificationPreferences] = useLocalStorage<NotificationPreferences>(
    'notification-preferences', 
    INITIAL_PREFERENCES
  );

  // --- Refs ---
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Debounced Search ---
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);

  // --- Memoized Values ---
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Text search
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.message.toLowerCase().includes(searchLower) ||
          n.name?.toLowerCase().includes(searchLower) ||
          n.type.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filter.starred !== null) {
      filtered = filtered.filter((n) => Boolean(n.starred) === filter.starred);
    }
    if (filter.resolved !== null) {
      filtered = filtered.filter((n) => n.resolved === filter.resolved);
    }
    if (filter.archived !== null) {
      filtered = filtered.filter((n) => Boolean(n.archived) === filter.archived);
    }
    if (filter.type.length > 0) {
      filtered = filtered.filter((n) => filter.type.includes(n.type));
    }
    if (filter.priority.length > 0) {
      filtered = filtered.filter((n) => n.priority && filter.priority.includes(n.priority));
    }

    return filtered.slice(0, notificationPreferences.maxDisplayCount);
  }, [notifications, debouncedSearchTerm, filter, notificationPreferences.maxDisplayCount]);

  const groupedNotifications = useMemo(() => {
    return filteredNotifications
      .filter(n => !n.archived)
      .reduce((acc: Record<string, Notification[]>, n) => {
        acc[n.type] = acc[n.type] || [];
        acc[n.type].push(n);
        return acc;
      }, {});
  }, [filteredNotifications]);

  const unreadCount = useMemo(() => 
    notifications.filter((n) => !n.resolved && !n.archived).length, 
    [notifications]
  );

  const hasHighPriority = useMemo(() => 
    notifications.some((n) => n.priority === 'high' && !n.resolved && !n.archived),
    [notifications]
  );

  const allNotificationTypes = useMemo(() => 
    Array.from(new Set(notifications.map((n) => n.type))),
    [notifications]
  );

  const allPriorityTypes = useMemo(() => 
    Array.from(new Set(notifications.map((n) => n.priority).filter(Boolean))) as string[],
    [notifications]
  );

  // --- Data Fetching ---
  const fetchNotifications = useCallback(async (signal?: AbortSignal) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const effectiveSignal = signal || controller.signal;

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(notificationPreferences.maxDisplayCount * 2); // Fetch more for filtering

      // Apply server-side filters
      if (filter.resolved !== null) {
        query = query.eq('resolved', filter.resolved);
      }
      if (filter.type.length > 0) {
        query = query.in('type', filter.type);
      }
      if (filter.priority.length > 0) {
        query = query.in('priority', filter.priority);
      }
      if (filter.dateRange !== 'all') {
        const startDate = getDateFilterStartDate(filter.dateRange);
        query = query.gte('created_at', startDate.toISOString());
      }

      if (effectiveSignal.aborted) return;

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      if (!effectiveSignal.aborted) {
        setNotifications(data || []);
      }
    } catch (error) {
      if (!effectiveSignal.aborted) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load notifications';
        console.error('Error fetching notifications:', error);
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      if (!effectiveSignal.aborted) {
        setIsLoading(false);
      }
    }
  }, [filter, notificationPreferences.maxDisplayCount]);

  // --- Event Handlers ---
  const handleNotificationUpdate = useCallback((notification: Notification) => {
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

  const handleBulkAction = useCallback(async (action: 'resolve' | 'archive' | 'delete' | 'star') => {
    if (selectedNotifications.size === 0) return;

    setIsLoading(true);
    try {
      const ids = Array.from(selectedNotifications);
      const updateData: Partial<Notification> = {};

      switch (action) {
        case 'resolve':
          updateData.resolved = true;
          break;
        case 'archive':
          updateData.archived = true;
          break;
        case 'star':
          updateData.starred = true;
          break;
      }

      if (action === 'delete') {
        await supabase.from('feedback').delete().in('id', ids);
      } else {
        await supabase.from('feedback').update(updateData).in('id', ids);
      }

      toast.success(`${action === 'delete' ? 'Deleted' : 
                    action === 'resolve' ? 'Resolved' : 
                    action === 'archive' ? 'Archived' : 'Starred'} ${ids.length} notifications`);

      setSelectedNotifications(new Set());
      await fetchNotifications();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bulk action failed';
      console.error('Bulk action failed:', error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNotifications, fetchNotifications]);

  const handleNotificationAction = useCallback(async (
    id: number, 
    action: 'read' | 'star' | 'archive',
    currentValue?: boolean
  ) => {
    try {
      const updateData: Partial<Notification> = {};
      
      switch (action) {
        case 'read':
          updateData.resolved = true;
          break;
        case 'star':
          updateData.starred = !currentValue;
          break;
        case 'archive':
          updateData.archived = true;
          break;
      }

      await supabase.from('feedback').update(updateData).eq('id', id);

      if (action === 'read') {
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.success('Notification marked as read');
      } else {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, ...updateData } : n)
        );
        toast.success(
          action === 'star' 
            ? (currentValue ? 'Removed star' : 'Added star')
            : 'Notification archived'
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} notification`;
      console.error(`Failed to ${action} notification:`, error);
      toast.error(errorMessage);
    }
  }, []);

  const toggleNotificationSelection = useCallback((id: number) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleFilterChange = useCallback(<K extends keyof FilterState>(
    key: K, 
    value: FilterState[K]
  ) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  }, [setFilter]);

  const clearFilters = useCallback(() => {
    setFilter(INITIAL_FILTER_STATE);
    setSearchTerm('');
  }, [setFilter]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // --- Effects ---
  useEffect(() => {
    fetchNotifications();

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

    return () => {
      supabase.removeChannel(subscription);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchNotifications, handleNotificationUpdate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setShowPreferences(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  // --- Render Components ---
  const renderNotificationItem = useCallback((notification: Notification) => (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "p-3 border rounded-md bg-gray-50 dark:bg-gray-700 flex justify-between items-start transition-colors duration-200",
        selectedNotifications.has(notification.id)
          ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900'
          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
      )}
    >
      <div className="flex items-start gap-2 flex-1">
        <Checkbox
          checked={selectedNotifications.has(notification.id)}
          onCheckedChange={() => toggleNotificationSelection(notification.id)}
          className="mt-1"
          aria-label={`Select notification from ${notification.name || 'Anonymous'}`}
        />
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {notification.name ? `By: ${notification.name} • ` : ''}
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {notification.priority && (
              <Badge
                variant="outline"
                className={cn("text-xs", PRIORITY_COLORS[notification.priority])}
              >
                {notification.priority.toUpperCase()}
              </Badge>
            )}
            {notification.starred && <Star className="w-4 h-4 text-yellow-500" />}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNotificationAction(notification.id, 'star', notification.starred)}
          title={notification.starred ? 'Unstar' : 'Star'}
          aria-label={notification.starred ? 'Remove star' : 'Add star'}
        >
          <Star
            className={cn(
              "w-4 h-4 transition-colors",
              notification.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNotificationAction(notification.id, 'read')}
          title="Mark as read"
          aria-label="Mark notification as read"
        >
          <CheckCircle2 className="w-4 h-4 text-gray-400 hover:text-green-500 transition-colors" />
        </Button>
      </div>
    </motion.div>
  ), [selectedNotifications, toggleNotificationSelection, handleNotificationAction]);

  const renderFilterSection = useCallback(() => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-3"
        >
          <div>
            <Label className="font-semibold text-sm mb-2 block dark:text-white">Status</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Unread', value: false },
                { label: 'Read', value: true }
              ].map(({ label, value }) => (
                <Button
                  key={label}
                  variant={filter.resolved === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('resolved', filter.resolved === value ? null : value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="font-semibold text-sm mb-2 block dark:text-white">Priority</Label>
            <div className="flex flex-wrap gap-2">
              {allPriorityTypes.map((priority) => (
                <Button
                  key={priority}
                  variant={filter.priority.includes(priority) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleFilterChange(
                      'priority',
                      filter.priority.includes(priority)
                        ? filter.priority.filter((p) => p !== priority)
                        : [...filter.priority, priority]
                    )
                  }
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="font-semibold text-sm mb-2 block dark:text-white">Type</Label>
            <div className="flex flex-wrap gap-2">
              {allNotificationTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter.type.includes(type) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleFilterChange(
                      'type',
                      filter.type.includes(type) 
                        ? filter.type.filter((t) => t !== type) 
                        : [...filter.type, type]
                    )
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <Button variant="secondary" onClick={clearFilters} className="w-full">
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showFilters, filter, allPriorityTypes, allNotificationTypes, handleFilterChange, clearFilters]);

  // --- JSX ---
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-600/95 to-teal-700/95 dark:from-teal-800/95 dark:to-teal-900/95 backdrop-blur-lg border-b border-teal-700/50 dark:border-teal-900/50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-2"
          aria-label="Tutorly Home"
        >
          <div className="text-4xl font-extrabold text-white hover:text-teal-100 transition-all tracking-wide flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
            Home
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center flex-1 justify-end space-x-6">
          <nav className="flex items-center space-x-4">
            {NAV_ITEMS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-2 text-lg font-medium text-white/90 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-md"
              >
                <Icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
          </nav>

          <Separator orientation="vertical" className="h-8 mx-4 bg-white/20" />

          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white hover:bg-white/10 transition-colors"
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "hover:bg-white/10 transition-all duration-200",
                  hasHighPriority && "animate-pulse"
                )}
                title={`${unreadCount} unread notifications`}
                aria-label={`Notifications (${unreadCount} unread)`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <Bell className={cn(
                  "w-6 h-6",
                  unreadCount > 0 ? "text-red-500" : "text-white"
                )} />
                {unreadCount > 0 && (
                  <Badge
                    variant={hasHighPriority ? 'destructive' : 'secondary'}
                    className={cn(
                      "absolute -top-2 -right-2 px-2 py-1 text-xs font-bold border-2 border-white",
                      hasHighPriority && "animate-bounce"
                    )}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Notification Dropdown */}
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-96 max-h-[70vh] overflow-y-auto rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 p-4 flex flex-col gap-4"
                  role="dialog"
                  aria-label="Notifications"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                      Notifications (<span className="text-red-600 font-bold">{unreadCount}</span>)
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshNotifications}
                        disabled={isLoading}
                        title="Refresh notifications"
                        aria-label="Refresh notifications"
                      >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDropdownOpen(false)}
                        className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        aria-label="Close notifications"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Search and Controls */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 dark:bg-gray-700 dark:text-white"
                        aria-label="Search notifications"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400",
                        showFilters && "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400"
                      )}
                      title="Toggle filters"
                      aria-label="Toggle notification filters"
                      aria-pressed={showFilters}
                    >
                      <Filter className="w-4 h-4" />
                    </Button>

                  </div>

                  {/* Filter Section */}
                  {renderFilterSection()}

                  {/* Preferences Section */}
                  <AnimatePresence>
                    {showPreferences && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound-toggle" className="flex items-center gap-2 dark:text-white cursor-pointer">
                            {notificationPreferences.soundEnabled ? (
                              <Volume2 className="w-4 h-4" />
                            ) : (
                              <VolumeX className="w-4 h-4" />
                            )}
                            Sound Notifications
                          </Label>
                          <Checkbox
                            id="sound-toggle"
                            checked={notificationPreferences.soundEnabled}
                            onCheckedChange={(checked) =>
                              setNotificationPreferences(prev => ({
                                ...prev,
                                soundEnabled: Boolean(checked),
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-toggle" className="flex items-center gap-2 dark:text-white cursor-pointer">
                            <BellRing className="w-4 h-4" />
                            Push Notifications
                          </Label>
                          <Checkbox
                            id="push-toggle"
                            checked={notificationPreferences.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationPreferences(prev => ({
                                ...prev,
                                pushNotifications: Boolean(checked),
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-toggle" className="flex items-center gap-2 dark:text-white cursor-pointer">
                            <Bell className="w-4 h-4" />
                            Email Notifications
                          </Label>
                          <Checkbox
                            id="email-toggle"
                            checked={notificationPreferences.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationPreferences(prev => ({
                                ...prev,
                                emailNotifications: Boolean(checked),
                              }))
                            }
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showPreferences && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound-toggle" className="flex items-center gap-2 dark:text-white cursor-pointer">
                            {notificationPreferences.soundEnabled ? (
                              <Volume2 className="w-4 h-4" />
                            ) : (
                              <VolumeX className="w-4 h-4" />
                            )}
                            Sound Notifications
                          </Label>
                          <Checkbox
                            id="sound-toggle"
                            checked={notificationPreferences.soundEnabled}
                            onCheckedChange={(checked) =>
                              setNotificationPreferences(prev => ({
                                ...prev,
                                soundEnabled: Boolean(checked),
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-toggle" className="flex items-center gap-2 dark:text-white cursor-pointer">
                            <BellRing className="w-4 h-4" />
                            Push Notifications
                          </Label>
                          <Checkbox
                            id="push-toggle"
                            checked={notificationPreferences.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationPreferences(prev => ({
                                ...prev,
                                pushNotifications: Boolean(checked),
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-toggle" className="flex items-center gap-2 dark:text-white cursor-pointer">
                            <Bell className="w-4 h-4" />
                            Email Notifications
                          </Label>
                          <Checkbox
                            id="email-toggle"
                            checked={notificationPreferences.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationPreferences(prev => ({
                                ...prev,
                                emailNotifications: Boolean(checked),
                              }))
                            }
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bulk Actions Bar */}
                  <AnimatePresence>
                    {selectedNotifications.size > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                          {selectedNotifications.size} selected
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBulkAction('resolve')}
                          disabled={isLoading}
                          title="Mark selected as read"
                          aria-label="Mark selected notifications as read"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBulkAction('archive')}
                          disabled={isLoading}
                          title="Archive selected"
                          aria-label="Archive selected notifications"
                        >
                          <Archive className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBulkAction('star')}
                          disabled={isLoading}
                          title="Star selected"
                          aria-label="Star selected notifications"
                        >
                          <Star className="w-4 h-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBulkAction('delete')}
                          disabled={isLoading}
                          title="Delete selected"
                          aria-label="Delete selected notifications"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error State */}
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshNotifications}
                        className="mt-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800/20"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {/* Notification List */}
                  <div className="flex-1 min-h-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Loading notifications...
                        </div>
                      </div>
                    ) : Object.keys(groupedNotifications).length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {debouncedSearchTerm || Object.values(filter).some(v => v !== null && (Array.isArray(v) ? v.length > 0 : true))
                            ? 'No notifications match your filters'
                            : 'No notifications found'}
                        </p>
                        {(debouncedSearchTerm || Object.values(filter).some(v => v !== null && (Array.isArray(v) ? v.length > 0 : true))) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="mt-2 text-teal-600 hover:text-teal-700"
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4" role="list" aria-label="Notifications">
                        {Object.entries(groupedNotifications).map(([type, items]) => (
                          <div key={type} role="listitem">
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                className={cn("text-sm font-semibold", TYPE_COLORS[type] || 'bg-gray-600 text-white')}
                              >
                                {type} ({items.length})
                              </Badge>
                              {items.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const itemIds = items.map(item => item.id);
                                    const newSelection = new Set(selectedNotifications);
                                    const allSelected = itemIds.every(id => newSelection.has(id));
                                    
                                    if (allSelected) {
                                      itemIds.forEach(id => newSelection.delete(id));
                                    } else {
                                      itemIds.forEach(id => newSelection.add(id));
                                    }
                                    setSelectedNotifications(newSelection);
                                  }}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  {items.every(item => selectedNotifications.has(item.id)) ? 'Deselect All' : 'Select All'}
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              <AnimatePresence>
                                {items.map(renderNotificationItem)}
                              </AnimatePresence>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <StyledGoogleTranslate isMobile={false} />
            <AuthButtons />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "text-white hover:bg-white/10 transition-all duration-200",
                hasHighPriority && "animate-pulse"
              )}
              title={`${unreadCount} unread notifications`}
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge
                  variant={hasHighPriority ? 'destructive' : 'secondary'}
                  className={cn(
                    "absolute -top-1 -right-1 px-1 py-0 text-xs font-bold border border-white",
                    hasHighPriority && "animate-bounce"
                  )}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          <AuthButtons />
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                aria-label="Open main menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[400px] bg-gradient-to-b from-teal-700/95 to-teal-800/95 dark:from-teal-900/95 dark:to-teal-950/95 backdrop-blur-lg p-0 border-l border-teal-600/50"
            >
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex justify-between items-center p-6 border-b border-teal-600/50">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-2xl font-bold text-white group"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Tutorly Home"
                  >
                    <Zap className="w-6 h-6 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
                    TUTORLY
                  </Link>
                  <SheetClose asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/10"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                  <div className="space-y-1">
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

                  {/* Mobile Quick Stats */}
                  <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <h3 className="text-white font-semibold mb-3">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-white/80">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          <span>Notifications</span>
                        </div>
                        <div className="text-xl font-bold text-red-400 mt-1">{unreadCount}</div>
                      </div>
                      <div className="text-white/80">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>Starred</span>
                        </div>
                        <div className="text-xl font-bold text-white mt-1">
                          {notifications.filter((n) => n.starred).length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Settings */}
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

                    {/* Mobile Recent Notifications Preview */}
                    {unreadCount > 0 && (
                      <div className="bg-white/10 rounded-xl p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Recent (<span className="text-red-400 font-bold">{unreadCount}</span>)
                        </h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {notifications
                            .filter((n) => !n.resolved && !n.archived)
                            .slice(0, 3)
                            .map((n) => (
                              <div key={n.id} className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={cn("px-2 py-1 text-xs rounded", TYPE_COLORS[n.type] || 'bg-gray-600 text-white')}>
                                    {n.type}
                                  </span>
                                  {n.priority === 'high' && (
                                    <span className="text-red-300 text-xs">HIGH</span>
                                  )}
                                </div>
                                <p className="text-white/80 break-words">
                                  {n.message}
                                </p>
                                <p className="text-white/60 text-xs mt-1">
                                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-3 text-white/80 hover:text-white hover:bg-white/10"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsDropdownOpen(true);
                          }}
                        >
                          View All Notifications
                          <ChevronDown className="w-4 h-4 ml-1 rotate-270" />
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-teal-600/50 bg-white/5">
                  <div className="text-center text-white/60 text-xs">
                    <p>© 2025 Home Platform. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-2">
                      <Link href="/privacy" className="hover:text-white transition-colors">
                        Privacy
                      </Link>
                      <Link href="/terms" className="hover:text-white transition-colors">
                        Terms
                      </Link>
                      <Link href="/support" className="hover:text-white transition-colors">
                        Support
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Notification Toast */}
      <AnimatePresence>
        {unreadCount > 0 && !isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="md:hidden fixed top-20 left-4 right-4 z-40"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    <span className="text-red-600 font-bold">{unreadCount}</span> new notification{unreadCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDropdownOpen(true)}
                  className="text-teal-600 hover:text-teal-700 text-xs px-2 py-1 h-auto"
                >
                  View
                </Button>
              </div>
              {hasHighPriority && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  High priority items require attention
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}