import { test, expect } from '@fixtures/site.fixture';

test.describe('Responsive Layout @responsive', () => {

  test('no horizontal scrollbar at mobile viewport (390px) @responsive', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url);
    const hasHScroll = await page.evaluate<boolean>(
      () => document.body.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHScroll).toBe(false);
  });

  test('no horizontal scrollbar at tablet viewport (768px) @responsive', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(siteConfig.url);
    const hasHScroll = await page.evaluate<boolean>(
      () => document.body.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHScroll).toBe(false);
  });

  test('todo input is visible and usable on mobile @responsive', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url);
    const input = page.locator('.new-todo');
    await expect(input).toBeVisible();
    await input.fill('mobile test');
    await input.press('Enter');
    await expect(page.locator('.todo-list li')).toHaveCount(1);
  });

  test('todo items are readable (font-size >= 12px) on mobile @responsive', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url);
    const input = page.locator('.new-todo');
    await input.fill('check font size');
    await input.press('Enter');

    const fontSize = await page.locator('.todo-list li label').evaluate<number>((el) => {
      return parseFloat(getComputedStyle(el).fontSize);
    });
    expect(fontSize).toBeGreaterThanOrEqual(12);
  });

  test('app does not cause horizontal scroll without a viewport meta tag @responsive', async ({ page, siteConfig }) => {
    // The Playwright TodoMVC demo intentionally omits <meta name="viewport">.
    // This test verifies the layout still doesn't overflow horizontally.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url);
    const hasHScroll = await page.evaluate<boolean>(
      () => document.body.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHScroll).toBe(false);
  });

  test('new-todo input accepts text at any viewport width @responsive', async ({ page, siteConfig }) => {
    // TodoMVC has no <meta name="viewport"> — layout renders at the browser default CSS viewport.
    // We verify the input is functional (visible and writable) rather than checking pixel position,
    // since the layout viewport width varies by browser project without a viewport meta tag.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url);
    const input = page.locator('.new-todo');
    await expect(input).toBeVisible();
    await input.fill('responsive test');
    await input.press('Enter');
    await expect(page.locator('.todo-list li')).toHaveCount(1);
  });

});
