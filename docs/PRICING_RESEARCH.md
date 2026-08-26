# Pricing research — sources and reasoning

The indicative pricing tiers in `src/content/services.ts` were calibrated against 2026 market
research, then scaled down from enterprise-agency scope to freelance/solo-developer scope. This
document exists so the numbers can be re-checked and updated rather than treated as arbitrary.

## Website packages (Starter, Professional)

Research on freelance/small-agency website pricing in 2026 consistently showed:

- A "Starter Package" (one-page site, responsive, contact form, basic SEO) in the **$800–$1,200**
  range from small studios/freelancers.
- A basic multi-page (~5 page) professional site from a freelancer: **$1,500–$4,000**.
- General freelance hourly rates: **$50–$150/hour**, with $100–150/hour typical for an
  experienced freelancer with a portfolio.

Sources: [jim.com — Small Business Website Cost in 2026](https://www.jim.com/blog/small-business-website-cost),
[tldesignstudios.com — Website Design Packages & Pricing 2026](https://www.tldesignstudios.com/affordable-website-design-packages-in-complete-pricing-guide-whats-included/),
[websiteprofitcourse.com — 2026 Pricing Guide](https://websiteprofitcourse.com/how-much-should-i-charge-for-website/).

**Chosen figures**: Starter from $600 (slightly below the low end, appropriate for an early-career
freelancer building a portfolio of client work), Professional from $1,800 (within the multi-page
freelance band).

## AI / RAG chatbot package

Enterprise-scale research showed a much wider, higher range:

- Full custom RAG chatbot builds: **$30,000–$150,000**, with mid-complexity builds (knowledge
  base + multi-turn + CRM integration + analytics) averaging **$75,000–$120,000** over 8–14 weeks.
- AI development agency blended rates: **$150–$350/hour** (US), **$80–$150/hour** (Eastern
  Europe), **$20–$45/hour** (Southeast Asia freelance).
- Ongoing operating costs (cloud hosting, LLM API fees, vector DB) commonly **$300–$2,800/month**
  combined for a production system.

Source: [kellton.com — Custom AI chatbot development with LLMs and RAG: 2026 cost guide](https://www.kellton.com/kellton-tech-blog/custom-ai-chatbot-development-llm-rag),
and related 2026 chatbot-cost guides surfaced in the same research pass.

**Why the site's "AI" tier ($2,500 starting) is far below that range**: those enterprise figures
assume CRM integration, compliance requirements, multi-intent handling, and a multi-week
production engagement — the scope this portfolio's own chatbot deliberately avoids (see the main
README's "what's intentionally not here" section). The $2,500 figure reflects a scoped-down,
freelance-solo version: a knowledge base built from a client's own content, in-memory retrieval
(no vector database), and a single integrated chat UI — closer in scope to what
`src/lib/rag/` actually implements for this site. `pricingDisclaimer` in
`src/content/services.ts` states this explicitly so it's never presented as if it were the
enterprise number.

## Custom tier

Left as "Custom quote" rather than a number — scope varies too widely (custom software, larger AI
systems) to give a meaningful default without inventing a figure nobody asked for.

## Revisiting this later

If Hafzal's actual freelance rates or completed-project pricing become available, replace these
research-calibrated estimates with real figures and delete the "calibrated against market
research" framing in `pricingDisclaimer`.
