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
      
    </div>
  );
}