import { test, expect } from '@fixtures/site.fixture';

test.describe('Visual Regression @visual', () => {

  test('empty state - desktop @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url);
    await expect(page).toHaveScreenshot('todo-empty-desktop.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('with todos - desktop @visual', async ({ todoPage, page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await todoPage.addTodos(['Buy groceries', 'Walk the dog', 'Read a book']);
    await expect(page).toHaveScreenshot('todo-with-items-desktop.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('with completed todos - desktop @visual', async ({ todoPage, page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await todoPage.addTodos(['Buy groceries', 'Walk the dog']);
    await todoPage.toggleTodo(0);
    await expect(page).toHaveScreenshot('todo-with-completed-desktop.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('empty state - mobile @visual', async ({ page, siteConfig }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url);
    await expect(page).toHaveScreenshot('todo-empty-mobile.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('with todos - tablet @visual', async ({ todoPage, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await todoPage.addTodos(['Buy groceries', 'Walk the dog', 'Read a book']);
    await expect(page).toHaveScreenshot('todo-with-items-tablet.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

});
