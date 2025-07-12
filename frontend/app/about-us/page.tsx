// frontend/app/about-us/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function AboutUsPage() {
  // Common Tailwind CSS classes for consistency
  const sectionTitleClasses = "text-4xl font-extrabold text-gray-900 mb-6 text-center";
  const sectionParagraphClasses = "text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto";
  const cardClasses = "bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Header - Reusing your existing header structure */}
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-teal-700">
              <Image src="/icons/logo-icon.svg" alt="App Logo" width={28} height={28} />
              <span>LangZone</span>
            </Link>
            <nav className="hidden md:flex space-x-5">
              <Link href="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Find Instructors</Link>
              <Link href="/enterprise" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Enterprise Solutions</Link>
              <Link href="/courses" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Courses</Link>
              <Link href="/create-new-profile" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Become an Instructor</Link>
              <Link href="/about-us" className="text-teal-600 font-medium transition-colors">About Us</Link>{/* Added link */}
            </nav>
          </div>
          <div className="flex items-center space-x-5">
            <Link href="/rewards" className="text-gray-600 hover:text-teal-600 transition-colors hidden sm:block">Rewards</Link>
            <div className="relative">
              <select className="border border-gray-200 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 appearance-none bg-white pr-8">
                <option>English ($USD)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
              </div>
            </div>
            <Link href="/saved-instructors" className="text-gray-600 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </Link>
            <Link href="/alerts" className="text-gray-600 hover:text-teal-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </Link>
            <button className="bg-teal-600 text-white py-2 px-5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md">Sign In</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section for About Us */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-teal-700 mb-4 animate-fadeInDown">
            About LangZone
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-fadeInUp">
            At LangZone, we believe that learning a new language should be an empowering, accessible, and enjoyable journey for everyone. We connect passionate language learners with expert instructors from around the globe, fostering a vibrant community dedicated to linguistic and cultural exchange.
          </p>
        </section>

        {/* Our Mission Section */}
        <section className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Our mission is to break down language barriers and build bridges between cultures by providing personalized, high-quality language education. We strive to make authentic language learning accessible to anyone, anywhere, empowering them to communicate confidently and explore the world with new eyes.
          </p>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <h2 className={sectionTitleClasses}>Our Core Values</h2>
          <p className="text-lg text-gray-700 mb-10 text-center max-w-3xl mx-auto">
            These principles guide everything we do, from designing our platform to supporting our community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={cardClasses + " animate-fadeInUp delay-100"}>
              <div className="text-teal-600 mb-4">
                <svg className="w-12 h-12 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM14.71 14.71l-2.71-2.71c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l2 2c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zM13 7h-2v5c0 .55.45 1 1 1s1-.45 1-1V7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center md:text-left">Accessibility</h3>
              <p className="text-gray-700 text-center md:text-left flex-grow">
                We believe everyone, regardless of their location or background, should have the opportunity to learn a new language. We strive to keep our platform affordable and user-friendly.
              </p>
            </div>

            <div className={cardClasses + " animate-fadeInUp delay-200"}>
              <div className="text-teal-600 mb-4">
                <svg className="w-12 h-12 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center md:text-left">Community</h3>
              <p className="text-gray-700 text-center md:text-left flex-grow">
                Language learning thrives in connection. We foster a supportive and engaging global community of learners and instructors.
              </p>
            </div>

            <div className={cardClasses + " animate-fadeInUp delay-300"}>
              <div className="text-teal-600 mb-4">
                <svg className="w-12 h-12 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM17.71 10.29l-4.5 4.5c-.39.39-1.02.39-1.41 0L6.29 9.71c-.39-.39-.39-1.02 0-1.41s1.02-.39 1.41 0L12 12.59l4.5-4.5c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center md:text-left">Effectiveness</h3>
              <p className="text-gray-700 text-center md:text-left flex-grow">
                We are committed to providing effective learning tools and experienced instructors who deliver tangible results and progress.
              </p>
            </div>

            <div className={cardClasses + " animate-fadeInUp delay-400"}>
              <div className="text-teal-600 mb-4">
                <svg className="w-12 h-12 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM15.5 8h-7c-.83 0-1.5-.67-1.5-1.5S7.67 5 8.5 5h7c.83 0 1.5.67 1.5 1.5S16.33 8 15.5 8zm-8 4h7c.83 0 1.5-.67 1.5-1.5S16.33 9 15.5 9h-7c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center md:text-left">Innovation</h3>
              <p className="text-gray-700 text-center md:text-left flex-grow">
                We continuously evolve, integrating the latest educational technologies and teaching methodologies to enhance the learning experience.
              </p>
            </div>

            <div className={cardClasses + " animate-fadeInUp delay-500"}>
              <div className="text-teal-600 mb-4">
                <svg className="w-12 h-12 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 17.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 8.5 12 8.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center md:text-left">Passion</h3>
              <p className="text-gray-700 text-center md:text-left flex-grow">
                We are passionate about languages, cultures, and empowering individuals to connect with the world through communication.
              </p>
            </div>
          </div>
        </section>

        {/* Our Team Section (Placeholder) */}
        <section className="mb-16">
          <h2 className={sectionTitleClasses}>Meet Our Team</h2>
          <p className={sectionParagraphClasses}>
            We're a dedicated group of language enthusiasts, educators, and technologists committed to transforming how the world learns languages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Team Member Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center animate-fadeInUp delay-600">
              <Image
                src="/images/image_299f1c.png" // Use one of your uploaded images
                alt="Team Member 1"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 object-cover w-32 h-32"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jane Doe</h3>
              <p className="text-teal-600 font-semibold mb-2">Co-founder & CEO</p>
              <p className="text-gray-700 text-sm">
                With a background in linguistics and a passion for education, Jane envisioned LangZone as a global classroom.
              </p>
            </div>

            {/* Example Team Member Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center animate-fadeInUp delay-700">
              <Image
                src="/images/image_299397.jpg" // Use another one of your uploaded images
                alt="Team Member 2"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 object-cover w-32 h-32"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">John Smith</h3>
              <p className="text-teal-600 font-semibold mb-2">Head of Product</p>
              <p className="text-gray-700 text-sm">
                John leverages his expertise in software development to build intuitive and effective learning tools.
              </p>
            </div>

            {/* Example Team Member Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center animate-fadeInUp delay-800">
              <Image
                src="/images/default-avatar.jpg" // Placeholder if you don't have another specific image
                alt="Team Member 3"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 object-cover w-32 h-32"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emily White</h3>
              <p className="text-teal-600 font-semibold mb-2">Lead Educator</p>
              <p className="text-gray-700 text-sm">
                Emily ensures our curriculum is engaging and aligned with the best language acquisition practices.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-teal-700 text-white p-12 rounded-xl shadow-lg text-center animate-fadeIn">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Language Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore our diverse range of instructors and find the perfect match to help you achieve your linguistic goals.
          </p>
          <Link href="/" className="bg-white text-teal-700 py-3 px-8 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-md">
            Find Your Instructor
          </Link>
        </section>
      </main>

      {/* Footer - Reusing your existing footer structure */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-6 text-center mt-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8">
            <div>
              <h6 className="font-bold text-white mb-4">LangZone</h6>
              <ul className="space-y-2">
                <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>{/* Updated link */}
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white mb-4">Learn</h6>
              <ul className="space-y-2">
                <li><Link href="/learn/english" className="hover:text-white transition-colors">Learn English</Link></li>
                <li><Link href="/learn/spanish" className="hover:text-white transition-colors">Learn Spanish</Link></li>
                <li><Link href="/learn/french" className="hover:text-white transition-colors">Learn French</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white mb-4">Support</h6>
              <ul className="space-y-2">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white mb-4">Connect</h6>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885V5H9v3z"></path></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.892-.959-2.173-1.559-3.591-1.559-3.447 0-6.227 2.78-6.227 6.227 0 .486.058.96.173 1.411-5.18-.26-9.77-2.73-12.898-6.472-.538.924-.848 1.996-.848 3.13 0 2.152 1.097 4.045 2.766 5.158-.807-.025-1.568-.247-2.228-.616v.086c0 3.02 2.13 5.544 4.935 6.107-.464.12-.953.187-1.456.187-.359 0-.709-.035-1.05-.1 1.04-.325 1.92-1.274 2.144-2.268 2.457 1.921 5.626 3.324 9.407 3.324 11.3 0 17.5-9.314 17.5-17.498 0-.486-.025-.96-.075-1.424.97-.699 1.81-1.593 2.47-2.585z"></path></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LangZone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}