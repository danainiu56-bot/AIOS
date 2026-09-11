# IMAI page-editing convention

- Implement page-specific design changes directly in the matching file under `pages/`.
- Do not add new page UI or page-specific design markup to `app-shell.html`; it is legacy shared-shell source only.
- Keep the matching deployed copy under `build/pages/` synchronized after validation.
- Put genuinely shared navigation or cross-page behavior in a small shared asset instead of duplicating it in `app-shell.html`.
