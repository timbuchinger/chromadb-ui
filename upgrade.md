# Upgrade project tracker

Each section below is formatted as a GitHub issue that can be copied directly into the repository tracker. The checklist items in every issue describe the concrete work required to bring this UI up to the current specification described in the provided upgrade plan.

## GitHub project automation

To seed (or re-sync) a GitHub Project with these issues:

1. Review the markdown files in `upgrade-issues/`—each file mirrors one of the sections below and is used as the body when creating the issue.
2. Run `scripts/create-upgrade-project-items.sh` with the following environment variables set:
   - `UPGRADE_PROJECT_ID`: GraphQL node ID for the destination Project (Projects v2). Fetch with `gh project view <number> --owner <org_or_user> --format json --jq '.id'`.
   - `GITHUB_REPO`: optional `owner/repo` override (defaults to the current git remote).
   - `UPGRADE_ISSUE_LABELS`: optional comma-separated labels (defaults to `upgrade`).
3. The script idempotently creates any missing issues, applies the requested labels, and adds every issue to the specified Project. Pass `--dry-run` to preview the operations without calling GitHub.

This keeps the markdown tracker as the source of truth while ensuring the GitHub Project stays synchronized.

## Issue: Align toolchain, workflows, and dependencies
- [ ] Confirm the latest LTS release of Node.js (currently 22.x) and npm, and standardize Docker, local dev, and CI on that version.
- [ ] Update GitHub Actions to `actions/checkout@v4`, `actions/setup-node@v4`, `docker/setup-buildx-action@v3`, `docker/login-action@v3`, and `docker/build-push-action@v6`.
- [ ] Remove the bespoke `docker-compose` installation step in workflows in favor of the built-in `docker compose` subcommand.
- [ ] Upgrade runtime deps (`vue`, `vue-router`, `pinia`, `axios`, `@heroicons/vue`, `chromadb`) and remove `chromadb` plus the related `optimizeDeps.exclude` entry if it remains unused after auditing the codebase.
- [ ] Upgrade dev/build deps (`vite`, `@vitejs/plugin-vue`, `vue-tsc`, `@vue/tsconfig`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `markdownlint-cli`, `cypress`, `start-server-and-test`).
- [ ] Add testing deps (`vitest`, `@vitest/coverage-v8`, `@vue/test-utils`, `jsdom` or `happy-dom`) and npm scripts such as `test:unit`.
- [ ] Regenerate `package-lock.json` and re-run Tailwind’s upgrade helper to ensure config files align with the new versions.
- [ ] Point Vite’s PostCSS config to the actual file (`postcss.config.cjs`) or convert it to `.js` so the dev server picks it up correctly.

## Issue: Backend connectivity & environment parity
- [ ] Respect `VITE_CHROMADB_HOST`, protocol, and related `.env` values when initializing the login form and auth store instead of hard-coding `localhost:8000` and `http`.
- [ ] Wire tenant and database defaults from the auth store into every request by replacing the `DEFAULT_PARAMS` constant inside `src/stores/chroma.ts` with getters that pull the live values.
- [ ] Centralize Axios base URL and shared headers in a helper/instance so every API call (including login) uses identical request construction.
- [ ] Update `LoginScreen` to rely on the same helper instead of duplicating a manual `fetch` call.

## Issue: Collections screen correctness and UX polish
- [ ] Sort `chromaStore.collections` before pagination so the list always appears alphabetized as promised in the README.
- [ ] Import and register the loading skeleton component inside `DocumentsList.vue` so stricter tooling doesn’t fail at build time.
- [ ] Register the `focus-trap` directive globally in `main.ts` so `<AddDocumentModal>` gains the expected accessibility behavior.
- [ ] Remove or fix the broken `<link href="/src/styles.css">` tag in `index.html` (Vite already includes `src/style.css`).
- [ ] Prefill login tenant/database fields from the last authenticated session to meet the UX spec.

## Issue: Security, persistence, and session recovery
- [ ] Encrypt the auth payload stored in `localStorage` (e.g., via Web Crypto AES-GCM) and attach an expiration timestamp per spec.
- [ ] Clear stale credentials automatically during app bootstrap to avoid reusing expired data.
- [ ] Capture the user’s last route and restore it on refresh while ensuring router guards honor session recovery requirements.
- [ ] Surface backend errors through the shared notification system rather than inline strings on the login page.

## Issue: Testing & QA modernization
- [ ] After adding Vitest, scaffold unit tests for key components/stores in `tests/unit` and add `npm run test:unit`.
- [ ] Extend `.github/workflows/build.yml` to run linting, unit tests, and Cypress e2e tests (potentially via `start-server-and-test`).
- [ ] Upgrade Cypress config to the latest format, ensure the base URL matches Vite’s dev server, and refresh fixtures to call the correct HTTP endpoints.
- [ ] Modernize Cypress custom commands to avoid brittle regex URL rewrites and share fixtures across auth flows.
- [ ] Cache Cypress binaries in CI for faster runs.

## Issue: Documentation & release updates
- [ ] Update README quick-start instructions to reference the correct Vite port (`5173`) or change Vite’s config to match the documented port.
- [ ] Document the newly respected environment variables (host, protocol, tenant/database defaults) and describe how to configure them.
- [ ] Refresh `memory-bank/techContext.md` with the final testing layout after the Vitest + Cypress updates.
- [ ] Describe any new tooling requirements (Vitest, updated workflows) in CONTRIBUTING docs if applicable.

## Issue: Docker, backend image, and release automation
- [ ] Update `docker/docker-compose.yaml` to pull the latest `ghcr.io/chroma-core/chroma` image and note any new env vars required for multi-auth setups.
- [ ] Validate that the multi-auth configuration (ports 8001–8003) continues to work after upgrading the server image.
- [ ] Ensure the release workflow tags Docker images with semantic versions and, if required, add SBOM/signing steps.
- [ ] Align the release workflow versions with the build workflow updates noted above so Actions stay on supported releases.

