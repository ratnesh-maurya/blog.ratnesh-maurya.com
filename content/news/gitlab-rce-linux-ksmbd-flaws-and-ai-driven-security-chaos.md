---
title: 'GitLab RCE, Linux KSMBD flaws, and AI-driven security chaos'
description: >-
  Critical RCE vulnerabilities in GitLab and Linux KSMBD require immediate
  patching, as AI tools accelerate flaw discovery, making patching a race
  against
date: '2026-10-23'
tags:
  - GitLab
  - Linux KSMBD
  - PHP
  - Cloudflare WAF
  - Knowledge Catalog
  - LLM pricing
  - Anthropic
  - Vercel Chat SDK
source: tavily
stories: 10
sources:
  - DEV Community
  - The Hacker News
  - The New Stack
  - Google
  - The Pragmatic Engineer
  - Cloudflare Blog
  - Vercel
---

This week's news underscores a growing tension: critical software vulnerabilities are being disclosed and exploited at an alarming rate, partly due to AI-driven vulnerability research. Meanwhile, major vendors are launching AI tools aimed at improving development and operational efficiency, but the security backdrop looms large.

## TL;DR

- **Black October security alert: Six critical vulnerabilities disclosed in 48 hours, including PHP, GitLab, and AI gateway** — October saw a 'Black October' of security incidents, with six critical vulnerabilities in 48 hours affecting PHP, GitLab, a TLS CA, an AI gateway, and an APT using AI-driven pentesting against Microsoft 365 tenants.
- **Critical GitLab RCE flaw (CVSS 10.0) patched, affecting all self-managed versions since 7.0 (2014)** — GitLab released patches for a critical CVSS 10.0 unauthenticated RCE flaw (CVE-2026-110264) affecting all self-managed versions from 7.0 (2014) onwards, due to an integer overflow in its Ruby Regex compiler.
- **Two CVSS 9.0 RCE flaws in Linux KSMBD disclosed publicly before kernel fixes** — Two CVSS 9.0 remote code execution flaws affecting Linux KSMBD have been publicly disclosed by Trend Micro's Zero Day Initiative, with no official fixes yet available in the mainline kernel.
- **AI accelerates vulnerability discovery, outstripping maintainers' ability to patch, exemplified by PHP2Shell** — AI tools are finding software vulnerabilities faster than maintainers can develop and deploy fixes, as seen with the PHP2Shell flaws and other "Black October" incidents.
- **Google Cloud's Knowledge Catalog introduces self-learning context enrichment for AI agents** — Google Cloud's Knowledge Catalog now offers self-learning context enrichment and a reimagined Knowledge Studio (both in preview) to automatically keep AI agent business context accurate.
- **Anthropic moves off Git and builds custom source control system due to AI agent development bottlenecks** — Anthropic has moved away from Git to a custom-built source control system because AI agents, like Claude, have made coding no longer the bottleneck, shifting it to developer infrastructure.
- **October 2026 security incidents including LiteLLM and eMudhra CA largely remediated by providers** — Major October 2026 security incidents, including malicious LiteLLM packages and eMudhra CA trust issues, have been largely contained by providers, but user action is still required for full remediation.
- **LLM API true cost depends on cache rates, output ratios, and pricing thresholds, not just headline price** — The actual cost of LLM APIs in October 2026 is driven by cache rates, output ratios, and pricing thresholds, not solely by the per-token headline price.
- **Cloudflare deployed WAF protections against php2shell vulnerabilities before public disclosure** — Cloudflare deployed WAF protections against the php2shell vulnerabilities (CVE-2026-109618 and CVE-2026-109619) for all customers starting October 21, 2026, ahead of public disclosure.
- **Vercel releases Chat SDK for Next.js 15.1 and later, enabling Slack bot development** — Vercel has released a Chat SDK, allowing developers to build Slack bots within existing Next.js 15.1 or later applications, using App Router Route Handlers and Vercel Connect for authentication.

---

## Black October security alert: Six critical vulnerabilities disclosed in 48 hours, including PHP, GitLab, and AI gateway

*Top story · Security · DEV Community · 2026-10-22*

![Black October: A Blue Team Field Guide - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fm04nbphp30ovhbrptqiq.png)

