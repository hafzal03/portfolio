# Hafzal.dev — Personal Portfolio

Hafzal Ahmed's personal portfolio: a deliberately simple, high-polish site with exactly one
advanced engineering feature — an AI chatbot grounded in the site's own content via
Retrieval-Augmented Generation (RAG).

> Live at [hafzal.dev](https://hafzal.dev), deployed from `hafzal03/portfolio` to Azure Static Web
> Apps. Domain and repo references are still centralised so they stay easy to change (see
> [Renaming](#renaming--reconfirming-identity) below).

## Features

- **Portfolio** — hero, about, projects (bento-grid layout with a shared-element expand
  transition into full project detail), skills, courses/learning, services + indicative pricing,
  contact.
- **Projects** — Khwarizmi Studio featured as the flagship, plus every other real project from
  Hafzal's history, categorized and searchable via the "complete project archive."
- **AI chatbot ("Hafzal AI")** — a floating widget answering questions about Hafzal, grounded in
  this site's own content through RAG. It does not hallucinate: if something isn't in the
  knowledge base, it says so.
- Dark-first, motion-respecting UI (`prefers-reduced-motion` honored throughout), fully
  responsive, keyboard-accessible.
- SEO basics: metadata, Open Graph, semantic HTML.

## Tech stack

- **Frontend & backend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion —
  one app, no separate frontend/backend services.
- **AI chatbot**: Google Gemini via `@google/genai` (`gemini-embedding-001` for retrieval,
  `gemini-3.6-flash` for generation), called only from a server-side Route Handler — the API key
  never reaches the browser.
- **Testing**: Vitest + Testing Library.
- **CI/CD**: GitHub Actions.
- **Hosting**: Microsoft Azure Static Web Apps (currently live) — an alternative Azure App Service
  path is provisioned via Bicep for anyone who wants more control (see
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).

## Architecture

```
                 HAFZAL PORTFOLIO (single Next.js app)
                              |
              +---------------+----------------+
              |                                |
              v                                v
          WEBSITE                       AI CHATBOT (/api/chat)
       (static pages,                          |
        client components)                     v
                                     Retrieve relevant chunks
                                     from content/*.ts (cosine
                                     similarity over in-memory
                                     embeddings — no vector DB)
                                                |
                                                v
                                       Gemini generation
                                       (context + system prompt)
                                                |
              +---------------+----------------+
              |
              v
      Azure Static Web Apps (Next.js hybrid)
              |
              v
     GitHub Actions:
       - Quality Gate (lint, typecheck, test, build) — every push/PR
       - Azure's own SWA workflow — builds + deploys on push to master
```

### Why this architecture

- **One app, not a platform.** The chatbot's RAG pipeline runs in-process inside the same Next.js
  app (`src/lib/rag/`), not as a separate microservice. There is no vector database — the
  knowledge base is portfolio-scale (a few dozen chunks), so an in-memory array with cosine
  similarity is the simplest correct tool, not a false economy.
- **Content is the single source of truth.** Everything the chatbot knows is derived from
  `src/content/*.ts` — the same files that render the UI. Add a project to
  `src/content/projects.ts` and it appears on the page *and* becomes something the chatbot can
  answer questions about, automatically (`src/lib/rag/knowledge.ts` builds the chunks).
- **No exposed credentials.** `GEMINI_API_KEY` is read only in server-side code
  (`src/lib/rag/*`, `src/app/api/chat/route.ts`) and is never sent to the browser.

## Local development

Requires Node 22+.

```bash
npm install
cp .env.example .env.local   # then fill in GEMINI_API_KEY to enable the chatbot locally
npm run dev
```

Open http://localhost:3000. The site works fully without `GEMINI_API_KEY` set — the chatbot shows
a graceful "not configured" message instead of erroring.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For the chatbot to work | Server-side only. Used for embeddings + chat completion. |
| `NEXT_PUBLIC_SITE_URL` | No (defaults to `https://hafzal.dev`) | Used in SEO metadata (Open Graph, canonical URL). |

Never commit real values — `.env*` is gitignored. In production `GEMINI_API_KEY` is set as an
Azure Static Web Apps application setting (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)), not a
GitHub secret.

## Testing

```bash
npm run test        # run once
npm run test:watch  # watch mode
npm run typecheck
npm run lint
```

Tests focus on meaningful logic rather than coverage-for-its-own-sake: RAG retrieval ranking
(`src/lib/rag/embeddings.test.ts`), chat request validation (`src/lib/rag/chat.test.ts`), the
knowledge base's integrity — no duplicate/empty chunks, no fabricated course data
(`src/lib/rag/knowledge.test.ts`) — and the rate limiter (`src/lib/rateLimit.test.ts`).

## Deployment (Azure)

**Currently live via Azure Static Web Apps**, connected through the Azure Portal's GitHub
integration (resource `gentle-coast-01d41c510`). That integration auto-generated
[.github/workflows/azure-static-web-apps-gentle-coast-01d41c510.yml](.github/workflows/azure-static-web-apps-gentle-coast-01d41c510.yml),
which builds and deploys on every push to `master`. Separately,
[.github/workflows/ci.yml](.github/workflows/ci.yml) runs as a **quality gate only**
(lint → typecheck → test → build) on every push/PR — it doesn't deploy anything.

**One thing to set manually**: `GEMINI_API_KEY` isn't populated by the Azure Portal integration —
without it the live chatbot returns its graceful "not configured" message instead of answering.
Set it as a Static Web App application setting:

```bash
az staticwebapp appsettings set \
  --name gentle-coast-01d41c510 \
  --setting-names GEMINI_API_KEY="<your-gemini-key>"
```

An alternative Azure App Service path (Bicep + OIDC, one always-on instance instead of
consumption-based Functions) is documented in full — including why you might want it — in
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Renaming / reconfirming identity

Nothing here is hardcoded in a way that resists changing later:

- **Domain**: `NEXT_PUBLIC_SITE_URL` env var + the fallback in `src/app/layout.tsx`.
- **GitHub repo/username**: `src/content/contact.ts` (`githubUrl`) and the federated-credential
  subject in your Azure App Registration.
- **Resource names**: `appName` parameter in `infra/main.bicep`.

## Project structure

```
src/
  app/                Next.js App Router — pages, layout, /api/chat route handler
  components/
    sections/          Hero, About, Projects (+ detail modal), Skills, Courses, Services, Contact
    chatbot/            Floating chat widget (lazy-loaded panel)
    layout/             Navbar
    ui/                 Shared primitives (Reveal, SectionHeading, Badge, icons)
  content/              Single source of truth — profile, projects, skills, courses, services, contact
  lib/
    rag/                Knowledge base builder, embeddings/retrieval, chat generation, system prompt
    rateLimit.ts        In-memory sliding-window rate limiter for /api/chat
infra/
  main.bicep            Azure App Service Plan + Web App (alternative deploy path, not active)
.github/workflows/
  ci.yml                                             Quality gate: lint, typecheck, test, build
  azure-static-web-apps-gentle-coast-01d41c510.yml    Azure-generated build + deploy (active path)
docs/
  DEPLOYMENT.md          Full Azure setup walkthrough
  PRICING_RESEARCH.md    Sources behind the indicative pricing in the Services section
```

## What's intentionally not here

No microservices, no separate backend for the chatbot, no vector database, no message queue, no
Kubernetes. The chatbot is the one place this project chose engineering depth over simplicity —
everywhere else, simple and polished beats clever.
