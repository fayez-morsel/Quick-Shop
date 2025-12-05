import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  await page.getByRole('button', { name: 'QuickShop' }).first().click();
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: 'QuickShop' }).first().click();
  await page.getByRole('button', { name: 'Electronics' }).click();
  await page.getByRole('button', { name: 'QuickShop' }).first().click();
});