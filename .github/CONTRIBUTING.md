# Contributing to Edufi QA Agentic Solution

Thank you for contributing. This guide covers setup, branching, testing requirements, and PR conventions.

---

## Development Setup

```bash
git clone https://github.com/your-org/edufi_QA_Agentic_Solution.git
cd edufi_QA_Agentic_Solution
npm install
npx playwright install
npm run typecheck   # verify TypeScript compiles cleanly
npm run test:smoke  # verify the target site is reachable
```

---

## Branching Strategy

| Branch prefix | Use for |
|--------------|---------|
| `feat/` | New page objects or test coverage |
| `fix/` | Fixing broken tests or selectors |
| `chore/` | Config, CI, dependency updates |
| `test/` | Expanding existing test coverage |

Branch from `main`, open a PR back to `main`.

---

## Before Opening a PR

All three of these must pass locally:

```bash
npm run typecheck    # TypeScript strict mode — zero errors required
npm run lint         # ESLint — no warnings or errors
npm run test:smoke   # Smoke suite — all tests must pass against live site
```

---

## Architecture Rules (enforced in review)

### Page Object Model

- Every selector lives in a class in `src/pages/` — never in a test file
- All page classes extend `BasePage` from `./base.page`
- Locators are `readonly Locator` properties on the class
- Methods represent user actions — not assertions
- **No `expect()` inside page objects**

### Tests

- Import from `@fixtures/site.fixture` — not `@playwright/test` directly
- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never hardcode the site URL — use `baseURL` from Playwright config
- Never submit forms or create accounts
- No `page.waitForTimeout()` — use Playwright auto-waiting

### TypeScript

- Strict mode on — no implicit `any`
- New page objects must be registered in `src/fixtures/site.fixture.ts`
- Path aliases: `@pages/*`, `@fixtures/*`, `@utils/*`, `@types/*`

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add PricingPage page object and functional tests
fix: update nav selector after Edufi header redesign
chore: upgrade Playwright to 1.45.0
test: add responsive tests for mobile viewport breakpoints
```

---

## Visual Baselines

Do **not** commit `__snapshots__/*.png` files unless you are intentionally updating baselines after a confirmed design change. Run:

```bash
npm run baseline
```

Review each updated screenshot, then commit with a message like:
```
chore: update visual baselines after hero section redesign
```

---

## What Never Goes in a Test

- `await page.waitForTimeout(n)` — creates flaky tests
- `expect()` inside page object methods
- Hardcoded URLs (`https://join.edufi.co/...`)
- Real credentials or secrets
- Actual form submission

---

## Reviewing a PR

When reviewing, check:

1. TypeScript compiles cleanly (`npm run typecheck`)
2. New selectors are based on real site HTML, not generic placeholders
3. Page objects follow POM — no assertions inside them
4. Tests import from `@fixtures/site.fixture`
5. Each test is tagged
6. No hardcoded URLs

---

## Getting Help

- Open an issue using one of the templates in `.github/ISSUE_TEMPLATE/`
- For Claude Code questions, see `Skills.md` for available slash commands
- For architecture questions, see `AGENTS.md` and `CLAUDE.md`
