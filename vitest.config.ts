import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Globs, not bare names: the api/ Functions project has its own
    // node_modules, whose packages ship thousands of their own tests.
    exclude: ["**/node_modules/**", "**/.next/**", "**/out/**", "**/api/dist/**", "e2e/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
