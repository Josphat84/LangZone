"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  Copy,
  X,
  Sun,
  Moon,
  Sparkles,
  Send,
  Trash2,
  Bot,
  ClipboardCopy,
  User,
  Loader2,
}
 from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
};

let messageId = 1000; 

// --- Constants for Local Storage Keys ---
const DARK_MODE_KEY = 'chatbot-dark-mode';
const CHAT_STATE_KEY = 'chatbot-open-state';

// --- Chatbot Component ---
export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Persistence & Hydration Logic ---
  useEffect(() => {
    const storedDarkMode = localStorage.getItem(DARK_MODE_KEY);
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    const storedChatState = localStorage.getItem(CHAT_STATE_KEY);
    if (storedChatState !== null) {
      setIsChatOpen(storedChatState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(CHAT_STATE_KEY, isChatOpen.toString());
    if (isChatOpen) {
      if (inputRef.current) inputRef.current.focus();
    }
  }, [isChatOpen]);

  // --- Message and Scroll Handling (Stable) ---

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage = {
      id: messageId++,
      sender,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const initializeWelcomeMessage = useCallback(() => {
    if (messages.length === 0 && isChatOpen) {
      addMessage(
        "👋 Hey there! I’m your AI Assistant. How can I help you today? Ask me about our platform, services, or anything else!",
        "bot"
      );
    }
  }, [messages.length, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      const timer = setTimeout(initializeWelcomeMessage, 100);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, initializeWelcomeMessage]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const observer = new ResizeObserver(scrollToBottom);
    observer.observe(scrollElement);

    return () => observer.unobserve(scrollElement);
  }, [scrollToBottom]);

  // --- GPT-2 API Integration (Uses /api/chat route) ---

  const getGptResponse = async (userInput: string): Promise<string> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to connect to the AI model.');
    }

    const data = await response.json();
    return data.response;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    addMessage(userMessage, "user");
    setInput("");
    setLoading(true);

    try {
      const responseText = await getGptResponse(userMessage); 
      addMessage(responseText, "bot");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`❌ ${errorMessage}`);
      addMessage(
        `⚠️ Error: Could not fetch response. ${errorMessage}`,
        "bot"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (!window.confirm("Are you sure you want to clear the entire chat history?")) return;
    setMessages([]);
    toast.success("✅ Chat cleared!");
    setTimeout(initializeWelcomeMessage, 50); 
  };

  const handleCopyConversation = () => {
    if (messages.length === 0) {
      toast.error("⚠️ No conversation to copy.");
      return;
    }
    const conversation = messages
      .map(
        (msg) =>
          `${msg.sender === "user" ? "🧑 User" : "🤖 Assistant"}: ${msg.text}`
      )
      .join("\n\n"); 
    
    navigator.clipboard.writeText(conversation);
    toast.success("📋 Conversation copied to clipboard!");
  };

  // --- Render Logic ---

  if (isChatOpen) {
    return (
      <Card
        className={cn(
          // ⚠️ POSITIONING FIX: Added !left-[1rem] to assure left positioning (4px = 1rem)
          // Also set bottom to fixed 1.5rem (sm:bottom-6) for consistency.
          "!fixed !bottom-[1.5rem] !left-[1.5rem] z-[999] w-[360px] max-w-[90vw] flex flex-col h-[520px] max-h-[80vh] shadow-2xl rounded-xl transition-all duration-300",
          "sm:bottom-6 sm:left-6", // Fallback for standard spacing (4px = 1rem, 6px = 1.5rem)
          darkMode
            ? "bg-card text-card-foreground border-border/80"
            : "bg-white text-gray-900 border-border"
        )}
      >
        <CardHeader 
          className={cn(
            "flex flex-row items-center justify-between p-4 border-b",
            darkMode ? "border-border bg-gray-900" : "border-gray-100 bg-gray-50"
          )}
        >
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              AI Assistant
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Dark Mode"
              aria-label="Toggle Dark Mode"
              className="text-muted-foreground hover:bg-accent"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsChatOpen(false)}
              title="Close Chat"
              aria-label="Close Chat"
              className="text-muted-foreground hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 p-4 overflow-hidden">
          <ScrollArea className="flex-1 overflow-y-auto pr-3" ref={scrollContainerRef}>
            <div className="flex flex-col space-y-4" ref={scrollRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex transition-all",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "group relative p-3 rounded-xl max-w-[85%] shadow-md transition-all text-sm leading-snug",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-muted-foreground rounded-tl-sm"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.sender === "user" ? (
                        <User className="h-4 w-4 opacity-80" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-semibold text-xs opacity-80">
                        {msg.sender === "user" ? "You" : "Assistant"}
                      </span>
                    </div>
                    
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className="text-[10px] mt-1 text-right opacity-50">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {msg.sender === "bot" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn("absolute top-1 right-1 p-1 h-6 w-6 transition-opacity text-xs", 
                          "text-muted-foreground/70 hover:text-foreground hover:bg-accent",
                          "opacity-0 group-hover:opacity-100"
                        )}
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          toast.success('Copied!');
                        }}
                        title="Copy message text"
                        aria-label="Copy message text"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm italic bg-muted text-muted-foreground",
                    )}
                  >
                    <Loader2 className="h-4 w-4 inline-block mr-2 animate-spin text-primary" />
                    Assistant is typing...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-3 flex flex-col gap-2 pt-3 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-10"
                disabled={loading}
              />
              <Button 
                onClick={handleSend} 
                disabled={loading} 
                size="icon"
                className="bg-primary hover:bg-primary/90"
                aria-label="Send message"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>

            <Separator className="my-2 bg-border" />

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-primary">
                <Sparkles className="h-3 w-3 fill-primary" />
                AI-Powered Chat
              </span>
              <div className="flex gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyConversation}
                    className="h-7 px-2 text-xs text-muted-foreground hover:bg-accent"
                    title="Copy Full Conversation"
                  >
                    <ClipboardCopy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                )}
                {messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                    title="Clear Chat History"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Floating Button (Bottom-Left) ---
  return (
    <Button
      // ✅ CONFIRMATION: Positioned at fixed bottom-left corner
      className="!fixed bottom-4 left-4 z-[999] h-16 w-16 rounded-full shadow-2xl transition-all duration-300 
                 ring-4 ring-offset-4 ring-primary/30 bg-primary text-primary-foreground 
                 hover:shadow-3xl hover:ring-offset-2 hover:ring-primary/50"
      onClick={() => setIsChatOpen(true)}
      aria-label="Open AI Assistant Chat"
      title="Open AI Assistant Chat"
    >
      <Bot className="h-7 w-7" />
    </Button>
  );
}