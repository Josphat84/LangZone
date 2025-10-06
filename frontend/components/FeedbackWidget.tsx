//frontend/components/FeedbackWidget.tsx


"use client";

import { useState, useEffect, useMemo } from "react";
// Import the function to get the Supabase client
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function FeedbackWidget() {
  // 🔑 FIX 1: Initialize the Supabase client instance using useMemo
  // This ensures 'supabase' is defined and only created once.
  const supabase = useMemo(() => getSupabaseClient(), []); 

  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // For realtime notifications
  const [newFeedback, setNewFeedback] = useState<any>(null);

  const feedbackTypes = ["Complaint", "Suggestion", "Experience"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setErrorMsg("");

    // 🔑 FIX 2: Check if supabase client is initialized before using it
    if (!supabase) {
      setErrorMsg("Client not initialized. Supabase configuration missing.");
      setLoading(false);
      return;
    }

    if (!form.type || !form.message) {
      setErrorMsg("Please provide feedback type and message.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("feedback")
        .insert([{ ...form, resolved: false }])
        .select();

      if (error) {
        setErrorMsg(error.message || "Error submitting feedback.");
      } else if (!data || data.length === 0) {
        setErrorMsg("No data returned from Supabase.");
      } else {
        setSuccess("✅ Feedback submitted successfully!");
        setForm({ name: "", email: "", type: "", message: "" });
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      setErrorMsg("Unexpected error. Check console.");
      console.error(err);
    }

    setLoading(false);
  };

  // Request browser notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Realtime feedback listener
  useEffect(() => {
    // 🔑 FIX 3: Prevent running on server/if client is null, and add dependency array
    if (!supabase || typeof window === "undefined") return;

    const channel = supabase
      .channel("feedback_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          const newFb = payload.new;
          setNewFeedback(newFb);

          // Play sound
          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => console.log("Audio play blocked"));

          // Browser notification
          if (typeof window !== "undefined" && Notification.permission === "granted") {
            new Notification("New Feedback", {
              body: `${newFb.name || "Anonymous"}: ${newFb.message}`,
            });
          }

          // Hide UI banner after 5 seconds
          setTimeout(() => setNewFeedback(null), 5000);
        }
      )
      .subscribe();

    return () => {
      // 🔑 FIX 4: Safely remove channel
      supabase.removeChannel(channel);
    };
  }, [supabase]); // Add supabase to the dependency array

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating UI banner for new feedback */}
      {newFeedback && (
        <div className="fixed bottom-24 right-6 z-50 bg-blue-500 text-white p-3 rounded-lg shadow-lg animate-bounce">
          New feedback from {newFeedback.name || "Anonymous"}: {newFeedback.message}
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xl px-6 py-3 transition-transform hover:scale-105"
          >
            💬 Feedback
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg animate-slide-up p-6 rounded-lg shadow-2xl border border-gray-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">We value your feedback</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <Input
              name="name"
              placeholder="Your Name (optional)"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email (optional)"
              value={form.email}
              onChange={handleChange}
            />

            {/* Dropdown for feedback type */}
            <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              name="message"
              placeholder="Share your feedback..."
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
            />

            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}