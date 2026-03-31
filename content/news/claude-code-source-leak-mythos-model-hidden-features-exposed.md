---
title: "Claude Code Source Code Leaked Again via npm Sourcemap — 512K Lines, Hidden Features Exposed"
description: "Anthropic's Claude Code v2.1.88 accidentally shipped a 60MB sourcemap file on npm, exposing 1,906 proprietary TypeScript files including hidden features like BUDDY, KAIROS, ULTRAPLAN, and an internal 'Undercover Mode' — for the second time in a year."
date: "2026-03-31"
tags: ["Claude Code", "Anthropic", "source code leak", "npm", "sourcemap", "BUDDY", "KAIROS", "ULTRAPLAN", "Tengu", "TypeScript", "Bun", "AI", "security", "developer tools", "open source", "2026"]
source: "tavily"
---

On 31 March 2026, security researcher **Chaofan Shou** discovered that **Anthropic** had once again accidentally shipped the complete source code of **Claude Code** — its flagship AI coding CLI — bundled inside a public npm package. The culprit was a 60 MB sourcemap file (`cli.js.map`) included in version **2.1.88** of `@anthropic-ai/claude-code`. It's the second time this has happened in under a year.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Claude code source code has been leaked via a map file in their npm registry! <br><br>Code: <a href="https://t.co/jBiMoOzt8G">https://t.co/jBiMoOzt8G</a> <a href="https://t.co/rYo5hbvEj8">pic.twitter.com/rYo5hbvEj8</a></p>&mdash; Chaofan Shou (@Fried_rice) <a href="https://twitter.com/Fried_rice/status/2038894956459290963?ref_src=twsrc%5Etfw">March 31, 2026</a></blockquote>

## TL;DR

- **Claude Code v2.1.88** shipped a 60 MB sourcemap file on npm — exposing the full TypeScript source
- **1,906 proprietary source files**, 512,000+ lines of code, now publicly archived
- Affected package was **~102.8 MB** unpacked vs the normal ~32.7 MB — a dead giveaway
- Anthropic has since **unpublished** v2.1.88 from the npm registry
- Hidden, unreleased features found inside: **BUDDY**, **KAIROS**, **ULTRAPLAN**, **autoDream**, and more
- Internal project codename is **"Tengu"** — an entire "Undercover Mode" exists to hide this, yet the source code itself leaked
- This already happened once before in **February 2025**

---

## What Happened

A sourcemap is a developer tool — a companion file that bridges minified, production-ready code back to its original, readable source. It's essential during development but has **no place in a published npm package**. When Anthropic's team published Claude Code v2.1.88 on March 31st, they forgot to exclude it.

The published sourcemap referenced unobfuscated TypeScript sources hosted in Anthropic's cloud storage, making the entire `src/` directory of Claude Code publicly downloadable by anyone. Researcher **Chaofan Shou**, an intern at blockchain security firm **Fuzzland**, spotted it and posted on X.

> The leaked codebase was archived to a public GitHub repository within hours, surpassing **1,100 stars and 1,900 forks** before Anthropic could act.

**Verification via npm registry:** Version 2.1.88 is now marked as **unpublished**. Its unpacked size was **102,754,401 bytes (~102.8 MB)** — compared to the standard ~32.7 MB for all other recent versions. The ~70 MB difference is the sourcemap file. The tarball SHA-1 is `c22a001bea2241defb15d0124939836170389daf` and it was published by `wolffiex@anthropic.com`.

The leak exposes:

- Internal API design
- Telemetry and analytics systems
- Encryption and inter-process communication protocols
- Security permission logic
- 40+ internal tool implementations

According to **NDTV** and **BlockBeats**, this does **not** expose model weights or user conversation data. Ordinary users' data is safe. But Anthropic's internal architecture is now fully transparent.

---

## Not the First Time

This is not Anthropic's first sourcemap incident. In early 2025, versions **v0.2.8 and v0.2.28** were accidentally shipped with full sourcemaps. Anthropic quietly removed those versions from npm, but cached copies remained accessible. The problem has now resurfaced — in a far larger and more mature version of the product, with far more attention.

