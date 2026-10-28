import * as fs from 'fs';
import type { TestInfo } from '@playwright/test';
import { test, expect } from '@fixtures/site.fixture';

// Each test runs only in the Playwright project whose viewport it targets, and
// is skipped (not failed) until a baseline has been captured for it.
function skipWithoutBaseline(testInfo: TestInfo, snapshot: string): void {
  // Only `--update-snapshots` (all/changed) should create a missing baseline
  const isUpdating = ['all', 'changed'].includes(testInfo.config.updateSnapshots);
  const baselinePath = testInfo.snapshotPath(snapshot, { kind: 'screenshot' });
  test.skip(
    !isUpdating && !fs.existsSync(baselinePath),
    `No baseline at ${baselinePath} — run "npm run baseline" to capture one`
  );
}

test.describe('Visual Regression @visual', () => {

  test('empty state - desktop @visual', async ({ page, siteConfig }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    skipWithoutBaseline(testInfo, 'todo-empty-desktop.png');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(siteConfig.url);
    await expect(page).toHaveScreenshot('todo-empty-desktop.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('with todos - desktop @visual', async ({ todoPage, page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    skipWithoutBaseline(testInfo, 'todo-with-items-desktop.png');
    await page.setViewportSize({ width: 1280, height: 720 });
    await todoPage.addTodos(['Buy groceries', 'Walk the dog', 'Read a book']);
    await expect(page).toHaveScreenshot('todo-with-items-desktop.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('with completed todos - desktop @visual', async ({ todoPage, page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'Runs only in the "chromium-desktop" project');
    skipWithoutBaseline(testInfo, 'todo-with-completed-desktop.png');
    await page.setViewportSize({ width: 1280, height: 720 });
    await todoPage.addTodos(['Buy groceries', 'Walk the dog']);
    await todoPage.toggleTodo(0);
    await expect(page).toHaveScreenshot('todo-with-completed-desktop.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('empty state - mobile @visual', async ({ page, siteConfig }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'Runs only in the "mobile-chrome" project');
    skipWithoutBaseline(testInfo, 'todo-empty-mobile.png');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(siteConfig.url);
    await expect(page).toHaveScreenshot('todo-empty-mobile.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

  test('with todos - tablet @visual', async ({ todoPage, page }, testInfo) => {
    test.skip(testInfo.project.name !== 'tablet', 'Runs only in the "tablet" project');
    skipWithoutBaseline(testInfo, 'todo-with-items-tablet.png');
    await page.setViewportSize({ width: 768, height: 1024 });
    await todoPage.addTodos(['Buy groceries', 'Walk the dog', 'Read a book']);
    await expect(page).toHaveScreenshot('todo-with-items-tablet.png', {
      maxDiffPixels: 500,
      animations: 'disabled',
    });
  });

});
