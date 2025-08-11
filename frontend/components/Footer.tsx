// frontend/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-6 text-center mt-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8">
          <div>
            <h6 className="font-bold text-white mb-4">LangZone</h6>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-white mb-4">Learn</h6>
            <ul className="space-y-2">
              <li><Link href="/learning-guides" className="hover:text-white transition-colors">Learning Guides</Link></li>
              <li><Link href="/learn/english" className="hover:text-white transition-colors">Learn English</Link></li>
              <li><Link href="/learn/spanish" className="hover:text-white transition-colors">Learn Spanish</Link></li>
              <li><Link href="/learn/french" className="hover:text-white transition-colors">Learn French</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-white mb-4">Support</h6>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-white mb-4">Connect</h6>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a 
                href="https://www.facebook.com/langzone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors" 
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885V5H9v3z"></path>
                </svg>
              </a>
              <a 
                href="https://twitter.com/langzone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors" 
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.892-.959-2.173-1.559-3.591-1.559-3.447 0-6.227 2.78-6.227 6.227 0 .486.058.96.173 1.411-5.18-.26-9.77-2.73-12.898-6.472-.538.924-.848 1.996-.848 3.13 0 2.152 1.097 4.045 2.766 5.158-.807-.025-1.568-.247-2.228-.616v.086c0 3.02 2.13 5.544 4.935 6.107-.464.12-.953.187-1.456.187-.359 0-.709-.035-1.05-.1 1.04-.325 1.92-1.274 2.144-2.268 2.457 1.921 5.626 3.324 9.407 3.324 11.3 0 17.5-9.314 17.5-17.498 0-.486-.025-.96-.075-1.424.97-.699 1.81-1.593 2.47-2.585z"></path>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/langzone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors" 
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/langzone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors" 
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} LangZone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}