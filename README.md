# Turbo Desktop website

Documentation site for [Turbo Desktop](https://github.com/aguspe/turbo_desktop) — Turbo Native, for the desktop.

Static site, no build step. Ported from the Claude Design project "Turbo Desktop documentation UI".

## Structure

- `index.html` — the whole site (single page, section anchors)
- `assets/style.css` — design tokens (dark/light themes), layout, components
- `assets/site.js` — theme toggle, tabs, presentation demo, scrollspy, copy buttons, syntax highlighting
- `assets/logo.png` — Turbo Desktop logo

## Develop

Open `index.html` directly, or serve it:

```bash
python3 -m http.server 8080
```

## Deploy

Any static host works (GitHub Pages, Netlify, Cloudflare Pages). Point it at the repo root.
