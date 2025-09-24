"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TranslationProvider } from "./context/TranslationContext";
import FeedbackWidget from "@/components/FeedbackWidget";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch all existing feedback
    const fetchFeedback = async () => {
      const { data, error } = await supabase.from("feedback").select("*");
      if (!error && data) setUnreadCount(data.length);
    };
    fetchFeedback();

    // Listen for new feedback in realtime
    const subscription = supabase
      .channel("public:feedback")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          setUnreadCount((count) => count + 1);

          // Play sound using public URL
          const audio = new Audio("https://www.myinstants.com/media/sounds/bell-notification.mp3");
          audio.play().catch(() => {});

          // Toast notification
          toast.success(`New feedback: "${payload.new.message}"`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (!googleClientId) {
    return (
      <html lang="en">
        <body className="flex items-center justify-center min-h-screen bg-red-100 text-red-800">
          Error: Google Client ID is not configured.
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800`}>
        <TranslationProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <Header unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
            <main className="flex-grow">{children}</main>
            <Footer />
            <FeedbackWidget className="fixed bottom-4 right-4 z-50" />
            <Toaster position="top-right" reverseOrder />
          </GoogleOAuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
