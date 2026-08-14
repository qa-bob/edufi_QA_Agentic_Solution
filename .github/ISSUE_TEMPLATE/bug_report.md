---
name: Bug report
about: A test is broken, a selector is stale, or the suite is behaving incorrectly
title: 'fix: '
labels: bug
assignees: ''
---

## What is failing?

<!-- Test name, file path, and the error message or assertion failure. -->

**Test file:** `tests/<category>/<file>.spec.ts`
**Test name:**
**Error:**

```
paste the error / stack trace here
```

## Expected behavior

<!-- What should the test do? -->

## Actual behavior

<!-- What is it doing instead? -->

## Reproduction steps

```bash
npx playwright test tests/<category>/<file>.spec.ts --headed
```

## Environment

- OS:
- Node version (`node --version`):
- Playwright version (`npx playwright --version`):
- Branch:

## Is this a selector issue?

<!-- Has the site's HTML changed, making the locator stale? Check the live site with browser dev tools. -->

- [ ] Yes — the selector no longer matches current site HTML
- [ ] No — the test logic itself is incorrect
- [ ] Unsure

## Additional context

<!-- Screenshots, CI run links, or anything else relevant. -->
