STARRFIELD FUN — ABSOLUTE CINEMA / SAFARI BROWSER CHROME FIX

FULL AUDIT RESULT
-----------------
The intermittent white panel seen in the iPhone screen recording is Safari's own
bottom browser toolbar/chrome, not a website section or CSS overlay.

Evidence from the recording:
- The site's PLAYING control and timecode are faintly visible behind the white panel.
- The panel has Safari's rounded browser-toolbar top edge.
- It appears/disappears as Safari's browser controls collapse during scrolling.

WHAT THIS UPDATE DOES
---------------------
1. Removes the previous viewport/z-index workaround logic from the cinematic CSS/JS.
2. Adds a proper theme-color meta tag.
3. Makes Safari's browser chrome switch between ivory and near-black with the film.
4. Moves the bottom cinema controls upward if Safari exposes a measurable bottom inset.
5. Keeps the approved Camera Zoom / Absolute Cinema design and content intact.

REPLACE ONLY:
- index.html
- home-cinematic.css
- home-cinematic.js

IMPORTANT
---------
A website cannot remove Safari's browser toolbar itself. This update makes it visually
blend into the current scene instead of looking like a foreign white border.
