// SearchBar.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Typesense from "typesense";
import { Search, X, Loader2, FileText, Layers, ArrowRight, Clock, TrendingUp, Filter, Sparkles, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Typesense client
const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY!,
  connectionTimeoutSeconds: 5,
});

interface PageResult {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: string;
  isDynamic?: boolean;
  highlight?: {
    title?: string;
    content?: string;
  };
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

const POPULAR_SEARCHES = [
  "Getting Started",
  "Documentation",
  "API Reference",
  "Tutorials",
  "Examples"
];

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  
  // Remove HTML tags from highlight string if present
  const cleanHighlight = highlight.replace(/<[^>]*>/g, '');
  const escapedHighlight = cleanHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  
  // Remove HTML tags from text
  const cleanText = text.replace(/<[^>]*>/g, '');
  const parts = cleanText.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-500 dark:to-orange-500 font-semibold px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filterType, setFilterType] = useState<string>("all");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage?.getItem('recentSearches');
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed.slice(0, 5)); // Keep only last 5
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowKeyboardShortcuts(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Search with Typesense
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchParams: any = {
          q: query,
          query_by: "title,content",
          sort_by: "title:asc",
          highlight_fields: "title,content",
          highlight_full_fields: "title,content",
          per_page: 8,
          snippet_threshold: 30,
          highlight_affix_num_tokens: 8,
        };

        // Add filter if not "all"
        if (filterType !== "all") {
          searchParams.filter_by = `type:=${filterType}`;
        }

        const searchResults = await typesense
          .collections("pages")
          .documents()
          .search(searchParams);

        const hits = searchResults.hits?.map((hit: any) => ({
          id: hit.document.id,
          title: hit.document.title,
          slug: hit.document.slug.startsWith('/') 
            ? hit.document.slug 
            : `/${hit.document.slug}`,
          content: hit.document.content,
          type: hit.document.type,
          isDynamic: hit.document.isDynamic,
          highlight: {
            title: hit.highlights?.find((h: any) => h.field === 'title')?.snippet || hit.document.title,
            content: hit.highlights?.find((h: any) => h.field === 'content')?.snippet || hit.document.content,
          },
        })) || [];

        setResults(hits);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filterType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results.length > 0) {
      e.preventDefault();
      navigateTo(results[selectedIndex].slug, query);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    } else if (e.key === '?' && e.shiftKey) {
      e.preventDefault();
      setShowKeyboardShortcuts(!showKeyboardShortcuts);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      const newSearch: RecentSearch = {
        query: searchQuery,
        timestamp: Date.now()
      };

      // Remove duplicates and add new search
      const updated = [
        newSearch,
        ...recentSearches.filter(s => s.query.toLowerCase() !== searchQuery.toLowerCase())
      ].slice(0, 5);

      setRecentSearches(updated);
      localStorage?.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const navigateTo = (slug: string, searchQuery?: string) => {
    if (searchQuery) {
      saveRecentSearch(searchQuery);
    }
    setShowDropdown(false);
    setQuery("");
    setSelectedIndex(-1);
    
    // Use Next.js router for better navigation
    router.push(slug);
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    setShowDropdown(true);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage?.removeItem('recentSearches');
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search pages, content, and more..."
          className="w-full h-12 pl-12 pr-24 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm hover:shadow-md"
          onFocus={() => setShowDropdown(true)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="animate-spin w-4 h-4 text-indigo-600" />}
          {query && !loading && (
            <button 
              onClick={handleClearSearch}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <button
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Keyboard shortcuts"
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        
        {/* Keyboard shortcut hint */}
        <div className="absolute -bottom-6 right-0 text-xs text-gray-400">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">⌘K</kbd> to focus
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-10 w-full"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
              {/* Filter Tabs */}
              {query && (
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'page', 'post', 'doc'].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          filterType === type
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ScrollArea className="max-h-[70vh]">
                {/* Search Results */}
                {query && results.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      {results.length} result{results.length !== 1 ? 's' : ''} found
                    </div>
                    {results.map((result, idx) => (
                      <button
                        key={result.id}
                        onClick={() => navigateTo(result.slug, query)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left block rounded-lg transition-all ${
                          selectedIndex === idx 
                            ? 'bg-indigo-50 dark:bg-indigo-950 ring-2 ring-indigo-500' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                                result.isDynamic 
                                  ? 'bg-purple-100 dark:bg-purple-900/30' 
                                  : 'bg-blue-100 dark:bg-blue-900/30'
                              }`}>
                                {result.isDynamic ? (
                                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                ) : (
                                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 leading-relaxed">
                                  <HighlightText 
                                    text={result.highlight?.title || result.title} 
                                    highlight={query} 
                                  />
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 flex-wrap">
                                  <span className="truncate">{result.slug}</span>
                                  {result.isDynamic && (
                                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                                      Dynamic
                                    </Badge>
                                  )}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                                  <HighlightText 
                                    text={result.highlight?.content || result.content.substring(0, 200)} 
                                    highlight={query} 
                                  />
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {query && !loading && results.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No results found
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Try adjusting your search or check for typos
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {POPULAR_SEARCHES.map(search => (
                        <button
                          key={search}
                          onClick={() => handleRecentSearch(search)}
                          className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 flex items-center justify-between">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Recent Searches
                      </div>
                      <button
                        onClick={clearRecent}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentSearch(search.query)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                          {search.query}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Searches */}
                {!query && recentSearches.length === 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      Popular Searches
                    </div>
                    {POPULAR_SEARCHES.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                      >
                        <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {search}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Keyboard Shortcuts */}
                {showKeyboardShortcuts && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Keyboard Shortcuts
                    </h4>
                    <div className="space-y-2 text-xs">
                      {[
                        { keys: ['⌘', 'K'], desc: 'Focus search' },
                        { keys: ['↑', '↓'], desc: 'Navigate results' },
                        { keys: ['Enter'], desc: 'Open result' },
                        { keys: ['Esc'], desc: 'Close search' },
                        { keys: ['?'], desc: 'Show shortcuts' },
                      ].map((shortcut, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            {shortcut.desc}
                          </span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, i) => (
                              <kbd 
                                key={i}
                                className="px-2 py-0.5 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}