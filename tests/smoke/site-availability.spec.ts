import { test, expect } from '@fixtures/site.fixture';

test.describe('Site Availability @smoke', () => {

  test('app loads and todo input is visible @smoke', async ({ homePage }) => {
    expect(await homePage.isLoaded()).toBe(true);
  });

  test('page title is present @smoke', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('site is served over HTTPS @smoke', async ({ siteConfig }) => {
    expect(siteConfig.url.startsWith('https://')).toBe(true);
  });

  test('page loads within 10 seconds @smoke', async ({ page, siteConfig }) => {
    const start = Date.now();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    expect(Date.now() - start).toBeLessThan(10_000);
  });

  test('no critical JavaScript errors on load @smoke', async ({ page, siteConfig }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const critical = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('analytics') && !e.includes('gtag')
    );
    expect(critical).toHaveLength(0);
  });

  test('heading reads "todos" @smoke', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.toLowerCase()).toContain('todo');
  });

  test('new-todo input has correct placeholder @smoke', async ({ todoPage }) => {
    await expect(todoPage.newTodoInput).toHaveAttribute(
      'placeholder',
      'What needs to be done?'
    );
  });

});
