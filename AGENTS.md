# AGENTS.md — AI Coding Agent Instructions

> This file provides shared conventions for all AI coding agents (Claude Code, GitHub Copilot, Cursor, etc.) working in this repository. `CLAUDE.md` imports this file for Claude Code sessions.

---

## Repository Purpose

This is a **Playwright + TypeScript** automated regression test suite for the website defined in `site.config.json`. It follows a strict **Page Object Model (POM)** architecture. Tests validate GUI, navigation, forms, functional behavior, visual regression, and responsive layout — without requiring account creation or form submission.

---

## Architecture Conventions

### Page Object Model (non-negotiable)

All selectors and page interaction logic live in `src/pages/` classes — never in test files.

```
src/pages/
├── base.page.ts         # BasePage — all page objects extend this
├── home.page.ts
├── navigation.page.ts
├── contact.page.ts
└── <feature>.page.ts    # Add one file per new page or section
```

**Rules:**
- Every page class **extends `BasePage`** from `./base.page`
- Selectors are **`readonly Locator`** properties on the class constructor
- Methods represent **user actions only** (click, fill, open, navigate)
- **No `expect()` inside page objects** — assertions belong in `tests/`

### Test files

All test files live under `tests/` in the appropriate category folder:

```
tests/
├── smoke/        # @smoke
├── navigation/   # @navigation
├── forms/        # @forms
├── functional/   # @functional
├── visual/       # @visual
└── responsive/   # @responsive
```

**Rules:**
- Import from `@fixtures/site.fixture` — not from `@playwright/test` directly
- Tag every `test()` call with at least one: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never hardcode the site URL — use `baseURL` from the Playwright config
- No `page.waitForTimeout()` — use `waitForSelector`, `waitForLoadState`, or Playwright auto-waiting
- No `any` type without an explicit justification comment

### TypeScript

- Strict mode is on (`tsconfig.json`)
- Path aliases available: `@pages/*`, `@fixtures/*`, `@utils/*`, `@site-types/*` (do NOT use `@types/*` — conflicts with TypeScript's DefinitelyTyped resolution)
- Always run `npx tsc --noEmit` to verify before finishing any edit

---

## Workflow for Writing or Updating Tests

1. Read `site.config.json` to get the URL and all feature flags
2. Use `WebFetch` to inspect the live site HTML before writing selectors
3. Write real selectors from the actual DOM — no placeholders
4. Create or update the page object in `src/pages/`
5. Register new page objects in `src/fixtures/site.fixture.ts`
6. Write tests using the fixture — not raw `page.locator()` calls
7. Run `npx tsc --noEmit` — fix any errors before finishing

---

## Critical Constraints

These are absolute — never override them:

- **Never submit any form** in a test
- **Never create accounts or enter real credentials**
- **Never hardcode the base URL** — use `baseURL` from config
- **Never put assertions inside page object methods**
- **Never use `page.waitForTimeout()`** — it creates flaky tests

---

## Available npm Scripts

| Script | Command |
|--------|---------|
| All tests | `npm test` |
| Smoke only | `npm run test:smoke` |
| Navigation only | `npm run test:navigation` |
| Forms only | `npm run test:forms` |
| Visual only | `npm run test:visual` |
| Responsive only | `npm run test:responsive` |
| Capture baselines | `npm run baseline` |
| TypeScript check | `npm run typecheck` |
| Lint | `npm run lint` |

---

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page object | `src/pages/<name>.page.ts` | `src/pages/pricing.page.ts` |
| Spec file | `tests/<category>/<name>.spec.ts` | `tests/functional/pricing.spec.ts` |
| Utility | `src/utils/<name>.ts` | `src/utils/link-checker.ts` |

---

## Claude Code Sub-Agents

Two custom sub-agents are defined in `.claude/agents/`:

| Agent | File | Purpose |
|-------|------|---------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | Crawl the live site and produce a populated `site.config.json` |
| `test-generator` | `.claude/agents/test-generator.md` | Generate site-specific tests beyond the shared suite |

See `Skills.md` for the available slash commands.

---

## Key File Reference

| File | Purpose |
|------|---------|
| `site.config.json` | Target site URL, name, feature flags |
| `playwright.config.ts` | Browser projects, timeouts, reporters |
| `src/pages/base.page.ts` | BasePage class all page objects extend |
| `src/fixtures/site.fixture.ts` | Custom fixture exposing page object instances |
| `src/types/site-config.types.ts` | TypeScript interface for `site.config.json` |
| `global-setup.ts` | Pre-run site reachability check |
| `.claude/hooks/pre-test.sh` | Bash hook: verify site reachable before tests run |
