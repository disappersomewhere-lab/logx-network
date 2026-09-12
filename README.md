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
| Rendered PDF datasheets | `npm run import-datasheets` | `public/datasheets/<PART>.pdf` |
| LOGX price list (`.xls`) | `npm run import-products` | `data/products.json` |
| Original product photography | `npm run build:images` | `public/products/photos/*.webp`, link-preview cards |
| `app/icon.svg` | `npm run build:icons` | `app/favicon.ico`, `app/apple-icon.png` |

```bash
npm run build:catalog   # datasheets → products → images, in that order
```

The order matters once: `import-products` records which parts have a datasheet by
looking in `public/datasheets/`, so the datasheets must be imported first. Both importers
read the price list through `scripts/price-list.mjs`, which is the one place the excluded
part numbers live.

### Datasheets

The per-part A4 sheets are rendered by a separate PowerShell tool (documented in
`README-DATASHEETS.md` beside the price list's original folder) as `NNN_PARTNUMBER.pdf`.
`import-datasheets` drops the numeric prefix so the URL is the part number, refuses to copy a
sheet whose part is not in the price list (so a removed product's PDF can never become a live
URL), and removes copies whose product has gone. A `+` in a part number becomes `-plus` in
the filename. The copies are committed — 64 sheets, about 42 MB — so a clone serves them
without the generator.

Two known gaps, both inherited from the generator: the RJ45 boot (`LXCPPTC6`) has no sheet,
and the sheets predate the current photography, so some carry the placeholder images the
generator's README describes. Regenerating them with the photos in
`public/products/photos/` would fix that and, with JPEG rather than raw bitmaps, shrink
them considerably.

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
  printed LOGX reads horizontally.
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

The originals are large and stay out of the repository (see `.gitignore`) — the processed
WebP files are committed, so a clone builds without them. You only need the source folder to
regenerate the imagery.

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