A period dubbed "Black October" saw a concentrated wave of six critical vulnerabilities disclosed within a 48-hour window. These include two RCE flaws (CVSS 9.2) in the PHP runtime itself (PHP2Shell), one affecting ~80% of websites with 5.1M hosts exposed and active exploitation observed before patches.

An Indian certificate authority, eMudhra CA, had 8 intermediate TLS certificates with weak private keys (one was '4'), allowing HTTPS certificate forgery since April 2025. Node.js and Bun remained unpatched at the time of reporting. A CVSS 10.0 unauthenticated RCE in GitLab's Regex Compiler affected over 2,700 Community Edition instances. A supply chain compromise impacted the LiteLLM AI gateway, and a Chinese APT (Storm-0940) used an AI autonomous pentesting tool (ARTEX) to target over 2,250 Microsoft 365 tenants, achieving privileged cloud access in under 3 hours.

The widespread nature of these attacks highlights a growing challenge where AI tools are accelerating vulnerability discovery and exploitation. The report advises immediate patching and addressing AI agent blind spots.

**Key facts**

- Two PHP RCE flaws (CVSS 9.2) affected ~80% of websites
- eMudhra CA had 8 intermediate TLS certs with weak private keys
- GitLab RCE (CVSS 10.0) affected 2,700+ Community Edition instances
- Chinese APT used AI pentesting tool (ARTEX) against 2,250+ Microsoft 365 tenants

**Why it matters:** Engineers must prioritize patching and securing their infrastructure against this surge of critical vulnerabilities. The use of AI in attacks necessitates a review of AI agent security postures and the adoption of open-source tools for rapid detection and remediation, even in air-gapped environments.

> AI is accelerating both vulnerability discovery and attacks, demanding urgent patching and a focus on AI agent security.

[🔗 Read more at DEV Community](https://dev.to/aegisgate/black-october-a-blue-team-field-guide-122i)

---

## Critical GitLab RCE flaw (CVSS 10.0) patched, affecting all self-managed versions since 7.0 (2014)

*Security · The Hacker News · 2026-10-22*

GitLab has released patches for a critical vulnerability, CVE-2026-110264, rated 10.0 on the CVSS scale, that allows unauthenticated remote code execution on self-managed servers. The flaw, an integer overflow during the compilation of a specially crafted regular expression in Ruby's Onigmo engine, affects every version of GitLab from 7.0, released in 2014, up to current versions.

The fix, released on October 21, is crucial even for administrators who patched nine days earlier, as the October 12 update only covered versions 19.2 and later. GitLab took the unusual step of backporting this fix to older releases (18.11.13, 19.0.10, 19.1.9, and 19.2.9) beyond its standard policy, indicating the severity of the issue. GitLab.com and specific GitLab Dedicated tenants are already protected.

The company has not disclosed the specific conditions required to exploit the flaw and reports no sign of active exploitation. Two detection rules, "Onigmo native worker crash" and "Org mode render error burst," have been published for administrators to detect exploitation attempts using GitLab's TLDR framework and application logs.

> ⚠️ **Heads up:** GitLab has not said what preconditions an attacker needs to reach the compiler, so administrators cannot yet rule themselves out by configuration; the fix is the only certain protection.

**Key facts**

- CVE-2026-110264: CVSS 10.0 unauthenticated RCE in GitLab
- Affects all self-managed GitLab versions from 7.0 (2014)
- Fixed in versions 19.5.1, 19.4.3, 19.3.6, 19.2.9, 19.1.9, 19.0.10, 18.11.13
- Flaw is in Ruby's Onigmo regex engine

**Why it matters:** Self-managed GitLab administrators must immediately upgrade to the patched versions. This is a critical unauthenticated RCE with a wide impact range, and engineers should assume their instance is vulnerable until patched. Deploying the provided detection rules is also a high priority.

> Patch self-managed GitLab immediately for a critical RCE affecting all versions since 2014.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/10/critical-gitlab-flaw-cvss-100-could.html)

---

## Two CVSS 9.0 RCE flaws in Linux KSMBD disclosed publicly before kernel fixes

*Security · The Hacker News · 2026-10-22*

