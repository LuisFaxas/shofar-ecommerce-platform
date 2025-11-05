import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.locator('h1')).toContainText('Welcome to SHOFAR Storefront');

    // Check for description
    await expect(page.locator('p')).toContainText('A modern e-commerce platform');
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/SHOFAR Storefront/);
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');

    // Basic accessibility check - no errors in console
    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    expect(logs).toHaveLength(0);
  });
});