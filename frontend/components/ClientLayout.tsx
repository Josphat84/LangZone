// frontend/components/ClientLayout.tsx

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
// NOTE: FeedbackWidget likely needs to be updated to receive 'supabase' client via prop or Context
import FeedbackWidget from "@/components/FeedbackWidget"; 
import Chatbot from "@/components/Chatbot";
import { Toaster } from "react-hot-toast";

// Import the function to get the Supabase client
import { getSupabaseClient } from "@/lib/supabase/client"; 

// Enhanced Shadcn components
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// Enhanced Icons
import { 
  MessageSquare, 
  Sparkles, 
  WifiOff, 
  Wifi, 
  AlertTriangle,
  Bot,
  Zap,
  Heart,
} from "lucide-react";

// Enhanced loading progress states
const LOADING_STEPS = [
  { step: 1, label: "Initializing..." },
  { step: 2, label: "Loading components..." },
  { step: 3, label: "Connecting to services..." },
  { step: 4, label: "Almost ready..." },
];

// REMOVED THE FIRST REDUNDANT/INCORRECT EXPORT DEFAULT COMPONENT BLOCK

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  
  // 🔑 THE PRIMARY FIX: Initialize the Supabase client instance here.
  // This is how you correctly use the getSupabaseClient function you imported.
  const supabase = useMemo(() => getSupabaseClient(), []); 

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  // The rest of the component now correctly uses the 'supabase' constant defined above.
  const fetchFeedbackCount = useCallback(async (retries = 3) => {
    // This check is good because 'supabase' might be null if the keys were missing or on SSR.
    if (!supabase) {
      console.warn("Supabase client is not initialized.");
      return; 
    }

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
        const errorMessage = err instanceof Error ? err.message : "Connection failed";
        setError(errorMessage);
        setUnreadCount(0);
      }
    }
  }, [supabase]); // Keep dependency array correct

  useEffect(() => {
    let mounted = true;
    let stepTimer: NodeJS.Timeout;

    const initialize = async () => {
      try {
        for (let i = 0; i <= LOADING_STEPS.length; i++) {
          if (!mounted) return;
          setLoadingStep(i);
          if (i === 1) setIsHydrated(true);
          if (i === 2) await fetchFeedbackCount();
          if (i < LOADING_STEPS.length) {
            await new Promise(resolve => {
              stepTimer = setTimeout(resolve, 300 + Math.random() * 200);
            });
          }
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
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setIsOnline(navigator.onLine);
    }

    let subscription: any = null;
    
    // Uses the correctly initialized 'supabase' constant
    if (typeof window !== 'undefined' && supabase) { 
      try {
        subscription = supabase
          .channel("feedback-updates")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "feedback" },
            (payload) => {
              if (mounted) fetchFeedbackCount();
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') console.log('Real-time updates connected');
            else if (status === 'CHANNEL_ERROR') {
              console.error('Real-time connection failed');
              if (mounted) setError('Real-time updates unavailable');
            }
          });
      } catch (err) {
        console.error("Subscription error:", err);
      }
    }

    return () => {
      mounted = false;
      if (stepTimer) clearTimeout(stepTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
      if (subscription && supabase) {
        try {
          // Uses the correctly initialized 'supabase' constant
          supabase.removeChannel(subscription); 
        } catch (err) {
          console.error("Error removing subscription:", err);
        }
      }
    };
  }, [fetchFeedbackCount, supabase]);

  const connectionStatus = useMemo(() => ({
    isConnected: isOnline && !error,
    statusText: error ? 'Connection Error' : isOnline ? 'Connected' : 'Offline',
    statusColor: error ? 'destructive' : isOnline ? 'success' : 'warning'
  }), [isOnline, error]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {loadingStep < LOADING_STEPS.length 
                    ? LOADING_STEPS[loadingStep]?.label 
                    : "Ready!"
                  }
                </span>
                <span className="text-purple-600 font-semibold">
                  {Math.round((loadingStep / LOADING_STEPS.length) * 100)}%
                </span>
              </div>
              <Progress value={(loadingStep / LOADING_STEPS.length) * 100} className="h-2 bg-gray-200" />
            </div>
            <p className="text-gray-500 text-sm">Setting up your personalized experience...</p>
          </div>
          <div className="space-y-3 max-w-md mx-auto">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {isHydrated && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col min-h-screen"
          >
            {/* Connection Status Banner */}
            <AnimatePresence>
              {(!connectionStatus.isConnected) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Alert className="rounded-none border-x-0 border-t-0 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <div className="flex items-center gap-2">
                      {isOnline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                      <AlertDescription className="flex-1">
                        <span className="font-medium">{connectionStatus.statusText}</span>
                        {error && (
                          <span className="ml-2 text-sm">
                            Some features may be limited. 
                            <Button variant="link" size="sm" className="px-2 py-0 h-auto" onClick={() => window.location.reload()}>Retry</Button>
                          </span>
                        )}
                      </AlertDescription>
                    </div>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm"
            >
              <Header unreadCount={unreadCount} setUnreadCount={setUnreadCount} isLoading={false} />
            </motion.div>

            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 z-[100] bg-purple-600 text-white px-4 py-2 rounded-md font-medium transition-all focus:ring-4 focus:ring-purple-300">
              Skip to main content
            </a>

            <main id="main-content" className="flex-1 relative" role="main" aria-label="Main content">
              <ScrollArea className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl"
                >
                  {children}
                </motion.div>
              </ScrollArea>
            </main>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Footer />
            </motion.div>

            {/* Chat Sheet */}
            <Sheet open={chatOpen} onOpenChange={setChatOpen}>
              <SheetTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }} className="fixed bottom-4 left-4 z-50">
                      <Button size="lg" onClick={() => setChatOpen(true)} className="relative p-4 h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 border-0 group overflow-hidden">
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100" initial={false} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                        <div className="relative z-10">
                          <MessageSquare className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <motion.div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full shadow-sm" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <motion.div className="absolute inset-0 bg-green-400 rounded-full opacity-75" animate={{ scale: [0, 1.5], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                        </motion.div>
                        <motion.div className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100" animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                          <Sparkles className="h-3 w-3 text-yellow-300" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span>Chat with AI Assistant</span>
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Smart
                      </Badge>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </SheetTrigger>
              <SheetContent side="left" className="w-[400px] max-w-[90vw] p-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-r border-purple-100/50 shadow-2xl">
                <SheetHeader className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Bot className="h-5 w-5" />
                      </div>
                      <motion.div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    </div>
                    <div>
                      <SheetTitle className="text-white font-bold text-lg">AI Assistant</SheetTitle>
                      <SheetDescription className="text-purple-100">Your intelligent chat companion</SheetDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-xs text-purple-100">{connectionStatus.statusText}</span>
                  </div>
                </SheetHeader>
                <div className="flex-1 h-[calc(100vh-140px)]">
                  <ScrollArea className="h-full">
                    <div className="p-6">{chatOpen && <Chatbot />}</div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>

            {/* Floating Feedback Widget */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }} className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <FeedbackWidget />
                    {unreadCount > 0 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2">
                        <Badge variant="destructive" className="h-6 min-w-[24px] flex items-center justify-center text-xs font-bold shadow-md">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Send your Feedback</span>
                    {unreadCount > 0 && <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>}
                  </div>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerClassName="!top-20 !z-[100]"
              toastOptions={{
                duration: 4000,
                style: { borderRadius: "12px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", color: "#374151", fontSize: "14px", fontWeight: "500", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", border: "1px solid rgba(229, 231, 235, 0.8)", maxWidth: "400px" },
                success: { iconTheme: { primary: "#10b981", secondary: "#ffffff" }, style: { background: "rgba(236, 253, 245, 0.95)", borderColor: "rgba(16, 185, 129, 0.2)" } },
                error: { iconTheme: { primary: "#ef4444", secondary: "#ffffff" }, style: { background: "rgba(254, 242, 242, 0.95)", borderColor: "rgba(239, 68, 68, 0.2)" } },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}