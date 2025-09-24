'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Star } from "lucide-react";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  imageUrl?: string; // optional
  imageAlt?: string;
  tags: string[];
};

export default function BlogListingPage() {
  const blogPosts: BlogPost[] = [
    {
      slug: "mastering-pronunciation-tips",
      title: "Mastering Pronunciation: Tips from a Polyglot",
      date: "July 10, 2025",
      author: "Dr. Anya Sharma",
      excerpt:
        "Struggling with those tricky sounds? Dr. Sharma shares her top techniques for perfecting your accent and speaking with confidence.",
      tags: ["Pronunciation", "Tips", "Polyglot"],
    },
    {
      slug: "the-power-of-language-exchange",
      title: "The Power of Language Exchange: Beyond the Classroom",
      date: "July 5, 2025",
      author: "Maria Rodriguez",
      excerpt:
        "Discover how connecting with native speakers can accelerate your learning journey and open doors to new cultures.",
      tags: ["Exchange", "Culture", "Learning"],
    },
    {
      slug: "unlocking-grammar-secrets",
      title: "Unlocking Grammar Secrets: A Beginner's Guide",
      date: "June 28, 2025",
      author: "Prof. David Lee",
      excerpt:
        "Grammar doesn't have to be daunting! This guide breaks down essential concepts into easy-to-understand chunks.",
      tags: ["Grammar", "Beginner", "Tips"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800 py-12">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            LangZone Blog
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Dive into our articles for language learning tips, cultural insights, and instructor spotlights.
          </p>
        </section>

        {/* Blog Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                {/* Optional Image */}
                <div className="relative w-full aspect-video bg-teal-100 flex items-center justify-center text-gray-500">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <span className="text-3xl font-bold">{post.title.charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <CardContent className="flex flex-col flex-grow p-5 space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    By {post.author} on {post.date}
                  </p>
                  <p className="text-gray-700 text-sm md:text-base flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} className="bg-teal-100 text-teal-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex justify-between items-center px-5 pb-5 pt-0">
                  <Button variant="link" className="text-teal-600 hover:text-teal-700 p-0">
                    Read More &rarr;
                  </Button>
                  <Bookmark className="w-5 h-5 text-gray-400 hover:text-teal-600 cursor-pointer" />
                </CardFooter>
              </Link>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
