import { test, expect } from '@fixtures/site.fixture';

test.describe('Filter Navigation @navigation', () => {

  test.beforeEach(async ({ todoPage }) => {
    // Seed a couple of items so the footer/filters are visible
    await todoPage.addTodos(['Buy groceries', 'Walk the dog', 'Read a book']);
    await todoPage.toggleTodo(1); // mark "Walk the dog" completed
  });

  test('filters container is visible after items are added @navigation', async ({ navigationPage, page, siteConfig }) => {
    await page.goto(siteConfig.url);
    await page.locator('.new-todo').fill('seed item');
    await page.locator('.new-todo').press('Enter');
    expect(await navigationPage.isNavVisible()).toBe(true);
  });

  test('All filter link is present and clickable @navigation', async ({ todoPage, navigationPage }) => {
    await expect(todoPage.filterAll).toBeVisible();
    await navigationPage.clickFilter('All');
    expect(await navigationPage.getActiveFilter()).toBe('All');
  });

  test('Active filter shows only incomplete todos @navigation', async ({ todoPage, navigationPage }) => {
    await navigationPage.clickFilter('Active');
    expect(await navigationPage.getActiveFilter()).toBe('Active');
    const texts = await todoPage.getTodoTexts();
    expect(texts).toContain('Buy groceries');
    expect(texts).not.toContain('Walk the dog');
  });

  test('Completed filter shows only done todos @navigation', async ({ todoPage, navigationPage }) => {
    await navigationPage.clickFilter('Completed');
    expect(await navigationPage.getActiveFilter()).toBe('Completed');
    const texts = await todoPage.getTodoTexts();
    expect(texts).toContain('Walk the dog');
    expect(texts).not.toContain('Buy groceries');
  });

  test('switching back to All shows all todos @navigation', async ({ todoPage, navigationPage }) => {
    await navigationPage.clickFilter('Active');
    await navigationPage.clickFilter('All');
    // Use toHaveCount so Playwright retries until the DOM settles
    await expect(todoPage.todoItems).toHaveCount(3);
  });

  test('no mobile hamburger menu exists @navigation', async ({ navigationPage }) => {
    const toggle = await navigationPage.getMobileMenuToggle();
    expect(toggle).toBeNull();
  });

});