![cybersecurity](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpv5Y6QePil1MjgPiKuj9qVcOEzN1QdpjV55lFLD7Nyll1Wy1-rDkPzUxoUxZBjyhD74ycWms55yNl3nOcVfzpirEVdQnc0bfulwnXhfb5IAO5oii05bR8bzttfawsmnOSBqpuNre7TO6eDyDJn4FhPAsISdesN9Nsfq-7UgOE6XMHMH5tSwffhl-qhK9h/s728-nu-rw-lo-l85-e365/wiz-d.png)

Two critical remote code execution (RCE) flaws, ZDI-CAN-33774 and ZDI-CAN-33549, have been publicly disclosed for Linux KSMBD, the kernel's built-in SMB server. Both are rated 9.0 on the CVSS scale by Trend Micro's Zero Day Initiative, and as of October 22, 2026, no fix is present in the mainline kernel.

ZDI-CAN-33774 is an unauthenticated race condition that can be triggered on any server running KSMBD on port 445. It involves a specific sequence of SMB1 and SMB2 packets that causes a buffer read past its end. ZDI-CAN-33549 is an integer underflow in the SMB Direct path, requiring an RDMA-capable network interface, a writable KSMBD share, and a client negotiating SMB Direct. It allows a memory copy to overrun an allocated buffer.

These flaws were found by TrendAI, Trend Micro's AI scanner, and reported to public mailing lists in accordance with updated Linux kernel security documentation. While a fix for ZDI-CAN-33549 may be targeting the next kernel development cycle, official stable-tree fixes and CVE identifiers are not yet available. Red Hat Enterprise Linux does not include KSMBD by default. Administrators can check for KSMBD activity using `systemctl status ksmbd` or `lsmod | grep ksmbd`.

> ⚠️ **Heads up:** Fixes are not yet in the mainline kernel and will take time to reach stable branches and distributions.

**Key facts**

- Two CVSS 9.0 RCE flaws (ZDI-CAN-33774, ZDI-CAN-33549) in Linux KSMBD
- ZDI-CAN-33774 is unauthenticated
- No fix in mainline kernel as of October 22, 2026
- Red Hat Enterprise Linux does not include KSMBD by default

**Why it matters:** Linux system administrators should immediately check if KSMBD is active on their servers. If present, systems are exposed to unauthenticated RCE, and mitigation strategies (disabling KSMBD, network segmentation, or monitoring) are necessary until kernel patches are widely available and deployed. The rapid public disclosure without a fix emphasizes the urgency.

> Critical KSMBD RCE flaws require immediate attention for Linux servers, as patches are not yet available.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/10/two-cvss-90-linux-ksmbd-rce-flaws.html)

---

## AI accelerates vulnerability discovery, outstripping maintainers' ability to patch, exemplified by PHP2Shell

*Security · The New Stack · 2026-10-22*

