"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TranslationProvider } from "./context/TranslationContext";
import FeedbackWidget from "@/components/FeedbackWidget";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const inter = Inter({ subsets: ["latin"] });

// This is the root layout component that wraps the entire application.
// It sets up global providers, the main page structure, and floating widgets.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Use a state variable for the Google Client ID to handle a common Next.js build issue
  // where process.env isn't available on the client side during initial render.
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch the client ID on the client side to ensure it's available.
    // This is a workaround for Vercel/Next.js environment variable handling.
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId) {
      setGoogleClientId(clientId);
    }

    // Supabase subscription logic remains the same.
    const fetchFeedback = async () => {
      // It's good practice to handle potential errors from the DB query.
      const { data, error } = await supabase.from("feedback").select("*");
      if (error) {
        console.error("Error fetching feedback:", error);
      } else if (data) {
        setUnreadCount(data.length);
      }
    };
    fetchFeedback();

    const subscription = supabase
      .channel("public:feedback")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "feedback" }, (payload) => {
        setUnreadCount((count) => count + 1);
      })
      .subscribe();

    return () => {
      // Make sure to remove the subscription to prevent memory leaks.
      supabase.removeChannel(subscription);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount.

  // If the Google Client ID is not yet available, show a loading/error message.
  if (!googleClientId) {
    return (
      <html lang="en">
        <body className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-red-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
            <p className="text-red-600">Google Client ID is not configured. Please check your environment variables.</p>
          </div>
        </body>
      </html>
    );
  }

  // Once the client ID is available, render the full application.
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your App Title</title>
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 font-sans text-gray-800 antialiased`}>
        <TranslationProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-md shadow">
              <Header unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
            </div>

            <main className="min-h-[calc(100vh-12rem)] container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            <Footer />

            {/* Floating Widgets - Changed `right-4` to `left-4` */}
            <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-4">
              <FeedbackWidget />
              <Chatbot />
            </div>

            <Toaster position="top-right" reverseOrder />
          </GoogleOAuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}