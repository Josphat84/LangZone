// _not-found/page.tsx
"use client"; // ensures this page is rendered on the client side

import React, { useEffect, useState } from "react";

// Optional: if you want to call your API, do it only on the client
export default function NotFoundPage() {
  const [message, setMessage] = useState("Page Not Found");

  useEffect(() => {
    async function fetchData() {
      // Example: API call (only runs on client, not during build)
      if (process.env.NEXT_PUBLIC_API_KEY) {
        try {
          // Replace this with your actual API logic
          const res = await fetch("/api/example"); 
          if (res.ok) {
            const data = await res.json();
            setMessage(data.message || "Page Not Found");
          }
        } catch (err) {
          console.error("API fetch failed:", err);
        }
      }
    }
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1>404</h1>
      <p>{message}</p>
    </div>
  );
}

// Prevent prerendering at build time
export const dynamic = "force-dynamic";
