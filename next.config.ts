import type { NextConfig } from "next";

// Deployed via Azure Static Web Apps' own hybrid Next.js build (Oryx),
// which expects the default Next.js build output and converts routes/API
// handlers itself — it does NOT support `output: "standalone"`. If you
// switch to the alternative Azure App Service path documented in
// docs/DEPLOYMENT.md, re-add `output: "standalone"` there instead.
const nextConfig: NextConfig = {};

export default nextConfig;
