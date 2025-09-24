// File: frontend/app/privacy-policy/page.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 py-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">
            Your privacy is important to us. This page explains how we handle your information.
          </p>
        </header>

        <Separator />

        {/* Introduction */}
        <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              We are committed to protecting your personal information and being transparent about the data we collect, how we use it, and your choices.
            </p>
          </CardContent>
        </Card>

        {/* Information Collection */}
        <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Personal details such as your name, email address, and account information.</li>
              <li>Usage information including pages visited and interactions within our services.</li>
              <li>Technical data like your IP address, browser type, and device information.</li>
            </ul>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <ul className="list-disc list-inside space-y-1">
              <li>To provide, maintain, and improve our services.</li>
              <li>To personalize your experience and recommend relevant content.</li>
              <li>To communicate important updates, promotions, or policy changes.</li>
              <li>To ensure security and prevent fraudulent activity.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle>Data Sharing & Third Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              We do not sell your personal information. We may share data with trusted third-party service providers to help operate our services, comply with the law, or protect rights and safety.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle>Cookies & Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings in your browser.
            </p>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <ul className="list-disc list-inside space-y-1">
              <li>Access, correct, or delete your personal information.</li>
              <li>Opt-out of marketing communications.</li>
              <li>Request restrictions on data processing where applicable.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-white shadow-md rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              If you have questions or concerns about this Privacy Policy, you can contact us at:
            </p>
            <p className="font-medium">Email: <a href="mailto:support@example.com" className="text-teal-600 hover:underline">support@example.com</a></p>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
