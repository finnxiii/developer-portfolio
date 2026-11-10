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

## Environment variables

For local development, create `.dev.vars` for Cloudflare Pages Functions:

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes (for form) | Resend API key for sending contact form emails |
| `CONTACT_TO` | Yes | Recipient email address for contact form messages |
| `TURNSTILE_SECRET` | No | Cloudflare Turnstile secret key for bot protection |
| `VITE_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key (public, used in browser) — set as a GitHub Actions repository variable (`vars.VITE_TURNSTILE_SITE_KEY`), not a secret |
| `RATE_LIMIT` | No | KV namespace binding for rate-limiting the contact form |

### Cloudflare setup

1. **Resend:** create an account at resend.com, verify a sending domain, generate an API key, and add it as `RESEND_API_KEY` in the Cloudflare Pages dashboard under Settings → Environment variables.
2. **Turnstile (optional):** create a widget at dash.cloudflare.com → Turnstile. Add the site key as `VITE_TURNSTILE_SITE_KEY` (must be prefixed `VITE_` to be bundled by Vite) and the secret key as `TURNSTILE_SECRET`.
3. **Rate limiting KV (optional):** create a KV namespace named `RATE_LIMIT` in Cloudflare and bind it to your Pages project under Settings → Functions → KV namespace bindings.
4. **Local testing:** create a `.dev.vars` file (gitignored) with `RESEND_API_KEY=re_xxx` etc., then use `npx wrangler pages dev dist --kv RATE_LIMIT` to test functions locally after a build.
