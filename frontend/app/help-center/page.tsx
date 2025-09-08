// frontend/app/help-center/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FAQItemType = {
  question: string;
  answer: string;
};

const faqs: FAQItemType[] = [
  {
    question: 'How do I sign up for a language lesson?',
    answer: 'To sign up, simply navigate to the "Find Instructors" page, browse through the available teachers, and click "Book a Trial" or "Book Lesson" on their profile. You\'ll then be guided through the scheduling and payment process.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are securely processed through our platform.',
  },
  {
    question: 'Can I switch instructors if I\'m not satisfied?',
    answer: 'Yes, we want you to find the perfect match! If you\'re not satisfied with your instructor, please contact our support team within 24 hours of your lesson, and we\'ll help you find a suitable alternative or issue a credit.',
  },
  {
    question: 'Do you offer group lessons?',
    answer: 'Currently, LangZone primarily focuses on one-on-one personalized lessons to ensure maximum learning effectiveness. We are exploring options for group lessons in the future.',
  },
  {
    question: 'How do I become an instructor on LangZone?',
    answer: 'If you\'re passionate about teaching languages, visit our "Become an Instructor" page and fill out the application form. Our team will review your qualifications and experience.',
  },
  {
    question: 'What if I have technical issues during a lesson?',
    answer: 'If you encounter any technical issues, first try refreshing your browser or checking your internet connection. If the problem persists, immediately contact your instructor and our technical support team via the chat feature or contact form.',
  },
];

function FAQItem({ question, answer }: FAQItemType) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 rounded-xl">
      <CardContent className="p-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors text-left"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <span className="text-lg font-semibold text-gray-800 flex-grow">{question}</span>
          <span className="text-2xl text-teal-600 ml-4" aria-hidden="true">
            {isOpen ? '−' : '+'}
          </span>
        </button>
        {isOpen && (
          <div
            id={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
            className="p-5 text-gray-700 leading-relaxed"
          >
            {answer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-4xl">
        {/* Header Section */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Welcome to the LangZone Help Center! Find answers to common questions and get the support you need.
          </p>
        </section>

        {/* Search Bar */}
        <section className="mb-10">
          <div className="relative mb-6">
            <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
            <input
              id="faq-search"
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-base md:text-lg shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          ) : (
            <Card className="p-6 bg-white shadow-sm border border-gray-100 rounded-xl text-center text-gray-600">
              No FAQs found matching your search. Try a different query.
            </Card>
          )}
        </section>

        {/* Contact Section */}
        <section className="text-center p-6 bg-teal-50 rounded-xl shadow-md border border-teal-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Still Can't Find Your Answer?</h2>
          <p className="text-base text-gray-700 mb-4">
            Our support team is ready to help you.
          </p>
          <Link href="/contact">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-full shadow-md">
              Contact Our Support Team
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
