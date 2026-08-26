import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained .next/standalone build (server.js +
  // only the deps actually used) — the right shape for deploying to a plain
  // Node server on Azure App Service, rather than shipping the whole
  // node_modules tree.
  output: "standalone",
};

export default nextConfig;
