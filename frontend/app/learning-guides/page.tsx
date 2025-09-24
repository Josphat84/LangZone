'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bookmark, Book, Globe, MessageSquare, Star } from "lucide-react";

type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  imageIcon: React.ReactNode;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
};

export default function LearningGuidesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const guides: Guide[] = [
    {
      slug: 'beginners-guide-to-spanish',
      title: "Beginner's Guide to Learning Spanish",
      excerpt: 'Start your Spanish journey with essential phrases, grammar basics, and pronunciation tips.',
      imageIcon: <Globe className="w-16 h-16 text-red-500" />,
      language: "Spanish",
      level: "Beginner",
      tags: ["Grammar", "Vocabulary", "Speaking"],
    },
    {
      slug: 'mastering-french-conjugation',
      title: 'Mastering French Verb Conjugation',
      excerpt: 'Step-by-step guide to French verb conjugations and common irregularities.',
      imageIcon: <Book className="w-16 h-16 text-blue-500" />,
      language: "French",
      level: "Intermediate",
      tags: ["Grammar", "Conjugation"],
    },
    {
      slug: 'essential-mandarin-for-travel',
      title: 'Essential Mandarin Phrases for Travel',
      excerpt: 'Key phrases for navigating, ordering food, and cultural etiquette.',
      imageIcon: <MessageSquare className="w-16 h-16 text-green-500" />,
      language: "Mandarin",
      level: "Beginner",
      tags: ["Travel", "Speaking", "Listening"],
    },
    {
      slug: 'german-grammar-for-intermediate',
      title: 'German Grammar: A Guide for Intermediate Learners',
      excerpt: 'Deep dive into cases, word order, and complex sentence structures.',
      imageIcon: <Star className="w-16 h-16 text-yellow-500" />,
      language: "German",
      level: "Intermediate",
      tags: ["Grammar", "Cases", "Word Order"],
    },
  ];

  const toggleBookmark = (slug: string) => {
    setBookmarks(prev =>
      prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]
    );
  };

  const filteredGuides = guides.filter(g =>
    (!selectedLanguage || g.language === selectedLanguage) &&
    (!selectedLevel || g.level === selectedLevel)
  );

  const languages = Array.from(new Set(guides.map(g => g.language)));
  const levels = Array.from(new Set(guides.map(g => g.level)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Learning Guides
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Explore curated guides to help you master new languages.
          </p>
        </section>

        <Separator className="mb-6" />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <div className="flex gap-2 flex-wrap justify-center">
            {languages.map(lang => (
              <Button
                key={lang}
                size="sm"
                variant={selectedLanguage === lang ? "default" : "outline"}
                onClick={() => setSelectedLanguage(selectedLanguage === lang ? null : lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {levels.map(level => (
              <Button
                key={level}
                size="sm"
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
              >
                {level}
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => { setSelectedLanguage(null); setSelectedLevel(null); }}
          >
            Reset Filters
          </Button>
        </div>

        {/* Guides Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map(guide => (
            <article
              key={guide.slug}
              className="bg-white rounded-lg shadow-md border border-gray-100 flex flex-col h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <Link href={`/learning-guides/${guide.slug}`} className="block h-full relative group">
                <div className="flex items-center justify-center h-48 bg-gray-50">
                  {guide.imageIcon}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10"
                    onClick={(e) => { e.preventDefault(); toggleBookmark(guide.slug); }}
                  >
                    <Bookmark className={bookmarks.includes(guide.slug) ? "text-teal-500" : "text-gray-400"} />
                  </Button>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {guide.title}
                  </h2>
                  <p className="text-gray-700 text-sm md:text-base mb-4 flex-grow">
                    {guide.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{guide.language}</Badge>
                    <Badge variant="outline">{guide.level}</Badge>
                    {guide.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                  <span className="text-teal-600 font-semibold hover:text-teal-700 transition-colors mt-auto inline-block">
                    View Guide &rarr;
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
