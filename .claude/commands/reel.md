---
description: Generate a bespoke 3:4 carousel (1080×1440 slides) for Instagram, LinkedIn (PDF) and X (thread), plus a /links entry, for a blog post, news digest, technical term, TIL, silly question or cheatsheet. Output to reels/<slug>/ (gitignored).
argument-hint: <slug, URL, or "today's news">
---

Generate an Instagram carousel for: **$ARGUMENTS**

Use the `reel-from-post` skill at [.claude/skills/reel-from-post/SKILL.md](.claude/skills/reel-from-post/SKILL.md). Follow every step, including the visual QA of `contact-sheet.png` and the text for Instagram, LinkedIn and X. Slide bodies must be **bespoke for this specific content** — read the body, pick a visual metaphor that only fits this topic, write unique hook copy. Shared chrome comes from `kit.tsx`.

Output: `reels/<slug>/` containing `NN-*.png`, `caption.txt`, `alt.txt`, `carousel.pdf`, `linkedin.txt`, `x-thread.txt`, `links.json`, `contact-sheet.png`. Never `git add` this directory.
