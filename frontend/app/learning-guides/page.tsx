// frontend/app/learning-guides/page.tsx
import Image from 'next/image';
import Link from 'next/link';

type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
};

export default function LearningGuidesPage() {
  const guides: Guide[] = [
    {
      slug: 'beginners-guide-to-spanish',
      title: 'Beginner\'s Guide to Learning Spanish',
      excerpt: 'Start your Spanish journey with essential phrases, grammar basics, and pronunciation tips.',
      imageUrl: '/images/guide-spanish.jpg',
      imageAlt: 'Spanish flag and common phrases',
    },
    {
      slug: 'mastering-french-conjugation',
      title: 'Mastering French Verb Conjugation',
      excerpt: 'Demystify French verbs with this step-by-step guide to conjugations and common irregularities.',
      imageUrl: '/images/guide-french.jpg',
      imageAlt: 'French verb conjugation chart',
    },
    {
      slug: 'essential-mandarin-for-travel',
      title: 'Essential Mandarin Phrases for Travel',
      excerpt: 'Learn key phrases for navigating, ordering food, and cultural etiquette in Mandarin-speaking regions.',
      imageUrl: '/images/guide-mandarin.jpg',
      imageAlt: 'Chinese characters and travel symbols',
    },
    {
      slug: 'german-grammar-for-intermediate',
      title: 'German Grammar: A Guide for Intermediate Learners',
      excerpt: 'Deep dive into cases, word order, and more complex sentence structures in German.',
      imageUrl: '/images/guide-german.jpg',
      imageAlt: 'German grammar rules',
    },
    {
      slug: 'korean-alphabet-made-easy',
      title: 'Korean Alphabet (Hangul) Made Easy',
      excerpt: 'Unlock reading and writing Korean quickly with this comprehensive guide to Hangul.',
      imageUrl: '/images/guide-korean.jpg',
      imageAlt: 'Korean Hangul characters',
    },
    {
      slug: 'japanese-kana-and-kanji-intro',
      title: 'Introduction to Japanese Kana and Basic Kanji',
      excerpt: 'Understand Hiragana, Katakana, and your first Kanji characters for reading Japanese.',
      imageUrl: '/images/guide-japanese.jpg',
      imageAlt: 'Japanese writing system',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Learning Guides
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Explore our curated guides to help you master new languages and improve your learning journey.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <article 
              key={guide.slug} 
              className="bg-white rounded-lg shadow-md border border-gray-100 flex flex-col h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <Link href={`/learning-guides/${guide.slug}`} className="block h-full">
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={guide.imageUrl}
                    alt={guide.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority={false}
                  />
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {guide.title}
                  </h2>
                  <p className="text-gray-700 text-sm md:text-base mb-4 flex-grow">
                    {guide.excerpt}
                  </p>
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