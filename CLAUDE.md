# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run the Vitest suite once
- `npm run test:watch` - Run Vitest in watch mode

**Never run `npm run build` while `npm run dev` is running.** They share `.next`, and the build leaves the dev server serving a broken bundle: the page still renders its server HTML, but no client chunk loads and everything behind `HydrationGate` silently disappears. It looks exactly like a hydration bug and isn't. Recover with `pkill -f "next dev"; rm -rf .next`.

## Testing

Vitest + React Testing Library, configured in `vitest.config.ts` / `vitest.setup.ts`. Tests live next to the code as `*.test.ts(x)`.

`vitest.setup.ts` pins `process.env.TZ = 'Asia/Tokyo'` on purpose. Date handling here is timezone-sensitive, and a positive-offset zone is where the old `toISOString`-based code silently shifted dates by a day. Don't remove it.

CI (`.github/workflows/ci.yml`) runs lint, `tsc --noEmit`, tests and build on every PR.

## Architecture Overview

### Application Type

Memento Mori Calendar - a life visualization tool that draws a life as a grid of squares, filled squares being time already spent. Deployed at https://memento-mori.skylarbolton.com/.

### Key Technologies

- Next.js 13 with App Router
- React 18 with TypeScript
- Material-UI (MUI) with Emotion, themed to match the page in `lib/theme.ts`
- Local storage for persistence
- CSS variables for theming

### State Management

React Context in `context/BaseContext.tsx`, read through `useBaseContext()`:

- `birthdate`, `lifeExpectancy`, `lifeEvents` — persisted to localStorage
- `totalWeeksInLife` — derived from `lifeExpectancy`
- `isFirstVisit` — read once during the first render, before `useLocalStorage` writes its default back

`use-local-storage`'s cross-tab sync hands back `undefined` when another tab clears a key, whatever its type parameter says, so every read of a stored value has to survive `undefined`.

### Core Calendar Logic

All date maths lives in `app/functions.ts`.

- A month is drawn as four squares, so a "week" here is a quarter-month; `SQUARES_PER_MONTH = 4` and `WEEKS_PER_YEAR = 52.1429`
- `getSquareEndDate` is the single source of truth for which days a square covers. `getWeekIdFromDate` is defined against it rather than recomputing boundaries, so the two can't drift and strand a life event on the wrong square
- A square is lived once its last day has fully passed (`squareEnd < startOfDay(now)`)
- Squares before the birthdate get both `filled` and `invisible`, so the CSS fill rules must keep their `:not(.invisible)`
- All date parsing and formatting is local-time via `localDate`, never `toISOString`, and never the bare `Date` constructor for a year under 100 (it reads 0002 as 1902)

### Layout

The calendar is grouped into decade rows: ten `YearBlock`s per `.decade`, with the age and starting year in the left margin. Cell size is one `clamp()` in `app/globals.css` that everything else derives from, so there are no responsive breakpoints. The current week is the only element on the page with an accent colour.

### Component Structure

- `lib/index.tsx` - app composition; the settings-derived subtree sits inside `HydrationGate`
- `lib/components/HydrationGate.tsx` - defers localStorage-derived UI until after mount. Anything that doesn't depend on saved settings should stay outside it so it still renders server-side
- `lib/components/Calendar.tsx` - decade rows, life-event mapping
- `lib/components/YearBlock.tsx` - one year of squares
- `lib/components/SettingsDialog.tsx` - settings and life-event editing
- `lib/components/Stats.tsx` - the ledger
- `lib/components/LifeEvents.tsx` - the life-event list

### Fonts

`app/fonts/` holds the woff2 files, loaded with `next/font/local` in `app/layout.tsx`.

**Do not switch to `next/font/google`.** It downloads the fonts from `fonts.gstatic.com` during `next build`, which once failed a production deploy with `ETIMEDOUT`. See `app/fonts/README.md` for how to add one.

### MUI and CSS specificity

MUI injects its component styles at runtime, after `globals.css`, at the same specificity. A plain class rule loses to it — this has bitten both `color` and `position` on the corner controls. Style MUI components through the theme or `sx`, not `globals.css`.

### Styling

CSS variables in `app/globals.css`. Print-optimized for A4 portrait; decades, the ledger and the quote don't split across pages.
