# Karl Daven Talib — Portfolio

Full-stack developer focused on **AI, automation and integrations**.

**Live:** https://kahariel.github.io/

A single scrolling page: intro, selected work, experience, stack, about and contact.

Plain HTML, CSS and JavaScript — no build step, no dependencies. Follows the visitor's light or dark theme.
Colours, corner radius and the font (Manrope, self-hosted) are variables at the top of [`css/style.css`](css/style.css).

## Editing content

Everything the site says lives in [`js/content.js`](js/content.js): intro, headline numbers,
experience, projects, skills and links. A link or image left as `null` shows on the page as a
dashed placeholder, so it's easy to see what's missing.

- Project screenshots → off (confidential work). Every project's `image` is `null`, which gives a text-only card.
- Featured projects → `featured: true` gives a project a full-width row; the rest go in the grid.
- Résumé → add the PDF to `assets/` and set `links.resume`.
- GitHub / LinkedIn → set `links.github` / `links.linkedin`.

## Shareable links

| Link | Opens |
|---|---|
| `/#experience`, `/#stack`, `/#about`, `/#work`, `/#contact` | that section |
| `/#work/syncro`, `/#work/syncro-hub`, … | a specific project card |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Layout

| File | What it does |
|---|---|
| `js/content.js` | all copy and data |
| `js/site.js` | builds the page from the content; copy buttons, screenshot zoom, nav highlight |
| `js/icons.js` | brand icons shown on technology tags (Simple Icons, CC0) |
| `js/analytics.js` | optional privacy-friendly analytics |
| `js/util.js` | small helpers |
| `css/style.css` | all styling, including dark theme and mobile |

Deployed with GitHub Pages from the `main` branch.