---

## What's Inside: Hidden Features Exposed

### BUDDY — The AI Tamagotchi
The source code contains a fully built but unreleased feature called **BUDDY** — a digital pet companion system. It has **18 species** (including names like *Nebulynx* and *Stormwyrm*), rarity tiers, shiny variants, and procedurally generated personalities using a deterministic PRNG (Mulberry32). Internal references point to an April 1–7, 2026 teaser window with a full launch planned for May. It is gated behind a `BUDDY` compile flag.

### KAIROS — The Always-On Proactive Assistant
Inside the `assistant/` directory lives **KAIROS** — a persistent, always-running Claude assistant that does not wait for the user to type. It watches the environment, maintains **append-only daily log files**, and proactively acts on things it notices. KAIROS respects 15-second blocking budgets and has exclusive tools like `PushNotification` and `SubscribePR`.

### ULTRAPLAN — 30-Minute Remote Cloud Planning

**ULTRAPLAN** offloads a complex planning task to a remote **Cloud Container Runtime (CCR)** session running **Opus 4.6**, gives it up to **30 minutes** to reason, and presents the result in a browser for the developer to approve. A sentinel string `__ULTRAPLAN_TELEPORT_LOCAL__` handles result integration back into the local session.

### autoDream — Memory Consolidation

**autoDream** is a background memory consolidation engine running as a forked subagent. It follows a four-phase process — *Orient → Gather Signal → Consolidate → Prune* — triggered by a triple-gate: 24-hour timer + 5 sessions completed + lock acquisition.

### Coordinator Mode — Multi-Agent Orchestration
A **Coordinator Mode** lets one Claude instance spawn and manage multiple parallel worker agents, with XML task notifications and shared scratchpad directories for inter-agent communication.

### Penguin Mode — Fast Mode

A "fast mode" feature called **Penguin Mode** routes requests to a dedicated internal endpoint `/api/claude_code_penguin_mode`, with a kill-switch flag `tengu_penguins_off`.

---

## The Irony: "Undercover Mode"

Perhaps the most striking detail from the leak is the existence of **Undercover Mode** — an internal system explicitly designed to prevent Claude Code from leaking Anthropic's internal secrets in public commits. It instructs the model not to reveal internal codenames (animal names like *Capybara*, *Tengu*), unreleased model versions, or internal tooling.

The internal project codename for Claude Code appears throughout the source over **100 times** as **"Tengu"** — used as a feature flag prefix and analytics identifier.

> Anthropic built a system to prevent its AI from leaking internal secrets in code. The source code itself leaked anyway — via a forgotten build artifact.

---

## How It Happened Technically

Anthropic's build toolchain uses **Bun** as the runtime bundler. Bun generates sourcemaps by default. The team failed to add a `.npmignore` or equivalent exclusion rule to strip the `.map` file before publishing. The result: anyone who ran `npm install @anthropic-ai/claude-code@2.1.88` received not just the tool, but a complete reconstruction of its entire original codebase.

---

## Sources

- [Chaofan Shou on X (Twitter)](https://x.com/Fried_rice/status/2038894956459290963)
- [NDTV — Anthropic's AI Coding Tool Leaks Its Own Source Code For The Second Time In A Year](https://www.ndtv.com/science/anthropics-ai-coding-tool-leaks-its-own-source-code-for-the-second-time-in-a-year)
- [VentureBeat — Claude Code's source code appears to have leaked: here's what we know](https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know)
- [Reddit r/singularity — Claude Code source code has been leaked via a map file](https://www.reddit.com/r/singularity/comments/1s8izpi/claude_code_source_code_has_been_leaked_via_a_map/)
- [GitHub — Kuberwastaken/claude-code (archived leak)](https://github.com/Kuberwastaken/claude-code)
- [npm registry — @anthropic-ai/claude-code v2.1.88 (now unpublished)](https://registry.npmjs.org/@anthropic-ai/claude-code/2.1.88)
