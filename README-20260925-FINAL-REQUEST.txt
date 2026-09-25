STARRFIELD FUN — FINAL VIEWPORT + CASE STUDY UPDATE
Date: 25 September 2026

SOURCE
======
This package was built from the compressed starrfieldfunportfolio.zip supplied by Starr.
Missing website routes and image assets were restored from the Git history contained inside that same repository.

NO EXISTING WEBSITE FILE OR IMAGE WAS DELETED.
NO EXISTING IMAGE WAS EDITED OR RECOMPRESSED.

WHAT CHANGED
============
1. CONTACT HERO
- The existing right-side communication/signal visual is preserved.
- Its vertical height is reduced so it stays inside the first landing screen.
- Headline, description, actions and footer spacing were tightened responsively.
- The Contact form logic and form-config.js were not changed.

2. MYBUSFINDER LAPTOP
- Laptop showcase is smaller and centred.
- Laptop display is 16:9.
- The original screenshot is shown with object-fit: contain so it is not stretched or cropped.
- Desktop laptop maximum width is 780px.

3. ALL CANONICAL PAGE LANDINGS FIT THE FIRST VIEWPORT
Applied to:
- Home: existing Absolute Cinema 100svh treatment retained.
- Work
- About
- Services
- Photography
- Contact
- MyBusFinder
- Monitor Control
- PromptChecker
- Singapore National Paralympics Council
- Eternal Shutterwave

The new viewport-fit.css is loaded last on these canonical pages. It adjusts hero height, title size, spacing, metadata and media responsively for desktop, shorter laptop screens and mobile.

4. CASE STUDIES FOLLOW PROMPTCHECKER'S VISUAL SYSTEM
The content and screenshots were not rewritten. A new case-study-unified.css standardises:
- chapter rhythm
- section heading hierarchy
- compact card language
- screenshot/caption presentation
- light / dark / accent chapter sequencing
- project ending treatment

Each case study retains its own palette:
- MyBusFinder: transit blue / pale blue / deep navy
- Monitor Control: Windows blue / cool blue / deep navy
- PromptChecker: violet-blue / cool slate / dark navy
- SNPC: sporting blue / warm red / deep navy
- Eternal Shutterwave: red / warm neutral / near-black

5. BROKEN WEBSITE RECOVERY RETAINED
The complete canonical Work index and four previously missing case-study routes remain restored, together with the previously missing work covers, photography assets and project screenshots.

TECHNICAL SAFETY
================
- Contact form JavaScript/config unchanged.
- Homepage cinema CSS/JS unchanged.
- Existing images unchanged.
- Existing files preserved.
- Clean canonical /work/.../ routes retained.
- Legacy .html redirect files retained.
- Existing Git repository metadata retained in this full package.

INSTALL
=======
Safest method:
1. Keep a backup of your current folder.
2. Extract this ZIP.
3. Copy/merge the extracted starrfieldfunportfolio folder into your current project.
4. Allow matching files to replace when asked.
5. Do NOT manually delete image folders first.
6. Commit and push to GitHub Pages.
7. Hard refresh Safari once after deployment so viewport-fit.css and case-study-unified.css are loaded.

NEW STYLESHEETS
===============
viewport-fit.css
case-study-unified.css
