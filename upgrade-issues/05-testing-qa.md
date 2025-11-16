# Testing & QA modernization

## Summary
Adopt Vitest-based unit tests, modernize Cypress, and ensure CI runs lint/unit/e2e checks so regressions are caught automatically.

## Tasks
- [ ] Add Vitest, Vue Test Utils, and DOM environment dependencies plus `npm run test:unit`, and scaffold representative unit tests under `tests/unit`.
- [ ] Update `.github/workflows/build.yml` to run linting, unit tests, and Cypress e2e suites (potentially via `start-server-and-test`).
- [ ] Upgrade Cypress configuration to the format supported by the current release, set the correct base URL, and refresh fixtures/endpoints to match the upgraded stores.
- [ ] Modernize Cypress custom commands to avoid brittle regex URL rewrites and share fixtures between auth flows.
- [ ] Cache Cypress binaries in CI for faster runs.
