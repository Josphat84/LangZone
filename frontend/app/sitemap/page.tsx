// frontend/app/sitemap/page.tsx
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SitemapPage() {
  const sectionTitleClasses = "text-4xl font-extrabold text-gray-900 mb-6 text-center";
  const sectionParagraphClasses = "text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <section className="text-center mb-10">
          <h1 className={sectionTitleClasses}>Site Map</h1>
          <p className={sectionParagraphClasses}>
            A comprehensive list of all important pages on LangZone.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-lg">
            <div>
              <h2 className="font-bold text-teal-700 text-2xl mb-4">Main Sections</h2>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-700 hover:text-teal-600">Home</Link></li>
                <li><Link href="/find-instructors" className="text-gray-700 hover:text-teal-600">Find Instructors</Link></li>
                <li><Link href="/enterprise" className="text-gray-700 hover:text-teal-600">Enterprise Solutions</Link></li>
                <li><Link href="/courses" className="text-gray-700 hover:text-teal-600">Courses</Link></li>
                <li><Link href="/create-new-profile" className="text-gray-700 hover:text-teal-600">Become an Instructor</Link></li>
                <li><Link href="/blog" className="text-gray-700 hover:text-teal-600">Blog</Link></li>
                <li><Link href="/learning-guides" className="text-gray-700 hover:text-teal-600">Learning Guides</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-teal-700 text-2xl mb-4">Company & Support</h2>
              <ul className="space-y-2">
                <li><Link href="/about-us" className="text-gray-700 hover:text-teal-600">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-700 hover:text-teal-600">Contact Us</Link></li>
                <li><Link href="/help-center" className="text-gray-700 hover:text-teal-600">Help Center</Link></li>
                <li><Link href="/faq" className="text-gray-700 hover:text-teal-600">FAQ</Link></li>
                <li><Link href="/careers" className="text-gray-700 hover:text-teal-600">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-teal-700 text-2xl mb-4">Legal & Privacy</h2>
              <ul className="space-y-2">
                <li><Link href="/terms-of-service" className="text-gray-700 hover:text-teal-600">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-700 hover:text-teal-600">Privacy Policy</Link></li>
                {/* Add more legal pages as needed */}
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-teal-700 text-2xl mb-4">Other Features</h2>
              <ul className="space-y-2">
                <li><Link href="/rewards" className="text-gray-700 hover:text-teal-600">Rewards Program</Link></li>
                <li><Link href="/saved-instructors" className="text-gray-700 hover:text-teal-600">Saved Instructors</Link></li>
                <li><Link href="/alerts" className="text-gray-700 hover:text-teal-600">Alerts</Link></li>
                {/* Add more as relevant */}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}