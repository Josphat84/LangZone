// frontend/app/faq/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const sectionTitleClasses = "text-4xl font-extrabold text-gray-900 mb-6 text-center";
  const sectionParagraphClasses = "text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto";
  const faqItemClasses = "bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6";
  const questionClasses = "text-xl font-semibold text-teal-700 mb-3";
  const answerClasses = "text-gray-700 leading-relaxed";

  const faqs = [
    {
      question: "How do I find an instructor?",
      answer: "You can use our 'Find Instructors' page to browse by language, specialty, availability, and price. You can also view instructor profiles to learn more about their experience and teaching style."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept major credit cards (Visa, MasterCard, Amex) and PayPal. All payments are securely processed through our platform."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "If you're not satisfied with your first lesson with a new instructor, please contact our support team within 24 hours, and we'll review your case for a potential refund or credit."
    },
    {
      question: "How do I become an instructor on LangZone?",
      answer: "Visit our 'Become an Instructor' page and fill out the application form. We review applications to ensure instructors meet our quality standards and language proficiency requirements."
    },
    {
      question: "Are lessons conducted live?",
      answer: "Yes, all one-on-one lessons and most group courses are conducted live via our integrated virtual classroom, which supports video, audio, and chat functions."
    },
    {
      question: "What if I need to reschedule or cancel a lesson?",
      answer: "You can reschedule or cancel lessons directly from your dashboard. Please note that our cancellation policy requires at least 24 hours' notice to avoid being charged for the lesson."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <section className="text-center mb-10">
          <h1 className={sectionTitleClasses}>Frequently Asked Questions</h1>
          <p className={sectionParagraphClasses}>
            Find answers to the most common questions about LangZone's services.
          </p>
        </section>

        <section>
          {faqs.map((faq, index) => (
            <div key={index} className={faqItemClasses}>
              <h2 className={questionClasses}>{faq.question}</h2>
              <p className={answerClasses}>{faq.answer}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}