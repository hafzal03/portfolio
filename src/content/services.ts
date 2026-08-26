// Services + indicative pricing. Pricing is calibrated against 2026 freelance/
// small-agency market research (see docs/PRICING_RESEARCH.md for sources and
// reasoning) — scaled to solo/freelance scope, not enterprise-agency scope.
// These are explicitly "starting at" figures, not fixed quotes.

export interface Service {
  name: string;
  description: string;
}

export const services: Service[] = [
  {
    name: "Website Development",
    description: "Modern, responsive websites for individuals and businesses.",
  },
  {
    name: "Business Websites",
    description: "Professional websites for businesses, portfolios, and startups.",
  },
  {
    name: "AI Integration",
    description: "Adding AI capabilities to existing applications and workflows.",
  },
  {
    name: "AI Chatbots",
    description: "Intelligent, knowledge-grounded chatbots using LLMs and RAG.",
  },
  {
    name: "Custom Software",
    description: "Custom software and application development based on requirements.",
  },
];

export interface PricingTier {
  name: string;
  startingAt: string;
  description: string;
  includes: string[];
  highlight?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    startingAt: "$600",
    description: "A focused single-page site — the fastest way to a credible presence.",
    includes: [
      "One-page responsive site",
      "Mobile-first, modern design",
      "Contact form",
      "Basic on-page SEO",
    ],
  },
  {
    name: "Professional",
    startingAt: "$1,800",
    description: "A multi-page business or portfolio site with real content structure.",
    includes: [
      "Multi-page responsive site",
      "Custom UI/UX design pass",
      "Content structure & on-page SEO",
      "Analytics setup",
    ],
    highlight: true,
  },
  {
    name: "AI",
    startingAt: "$2,500",
    description: "A professional site plus a custom RAG chatbot trained on your own content.",
    includes: [
      "Everything in Professional",
      "Custom RAG-based chatbot",
      "Knowledge base built from your content",
      "Secure backend — no exposed API keys",
    ],
  },
  {
    name: "Custom",
    startingAt: "Custom quote",
    description: "Bespoke software or AI systems scoped to your exact requirements.",
    includes: [
      "Scoped after a discovery conversation",
      "Custom architecture",
      "Integrations as required",
    ],
  },
];

export const pricingDisclaimer =
  "These are indicative starting prices for freelance-scoped work, calibrated against 2026 market research — not fixed quotes. Final pricing and timelines depend on scope and are agreed after a short discovery conversation. Enterprise-scale AI/RAG builds with deep CRM integration and compliance requirements run considerably higher industry-wide; the AI tier above reflects a focused, small-business scope, not that end of the market.";
