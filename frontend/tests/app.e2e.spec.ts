import { test, expect } from "@playwright/test";

test("home page renders hero and products grid shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /quickshop/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /cart/i })).toBeVisible();
  // Ensure product area renders without crashing
  await expect(page.locator("main")).toBeVisible();
});
