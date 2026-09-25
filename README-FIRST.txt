STARRFIELD FUN — ABSOLUTE CINEMA STACKING FIX

REPLACE ONLY:
1. index.html
2. home-cinematic.css

ROOT CAUSE FIXED:
- The ivory cinema-release section was being painted above the sticky movie on Safari because it had its own z-index.
- The cinema-screen now explicitly stays above following page content while sticky.
- cinema-release no longer overlays the film.
- Existing camera zoom, Scroll To Play motion, Safari viewport sizing, and all page content remain unchanged.
