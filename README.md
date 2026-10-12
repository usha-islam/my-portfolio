# Usha - Software QA Engineer Portfolio

A responsive portfolio built with React, Vite and JavaScript. Website content and project documentation are in English.

## Run locally

Open a terminal in the project folder. Install dependencies if you have not already done so:

```powershell
npm.cmd install
```

Start the development server:

```powershell
npm.cmd run dev
```

Open the Local URL printed in the terminal, usually http://localhost:5173/. If that port is occupied, Vite chooses another port. Press Ctrl+C in the server terminal to stop it.

On Windows PowerShell, using `npm.cmd` avoids execution-policy restrictions on `npm.ps1`. On other shells, you can use `npm` instead.

## Update content and links

- `src/data.js`: profile information, skills, experience, projects, certificates and links.
- `src/App.jsx`: reusable page components, navigation and section rendering.
- `src/App.css` and `src/index.css`: layout, shared theme colours and animations.
- `public/`: static assets, including the resume and tool logos.

## Resume download

The resume is stored at `public/Usha_SQA_Resume.pdf`. Download buttons use `/Usha_SQA_Resume.pdf` with the download attribute.

To update the resume, replace the PDF using the same filename and refresh the local page. Rebuild and redeploy after replacing it on a published site. Changing the filename also requires updating the resume URL in `src/data.js`.

## Static assets

Place static images and other assets in `public/`. Browser URLs must omit `/public/`; for example, `public/photo-hd.jpg` is available at `/photo-hd.jpg` when the site is hosted at the root. Use Vite's base URL when supporting a deployment under a subdirectory. Tool logo sources are documented in `public/tool-logos/SOURCES.md`.

## Build and checks

- `npm.cmd run build`: create the production build in `dist/`.
- `npm.cmd run lint`: run code checks.
- `npm.cmd run preview`: serve the production build locally after building it.

The portfolio uses a neutral slate-and-blue palette with light and dark themes, responsive navigation and active-section highlighting. Contact actions include email, Copy Email, WhatsApp and resume download. The hero's Let's Connect button opens LinkedIn. Professional project visuals illustrate general QA processes. Personal Practice projects retain their repository links. The About section has been removed.

Animations respect reduced-motion preferences, and entrance animation setup leaves content visible if it fails. The tool strip pauses on hover or keyboard focus and becomes a static wrapping row with reduced motion. Google Fonts have system-font fallbacks.

## Browser verification

The `scripts/` folder contains local browser checks, including `check-ui.mjs`, `check-responsive.mjs`, `check-polish.mjs` and `check-articles.mjs`.

These scripts expect a development server at `http://127.0.0.1:5173/` and an Edge or Chrome debugging browser on port `9223`. Open the portfolio in that browser before running a script, for example:

```powershell
node scripts/check-ui.mjs
```

Screenshots are saved to the system temporary folder. These scripts are optional and are not required to run the portfolio.

## QA articles

Edit `src/content/qa-articles.md` to update the six articles. Keep the numbered top-level article headings, **Excerpt:** and **Tags:** metadata; source order determines card and Previous/Next order. Titles are displayed without numbering. Reading time uses article word count at 200 words/minute. Markdown tables are supported; raw HTML is skipped.

The dedicated listing page uses `#/articles` (legacy `#articles` links also open it). Articles are absent from the homepage. Each article uses a `#/articles/<title-slug>` URL compatible with static hosting. Article slugs are fixed in `src/articles.js`, so changing a title preserves its URL. Components and styles live in `src/Articles.jsx` and `src/Articles.css`; parsing lives in `src/articles.js`.

With the dev server at port 5173 and a debugging browser at port 9223, run `node scripts/check-articles.mjs` to verify source preservation, all readers, responsive themes, refresh, history and section navigation.
