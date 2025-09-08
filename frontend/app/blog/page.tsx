// frontend/app/blog/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
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
      imageUrl: "/images/blog-pronunciation.jpg",
      imageAlt: "Person speaking clearly",
    },
    {
      slug: "the-power-of-language-exchange",
      title: "The Power of Language Exchange: Beyond the Classroom",
      date: "July 5, 2025",
      author: "Maria Rodriguez",
      excerpt:
        "Discover how connecting with native speakers can accelerate your learning journey and open doors to new cultures.",
      imageUrl: "/images/blog-language-exchange.jpg",
      imageAlt: "Two people talking in a cafe, exchanging languages",
    },
    {
      slug: "unlocking-grammar-secrets",
      title: "Unlocking Grammar Secrets: A Beginner's Guide",
      date: "June 28, 2025",
      author: "Prof. David Lee",
      excerpt:
        "Grammar doesn't have to be daunting! This guide breaks down essential concepts into easy-to-understand chunks.",
      imageUrl: "/images/blog-grammar.jpg",
      imageAlt: "Open grammar book with notes",
    },
    {
      slug: "cultural-immersion-from-home",
      title: "Cultural Immersion: How to Experience a New Culture Without Leaving Home",
      date: "June 20, 2025",
      author: "Sophie Dubois",
      excerpt:
        "Learn how movies, music, and online communities can transport you to your target language's culture.",
      imageUrl: "/images/blog-culture.jpg",
      imageAlt: "World map with cultural symbols",
    },
    {
      slug: "benefits-of-learning-multiple-languages",
      title: "The Surprising Benefits of Learning Multiple Languages",
      date: "June 15, 2025",
      author: "Dr. Emily Chen",
      excerpt:
        "Beyond communication, discover the cognitive and personal advantages of becoming multilingual.",
      imageUrl: "/images/blog-multilingual.jpg",
      imageAlt: "Multiple flags representing different languages",
    },
    {
      slug: "best-apps-for-language-learners",
      title: "Top 5 Apps Every Language Learner Needs",
      date: "June 8, 2025",
      author: "Alex Jenson",
      excerpt:
        "From vocabulary building to pronunciation practice, these apps will supercharge your learning.",
      imageUrl: "/images/blog-apps.jpg",
      imageAlt: "Smartphone with language learning app icons",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-12">
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
                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <CardContent className="flex flex-col flex-grow p-5">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mb-3">
                    By {post.author} on {post.date}
                  </p>
                  <p className="text-gray-700 text-sm md:text-base flex-grow mb-4">
                    {post.excerpt}
                  </p>
                </CardContent>

                {/* Read More Button */}
                <CardFooter className="px-5 pb-5 pt-0">
                  <Button variant="link" className="text-teal-600 hover:text-teal-700 p-0">
                    Read More &rarr;
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
