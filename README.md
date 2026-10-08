# LOGX NETWORK

Bilingual (English / Arabic) product catalogue for LOGX connectivity products, built with
Next.js 16, React 19 and next-intl.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/en` or `http://localhost:3000/ar`.

## Catalogue pipeline

The catalogue is generated from two sources, and both steps are reproducible:

| Source | Command | Output |
| --- | --- | --- |
| LOGX price list (`.xls`) | `npm run import-products` | `data/products.json` |
| Original product photography | `npm run build:images` | `public/products/photos/*.webp`, link-preview cards |
| Family engineering content | `npm run import-family-content` | `data/families.json` |
| The built datasheet pages | `npm run build:datasheets` | `public/datasheets/<PART>.pdf` |
| `app/icon.svg` | `npm run build:icons` | `app/favicon.ico`, `app/apple-icon.png` |

```bash
npm run build:catalog   # products → images
```

Both the product importer and the datasheet generator read the price list through
`scripts/price-list.mjs`, which is the one place the excluded part numbers live.

### Datasheets

Every part with authored engineering content has a datasheet **page** at
`/[locale]/products/<slug>/datasheet` — an A4 technical sheet built from
[data/families.json](data/families.json) (description, standards, features, applications,
specification and characteristic tables, ordering information) and the part's own
photograph. The sheet is an English document regardless of the site locale, as vendor
datasheets conventionally are; only the toolbar around it is localised. `/[locale]/datasheets`
lists every sheet by family.

The **PDF** is that same page printed by headless Edge/Chrome, so what a customer downloads
is exactly what they saw. Regenerate after changing content, photography or the sheet's
layout:

```bash
npm run build              # the sheets are pages, so the site must be built first
npm run build:datasheets   # starts the built site, prints every sheet, shuts it down
```

The generator finds Edge or Chrome on its own (set `BROWSER_PATH` to override), renders
three sheets at a time, and refuses to delete existing PDFs if any render fails. The pages
show each PDF's size, read from disk at build time, so a local preview built *before*
generating shows no download button until you build again; a deploy build always sees the
committed files. All 64 sheets fit on one page — the fibre patch cord family (24 lengths)
does so by laying its ordering table out as two side-by-side halves.

`data/families.json` is the file to edit for copy changes; `import-family-content` only
re-imports it from the original generator's catalogue. The RJ45 boot (`LXCPPTC6`) has no
authored content and therefore no sheet.

### Photography

`scripts/build-images.mjs` reads the original photographs from `logx oreginal image/`
and writes uniform 1400×1400 WebP catalogue assets. For each photo it applies the EXIF
rotation, decides whether the shot sits on a seamless backdrop or in-situ, and then either

- neutralises the backdrop's colour cast, lifts it to white, trims the dead space and pads
  the product back to square; or
- keeps the scene and squares it off around the subject.

`scripts/photo-map.mjs` maps part numbers to photographs, **keyed by filename**. It also
carries two per-photo corrections:

- `rotations` — extra rotation for originals shot on their side or upside down, so the
  printed LOGX reads horizontally. After a re-shoot, check each bag against a 0/90/180/270
  contact sheet of the EXIF-oriented original; a value carried over from the old shoot can
  leave the logo upside down.
- `crops` — a fractional crop for in-situ shots, framing the product so the warehouse behind
  it falls outside the frame. A cropped photo is fitted and padded rather than re-cropped
  square, which would zoom into a fragment of a wide subject like the PDU.

Background *cutout* is deliberately not attempted. These products are dark and the blurred
racking behind them contains regions darker still, so no luminance threshold separates the
two without eating the product or keeping half the shelf; cropping is the honest tool.

Where a photograph shows a legible part-number label it is assigned to that exact part;
families without their own labelled shot reuse an unlabelled photograph of the same product
line rather than a mismatched label. Every run writes `data/photo-sources.json` recording
which original file produced which asset, and a mapped file that is missing from the source
folder fails the run rather than silently leaving a product without photography.

The CAT6A U/UTP bulk-cable product uses the supplied product photo committed at
`scripts/product-art/cat6a-u-utp-box.png`. The CAT6A S/FTP product uses the committed CAT6
photo only as a clearly labelled reference because no exact S/FTP photo is available; it is
omitted from that product's structured data and must not be presented as an exact product
photo.

The CAT6 U/UTP bulk-cable product uses original LOGX catalogue artwork from
`scripts/product-art/bulk-cable-cat6.svg`, depicting the 305 m pull box and the cable.

The large original photo shoot stays outside the repository (see `.gitignore`). Compact
artwork and supplied product-photo sources under `scripts/product-art/` are committed, as
are the processed WebP files, so a clone can build the site without the original photo folder.
That folder is only needed to regenerate the full image library.

### Product lines and where photographs appear

Parts that are one product in different sizes share a **product line**
([lib/groups.ts](lib/groups.ts)): twelve patch-cord lengths are one card with a "12 part
numbers" badge, not twelve cards with the same picture. The catalogue shows lines by default
(with a toggle to every part number), and a product page lists its line's part numbers in a
table instead of repeating the photograph as "related" cards. `coverOverride` picks the frame
that stands for a line when its first part's own frame is weak.

