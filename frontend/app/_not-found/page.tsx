"use client"; // prevent build-time errors by running only in the browser

import { useEffect, useState } from "react";
import Typesense from "typesense";

export default function NotFoundPage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Typesense client with public search key
    const client = new Typesense.Client({
      nodes: [
        {
          host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
          port: 443,
          protocol: "https",
        },
      ],
      apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY!,
      connectionTimeoutSeconds: 2,
    });

    async function fetchSearch() {
      try {
        // Example search query for fallback suggestions
        const results = await client
          .collections("your_collection_name")
          .documents()
          .search({
            q: "example",
            query_by: "title,description",
            per_page: 5,
          });

        setSearchResults(results.hits || []);
      } catch (err) {
        console.error("Typesense search error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem", padding: "1rem" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Oops! The page you’re looking for does not exist.
      </p>

      {loading ? (
        <p>Loading suggestions...</p>
      ) : searchResults.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {searchResults.map((item: any) => (
            <li key={item.document.id}>
              {item.document.title} — {item.document.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No suggestions found.</p>
      )}

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          backgroundColor: "#4f46e5",
          color: "#fff",
          textDecoration: "none",
        }}
      >
        Go Home
      </a>
    </div>
  );
}
