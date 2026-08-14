import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class TodoPage extends BasePage {
  // ── Input ───────────────────────────────────────────────────────────────────
  readonly newTodoInput: Locator;

  // ── List ────────────────────────────────────────────────────────────────────
  readonly todoItems: Locator;
  readonly toggleAll: Locator;

  // ── Footer ──────────────────────────────────────────────────────────────────
  readonly todoCount: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;
  readonly clearCompleted: Locator;
  readonly appFooter: Locator;

  // ── Info footer (page bottom) ────────────────────────────────────────────────
  readonly pageInfo: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.newTodoInput    = page.locator('.new-todo');
    this.todoItems       = page.locator('.todo-list li');
    this.toggleAll       = page.locator('.toggle-all');
    this.todoCount       = page.locator('.todo-count');
    this.filterAll       = page.locator('.filters a[href="#/"]');
    this.filterActive    = page.locator('.filters a[href="#/active"]');
    this.filterCompleted = page.locator('.filters a[href="#/completed"]');
    this.clearCompleted  = page.locator('.clear-completed');
    this.appFooter       = page.locator('.footer');
    this.pageInfo        = page.locator('.info');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async addTodo(text: string): Promise<void> {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(texts: string[]): Promise<void> {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  async toggleTodo(index: number): Promise<void> {
    await this.todoItems.nth(index).locator('.toggle').click();
  }

  async deleteTodo(index: number): Promise<void> {
    const item = this.todoItems.nth(index);
    await item.hover();
    await item.locator('.destroy').click();
  }

  async editTodo(index: number, newText: string): Promise<void> {
    const item = this.todoItems.nth(index);
    await item.locator('label').dblclick();
    const editInput = item.locator('.edit');
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  async toggleAllTodos(): Promise<void> {
    await this.toggleAll.click();
  }

  async clearCompletedTodos(): Promise<void> {
    await this.clearCompleted.click();
  }

  async clickFilterAll(): Promise<void> {
    await this.filterAll.click();
  }

  async clickFilterActive(): Promise<void> {
    await this.filterActive.click();
  }

  async clickFilterCompleted(): Promise<void> {
    await this.filterCompleted.click();
  }

  // ── Queries ─────────────────────────────────────────────────────────────────

  async getTodoTexts(): Promise<string[]> {
    return this.todoItems.locator('label').allTextContents();
  }

  async getTodoCount(): Promise<number> {
    return this.todoItems.count();
  }

  async isFooterVisible(): Promise<boolean> {
    return this.appFooter.isVisible();
  }

  async getCounterText(): Promise<string> {
    return (await this.todoCount.textContent()) ?? '';
  }

  isTodoCompleted(index: number): Locator {
    return this.todoItems.nth(index).locator('.toggle');
  }
}
