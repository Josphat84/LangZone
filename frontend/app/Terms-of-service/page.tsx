// frontend/app/terms-of-service/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfServicePage() {
  const sectionTitleClasses = "text-4xl font-extrabold text-gray-900 mb-6 text-center";
  const sectionParagraphClasses = "text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <section className="text-center mb-10">
          <h1 className={sectionTitleClasses}>Terms of Service</h1>
          <p className={sectionParagraphClasses}>
            Please read these terms carefully before using the LangZone platform.
          </p>
        </section>

        <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the LangZone website and services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.</p>

          <h2>2. Description of Service</h2>
          <p>LangZone provides an online platform connecting language learners with qualified instructors for one-on-one lessons and group courses. Our services include, but are not limited to, instructor profiles, scheduling tools, virtual classrooms, and payment processing.</p>

          <h2>3. User Accounts</h2>
          <ul>
            <li>To access certain features of the service, you must register for an account.</li>
            <li>You must be at least 18 years old to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account password and are responsible for all activities that occur under your account.</li>
          </ul>

          <h2>4. Payments and Fees</h2>
          <p>Fees for lessons and courses are clearly stated on the platform. All payments are processed securely through our designated payment gateway. LangZone reserves the right to change its fees or billing methods at any time.</p>

          <h2>5. Instructor Responsibilities</h2>
          <p>Instructors agree to provide high-quality language instruction, maintain professional conduct, and adhere to scheduled lessons. LangZone reserves the right to remove instructors who violate our community guidelines or fail to meet quality standards.</p>

          <h2>6. Learner Responsibilities</h2>
          <p>Learners agree to respect instructors' time, attend scheduled lessons, and use the platform responsibly. Any abuse or misuse of the platform may result in account termination.</p>

          <h2>7. Intellectual Property</h2>
          <p>All content on the LangZone platform, including text, graphics, logos, and software, is the property of LangZone or its licensors and is protected by intellectual property laws.</p>

          <h2>8. Limitation of Liability</h2>
          <p>LangZone shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the use or inability to use the service.</p>

          <h2>9. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles.</p>

          <h2>10. Changes to Terms</h2>
          <p>LangZone reserves the right to modify or replace these Terms at any time. We will provide notice of significant changes.</p>

          <p className="mt-8 text-sm text-gray-500">
            Last Updated: July 13, 2025
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}