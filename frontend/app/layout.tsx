"use client";

import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TranslationProvider } from "./context/TranslationContext";
import FeedbackWidget from "@/components/FeedbackWidget";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

// CRITICAL: Retrieve the Client ID from environment variables.
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

interface UnreadFeedback {
  count: number;
  lastUpdated: Date;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optimized feedback fetcher with error handling
  const fetchFeedbackCount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { count, error: countError } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true });
      
      if (countError) {
        throw new Error(`Failed to fetch feedback: ${countError.message}`);
      }
      
      setUnreadCount(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error fetching feedback count:", errorMessage);
      setError(errorMessage);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized unread count updater
  const handleUnreadCountChange = useCallback((newCount: number) => {
    setUnreadCount(Math.max(0, newCount));
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const initialize = async () => {
      if (!mounted) return;
      
      // 💡 HYDRATION FIX: Set isHydrated to true only after the first client render.
      // This will prevent components relying on client state (like the old theme toggle)
      // or framer-motion's dynamic initial state from rendering until the client takes over.
      setIsHydrated(true); 
      await fetchFeedbackCount();
    };

    initialize();

    // Set up real-time subscription with error handling
    const subscription = supabase
      .channel("feedback-updates")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "feedback" 
        },
        (payload) => {
          if (!mounted) return;
          fetchFeedbackCount();
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to feedback updates');
          setError('Real-time updates unavailable');
        }
      });

    return () => {
      mounted = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [fetchFeedbackCount]);

  // Enhanced error boundary for development
  if (error && process.env.NODE_ENV === 'development') {
    console.warn('Layout Error:', error);
  }

  // 🚨 Note: The <head> and <html> tags are Server Components, so they remain outside the client logic.
  // The 'suppressHydrationWarning' is on the body, which helps, but the nested elements must match.

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Learn languages with expert tutors - personalized lessons tailored to your goals" />
        <meta name="theme-color" content="#ffffff" />
        <title>Home Platform - Master New Languages</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body 
        className={`${inter.className} ${inter.variable} min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 font-sans text-gray-800 antialiased selection:bg-blue-200/50`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <TranslationProvider>
            
            {/* The core structure should be conditional on isHydrated to avoid rendering 
                framer-motion and state-reliant components until the client is ready. */}
            <AnimatePresence mode="wait">
              {isHydrated ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col min-h-screen" // Added flex-col to structure
                >
                  
                  {/* Skip to main content for accessibility */}
                  <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all focus:ring-4 focus:ring-blue-300"
                  >
                    Skip to main content
                  </a>

                  {/* Enhanced Header with loading state */}
                  <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm"
                  >
                    <Header 
                      unreadCount={isLoading ? 0 : unreadCount} 
                      setUnreadCount={handleUnreadCountChange}
                      isLoading={isLoading}
                    />
                  </motion.div>

                  {/* Main Content */}
                  <main 
                    id="main-content"
                    className="flex-1" // flex-1 ensures it pushes the footer down
                    role="main"
                    aria-label="Main content"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl"
                    >
                      {children}
                    </motion.div>
                  </main>

                  {/* Enhanced Footer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Footer />
                  </motion.div>
                  
                  {/* Widgets and Toaster */}
                  <FloatingWidgets isHydrated={isHydrated} error={error} setError={setError} />
                  
                </motion.div>

              ) : (
                // 💡 RENDER STABLE LOADER WHILE WAITING FOR HYDRATION
                <LoadingIndicator />
              )}
            </AnimatePresence>
            
          </TranslationProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

// ----------------------------------------------------------------------
// 💡 EXTRACTED COMPONENTS FOR CLARITY & REUSABILITY
// ----------------------------------------------------------------------

// Component for the Loading Indicator
const LoadingIndicator = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[60] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 text-gray-600"
    >
      {/* Note: Tailwind's border utilities may need adjustment if border-3 isn't defined */}
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-sm font-medium">Loading...</span>
    </motion.div>
  </div>
);


// Component for Floating Widgets (Toaster, Feedback, Chatbot)
interface FloatingWidgetsProps {
  isHydrated: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({ isHydrated, error, setError }) => (
  <>
    {/* Floating Widgets with improved animations and mobile optimization */}
    {isHydrated && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "backOut" }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 sm:gap-4"
        role="complementary"
        aria-label="Help and feedback tools"
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="order-2 sm:order-1"
          >
            <FeedbackWidget />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="order-1 sm:order-2"
          >
            <Chatbot />
          </motion.div>
        </div>
      </motion.div>
    )}

    {/* Enhanced Toast Notifications */}
    <Toaster 
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName="!top-20" // Account for sticky header
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#fff',
          color: '#374151',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          backdropFilter: 'blur(8px)',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          duration: 6000,
        },
      }}
    />

    {/* Development error indicator */}
    {process.env.NODE_ENV === 'development' && error && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm z-[60] max-w-sm"
      >
        <strong>Dev Warning:</strong> {error}
        <button
          onClick={() => setError(null)}
          className="ml-2 text-red-600 hover:text-red-800 font-bold"
          aria-label="Dismiss error"
        >
          ×
        </button>
      </motion.div>
    )}
  </>
);