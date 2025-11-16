# Align toolchain, workflows, and dependencies

## Summary
Bring the Node.js toolchain, npm dependencies, and GitHub Actions workflows up to the current LTS releases so the UI matches the modernization plan and benefits from the latest security patches.

## Tasks
- [ ] Confirm the Node.js and npm versions that should be treated as the new baseline (currently Node 22 LTS) and align Docker, local dev, and CI on that toolchain.
- [ ] Move workflows to `actions/checkout@v4`, `actions/setup-node@v4`, `docker/setup-buildx-action@v3`, `docker/login-action@v3`, and `docker/build-push-action@v6`.
- [ ] Drop the bespoke `docker-compose` installation inside CI in favor of the built-in `docker compose` subcommand.
- [ ] Upgrade runtime dependencies (`vue`, `vue-router`, `pinia`, `axios`, `@heroicons/vue`, `chromadb`) and remove `chromadb` plus the `optimizeDeps.exclude` entry if the package is unused.
- [ ] Upgrade dev/build dependencies (`vite`, `@vitejs/plugin-vue`, `vue-tsc`, `@vue/tsconfig`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `markdownlint-cli`, `cypress`, `start-server-and-test`).
- [ ] Add missing testing dependencies (`vitest`, `@vitest/coverage-v8`, `@vue/test-utils`, `jsdom`/`happy-dom`) and npm scripts such as `test:unit`.
- [ ] Regenerate `package-lock.json` and run Tailwind's upgrade helper so generated config files line up with the new dependency versions.
- [ ] Point Vite's PostCSS config at `postcss.config.cjs` (or convert the config to `.js`) so the dev server loads the right file.
