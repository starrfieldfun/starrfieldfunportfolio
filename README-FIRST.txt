STARRFIELD FUN — ABSOLUTE CINEMA / PROTECTED TYPOGRAPHY LAYER FIX

ROOT CAUSE
The opening title, THINK, DESIGN, BUILD, and final title were all children of the
same .cinema-camera element that receives the scroll-driven camera zoom.
Therefore the typography itself was being enlarged and cropped by the viewport.

STRUCTURAL FIX
- Camera layer now contains atmosphere only: light, orb, gate, zoom.
- A separate full-screen .cinema-title-stage holds all cinematic typography.
- THINK / DESIGN / BUILD / final title stay protected inside the viewport.
- Film HUD remains outside the camera as before.
- Camera zoom still happens behind the typography, so the cinematic feeling stays.
- Scene text still gets a tiny independent entrance scale/blur, but no destructive crop.

REPLACE ONLY
- index.html
- home-cinematic.css
- home-cinematic.js

This is built on the current full-screen Absolute Cinema baseline.
