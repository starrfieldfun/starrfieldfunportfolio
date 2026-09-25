STARRFIELD FUN — ABSOLUTE CINEMA / FINAL TITLE CARD SAFE-FRAME FIX

REPLACE ONLY:
- index.html
- home-cinematic.css
- home-cinematic.js

ROOT CAUSE:
The final title card was inside the same progressively zoomed camera layer as the
chapter scenes. At the final scene the camera scale/offset could crop the title,
paragraph and Enter The Portfolio button against the viewport.

FIX:
- Cinema remains full-screen/full-bleed.
- THINK / DESIGN / BUILD remain dramatic.
- Camera smoothly settles toward center for the final title card.
- Final title card no longer translates or scales itself.
- Final card uses border-box sizing and a dedicated internal safe zone.
- Headline, paragraph and button stay inside the visible frame.
- Mobile gets its own safe-zone sizing.

No other homepage content is changed.
