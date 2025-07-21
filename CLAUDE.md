# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

### Note on Testing
No testing framework is currently configured. Before adding tests, you'll need to set up a testing framework like Jest, Vitest, or React Testing Library.

## Architecture Overview

### Application Type
Memento Mori Calendar - A life visualization tool that displays a person's life as a grid of weeks, with filled squares representing weeks lived. Uses the concept of "remember your death" to help users focus on what matters.

### Key Technologies
- Next.js 13 with App Router
- React 18 with TypeScript
- Material-UI (MUI) with Emotion styling  
- Local storage for data persistence
- CSS Variables for theming

### State Management Architecture
Uses React Context pattern with `BaseContext.tsx` for global state:
- `birthdate` - User's birth date (persisted in localStorage)
- `lifeExpectancy` - Expected lifespan in years
- `lifeEvents` - Array of significant life events with dates/colors
- `totalWeeksInLife` - Calculated total weeks based on life expectancy

Access via `useBaseContext()` hook throughout components.

### Core Calendar Logic
- Uses constant `WEEKS_PER_YEAR = 52.1429` for calculations
- Grid visualization: 12 months × 4 weeks per year block
- Week states: lived (filled), remaining (empty), before birth (invisible)
- Located in `app/functions.ts` for date calculations

### Component Structure
- `lib/index.tsx` - Main app composition
- `lib/components/Calendar.tsx` - Core calendar grid rendering
- `lib/components/YearBlock.tsx` - Individual year visualization
- `lib/components/SettingsDialog.tsx` - User settings interface
- `lib/components/Stats.tsx` - Life statistics display
- `lib/components/LifeEvents.tsx` - Life events management (feature appears incomplete)

### Dual Implementation
The repository contains both:
1. Next.js React application (main implementation)
2. `simple/memento_mori.html` - Standalone HTML version

### Styling System
Uses CSS Variables in `app/globals.css` for comprehensive theming. Components use MUI with Emotion for styling. Print-optimized for A4 portrait format.

### Current Branch Context
- Working branch: `sb-node-20` (recent Node.js 20 upgrade)
- Main branch: `master` (use for PRs)
- Deployed on Vercel: https://memento-mori-calendar.vercel.app/