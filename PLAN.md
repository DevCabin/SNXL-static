# ShirtNerdXL 2.0 — Resumable Build Plan

> Resumability contract for any agent picking this project up mid-flight.
> Repo: /Users/george/GITHUB/SNXL-static (GitHub DevCabin/SNXL-static, branch main)
> Owner brief: rebuild shirtnerdxl.com as a static-first Next.js inquiry catalog on Vercel (no cart/checkout/DB/Shopify/Stripe/Gelato API). Formspree requests only; owner fulfills manually via Gelato.

## 0. How to resume
1. Read this file fully. Then `git status --short` and `git log --oneline | head -5` to see reality.
2. Continue at the FIRST unchecked `[ ]` item in §8 Progress Log. Every step in §5 has a DONE-WHEN so you can verify whether a half-finished step actually completed before redoing it.
3. After finishing a step: tick its box in §8 and append one line (date, step id, outcome). Commit at the end of each phase with message `phase N: <summary>`.
4. Environment gotchas (learned the hard way):
   - The terminal CRASHES on long heredoc/printf commands. Create/edit files ONLY with the editor tool. Keep every shell command short and single-purpose.
   - Long-running jobs: run in background redirecting to /tmp/snxl-<name>.log, poll with `tail -3 /tmp/snxl-<name>.log`.
   - node v22.22.0, npm ok, macOS. python3 ok for quick JSON/CSV inspection (write the script to /tmp with the editor tool, then `python3 /tmp/x.py`).
   - Do NOT use create-next-app (dir is non-empty; interactive prompts crash the terminal). Scaffold manually per step 1.1.
5. Sources of truth (never hand-edit): `products.local.json` (53 products, LOCAL image paths — the catalog the site builds from), `launch/shirtnerdxl_launch_catalog.json` (same data, remote URLs), `products.json` (rescue-script input), `public/products/**` (557 image files), `reports/summary.json` (rescue result: failed 0).
6. Hard rules from the owner brief — do not violate:
   - Only these 53 products; preserve `/products/{handle}` URLs exactly.
   - No cart, checkout, Stripe, Shopify API/CDN, Gelato API, database.
   - Single shared Formspree endpoint: https://formspree.io/f/xoedlbzy
   - Never invent variant options, prices, categories, or guarantees; flag unknowns instead.
   - Zero `cdn.shopify.com` references in the production build.
   - Never change DNS or cancel Shopify (owner-only, after explicit approval).

## 1. Mission summary
Browse designs → pick size/color → send Formspree request → owner confirms & fulfills via Gelato manually. Look/feel close to current Shopify screenshots (charcoal header/footer, lime accent bar/CTAs, bold uppercase display type, mono UI type, light product tiles) minus sold-out badges, cart, payment icons. Pages: Home, /designs catalog (search + tag filter), /products/[handle] ×53 (SSG), About, How Ordering Works, Contact, Privacy Policy, Shipping & Returns, branded 404.

