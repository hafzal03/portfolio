import type { NextConfig } from "next";

/**
 * The site is exported as static HTML (`out/`) and hosted on Azure Static Web
 * Apps, with Hafzal AI running beside it as a managed Azure Function (see
 * `api/`). Static Web Apps' hybrid Next.js mode — which ran the whole app on a
 * managed Next.js server — is a preview feature and stopped being able to
 * deploy this site in September 2026: every deployment failed at "web app warm
 * up", on two separate Static Web App resources and with previously working
 * commits. A static export plus a Functions API uses only long-stable parts of
 * the platform.
 *
 * Nothing in the site needs a server at request time: every page is
 * pre-rendered, and the only dynamic endpoint is /api/chat.
 */
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
