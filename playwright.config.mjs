import { defineConfig, devices } from '@playwright/test';

// Browser tests run against the production build served by `astro preview`.
// Run `npm run build` first (npm run test:e2e does this for you).
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4322', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npx astro preview --port 4322 --ignore-lock',
    url: 'http://localhost:4322/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
