import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hafzal Ahamed — Software Engineer · AI Engineer",
  description:
    "Portfolio of Hafzal Ahamed, a software and AI engineer building intelligent software with Python, LLMs, RAG, AI agents, LangChain, LangGraph, and MCP. Featuring Khwarizmi Studio and an AI portfolio assistant.",
  keywords: [
    "Hafzal Ahamed",
    "Hafzal",
    "Software Engineer",
    "AI Engineer",
    "Khwarizmi Studio",
    "Qwarizmi Studio",
    "Python developer",
    "LLM engineer",
    "RAG",
    "LangChain",
    "LangGraph",
    "Model Context Protocol",
    "MCP",
  ],
  authors: [{ name: "Hafzal Ahamed" }],
  creator: "Hafzal Ahamed",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Hafzal Ahamed — Software Engineer · AI Engineer",
    description:
      "Building intelligent software with Python, AI, LLMs, RAG, agents, and modern engineering practices.",
    siteName: "Hafzal Ahamed",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hafzal Ahamed — Software Engineer · AI Engineer",
    description:
      "Building intelligent software with Python, AI, LLMs, RAG, agents, and modern engineering practices.",
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
