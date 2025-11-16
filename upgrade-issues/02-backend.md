# Backend connectivity & environment parity

## Summary
Respect the documented `.env` configuration, reuse a shared API client, and make sure tenant/database selections propagate to every Chroma request.

## Tasks
- [ ] Load `VITE_CHROMADB_HOST`, protocol, and related values from `.env` when initializing the auth store and login form instead of hard-coding `localhost:8000` and `http`.
- [ ] Replace the `DEFAULT_PARAMS` constant in `src/stores/chroma.ts` with getters that read the selected tenant and database from the auth store so every request honors the active session.
- [ ] Create a shared Axios instance (or helper) for the base URL and headers, and migrate all request helpers—including login—to that implementation.
- [ ] Ensure the login heartbeat logic uses the same helper instead of duplicating a standalone `fetch` call.
