"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Sun,
  Moon,
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Loader2,
  MoreHorizontal,
  Download,
  RefreshCw,
  Settings,
  Zap,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Camera,
  Paperclip,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

type MessageStatus = "sending" | "sent" | "error";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  status?: MessageStatus;
  liked?: boolean;
  disliked?: boolean;
  attachments?: string[];
};

// Enhanced settings interface
interface ChatSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  autoScroll: boolean;
  showTimestamps: boolean;
  showReadReceipts: boolean;
  compactMode: boolean;
}

// Predefined quick responses
const QUICK_RESPONSES = [
  "👋 Hello!",
  "❓ Help me with...",
  "📝 Explain this:",
  "🔍 Search for:",
  "💡 Give me ideas about:",
  "🚀 Let's get started!"
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    darkMode: false,
    soundEnabled: true,
    autoScroll: true,
    showTimestamps: true,
    showReadReceipts: true,
    compactMode: false
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: "👋 Hello! I'm your AI Assistant. I'm here to help you with questions, provide information, or just have a friendly conversation. How can I assist you today?",
        timestamp: new Date(),
        status: "sent"
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (settings.autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [settings.autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // API call with enhanced error handling
  const getGptResponse = async (userInput: string): Promise<string> => {
    setConnectionStatus('connecting');
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ message: userInput }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setConnectionStatus('connected');
      return data.response || "I apologize, but I received an empty response. Please try again.";
    } catch (err) {
      setConnectionStatus('disconnected');
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error("Request timed out. Please check your connection and try again.");
        }
        throw err;
      }
      throw new Error("An unexpected error occurred while communicating with the AI.");
    }
  };

  // Enhanced message handling
  const addMessage = useCallback((text: string, sender: "user" | "bot", status: MessageStatus = "sent"): Message => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender,
      text,
      timestamp: new Date(),
      status
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Play sound notification for bot messages
    if (sender === "bot" && settings.soundEnabled) {
      // You can add actual sound playing logic here
      console.log("🔊 New message sound");
    }
    
    return newMessage;
  }, [settings.soundEnabled]);

  const updateMessageStatus = useCallback((messageId: string, status: MessageStatus) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  }, []);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage = addMessage(trimmedInput, "user", "sending");
    setInput("");
    setLoading(true);
    setTypingIndicator(true);

    try {
      updateMessageStatus(userMessage.id, "sent");
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const responseText = await getGptResponse(trimmedInput);
      setTypingIndicator(false);
      addMessage(responseText, "bot");
      
      toast.success("Message sent!", {
        duration: 2000,
        style: { fontSize: '14px' }
      });
      
    } catch (err) {
      setTypingIndicator(false);
      updateMessageStatus(userMessage.id, "error");
      
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to send: ${errorMessage}`);
      
      addMessage(
        `⚠️ I apologize, but I encountered an error: ${errorMessage}\n\nPlease try sending your message again.`, 
        "bot"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success("Chat cleared!", { duration: 2000 });
    
    // Re-add welcome message after a brief delay
    setTimeout(() => {
      addMessage(
        "Chat cleared! How can I help you today?",
        "bot"
      );
    }, 300);
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      toast.error("No messages to export.");
      return;
    }

    const conversation = messages.map(msg => ({
      sender: msg.sender === "user" ? "You" : "AI Assistant",
      message: msg.text,
      timestamp: msg.timestamp.toISOString(),
      status: msg.status
    }));

    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success("Chat exported successfully!");
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copied!", { duration: 1500 });
  };

  const handleQuickResponse = (response: string) => {
    setInput(response);
    inputRef.current?.focus();
  };

  const handleLikeMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, liked: !msg.liked, disliked: false }
          : msg
      )
    );
  };

  const handleDislikeMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, disliked: !msg.disliked, liked: false }
          : msg
      )
    );
  };

  const getStatusIcon = (status?: MessageStatus) => {
    switch (status) {
      case "sending":
        return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
      case "sent":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case "error":
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)] bg-background">
      {/* Enhanced Header with Connection Status */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/ai-avatar.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {connectionStatus === 'connected' ? 'Online' :
               connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isExpanded ? 'Minimize' : 'Expand'}
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleExportChat}>
                <Download className="h-4 w-4 mr-2" />
                Export Chat
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex gap-3 group",
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <Avatar className={cn(
                  "h-8 w-8 flex-shrink-0",
                  msg.sender === "user" ? "order-2" : "order-1"
                )}>
                  <AvatarFallback className={cn(
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                {/* Message Content */}
                <div className={cn(
                  "flex flex-col max-w-[80%]",
                  msg.sender === "user" ? "items-end" : "items-start"
                )}>
                  <Card className={cn(
                    "relative group/message transition-all duration-200",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 border-border/50",
                    msg.status === "error" && "border-destructive bg-destructive/5"
                  )}>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                      
                      {/* Message Actions */}
                      <div className={cn(
                        "flex items-center gap-1 mt-2 opacity-0 group-hover/message:opacity-100 transition-opacity",
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      )}>
                        {msg.sender === "bot" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleLikeMessage(msg.id)}
                            >
                              <ThumbsUp className={cn(
                                "h-3 w-3",
                                msg.liked && "fill-current text-green-600"
                              )} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleDislikeMessage(msg.id)}
                            >
                              <ThumbsDown className={cn(
                                "h-3 w-3",
                                msg.disliked && "fill-current text-red-600"
                              )} />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleCopyMessage(msg.text)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timestamp and Status */}
                  {settings.showTimestamps && (
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-xs text-muted-foreground",
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span>
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      {settings.showReadReceipts && msg.sender === "user" && getStatusIcon(msg.status)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {typingIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-muted/50">
                  <CardContent className="p-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">AI is thinking...</span>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Quick Responses */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t bg-muted/20">
          <p className="text-xs text-muted-foreground mb-2">Quick responses:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_RESPONSES.map((response, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleQuickResponse(response)}
              >
                {response}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              ref={inputRef}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/90 h-11 w-11"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            
            {messages.length > 1 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Chat History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all messages in this conversation. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChat} className="bg-destructive text-destructive-foreground">
                      Clear Chat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Input Footer */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <span>{messages.length} messages</span>
          </div>
          
          <div className="flex items-center gap-2">
            {connectionStatus === 'connecting' && (
              <div className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Connecting...</span>
              </div>
            )}
            {connectionStatus === 'disconnected' && (
              <div className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}