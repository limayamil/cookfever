# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

Open `index.html` directly in a browser — no build step, server, or dependencies required. Recipe `.md` files are fetched relative to the HTML file, so a local server is needed if the browser blocks `file://` fetches:

```bash
python3 -m http.server 8080
```

## Architecture

Cookfever is a Spanish-language recipe reader app built with vanilla JS/HTML/CSS — no framework, no bundler, no npm packages.

**Core files:**
- `app.js` — All application logic (~700 lines): recipe loading, parsing, state management, rendering, localStorage persistence
- `index.html` — HTML shell with three main regions: `#libraryView`, `#readerView`, `#ingredientsDrawer`
- `styles.css` — Design system via CSS custom properties: typography, colors, spacing scale, component styles
- `recipes/` — Markdown recipe files (one per dish)

**Data flow:**
1. `recipeManifest` (in `app.js`) lists recipe filenames to fetch
2. `parseRecipe()` converts markdown into structured objects with metadata, ingredients, and steps
3. Global `state` object tracks the active recipe, current step, and ingredient checks
4. Two localStorage keys persist ingredient checks and step progress across page reloads

## Recipe Markdown Format

Recipes use a strict section structure that `parseRecipe()` depends on:

```
## Datos          → metadata: descripcion, porciones, tiempo, dificultad, guia de fuego
## Ingredientes   → rows: `amount | name | note`
## Equipo         → equipment list
## Pasos          → cooking steps
```

Each step under `## Pasos` uses `### Title` headings followed by fields: `accion`, `fuego`, `tiempo`, `detalle`. Add `plus: [Title]` to mark a step as optional.

Heat levels are auto-detected from values: `bajo`, `medio`, `alto`, `medio-bajo`, `medio-alto`, `sin fuego`.

## Design Tokens

All visual constants live as CSS custom properties in `styles.css`:
- `--color-*` — full palette including heat-level colors
- `--space-1` through `--space-7` — 4px to 32px spacing scale
- `--font-display` (Fraunces, serif) / `--font-body` (Inter, sans-serif)

## Adding a New Recipe

1. Create `recipes/your-recipe.md` following the format in `recipes/_estructura.md`
2. Add the filename to `recipeManifest` in `app.js`
