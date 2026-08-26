import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { profile } from "@/content/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hafzal.dev";

const titleTag = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: titleTag,
  description: `Portfolio of ${profile.name} (${profile.legalName}), a software and AI engineer building intelligent software with Python, LLMs, RAG, AI agents, LangChain, LangGraph, and MCP. Featuring Khwarizmi Studio and an AI portfolio assistant.`,
  keywords: [
    profile.name,
    profile.legalName,
    "Hafzal Ahamed",
    "Hafzal",
    "Software Engineer",
    "AI Engineer",
    "Python Developer",
    "Khwarizmi Studio",
    "Qwarizmi Studio",
    "LLM engineer",
    "RAG",
    "Retrieval-Augmented Generation",
    "AI Agents",
    "LangChain",
    "LangGraph",
    "Model Context Protocol",
    "MCP",
    "Informatics",
    "Computer-Aided Software Engineering",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: titleTag,
    description: profile.tagline,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: titleTag,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Navbar />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
