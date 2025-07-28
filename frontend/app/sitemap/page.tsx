// frontend/app/sitemap/page.tsx
import Link from 'next/link';

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-4xl">
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Site Map
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            A comprehensive list of all important pages on LangZone.
          </p>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-6">
            <div>
              <h2 className="font-bold text-teal-700 text-xl md:text-2xl mb-3 md:mb-4">Main Sections</h2>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-700 hover:text-teal-600 transition-colors">Home</Link></li>
                <li><Link href="/find-instructors" className="text-gray-700 hover:text-teal-600 transition-colors">Find Instructors</Link></li>
                <li><Link href="/enterprise" className="text-gray-700 hover:text-teal-600 transition-colors">Enterprise Solutions</Link></li>
                <li><Link href="/courses" className="text-gray-700 hover:text-teal-600 transition-colors">Courses</Link></li>
                <li><Link href="/create-new-profile" className="text-gray-700 hover:text-teal-600 transition-colors">Become an Instructor</Link></li>
                <li><Link href="/blog" className="text-gray-700 hover:text-teal-600 transition-colors">Blog</Link></li>
                <li><Link href="/learning-guides" className="text-gray-700 hover:text-teal-600 transition-colors">Learning Guides</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-teal-700 text-xl md:text-2xl mb-3 md:mb-4">Company & Support</h2>
              <ul className="space-y-2">
                <li><Link href="/about-us" className="text-gray-700 hover:text-teal-600 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-700 hover:text-teal-600 transition-colors">Contact Us</Link></li>
                <li><Link href="/help-center" className="text-gray-700 hover:text-teal-600 transition-colors">Help Center</Link></li>
                <li><Link href="/faq" className="text-gray-700 hover:text-teal-600 transition-colors">FAQ</Link></li>
                <li><Link href="/careers" className="text-gray-700 hover:text-teal-600 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-teal-700 text-xl md:text-2xl mb-3 md:mb-4">Legal & Privacy</h2>
              <ul className="space-y-2">
                <li><Link href="/terms-of-service" className="text-gray-700 hover:text-teal-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-700 hover:text-teal-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-teal-700 text-xl md:text-2xl mb-3 md:mb-4">Other Features</h2>
              <ul className="space-y-2">
                <li><Link href="/rewards" className="text-gray-700 hover:text-teal-600 transition-colors">Rewards Program</Link></li>
                <li><Link href="/saved-instructors" className="text-gray-700 hover:text-teal-600 transition-colors">Saved Instructors</Link></li>
                <li><Link href="/alerts" className="text-gray-700 hover:text-teal-600 transition-colors">Alerts</Link></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}