## 2. Locked decisions (owner-approved unless noted)
- D1 HYBRID variant selection (owner chose this): normalize splits variants into `knownCombos` (options with non-empty Size and/or Color) vs `unknownVariants` (empty options). SUPPORTED sizes = L, XL, 2XL, 3XL, 4XL, 5XL; all other sizes hidden everywhere. Product `selectionMode='strict'` if ≥1 knownCombo has Size ∈ SUPPORTED → selectors offer exactly those combos. Else `selectionMode='preference'`: size list = SUPPORTED, color list = product's deduped known colors or single "As pictured"; UI must show label "Request preference — not confirmed availability"; form sends size/color as text + best-match SKU when known, else product handle. All hidden/ambiguous variants preserved in catalog.json and listed in data/review-flags.json + reports/variant-review.md.
- D2 Pricing ONLY in lib/pricing.ts: STANDARD = L/XL/2XL/3XL → 24.99, 4XL/5XL → 26.99. Cards show "From $24.99". Original Shopify price kept per variant as `originalPrice`, never displayed.
- D3 Images optimized in place (sharp, devDependency) to ≤1600px, JPEG q72 / PNG compressed, so `public/` < ~90MB — Vercel Hobby caps static uploads at 100MB/deployment (verified in Vercel docs). Masters copied once to `image-masters/` (gitignored) BEFORE optimizing. Run optimize BEFORE normalize (normalize reads final pixel dims).
- D4 Alt text: keep `images[].alt` unless empty or UUID-like (hex-dash pattern) → then product title.
- D5 Tags: merge 'sci fi' → 'sci-fi'. Header nav: HOME, FUNNY→/designs?tag=funny, SCI FI→?tag=sci-fi, GAMER→?tag=gamer, RANDOM→?tag=random, ABOUT, CONTACT. Catalog chips = every tag present (sorted by count desc). Search matches title + tags. No invented categories.
- D6 Featured 12 (home) in data/config.ts FEATURED_HANDLES (owner-editable): id-rather-die-than-drink-decaf; embrace-the-chaos-kitty-branded-tee-up-to-5xl; support-squad-orange-controller-gamer-tee; sunset-stroll-mechanical-marvels-graphic-tee-for-big-guys-up-to-5xl; slow-down-im-from-the-1900s-funny-graphic-tee-up-to-5xl; fairly-introverted-but-willing-to-talk-about-my-jeep; keyboard-warrior-tee-battle-ready-comfort; nope-rope-danger-noodle; watch-out-for-snakes; gamera-is-the-friend-of-all-children; listen-to-more-weezer; pluto-never-forget-funny-and-nerdy-mens-graphic-tees-up-to-5xl
- D7 Tokens: bg #F7F8F8; ink #1F2328; charcoal #262A31; lime #A6D40E; red #E8112D (logo "XL"); fonts via next/font/google: Archivo Black (display, uppercase) + Space Mono (UI/body/prices).
- D8 SEO: metadataBase = NEXT_PUBLIC_SITE_URL || https://shirtnerdxl.com; per-route title/description/canonical; OG+Twitter with primary image; sitemap.ts (53 products + 6 static pages) + robots.ts; JSON-LD: Organization+WebSite on home, Product WITHOUT offers + BreadcrumbList on product pages (inquiry model — never imply checkout); unknown /products/* → branded not-found (NO home redirect); next.config redirect /collections/:slug → /designs?tag=:slug.
- D9 Formspree client form: JSON POST, header Accept: application/json; fields: name*, email*, size*, color* (when applicable), product_title, product_handle, variant_sku, displayed_price, message (notes, optional), honeypot input named `_gotcha` (hidden, must stay empty; if filled → silently no-send but show success to bot). Success UI ONLY when res.ok. Disable submit while in flight (no duplicate sends). Exact copy strings in step 3.5.
- D10 Layout: Next app at repo root; rescue kit lives in scripts/ with root-aware paths (root = path.resolve(here,'..')); generated files data/catalog.json + data/review-flags.json never hand-edited (re-run normalize instead).

