# Next Steps — ShirtNerdXL 2.0 (session handoff, 2026-11-20)

> Read this first in the next session. Full build history & decisions: `PLAN.md`.
> Current state: **site is LIVE** on Vercel at https://shirtnerdxl.com (repo `DevCabin/SNXL-static`, branch `main`, version 2.1.0, commit `c5e7eba`+). All 12 validation gates passed. Local test: `npm run build && npm start` → http://localhost:3000.

## 1. BLOCKER: 11 missing designs (top priority next session)

The owner added these designs to Shopify weeks before the launch-package snapshot, but the package's Gelato-match filter excluded them, so they never reached the site. They ARE connected in Gelato (fulfillment-ready). Full table with Gelato product IDs: `reports/missing-designs.md`; raw exports: `launch/gelato-exports/`.

1. Meta AI Generated Art Deco Skull — `07bbcf19-6664-49f7-b8bd-cf9084b95937`
2. Meta AI Art Deco Skull – White Outline against Dark Colors — `cd4e5ca5-0722-4e41-9806-84081f69143a`
3. Keyboard Warrior Tee (base) — `07f4dc8c-e5d4-4543-8d13-5947d3d68b44`
4. Artist paint splatter — `0f9d82ee-ee88-4f71-baab-1daad790b0df`
5. I'd rather die… Than Drink Decaf – Deluxe fitted Black — `1caf6038-91a9-4046-b419-b9ae2a2a68a7`
6. Bruce Lee Fist of Fury – SHIRTNERDXL Branded Tee — `414ba751-f2e7-45c3-b1d4-eafbc8f337f7`
7. Jimmy, John, Robert, John Paul – White Names on Black — `4698054b-b53e-4e6e-9d19-3c2e25790a1a`
8. Here we are now… Entertain us. Orange on Dark — `685a0800-b587-41ac-87ef-73d592870bd9`
9. Death Rock Forever! — `6a6157e3-708a-436a-8426-d0e8d3b29c57`
10. Jimmy, John, Robert, John Paul – Black Text on White Tee — `8e98d6f2-d61d-4fcb-920e-dc62e090cfa4`
11. Here we are now… Dark text on Light shirts — `f435012c-52c6-4fa8-ba01-4c9682358313`

**What's missing to build them:** images, descriptions, tags, variants, prices, handles. The Gelato CSVs have only ID+title. Wayback Machine has NO captures of these pages (checked; also rate-limited). `shirtnerdxl.com/products.json` is gone (domain now serves the Next.js site). Shopify is still alive on its `*.myshopify.com` subdomain until the owner cancels.

**Unlock options (owner must provide ONE):**
- a) the `*.myshopify.com` subdomain (from Shopify admin URL bar) → I fetch `https://<sub>.myshopify.com/products.json?limit=250`;
- b) Shopify Admin → Products → Export → "All products" CSV dropped into `launch/`;
- c) regenerated launch-style package including the 11.

**Pipeline once data arrives (in order):**
1. New `scripts/import-shopify.mjs`: convert source → rescue schema (`handle,title,descriptionHtml,vendor,type,tags,status,gelato:{productId},images[{url,sourceUrl,alt}],variants[{sku,options,price,imageUrl,sourceImageUrl}],urlPath`); include ONLY the 11 handles (match by title/handle against the table); attach Gelato IDs from the table above.
2. Extend `scripts/download-images.mjs` with `--input=<file> --output=<file>` flags (defaults unchanged) → download new images into `public/products/<handle>/`.
3. `npm run optimize-images` (picks up new files automatically; masters → `image-masters/`).
4. Extend `scripts/normalize-catalog.mjs` to merge multiple source files → `data/catalog.json` becomes 64 products; regenerate review flags.
5. Optional bonus (recommended): live Shopify data has real variant option values → backfill the option gap on the original 53 by SKU join, converting most "preference" products to strict exact-combo selectors. No invented data.
6. `npm run build && npm run validate` (update expected product count 53→64 in validate.mjs gate a/g), curl spot-checks, commit, push → Vercel auto-deploys.
7. Update README changelog (2.2.0), PLAN log, `reports/missing-designs.md` (mark resolved), sitemap auto-updates.

## 2. Pending OWNER tasks (unchanged)
- Delete the `[TEST] agent validation` Formspree submission.
- ~~Approve `[PLACEHOLDER]` copy~~ DONE 2026-11-20 (v2.1.1, owner delegated; agent decisions): shipping quoted in confirmation email (3–5 biz-day print + 2–7 US delivery guidance), 14-day issue window, 24-month retention, privacy contact = `hello@shirtnerdxl.com`. **Verify that mailbox exists/forwards** — if not, update `app/privacy-policy/page.tsx`.
- Save Gelato designs as reusable templates (especially the 11 above before taking requests).
- Offline backup: repo + `image-masters/` (full-res originals live ONLY there).
- Optional: larger favicon master (current `public/favicon.png` is 59×59 from Shopify CDN); enable Formspree Turnstile.
- DNS/Shopify cancellation already done for DNS (site live); Shopify cancel still pending owner.

## 3. Nice-to-haves parked (only if owner asks)
- Featured-grid tweaks (`data/config.ts` FEATURED_HANDLES) once the 11 land.
- Tag chips: consider hiding `BuiltWithAi` from public filters if owner prefers.
- 301 redirects for retired old-shop URLs if owner ever supplies the old sitemap (`reports/url-audit.md`).

## 4. Environment gotchas for the next agent
- Terminal CRASHES on long heredoc/printf commands → write files with the editor tool; keep shell commands short; background long jobs with logs in /tmp and poll with `tail`.
- Inline `python3 -c "..."` multi-line often mangles → write /tmp/x.py via editor, then run.
- `curl -o` is blocked in plan mode; allowed in act mode.
- Never hand-edit `data/catalog.json` / `data/review-flags.json` (generated). Never invent variant options/prices. Never touch DNS/Shopify.
- Vercel Hobby static-upload cap 100MB/deployment → always run optimize-images before adding images (currently 21MB, plenty of headroom for ~11 more products).
