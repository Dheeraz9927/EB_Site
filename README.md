# Elaena Brokers Inc. — EB_Site

Marketing website for Elaena Brokers Inc., a Hamilton-based UniBrokers franchise. Static Astro site with the glass design, coverage tabs and dedicated coverage pages, team, FAQ, contact details, privacy page and an on-screen call planner.

## Local development

Use Node 24 and npm. The lockfile is committed.

```sh
npm ci
npm run dev
```

Open the URL printed by Astro (usually http://localhost:4321).

## Checks

```sh
npm run validate      # Astro/TypeScript checks, unit tests, production build
npm run verify:build  # static checks on dist/
npm run test:e2e      # build, then browser + accessibility tests (Playwright + axe)
npm run preview       # serve dist/ locally
```

- `validate` runs type checks, the planner unit tests in `tests/*.test.mjs` and the build.
- `verify:build` checks every built page for required assets, internal links (including `/#section` links), one `h1`, ARIA targets, duplicate IDs, contact details, valid JSON-LD and CSP compatibility.
- `test:e2e` runs `tests/e2e/` on desktop and mobile Chromium: axe WCAG 2.1 A/AA scans of every page, the coverage tabs keyboard pattern, the call planner (on-screen checklist, progress, call/email links, no download), the mobile menu and cross-page navigation. First run: `npx playwright install chromium`.

## Editing content

All copy lives in `src/data/`; components only handle layout.

- `site.ts`: business details, **phone, email and hours**, navigation, and the hero, trust strip, approach, story, contact, closing and footer copy.
- `coverage.ts`: coverage tab content, checklist items, and the SEO titles/descriptions for the `/auto-insurance/`, `/home-insurance/` and `/commercial-insurance/` pages.
- `team.ts`, `faq.ts`: team members and FAQ.

The phone number and email are also asserted in `scripts/verify-build.mjs` and `tests/e2e/site.spec.mjs`; update them there if they change.

## Structure

- `src/pages/`: home (`index.astro`), coverage pages (`[slug].astro`), `privacy.astro`, `404.astro`, `robots.txt`, `sitemap.xml`.
- `src/layouts/Layout.astro`: metadata, social preview tags, `InsuranceAgency` structured data, self-hosted fonts and the production CSP.
- `src/layouts/Page.astro`: shared shell (header, footer, planner dialog, site script) used by every page.
- `src/components/`: page sections, including `Contact.astro` and the call planner.
- `src/scripts/main.ts`: accessible tabs, mobile menu, native modal, on-screen call planner, reduced-motion-aware animation, footer year.
- `src/lib/planner.ts`: pure email-draft, progress and keyboard-navigation logic, exercised by unit tests.
- `src/styles/`: `base.css` (foundation), `glass.css` (glass theme, overrides base), `pages.css` (contact, coverage pages, privacy, brand marks). The accent colour is the logo gold, `--accent`.
- `public/`: logo, shield emblem, responsive hero images, social preview image, favicons and static-host header configuration.
- `.github/`: CI workflow and Dependabot.
- `deploy/nginx.conf` and `Dockerfile`: portable, non-root static hosting.

All coverage panels are rendered into the HTML. JavaScript switches visibility without rebuilding HTML from strings. FAQ content uses native disclosure elements. The browser makes no analytics or third-party font requests. The hero image is AI-generated illustrative architecture, not a photograph of the brokerage's premises.

## Hosting

GitHub is the development repository. The live Sites deployment has its own source remote and is published separately; a GitHub push alone does not update it. CI (`.github/workflows/ci.yml`) validates, runs browser tests and uploads `dist/` as an artifact; it does not deploy.

Set the build-time `SITE_URL` to the final HTTPS origin before building for a custom domain. It controls canonical URLs, social preview URLs, structured data, robots.txt and sitemap.xml. The default in `astro.config.mjs` and the `Dockerfile` is the production domain, `https://www.elaenabrokers.ca`. Host `dist/` at the domain root; subdirectory deployments need base-path support before use.

**Cloudflare (Workers Builds):** connect the GitHub repo, set `NODE_VERSION=24`, build command `npm run validate && npm run verify:build`, deploy command `npx wrangler deploy`. `wrangler.jsonc` serves `dist/` with real 404s; the Worker's name in the dashboard must match `name` there (`elaenabrokers`). Cloudflare applies `public/_headers`. Custom domains on Workers need the domain's DNS on Cloudflare (nameservers pointed to Cloudflare).

On other static hosting platforms, use Node 24, build command `npm run validate && npm run verify:build`, output `dist`. `_headers` applies only on platforms that support that convention. Other hosts must configure equivalent HTTP response headers; the HTML also includes a CSP fallback, which cannot enforce `frame-ancestors`.

For a VM/container deployment:

```sh
docker build --build-arg SITE_URL=https://your-domain.example -t elaena-site .
docker run --rm -p 8080:8080 elaena-site
```

Terminate HTTPS in front of port 8080 using your platform's load balancer or reverse proxy. Configure TLS certificates, DNS and HSTS at that edge. The container provides `/healthz`, security headers, hashed-asset caching and a real 404 response. Validate the Docker recipe in a Docker-enabled environment before adopting it as the production target.

## Release and rollback

1. Review changes and run `npm run validate`, `npm run verify:build` and `npm run test:e2e`.
2. Commit source and lockfile to GitHub; confirm CI succeeds.
3. Build with the correct `SITE_URL` and publish the artifact to the chosen host.
4. Verify the production pages, asset delivery, 404 behaviour and visitor access.
5. Keep the previous artifact/hosting version for rollback.

Review Dependabot pull requests and let CI pass before merging.

## Business launch requirements

The site publishes the brokerage phone (+1 647-917-2693), email (aayush.khatri@unibrokers.ca) and hours (Monday to Friday, 9 am – 7 pm). The call planner shows what to have ready on screen and offers call/email buttons; the email button only opens a draft in the visitor's own email app. It downloads nothing, stores nothing, and does not submit a quote request or bind insurance.

Still to confirm with the brokerage before advertising the site:

- **Office address**, if the brokerage wants to publish one (also enables a map and full local-business data).
- **RIBO disclosure**: what the brokerage's registration requires the website to display.
- **Privacy page** wording (`src/pages/privacy.astro`) reviewed against the brokerage's privacy policy.
- **Team**: spelling and titles of each name, and headshots for the remaining team cards (original files, not compressed chat copies).
- **Story**: consent to name previous employers (Allstate, All-Risks).
- **Reviews/testimonials**: only real, attributable ones.

Before adding a contact form, confirm the recipient mailbox/CRM, consent/privacy copy and retention policy, then add server-side validation, spam protection, rate limits and delivery monitoring. Do not collect driver's licences or payment information through the site.
