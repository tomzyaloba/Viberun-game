# VIBE RUNNER — Phase 1

**LAUNCH. RUN. VIBE.**
A community-made endless runner inspired by the Vibe ecosystem. Not an official Vibe product.

## Status: Phase 1 only

Per the build plan, this is deliberately just the playable core:

- Player (run + jump), one obstacle type (**RUG**), collision, score, game over, restart.
- Constant speed and spawn rate — no difficulty scaling yet, no VIBE/SPARK/LAUNCHPAD
  collectibles, no combo system, no parallax city, no sound. Those are Phases 2-5,
  built next once this core is confirmed fun.

## Running it locally

This uses real ES modules (`import`/`export` between files), which browsers refuse
to load over a plain `file://` double-clicked HTML file (a CORS restriction on
module scripts specifically). You need a local static server — any of these work:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

or, if you have Node:

```bash
npx serve .
```

GitHub Pages serves everything over HTTPS, so this restriction doesn't apply once
deployed — the CORS issue is a `file://`-specific quirk, not a hosting problem.

## Deploying to GitHub Pages

1. Push this whole folder to a repo.
2. Repo Settings → Pages → Source: "Deploy from a branch" → your default branch, root folder.
3. GitHub gives you a live URL within a minute or two.

## Controls

- **Desktop:** Space or ↑ to jump.
- **Mobile:** tap anywhere on the game area to jump.

## Project structure

```
/index.html         structure + DOM overlay screens (start, game over, HUD)
/style.css           all visual styling
/src/game.js         game loop, state machine, input handling, canvas rendering
/src/player.js       player physics + drawing (original character, no copyrighted art)
/src/obstacles.js    obstacle spawning, movement, drawing
/src/ui.js           DOM screen management (start/game-over/HUD)
```

Later phases will add `src/collectibles.js`, `src/audio.js`, and `src/storage.js`
as those systems are actually built — no placeholder/empty files exist yet, per the
"don't create fake functionality" rule in the original spec.

## What to test right now

- Does jump feel responsive and fair (no unfair hits on near-misses)?
- Is the RUG obstacle's timing comfortable to react to?
- Does restart work instantly with no lag or leftover state from the last run?
- Does tap-to-jump work cleanly on your phone without the page scrolling/zooming?

Tell me what feels off and I'll tune it before we move to Phase 2 (VIBE/SPARK/
LAUNCHPAD collectibles, combo system, and the difficulty curve).
