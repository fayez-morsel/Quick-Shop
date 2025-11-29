import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  testDir: path.join(__dirname, "tests"),
  testMatch: /.*\.spec\.(js|ts|mjs|mts|jsx|tsx)/,
  testIgnore: ["**/utils.ts"],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host --port 5173",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "pipe",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
