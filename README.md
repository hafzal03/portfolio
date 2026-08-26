# Hafzal.dev — Personal Portfolio

Hafzal Ahamed's personal portfolio: a deliberately simple, high-polish site with exactly one
advanced engineering feature — an AI chatbot grounded in the site's own content via
Retrieval-Augmented Generation (RAG).

> Working name: `hafzal.dev`. GitHub org/repo (`Hafzal03/portfolio`) and the final domain are not
> yet confirmed — every reference to them in this repo is easy to change (see
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
- **AI chatbot**: OpenAI (`text-embedding-3-small` for retrieval, `gpt-4.1-mini` for generation),
  called only from a server-side Route Handler — the API key never reaches the browser.
- **Testing**: Vitest + Testing Library.
- **CI/CD**: GitHub Actions.
- **Hosting**: Microsoft Azure App Service (Linux, Node 22), provisioned via Bicep.

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
                                       OpenAI chat completion
                                       (context + system prompt)
                                                |
              +---------------+----------------+
              |
              v
      Azure App Service (Linux, Node 22)
              |
              v
     GitHub Actions CI/CD (lint, typecheck,
     test, build, deploy on push to main)
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
- **No exposed credentials.** `OPENAI_API_KEY` is read only in server-side code
  (`src/lib/rag/*`, `src/app/api/chat/route.ts`) and is never sent to the browser.

## Local development

Requires Node 22+.

```bash
npm install
cp .env.example .env.local   # then fill in OPENAI_API_KEY to enable the chatbot locally
npm run dev
```

Open http://localhost:3000. The site works fully without `OPENAI_API_KEY` set — the chatbot shows
a graceful "not configured" message instead of erroring.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | For the chatbot to work | Server-side only. Used for embeddings + chat completion. |
| `NEXT_PUBLIC_SITE_URL` | No (defaults to `https://hafzal.dev`) | Used in SEO metadata (Open Graph, canonical URL). |

Never commit real values — `.env*` is gitignored. In production these are set as Azure App
Service application settings (see [infra/main.bicep](infra/main.bicep)), not GitHub secrets.

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

The full setup is one App Service Plan + one Linux Web App (see [infra/main.bicep](infra/main.bicep)) —
deliberately no separate backend, database, or vector store.

### 1. One-time Azure setup

```bash
az group create --name hafzal-portfolio-rg --location eastus

az deployment group create \
  --resource-group hafzal-portfolio-rg \
  --template-file infra/main.bicep \
  --parameters openAiApiKey="<your-openai-key>"
```

### 2. GitHub → Azure OIDC (no long-lived secrets)

Create an Azure AD App Registration with a federated credential scoped to this repo's `main`
branch (`az ad app federated-credential create`, subject
`repo:<org>/<repo>:ref:refs/heads/main`), then add these **GitHub repository secrets**:

| Secret | Value |
|---|---|
| `AZURE_CLIENT_ID` | The App Registration's client ID |
| `AZURE_TENANT_ID` | Your Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Your Azure subscription ID |
| `AZURE_WEBAPP_NAME` | The Web App name from step 1's output (`<appName>-web`) |

Full step-by-step commands: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### 3. Push to `main`

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every push/PR: install → lint →
typecheck → test → build. On a push to `main` that passes, it builds the Next.js **standalone**
output and deploys it to the Azure Web App via OIDC — no publish-profile secret stored anywhere.

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
  main.bicep            Azure App Service Plan + Web App
.github/workflows/
  ci.yml                Lint, typecheck, test, build, deploy
docs/
  DEPLOYMENT.md          Full Azure setup walkthrough
  PRICING_RESEARCH.md    Sources behind the indicative pricing in the Services section
```

## What's intentionally not here

No microservices, no separate backend for the chatbot, no vector database, no message queue, no
Kubernetes. The chatbot is the one place this project chose engineering depth over simplicity —
everywhere else, simple and polished beats clever.
