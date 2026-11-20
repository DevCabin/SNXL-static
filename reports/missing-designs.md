# Missing designs report (2026-11-20)

Source: owner-supplied Gelato "bulk update product mockups" exports
(`launch/gelato-exports/gelato-mockups-export-*.csv`, 64 unique Gelato product IDs).
Cross-checked against `data/catalog.json` `gelatoProductId` (53 ids).

**Result: 11 Gelato-connected designs are NOT on the live site.** All 53 published
designs ARE present in the Gelato exports (0 orphans), so fulfillment references
for the current catalog are complete.

The Gelato exports contain only Product ID + Title — no images, descriptions,
tags, variants or prices. Building pages for these 11 requires a Shopify source
(myshopify storefront JSON or Admin Products CSV export).

| Gelato product ID | Title | On site? |
|---|---|---|
| 07bbcf19-6664-49f7-b8bd-cf9084b95937 | Meta AI Generated Art Deco Skull | NO |
| 07f4dc8c-e5d4-4543-8d13-5947d3d68b44 | Keyboard Warrior Tee | NO |
| 0f9d82ee-ee88-4f71-baab-1daad790b0df | Artist paint splatter | NO |
| 1caf6038-91a9-4046-b419-b9ae2a2a68a7 | I'd rather die ... Thank drink decaf - in Deluxe fitted Black | NO |
| 414ba751-f2e7-45c3-b1d4-eafbc8f337f7 | Bruce Lee Fist of Fury - SHIRTNERDXL Branded Tee | NO |
| 4698054b-b53e-4e6e-9d19-3c2e25790a1a | Jimmy, John, Robert, John Paul - White Names on Black | NO |
| 685a0800-b587-41ac-87ef-73d592870bd9 | Here we are now... Entertain us. Orange on Dark | NO |
| 6a6157e3-708a-436a-8426-d0e8d3b29c57 | Death Rock Forever! | NO |
| 8e98d6f2-d61d-4fcb-920e-dc62e090cfa4 | Jimmy, John, Robert, John Paul - Black Text on White Tee | NO |
| cd4e5ca5-0722-4e41-9806-84081f69143a | Meta AI Generated Art Deco Skull - White Outline against Dark Colors | NO |
| f435012c-52c6-4fa8-ba01-4c9682358313 | Here we are now ... Dark text on Light shirts | NO |

Notes:
- These were excluded by the original launch-package filter ("matched the Gelato
  connected-product exports" snapshot timing), not lost by the site build.
- Several are siblings of live designs (color/fit variants): decaf Deluxe fitted
  Black, Art Deco Skull white-outline, "Here we are now" light-shirt version,
  Keyboard Warrior base vs "Battle Ready Comfort", Bruce Lee branded vs
  "on light colors".
- Wayback Machine has no captures of these product pages (checked 2026-11-20;
  archive also rate-limited), so reconstruction from archives is not possible.
- Once Shopify metadata arrives: import → download images → optimize → normalize
  merge → rebuild → validate → push. Attach the Gelato IDs above as
  `gelatoProductId` so fulfillment references stay complete.
