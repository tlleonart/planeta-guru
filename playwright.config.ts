import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E testing
 * Supports multiple locales as per TESTING.md requirements
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Test with default locale (Mexico Spanish)
    {
      name: "chromium-mx-es",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000/mx-es",
      },
    },
    // Test with Mexico English
    {
      name: "chromium-mx-en",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000/mx-en",
      },
    },
    // Test with Argentina Spanish
    {
      name: "chromium-ar-es",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000/ar-es",
      },
    },
    // Test with South Africa English
    {
      name: "chromium-za-en",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000/za-en",
      },
    },
    // Mobile testing
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3000/mx-es",
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