## 3. Data findings (verified 2026-11-19 — do not re-derive, trust these)
- F1 53 products; all `status: active`; vendor "My Store"; type "Print Material".
- F2 557 unique gallery files, ALL present under public/products/ (189MB pre-optimization). Image keys: url (local /products/...), sourceUrl (remote), alt, downloadStatus. Variant imageUrl values are local and ALL present (many variants share one image).
- F3 Variants: 2279 total; keys sku, options, price, imageUrl, sourceImageUrl. ONLY 53 variants (exactly 1 per product) carry any option value (35 Color+Size, 17 Size-only, 1 Color-only); 2226 are `{}`. Known sizes: S×51, 4XL×1. Known colors: 10 distinct (White, Graphite Heather, Dark Heather, Forest Green, Royal, Azalea, Military Green, Maroon, Light Blue, Light Pink).
- F4 Original prices 24.99–32.99; 1–3 distinct prices per product; price does NOT encode size (checked) → option labels are unrecoverable from this package without inventing data.
- F5 descriptionHtml: zero <script>/<iframe>/on*= /javascript:/http:// occurrences; still sanitize at build time (sanitize-html).
- F6 Tag counts: jeep 10, funny 10, BuiltWithAi 10, random 5, sci-fi 4 (+ 'sci fi' 1), mst3k 4, geek 4, gamer 3, music 3, star trek 3, 90's 2, star wars 2, math/branded/coder/coffee/inspiring/80's 1 each.
- F7 Near-duplicate handle pairs are DISTINCT products, keep both, flag in review report: sunset-stroll…branded vs …graphic; twilight-trek…branded vs …graphic; wrangler-hair-don-t-care vs …-black; fairly-introverted…jeep vs …jeep-on-dark; be-nice-to-everyone… vs …branded; listen-to-more-weezer vs …-nerd-rock-4ever.
- F8 All 557 alts non-empty but many are bare UUID filenames → D4 replacement rule.
- F9 Image rescue COMPLETE: reports/summary.json = {downloaded 5+552 reused, failed 0, productsWithoutAnyLocalImage []}.
- F10 Old-site featured designs "Whatever.", "Body by Bacon", "Chill Pepper", "The Brain That Wouldn't Die", "Smile!", "He doesn't care about your excuses" are NOT among the 53 → featured grid uses D6 list instead.
## 4. Target repo layout
```
app/            layout.tsx globals.css page.tsx not-found.tsx sitemap.ts robots.ts
                designs/page.tsx  products/[handle]/page.tsx
                about/ how-ordering-works/ contact/ privacy-policy/ shipping-returns/
components/     Header AnnouncementBar Footer ProductCard ProductGrid Gallery
                VariantSelector RequestForm CatalogControls JsonLd ui/(Button,Container,SectionTitle)
data/           catalog.json (generated) review-flags.json (generated) config.ts
lib/            types.ts catalog.ts pricing.ts variants.ts sanitize.ts seo.ts
public/products/**            optimized images (committed)
scripts/        download-images.mjs optimize-images.mjs normalize-catalog.mjs
                validate.mjs image-dims.mjs
image-masters/  pre-optimization originals (gitignored, local backup only)
launch/ reports/ products.json products.local.json   (untouched sources)
PLAN.md README.md (rewritten in phase 6)
```