![PHP’s security scramble is just a preview: AI is digging up flaws faster than maintainers can fix them - The New Stack](https://cdn.thenewstack.io/media/2026/10/0e0382d7-ben-griffiths-gae1phgc6ms-unsplash-scaled.jpg)

The recent "Black October" security incidents, particularly the PHP2Shell vulnerabilities, highlight a growing problem: AI tools are now capable of discovering software flaws at a pace that exceeds the ability of human maintainers to create and deploy patches. This creates a significant security gap, where systems can be actively exploited before fixes are even available.

The article cites the two PHP RCE flaws (CVE-2026-109618 and CVE-2026-109619) as prime examples, where attackers exploited the vulnerabilities days before official patches existed. This trend suggests a fundamental shift in the cybersecurity landscape, where the speed of vulnerability research, often aided by AI, is outpacing traditional patching cycles.

This phenomenon impacts a wide range of foundational technologies and raises concerns about the long-term sustainability of current security practices.

**Key facts**

- AI tools discover flaws faster than human maintainers can fix them
- PHP2Shell flaws exploited before patches were available
- This trend was observed in 'Black October' incidents

**Why it matters:** Engineers need to anticipate a future where zero-day exploits become more common and last longer. This necessitates a shift towards proactive security measures, robust incident response plans, and potentially exploring AI-powered defense tools to keep pace with AI-powered attacks.

> AI is accelerating the vulnerability-exploit cycle, putting increasing pressure on patching and defensive strategies.

[🔗 Read more at The New Stack](https://thenewstack.io/php2shell-ai-vulnerabilities-maintainers)

---

## Google Cloud's Knowledge Catalog introduces self-learning context enrichment for AI agents

*Cloud & Infrastructure · Google · 2026-10-23*

![Knowledge Catalog: self-learning context enrichment for AI agents - Google Cloud](https://storage.googleapis.com/gweb-cloudblog-publish/images/09_-_Data_Analytics_tFH57V6.max-2600x2600.jpg)

Google Cloud has launched self-learning context enrichment and a reimagined Knowledge Studio in preview for Knowledge Catalog, its context engine for agents. This new capability, powered by Gemini, analyzes agent and user interactions to identify gaps and maintain the accuracy and currency of business context.

Knowledge Studio provides a command center for context engineers and data stewards to explore data conversationally, navigate a visual context graph, and review proposed changes before publishing them to users and agents. The system aims to automate the manual work involved in curating context for enterprise AI agents, moving from hand-coded prompts and mappings to a continuous feedback loop.

Internal benchmarks indicate that Knowledge Catalog can make AI agents nearly 4 times more accurate, reduce latency by up to 33%, and decrease token usage by up to 75%. It connects to existing business knowledge across documents, repositories, and structured data, providing agents with specific context rather than requiring them to reason over large prompts or raw schemas.

**Key facts**

- Self-learning context enrichment and Knowledge Studio launched in preview
- Uses Gemini to analyze agent/user interactions for context gaps
- Agents become nearly 4X more accurate with up to 33% lower latency and 75% fewer tokens (internal benchmarks)

**Why it matters:** Engineers building enterprise AI agents should evaluate Knowledge Catalog to automate context management, potentially reducing the manual effort of keeping business definitions current and improving agent performance. This could be critical for scaling agentic capabilities across an organization.

> Google Cloud automates AI agent context management, aiming to improve accuracy and efficiency by learning from interactions.

[🔗 Read more at Google](https://cloud.google.com/blog/products/data-analytics/knowledge-catalog-self-learning-context-enrichment-for-ai-agents)

---

## Anthropic moves off Git and builds custom source control system due to AI agent development bottlenecks

*Developer Tools · The Pragmatic Engineer · 2026-10-22*

Anthropic, an AI company, has transitioned from using Git to its own custom-built source control system. The decision stems from a shift in development bottlenecks: with AI agents like Claude autonomously iterating on research loops, optimizing programs, and building services, the speed and scale of coding are no longer the primary constraint.

Instead, the bottleneck has moved to developer infrastructure. This indicates that traditional source control systems like Git may not be adequately handling the demands of AI-driven development workflows, where autonomous agents generate code and system changes at an unprecedented pace.

**Key facts**

- Anthropic moved off Git to a custom source control system
- Reason: AI agents like Claude made coding no longer the bottleneck
- New bottleneck identified as developer infrastructure

**Why it matters:** This suggests that current source control systems, including Git, might struggle with the scale and velocity of AI-driven code generation and iteration. Engineers building developer infrastructure for AI companies may need to anticipate and address these scaling challenges, potentially by exploring alternatives or custom solutions.

> Traditional Git-based source control is becoming a bottleneck for companies like Anthropic, whose AI agents generate code too fast for it.

[🔗 Read more at The Pragmatic Engineer](https://blog.pragmaticengineer.com/the-pulse-anthropic-builds-its-own-source-control-system)

---

## October 2026 security incidents including LiteLLM and eMudhra CA largely remediated by providers

*Security · DEV Community · 2026-10-22*

![DEV Community](https://media2.dev.to/dynamic/image/width=190,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8j7kvp660rqzt99zui8e.png)

Incident reports from October 22, 2026, indicate that major security compromises from earlier in the month, dubbed "Black October" by some, have been largely contained by affected providers. Initial advisories had warned of active credential compromises, malicious package distributions, and TLS vulnerabilities.

Specifically, the LiteLLM PyPI release pipeline compromise that pushed malicious packages was remediated by pulling artifacts after two hours, with the private enterprise edition remaining safe. Malicious Docker tags for LiteLLM were deleted, pointing main tags to clean sources. For the eMudhra CA trust incident, the problematic root CA was dropped, with pip 26.2.2 required to clear trust stores.

Managed PHP hosting providers like Hetzner deployed patches across PHP 5.x, 7.x, and 8.x versions to address the critical PHP vulnerabilities. While providers took rapid action, downstream developers and system administrators still need to take direct action, such as updating dependencies and rotating credentials, to ensure full remediation.

**Key facts**

- LiteLLM malicious PyPI package pulled after two hours
- eMudhra CA root dropped; pip 26.2.2 required for trust store clear
- Hetzner deployed PHP patches across all PHP versions
- Remediation requires direct action from downstream users

**Why it matters:** While providers contained immediate threats, engineers must still perform necessary updates (e.g., `pip 26.2.2`), rotate compromised credentials, and ensure their systems are free of lingering malicious artifacts. This highlights the ongoing responsibility of users in the supply chain to secure their environments even after initial containment.

> Provider-level containment of October's security incidents is complete, but user action is essential for full remediation.

[🔗 Read more at DEV Community](https://dev.to/coldcasetech/october-2026-security-incidents-supply-chain-cas-and-cloud-breaches-remediated-3k32)

---

## LLM API true cost depends on cache rates, output ratios, and pricing thresholds, not just headline price

*AI Models · DEV Community · 2026-10-22*

![Cheapest LLM API in 2026: What to Actually Pick - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fmgkcaurn5h9s7q2d1jw4.png)

As of October 2026, the real cost of LLM APIs is not solely determined by the headline per-token price, but by a combination of cache rates, output ratios, and pricing thresholds. Models with lower per-token prices may not be the cheapest on the invoice.

For example, GPT-6.1 Sol has an input rate of $2.00/1M and a cached input rate of $0.10/1M, which is 5% of its input rate. In contrast, GPT-5.6 Sol (promo) has a cached input rate of $0.40/1M, 10% of its $4.00/1M input rate. Claude Opus 5.5's cached input is $0.20/1M. These differences in cache rates can significantly impact costs on cache-heavy workloads.

Output ratios also matter; verbose models can incur higher output token costs, negating input savings. Current promotional rates for GPT-5.6 Sol ($4.00/$0.40/$20.00) are valid until at least November 21, 2026, while Gemini 4 Argon's intro rate ($2.00/—/$10.00) doubles on December 1, 2026. Engineers should model costs based on their specific cache ratio and expected output verbosity rather than just headline prices.

**Key facts**

- GPT-5.6 Sol promo: $4.00 input, $0.40 cached input, $20.00 output per 1M tokens (until Nov 21, 2026)
- GPT-6.1 Sol: $2.00 input, $0.10 cached input, $10.00 output per 1M tokens
- Gemini 4 Argon intro: $2.00 input, $10.00 output per 1M tokens (until Nov 30, 2026, then doubles)

**Why it matters:** Engineers deploying LLMs must perform detailed cost modeling that accounts for cache hit rates and expected output verbosity, not just published input/output prices. Failure to do so could lead to significantly higher-than-anticipated cloud bills, especially for high-volume or cache-heavy applications.

> LLM API pricing is complex; cache rates and output verbosity dictate true costs beyond headline per-token rates.

[🔗 Read more at DEV Community](https://dev.to/hammad_malik_d39574d24320/cheapest-llm-api-in-2026-what-to-actually-pick-pc3)

---

## Cloudflare deployed WAF protections against php2shell vulnerabilities before public disclosure

*Security · Cloudflare Blog · 2026-10-21*

![Cloudflare deploys protections against php2shell vulnerability | Cloudflare Blog](https://blog.cloudflare.com/_emdash/api/media/file/01M5FBPSP6GA0RRJ5FDQ68S476.png)

Cloudflare successfully deployed Web Application Firewall (WAF) protections against the recently disclosed php2shell vulnerabilities (CVE-2026-109618 and CVE-2026-109619) for all its customers. These two critical flaws in PHP 5.4 and later allow remote code execution, denial of service, and data exposure when processing crafted HTTP traffic.

Cloudflare's protections were rolled out starting October 21, 2026, at 3:02 am UTC, approximately nine hours before public disclosure. The company observed attack traffic targeting its customers even before the official release date and adapted its WAF rules as attackers mutated payloads to bypass defenses. To provide effective protection, Cloudflare developed a new WAF capability called full transaction detection, which combines signals from both request and response within the same HTTP transaction to distinguish exploits from legitimate traffic and reduce false positives.

**Key facts**

- Cloudflare WAF protections deployed Oct 21, 2026, 3:02 am UTC
- Protections deployed 9 hours ahead of public disclosure
- Vulnerabilities: CVE-2026-109618, CVE-2026-109619 (php2shell)
- Affects PHP 5.4 or later

**Why it matters:** Organizations using Cloudflare WAF had pre-emptive protection against the critical php2shell flaws. This highlights the value of advanced WAFs with adaptive capabilities and full transaction detection for mitigating zero-day threats, especially when vulnerabilities are being actively exploited before official patches are widely available.

> Cloudflare's WAF provided early protection against php2shell, showcasing the importance of advanced, adaptive WAF solutions.

[🔗 Read more at Cloudflare Blog](https://blog.cloudflare.com/php-vulnerabilities-waf-protection)

---

## Quick hits

- **[Vercel releases Chat SDK for Next.js 15.1 and later, enabling Slack bot development](https://vercel.com/docs/chat-sdk/frameworks/nextjs)** (Vercel) — Vercel has released a Chat SDK, allowing developers to build Slack bots within existing Next.js 15.1 or later applications, using App Router Route Handlers and Vercel Connect for authentication.

---

## What to watch

- The timeline for stable Linux kernel fixes for the KSMBD RCE flaws and their subsequent availability in distribution kernels.
- How Anthropic's custom source control system evolves and whether other AI companies adopt similar strategies as AI agents accelerate code generation.
- The ongoing impact of AI-driven vulnerability discovery and the development of AI-powered defensive tools to counter the increasing speed of attacks.

---

## Sources

- [Black October security alert: Six critical vulnerabilities disclosed in 48 hours, including PHP, GitLab, and AI gateway](https://dev.to/aegisgate/black-october-a-blue-team-field-guide-122i) — DEV Community, 2026-10-22
- [Critical GitLab RCE flaw (CVSS 10.0) patched, affecting all self-managed versions since 7.0 (2014)](https://thehackernews.com/2026/10/critical-gitlab-flaw-cvss-100-could.html) — The Hacker News, 2026-10-22
- [Two CVSS 9.0 RCE flaws in Linux KSMBD disclosed publicly before kernel fixes](https://thehackernews.com/2026/10/two-cvss-90-linux-ksmbd-rce-flaws.html) — The Hacker News, 2026-10-22
- [AI accelerates vulnerability discovery, outstripping maintainers' ability to patch, exemplified by PHP2Shell](https://thenewstack.io/php2shell-ai-vulnerabilities-maintainers) — The New Stack, 2026-10-22
- [Google Cloud's Knowledge Catalog introduces self-learning context enrichment for AI agents](https://cloud.google.com/blog/products/data-analytics/knowledge-catalog-self-learning-context-enrichment-for-ai-agents) — Google, 2026-10-23
- [Anthropic moves off Git and builds custom source control system due to AI agent development bottlenecks](https://blog.pragmaticengineer.com/the-pulse-anthropic-builds-its-own-source-control-system) — The Pragmatic Engineer, 2026-10-22
- [October 2026 security incidents including LiteLLM and eMudhra CA largely remediated by providers](https://dev.to/coldcasetech/october-2026-security-incidents-supply-chain-cas-and-cloud-breaches-remediated-3k32) — DEV Community, 2026-10-22
- [LLM API true cost depends on cache rates, output ratios, and pricing thresholds, not just headline price](https://dev.to/hammad_malik_d39574d24320/cheapest-llm-api-in-2026-what-to-actually-pick-pc3) — DEV Community, 2026-10-22
- [Cloudflare deployed WAF protections against php2shell vulnerabilities before public disclosure](https://blog.cloudflare.com/php-vulnerabilities-waf-protection) — Cloudflare Blog, 2026-10-21
- [Vercel releases Chat SDK for Next.js 15.1 and later, enabling Slack bot development](https://vercel.com/docs/chat-sdk/frameworks/nextjs) — Vercel, 2026-10-23
