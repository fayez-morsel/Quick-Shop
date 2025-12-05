import { test, expect } from "@playwright/test";

test("home page renders core UI", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForLoadState("networkidle", { timeout: 30000 });

  await expect(page.getByRole("heading", { name: /quickshop/i })).toBeVisible({ timeout: 30000 });

  const cartButton = page.getByRole("button", { name: /cart/i }).first();
  await expect(cartButton).toBeVisible({ timeout: 30000 });
});
