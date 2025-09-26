"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  Loader2, 
  X, 
  FileText, 
  User, 
  Globe,
  ChevronRight,
} from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import MeiliSearch from "meilisearch";

// --- Meilisearch client ---
const meiliClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://127.0.0.1:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "",
});

// --- Enhanced Types ---
interface SearchResult {
  id: string;
  title: string;
  slug: string;
  type: string; // "blog" | "tutor" | "page"
  description?: string;
  lastModified?: string;
  _formatted?: {
    title?: string;
    description?: string;
  };
}

interface SearchData {
  results: SearchResult[];
}

// --- Enhanced SWR fetcher (WITH INDEX NOT FOUND HANDLING) ---
const searchFetcher = async (queryKey: [string, string]): Promise<SearchData> => {
  const query = queryKey[1]; 
  if (!query || query.length < 2) return { results: [] };
  
  try {
    const index = meiliClient.index("pages");

    // The actual search API call
    const searchRes = await index.search<SearchResult>(query, { 
      limit: 10,
      attributesToHighlight: ['title', 'description'],
      attributesToRetrieve: ['id', 'title', 'slug', 'type', 'description', 'lastModified']
    });
    
    return {
      results: searchRes.hits,
    } as SearchData;
  } catch (error) {
    // 💡 FIX: Catch MeiliSearch API errors, specifically the "Index not found" error.
    if (error instanceof Error && (error.message.includes("Index `pages` not found") || error.message.includes("not found"))) {
      console.warn("MeiliSearch Warning: Index 'pages' not found. Returning empty results.");
      // Return an empty result set instead of throwing, allowing the component to render.
      return { results: [] };
    }
    
    // Log other errors and return empty data
    console.error('Search error:', error);
    return { results: [] }; 
  }
};

export default function EnhancedSearchBar() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Utility Handlers - defined here to be stable dependencies
  const handleCollapse = useCallback(() => {
    setExpanded(false);
    setQuery("");
    setSelectedIndex(-1);
  }, []);

  const resolveUrl = useCallback((item: SearchResult) => {
    switch (item.type) {
      case "tutor":
        return `/tutors/${item.slug}/AvailabilityCalendar`;
      case "blog":
        return `/blog/${item.slug}`;
      case "page":
        return `/${item.slug}`;
      default:
        return "/";
    }
  }, []);

  const { data, isLoading } = useSWR<SearchData>(
    ['meilisearch', query], 
    searchFetcher, 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      debounce: 300, 
    }
  );

  const results = data?.results || [];
  const totalItems = results.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!expanded) return;

      if (totalItems === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          // Cycle through all results
          setSelectedIndex(prev => (prev + 1) % totalItems); 
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Cycle backwards
          setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            // Navigate to selected result
            window.location.href = resolveUrl(results[selectedIndex]);
            handleCollapse();
          }
          break;
        case 'Escape':
          handleCollapse();
          break;
      }
    };

    if (expanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  // Fixed dependency array: including totalItems (size) and results/handlers for closure access.
  }, [expanded, totalItems, selectedIndex, resolveUrl, handleCollapse, results]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        handleCollapse();
      }
    };

    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [expanded, handleCollapse]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
  }, []);

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClearQuery = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tutor":
        return <User className="w-4 h-4 text-blue-500" />;
      case "blog":
        return <FileText className="w-4 h-4 text-green-500" />;
      case "page":
        return <Globe className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Visibility conditions
  const showResults = expanded && query.length >= 2 && results.length > 0;
  const showEmpty = expanded && query.length >= 2 && !isLoading && results.length === 0;

  return (
    <div className="relative flex items-center gap-2 min-w-[200px]" ref={resultsRef}>
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 240, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 240, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex-1"
          >
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                {isLoading && query.length >= 2 ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <Input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                placeholder="Search tutorials, blogs, and more..."
                className="pl-12 pr-12 h-12 text-base bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {query.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    onClick={handleClearQuery}
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    onClick={handleCollapse}
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {(showResults || showEmpty) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-2xl mt-2 z-50 overflow-hidden border border-gray-100 backdrop-blur-sm"
                >
                
                  {/* Search Results */}
                  {showResults && (
                    <div className="max-h-96 overflow-y-auto">
                      <div className="text-xs font-medium text-gray-500 px-4 py-2 bg-gray-50">
                        {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                      </div>
                      {results.map((item, index) => (
                        <Link
                          key={item.id}
                          href={resolveUrl(item)}
                          onClick={handleCollapse}
                          className={`block px-4 py-3 transition-all duration-150 ${
                            selectedIndex === index
                              ? 'bg-blue-50 border-r-2 border-blue-500'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {getTypeIcon(item.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 
                                  className="text-sm font-medium text-gray-900 truncate"
                                  dangerouslySetInnerHTML={{
                                    __html: item._formatted?.title || item.title
                                  }}
                                />
                                <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                              </div>
                              {/* Use _formatted for description if available and safe */}
                              {item.description && (
                                <p 
                                  className="text-xs text-gray-600 mt-1 line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html: item._formatted?.description || item.description
                                  }}
                                />
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">
                                  {item.type}
                                </span>
                                {item.lastModified && (
                                  <span className="text-xs text-gray-500">
                                    {formatDate(item.lastModified)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {showEmpty && (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-2">No results found for **"{query}"**</p>
                      <p className="text-gray-400 text-xs">Try adjusting your search terms or checking your spelling.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all duration-200"
              onClick={handleExpand}
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}