import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DreamSky } from "@/components/dream/DreamSky";
import { CursorWisp } from "@/components/dream/CursorWisp";
import { Eyelids, EYELIDS_SCRIPT } from "@/components/dream/Eyelids";
import { DreamChrome } from "@/components/layout/DreamChrome";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { profile } from "@/content/profile";

// Display: Fraunces, loaded with its SOFT and WONK axes — the melting-letter
// effects animate those two axes (see .melt-char in globals.css).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
  // No explicit `icons` override here — app/icon.svg (the Somnium mark: an
  // orb over a mirror horizon) is picked up automatically via Next.js's file-convention favicon, and an
  // explicit override here would take precedence over it and hide it.
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
  themeColor: "#07061a", // matches --night-0, the deepest colour of the dream sky
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      // EYELIDS_SCRIPT may add .eyes-open before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: EYELIDS_SCRIPT }} />
      </head>
      <body>
        <Eyelids />
        <DreamSky />
        <DreamChrome />
        <div className="relative z-10">{children}</div>
        <ChatWidget />
        <CursorWisp />
      </body>
    </html>
  );
}
