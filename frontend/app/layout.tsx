"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TranslationProvider } from "./context/TranslationContext";
import FeedbackWidget from "@/components/FeedbackWidget";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800`}
      >
        <TranslationProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <FeedbackWidget /> {/* Floating feedback button on all pages */}
          </GoogleOAuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
