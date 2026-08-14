import { test, expect } from '@fixtures/site.fixture';

test.describe('Todo Filters @functional', () => {

  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodos(['Active item 1', 'Active item 2', 'Completed item']);
    await todoPage.toggleTodo(2); // complete the third
  });

  test('"All" filter is selected by default @functional', async ({ todoPage }) => {
    await expect(todoPage.filterAll).toHaveClass(/selected/);
  });

  test('"All" filter shows every todo @functional', async ({ todoPage }) => {
    await todoPage.clickFilterAll();
    await expect(todoPage.todoItems).toHaveCount(3);
  });

  test('"Active" filter shows only incomplete todos @functional', async ({ todoPage }) => {
    await todoPage.clickFilterActive();
    await expect(todoPage.todoItems).toHaveCount(2);
    const texts = await todoPage.getTodoTexts();
    expect(texts).not.toContain('Completed item');
  });

  test('"Completed" filter shows only done todos @functional', async ({ todoPage }) => {
    await todoPage.clickFilterCompleted();
    await expect(todoPage.todoItems).toHaveCount(1);
    const texts = await todoPage.getTodoTexts();
    expect(texts[0]).toBe('Completed item');
  });

  test('completing a todo in Active view removes it from list @functional', async ({ todoPage }) => {
    await todoPage.clickFilterActive();
    await todoPage.toggleTodo(0);
    await expect(todoPage.todoItems).toHaveCount(1);
  });

  test('URL hash updates when filter changes @functional', async ({ todoPage, page }) => {
    await todoPage.clickFilterActive();
    expect(page.url()).toContain('#/active');

    await todoPage.clickFilterCompleted();
    expect(page.url()).toContain('#/completed');

    await todoPage.clickFilterAll();
    expect(page.url()).toMatch(/#\/?$/);
  });

  test('"Active" filter count matches todo-count text @functional', async ({ todoPage }) => {
    await todoPage.clickFilterAll();
    const counterText = await todoPage.getCounterText();
    expect(counterText).toContain('2'); // 2 active items
  });

  test('"Completed" filter is empty after clear-completed @functional', async ({ todoPage }) => {
    await todoPage.clearCompletedTodos();
    await todoPage.clickFilterCompleted();
    await expect(todoPage.todoItems).toHaveCount(0);
  });

});