The home page shows each line at most once: the hero spends one, and `pickLines` deals the
rest to the systems tabs around it. Scene photographs (hero, systems) come from the catalogue
artwork in `public/profile/` or a real LOGX shot; nothing generic is shown as a LOGX product.

### Site chrome

[components/SiteHeader.tsx](components/SiteHeader.tsx) is a utility bar over a sticky main bar
with a Products mega menu and a search drawer; the mega-menu shortcuts are in
[lib/nav.ts](lib/nav.ts) and each one opens the catalogue filtered to a category and
pre-filled with a search term in that language. The home page's story hero is
[components/HeroCarousel.tsx](components/HeroCarousel.tsx). Styles for both, and for the home
modules, are in [app/site.css](app/site.css), loaded after `globals.css`.

### Company profile

`/[locale]/company-profile` is a four-page bilingual brochure — cover, about &
mission, product range, offices — built from the same site content (no
separate copy to maintain) and linked from the About page and footer. Like
the datasheets, the PDF is that page printed by headless Edge/Chrome:

```bash
npm run build                    # the profile is a page, so build first
npm run build:company-profile    # renders public/company-profile/LOGX-Company-Profile-<locale>.pdf
```

### Product data

The price list is committed at `data/source/Logx product's.xls` — it holds only descriptions
and part numbers, no prices — so a fresh clone can regenerate the catalogue. Edit that file in
Excel, then rebuild:

```bash
npm run import-products
```

`scripts/import-products.mjs` matches each part number to a builder that produces a
bilingual title, summary and specification table, and keeps the verbatim spreadsheet text
on every record as `raw`. To import a workbook from somewhere else instead, pass its path:

```bash
npm run import-products -- "path/to/other-list.xls"
```

A part number that no builder claims still appears in the catalogue, using the spreadsheet
text, and the import logs a warning — so a new SKU is never silently dropped, and the warning
tells you a builder is needed.

Review the generated [data/products.json](data/products.json) before publishing.

## Icons

`app/icon.svg` is the source of truth for the mark. `npm run build:icons` derives
`favicon.ico` (16/32/48) and `apple-icon.png` (180, flattened onto the brand ink because iOS
ignores transparency). Re-run it after changing the SVG.

## Security headers

Set in [next.config.ts](next.config.ts) and applied to every route. The Content-Security
Policy allows `'unsafe-inline'` for scripts and styles because Next injects inline bootstrap
code and there is no nonce plumbing; the rest of the policy still constrains where scripts,
frames, forms and connections may point. Development additionally allows `'unsafe-eval'` and
`ws:` for Turbopack's hot-reload socket. Tightening the script policy means threading a nonce
through the proxy — worth doing, not done here.

## Quote requests

The contact form posts to `/api/quote` and sends through Resend. Set these values in
`.env.local` and in the hosting provider:

- `NEXT_PUBLIC_SITE_URL`: canonical public URL
- `RESEND_API_KEY`: Resend API key
- `RESEND_FROM_EMAIL`: sender on a verified domain
- `CONTACT_EMAIL`: sales inbox

Without these values the API intentionally returns a configuration error rather than silently
dropping enquiries.

## Checks

```bash
npm run lint
npm run build
```

The build prerenders every product page in both locales as static HTML, plus `sitemap.xml`
and `robots.txt`. Static rendering depends on `setRequestLocale()` being called in each
localized layout and page — without it next-intl falls back to rendering on demand.

## Search and social

The production domain is **logxnetwork.com**, declared once as `productionUrl` in
[lib/site.ts](lib/site.ts).

`NEXT_PUBLIC_SITE_URL` is read at **build** time — canonical links, hreflang, Open Graph
images, `sitemap.xml` and `robots.txt` are all absolute URLs. A production build with it
unset falls back to the production domain and warns, so a build can never ship
`localhost`. Set it explicitly anyway on **preview and staging** deployments: left unset
there, they publish canonical links pointing at the live site and ask search engines to
index production in their place.

Every page carries `en`, `ar` and `x-default` alternates via `alternatesFor()` in
[lib/site.ts](lib/site.ts). Use it in each page's `generateMetadata` rather than writing
`alternates` by hand: Next replaces whole metadata fields, so a page returning
`alternates: {canonical}` silently drops the `languages` map inherited from the layout.

Link previews use dedicated 1200×630 rasters generated by `npm run build:images` —
`public/og-default.png` for the site and `public/products/photos/<family>-og.jpg` per
product family — because WhatsApp and LinkedIn do not reliably render the WebP used on the
page itself. The default card is referenced explicitly from the root layout rather than
through the `opengraph-image` file convention, which is dropped once a layout declares its
own `openGraph` object.

## Deployment checklist

1. Verify the production domain and DNS.
2. Verify the sender domain in Resend.
3. Configure all environment variables.
4. Review imported product data, claims, images, privacy policy and terms.
5. Run the build in CI and test `/en`, `/ar`, `/en/products`, `/en/contact`, `/sitemap.xml`
   and `/robots.txt`.
