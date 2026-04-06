import { test, expect } from '@playwright/test';

test('homepage checkout redirects to PayUni', async ({ page }) => {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });

  const candidates = [
    page.getByRole('button', { name: /立即購買|馬上購買|購買課程|立即開始/i }),
    page.getByRole('link', { name: /立即購買|馬上購買|購買課程|立即開始/i }),
    page.getByText(/立即購買課程|馬上購買|購買課程/),
  ];

  let clicked = false;
  for (const locator of candidates) {
    if (await locator.first().isVisible().catch(() => false)) {
      await locator.first().click();
      clicked = true;
      break;
    }
  }

  expect(clicked).toBeTruthy();

  await page.waitForURL(/payuni\.com\.tw/i, { timeout: 30000 });
  expect(page.url()).toMatch(/payuni\.com\.tw/i);

  const emptyRouteError = errors.find((e) =>
    e.includes('Matched leaf route at location "/api/purchase" does not have an element or Component')
  );
  expect(emptyRouteError).toBeFalsy();
});
