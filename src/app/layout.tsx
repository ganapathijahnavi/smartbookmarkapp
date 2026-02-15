import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AuthAvatarMenu from "@/components/AuthAvatarMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Bookmark Manager",
  description: "Save, organize, and access your bookmarks instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          w-full
          bg-black
        `}
      >
        {/* Navbar */}
        <header className="
          w-full
          flex
          justify-end
          items-center
          px-6
          py-4
          border-b
          border-zinc-800
          bg-black
          sticky
          top-0
          z-50
        ">
          <AuthAvatarMenu />
        </header>
        {/* Main content */}
        <main className="w-full min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
