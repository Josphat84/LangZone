"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FeedbackWidget from "@/components/FeedbackWidget";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // State
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // Supabase client
  const [supabase, setSupabase] = useState<ReturnType<typeof getSupabaseClient> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSupabase(getSupabaseClient());
    }
  }, []);

  // Fetch feedback count safely
  const fetchFeedbackCount = useCallback(
    async (retries = 3) => {
      if (!supabase) return;

      try {
        const { count, error: countError } = await supabase
          .from("feedback")
          .select("*", { count: "exact", head: true });

        if (countError) throw countError;

        setUnreadCount(count || 0);
        setError(null);
      } catch (err) {
        console.error("Error fetching feedback:", err);

        if (retries > 0) {
          setTimeout(() => fetchFeedbackCount(retries - 1), 2000);
        } else {
          const errorMessage =
            err instanceof Error ? err.message : "Connection failed";
          setError(errorMessage);
          setUnreadCount(0);
        }
      }
    },
    [supabase]
  );

  // Setup Supabase subscription + hydration
  useEffect(() => {
    setIsHydrated(true);
    setIsOnline(navigator.onLine);

    if (supabase) {
      fetchFeedbackCount();

      const channel = supabase
        .channel("feedback-changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "feedback" },
          () => fetchFeedbackCount()
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "feedback" },
          () => fetchFeedbackCount()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, fetchFeedbackCount]);

  // Connectivity listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Loading animation
  useEffect(() => {
    if (!isHydrated) return;
    const steps = [0, 1, 2, 3];
    let index = 0;

    const interval = setInterval(() => {
      setLoadingStep(steps[index]);
      index++;

      if (index >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 800);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isHydrated]);

  // Render
  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              key={loadingStep}
              className="text-3xl font-bold text-gray-700"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              {["LangZone", "Connecting", "Setting up", "Ready!"][loadingStep]}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <Header unreadCount={unreadCount} />

        <main className="flex-1">{children}</main>

        <Footer />

        {/* Chatbot */}
        <Chatbot open={chatOpen} onOpenChange={setChatOpen} />

        {/* Feedback Widget */}
        <FeedbackWidget
          unreadCount={unreadCount}
          error={error}
          isOnline={isOnline}
          onRetry={fetchFeedbackCount}
        />

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </>
  );
}
