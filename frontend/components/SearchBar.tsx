"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Typesense from "typesense";
import { Search, X, Loader2, FileText, Layers, ArrowRight, Clock, TrendingUp, Filter, Sparkles, Info, Command, Hash, Zap, BookOpen, Code, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  category?: string;
  tags?: string[];
  highlight?: {
    title?: string;
    content?: string;
  };
}

interface RecentSearch {
  query: string;
  timestamp: number;
  resultCount?: number;
}

interface SearchStats {
  totalSearches: number;
  lastSearchTime: number;
}

const POPULAR_SEARCHES = [
  { text: "Getting Started", icon: Zap, color: "text-blue-500" },
  { text: "Documentation", icon: BookOpen, color: "text-green-500" },
  { text: "API Reference", icon: Code, color: "text-purple-500" },
  { text: "Tutorials", icon: Star, color: "text-amber-500" },
  { text: "Examples", icon: FileText, color: "text-pink-500" }
];

const TYPE_CONFIG = {
  page: { label: "Pages", icon: FileText, color: "indigo" },
  post: { label: "Posts", icon: BookOpen, color: "green" },
  doc: { label: "Docs", icon: Code, color: "purple" },
  all: { label: "All", icon: Sparkles, color: "blue" }
};

// Keyboard shortcut display component
const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
    {children}
  </kbd>
);

// Enhanced highlight with better styling
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  
  const cleanHighlight = highlight.replace(/<[^>]*>/g, '');
  const escapedHighlight = cleanHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  
  const cleanText = text.replace(/<[^>]*>/g, '');
  const parts = cleanText.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="bg-amber-200 dark:bg-amber-500/40 text-gray-900 dark:text-white font-semibold px-1 py-0.5 rounded-sm shadow-sm animate-in fade-in duration-200"
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

