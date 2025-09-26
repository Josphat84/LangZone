"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Copy, X, Sun, Moon, Sparkles, Send, Trash2, Bot, ClipboardCopy } from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
};

let messageId = 0;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to initialize the welcome message
  const initializeWelcomeMessage = useCallback(() => {
    // Check if a welcome message has already been added
    if (messages.length === 0) {
      addMessage("Hello there! I'm your friendly AI Assistant. How can I help you today? 😊", "bot");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      initializeWelcomeMessage();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isChatOpen, initializeWelcomeMessage]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage = { id: messageId++, sender, text, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    addMessage(userMessage, "user");
    setInput("");
    setLoading(true);

    try {
      const responseText = await fakeGptResponse(userMessage);
      addMessage(responseText, "bot");
    } catch (err) {
      toast.error("Failed to get response.");
      addMessage("Oops! Something went wrong. Please try again later.", "bot");
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
    setMessages([]);
    toast.success("Chat cleared!");
    initializeWelcomeMessage();
  };

  const handleCopyConversation = () => {
    if (messages.length === 0) {
      toast.error("No conversation to copy.");
      return;
    }
    const conversation = messages
      .map((msg) => `${msg.sender === "user" ? "User" : "AI Assistant"}: ${msg.text}`)
      .join("\n");
    navigator.clipboard.writeText(conversation);
    toast.success("Conversation copied to clipboard!");
  };

  const fakeGptResponse = async (userInput: string): Promise<string> => {
    await new Promise((res) => setTimeout(res, Math.random() * 800 + 400));
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello there! How can I assist you today? 😊";
    }
    if (lowerInput.includes("how are you")) {
      return "I'm a bot, so I don't have feelings, but I'm ready to help you! How are you?";
    }
    if (lowerInput.includes("weather")) {
      return "I can't check the weather, but I hope it's sunny wherever you are! ☀️";
    }
    if (lowerInput.includes("your name")) {
      return "I am a simple chatbot designed to assist you. You can call me 'Assistant'.";
    }
    if (lowerInput.includes("what is") || lowerInput.includes("define")) {
      return `That's an interesting question. While I don't have a real-time knowledge base, I can tell you that the definition of '${userInput.split(' ')[2] || 'it'}' is a broad topic.`;
    }
    if (lowerInput.includes("help me")) {
        return "I'd be glad to help! Please tell me what you need assistance with, and I will do my best to guide you.";
    }
    const responses = [
      "That's a great point. Let's explore that further.",
      "I see. Could you provide a bit more detail?",
      "Interesting! What do you think about that?",
      "Hmm, that's a complex topic. What aspect of it are you most curious about?",
      "Thank you for sharing. I'm processing your request.",
      "Got it. What's the next step you'd like to take?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (isChatOpen) {
    return (
      <Card
        className={cn(
          "fixed bottom-4 left-4 z-[999] w-[350px] max-w-[90vw] flex flex-col h-[500px] max-h-[80vh] transition-all duration-300 shadow-xl rounded-xl",
          "bg-white/70 backdrop-blur-lg",
          darkMode ? "dark bg-gray-950/70 text-gray-100 border-gray-800" : "text-gray-900 border-gray-200"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsChatOpen(false)} title="Close Chat">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 p-4 overflow-hidden">
          <ScrollArea className="flex-1 overflow-y-auto pr-4">
            <div className="flex flex-col space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "group relative p-3 rounded-xl max-w-[85%] break-words whitespace-pre-wrap transition-all duration-300",
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900",
                      darkMode && msg.sender === "bot" ? "bg-gray-800 text-gray-100" : ""
                    )}
                  >
                    {msg.text}
                    <div className="text-xs mt-1 text-gray-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {msg.sender === "bot" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigator.clipboard.writeText(msg.text)}
                        title="Copy message"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={cn(
                    "p-3 rounded-xl max-w-xs break-words animate-pulse",
                    darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-900"
                  )}>
                    Typing...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading} size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by AI
              </span>
              <div className="flex gap-2">
                {messages.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleCopyConversation} className="p-1">
                    <ClipboardCopy className="h-4 w-4 mr-1" /> Copy All
                  </Button>
                )}
                {messages.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClear} className="p-1">
                    <Trash2 className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button 
      className="fixed bottom-4 left-4 z-[999] p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:ring-4 hover:ring-purple-500/50 bg-gradient-to-r from-purple-500 to-blue-500 text-white"
      onClick={() => setIsChatOpen(true)}
    >
      <Sparkles className="h-6 w-6" />
    </Button>
  );
}