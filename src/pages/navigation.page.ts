import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class NavigationPage extends BasePage {
  // TodoMVC uses hash-based filter links as its "navigation"
  readonly filtersContainer: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.filtersContainer = page.locator('.filters');
    this.filterAll        = page.locator('.filters a[href="#/"]');
    this.filterActive     = page.locator('.filters a[href="#/active"]');
    this.filterCompleted  = page.locator('.filters a[href="#/completed"]');
  }

  async isNavVisible(): Promise<boolean> {
    return this.filtersContainer.isVisible();
  }

  async getActiveFilter(): Promise<string> {
    const selected = this.filtersContainer.locator('a.selected');
    return (await selected.textContent())?.trim() ?? '';
  }

  async clickFilter(name: 'All' | 'Active' | 'Completed'): Promise<void> {
    const map = {
      All: this.filterAll,
      Active: this.filterActive,
      Completed: this.filterCompleted,
    };
    // Selector that matches the link once it has the "selected" class applied by JS
    const selectedSelector: Record<string, string> = {
      All: '.filters a[href="#/"].selected',
      Active: '.filters a[href="#/active"].selected',
      Completed: '.filters a[href="#/completed"].selected',
    };
    await map[name].click();
    await this.page.waitForSelector(selectedSelector[name]);
  }

  async getMobileMenuToggle(): Promise<Locator | null> {
    // TodoMVC has no mobile hamburger — filters are always visible
    return null;
  }
}
