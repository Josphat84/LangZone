// app/resources/page.tsx

'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Book, FileText, Youtube, ToolCase, Download, Star, Bookmark } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  type: "Video" | "Article" | "Tool" | "PDF";
  categories: string[];
  description: string;
  link: string;
  rating: number;
  bookmarked?: boolean;
};

const MOCK_RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "Spanish Basics",
    type: "Video",
    categories: ["Grammar", "Vocabulary"],
    description: "Learn basic Spanish phrases and vocabulary.",
    link: "https://youtube.com",
    rating: 5,
  },
  {
    id: "res-2",
    title: "French Grammar Guide",
    type: "PDF",
    categories: ["Grammar"],
    description: "Downloadable PDF guide for French grammar.",
    link: "#",
    rating: 4,
  },
  {
    id: "res-3",
    title: "Pronunciation Practice Tool",
    type: "Tool",
    categories: ["Speaking", "Listening"],
    description: "Interactive tool to practice pronunciation in multiple languages.",
    link: "#",
    rating: 5,
  },
  {
    id: "res-4",
    title: "Japanese Writing Article",
    type: "Article",
    categories: ["Writing", "Vocabulary"],
    description: "Detailed article on Japanese writing systems and tips.",
    link: "#",
    rating: 4,
  },
];

const RESOURCE_TYPES = ["Video", "Article", "Tool", "PDF"];
const RESOURCE_CATEGORIES = ["Grammar", "Vocabulary", "Speaking", "Listening", "Writing"];

export default function LanguageResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [resources, setResources] = useState(MOCK_RESOURCES);

  const toggleBookmark = (id: string) => {
    setResources(resources.map(res => res.id === id ? { ...res, bookmarked: !res.bookmarked } : res));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? res.type === selectedType : true;
    const matchesCategory = selectedCategories.length > 0 ? res.categories.some(c => selectedCategories.includes(c)) : true;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "Video": return <Youtube className="text-red-500 w-6 h-6" />;
      case "Article": return <FileText className="text-blue-500 w-6 h-6" />;
      case "Tool": return <ToolCase className="text-green-500 w-6 h-6" />;
      case "PDF": return <Download className="text-purple-500 w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold text-indigo-600 flex justify-center items-center gap-2">
          📚 Language Learning Resources
        </h1>
        <p className="text-lg text-gray-700">Browse videos, articles, and tools to improve your language skills!</p>
      </header>

      <Separator />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex flex-wrap gap-2">
          {RESOURCE_TYPES.map(type => (
            <Button
              key={type}
              size="sm"
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2">
        {RESOURCE_CATEGORIES.map(cat => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategories.includes(cat) ? "default" : "outline"}
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* File Upload */}
      <div className="flex items-center gap-4">
        <Input type="file" className="flex-1" />
        <Button>Upload File</Button>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => (
          <Card key={res.id} className="p-6 rounded-3xl shadow-md border-2 border-gray-200 hover:shadow-xl transition-all">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getIcon(res.type)}
                <CardTitle className="text-lg font-bold">{res.title}</CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleBookmark(res.id)}
              >
                <Bookmark className={res.bookmarked ? "text-yellow-500" : "text-gray-400"} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">{res.description}</p>
              <div className="flex flex-wrap gap-1">
                {res.categories.map(cat => <Badge key={cat}>{cat}</Badge>)}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: res.rating }).map((_, i) => (
                    <Star key={i} className="text-yellow-400 w-4 h-4" />
                  ))}
                </div>
                <Button size="sm" className="text-sm" asChild>
                  <a href={res.link} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
