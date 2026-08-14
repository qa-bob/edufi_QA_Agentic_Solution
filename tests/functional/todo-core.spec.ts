import { test, expect } from '@fixtures/site.fixture';

test.describe('Todo Core Operations @functional', () => {

  test('can add a single todo @functional', async ({ todoPage }) => {
    await todoPage.addTodo('Buy groceries');
    await expect(todoPage.todoItems).toHaveCount(1);
    const texts = await todoPage.getTodoTexts();
    expect(texts[0]).toBe('Buy groceries');
  });

  test('can add multiple todos @functional', async ({ todoPage }) => {
    await todoPage.addTodos(['First', 'Second', 'Third']);
    await expect(todoPage.todoItems).toHaveCount(3);
  });

  test('input clears after adding a todo @functional', async ({ todoPage }) => {
    await todoPage.addTodo('Clear me');
    await expect(todoPage.newTodoInput).toHaveValue('');
  });

  test('can mark a todo as completed @functional', async ({ todoPage }) => {
    await todoPage.addTodo('Walk the dog');
    await todoPage.toggleTodo(0);
    await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
  });

  test('can uncheck a completed todo @functional', async ({ todoPage }) => {
    await todoPage.addTodo('Walk the dog');
    await todoPage.toggleTodo(0);
    await todoPage.toggleTodo(0);
    await expect(todoPage.todoItems.nth(0)).not.toHaveClass(/completed/);
  });

  test('can delete a todo @functional', async ({ todoPage }) => {
    await todoPage.addTodos(['Keep me', 'Delete me']);
    await todoPage.deleteTodo(1);
    await expect(todoPage.todoItems).toHaveCount(1);
    const texts = await todoPage.getTodoTexts();
    expect(texts[0]).toBe('Keep me');
  });

  test('footer shows correct item count @functional', async ({ todoPage }) => {
    await todoPage.addTodos(['One', 'Two', 'Three']);
    await todoPage.toggleTodo(0); // complete one
    const counterText = await todoPage.getCounterText();
    expect(counterText).toContain('2');
  });

  test('footer is hidden when no todos exist @functional', async ({ todoPage }) => {
    await expect(todoPage.appFooter).not.toBeVisible();
  });

  test('footer appears after first todo is added @functional', async ({ todoPage }) => {
    await todoPage.addTodo('Trigger footer');
    await expect(todoPage.appFooter).toBeVisible();
  });

  test('toggle-all marks all todos completed @functional', async ({ todoPage }) => {
    await todoPage.addTodos(['A', 'B', 'C']);
    await todoPage.toggleAllTodos();
    const count = await todoPage.todoItems.count();
    for (let i = 0; i < count; i++) {
      await expect(todoPage.todoItems.nth(i)).toHaveClass(/completed/);
    }
  });

  test('clear-completed removes all done todos @functional', async ({ todoPage }) => {
    await todoPage.addTodos(['Keep', 'Done 1', 'Done 2']);
    await todoPage.toggleTodo(1);
    await todoPage.toggleTodo(2);
    await todoPage.clearCompletedTodos();
    await expect(todoPage.todoItems).toHaveCount(1);
    const texts = await todoPage.getTodoTexts();
    expect(texts[0]).toBe('Keep');
  });

  test('whitespace-only input does not create a todo @functional', async ({ todoPage }) => {
    await todoPage.newTodoInput.fill('   ');
    await todoPage.newTodoInput.press('Enter');
    await expect(todoPage.todoItems).toHaveCount(0);
  });

});