// Search result card component
const SearchResultCard = ({ 
  result, 
  query, 
  isSelected, 
  onNavigate, 
  onMouseEnter 
}: { 
  result: PageResult;
  query: string;
  isSelected: boolean;
  onNavigate: () => void;
  onMouseEnter: () => void;
}) => {
  const typeConfig = TYPE_CONFIG[result.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.page;
  const IconComponent = typeConfig.icon;

  return (
    <Link 
      href={result.slug}
      onClick={(e) => { e.preventDefault(); onNavigate(); }}
      onMouseEnter={onMouseEnter}
      className={`block rounded-lg transition-all duration-200 p-3 group ${
        isSelected 
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 ring-2 ring-indigo-500/50 shadow-lg scale-[1.02]' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className={`mt-0.5 p-2.5 rounded-lg flex-shrink-0 shadow-sm ${
            result.isDynamic 
              ? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-200 dark:ring-purple-800' 
              : `bg-${typeConfig.color}-100 dark:bg-${typeConfig.color}-900/30 ring-1 ring-${typeConfig.color}-200 dark:ring-${typeConfig.color}-800`
          }`}>
            {result.isDynamic ? (
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            ) : (
              <IconComponent className={`w-4 h-4 text-${typeConfig.color}-600 dark:text-${typeConfig.color}-400`} />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 leading-snug line-clamp-1">
              <HighlightText 
                text={result.highlight?.title || result.title} 
                highlight={query} 
              />
            </h4>
            
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate max-w-[200px]">
                {result.slug}
              </p>
              
              {result.isDynamic && (
                <Badge variant="secondary" className="text-xs px-2 py-0 h-5 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Dynamic
                </Badge>
              )}
              
              {result.category && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                  {result.category}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
              <HighlightText 
                text={result.highlight?.content || result.content.substring(0, 200) + '...'}
                highlight={query} 
              />
            </p>
            
            {result.tags && result.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <Hash className="w-3 h-3 text-gray-400" />
                {result.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Arrow indicator */}
        <ChevronRight 
          className={`w-5 h-5 flex-shrink-0 mt-1 transition-all duration-200 ${
            isSelected 
              ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' 
              : 'text-gray-300 dark:text-gray-600 group-hover:translate-x-0.5 group-hover:text-gray-500'
          }`} 
        />
      </div>
    </Link>
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
  const [searchStats, setSearchStats] = useState<SearchStats>({ totalSearches: 0, lastSearchTime: 0 });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('search_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('search_session_id', sessionId);
    }
    return sessionId;
  };

  // Function to log search to Typesense
  const logSearchToTypesense = async (searchQuery: string, resultCount: number, filterUsed: string, clickedResult?: string) => {
    try {
      const searchLog = {
        query: searchQuery,
        result_count: resultCount,
        filter_type: filterUsed,
        clicked_result: clickedResult || null,
        timestamp: Math.floor(Date.now() / 1000),
        user_agent: navigator.userAgent,
        session_id: getSessionId(),
      };

      // Use the same client for logging (you may need admin API key for this)
      await typesense
        .collections('search_logs')
        .documents()
        .create(searchLog);

      console.log('Search logged successfully:', searchLog);
    } catch (error) {
      console.error('Error logging search:', error);
    }
  };

  // Load saved data
  useEffect(() => {
    try {
      const savedSearches = localStorage?.getItem('recentSearches');
      const savedStats = localStorage?.getItem('searchStats');
      
      if (savedSearches) {
        const parsed = JSON.parse(savedSearches);
        setRecentSearches(parsed.slice(0, 5));
      }
      
      if (savedStats) {
        setSearchStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error("Error loading search data:", error);
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

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      }
      
      // Forward slash to focus search
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
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
      setSelectedIndex(-1);
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
          per_page: 10,
          snippet_threshold: 30,
          highlight_affix_num_tokens: 8,
        };

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
          type: hit.document.type || 'page',
          isDynamic: hit.document.isDynamic,
          category: hit.document.category || null,
          tags: hit.document.tags || [],
          highlight: {
            title: hit.highlights?.find((h: any) => h.field === 'title')?.snippet || hit.document.title,
            content: hit.highlights?.find((h: any) => h.field === 'content')?.snippet || hit.document.content,
          },
        })) || [];

        setResults(hits);
        setSelectedIndex(-1);

        // Log the search to Typesense
        await logSearchToTypesense(query, hits.length, filterType);
      } catch (err) {
        console.error("Search error details:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filterType]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = prev < results.length - 1 ? prev + 1 : prev;
        scrollToSelected(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = prev > 0 ? prev - 1 : -1;
        scrollToSelected(next);
        return next;
      });
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results.length > 0) {
      e.preventDefault();
      navigateTo(results[selectedIndex].slug, query, results[selectedIndex].title);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    } else if (e.key === '?' && e.shiftKey) {
      e.preventDefault();
      setShowKeyboardShortcuts(!showKeyboardShortcuts);
    }
  };

  // Scroll to selected result
  const scrollToSelected = (index: number) => {
    if (index >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[index] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Save recent search
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      const newSearch: RecentSearch = {
        query: searchQuery,
        timestamp: Date.now(),
        resultCount: results.length
      };

      const updated = [
        newSearch,
        ...recentSearches.filter(s => (s?.query || "").toLowerCase() !== searchQuery.toLowerCase())
      ].slice(0, 5);

      setRecentSearches(updated);
      localStorage?.setItem('recentSearches', JSON.stringify(updated));

      // Update stats
      const newStats = {
        totalSearches: searchStats.totalSearches + 1,
        lastSearchTime: Date.now()
      };
      setSearchStats(newStats);
      localStorage?.setItem('searchStats', JSON.stringify(newStats));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  // Navigate to result
  const navigateTo = (slug: string, searchQuery?: string, resultTitle?: string) => {
    if (searchQuery) {
      saveRecentSearch(searchQuery);
      // Log click to Typesense
      logSearchToTypesense(searchQuery, results.length, filterType, resultTitle);
    }
    setShowDropdown(false);
    setQuery("");
    setSelectedIndex(-1);
    router.push(slug);
  };

  // Handle recent/popular search click
  const handleRecentSearch = (search: string) => {
    setQuery(search);
    setShowDropdown(true);
    setFilterType('all');
    inputRef.current?.focus();
  };

  // Clear recent searches
  const clearRecent = () => {
    setRecentSearches([]);
    localStorage?.removeItem('recentSearches');
  };

  // Clear search input
  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    setFilterType('all');
    inputRef.current?.focus();
  };

  // Grouped results by type
  const groupedResults = useMemo(() => {
    if (filterType !== 'all') return { [filterType]: results };
    
    return results.reduce((acc, result) => {
      const type = result.type || 'other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(result);
      return acc;
    }, {} as Record<string, PageResult[]>);
  }, [results, filterType]);

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors">
          <Search className={`w-5 h-5 transition-colors ${
            showDropdown 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-400 dark:text-gray-500'
          }`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder="Search documentation, guides, and more..."
          className="w-full h-14 pl-12 pr-32 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all shadow-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 focus:shadow-xl focus:outline-none hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600"
          onFocus={() => { setShowDropdown(true); setShowKeyboardShortcuts(false); }}
          aria-label="Search"
          autoComplete="off"
          spellCheck="false"
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <div className="flex items-center gap-2 px-2">
              <Loader2 className="animate-spin w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Searching...</span>
            </div>
          )}
          
          {query && !loading && (
            <button 
              onClick={handleClearSearch}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Clear search (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {!query && (
            <button
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
              title="Keyboard shortcuts"
            >
              <Command className="w-3.5 h-3.5"/>
              <span>K</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Stats Badge */}
      {searchStats.totalSearches > 0 && !showDropdown && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-400 dark:text-gray-500">
          {searchStats.totalSearches} searches performed
        </div>
      )}

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-3 w-full origin-top"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden rounded-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
              
              {/* Filter Tabs */}
              {query && (
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50">
                  <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <div className="flex gap-2 flex-wrap flex-1">
                    {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                      const IconComp = config.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => { setFilterType(key); setSelectedIndex(-1); }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border-2 flex items-center gap-1.5 ${
                            filterType === key
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <ScrollArea className="max-h-[70vh]">
                {/* Search Results */}
                {query && results.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 mb-2">
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {results.length} result{results.length !== 1 ? 's' : ''} found
                      </div>
                      {filterType !== 'all' && (
                        <Badge variant="secondary" className="text-xs">
                          in {TYPE_CONFIG[filterType as keyof typeof TYPE_CONFIG]?.label || filterType}
                        </Badge>
                      )}
                    </div>
                    
                    <div ref={resultsRef} className="space-y-1.5">
                      {results.map((result, idx) => (
                        <SearchResultCard
                          key={result.id}
                          result={result}
                          query={query}
                          isSelected={selectedIndex === idx}
                          onNavigate={() => navigateTo(result.slug, query, result.title)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {query && !loading && results.length === 0 && (
                  <div className="p-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-4 shadow-inner">
                      <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No results for "<span className="text-indigo-600 dark:text-indigo-400">{query}</span>"
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                      Try different keywords or explore our popular topics below
                    </p>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {POPULAR_SEARCHES.map((search) => {
                        const IconComp = search.icon;
                        return (
                          <button
                            key={search.text}
                            onClick={() => handleRecentSearch(search.text)}
                            className="px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all flex items-center gap-2 justify-center group"
                          >
                            <IconComp className={`w-4 h-4 ${search.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-gray-700 dark:text-gray-300">{search.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent & Popular Searches */}
                {!query && !showKeyboardShortcuts && (
                  <div className="p-3">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <>
                        <div className="px-3 py-2 flex items-center justify-between">
                          <div className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            Recent Searches
                          </div>
                          <button
                            onClick={clearRecent}
                            className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Clear All
                          </button>
                        </div>
                        
                        <div className="space-y-1 mb-4">
                          {recentSearches.map((search, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleRecentSearch(search.query)}
                              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-3 group"
                            >
                              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-indigo-500 transition-colors" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                                {search.query}
                              </span>
                              {search.resultCount !== undefined && (
                                <Badge variant="secondary" className="text-xs">
                                  {search.resultCount}
                                </Badge>
                              )}
                              <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                      </>
                    )}

                    {/* Popular Searches */}
                    <div className="px-3 py-2 flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Popular Topics</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {POPULAR_SEARCHES.map((search) => {
                        const IconComp = search.icon;
                        return (
                          <button
                            key={search.text}
                            onClick={() => handleRecentSearch(search.text)}
                            className="px-3 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all flex items-center gap-2 group"
                          >
                            <IconComp className={`w-4 h-4 ${search.color} group-hover:scale-110 transition-transform flex-shrink-0`} />
                            <span className="text-gray-700 dark:text-gray-300 truncate text-left flex-1">{search.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Keyboard Shortcuts Panel */}
                {showKeyboardShortcuts && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        Keyboard Shortcuts
                      </h4>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { keys: [<Command key="cmd" className="w-3 h-3" />, 'K'], desc: 'Open/focus search from anywhere', category: 'Navigation' },
                        { keys: ['/'], desc: 'Quick focus search', category: 'Navigation' },
                        { keys: ['↑', '↓'], desc: 'Navigate through results', category: 'Navigation' },
                        { keys: ['Enter'], desc: 'Open selected result', category: 'Actions' },
                        { keys: ['Esc'], desc: 'Close search panel', category: 'Actions' },
                        { keys: ['Shift', '?'], desc: 'Toggle this help panel', category: 'Help' },
                      ].map((shortcut, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white block">
                              {shortcut.desc}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {shortcut.category}
                            </span>
                          </div>
                          <div className="flex gap-1.5 items-center">
                            {shortcut.keys.map((key, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && <span className="text-gray-400 text-xs">+</span>}
                                <Kbd>{key}</Kbd>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-5 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                      <p className="text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold">Pro tip:</span> Use filter buttons to narrow your search by content type
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>
              
              {/* Footer Navigation Hints */}
              {showDropdown && !showKeyboardShortcuts && results.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex justify-between items-center">
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Kbd>↑</Kbd>
                      <Kbd>↓</Kbd>
                      <span className="font-medium">Navigate</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1.5">
                      <Kbd>Enter</Kbd>
                      <span className="font-medium">Open</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Kbd>Esc</Kbd>
                      <span className="font-medium">Close</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                    <button
                      onClick={() => setShowKeyboardShortcuts(true)}
                      className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Kbd>?</Kbd>
                      <span className="font-medium">Help</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Empty state footer */}
              {showDropdown && !query && !showKeyboardShortcuts && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Start typing to search...</span>
                    </div>
                    <button
                      onClick={() => setShowKeyboardShortcuts(true)}
                      className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Keyboard shortcuts
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hint when not focused */}
      {!showDropdown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-8 right-0 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500"
        >
          <span>Press</span>
          <Kbd>/</Kbd>
          <span>or</span>
          <Kbd><Command className="w-3 h-3" /></Kbd>
          <Kbd>K</Kbd>
          <span>to search</span>
        </motion.div>
      )}
    </div>
  );
}