import { Braces, Cloud, Eye, Globe, GraduationCap, Sparkles, type LucideIcon } from "lucide-react";
import type { ProjectCategory } from "@/content/projects";

interface PortalVisual {
  /** The sky painted inside the portal's arch. */
  sky: string;
  /** The object floating in that sky. */
  Icon: LucideIcon;
  /** Accent for the object and its glow. */
  tint: string;
}

// Every category dreams a different hour.
export const PORTAL_VISUALS: Record<ProjectCategory, PortalVisual> = {
  "AI Engineering": {
    sky: "bg-[radial-gradient(60%_45%_at_50%_62%,rgba(255,184,112,0.6),transparent_70%),linear-gradient(180deg,#140f3d_0%,#3d1f63_50%,#9a4a62_62%,#1a1238_62.4%,#07061a_100%)]",
    Icon: Sparkles,
    tint: "text-dawn-strong",
  },
  "Web Development": {
    sky: "bg-[radial-gradient(55%_45%_at_60%_60%,rgba(125,211,252,0.45),transparent_70%),linear-gradient(180deg,#0a1440_0%,#1d3a7a_52%,#4f7fb5_62%,#0d1a3a_62.4%,#050a1c_100%)]",
    Icon: Globe,
    tint: "text-sky-200",
  },
  "DevOps & Cloud": {
    sky: "bg-[radial-gradient(60%_45%_at_40%_58%,rgba(182,156,255,0.5),transparent_70%),linear-gradient(180deg,#0b0b2e_0%,#2a2766_52%,#6b63b5_62%,#12103a_62.4%,#06061a_100%)]",
    Icon: Cloud,
    tint: "text-mercury",
  },
  "Academic & Research": {
    sky: "bg-[radial-gradient(55%_45%_at_50%_60%,rgba(255,170,190,0.45),transparent_70%),linear-gradient(180deg,#1a0d33_0%,#4a1f55_52%,#a3527a_62%,#1f0f2e_62.4%,#0a0614_100%)]",
    Icon: GraduationCap,
    tint: "text-pink-200",
  },
  "Computer Vision & ML": {
    sky: "bg-[radial-gradient(55%_45%_at_50%_60%,rgba(126,226,184,0.4),transparent_70%),linear-gradient(180deg,#07172a_0%,#12415a_52%,#3d8f8a_62%,#0a1f2a_62.4%,#040c14_100%)]",
    Icon: Eye,
    tint: "text-emerald-200",
  },
  "Software Engineering": {
    sky: "bg-[radial-gradient(55%_45%_at_55%_60%,rgba(255,200,120,0.45),transparent_70%),linear-gradient(180deg,#0f0f2e_0%,#2e2a5c_52%,#8a6a4a_62%,#16142c_62.4%,#08071a_100%)]",
    Icon: Braces,
    tint: "text-amber-100",
  },
};
