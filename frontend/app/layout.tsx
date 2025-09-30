"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FeedbackWidget from "@/components/FeedbackWidget";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "react-hot-toast";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  MessageSquare,
  Sparkles,
  Wifi,
  WifiOff,
  AlertTriangle,
  Bot,
  Zap,
  Heart,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const LOADING_STEPS = [
  { step: 1, label: "Initializing..." },
  { step: 2, label: "Loading components..." },
  { step: 3, label: "Connecting to services..." },
  { step: 4, label: "Almost ready..." },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // Client-only Supabase fetch
  const fetchFeedbackCount = useCallback(async (retries = 3) => {
    if (typeof window === "undefined") return; // skip SSR
    try {
      const { count, error: countError } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true });
      if (countError) throw countError;
      setUnreadCount(count || 0);
      setError(null);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      if (retries > 0) setTimeout(() => fetchFeedbackCount(retries - 1), 2000);
      else {
        const errorMessage = err instanceof Error ? err.message : "Connection failed";
        setError(errorMessage);
        setUnreadCount(0);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;
    let stepTimer: NodeJS.Timeout;

    const initialize = async () => {
      try {
        for (let i = 0; i <= LOADING_STEPS.length; i++) {
          if (!mounted) return;
          setLoadingStep(i);
          if (i === 1) setIsHydrated(true);
          if (i === 2) await fetchFeedbackCount();
          if (i < LOADING_STEPS.length)
            await new Promise((resolve) => {
              stepTimer = setTimeout(resolve, 300 + Math.random() * 200);
            });
        }
        if (mounted) setIsLoading(false);
      } catch (err) {
        console.error("Initialization error:", err);
        if (mounted) {
          setError("Failed to initialize");
          setIsLoading(false);
        }
      }
    };

    initialize();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    let subscription: any = null;
    try {
      subscription = supabase
        .channel("feedback-updates")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "feedback" },
          () => {
            if (mounted) fetchFeedbackCount();
          }
        )
        .subscribe();
    } catch (err) {
      console.error("Subscription error:", err);
    }

    return () => {
      mounted = false;
      if (stepTimer) clearTimeout(stepTimer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [fetchFeedbackCount]);

  const connectionStatus = useMemo(
    () => ({
      isConnected: isOnline && !error,
      statusText: error ? "Connection Error" : isOnline ? "Connected" : "Offline",
      statusColor: error ? "destructive" : isOnline ? "success" : "warning",
    }),
    [isOnline, error]
  );

  // Loading screen
  if (isLoading) {
    return (
      <html lang="en" className="scroll-smooth">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Loading...</title>
        </head>
        <body className={`${inter.className} min-h-screen flex items-center justify-center`}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Sparkles className="h-10 w-10 text-purple-600" />
          </motion.div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LangZone</title>
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <TooltipProvider>
          {/* Connection Banner */}
          {!connectionStatus.isConnected && (
            <Alert className="rounded-none border-x-0 border-t-0 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-2">
                {isOnline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                <AlertDescription className="flex-1">
                  <span className="font-medium">{connectionStatus.statusText}</span>
                  {error && (
                    <Button
                      variant="link"
                      size="sm"
                      className="px-2 py-0 h-auto"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Header */}
          <Header unreadCount={unreadCount} setUnreadCount={setUnreadCount} isLoading={false} />

          {/* Main content */}
          <main className="flex-1 relative">
            <ScrollArea className="h-full">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                {children}
              </div>
            </ScrollArea>
          </main>

          {/* Footer */}
          <Footer />

          {/* Chatbot Sheet */}
          <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => setChatOpen(true)}>Chat</Button>
            </SheetTrigger>
            <SheetContent>
              {chatOpen && <Chatbot />}
            </SheetContent>
          </Sheet>

          {/* Floating Feedback Widget */}
          <div className="fixed bottom-4 right-4 z-50">
            <FeedbackWidget />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-6 w-6 text-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>

          {/* Toast Notifications */}
          <Toaster position="top-right" />

          {/* Development error banner */}
          {process.env.NODE_ENV === "development" && error && (
            <div className="fixed bottom-20 left-4 right-4 md:max-w-md z-[60]">
              <Alert className="bg-red-50 border-red-200 shadow-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Dev Warning:</strong> {error}
                  <Button variant="link" size="sm" className="ml-2 text-red-600" onClick={() => setError(null)}>
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TooltipProvider>
      </body>
    </html>
  );
}
