# Adoptables

Find pets by type and location using the Petfinder API.  
Built as the final project for the React “Kiwi” — Summer 2025 cohort at Code the Dream.

---

## Features

### Search

- Filter by type (dog, cat, etc.), optional ZIP code, and page size.
- Pagination.
- URL search params so you can return to the same results after viewing details.

### Details

- Photo, type, breed, age, gender, location.
- Add/Remove from Favorites (optimistic update).
- “Back” link returns to the exact search you came from.

### Favorites

- Grid of saved pets with images.
- Personal note per favorite (editable).
- Remove via confirmation modal.

### Recently Viewed

- Automatically records pets you open.
- Stored in `localStorage` (no login required).
- “Clear” button to reset.

---

## Tech Stack

- Vite (`react` template)
- React Router (`react-router-dom`)
- `@petfinder/petfinder-js` (official SDK that manages OAuth/token) — **educational use**.  
  In production you should proxy requests via a backend/serverless.
- CSS Modules for styling

---

## Petfinder Limits

- Free plan (with registration): up to **1,000 requests/day** and **50 req/s**.

> **Note**: Rate limits and policies can change. Check Petfinder’s developer docs for the latest quotas.

---

## Getting Started

### Prerequisites

- Node.js
- A Petfinder API key/secret (free): https://www.petfinder.com/developers/

### Clone & Install

```sh
git clone https://github.com/gabogara/adoptables
cd adoptables
npm install
```

### Environment Variables

1. Copy the example file:

```sh
   cp .env.local.example .env.local
```

2. Open `.env.local` and add your Petfinder API credentials:

```
   VITE_PETFINDER_KEY="your_key_here"
   VITE_PETFINDER_SECRET="your_secret_here"
```

3. Run the development server:

```sh
   npm run dev
```

---

## Project Structure

```
adoptables/
├─ public/                 # favicon only; no other assets
├─ src/
│  ├─ assets/
│  │  └─ fonts/
│  │     └─ baloo2/       # self-hosted Baloo 2 .woff2 files
│  ├─ features/
│  │  ├─ favorites/       # context + hooks for favorites
│  │  └─ recentlyViewed/  # localStorage hook
│  ├─ pages/              # Home, Details, Favorites, About, NotFound
│  ├─ shared/             # reusable components (cards, pagination, modal, etc.)
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css           # design tokens + base styles + font-face
│  └─ main.jsx
├─ .env.local.example
├─ .gitignore
├─ index.html             # head-only changes allowed; no external CSS
├─ package.json
├─ package-lock.json
└─ vite.config.js
```

---

## Features

### Search

- Filter by type (dog, cat, etc.) and optional ZIP code
- Adjustable page size with pagination controls
- URL search params preserve your search state when navigating between pages

### Details

- View pet photos, type, breed, age, gender, and location
- Add/remove from favorites with optimistic UI updates
- Back link returns you to your exact search results

### Favorites

- Grid view of all saved pets with images
- Add personal notes to each favorite pet
- Remove favorites via confirmation modal

### Recently Viewed

- Automatic tracking of pets you've viewed
- Stored in localStorage (no login required)
- One-click clear button to reset history

---

## Styling

- **CSS Modules** for component-scoped styling (`*.module.css`)
- **Design tokens** in `index.css` for consistent colors and spacing
- **Self-hosted font** (Baloo 2) via local `.woff2` files in `src/assets/fonts/`

Per course requirements: no UI component libraries for theming. Only CSS and CSS Modules are used.

---

## Course & Credits

- **Course:** React Summer 2025 — "Kiwi" at Code the Dream
- **Organization:** https://www.codethedream.org/
- **Data & Images:** Petfinder API (educational use)
