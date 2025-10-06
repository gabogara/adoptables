# Adoptables (PetFinder Edition)

Find pets by type and location using the Petfinder API.

## Tech

- Vite (template `react`)
- React Router (`react-router-dom`)
- `@petfinder/petfinder-js` (official SDK that manages OAuth/token). **Educational use**. In production you should proxy requests via a backend/serverless.

## Limits (Petfinder)

- Free with registration: up to **1,000 requests/day** and **50 req/s**.

## Setup

1. Create a `.env.local` from `.env.local.example` and fill `VITE_PETFINDER_KEY` and `VITE_PETFINDER_SECRET` from your Petfinder developer account.
2. `npm i`
3. `npm run dev`

## Scripts

- `npm run dev` — Vite dev server

## Structure

## Estructura

- `src/pages` (routes), `src/shared` (NavBar, Loader, ErrorAlert, api).
