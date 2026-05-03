---
description: Generate a bespoke 9:16 Instagram Reel (4-5 PNG frames + caption) for a blog/news/til/cheatsheet post in this repo. Output to reels/<slug>/ (gitignored).
argument-hint: <slug-or-url>
---

Generate an Instagram Reel for: **$ARGUMENTS**

Use the `reel-from-post` skill at [.claude/skills/reel-from-post/SKILL.md](.claude/skills/reel-from-post/SKILL.md). Follow every step. Design must be **bespoke for this specific post** — read the body, pick a visual metaphor that only fits this topic, write unique hook copy. Do not template.

Output: `reels/<slug>/` containing `frame-*.png` + `caption.txt`. Never `git add` this directory.
