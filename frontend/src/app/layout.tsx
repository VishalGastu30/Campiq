import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CompareProvider } from "@/context/CompareContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { FloatingCompareBar } from "@/components/compare/FloatingCompareBar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campiq - Find your campus. Own your future.",
  description: "The most advanced college discovery platform for Indian students to search, compare, and shortlist their dream destinations.",
  keywords: ["college", "university", "india", "admissions", "compare colleges", "btech", "mba", "nirf rankings", "college predictor"],
  openGraph: {
    title: "Campiq - The Ultimate College Discovery Platform",
    description: "Search, compare, and decide smarter with AI-driven college recommendations and detailed insights.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://campiq.in",
    siteName: "Campiq",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campiq - Find your campus. Own your future.",
    description: "Search, compare, and decide smarter.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-campiq-base text-campiq-text-primary min-h-screen flex flex-col overflow-x-hidden pb-16 md:pb-0`}
      >
        <AuthProvider>
          <CompareProvider>
            <Navbar />
            <PageWrapper>
              {children}
            </PageWrapper>
            <FloatingCompareBar />
            <MobileBottomNav />
            <Footer />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-raised)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--accent-teal)',
                    secondary: 'var(--bg-raised)',
                  },
                },
              }}
            />
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
