# WvW Pip Tally

A modern Guild Wars 2 WvW skirmish reward track (pips) calculator. Inspired by [limitlessfx’s pip calculator](https://gw2.limitlessfx.com/wvw/pips.php).

Pick your current chest, placement, rank, and bonuses to see pips per tick and time remaining until Diamond. Optionally paste an API key to autofill personal rank and current skirmish placement.

Also available in-game as a [Blish HUD module](https://blishhud.com/modules/?module=gw2.wvwpiptally) that can scan your screen to automate the same calculations.

## API key permissions

Create a key at [account.arena.net/applications](https://account.arena.net/applications) with:

- `account`
- `progression` (WvW rank)
- `wvw` (team / match lookup)

The key stays in `localStorage` on your machine. Chest progress is not exposed by the API, so that stays manual.

## Notes

- Requires Tier 3+ participation at tick end to earn pips.
- Ticks are every 5 minutes; weekly track is 1450 pips / 365 claim tickets.

Live site at https://wvwpiptally.jacobwittig.com/
