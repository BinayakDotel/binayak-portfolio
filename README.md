# Binayak Dotel: portfolio

Personal site. Next.js (app router, static export) deployed to GitHub Pages at
https://binayakdotel.github.io/binayak-portfolio

## Run it

```bash
npm ci
npm run dev      # http://localhost:3000/binayak-portfolio
npm run build    # static site in ./out
```

## Change the content

All text lives in `src/data/portfolio.json`: the hero, projects, experience, skills and the
ready-written answers for "Ask me". Types are in `src/lib/content.ts`.

- A new project needs an entry in `projects`. Its illustration is chosen by `id` in
  `src/components/ProjectArt.tsx`; unknown ids get the default one.
- A new "Ask me" question is an entry in `qa`. `keywords` decide which question a typed
  question matches.
- The resume link points at `public/Binayak Dotel Resume.pdf`. Replace that file to update it.

## Design

Forest theme, light and dark. Colours are tokens at the top of `src/app/globals.css`
(`:root` for light, `:root[data-mode="dark"]` for dark). The mode is set before first paint by
the script in `src/lib/mode.ts`, saved in `localStorage` as `bd-mode`, and follows the system
setting until the visitor picks one.

Press `/` or `Ctrl K` (`⌘ K` on Mac) for the command bar.

## Pages

`/`, `/work/`, `/work/<project>/`, `/experience/`, `/skills/`, `/ask/`, `/contact/`.
The home page shows every section; each section also has its own URL.
