// app/_not-found/page.tsx
"use client"; // ensures this page is client-only

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [message, setMessage] = useState("Oops! Page not found.");

  useEffect(() => {
    // Example: safe client-side API call (OpenAI, Firebase, etc.)
    // This code runs only in the browser, not during build
    async function fetchData() {
      try {
        // Only run if API key exists
        if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) return;

        // Example API call (pseudo)
        // const res = await fetch("/api/my-endpoint");
        // const data = await res.json();
        // setMessage(data.message);
      } catch (error) {
        console.error("API call failed:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">{message}</p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go back home
      </Link>
    </div>
  );
}
