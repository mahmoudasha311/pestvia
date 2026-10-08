# PESTVIA

Arabic RTL Next.js App Router website, converted from the supplied HTML template. Node.js 22.14+ and npm are required. Vercel and MongoDB Atlas are configured by the owner; no deployment is performed by this project setup.

## Setup

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local` and set `MONGODB_URI` with a database name. Never commit credentials.
3. Run `npm run dev`, then open `http://localhost:3000`.
4. **REQUIRED before the first production deploy:** with the target database credentials loaded, run `npm run db:indexes`. Repeat this explicitly when adding indexes in future features. This creates indexes; it does not run destructive `syncIndexes` or drop collections.
5. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. `npm start` serves the built application.
6. Review `CONTENT_TODO.md`, replace/approve the remaining template claims, and set `CONTENT_APPROVED=true` in the production deployment environment.

The UI runs without MongoDB or Telegram credentials. Genuine booking submissions return a clear Arabic HTTP 503 error until the database and required indexes are available. Phone and WhatsApp contact links remain usable.

For local development, open `http://localhost:3000`. The current workstation's LAN preview (`http://192.168.1.4:3000`) is also allowed through `allowedDevOrigins` in `next.config.ts`. If the workstation IP changes, update that exact hostname entry and restart `npm run dev`; do not use an unrestricted wildcard. After changing the development server configuration, reload the browser to reconnect its scripts and live updates.

## Environment

