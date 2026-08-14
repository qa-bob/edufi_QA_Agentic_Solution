# Skills.md — Slash Commands and Agentic Skills

> This file documents all slash commands and sub-agent skills available in this repository for Claude Code sessions. Invoke any command with `/command-name` inside a Claude Code session.

---

## How Skills Work

Skills are markdown files in `.claude/commands/` (legacy format) or `.claude/skills/<name>/SKILL.md` (new format). Both formats create a `/command-name` you can type in a Claude Code session. Claude also loads skills automatically when your prompt matches the skill's description.

---

## Available Slash Commands

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the live website and generates a complete, production-quality Playwright test suite from scratch.

**What it does:**
1. Reads `site.config.json` for the target URL and flags
2. Crawls the live site with `WebFetch` — records nav links, forms, headings, and interactive elements
3. Plans and writes page object classes in `src/pages/`
4. Writes test files across all categories: smoke, navigation, forms, functional, visual, responsive
5. Updates `site.config.json` with discovered metadata
6. Runs `npx tsc --noEmit` and fixes TypeScript errors
7. Reports pages analyzed, classes created, test count, and any inaccessible pages

**When to use:** Starting a new site, or after a major site redesign that invalidates existing selectors.

---

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Inspects the live site and reports its structure without writing any test code.

**What it does:**
1. Fetches the homepage and key pages
2. Extracts: page title, H1/H2 headings, nav links, forms, CTAs, interactive elements
3. Checks all nav links for 404s
4. Tests responsiveness at mobile/tablet/desktop viewports
5. Outputs a fully-populated `site.config.json`
6. Lists issues found (missing meta description, broken links, etc.)
7. Provides a confidence rating: High / Medium / Low

**When to use:** Before running `/generate-full-suite` to understand what the site contains, or to verify `site.config.json` is still accurate.

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs the smoke test suite and displays a formatted pass/fail report.

**What it does:**
1. Executes `npm run test:smoke`
2. Parses the JSON test results
3. Displays a table: test name, status (pass/fail/skip), duration
4. Suggests specific fixes for any failures
5. Mirrors the test exit code

**When to use:** Quick health check before or after any change to confirm the site is still reachable and basic load tests pass.

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Refreshes visual regression baselines after an intentional design change.

**What it does:**
1. Runs `npm run baseline` to capture new screenshots
2. Lists all updated files from `__snapshots__/`
3. Reminds you to review the screenshots before committing
4. Reports any capture failures

**When to use:** After a confirmed visual design change that you want to lock in as the new correct state. Always review the updated `.png` files before committing.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses the most recent test results and generates a summary report.

**What it does:**
1. Reads `test-results/results.json`
2. Summarizes results by category: @smoke, @navigation, @forms, @functional, @visual, @responsive
3. Lists all failed and flaky tests with error messages
4. Suggests next steps based on failures
5. Opens the HTML report

**When to use:** After a full test run to get a readable summary of what passed, failed, or is flaky.

---

## Sub-Agents

Sub-agents are specialized workers that Claude Code delegates tasks to. They run in their own context window, keeping the main conversation clean.

### `site-analyzer` agent

**File:** `.claude/agents/site-analyzer.md`

Crawls a live website and produces a fully-populated `site.config.json`. Handles SPAs, redirect chains, auth-gated content, and sites with no visible nav. Invoked automatically when Claude Code needs to onboard a new site or verify an existing config.

### `test-generator` agent

**File:** `.claude/agents/test-generator.md`

Reads a populated `site.config.json` and generates site-specific Playwright test files for features not covered by the generic suite. Output goes to `tests/custom/`. Invoked automatically when Claude detects unique site functionality that needs bespoke test coverage.

---

## Adding a New Skill

To add a new slash command:

1. Create `.claude/commands/<command-name>.md`
2. Write the instructions Claude should follow when the command is invoked
3. Add a row to the table above in this file
4. If the command is complex, consider creating a `.claude/agents/<name>.md` to handle the heavy lifting

**Recommended structure for a command file:**

```markdown
# Command Name

Brief description of what this command does.

## Steps

1. Read `site.config.json`
2. ... specific instructions ...
3. Report what was done
```

---

## Skill Locations

| Location | Path | Scope |
|----------|------|-------|
| Project commands | `.claude/commands/<name>.md` | This repo only |
| Project skills (new format) | `.claude/skills/<name>/SKILL.md` | This repo only |
| Personal skills | `~/.claude/skills/<name>/SKILL.md` | All your projects |
