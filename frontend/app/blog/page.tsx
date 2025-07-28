// frontend/app/blog/page.tsx
import Image from 'next/image';
import Link from 'next/link';

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
      slug: 'mastering-pronunciation-tips',
      title: 'Mastering Pronunciation: Tips from a Polyglot',
      date: 'July 10, 2025',
      author: 'Dr. Anya Sharma',
      excerpt: 'Struggling with those tricky sounds? Dr. Sharma shares her top techniques for perfecting your accent and speaking with confidence.',
      imageUrl: '/images/blog-pronunciation.jpg',
      imageAlt: 'Person speaking clearly',
    },
    {
      slug: 'the-power-of-language-exchange',
      title: 'The Power of Language Exchange: Beyond the Classroom',
      date: 'July 5, 2025',
      author: 'Maria Rodriguez',
      excerpt: 'Discover how connecting with native speakers can accelerate your learning journey and open doors to new cultures.',
      imageUrl: '/images/blog-language-exchange.jpg',
      imageAlt: 'Two people talking in a cafe, exchanging languages',
    },
    {
      slug: 'unlocking-grammar-secrets',
      title: 'Unlocking Grammar Secrets: A Beginner\'s Guide',
      date: 'June 28, 2025',
      author: 'Prof. David Lee',
      excerpt: 'Grammar doesn\'t have to be daunting! This guide breaks down essential concepts into easy-to-understand chunks.',
      imageUrl: '/images/blog-grammar.jpg',
      imageAlt: 'Open grammar book with notes',
    },
    {
      slug: 'cultural-immersion-from-home',
      title: 'Cultural Immersion: How to Experience a New Culture Without Leaving Home',
      date: 'June 20, 2025',
      author: 'Sophie Dubois',
      excerpt: 'Learn how movies, music, and online communities can transport you to your target language\'s culture.',
      imageUrl: '/images/blog-culture.jpg',
      imageAlt: 'World map with cultural symbols',
    },
    {
      slug: 'benefits-of-learning-multiple-languages',
      title: 'The Surprising Benefits of Learning Multiple Languages',
      date: 'June 15, 2025',
      author: 'Dr. Emily Chen',
      excerpt: 'Beyond communication, discover the cognitive and personal advantages of becoming multilingual.',
      imageUrl: '/images/blog-multilingual.jpg',
      imageAlt: 'Multiple flags representing different languages',
    },
    {
      slug: 'best-apps-for-language-learners',
      title: 'Top 5 Apps Every Language Learner Needs',
      date: 'June 8, 2025',
      author: 'Alex Jenson',
      excerpt: 'From vocabulary building to pronunciation practice, these apps will supercharge your learning.',
      imageUrl: '/images/blog-apps.jpg',
      imageAlt: 'Smartphone with language learning app icons',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            LangZone Blog
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Dive into our articles for language learning tips, cultural insights, and instructor spotlights.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article 
              key={post.slug} 
              className="bg-white rounded-lg shadow-md border border-gray-100 flex flex-col h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority={false}
                  />
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mb-3">
                    By {post.author} on {post.date}
                  </p>
                  <p className="text-gray-700 text-sm md:text-base mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <span className="text-teal-600 font-semibold hover:text-teal-700 transition-colors mt-auto inline-block">
                    Read More &rarr;
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