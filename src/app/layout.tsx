import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AmbientField } from "@/components/ambient/AmbientField";
import { SmoothScroll } from "@/components/system/SmoothScroll";
import { SystemNav } from "@/components/system/SystemNav";
import { Cursor } from "@/components/system/Cursor";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { profile } from "@/content/profile";

// One grotesque carries the whole page, from 900-weight display down to body
// copy: Archivo holds its proportions at every size, so the hierarchy comes
// from weight and scale rather than from switching families.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Mono is structural, not decorative: indices, labels, metadata, data.
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
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <AmbientField />
        <SmoothScroll />
        <SystemNav />
        <div className="relative z-10">{children}</div>
        <ChatWidget />
        <Cursor />
      </body>
    </html>
  );
}
