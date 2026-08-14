# GitHub Copilot Instructions

This repository is a **Playwright + TypeScript regression test suite** for [Edufi](https://join.edufi.co/) using the **Page Object Model (POM)** architecture.

## Architecture

Every page gets a class in `src/pages/` that extends `BasePage` (`src/pages/base.page.ts`). Locators are `readonly Locator` properties. Methods represent user actions — no assertions inside page objects.

Tests live in `tests/<category>/` and import from `@fixtures/site.fixture`, not directly from `@playwright/test`.

## Rules

- Never put `expect()` inside page object classes
- Never hardcode the site URL — use `baseURL` from Playwright config
- Never submit forms or create accounts in tests
- Never use `page.waitForTimeout()` — use Playwright auto-waiting
- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- TypeScript strict mode is on — no `any` without justification

## File locations

- Page objects: `src/pages/<name>.page.ts`
- Test specs: `tests/<category>/<name>.spec.ts`
- Fixtures: `src/fixtures/site.fixture.ts`
- Site config: `site.config.json`
- Type interfaces: `src/types/site-config.types.ts`

## Code style

```typescript
// Page object pattern
export class FeaturePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
    this.ctaButton = page.locator('a[href*="signup"]').first();
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
    await this.waitForLoad();
  }
}

// Test pattern
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Page @functional', () => {
  test('heading is visible @functional', async ({ page }) => {
    const featurePage = new FeaturePage(page);
    await featurePage.navigate();
    await expect(featurePage.heading).toBeVisible();
  });
});
```
