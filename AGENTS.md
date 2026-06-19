# ArtEcuador — AGENTS.md

Single-page Astro v6 + TS catalog for Ecuadorian handicrafts. Admin panel, own analytics, S3 storage.

## Project layout

All source code is in **`artecuador-v2/`**. The repo root has only shared `media/`, `railway.toml`, and doc files. **Run all commands from `artecuador-v2/`.**

## Dev commands

```bash
npm run dev       # localhost:4321 — full site + admin + API
npm run build     # dist/ (production bundle)
npm run preview   # serve dist/ locally
```

No lint, typecheck, or test scripts exist. Node >=22.12.0 required.

## Architecture quirks

- **Astro config**: `output: 'static'` + `adapter: node({ mode: 'standalone' })`. Every page has `export const prerender = false` — all pages are server-rendered (catalog is read per-request, no stale HTML).
- **Docker build from repo root**, not from `artecuador-v2/`:
  ```
  docker build -t artecuador -f artecuador-v2/Dockerfile .
  ```
  Dockerfile uses `COPY artecuador-v2/` prefixes and expects `media/` at root.
- **`public/media` is a symlink** → `../../media` (resolves to `media/` at repo root).
- **`security: { checkOrigin: false }`** in `astro.config.mjs` — Safari CSRF workaround for uploads.
- **Railway**: `railway.toml` must have `builder = "DOCKERFILE"` (not Nixpacks) or it serves nginx default page.

## Storage (dual mode)

| Env vars set (`S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`) | No env vars |
|---|---|
| Catalog + images + analytics live in S3/R2 bucket | Local filesystem (dev) |
| `/media/[...path]` proxy serves bucket images not found as static files | — |

Cache in memory 60 s (`src/lib/storage.ts`), invalidated on save.

## Admin auth

SHA-256 hash `da5c8060d7f3de5fc7aba7fdd418ff11009f70aca445a5248701694e60fb3ba8` = `admin:artecuador2026`. Defined in **both**:
- `src/components/Nav.astro` (frontend login check)
- `src/pages/api/products.ts`, `images.ts`, `upload.ts`, `stats.ts` (Bearer token validation)

Change password: recompute SHA-256(`usuario:nuevacontraseña`) and update both locations.

## Data & images

- **Catalog**: `src/data/products.json` — sections with `id`, `label`, `title`, `titleEm`, `alt`; products with `slug`, `img`, `name`, `desc`, `price`, `badge` (`feat`/`new`/`limit`), `active`. Loaded via async loaders in `src/data/products.ts`.
- **Images**: kebab-case filenames, no spaces. In `media/products/` and `media/clients/`. Upload endpoint sanitizes names.
- **Analytics**: `src/data/analytics.json` — **gitignored**. In prod lives in S3 bucket. Written by `POST /api/track` (no auth).

## Key conventions

- **CSS**: custom in `public/styles/global.css` + component `<style>` tags. No Tailwind. Design tokens: `--red`, `--yellow`, `--green`, `--blue`, `--purple`, `--gray-d`, `--gray-m`, `--bg`, `--shadow`, `--shadow-hover`. Fonts: Playfair Display (headings), Montserrat (body).
- **Admin CSS**: `<style is:global>` in `admin.astro` — generated JS elements don't get Astro's scoped `data-astro-cid-*` attributes.
- **Pagination**: client-side in `FilterBar.astro`, 8 products per section, paginates over filtered results only.
- **No emoji in code unless UI already uses them** (admin panel uses emoji for icons; follow existing pattern there).
- **Product detail** resolves slug at runtime (`[slug].astro`, no `getStaticPaths`). 404 → redirect to `/`.
- **New sections** need a `.cat-{id}` class in `global.css` for the gradient strip.
