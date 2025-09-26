"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import MeiliSearch from "meilisearch";

// --- Meilisearch client ---
const client = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://127.0.0.1:7700",
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || "",
});

// --- SWR fetcher ---
const searchFetcher = async (query: string) => {
  if (!query) return [];
  const res = await client.index("pages").search(query, { limit: 5 });
  return res.hits;
};

// --- Type Definitions ---
interface SearchResult {
  id: string;
  title: string;
  slug: string;
  type: string; // "blog" | "tutor" | "page"
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Debounce query ---
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: results, isLoading } = useSWR(
    debouncedQuery,
    searchFetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCollapse = () => {
    setExpanded(false);
    setQuery("");
  };

  const handleClearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const resolveUrl = (item: SearchResult) => {
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
  };

  const showResults =
    expanded && query.length > 0 && results && results.length > 0;

  return (
    <div className="relative flex items-center gap-2 min-w-[200px]">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "16rem", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex-1"
          >
            {/* Search Icon / Loader */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {isLoading && query.length > 0 ? (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <Input
              ref={inputRef}
              value={query}
              onChange={handleChange}
              placeholder="Search..."
              className="pl-9 pr-10 text-black rounded-full"
            />

            {query.length > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 p-2 h-full rounded-r-full text-gray-500 hover:text-gray-700"
                onClick={handleClearQuery}
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 p-2 h-full rounded-r-full text-gray-500 hover:text-gray-700"
                onClick={handleCollapse}
                aria-label="Collapse search bar"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            <AnimatePresence>
              {showResults && (
                <motion.div
                  key="search-results-dropdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl mt-2 z-50 overflow-hidden border border-gray-200"
                >
                  {results.map((item: SearchResult) => (
                    <Link
                      key={item.id}
                      href={resolveUrl(item)}
                      className="block px-4 py-3 text-sm text-gray-800 hover:bg-teal-100 transition-colors duration-150 truncate"
                      onClick={handleCollapse}
                    >
                      {item.title}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleExpand}
              aria-label="Expand search"
            >
              <Search className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
