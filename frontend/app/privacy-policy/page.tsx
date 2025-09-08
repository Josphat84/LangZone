// frontend/app/privacy-policy/page.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-4xl">
        {/* Header Section */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Your privacy is critically important to us. This policy outlines how LangZone collects, uses, and protects your information.
          </p>
        </section>

        {/* Policy Content */}
        <Card className="bg-white border border-gray-100 shadow-md rounded-xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Section 1 */}
            <h2 className="text-2xl font-bold mt-6 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold mt-4 mb-2">1.1. Personal Information</h3>
            <p className="text-base text-gray-700 leading-relaxed">
              We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Identity Data:</strong> Name, username, date of birth.</li>
              <li><strong>Contact Data:</strong> Email address, billing address, phone numbers.</li>
              <li><strong>Financial Data:</strong> Payment card details (processed by secure third-party payment processors).</li>
              <li><strong>Profile Data:</strong> Your interests, preferences, feedback, and survey responses.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">1.2. Usage Data</h3>
            <p className="text-base text-gray-700 leading-relaxed">
              We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              We use personal information collected via our Services for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>To facilitate account creation and logon process.</li>
              <li>To fulfill and manage your orders and payments.</li>
              <li>To deliver and improve our Services.</li>
              <li>To send you marketing and promotional communications.</li>
              <li>To request feedback and to contact you about your experience.</li>
              <li>To protect our Services (e.g., fraud monitoring).</li>
              <li>To respond to legal requests and prevent harm.</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Sharing Your Information</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Your Privacy Rights</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              You have certain rights regarding your personal information, including the right to access, correct, or delete your data. You can typically exercise these rights through your account settings or by contacting us directly.
            </p>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Changes to This Privacy Policy</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
            </p>

            <p className="mt-8 text-sm text-gray-500">
              Last Updated: July 13, 2025
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
