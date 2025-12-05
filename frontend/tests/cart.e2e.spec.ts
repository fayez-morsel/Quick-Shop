import { test, expect } from "@playwright/test";

test("cart flow adds an item and opens cart", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /open menu/i }).click();
  await page.getByRole("button", { name: /log in/i }).click();

  await page.getByRole("textbox", { name: "Email" }).fill("lala@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).fill("11223344");
  await page.getByRole("button", { name: /sign in as buyer/i }).click();

  await page.waitForSelector('[data-testid="add-to-cart"]', { timeout: 20000 });
  await page.locator('[data-testid="add-to-cart"]').first().click();

  
  await page.getByRole("button", { name: /view cart/i }).click();
  await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole("heading", { name: /my cart/i })).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole("button", { name: /checkout/i })).toBeVisible({ timeout: 20000 });
});
