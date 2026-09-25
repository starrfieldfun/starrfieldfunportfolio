STARRFIELD FUN — CAMERA ZOOM + CINEMATIC CONTINUITY UPDATE
Operation Project Improvement

BASELINE
This update is built directly on the approved Absolute Cinema homepage baseline.
The content order and general page content remain in place.

REPLACE THESE ROOT FILES:
1. index.html
2. home-cinematic.css
3. home-cinematic.js
4. home-landing-refresh.css
5. site-extras.css
6. favicon.svg
7. favicon.png
8. apple-touch-icon.png

WHAT CHANGED
- Removed the animated black letterbox bars from the title sequence.
- Replaced them with a progressive camera push / zoom during scrolling.
- Added small zoom pushes at THINK / DESIGN / BUILD chapter changes.
- Added a soft dissolve back to ivory before the normal portfolio begins.
- Kept SCROLL TO PLAY / PLAYING UI outside the zoomed camera layer so it stays crisp.
- Replaced the boxed favicon treatment with a transparent Starrfield mark for desktop Safari.
- Added apple-touch-icon.png for Apple devices.
- Added a conservative site-wide cinematic continuity layer in site-extras.css:
  refined navigation surface, shared reveal easing, restrained image push-ins,
  unified micro-label spacing, subtle card motion and a very light texture.

IMPORTANT
- This does NOT replace the Contact page or its form logic/access key.
- It does NOT replace About, Photography, Work, Services, or case-study HTML.
- site-extras.css is intentionally global so existing pages that already load it inherit the new shared vibe without moving their content.

SAFARI FAVICON NOTE
Safari caches favicons aggressively. After publishing, if the old boxed S remains:
- close the Starrfield Fun tab completely and reopen it; or
- Safari > Settings > Privacy > Manage Website Data > search starrfieldfun.com > Remove.
This is only necessary if Safari keeps displaying the cached old favicon.
