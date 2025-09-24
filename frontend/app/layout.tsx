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
        {/* Add CSS for safe area support */}
        <style jsx global>{`
          :root {
            --safe-area-inset-top: env(safe-area-inset-top);
            --safe-area-inset-right: env(safe-area-inset-right);
            --safe-area-inset-bottom: env(safe-area-inset-bottom);
            --safe-area-inset-left: env(safe-area-inset-left);
          }
          
          .feedback-widget-positioned {
            /* Desktop positioning */
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 50;
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
              bottom: calc(1rem + var(--safe-area-inset-bottom, 0px));
              right: calc(1rem + var(--safe-area-inset-right, 0px));
              max-width: calc(100vw - 2rem - var(--safe-area-inset-left, 0px) - var(--safe-area-inset-right, 0px));
            }
            
            /* Extra small screens */
            @media (max-width: 480px) {
              bottom: calc(0.75rem + var(--safe-area-inset-bottom, 0px));
              right: calc(0.75rem + var(--safe-area-inset-right, 0px));
              max-width: calc(100vw - 1.5rem - var(--safe-area-inset-left, 0px) - var(--safe-area-inset-right, 0px));
            }
          }
          
          /* Ensure toasts don't interfere with safe areas */
          .feedback-toast-container {
            padding-top: var(--safe-area-inset-top, 0px);
            padding-right: var(--safe-area-inset-right, 0px);
          }
          
          /* Body adjustments for safe areas */
          body {
            padding-top: var(--safe-area-inset-top, 0px);
            padding-bottom: var(--safe-area-inset-bottom, 0px);
            padding-left: var(--safe-area-inset-left, 0px);
            padding-right: var(--safe-area-inset-right, 0px);
          }
        `}</style>
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800`}>
        <TranslationProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            {/* Header with proper containment */}
            <Header unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
            
            {/* Main content with proper spacing */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
            
            {/* Feedback Widget with proper responsive positioning */}
            <div className="feedback-widget-positioned">
              <FeedbackWidget />
            </div>
            
            {/* Toast notifications with safe area support */}
            <div className="feedback-toast-container">
              <Toaster 
                position="top-right" 
                reverseOrder 
                toastOptions={{
                  style: {
                    marginRight: 'calc(0.5rem + var(--safe-area-inset-right, 0px))',
                    marginTop: 'calc(0.5rem + var(--safe-area-inset-top, 0px))',
                  },
                  duration: 4000,
                }}
              />
            </div>
          </GoogleOAuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}