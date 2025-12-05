import { test, expect } from "@playwright/test";

test("home page renders core UI", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /quickshop/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /view cart/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /add to cart/i }).first()).toBeVisible();
});