| Variable                                                                       | Purpose                                                                                                                                 |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`                                                                  | Server-only Atlas URI including database name.                                                                                          |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                                       | Private Telegram destination. Optional until configured; never exposed to client code or logs.                                          |
| `RATE_LIMIT_SALT`                                                              | Optional stable salt for SHA-256 IP hashes. Changing it resets effective buckets.                                                       |
| `TRUSTED_CLIENT_IP_HEADER`                                                     | Only for another host with an ingress that overwrites this header. Vercel uses its platform header automatically.                       |
| `CONTENT_APPROVED`                                                             | Exact value `true` acknowledges the content review for production.                                                                      |
| `DEPLOYMENT_ENV`                                                               | Non-Vercel deployment classification; set `production` for a public production build. Vercel's `VERCEL_ENV` takes precedence.           |
| `GOOGLE_SITE_VERIFICATION`                                                     | Optional Search Console verification token.                                                                                             |
| `NEXT_PUBLIC_ANALYTICS_ID`                                                     | Reserved only; no tracking scripts are installed or rendered.                                                                           |
| `STORAGE_PROVIDER`, `STORAGE_ACCOUNT`, `STORAGE_API_KEY`, `STORAGE_API_SECRET` | Reserved server-side slots for a future image provider; inactive.                                                                       |
| `MONGODB_TEST_URI`                                                             | Optional, isolated database for future/live integration verification. Never use your production database for destructive test fixtures. |

`scripts/check-content-approval.mjs` blocks **only explicitly production deployments** without approval. It prints every remaining `TODO(content)` source location and points to `CONTENT_TODO.md`. Local development, local `next build`, and Vercel previews remain available; `NODE_ENV=production` alone does not activate the gate. No conditional rendering hides the stats or other content.

## Architecture and editing content

`src/app` composes features and defines routes/metadata. Features own components, content, validation, models, hooks, and services only as needed. Import another feature through its public `index.ts`; the booking feature also exposes a server-only `server.ts` entry for route adapters. Never import another feature's model internals. Put only broadly shared infrastructure/config/types under `src/shared`.

| Feature/config                                        | Edit here                                                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Header/menu/footer/mobile actions                     | `src/features/layout/content/layout.content.ts`                                                                                |
| Hero text and 2–4 editable stat cards                 | `src/features/hero/content/hero.content.ts` (`heroStats`: `{ value, label }[]`; suffixes such as `+` stay in the value string) |
| Homepage service cards                                | `src/features/home-services/content/services.content.ts`                                                                       |
| Methodology                                           | `src/features/methodology/content/methodology.content.ts`                                                                      |
| Approved booking copy/field labels                    | `src/features/booking/content/`                                                                                                |
| Business, street address, hours, Cairo/Giza options   | `src/shared/config/business.ts`                                                                                                |
| Phone, WhatsApp message, inactive email, social links | `src/shared/config/contact.ts`                                                                                                 |
| Metadata defaults                                     | `src/shared/config/seo.ts`                                                                                                     |
| Legal placeholder bodies                              | `src/features/legal/content/legal.content.ts`                                                                                  |
| Legal link visibility                                 | `src/shared/config/legal.ts`                                                                                                   |

Public copy is rendered into HTML on the server. Client islands are limited to the menu, cursor, animations, optional Three.js scene, and form. The original HTML remains in the repository as the comparison baseline and is not served by Next.js. Its old URL redirects permanently to `/`; no other redirects were added.

## Booking, database, and notifications

The form collects name, Egyptian mobile number, property type, and governorate. A hidden honeypot is discarded. Zod validates the API boundary independently of Mongoose schemas. Local `01XXXXXXXXX` and international `+201XXXXXXXXX` mobile numbers (010/011/012/015 prefixes) normalize to `+20` for storage; the UI displays local format. Arabic/Persian digits and common display separators are accepted.

`src/shared/lib/db` caches the Mongoose connection/promise on `globalThis` for hot reload and warm serverless instances. Models are feature-owned and their TypeScript types come from schemas. Automatic index creation is disabled. The lead index is `createdAt: -1`. Only the required business model (`leads`) and the technical `rate_limits` collection are wired now.

Rate limiting uses a fixed 15-minute window, 5 attempts per hashed IP, an atomic aggregation update, a full unique `rate_limits.key` index, and a zero-second TTL index on `rate_limits.expiresAt`. The TTL monitor is only cleanup: expired windows reset atomically even before MongoDB removes them. Racing first inserts retry once after duplicate-key rejection. Invalid form attempts also consume quota after body parsing; honeypot submissions do not touch storage. No raw IP is stored. On Vercel the client key uses its [platform-provided forwarding header](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for); elsewhere configure a trusted overwritten header. Local previews share one loopback bucket.

**Failure choice: fail closed.** Each limiter call checks the unique and TTL indexes. If the unique key index is missing, partial, sparse, or nonunique, no upsert or lead save occurs: the form returns HTTP 503 with an Arabic message and contact alternatives. Missing/unavailable database or limiter storage behaves the same. Exceeded limits return HTTP 429 with `Retry-After` in seconds. `npm run db:indexes` is therefore required, not optional.

A lead is saved before notification is scheduled. `Next.js after()` tracks notification delivery after the response. `src/features/booking/services/notifiers` defines a small provider interface; add an email implementation later and change the factory without changing form logic. Telegram messages contain only name, local phone, property type, area, and Cairo-local time. Network calls have a five-second timeout. Delivery status is stored as pending/sent/failed/not-configured. A notification failure never changes a saved request into an error. There is no delivery queue or automatic retry dashboard yet; failed delivery can be reviewed using the stored status. Logs contain only a sanitized event code, never credentials, chat IDs, or lead data.

## SEO, legal routes, and assets

The homepage has a canonical URL, Arabic/Egypt Open Graph metadata, Organization/LocalBusiness and WebSite JSON-LD with only supplied business details, and a sitemap entry. Email is excluded until its config flag is enabled. Street-only address is intentional; no district/building/city has been invented. Working hours are Saturday–Thursday 10:00–18:00, Friday closed.

`/privacy` and `/terms` contain `قيد الإعداد`, carry noindex/nofollow, and are outside the sitemap. Footer and consent privacy links remain hidden until `legalConfig.linksEnabled` is enabled. These pages have no content TODO markers and do not participate in content approval. A legal review of privacy/terms is recommended before public launch.

The approved logo-based sharing image and icons use Next.js metadata file conventions in `src/app`. Other fixed site images live in `public/` and use `next/image`. Header logo is preloaded; footer logo is lazy loaded. Full-logo favicon lettering is necessarily very small. Asset preparation scripts reproduce the approved design using the existing Next.js Sharp dependency.

## Motion, fonts, and mobile

GSAP plugins are registered centrally. Hero entrance uses the original timing with transform only, so the heading is immediately visible. Below-fold reveals apply hidden start styles after hydration only. Three.js loads after paint/idle on desktop fine pointers, pauses offscreen/in hidden tabs, and disposes its resources on unmount; failure leaves the gradient fallback intact. Reduced motion disables cursor/motion and the scene.

Desktop preserves the original glass blur, glow, grain, white difference-blend cursor, and transparent blurred menu. Mobile/coarse/reduced-motion CSS uses 8px glass blur, 16px menu blur, smaller radial glows, a static noise tile, and static indicators. The approved sticky phone/WhatsApp bar includes safe-area spacing.

Fonts are self-hosted through `next/font`: Cairo 900 and Tajawal 400/500/700/900, Arabic and Latin, display swap. Only Arabic subsets are preloaded; Latin subsets load on demand. Cairo 400/700 and unused Tajawal weights are omitted. The template's CSS 600 requests resolve through font matching to the included bold face because Tajawal has no native 600 weight. Arabic microcopy is at least 12px; form text is 16px. No global `user-select:none` restriction remains.

## Future features

`features/services`, `areas`, `blog`, `auth`, and `admin` reserve public types and entry points, with no future collections or public UI. Add feature-owned models with explicit unique slug indexes for services/areas/posts; export shared access through that feature's public API. Add route-level metadata and sitemap entries only when those real pages exist.

The `/admin` route is unavailable (404), has no public links, and is disallowed in robots. `src/proxy.ts` is Next.js's middleware replacement and calls the closed auth hook. Build a real session/authentication layer and authorization checks in every future admin API/action before enabling it; the hook alone is not authentication. No login/dashboard has been implemented.

`src/shared/lib/storage` contains types only. Choose an external image host later, implement its adapter, then configure only that host's exact remote image patterns. No Cloudinary/provider SDK, upload endpoint, or remote pattern is configured now.

## Checks and review

`npm run format` / `format:check` use Prettier. `npm test` uses Node's test runner with a small TypeScript loader (no extra test library). Tests cover validation, E.164 normalization, quota responses, failure isolation, index requirements, hashing, minimal notification payloads, and production approval contexts.

The optional MongoDB integration test requires `MONGODB_TEST_URI` pointing to a dedicated disposable database whose name ends in `_test` or `_tests` (for example `pestvia_test`). It temporarily drops and recreates the rate-limit unique index, so never use a production database or a database shared with a running application. Without that variable, the integration test is skipped. All 13 tests passed against an isolated local MongoDB 6.0 instance, including 20 concurrent attempts allowing exactly five, expired-window reset, missing-index refusal, and durable lead storage. The `db:indexes` command was also verified against that isolated database. Atlas connectivity and real Telegram delivery still require owner credentials and must be verified before accepting public leads.

See `CONTENT_TODO.md` for remaining copy, `docs/CONTENT_CHANGES.md` for replaced template data, and `docs/VERIFICATION.md` for visual comparison and measured checks.
