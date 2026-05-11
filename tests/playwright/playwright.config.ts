import "tsconfig-paths/register.js";
import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";
 
const authDir = path.resolve(".auth");
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir);
  console.log(".auth directory created");
}
 
export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3002",
    navigationTimeout: 60000,
    trace: "on-first-retry",
    testIdAttribute: "data-test-id",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      testDir: "./tests/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002",
      },
      dependencies: process.env.CI ? ["setup"] : [],
    },
    {
      name: "chromium",
      testDir: "./tests/web",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
      dependencies: process.env.CI ? ["setup"] : [],
    },
  ],
  webServer: process.env.CI
    ? [
        {
          reuseExistingServer: true,
          command: "pnpm start:admin",
          url: "http://localhost:3002",
        },
        {
          reuseExistingServer: true,
          command: "pnpm start:web",
          url: "http://localhost:3001",
        },
      ]
    : [
        {
          reuseExistingServer: true,
          url: "http://localhost:3001",
          command: "pnpm --filter web dev",
          timeout: 5000,
        },
        {
          reuseExistingServer: true,
          url: "http://localhost:3002",
          command: "pnpm --filter admin dev",
          timeout: 10000,
        },
      ],
});