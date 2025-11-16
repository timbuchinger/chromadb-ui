# Security, persistence, and session recovery

## Summary
Implement the encrypted storage, automatic expiration, and session recovery behaviors promised in the specification so auth state is resilient and secure.

## Tasks
- [ ] Encrypt the auth payload written to `localStorage` (e.g., via Web Crypto AES-GCM) and attach an expiration timestamp per the spec.
- [ ] Clear stale credentials automatically when the app boots so expired sessions never silently persist.
- [ ] Store the last visited route and restore it on refresh while ensuring router guards respect session recovery requirements.
- [ ] Surface backend errors through the shared notification system instead of inline strings on the login form.
