# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ageless Table (逆龄餐桌)** is a knowledge-grounded, multi-agent anti-aging nutrition analysis engine. It translates food ingredients into interpretable longevity pathway impacts (mTOR, AMPK, Sirtuin, chronic inflammation) and provides actionable daily nutrition decisions.

This is a **mobile-first Vue 3 prototype** demonstrating the product loop: Scan → Insight → Lab (AI chat) → Profile/History.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (Vite HMR on http://localhost:5173)
npm run dev

# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Router**: Vue Router 4 (hash history mode)
- **Build**: Vite 7
- **Styling**: Tailwind CSS 3 with custom biophilic design tokens
- **Animations**: GSAP 3 (used in ScoreGauge and animations)
- **Icons**: lucide-vue-next
- **TypeScript**: Strict mode enabled
- **State Management**: Vue reactive primitives (no Pinia/Vuex)

## Architecture Patterns

### State Management Philosophy

The app uses **module-based reactive state** instead of a centralized store. Each state module is a singleton that exports:
- Reactive state objects using `reactive()`
- Computed values using `computed()`
- State mutation functions

**Key state modules:**
- `src/state/auth.ts` - Authentication state, persisted to localStorage
- `src/state/session.ts` - Current selected product and score override
- `src/state/history.ts` - Scan history (max 50 items)
- `src/state/favorites.ts` - Favorited products
- `src/state/healthPreferences.ts` - User health preferences

**Pattern**: State is imported directly into components. Mutations happen via exported functions.

### Mock Data & API Layer

- `src/data/mock.ts` - Contains all product insight data (`ProductInsight[]`)
- `src/api/auth.ts` - Mock authentication (stores users in localStorage)
- No real backend yet - all data is client-side

**IMPORTANT**: When adding new products, follow the `ProductInsight` type structure with pathway-level analysis.

### Router Structure

Routes are defined in `src/router/routes.ts`. The app uses **hash-based routing** (`createWebHashHistory()`) for simple deployment without server configuration.

**Auth guard**: Runs on every route change, hydrates auth state from localStorage, and redirects to `/auth` if `requiresAuth` meta is set (currently no routes require auth - they use "hybrid" pattern instead).

### Design System

**Biophilic Design Tokens** (defined in `src/style.css`):
- CSS variables drive Tailwind colors: `--moss`, `--leaf`, `--earth`, `--skylight`, `--paper`, `--surface`, `--ink`
- Custom utilities: `.card`, `.chip`, `.tap`, `.hoverleaf`
- Organic border radius: `rounded-organic` (1.25rem)
- Custom shadows: `shadow-soft`, `shadow-lift`
- Transition timing: `duration-natural` (200ms), `ease-leaf` (cubic-bezier)

**Gradient background**: Multi-layer radial gradients on `<body>` create depth. Micro-noise overlay adds texture via SVG data URL.

### Component Architecture

**Views** (`src/views/`):
- `ScanView.vue` - Product selection → 2s animation → auto-navigate to Insight
- `InsightView.vue` - Longevity score, time impact, pathway cards
- `LabView.vue` - AI chat interface with `[SCORE: XX]` parsing to update session score
- `ProfileView.vue` - User profile, history, favorites, preferences
- `AuthView.vue` - Login/register with localStorage persistence

**Shared Components** (`src/components/`):
- `BottomNav.vue` - Fixed bottom navigation (always visible)
- `ScoreGauge.vue` - Animated semi-circular score gauge with GSAP
- `PathwayCard.vue` - Expandable pathway rationale cards

**Component Communication**: Props down, events up. No event bus. Shared state via reactive modules.

### Lab AI Chat Protocol (Demo)

The Lab view parses AI responses for `[SCORE: XX]` tags to dynamically update the score gauge on InsightView via `session.scoreOverride`. This is a **demo-only protocol** to showcase UI binding - not production AI behavior.

Pattern in `LabView.vue`:
```typescript
const scoreMatch = /\[SCORE:\s*(\d+)\]/i.exec(aiResponse)
if (scoreMatch) setScoreOverride(Number(scoreMatch[1]))
```

## Type Safety

TypeScript is configured with **strict mode**:
- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled
- `verbatimModuleSyntax` enforced
- All types are defined inline or co-located with data

**Key types**:
- `ProductInsight` - Product data structure with pathways
- `Pathway` - Single pathway analysis with level (`Low | Medium | High | Optimal | Risk`)
- `AuthUser` - User profile (id, name, email)
- `ScanHistoryItem` - History entry with timestamp

## Important Implementation Notes

1. **localStorage keys** use versioned prefixes (`ageless.auth.v1`, `ageless.users.v1`, etc.) to allow future schema changes
2. **Auth is mock only** - passwords are stored in plain text in localStorage for demo purposes
3. **No backend API calls** - everything is client-side
4. **Route guards check auth** but currently no routes strictly require it - use "hybrid" pattern (guests see limited UI)
5. **Score animations** use GSAP for smooth transitions - avoid CSS-only animations for gauge updates
6. **Product IDs** (`yogurt`, `cola`, `bread`) are hardcoded in mock data

## Deployment

Build outputs to `dist/`. The app uses hash routing so it can be deployed to any static host (GitHub Pages, Netlify, Vercel, etc.) without server-side routing configuration.

## Future Integration Points

When connecting to real backend:
1. Replace `src/api/auth.ts` mock functions with API calls
2. Replace `src/data/mock.ts` with API endpoints
3. Add API client/fetch wrapper in `src/api/`
4. Consider adding Pinia if state synchronization becomes complex
5. Replace `[SCORE: XX]` protocol with structured AI response format
