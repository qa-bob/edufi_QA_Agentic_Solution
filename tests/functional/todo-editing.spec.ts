import { test, expect } from '@fixtures/site.fixture';

test.describe('Todo Editing @functional', () => {

  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodo('Original text');
  });

  test('double-clicking a label enters edit mode @functional', async ({ todoPage }) => {
    await todoPage.todoItems.nth(0).locator('label').dblclick();
    const editInput = todoPage.todoItems.nth(0).locator('.edit');
    await expect(editInput).toBeVisible();
  });

  test('edit input is pre-filled with existing text @functional', async ({ todoPage }) => {
    await todoPage.todoItems.nth(0).locator('label').dblclick();
    const editInput = todoPage.todoItems.nth(0).locator('.edit');
    await expect(editInput).toHaveValue('Original text');
  });

  test('pressing Enter saves the edited text @functional', async ({ todoPage }) => {
    await todoPage.editTodo(0, 'Updated text');
    const texts = await todoPage.getTodoTexts();
    expect(texts[0]).toBe('Updated text');
  });

  test('pressing Escape cancels the edit @functional', async ({ todoPage }) => {
    await todoPage.todoItems.nth(0).locator('label').dblclick();
    const editInput = todoPage.todoItems.nth(0).locator('.edit');
    await editInput.fill('Discard this');
    await editInput.press('Escape');
    const texts = await todoPage.getTodoTexts();
    expect(texts[0]).toBe('Original text');
  });

  test('editing to empty text deletes the todo @functional', async ({ todoPage }) => {
    await todoPage.todoItems.nth(0).locator('label').dblclick();
    const editInput = todoPage.todoItems.nth(0).locator('.edit');
    await editInput.fill('');
    await editInput.press('Enter');
    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('can edit a todo among multiple items @functional', async ({ todoPage }) => {
    await todoPage.addTodos(['Second', 'Third']);
    await todoPage.editTodo(1, 'Edited second');
    const texts = await todoPage.getTodoTexts();
    expect(texts[1]).toBe('Edited second');
    expect(texts[0]).toBe('Original text');
    expect(texts[2]).toBe('Third');
  });

  test('edited todo retains its completed state @functional', async ({ todoPage }) => {
    await todoPage.toggleTodo(0);
    await todoPage.editTodo(0, 'Still completed');
    await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
    const texts = await todoPage.getTodoTexts();
    expect(texts[0]).toBe('Still completed');
  });

});
