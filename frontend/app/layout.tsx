import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Footer from '@/components/Footer'; // Import the new Footer component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Language Learning App",
  description: "Find your perfect language instructor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set!");
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800">
            Error: Google Client ID is not configured.
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800`}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <header className="bg-teal-600 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                LanguageApp
              </Link>
              <div className="space-x-4">
                <Link href="/" className="hover:text-teal-200 transition-colors">
                  Home
                </Link>
                <Link href="/about" className="hover:text-teal-200 transition-colors">
                  About
                </Link>
                <Link href="/instructors" className="hover:text-teal-200 transition-colors">
                  Instructors
                </Link>
                <Link href="/signup" className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-teal-50 transition-colors font-semibold">
                  Sign Up
                </Link>
                <Link href="/login" className="border border-white px-4 py-2 rounded-md hover:bg-white hover:text-teal-600 transition-colors">
                  Login
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          {/* Use the new Footer component here */}
          <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}