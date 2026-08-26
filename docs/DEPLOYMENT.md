# Deployment Guide — Azure

This walks through taking the app from a local build to a live Azure deployment driven by GitHub
Actions, with no long-lived Azure credential stored in GitHub.

Prerequisites: [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) logged in
(`az login`), and admin access to this GitHub repository.

## 1. Provision Azure resources

```bash
az group create --name hafzal-portfolio-rg --location eastus

az deployment group create \
  --resource-group hafzal-portfolio-rg \
  --template-file infra/main.bicep \
  --parameters openAiApiKey="<your-openai-key>" \
  --parameters siteUrl="https://hafzal.dev"
```

This creates one App Service Plan (B1 by default — pass `--parameters skuName=F1` for the free
tier while testing, though F1 sleeps when idle) and one Linux Web App running Node 22. Note the
`webAppName` output — you'll need it below.

## 2. Set up GitHub → Azure OIDC login

This avoids storing a Azure publish-profile or client-secret in GitHub — GitHub Actions
authenticates using a short-lived federated token instead.

```bash
# Create an App Registration
az ad app create --display-name "hafzal-portfolio-github-actions"
APP_ID=$(az ad app list --display-name "hafzal-portfolio-github-actions" --query "[0].appId" -o tsv)

# Create a service principal for it
az ad sp create --id "$APP_ID"

# Grant it Contributor on the resource group
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create \
  --assignee "$APP_ID" \
  --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/hafzal-portfolio-rg"

# Add a federated credential scoped to this repo's main branch
az ad app federated-credential create \
  --id "$APP_ID" \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:<your-github-org>/<your-repo>:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

Replace `<your-github-org>/<your-repo>` with the real repository path (e.g. `Hafzal03/portfolio`,
once confirmed). If the repo path changes later, update the federated credential's `subject` —
nothing else needs to change.

## 3. Add GitHub repository secrets

Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `AZURE_CLIENT_ID` | `$APP_ID` from step 2 |
| `AZURE_TENANT_ID` | `az account show --query tenantId -o tsv` |
| `AZURE_SUBSCRIPTION_ID` | `$SUBSCRIPTION_ID` from step 2 |
| `AZURE_WEBAPP_NAME` | The `webAppName` output from step 1 |

## 4. Deploy

Push to `main`. [.github/workflows/ci.yml](../.github/workflows/ci.yml) runs lint → typecheck →
test → build, then (only on `main`, only if everything passed) builds the Next.js standalone
output and deploys it via `azure/webapps-deploy`.

## Updating the OpenAI key later

The key lives in Azure App Service application settings, not in GitHub. Rotate it with:

```bash
az webapp config appsettings set \
  --resource-group hafzal-portfolio-rg \
  --name <webAppName> \
  --settings OPENAI_API_KEY="<new-key>"
```

## Rolling back

Azure App Service keeps prior deployment slots' history. The fastest rollback is reverting the
commit on `main` and letting CI/CD redeploy — there's no manual infra step to reverse for a simple
code rollback.
