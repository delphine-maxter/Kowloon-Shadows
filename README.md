# Shadows of Kowloon — Static Site

A spooky landing page with a timed unlock and a custom interactive map built with Leaflet.

## Files
- `index.html` — Landing page with countdown and unlock button
- `tour.html` — Split layout: tour text + interactive map
- `style.css` — Shared styles and spooky theme
- `main.js` — Countdown + unlock logic (redirects to `tour.html` when available)
- `locations.js` — Coordinates and descriptions for pins
- `map.js` — Leaflet map initialization, markers, route, and list interactions

## Hosting on GitHub Pages
1. Create a new repo (e.g., `shadows-of-kowloon`).
2. Upload all files from this zip to the repo root (no subfolders required).
3. In repo settings, enable **GitHub Pages** with **Deploy from a branch** and set the branch to `main` and the root folder.
4. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

## Map Notes
- Map uses **OpenStreetMap** tiles via **Leaflet** with no API key.
- Click a location in the list to pan & open its popup. Click markers to highlight the list item.
- The route line follows the tour order.
- You can edit coordinates in `locations.js` if you want to fine-tune marker positions.

## Unlock Time
- The unlock time is set to **tomorrow at 7:30 PM** based on the visitor’s local browser time.
- When unlocked, the button glows and redirects to `tour.html`.

## Optional: Use Google My Maps Instead
- Replace the `map-container` contents in `tour.html` with your My Maps iframe if preferred.

