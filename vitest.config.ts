import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/__tests__/**/*.test.ts"],
    alias: {
      "@": new URL("./app/", import.meta.url).pathname,
      root: new URL("./", import.meta.url).pathname,
    },
    coverage: {
      enabled: true,
      reporter: ["text", "json", "html"],
      all: true,
      include: ["blog-cli/**/*.{ts,tsx}"],
      exclude: ["**/__tests__/**/*.test.ts", "node_modules", "app", "contents"],
    },
  },
});
