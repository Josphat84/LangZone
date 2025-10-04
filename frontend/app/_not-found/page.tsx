"use client";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page Not Found</p>
    </div>
  );
}

// Ensure the page is not prerendered
export const dynamic = "force-dynamic";
