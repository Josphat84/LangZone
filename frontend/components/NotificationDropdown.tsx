// Notification dropdown component for displaying user notifications
//app/components/NotificationDropdown.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Bell,
  X,
  Search,
  Filter,
  Archive,
  Trash2,
  CheckCircle2,
  BellRing,
  Volume2,
  VolumeX,
  Star,
  RefreshCw,
} from 'lucide-react';
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

interface NotificationDropdownProps {
  unreadCount: number;
  hasHighPriority: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  isDarkMode: boolean;
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

// --- Main Component ---
export default function NotificationDropdown({
  unreadCount,
  hasHighPriority,
  isDropdownOpen,
  setIsDropdownOpen,
  notifications,
  setNotifications,
  isDarkMode
}: NotificationDropdownProps) {
  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<number>>(new Set());
  const [showPreferences, setShowPreferences] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Persisted State ---
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

  const allNotificationTypes = useMemo(() => 
    Array.from(new Set(notifications.map((n) => n.type))),
    [notifications]
  );

  const allPriorityTypes = useMemo(() => 
    Array.from(new Set(notifications.map((n) => n.priority).filter(Boolean))) as string[],
    [notifications]
  );

  // --- Event Handlers ---
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
        .limit(notificationPreferences.maxDisplayCount * 2);

      if (filter.resolved !== null) {
        query = query.eq('resolved', filter.resolved);
      }
      if (filter.type.length > 0) {
        query = query.in('type', filter.type);
      }
      if (filter.priority.length > 0) {
        query = query.in('priority', filter.priority);
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
  }, [filter, notificationPreferences.maxDisplayCount, setNotifications]);

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
  }, [setNotifications]);

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
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          "text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 h-8 w-8 p-0",
          hasHighPriority && "animate-pulse"
        )}
        title={`${unreadCount} unread notifications`}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge
            variant={hasHighPriority ? 'destructive' : 'secondary'}
            className={cn(
              "absolute -top-1 -right-1 px-1 py-0 text-xs font-bold border border-red-600 h-5 min-w-[20px] flex items-center justify-center bg-red-600 text-white",
              hasHighPriority && "animate-bounce"
            )}
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-96 max-h-[70vh] overflow-y-auto rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 p-4 flex flex-col gap-4"
            role="dialog"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                Notifications (<span className="text-black-600 font-bold">{unreadCount}</span>)
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
                  size="sm"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 h-8 w-8 p-0"
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
                  className="pl-10 dark:bg-gray-700 dark:text-white h-9"
                  aria-label="Search notifications"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 h-9 w-9 p-0",
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
      </AnimatePresence>
    </div>
  );
}