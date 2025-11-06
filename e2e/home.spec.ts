import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/');

    // Check for main heading - will be brand-specific
    await expect(page.locator('h1')).toContainText('Welcome');

    // Check for description
    await expect(page.locator('p')).toContainText('platform');
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title - will be brand-specific
    await expect(page).toHaveTitle(/TOOLY|PEPTIDES/);
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