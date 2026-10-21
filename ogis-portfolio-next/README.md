# Ogis Creatives portfolio

David's portfolio, built as a macOS Tahoe-style desktop: Liquid Glass windows, a Dock, Finder, and apps for Services, Career, projects, Mail and Terminal.

## Run it

Use Node 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Change the content

All the text lives in [`src/data/portfolio.ts`](src/data/portfolio.ts): your details, the three services, the nine workplaces, clients, training, skills and projects. Edit that file and the whole site updates. Nothing else needs to change for content edits.

## How it's put together

| Folder | What's inside |
| --- | --- |
| `src/app` | The Next.js page, layout (title and social preview text) and all the CSS in `globals.css` |
| `src/data` | Everything a visitor reads |
| `src/lib/icons.ts` | The SVG icons and tinted folder artwork |
| `src/components/desktop` | The desktop itself: menu bar, Dock, desktop icons, window frame, Spotlight, lock screen, wallpaper |
| `src/components/apps` | One file per window: Finder, Services, Career, projects (and their mock-ups), Résumé, Mail, Terminal, About |

`DesktopContext.tsx` keeps track of which windows are open, which one is in front and which are minimized. `useApps()` in the same file is the one place that knows how to open each window, so icons, menus, Spotlight and Terminal all share it.

## Deploy

The page is static, so any Next.js host works. On Vercel: push this folder to GitHub, import the repository at vercel.com/new, and accept the defaults.

To check a production build locally:

```bash
npm run build
npm run start
```
