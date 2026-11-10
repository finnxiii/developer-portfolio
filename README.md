# finnxiii.dev

Personal engineering portfolio — "rubber duck debugger" theme.

**Live:** [finnxiii.dev](https://finnxiii.dev)

## Stack

- React 19 + Vite 8
- React Router v7
- SCSS (no Tailwind, no utility-first)
- Cloudflare Pages + Pages Functions + KV

No GSAP, no Lenis, no Three.js. The stage system is pure CSS transitions + IntersectionObserver.

## Run locally

```bash
npm install
npm run dev
```

Requires Node 20+. Cloudflare Pages Functions are not available in `vite dev`; use `npm run preview:functions` after a build to test them.

## Build

```bash
npm run build   # outputs to dist/
npm run lint    # ESLint
```

The build generates `dist/sitemap.xml` and injects font preload tags automatically.

## Deploy

Pushes to `main` deploy automatically via Cloudflare Pages.

Admin panel is at `/admin` — protected by Cloudflare Access. Not linked from public nav.

---

© 2026 Naing Htoo Lwin
