'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Typesense from "typesense";
import { Search, X, Loader2, FileText, Layers, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

// Enhanced highlighter with vibrant, bold highlighting
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  
  // Escape special regex characters and split into words for better matching
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span className="inline">
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 dark:from-yellow-400 dark:via-yellow-500 dark:to-orange-500 text-gray-900 dark:text-gray-900 px-2 py-0.5 mx-0.5 rounded-md font-extrabold shadow-md ring-2 ring-yellow-500/50 dark:ring-orange-500/50"
            style={{ lineHeight: '1.8' }}
          >
            {part}
          </mark>
        ) : (
          <span key={i} className="inline">{part}</span>
        )
      )}
    </span>
  );
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    const saved = JSON.parse(localStorage?.getItem('recentSearches') || '[]');
    setRecentSearches(saved);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await typesense.collections("pages").documents().search({
          q: query,
          query_by: "title,content",
          sort_by: "title:asc",
          highlight_fields: "title,content",
          highlight_full_fields: "title,content",
          per_page: 8,
          snippet_threshold: 30,
          highlight_affix_num_tokens: 8,
        });

        const hits = searchResults.hits?.map((hit: any) => ({
          id: hit.document.id,
          title: hit.document.title,
          slug: hit.document.slug,
          content: hit.document.content,
          type: hit.document.type,
          isDynamic: hit.document.isDynamic,
          highlight: {
            title: hit.highlights?.[0]?.snippet || hit.document.title,
            content: hit.highlights?.[1]?.snippet || hit.document.content,
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
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (result: PageResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage?.setItem('recentSearches', JSON.stringify(updated));
    
    setShowDropdown(false);
    setQuery("");
    setSelectedIndex(-1);
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    setShowDropdown(true);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage?.removeItem('recentSearches');
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search pages, content, and more..."
          className="w-full h-12 pl-12 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm hover:shadow-md"
          onFocus={() => setShowDropdown(true)}
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="animate-spin w-4 h-4 text-indigo-600" />}
          {query && !loading && (
            <button 
              onClick={() => { setQuery(""); setResults([]); }}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
              <ScrollArea className="max-h-[70vh]">
                {/* Results */}
                {results.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Search Results ({results.length})
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {results.map((result, idx) => (
                        <Link
                          key={result.id}
                          href={result.slug}
                          onClick={() => handleSelect(result)}
                          className={`block rounded-lg transition-all ${
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
                                      text={result.title} 
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
                                      text={result.content.substring(0, 200)} 
                                      highlight={query}
                                    />
                                  </p>
                                </div>
                              </div>
                              
                              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {query && !loading && results.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      No results found
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Try searching with different keywords
                    </p>
                  </div>
                )}

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        Your recent Searches
                      </span>
                      <button
                        onClick={clearRecent}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                    
                    <div className="space-y-1">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRecentSearch(search)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 group"
                        >
                          <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                            {search}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Tips */}
                {!query && recentSearches.length === 0 && (
                  <div className="p-6 space-y-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Search Tips
                    </p>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400">•</span>
                        <span>Use keywords to find pages and content quickly</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400">•</span>
                        <span>Navigate results with arrow keys</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400">•</span>
                        <span>Press Enter to open selected page</span>
                      </div>
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

