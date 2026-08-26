// Minimal Azure infrastructure for hafzal.dev: one App Service Plan + one
// Linux Web App running the Next.js standalone server. Deliberately no
// separate backend service, database, or vector store — the chatbot's RAG
// pipeline runs in-process inside this same app (see src/lib/rag).

@description('Base name used to derive resource names (letters/numbers, no spaces).')
param appName string = 'hafzal-portfolio'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('App Service Plan SKU. B1 is the smallest tier with always-on support; F1 (free) works but sleeps when idle and has a daily CPU quota.')
@allowed(['F1', 'B1', 'B2'])
param skuName string = 'B1'

@description('OpenAI API key for the chatbot backend. Pass via --parameters at deploy time (e.g. from a GitHub secret) — never commit a real value.')
@secure()
param openAiApiKey string

@description('Public site URL, used for SEO metadata (Open Graph, canonical URL).')
param siteUrl string = 'https://hafzal.dev'

var planName = '${appName}-plan'
var webAppName = '${appName}-web'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  sku: {
    name: skuName
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
      alwaysOn: skuName != 'F1'
      appCommandLine: 'node server.js'
      minTlsVersion: '1.2'
      appSettings: [
        { name: 'OPENAI_API_KEY', value: openAiApiKey }
        { name: 'NEXT_PUBLIC_SITE_URL', value: siteUrl }
        { name: 'NODE_ENV', value: 'production' }
        { name: 'WEBSITE_RUN_FROM_PACKAGE', value: '0' }
      ]
    }
  }
}

output webAppName string = webApp.name
output defaultHostname string = webApp.properties.defaultHostName
