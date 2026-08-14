# Edufi QA Agentic Solution

> Playwright + TypeScript automated test suite for [Edufi](https://join.edufi.co/) — built with Page Object Model (POM) architecture and designed for agentic execution via Claude Code.

---

## What This Repo Tests

This framework validates the Edufi website (`https://join.edufi.co/`) across six test categories without requiring account creation or form submission. It is configured via `site.config.json` and driven by Claude Code slash commands.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation (Chromium, WebKit, Firefox) |
| TypeScript 5.x | Strongly-typed test code, strict mode enabled |
| Page Object Model | `src/pages/` — one class per page/section |
| Claude Code | Agentic test generation, analysis, and reporting |
| GitHub Actions | CI pipeline — runs full suite on every PR |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/edufi_QA_Agentic_Solution.git
cd edufi_QA_Agentic_Solution

# 2. Install npm dependencies
npm install

# 3. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 4. (Optional) Install Claude Code CLI
npm install -g @anthropic-ai/claude-code
```

### Verify setup

```bash
# TypeScript check — must pass before running tests
npm run typecheck

# Run smoke tests against the live site
npm run test:smoke
```

---

## Running Tests

```bash
npm test                   # All tests
npm run test:smoke         # Availability checks (@smoke)
npm run test:navigation    # Nav links and routing (@navigation)
npm run test:forms         # Form fields and validation (@forms)
npm run test:visual        # Screenshot regression (@visual)
npm run test:responsive    # Mobile/tablet/desktop layout (@responsive)

npm run baseline           # Capture new visual baselines
npm run report             # Open the HTML test report
npm run lint               # ESLint
npm run typecheck          # TypeScript compilation check
```

### Run a specific test file

```bash
npx playwright test tests/smoke/site-availability.spec.ts
```

### Run against a single browser

```bash
npx playwright test --project=chromium-desktop
```

---

## Project Structure

```
edufi_QA_Agentic_Solution/
├── site.config.json              # Site URL, flags, expected nav items
├── playwright.config.ts          # Playwright projects: desktop, mobile, tablet
├── global-setup.ts               # Pre-run site reachability check
├── tsconfig.json                 # TypeScript strict config + path aliases
├── CLAUDE.md                     # Claude Code instructions (loaded each session)
├── AGENTS.md                     # AI agent coding conventions (shared reference)
├── Skills.md                     # Available slash commands and how to use them
│
├── src/
│   ├── pages/
│   │   ├── base.page.ts          # BasePage — shared navigation and utilities
│   │   ├── home.page.ts          # HomePage
│   │   ├── navigation.page.ts    # NavigationPage — nav, mobile menu
│   │   └── contact.page.ts       # ContactFormPage — form field inspection
│   ├── fixtures/
│   │   └── site.fixture.ts       # Custom Playwright fixtures (exposes page objects)
│   ├── utils/
│   │   ├── link-checker.ts       # HEAD/GET link reachability helpers
│   │   └── visual-helper.ts      # Screenshot baseline utilities
│   └── types/
│       └── site-config.types.ts  # TypeScript interface for site.config.json
│
├── tests/
│   ├── smoke/                    # @smoke — site loads, HTTPS, no console errors
│   ├── navigation/               # @navigation — nav links, routing, mobile menu
│   ├── forms/                    # @forms — field validation (no submission)
│   ├── functional/               # @functional — business features and user flows
│   ├── visual/                   # @visual — screenshot regression baselines
│   └── responsive/               # @responsive — viewport layout checks
│
└── .claude/
    ├── agents/                   # Custom Claude Code sub-agents
    ├── commands/                 # Slash commands (legacy format — still supported)
    └── hooks/
        └── pre-test.sh           # Pre-test site reachability check
```

---

## Architecture: POM + OOP

### Page Object Model

Every page or major section gets its own class in `src/pages/`. Rules:

- All classes **extend `BasePage`** from `./base.page`
- Locators are **`readonly Locator` properties** — declared on the class, never in tests
- Methods represent **user actions** (`clickCta()`, `openMobileMenu()`) — never assertions
- **No `expect()` calls inside page objects** — assertions belong in test files only

```typescript
// Good — action method with no assertion
async clickPrimaryNav(itemText: string): Promise<void> {
  await this.navLinks.filter({ hasText: itemText }).click();
  await this.waitForLoad();
}

// Bad — assertion inside page object
async verifyNavVisible(): Promise<void> {
  await expect(this.nav).toBeVisible(); // ❌ not here
}
```

### Test Structure

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Navigation @navigation', () => {
  test('nav menu is visible on load', async ({ navigationPage }) => {
    await navigationPage.navigate();
    expect(await navigationPage.isNavVisible()).toBe(true);
  });
});
```

- Import from `@fixtures/site.fixture` — not directly from `@playwright/test`
- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Use `baseURL` from Playwright config — never hardcode the site URL

---

## Test Categories

| Tag | What it covers |
|-----|---------------|
| `@smoke` | Site availability, HTTPS, page title, no console errors |
| `@navigation` | Nav links present, all reachable, mobile menu toggle |
| `@forms` | Form fields exist, validation triggers, labels/placeholders |
| `@functional` | Business features: pricing, hero, CTAs, accordions, video |
| `@visual` | Screenshot regression at desktop/mobile/tablet viewports |
| `@responsive` | No horizontal overflow, readable text, images scaled |

---

## Claude Code Integration

This repo is configured for [Claude Code](https://claude.ai/code). Start a session with:

```bash
claude
```

### Available Slash Commands

| Command | What it does |
|---------|-------------|
| `/generate-full-suite` | Crawl the site, generate all page objects and test files |
| `/analyze-site` | Inspect site structure, report pages, forms, and nav |
| `/run-smoke` | Run smoke tests and display formatted results |
| `/update-baseline` | Capture new visual regression baselines |
| `/generate-report` | Parse test results and show a summary |

See `Skills.md` for full details on each command, and `AGENTS.md` for the AI agent conventions Claude follows in this repo.

---

## Contributor Guide

### Branching

- `main` — stable, always passes CI
- Feature branches: `feat/<short-description>`
- Fix branches: `fix/<short-description>`
- Chore branches: `chore/<short-description>`

### Before opening a PR

```bash
npm run typecheck    # Must pass
npm run lint         # Must pass
npm run test:smoke   # Must pass against live site
```

### PR requirements

- Title follows Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`
- All new tests follow the POM architecture — no raw `page.locator()` in spec files
- New page objects added to `src/fixtures/site.fixture.ts`
- TypeScript strict mode — no `any` without explicit justification
- Never commit visual baseline screenshots (`.png` files in `__snapshots__/`) unless intentionally updating baselines

### What not to do

- Submit any form in tests
- Hardcode the site URL — always use `baseURL` from Playwright config
- Use `page.waitForTimeout()` — use Playwright auto-waiting
- Add assertions inside page object methods
- Commit credentials or secrets

---

## CI / GitHub Actions

On every pull request, the workflow at `.github/workflows/playwright.yml` runs:

1. TypeScript check (`npm run typecheck`)
2. Lint (`npm run lint`)
3. Smoke tests (`npm run test:smoke`)
4. Full test suite on push to `main`

HTML reports are uploaded as CI artifacts for 30 days.

---

## Visual Baseline Management

Visual regression tests compare screenshots against stored baselines in `__snapshots__/`.

To update baselines after an intentional design change:

```bash
npm run baseline
```

Review the updated `.png` files, then commit them with a note explaining the visual change.

---

## Configuration

Edit `site.config.json` to change the target site or enable/disable test categories:

```json
{
  "name": "Edufi",
  "url": "https://join.edufi.co",
  "hasContactForm": true,
  "skipVisual": false,
  "skipForms": false,
  "viewports": ["desktop", "mobile", "tablet"],
  "auth": { "required": false }
}
```

---

*Part of the Phoenix Startup QA Agentic Solutions project.*
