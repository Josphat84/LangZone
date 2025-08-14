import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Footer from '@/components/Footer';
import Header from '@/components/Header'; // ✅ Your custom header

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Language Learning App",
  description: "Find your perfect language instructor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set!");
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800">
            Error: Google Client ID is not configured.
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800`}>
        <GoogleOAuthProvider clientId={googleClientId}>
          {/* ✅ Use Header component */}
          <Header />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
