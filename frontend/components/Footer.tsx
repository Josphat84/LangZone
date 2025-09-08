import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-teal-600 text-white py-10 px-6 mt-12 shadow-inner">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h6 className="font-bold text-lg mb-4">LangZone</h6>
          <ul className="space-y-2">
            <li><Link href="/about-us" className="hover:text-teal-200 transition-colors">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-teal-200 transition-colors">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-teal-200 transition-colors">Blog</Link></li>
            <li><Link href="/sitemap" className="hover:text-teal-200 transition-colors">Sitemap</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-bold text-lg mb-4">Learn</h6>
          <ul className="space-y-2">
            <li><Link href="/learning-guides" className="hover:text-teal-200 transition-colors">Learning Guides</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-bold text-lg mb-4">Support</h6>
          <ul className="space-y-2">
            <li><Link href="/faq" className="hover:text-teal-200 transition-colors">FAQ</Link></li>
            <li><Link href="/contact-us" className="hover:text-teal-200 transition-colors">Contact Us</Link></li>
            <li><Link href="/help-center" className="hover:text-teal-200 transition-colors">Help Center</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-teal-200 transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-teal-200 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-center text-gray-200 text-sm">
        &copy; {new Date().getFullYear()} Still-to-be-named Inc. All rights reserved.
      </p>
    </footer>
  );
}
