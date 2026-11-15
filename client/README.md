# Khushi Rathore — portfolio

Next.js 15 · React 19 · Tailwind 4 · GSAP + ScrollTrigger · Lenis · OGL (WebGL)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Edit content
Everything is in `src/data/site.ts`: name, role, links, email, and the 4 projects
(title, type, stack, screenshot, live + GitHub links). Screenshots live in `public/projects/`.

## Where things are
| Part | File |
|---|---|
| Intro card: photo → paper curl → postcard (WebGL) | `src/components/IntroCard.tsx` + drawing in `src/components/postcard.ts`; text in `intro` in `src/data/site.ts` |
| Work: pinned scroll + buttons | `src/components/Work.tsx` |
| Work: bent cards + RGB split (WebGL) | `src/components/WorkCanvas.tsx` |
| Contact footer | `src/components/Contact.tsx` |
| Chai cursor | `src/components/Cursor.tsx` |
| Instant camera + polaroids (bottom-right) | `src/components/InstantCamera.tsx` — photos/captions in `polaroids` in `src/data/site.ts` |
| Stickers (SVG) | `src/components/Stickers.tsx` |
| Colours / fonts | `src/app/globals.css` (`@theme`) |

## Deploy
Vercel builds this `client/` folder and serves it at https://khushirathore.vercel.app.
Commit and push to `main` — Vercel deploys automatically.

Raw screenshots dropped into `client/projects/` are git-ignored (one is confidential);
the web-ready copies live in `public/projects/`.
