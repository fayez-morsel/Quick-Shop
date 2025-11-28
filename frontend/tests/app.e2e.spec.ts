import { test, expect } from "@playwright/test";

const authenticate = async (page: import("@playwright/test").Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", "buyer");
    localStorage.setItem("userName", "E2E Tester");
    localStorage.setItem("userEmail", "tester@example.com");
  });
};

const seedAccount = async (page: import("@playwright/test").Page, account: { name: string; email: string; password: string; role: "buyer" | "seller"; storeId?: string }) => {
  await page.addInitScript((acc) => {
    localStorage.clear();
    localStorage.setItem(
      "qs-user-accounts",
      JSON.stringify([{ name: acc.name, email: acc.email.toLowerCase(), password: acc.password, role: acc.role, storeId: acc.storeId }])
    );
  }, account);
};

test("home page renders hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /quickshop/i }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /why choose quickshop/i })).toBeVisible();
});

test("product catalog shows product cards", async ({ page }) => {
  await page.goto("/product");
  await expect(page.getByRole("heading", { name: /all products/i })).toBeVisible();
  await expect(page.locator('article:has-text("Add to Cart")').first()).toBeVisible();
});

test("can open a product detail from catalog", async ({ page }) => {
  await page.goto("/product");
  await page.locator("article").first().click();
  await expect(page).toHaveURL(/\/product\/p[0-9]+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("out-of-stock product shows disabled add button", async ({ page }) => {
  await page.goto("/product/p7");
  const addButton = page.getByRole("button", { name: /out of stock/i });
  await expect(addButton).toBeVisible();
  await expect(addButton).toBeDisabled();
});

test("adding to cart increments header badge when authenticated", async ({ page }) => {
  await authenticate(page);
  await page.goto("/product/p1");
  await expect(page.evaluate(() => localStorage.getItem("isAuthenticated"))).resolves.toBe("true");
  await page.getByRole("button", { name: /^add to cart$/i }).click();
  await expect(page.getByLabel("View cart").locator("span")).toHaveText("1", { timeout: 10_000 });
});

test("cart drawer shows added product", async ({ page }) => {
  await authenticate(page);
  await page.goto("/product/p1");
  const title = await page.getByRole("heading", { level: 1 }).textContent();
  await page.getByRole("button", { name: /^add to cart$/i }).click();
  await page.getByLabel("View cart").click();
  await expect(page.getByText("My Cart")).toBeVisible();
  if (title) {
    await expect(page.locator("li").filter({ hasText: title })).toBeVisible();
  }
});

test("login with existing buyer account", async ({ page }) => {
  const account = { name: "Login Tester", email: "login@tester.com", password: "secret123", role: "buyer" as const };
  await seedAccount(page, account);
  await page.goto("/login");
  await page.getByPlaceholder("john@example.com").fill(account.email);
  await page.getByPlaceholder("••••••••").fill(account.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL("/");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("isAuthenticated"))).toBe("true");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("userEmail"))).toBe(account.email.toLowerCase());
});

test("register new buyer account", async ({ page }) => {
  const uniqueEmail = `reg-${Date.now()}@tester.com`;
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/register");
  await page.getByPlaceholder("John").fill("Reg");
  await page.getByPlaceholder("Doe").fill("Tester");
  await page.getByPlaceholder("you@example.com").fill(uniqueEmail);
  await page.getByPlaceholder("••••••••").first().fill("secret123");
  await page.getByPlaceholder("••••••••").nth(1).fill("secret123");
  const submit = page.getByRole("button", { name: /create buyer account/i });
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
  await expect(page).toHaveURL("/");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("isAuthenticated"))).toBe("true");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("userEmail"))).toBe(uniqueEmail.toLowerCase());
});

test("seller login redirects to dashboard", async ({ page }) => {
  const account = { name: "Seller Login", email: "seller@login.com", password: "secret123", role: "seller" as const, storeId: "my-store" };
  await seedAccount(page, account);
  await page.goto("/login", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Seller" }).click();
  await page.getByPlaceholder("john@example.com").fill(account.email);
  await page.getByPlaceholder("••••••••").fill(account.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/seller$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("userRole"))).toBe("seller");
});

test("seller registration creates account and enters seller hub", async ({ page }) => {
  const uniqueEmail = `seller-${Date.now()}@shop.com`;
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/register", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Seller" }).click();
  await page.getByPlaceholder("John").fill("Sell");
  await page.getByPlaceholder("Doe").fill("Er");
  await page.getByPlaceholder("you@example.com").fill(uniqueEmail);
  await page.getByPlaceholder("tech-hub").fill("My Test Store");
  await page.getByPlaceholder("••••••••").first().fill("secret123");
  await page.getByPlaceholder("••••••••").nth(1).fill("secret123");
  await page.getByRole("button", { name: /create seller account/i }).click();
  await expect(page).toHaveURL(/\/seller$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("userRole"))).toBe("seller");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("userEmail"))).toBe(uniqueEmail.toLowerCase());
});

test("seller can add a new product", async ({ page }) => {
  const account = { name: "Inventory Seller", email: "inventory@seller.com", password: "secret123", role: "seller" as const, storeId: "inventory-store" };
  await seedAccount(page, account);
  await page.goto("/login");
  await page.getByRole("button", { name: "Seller" }).click();
  await page.getByPlaceholder("john@example.com").fill(account.email);
  await page.getByPlaceholder("••••••••").fill(account.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/seller$/);

  await page.goto("/seller/products");
  await page.getByRole("button", { name: /add product/i }).click();
  await page.getByLabel("Product name").fill("E2E Test Product");
  await page.getByLabel("Category").selectOption("Tech");
  await page.getByLabel("Price").fill("123");
  await page.getByLabel("Stock").fill("5");
  await page.getByPlaceholder("https://example.com/product.jpg").fill("https://via.placeholder.com/300");
  await page.getByRole("button", { name: /create product/i }).click();
  await expect(page.getByText("Create new inventory item")).toBeHidden({ timeout: 10_000 });
  await page.waitForTimeout(500); 
  const tableRow = page.locator("tbody tr").filter({ hasText: "E2E Test Product" });
  await expect(tableRow).toBeVisible({ timeout: 15_000 });
});

test("favorite toggle marks a product as favorite", async ({ page }) => {
  await authenticate(page);
  await page.goto("/product");
  const firstCard = page.locator("article").first();
  const favoriteButton = firstCard.getByLabel("Toggle favorite");
  await favoriteButton.click();
  await expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
});

test("add to cart from product detail increases cart count", async ({ page }) => {
  await authenticate(page);
  await page.goto("/product/p2");
  const addButton = page.getByRole("button", { name: /^add to cart$/i });
  await addButton.click();
  await addButton.click();
  await expect(page.getByLabel("View cart").locator("span")).toHaveText("2");
});
