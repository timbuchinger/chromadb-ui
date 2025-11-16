# Collections screen correctness and UX polish

## Summary
Finish the UX polish items promised in the README by ensuring alphabetical ordering, proper component registration, and accessibility enhancements.

## Tasks
- [ ] Sort `chromaStore.collections` before pagination so the table always appears alphabetical regardless of insertion order.
- [ ] Import and register `<LoadingSkeleton>` inside `DocumentsList.vue` so stricter tooling builds cleanly.
- [ ] Register the `focus-trap` directive globally in `main.ts` so `<AddDocumentModal>` traps focus as designed.
- [ ] Remove or fix the stale `<link href="/src/styles.css">` entry in `index.html` since `src/style.css` is already included via `main.ts`.
- [ ] Prefill the login tenant/database inputs with the last authenticated values to meet the UX spec.
