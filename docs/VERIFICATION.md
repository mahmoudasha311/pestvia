# Verification and handoff

Reviewed on 8 October 2026 against the supplied HTML template. This is a local implementation, not a deployed site. The approved sharing assets and booking wording are included.

## Functional checks

| Check                                       | Result                                                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strict TypeScript, ESLint, production build | Passed, including the final menu correction.                                                                                                                              |
| Automated tests                             | 13 passed, including the optional local MongoDB integration test.                                                                                                         |
| Atomic MongoDB limiter                      | 20 concurrent requests allowed exactly five; one bucket stored; expired windows reset without waiting for TTL cleanup.                                                    |
| Missing rate-limit unique index             | Rejected before saving a lead; index creation command passed against the isolated test database.                                                                          |
| Lead persistence                            | Egyptian mobile stored in E.164; notification status persisted; no lead expiration field or TTL index.                                                                    |
| Notification isolation                      | Mocked failure does not fail the saved request; missing credentials produce `not-configured`. Live Telegram delivery is untested.                                         |
| HTTP routes                                 | Homepage 200; legal placeholders 200/noindex; admin 404; custom missing page 404; robots and sitemap 200; old HTML URL 308 to `/`.                                        |
| Booking API                                 | Missing database 503; honeypot 200; oversized payload 413; foreign origin 403. Unit tests cover 429 and Retry-After.                                                      |
| Browser form                                | Empty submission displays Arabic field errors and focuses name; valid input without a configured database displays Arabic unavailability and phone/WhatsApp alternatives. |
| Production content control                  | Local/preview builds pass; unapproved production fails with content locations; approved production passes the guard.                                                      |
| Mobile widths                               | No horizontal overflow at 320px and 390px.                                                                                                                                |
| Menu accessibility                          | Focus trap, Escape, restored focus, and scroll restoration checked.                                                                                                       |

## Mobile Lighthouse

Production server, localhost, Lighthouse 13.5.0, emulated mobile with throttling. Report timestamp: 2026-10-08T01:00:11.315Z. This measures a local laboratory run, not field Core Web Vitals.

| Category/metric           | Result       | Target/status                                                       |
| ------------------------- | ------------ | ------------------------------------------------------------------- |
| Performance               | 40           | Target 90; optimization deferred by the owner                       |
| Accessibility             | 100          | Automated checks passed; not a complete accessibility certification |
| Best practices            | 100          | Passed automated checks                                             |
| SEO                       | 100          | Passed automated checks; not a ranking guarantee                    |
| Largest Contentful Paint  | 6.0 s        | Target <2.5 s: not met                                              |
| Cumulative Layout Shift   | 0            | Target <0.1: met in this run                                        |
| Total Blocking Time       | 1,720 ms     | High; further work needed                                           |
| Interaction to Next Paint | Not measured | Needs interaction/field measurement; no claim of <200 ms            |

[Full Lighthouse report](../artifacts/lighthouse/mobile.report.html). Earlier local runs scored 49–50 for performance, with LCP 4.5–5.0 s. Host load affects results, but none met the requested LCP target. React hydration, GSAP execution, font rendering and main-thread work remain substantial. Client-side Zod was removed from the initial bundle, Arabic-only font preloads were retained, and ScrollTrigger/Three.js are deferred. Desktop visual effects and approved animation timing were preserved; the outstanding speed problem is not represented as resolved.

## Visual comparison

See [the screenshot gallery](../artifacts/visual-review.html) for before/after pairs. Desktop captures use 1440×900 and mobile captures use 390×844. Original HTML screenshots intentionally include its old copy and removed claims. Animated shield positions differ between captures; no pixel-identical animation frame claim is made.

| Section       | Visible differences                                                                                                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero          | Original dark palette, layout, four stat cards and outlined title retained. Primary CTA is neutral. Hero text is visible immediately with a transform entrance. Mobile replaces the moving shield with the approved gradient fallback. |
| Navbar        | Approved WhatsApp wording replaces the immediate-inspection CTA; desktop also includes the phone action. Logo remains centered. Mobile glass uses 8px blur instead of 20px.                                                            |
| Menu          | Transparent curtain retained. Mobile blur is 16px; desktop is 40px. Supplied contact details/hours replace the old address, emergency copy and certification badges.                                                                   |
| Services      | Three-card arrangement and hover styling retained; certification/guarantee material removed as listed in CONTENT_CHANGES. Mobile uses 8px glass blur and smaller glows.                                                                |
| Methodology   | Four steps and original copy retained as reviewable content. Mobile indicators are static; small text is at least 12px.                                                                                                                |
| Booking       | Approved neutral copy, Egyptian phone placeholder, area select and consent note. The added field makes the form taller; on mobile the lower form requires scrolling.                                                                   |
| Footer        | Cairo/Giza coverage replaces accreditation. Real phone, WhatsApp, social links, street and hours are supplied. Legal links remain hidden.                                                                                              |
| Mobile chrome | Approved sticky contact bar adds a bottom action strip and safe-area spacing. Static tiled grain replaces full-screen SVG turbulence.                                                                                                  |

The outlined Arabic hero line overlaps closely at narrow widths in both the template and converted page; this inherited styling was not redesigned. Green glow visibility and the 3D wireframe vary with animation position. Smaller mobile blur/glows visibly change softness, as approved; glass edges and translucency remain.

## Remaining release work

- Replace/approve the template claims and hero stats in `CONTENT_TODO.md`, then set `CONTENT_APPROVED=true` only for approved production content.
- Configure Atlas and run **`npm run db:indexes` before the first production deployment**. The limiter deliberately fails closed with 503 if required indexes or database access are missing.
- Configure the private Telegram bot and chat ID, then verify a real delivery on the owner’s infrastructure. Never log either credential.
- Address the mobile performance target above. No production launch or field performance verification has occurred.
- Dependency audit at implementation time: production dependencies had zero reported vulnerabilities. The full development tree had seven high-severity findings through `braces` in the Tailwind 3/ESLint tooling chain. No compatible patched version was available in that check; force-upgrading Tailwind or downgrading Next ESLint config was not applied. Recheck before deployment.

Legal placeholders are intentionally independent of content approval and excluded from the sitemap. The owner manages their final wording and visibility.

## Final recheck

The final production build and strict TypeScript check passed after the menu correction. The complete ESLint check passed; the changed hook and review script were checked again. The desktop menu screenshot now matches the original transparent, blurred appearance: fixed-body locking was restricted to mobile/coarse pointers to avoid a Chromium compositing defect over the animated hero. Desktop retains overflow locking. Mobile behavior is unchanged.

The owner set a performance target of 90 and deferred further performance tuning. The recorded score remains 40; this is an explicitly deferred gap, not an achieved target.
