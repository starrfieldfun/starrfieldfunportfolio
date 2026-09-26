STARRFIELD FUN — ONE FRAME / ONE CAMERA HOMEPAGE RETHINK
26 September 2026

SCOPE
-----
Homepage only.
No Work, case-study, Services, About, Photography or Contact files are changed.

REPLACE / ADD ONLY
------------------
index.html
home-one-frame.css
home-one-frame.js

You do NOT need to delete previous homepage CSS/JS files. The new index.html simply does not load them.

CORE IDEA
---------
The homepage is one pinned 100svh stage. The browser does not visually travel down a series of website sections.
Scroll only drives a hidden timeline and transforms the composition inside the fixed frame.

FLOW
----
I DESIGN → THINK → DESIGN → BUILD → title card → Starr → selected work → services → method → photography → final CTA

SAFETY / QA
-----------
- Opening title is visible at frame zero, even before JS runs.
- All shots are absolutely contained in one safe viewport canvas.
- Inactive shots are visibility:hidden and pointer-events:none to prevent accidental overlap/clicks.
- One controlled transition overlap is used between shots.
- One persistent spotlight and one morphing focus frame provide continuity.
- Scroll motion is interpolated for smoother trackpad/wheel response.
- Mobile uses the same pinned-film concept with reduced typography/spacing.
- Reduced-motion users get a readable normal-flow fallback.
- 39 local homepage references checked: 0 missing.
- CSS parser errors: 0.
- JavaScript syntax: passed.
- Semantic H1 count: 1.
