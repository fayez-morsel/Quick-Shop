import { test, expect } from "@playwright/test";

test("home page renders core UI", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const addButtons = page.locator(
    '[data-testid="add-to-cart"], button:has-text("Add to Cart"), [role="button"]:has-text("Add to Cart")'
  );
  await expect(addButtons.first()).toBeVisible({ timeout: 20000 });
});
