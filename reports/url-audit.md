# URL audit — migration decisions

Generated 2026-11-19 by the migration agent.

## Preserved URLs (53)
All launch-catalog handles are preserved exactly at `/products/{handle}` (static-generated, in `sitemap.xml`). The authoritative list is `data/catalog.json` → `products[].urlPath`. No handle was renamed, merged, or redirected.

## Old collection URLs → redirects
`next.config.ts` redirects (302, review after launch):
- `/collections/:slug` → `/designs?tag=:slug`
Old nav collections (funny, sci-fi, gamer, random) therefore land on the equivalent tag filter. Any other legacy collection slug lands on `/designs?tag=<slug>` which shows an empty-state message — acceptable, no fake content.

## Excluded Shopify URLs
**No excluded-URL source list was provided by the owner**, so a full retirement report cannot be generated. Observed on the old site (screenshots) but NOT present in the 53-product launch catalog — decision: **retire (branded 404, no redirect)**, since exact old handles are unknown and inventing them would be fabrication:
- "Whatever." unisex heavy cotton tee
- "He Doesn't Care About Your Excuses" T-shirt
- Body by Bacon — unisex heavy cotton tee
- Chill Pepper T-shirt
- The Brain That Wouldn't Die — premium horror classic tee
- Smile! Make Your Enemies Wonder What You're Up To
- Introvert — 1997 — perfect gift for introverts
(If the owner supplies the old sitemap or product export, re-run this audit and convert retirements into 301s where SEO value justifies it.)

## Missing product URLs at runtime
Unknown `/products/*` handles render the branded 404 (`app/not-found.tsx`) with catalog/search links. There is deliberately **no** catch-all redirect to the homepage.
