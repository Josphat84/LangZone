// frontend/app/learning-guides/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LearningGuidesPage() {
  const sectionTitleClasses = "text-4xl font-extrabold text-gray-900 mb-6 text-center";
  const sectionParagraphClasses = "text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto";
  const guideCardClasses = "bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02]";

  const guides = [
    {
      slug: 'beginners-guide-to-spanish',
      title: 'Beginner\'s Guide to Learning Spanish',
      excerpt: 'Start your Spanish journey with essential phrases, grammar basics, and pronunciation tips.',
      imageUrl: '/images/guide-spanish.jpg', // Placeholder image
      imageAlt: 'Spanish flag and common phrases',
    },
    {
      slug: 'mastering-french-conjugation',
      title: 'Mastering French Verb Conjugation',
      excerpt: 'Demystify French verbs with this step-by-step guide to conjugations and common irregularities.',
      imageUrl: '/images/guide-french.jpg', // Placeholder image
      imageAlt: 'French verb conjugation chart',
    },
    {
      slug: 'essential-mandarin-for-travel',
      title: 'Essential Mandarin Phrases for Travel',
      excerpt: 'Learn key phrases for navigating, ordering food, and cultural etiquette in Mandarin-speaking regions.',
      imageUrl: '/images/guide-mandarin.jpg', // Placeholder image
      imageAlt: 'Chinese characters and travel symbols',
    },
    {
      slug: 'german-grammar-for-intermediate',
      title: 'German Grammar: A Guide for Intermediate Learners',
      excerpt: 'Deep dive into cases, word order, and more complex sentence structures in German.',
      imageUrl: '/images/guide-german.jpg', // Placeholder image
      imageAlt: 'German grammar rules',
    },
    {
      slug: 'korean-alphabet-made-easy',
      title: 'Korean Alphabet (Hangul) Made Easy',
      excerpt: 'Unlock reading and writing Korean quickly with this comprehensive guide to Hangul.',
      imageUrl: '/images/guide-korean.jpg', // Placeholder image
      imageAlt: 'Korean Hangul characters',
    },
    {
      slug: 'japanese-kana-and-kanji-intro',
      title: 'Introduction to Japanese Kana and Basic Kanji',
      excerpt: 'Understand Hiragana, Katakana, and your first Kanji characters for reading Japanese.',
      imageUrl: '/images/guide-japanese.jpg', // Placeholder image
      imageAlt: 'Japanese writing system',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-10">
          <h1 className={sectionTitleClasses}>Learning Guides</h1>
          <p className={sectionParagraphClasses}>
            Explore our curated guides to help you master new languages and improve your learning journey.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div key={guide.slug} className={guideCardClasses}>
              {/* Note: This links to a placeholder. You'd need to create /learning-guides/[slug]/page.tsx */}
              <Link href={`/learning-guides/${guide.slug}`} className="block">
                <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-t-xl">
                  <Image
                    src={guide.imageUrl}
                    alt={guide.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {guide.title}
                  </h2>
                  <p className="text-gray-700 text-base mb-4 flex-grow">
                    {guide.excerpt}
                  </p>
                  <span className="text-teal-600 font-semibold hover:text-teal-700 transition-colors mt-auto">
                    View Guide &rarr;
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}