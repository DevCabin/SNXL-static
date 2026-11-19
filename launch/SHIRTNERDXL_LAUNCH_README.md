# ShirtNerdXL — Clean launch catalog

This handoff contains **only 53 active Shopify products** that matched the Gelato **connected-product** exports and had at least one Shopify image URL and at least one positive-priced variant.

## Included files
- `shirtnerdxl_launch_catalog.json`: full product metadata, original Shopify handle and `/products/{handle}` path, HTML description, list of image URLs, Gelato product ID and variant options/prices.
- `shirtnerdxl_launch_products.csv`: flat product summary.
- `shirtnerdxl_launch_variants.csv`: one row per variant with price, size/color when available, SKU, variant image URL.

## Important constraints
- Images in this package are **source URLs only**. Before disconnecting Shopify, download, test and host the referenced images yourself. An existing URL is not proof that the image will still work later.
- Prices are **original Shopify export prices** ($24.99–$32.99), NOT normalized to a new pricing rule. Confirm desired customer-facing prices separately.
- Gelato connected-product status is supported by the supplied three connected-product exports; this does not prove that a design has been saved as a reusable template.
- Do not advertise automatic fulfillment. Use Formspree for *requests*, not orders or payments. Do not solicit payment-card details in Formspree.
- No drafts, unverified, or unconnected products are present in these files. Do not re-import them in the site build.
- Preserve handles for existing SEO paths. Sanitize product HTML before rendering on the website.
