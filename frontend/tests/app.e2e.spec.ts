import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  await page.getByRole('checkbox', { name: 'accessories' }).check();
  await page.getByRole('checkbox', { name: 'accessories' }).uncheck();
});
