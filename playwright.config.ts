import { defineConfig, devices } from "@playwright/test";

// Uses the installed Chrome, which GitHub's runners have too, so there's no browser download.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // At 11 workers, page loads timed out at random. At 3, 144 runs in a row passed.
  workers: 3,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: "http://localhost:3000", channel: "chrome" },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    {
      name: "phone",
      use: { ...devices["Pixel 7"], channel: "chrome" },
    },
  ],
});
