// app/pricing/page.tsx
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Bookmark } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type Package = {
  id: string;
  title: string;
  language: string;
  price: number;
  duration: string;
  minutesPerLesson: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  description: string;
  popular?: boolean;
  bookmarked?: boolean;
};

const MOCK_PACKAGES: Package[] = [
  {
    id: "pkg-1",
    title: "Spanish Basics",
    language: "Spanish",
    price: 49,
    duration: "4 weeks",
    minutesPerLesson: 45,
    level: "Beginner",
    tags: ["Grammar", "Vocabulary"],
    description: "Learn essential Spanish phrases and vocabulary.",
    popular: true,
  },
  {
    id: "pkg-2",
    title: "French Conversation",
    language: "French",
    price: 79,
    duration: "6 weeks",
    minutesPerLesson: 50,
    level: "Intermediate",
    tags: ["Speaking", "Listening"],
    description: "Enhance French conversation and listening skills.",
  },
  {
    id: "pkg-3",
    title: "Japanese Advanced",
    language: "Japanese",
    price: 129,
    duration: "8 weeks",
    minutesPerLesson: 60,
    level: "Advanced",
    tags: ["Writing", "Grammar", "Vocabulary"],
    description: "Master advanced Japanese writing and grammar.",
    popular: true,
  },
  {
    id: "pkg-4",
    title: "English Speaking Booster",
    language: "English",
    price: 59,
    duration: "5 weeks",
    minutesPerLesson: 40,
    level: "Intermediate",
    tags: ["Speaking", "Vocabulary"],
    description: "Improve your English speaking skills.",
  },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LANGUAGES = ["Spanish", "French", "Japanese", "English"];
const TAGS = ["Grammar", "Vocabulary", "Speaking", "Listening", "Writing"];

export default function PricingPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [packages, setPackages] = useState(MOCK_PACKAGES);

  const toggleBookmark = (id: string) => {
    setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, bookmarked: !pkg.bookmarked } : pkg));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSelectedLevel(null);
    setSelectedLanguage(null);
    setSelectedTags([]);
    setShowBookmarksOnly(false);
    setMaxPrice(200);
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesLevel = selectedLevel ? pkg.level === selectedLevel : true;
    const matchesLanguage = selectedLanguage ? pkg.language === selectedLanguage : true;
    const matchesTags = selectedTags.length > 0 ? pkg.tags.some(t => selectedTags.includes(t)) : true;
    const matchesBookmarks = showBookmarksOnly ? pkg.bookmarked : true;
    const matchesPrice = pkg.price <= maxPrice;
    return matchesLevel && matchesLanguage && matchesTags && matchesBookmarks && matchesPrice;
  });

  // Cooler background colors for packages
  const bgClasses = ["bg-blue-50", "bg-teal-50", "bg-purple-50", "bg-indigo-50"];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold text-indigo-600 flex justify-center items-center gap-2">
          💎 Lesson Packages & Pricing
        </h1>
        <p className="text-lg text-gray-700">
          Choose the perfect package for your language learning journey!
        </p>
      </header>

      <Separator />

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Level Filter */}
        <div className="flex flex-wrap gap-2">
          {LEVELS.map(level => (
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

        {/* Language Filter */}
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
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

        <Button size="sm" variant="destructive" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {TAGS.map(tag => (
          <Button
            key={tag}
            size="sm"
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Price Range & Bookmarks */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <p className="mb-2 text-gray-700">Max Price: ${maxPrice}</p>
          <Slider
            value={[maxPrice]}
            min={0}
            max={200}
            step={1}
            onValueChange={(value) => setMaxPrice(value[0])}
          />
        </div>
        <Button
          size="sm"
          variant={showBookmarksOnly ? "default" : "outline"}
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
        >
          {showBookmarksOnly ? "Showing Bookmarked Only" : "Show Bookmarks Only"}
        </Button>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg, idx) => (
          <Card
            key={pkg.id}
            className={`p-6 rounded-3xl shadow-md border-2 transition-all hover:shadow-xl ${
              pkg.popular ? "border-indigo-400" : "border-gray-200"
            } ${bgClasses[idx % bgClasses.length]}`}
          >
            <CardHeader className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  {pkg.title} - <span className="text-sm font-normal">{pkg.language}</span>
                  {pkg.popular && <Badge variant="destructive">Popular</Badge>}
                </CardTitle>
                <p className="text-gray-500">{pkg.duration} • {pkg.minutesPerLesson} min/lesson</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleBookmark(pkg.id)}
              >
                <Bookmark className={pkg.bookmarked ? "text-indigo-500" : "text-gray-400"} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-semibold">${pkg.price}</p>
              <p className="text-gray-600">{pkg.description}</p>
              <div className="flex flex-wrap gap-2">
                {pkg.tags.map(tag => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <Button
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                size="lg"
              >
                Enroll Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
