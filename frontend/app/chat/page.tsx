// Chat page for user interactions
//app/chat/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  type: "user" | "bot";
  text: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      const botMessage: Message = {
        type: "bot",
        text: res.ok ? data.response : data.error || "Something went wrong.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Failed to fetch response." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        border: "1px solid #ccc",
        borderRadius: "0.5rem",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
      }}
    >
      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.type === "user" ? "#4f46e5" : "#e5e7eb",
              color: msg.type === "user" ? "white" : "black",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              maxWidth: "80%",
              wordBreak: "break-word",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          display: "flex",
          padding: "0.5rem",
          borderTop: "1px solid #ccc",
        }}
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            resize: "none",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #ccc",
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            marginLeft: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
