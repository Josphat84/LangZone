// frontend/app/_not-found.tsx
"use client";

import ClientLayout from "@/components/ClientLayout";

export default function NotFound() {
  return (
    <ClientLayout>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-gray-700">404 - Page Not Found</h1>
      </div>
    </ClientLayout>
  );
}
