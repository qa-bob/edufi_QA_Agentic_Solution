import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly newTodoInput: Locator;
  readonly todoApp: Locator;
  readonly infoSection: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading      = page.locator('h1');
    this.newTodoInput = page.locator('.new-todo');
    this.todoApp      = page.locator('.todoapp');
    this.infoSection  = page.locator('.info');
  }

  async isLoaded(): Promise<boolean> {
    try {
      return (
        (await this.todoApp.isVisible()) &&
        (await this.newTodoInput.isVisible())
      );
    } catch {
      return false;
    }
  }

  async getMainHeading(): Promise<string> {
    return (await this.heading.textContent())?.trim() ?? '';
  }
}
