import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 text-white py-16 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400/30 via-teal-300/50 to-teal-400/30"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-teal-500/10"></div>
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-teal-400/10"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-5">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h6 className="font-bold text-2xl bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                LangZone
              </h6>
            </div>
            <p className="text-teal-100 mb-6 font-medium leading-relaxed">
              Bridging language barriers and connecting cultures through innovative learning solutions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-teal-500 transition-all duration-300 p-3 rounded-full"
                aria-label="Visit our Facebook page"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-teal-500 transition-all duration-300 p-3 rounded-full"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-teal-500 transition-all duration-300 p-3 rounded-full"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-teal-500 transition-all duration-300 p-3 rounded-full"
                aria-label="Connect with us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-teal-500 transition-all duration-300 p-3 rounded-full"
                aria-label="Watch our YouTube channel"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Learn Section */}
          <div>
            <div className="flex items-center mb-5">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h6 className="font-bold text-xl">Learn</h6>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/learning-guides"
                  className="hover:text-teal-200 transition-colors duration-300 flex items-center font-medium group"
                >
                  <span className="w-2 h-2 bg-teal-300 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Learning Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-teal-200 transition-colors duration-300 flex items-center font-medium group"
                >
                  <span className="w-2 h-2 bg-teal-300 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="hover:text-teal-200 transition-colors duration-300 flex items-center font-medium group"
                >
                  <span className="w-2 h-2 bg-teal-300 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/practice"
                  className="hover:text-teal-200 transition-colors duration-300 flex items-center font-medium group"
                >
                  <span className="w-2 h-2 bg-teal-300 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Practice Exercises
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h6 className="font-bold text-xl mb-5">Company</h6>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <div className="flex items-center mb-5">
              <div className="bg-white/10 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h6 className="font-bold text-xl">Support</h6>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-teal-200 transition-colors duration-300 font-medium block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-10 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-xl mb-2">Stay Updated</h3>
              <p className="text-teal-100 max-w-md">Subscribe to our newsletter for language learning tips and updates.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800 w-full md:w-64"
              />
              <button className="bg-teal-500 hover:bg-teal-400 transition-colors duration-300 px-6 py-3 rounded-r-lg font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-white/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left text-teal-100 text-sm font-medium tracking-wide mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} No Name Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-teal-100 text-sm">
            <span>English</span>
            <span className="text-white">|</span>
            <span>Español</span>
            <span className="text-white">|</span>
            <span>Français</span>
          </div>
        </div>
      </div>
    </footer>
  );
}