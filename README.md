# WvW Pip Tally

A modern Guild Wars 2 WvW skirmish reward track (pips) calculator. Inspired by [limitlessfx’s pip calculator](https://gw2.limitlessfx.com/wvw/pips.php).

Pick your current chest, placement, rank, and bonuses to see pips per tick and time remaining until Diamond. Optionally paste an API key to autofill personal rank and current skirmish placement.

## Develop

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

This repo is set up for a project site at:

`https://<your-username>.github.io/wvw-pip-tally/`

### Option A — GitHub Actions (recommended)

1. Push this repo to GitHub with the name **`wvw-pip-tally`** (or update `base` in `vite.config.ts` to match your repo name).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes `dist`.

### Option B — Manual `gh-pages` branch

```bash
npm run deploy
```

Then set Pages to deploy from the `gh-pages` branch.

## API key permissions

Create a key at [account.arena.net/applications](https://account.arena.net/applications) with:

- `account`
- `progression` (WvW rank)
- `wvw` (team / match lookup)

The key stays in `localStorage` on your machine. Chest progress is not exposed by the API, so that stays manual.

## Notes

- Requires Tier 3+ participation at tick end to earn pips.
- Ticks are every 5 minutes; weekly track is 1450 pips / 365 claim tickets.
- Commander bonuses only apply while actually commanding with enough squad members on the map.
