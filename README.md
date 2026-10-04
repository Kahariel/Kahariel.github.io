# Karl Daven Talib — Portfolio

Full-stack software engineer focused on **AI, automation and system design**.

**Live:** https://kahariel.github.io/

An interactive, map-style portfolio: drag to move, scroll or pinch to zoom, or take the guided tour.
A plain list version is one click away ("List view") for anyone who just wants the facts.

Plain HTML, CSS and JavaScript — no build step, no dependencies.

## Editing content

Everything the site says lives in [`js/content.js`](js/content.js): bio, experience, projects,
skills, links and the tour captions. Any value left as `null` shows on the page as a dashed
placeholder, so it's easy to see what's missing.

- Project screenshots → put images in `assets/` and set each project's `image` (demo data only).
- Résumé → add the PDF to `assets/` and set `links.resume`.
- GitHub / LinkedIn → set `links.github` / `links.linkedin`.

## Shareable links

| Link | Opens |
|---|---|
| `/#experience`, `/#stack`, `/#about`, `/#work`, `/#contact` | that section |
| `/#work/syncro`, `/#work/one-shot-imaging`, … | a specific project card |
| `/#plain` | the list view |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Layout

| File | What it does |
|---|---|
| `js/content.js` | all copy and data |
| `js/main.js` | where each section sits on the map |
| `js/plane.js` | the pan / zoom camera and minimap |
| `js/erosion.js` | the particle name |
| `js/scraps.js` | draggable experience cards |
| `js/signal.js` | the stack network |
| `js/zones.js` | markup for each section |
| `js/nav.js` | shareable links, copy buttons |
| `js/tour.js` | the guided tour |
| `js/plain.js` | the list view |

Deployed with GitHub Pages from the `main` branch.