## 5. Steps (each has DONE-WHEN; tick in §8)
### Phase 1 — scaffold & data pipeline
- 1.1 Manual scaffold: package.json, tsconfig.json, next.config.ts, postcss.config.mjs, .gitignore, app/globals.css, app/layout.tsx, app/page.tsx. DONE-WHEN: `npm install` exit 0 (log /tmp/snxl-npm.log) AND `npx next build` succeeds with placeholder home.
- 1.2 `mkdir -p scripts && mv download-images.mjs scripts/`; edit its path consts: `const root = path.resolve(here, '..')` then inputPath=root/products.json, outputPath=root/products.local.json, publicDir=root/public/products, reportDir=root/reports. Update "README image rescue.md" run commands to `node scripts/download-images.mjs`. DONE-WHEN: `node scripts/download-images.mjs --dry-run` prints "53 products, 557 product-scoped unique image downloads".
- 1.3 Deps: sanitize-html + @types/sanitize-html + sharp already declared in package.json (step 1.1); confirm present in node_modules after install.
- 1.4 scripts/optimize-images.mjs (sharp): walk public/products/**/*.{jpg,png}; copy original to image-masters/<rel path> IF not already there; re-encode in place: resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}) then jpeg({quality:72,mozjpeg:true}) or png({compressionLevel:9}); write reports/image-optimization-report.csv (path,before_bytes,after_bytes). Idempotent: skip rel paths already in report with after>0. DONE-WHEN: `du -sh public/products` < 95MB and report rows = 557.
- 1.5 scripts/image-dims.mjs: export readDims(absPath) → {width,height} parsing JPEG (SOF0/1/2), PNG (IHDR), GIF (header), WebP (VP8/VP8L/VP8X). No deps. DONE-WHEN: spot check 3 files against `sips -g pixelWidth -g pixelHeight`.
- 1.6 scripts/normalize-catalog.mjs: read root products.local.json → write data/catalog.json + data/review-flags.json + reports/variant-review.md. Per product: handle,title,urlPath,tags(D5),descriptionHtmlSafe (sanitize-html allow p,br,ul,ol,li,strong,em,b,i,a[href],h2,h3,h4,blockquote,span),gallery[{url,alt(D4),width,height}],primaryImage=gallery[0],variants split knownCombos/unknownVariants (D1) each {sku,originalPrice,size,color,imageUrl},colorsKnown[],selectionMode,fromPrice=24.99,gelatoProductId (internal, never rendered). review-flags: products with unknownVariants>0 (+count), hidden sizes seen, F7 dup-handle pairs, preference-mode list. DONE-WHEN: prints products=53, missing files=0, mode counts; `grep -c cdn.shopify.com data/catalog.json` = 0.
### Phase 2 — shell & design system (D7)
- 2.1 globals.css: `@import "tailwindcss";` + `@theme` tokens (colors bg/ink/charcoal/lime/red, fonts display/mono) + base styles (focus-visible ring, selection color). layout.tsx: next/font/google Archivo Black (--font-display) + Space Mono (--font-mono), metadataBase + title template "%s | ShirtNerdXL", default description + openGraph.
- 2.2 components: Header (charcoal; centered logo link / = SHIRTNERD + red XL; nav D5; mobile hamburger accessible disclosure), AnnouncementBar (lime, ink text, links /how-ordering-works, copy: "No payment online — request any design up to 5XL and we'll handle the rest"), Footer (charcoal; logo; blurb: "Original designs for all your passions (and a few crowd-pleasers too)—all available up to 5XL. Take a look around and see what sparks your nerdy soul. Want a design on a different shirt style or product? Just hit the contact page — we'll make it happen."; links About, How Ordering Works, Contact, Privacy Policy, Shipping & Returns; © 2026 Shirt Nerd XL; NO payment icons, NO "Powered by Shopify").
- 2.3 ui/: Button (lime bg, ink text, mono uppercase), Container (max-w-7xl mx-auto px-4), SectionTitle (display uppercase). Wire shell into layout. DONE-WHEN: `npm run dev` renders / with header+bar+footer; tab order sane.
### Phase 3 — pages & features
- 3.1 lib/: types.ts, catalog.ts (load data/catalog.json once; getProducts/getByHandle/getTags/getFeatured), pricing.ts (STANDARD map L-3XL 24.99, 4XL/5XL 26.99; priceForSize; fromPrice), variants.ts (strict combo lists, preference lists, bestMatchSku(product,size,color)), seo.ts (productMetadata + JSON-LD builders).
- 3.2 Home: hero (display headline + intro), featured grid (D6 via ProductCard), CTA "View all designs" → /designs, sizing band ("Every design up to 5XL"), 3-step how-requests strip (Browse → Request → We confirm & print via Gelato; link /how-ordering-works).
- 3.3 /designs: metadata; server renders ProductGrid (all 53); client CatalogControls: search input (title+tags) + tag chips (D5; syncs ?tag= via router.replace) filtering pre-rendered list client-side (card data passed as prop; no fetch).
- 3.4 /products/[handle]/page.tsx: generateStaticParams; notFound() for unknown handle. Grid: left Gallery (main + thumbs, next/image w/h from catalog, thumbs lazy, keyboard-reachable), right: title, from-price, VariantSelector, RequestForm, "requests are not purchases" note. Below: sanitized description (dangerouslySetInnerHTML descriptionHtmlSafe) + related (share ≥1 tag, 4 cards). JSON-LD Product(no offers)+BreadcrumbList. VariantSelector strict: sizes = knownCombos sizes ∩ SUPPORTED, colors = combos of chosen size; preference: SUPPORTED sizes + colorsKnown or "As pictured" + visible label "Request preference — not confirmed availability". Selection state lives in client wrapper components/ProductView.tsx which renders VariantSelector + RequestForm.
- 3.5 RequestForm (client, D9) exact copy — intro: "Interested in this design? Choose your size and color and send us a request. We'll contact you to confirm availability, shipping and payment details. No payment is collected today." | button: "Request This Shirt" | success: "Thanks! Your shirt request has been sent. We'll reach out by email with the next steps." HTML required + JS validation, per-field error text + aria-describedby, aria-live status, submit disabled while pending, honeypot `_gotcha`.
- 3.6 Support pages: /about, /how-ordering-works (browse→request→email confirm→payment arranged privately→printed & shipped via Gelato; explicit "submitting a request does not place an order or charge you"), /contact (RequestForm without product fields), /privacy-policy (+ [PLACEHOLDER — OWNER APPROVAL] for retention specifics), /shipping-returns (no binding promises; [PLACEHOLDER — OWNER APPROVAL] for rates/timeframes; ships via Gelato print-on-demand).
- 3.7 app/not-found.tsx branded (logo, /designs link, search hint, "this design may have retired" line). DONE-WHEN: `npx next build` green; manifest lists 53 product routes.
### Phase 4 — SEO & a11y polish
- 4.1 Per-route metadata: product title + description (first ~150 chars of sanitized text, fallback tagline); canonical via metadataBase; OG/Twitter card with primaryImage (absolute URL).
- 4.2 app/sitemap.ts (53 product urlPaths + /, /designs, /about, /how-ordering-works, /contact, /privacy-policy, /shipping-returns) + app/robots.ts (allow all, sitemap URL).
- 4.3 JSON-LD per D8 (Organization+WebSite home; Product without offers + BreadcrumbList product pages; ItemList on /designs optional).
- 4.4 a11y pass: skip-to-content link, focus-visible rings, aria-live form status, labelled inputs, gallery buttons with aria-current, color contrast (ink on lime, white on charcoal), mobile-first breakpoints sm/md/lg. DONE-WHEN: view-source of a product page shows canonical+og:image+JSON-LD; /sitemap.xml lists 60 URLs.
### Phase 5 — validation
- 5.1 scripts/validate.mjs: (a) 53 products; (b) every primary+gallery file exists on disk; (c) no duplicate (size,color) within knownCombos; (d) selectionMode invariants (strict ⇒ ≥1 combo size ∈ SUPPORTED); (e) displayed prices == STANDARD; (f) `grep -r cdn.shopify.com app components lib data` = 0 hits; (g) .next build manifest contains 53 product paths; (h) sitemap contains 53 product URLs. Print PASS/FAIL per gate.
- 5.2 `npx next build` then background `npx next start` (log /tmp/snxl-start.log); curl -o /dev/null -w "%{http_code}" for /, /designs, 5 sample product routes, /about, /sitemap.xml, /robots.txt → expect 200; /products/nope-nope → 404.
- 5.3 Formspree controlled test: ONE curl POST JSON to https://formspree.io/f/xoedlbzy with name "[TEST] agent validation" + product fields; expect {"ok":true}; tell owner to delete it. Only after 3.5 done.
- 5.4 Responsive/a11y spot check: reason over markup at 375/768/1440; owner visually confirms later.
- DONE-WHEN: all §6 gates pass; results appended to §8.
### Phase 6 — docs & deploy prep
- 6.1 Rewrite README.md: overview, prerequisites (node 20+), local dev (npm i, npm run dev), scripts table (optimize-images, normalize, validate, scripts/download-images.mjs), env (NEXT_PUBLIC_SITE_URL optional; Formspree endpoint constant in lib/config or formspree.ts), build/start, Vercel import steps (framework Next.js auto, build `next build`, output auto; Hobby static limit note ⇒ images pre-optimized), DNS migration checklist (lower TTL 24h ahead; add apex A/ALIAS + www CNAME to Vercel; verify cert; keep Shopify live until propagation; then cancel), pre-Shopify-cancellation checklist (image archive verified ✔; Gelato templates saved ⚠ owner; full backup incl image-masters; form tested; redirect decisions reviewed), owner task list.
- 6.2 reports/url-audit.md: 53 preserved handles (table), /collections/* redirect map, note "no excluded-URL source list was provided by owner; old product URLs not in the 53 will 404 by design with branded not-found".
- 6.3 Commit per phase; final commit; push ONLY if owner asks.
- DONE-WHEN: README accurate vs reality; `git status` clean.

## 6. Validation gates (owner brief — all must pass before "done")
1 53 pages generated · 2 routes 200 · 3 primary image visible per product · 4 galleries load · 5 variant choices valid/no dups · 6 prices follow config · 7 Formspree controlled test ok · 8 invalid form blocked · 9 sitemap+metadata present · 10 build green · 11 responsive+accessible · 12 zero Shopify CDN in prod build.

## 7. Owner-only tasks (never do these as the agent)
Save Gelato design templates · offline backup of repo + image-masters · approve [PLACEHOLDER] copy (privacy/shipping) · confirm Vercel plan (Hobby ⇒ D3 mandatory) · enable Formspree Turnstile (optional) · delete the [TEST] Formspree submission · DNS switch + Shopify cancellation (explicit approval only).

## 8. Progress Log (tick boxes; append dated lines)
- 2026-11-19 (pre-project) Image rescue complete: 557/557 images local, failed 0, 189MB.
- 2026-11-19 Plan approved incl. D1 hybrid variant mode (owner answer).
- [x] 1.1 scaffold + npm install + next build green (2026-11-19)
- [x] 1.2 move rescue script to scripts/ + root-aware paths + dry-run ok (2026-11-19)
- [x] 1.3 deps present (sanitize-html, sharp) (2026-11-19)
- [x] 1.4 optimize-images run; public < 95MB; report 557 rows (2026-11-19: 3 passes; final = ALL images WebP, ≤1400px, q68/q80 → public/products 21MB; masters in image-masters/)
- [x] 1.5 image-dims spot check vs sips (2026-11-19: jpg+png exact match)
- [ ] 1.6 normalize run; catalog.json + review-flags.json + variant-review.md; no cdn urls
- [x] 2.1 tokens+fonts in layout/globals (2026-11-19)
- [x] 2.2 Header/AnnouncementBar/Footer (2026-11-19)
- [x] 2.3 ui primitives + shell renders (2026-11-19, verified via build+start)
- [x] 3.1 lib modules (2026-11-19)
- [x] 3.2 home page (2026-11-19)
- [x] 3.3 /designs + CatalogControls (2026-11-19)
- [x] 3.4 product page + Gallery + VariantSelector (2026-11-19)
- [x] 3.5 RequestForm (2026-11-19)
- [x] 3.6 support pages (2026-11-19)
- [x] 3.7 not-found + build green w/ 53 routes (2026-11-19, build3 EXIT=0)
- [x] 4.1 metadata/canonical/OG (2026-11-19, verified in served HTML)
- [x] 4.2 sitemap+robots (2026-11-19, 60 URLs)
- [x] 4.3 JSON-LD (2026-11-19, Product no-offers + Breadcrumb)
- [x] 4.4 a11y pass (2026-11-19 markup level: skip link, labels, aria-live, aria-pressed, focus rings; owner visual check pending)
- [x] 5.1 validate.mjs all PASS (2026-11-19, 8/8 gates)
- [x] 5.2 next start curl checks (2026-11-19: 10×200 + 404 for unknown handle)
- [x] 5.3 Formspree controlled test (2026-11-19: {"ok":true}; OWNER: delete the [TEST] submission)
- [x] 5.4 responsive/a11y spot check (2026-11-19 markup review; owner visual pending)
- [x] 6.1 README rewrite (2026-11-19)
- [x] 6.2 reports/url-audit.md (2026-11-19)
- [x] 6.3 commits clean (2026-11-19)
- 2026-11-20 favicon rescued from Shopify CDN → public/favicon.png + metadata icons (commit f47cab2).
- 2026-11-20 version bumped to 2.1.0; README status/changelog added; pushed to GitHub.
- 2026-11-20 Gelato mockups exports analyzed: 11 connected designs missing from site (reports/missing-designs.md); exports saved to launch/gelato-exports/. BLOCKED on Shopify metadata (myshopify subdomain or Admin Products CSV) to build their pages.
- 2026-11-20 v2.1.1: owner delegated placeholder decisions; all [PLACEHOLDER] copy resolved with sane defaults (shipping quote-in-email + 3–5 print/2–7 delivery guidance, 14-day issue window, 24-month retention, hello@shirtnerdxl.com privacy contact). Zero placeholders remain in app code; build+validate green; pushed.
