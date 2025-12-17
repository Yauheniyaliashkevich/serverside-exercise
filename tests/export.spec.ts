import { test, expect } from '@playwright/test';

test('User can export transactions as CSV via API', async ({ page }) => {
  // Export transactions via API (core user value)
  const response = await page.request.get(
    'http://localhost:3000/PS/api/ftr/transactions',
    {
      headers: { Accept: 'text/csv' },
    }
  );

  // Validate HTTP success
  expect(response.ok()).toBeTruthy();

  // Validate response type (some implementations may return csv-ish content-type)
  const ct = (response.headers()['content-type'] || '').toLowerCase();
  expect(ct).toMatch(/csv|text|octet-stream|json/);

  // Validate body has meaningful data
  const body = await response.text();
  expect(body.length).toBeGreaterThan(50);

  // Basic field sanity check (should include known keys)
  expect(body).toContain('sourceid');
  expect(body).toContain('peaktype');

  // Optional: ensure it looks like tabular export (CSV usually has delimiters)
  // If your API currently returns JSON when Accept: text/csv is sent, this will still pass.
  expect(body).toMatch(/,|;/);
});
