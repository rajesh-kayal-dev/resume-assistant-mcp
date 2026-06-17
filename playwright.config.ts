import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: process.env.FRONTEND_URL || "http://localhost:3000",
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
