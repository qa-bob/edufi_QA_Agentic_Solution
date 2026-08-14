## Summary

<!-- What does this PR do? One or two sentences. -->

## Type of change

- [ ] New page object(s)
- [ ] New or updated tests
- [ ] Bug fix (broken selector, flaky test)
- [ ] Visual baseline update
- [ ] CI / config change
- [ ] Chore (deps, lint, types)

## Test coverage

<!-- Which test categories are added or affected? -->

- [ ] @smoke
- [ ] @navigation
- [ ] @forms
- [ ] @functional
- [ ] @visual
- [ ] @responsive

## Checklist

- [ ] `npm run typecheck` passes (zero TypeScript errors)
- [ ] `npm run lint` passes (zero ESLint errors)
- [ ] `npm run test:smoke` passes against the live site
- [ ] New selectors are based on real site HTML (not placeholder locators)
- [ ] Page objects follow POM — no `expect()` inside page object methods
- [ ] Tests import from `@fixtures/site.fixture`, not `@playwright/test` directly
- [ ] No hardcoded URLs — `baseURL` from Playwright config used throughout
- [ ] No form submissions in tests
- [ ] No `page.waitForTimeout()` calls
- [ ] New page objects registered in `src/fixtures/site.fixture.ts`

## Visual baseline changes

<!-- If you updated __snapshots/ baselines, list the changed pages and briefly explain the visual change. -->

## Notes for reviewer

<!-- Anything else the reviewer should know? Flaky areas, known limitations, follow-up work? -->
