# Deployment Guide — Azure

## Currently deployed: Azure Static Web Apps

The live site (`Hafzal03/portfolio`, resource name `gentle-coast-01d41c510`) is deployed via
**Azure Static Web Apps**, connected through the Azure Portal's GitHub integration. That
integration auto-committed
[`.github/workflows/azure-static-web-apps-gentle-coast-01d41c510.yml`](../.github/workflows/azure-static-web-apps-gentle-coast-01d41c510.yml)
to this repo — it triggers on every push to `master`, builds the app with Azure's own Oryx-based
Next.js adapter (which auto-converts `src/app/api/chat/route.ts` into a managed Azure Function),
and deploys it. `AZURE_STATIC_WEB_APPS_API_TOKEN_GENTLE_COAST_01D41C510` (a GitHub secret) is what
authorizes that upload.

[.github/workflows/ci.yml](../.github/workflows/ci.yml) runs alongside it as a **separate quality
gate** (lint/typecheck/test/build on every push/PR) — it does not deploy anything itself.

### Required: set `OPENAI_API_KEY` on the Static Web App

This is not set automatically by the GitHub integration and **the live chatbot will not work
without it**. Set it as an application setting (not a GitHub secret — it's a runtime secret for
the deployed app, read server-side only):

```bash
az staticwebapp appsettings set \
  --name gentle-coast-01d41c510 \
  --setting-names OPENAI_API_KEY="<your-openai-key>"
```

Or: Azure Portal → your Static Web App → Settings → Environment variables → Add.

Optionally also set `NEXT_PUBLIC_SITE_URL` there once the final domain is confirmed (used for SEO
metadata only).

### Things to know about the Static Web Apps path

- **No `output: "standalone"`** — Azure's Next.js adapter builds and converts the app itself; a
  standalone Node bundle isn't compatible with it (see the comment in
  [next.config.ts](../next.config.ts)).
- **The in-memory embedding cache and rate limiter reset more often than on a always-on server.**
  `src/lib/rag/embeddings.ts` caches computed embeddings per warm process, and
  `src/lib/rateLimit.ts` tracks request counts per process — both scoped to a single Azure
  Functions instance. On Static Web Apps' consumption-based Functions runtime, that instance can
  recycle between requests more readily than a dedicated App Service instance would, so the cache
  and rate limiter are best-effort here, not a hard guarantee. Functionally this only costs a
  little extra latency/embedding-API spend on a cold instance — it does not break correctness. If
  this becomes a real cost/latency issue at higher traffic, see the App Service path below, which
  keeps one warm instance.
- **Custom domain**: once purchased, add it under the Static Web App's "Custom domains" blade in
  the Portal — no code or workflow change needed.

## Alternative: Azure App Service (more control, always-on)

Not currently in use, but here if the Static Web Apps tradeoffs above ever become a real problem.
This path deploys a plain Node server via [infra/main.bicep](../infra/main.bicep) instead of
Azure's Next.js adapter — re-add `output: "standalone"` to `next.config.ts` if you switch to it.

### 1. Provision resources

```bash
az group create --name hafzal-portfolio-rg --location eastus

az deployment group create \
  --resource-group hafzal-portfolio-rg \
  --template-file infra/main.bicep \
  --parameters openAiApiKey="<your-openai-key>" \
  --parameters siteUrl="https://hafzal.dev"
```

### 2. GitHub → Azure OIDC (no long-lived secrets)

```bash
az ad app create --display-name "hafzal-portfolio-github-actions"
APP_ID=$(az ad app list --display-name "hafzal-portfolio-github-actions" --query "[0].appId" -o tsv)
az ad sp create --id "$APP_ID"

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create \
  --assignee "$APP_ID" \
  --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/hafzal-portfolio-rg"

az ad app federated-credential create \
  --id "$APP_ID" \
  --parameters '{
    "name": "github-master",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:Hafzal03/portfolio:ref:refs/heads/master",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### 3. Add a deploy job back to CI

`ci.yml` was deliberately stripped down to a quality gate once Static Web Apps became the active
path — if you switch to App Service, add a `deploy` job back (same shape as before: download a
`next build` artifact, `azure/login@v2` with the secrets below, `azure/webapps-deploy@v3`).

GitHub repository secrets needed: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`,
`AZURE_WEBAPP_NAME` (the Bicep output).

### Rotating the OpenAI key (App Service path)

```bash
az webapp config appsettings set \
  --resource-group hafzal-portfolio-rg \
  --name <webAppName> \
  --settings OPENAI_API_KEY="<new-key>"
```
