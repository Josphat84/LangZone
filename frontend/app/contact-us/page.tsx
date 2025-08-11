// frontend/app/contact/page.tsx
'use client'; // This directive is crucial for using client-side hooks like useState

import { useState } from 'react';
import Image from 'next/image'; // Assuming you have a logo image
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', { // Path to your API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
      } else {
        const errorData = await response.json();
        setSubmissionStatus('error');
        setErrorMessage(errorData.message || 'An unknown error occurred.');
        console.error('Form submission failed:', errorData);
      }
    } catch (error) {
      setSubmissionStatus('error');
      setErrorMessage('Network error. Please check your connection.');
      console.error('Error during form submission:', error);
    }
  };

  // Common Tailwind CSS classes for consistency
  const sectionTitleClasses = "text-4xl font-extrabold text-gray-900 mb-6 text-center";
  const sectionParagraphClasses = "text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Header - Reusing your existing header structure from AboutUsPage */}
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
              <Link href="/about-us" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">About Us</Link>
              <Link href="/contact" className="text-teal-600 font-medium transition-colors">Contact Us</Link> {/* Highlighted link */}
              <Link href="/help-center" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Help Center</Link> {/* Added Help Center link */}
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

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <section className="text-center mb-10">
          <h1 className={sectionTitleClasses}>Contact Us</h1>
          <p className={sectionParagraphClasses}>
            Have a question, feedback, or need support? Fill out the form below, and we'll get back to you as soon as possible.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-10 animate-fadeIn">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-teal-500 transition-colors resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
              disabled={submissionStatus === 'submitting'}
            >
              {submissionStatus === 'submitting' ? 'Sending Message...' : 'Send Message'}
            </button>

            {submissionStatus === 'success' && (
              <p className="text-center text-green-600 mt-4 font-semibold">
                Your message has been sent successfully! We will get back to you soon.
              </p>
            )}
            {submissionStatus === 'error' && (
              <p className="text-center text-red-600 mt-4 font-semibold">
                There was an error sending your message: {errorMessage}. Please try again later.
              </p>
            )}
          </form>
        </section>

        <section className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Ways to Reach Us</h2>
          <p className="text-lg text-gray-700 mb-2">Email: <a href="mailto:support@langzone.com" className="text-teal-600 hover:underline">support@langzone.com</a></p>
          <p className="text-lg text-gray-700 mb-2">Phone: <a href="tel:+1234567890" className="text-teal-600 hover:underline">+263778973142</a></p>
          <p className="text-lg text-gray-700">Address: 123 Language Lane, Fluent City, Global Hub, 45678</p>
        </section>
      </main>

      
    </div>
  );
}