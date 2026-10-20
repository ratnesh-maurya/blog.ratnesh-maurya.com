---
title: 'Microsoft warns on AI agent trust, Anthropic in $45B compute'
description: >-
  This digest covers Microsoft's new security features for AI agents, a
  potential $45 billion compute deal for Anthropic, critical NGINX
  vulnerabilities, and a
date: '2026-10-20'
tags:
  - Microsoft Guardian Agents
  - Anthropic
  - Nscale
  - Plex2Shell
  - NGINX vulnerabilities
  - ConnectWise Cloud Backup
  - GhostAction
  - SAP Signavio
source: tavily
stories: 10
sources:
  - TechCrunch
  - The Register
  - The Hacker News
  - BleepingComputer
  - DEV Community
  - Simon Willison's Weblog
---

Today's news highlights a growing tension between the rapid adoption of AI agents and the critical need for robust security. While AI agent development is accelerating, Microsoft's new Guardian Agents and its CEO's warnings underscore the unpredictable nature of frontier models, positioning independent security solutions as essential. This shift towards greater scrutiny and separation of concerns is the most impactful story for engineers.

## TL;DR

- **Microsoft Releases Guardian Agents to Combat Untrusted AI Agents and Insider Threats** — Microsoft introduced Guardian Agents, part of Project Perception, to monitor and control AI agents within enterprises, emphasizing that "frontier models cannot be trusted."
- **ConnectWise Shuts Down Cloud Backup and Security Services Due to Unauthorized Access** — ConnectWise suspended its Cloud Backup, SaaS Security, and Cloud Management services after detecting unauthorized access to application identities within its Cloud Backup environment.
- **Plex Media Server Vulnerabilities Exploited to Deploy Crypto Miners and Backdoors** — Hackers are exploiting a chain of four vulnerabilities, collectively named Plex2Shell, in Plex Media Server to install cryptocurrency miners and reverse proxy software.
- **F5 Releases Out-of-Band Patches for Critical NGINX Code Execution Flaws** — F5 released out-of-band patches for three critical NGINX vulnerabilities that allow unprivileged remote attackers to execute code or launch denial-of-service attacks.
- **GhostAction Attackers Distribute Credential Stealers in 94 GitHub Repositories** — The GhostAction threat group has compromised 94 GitHub repositories by injecting credential-stealing malware disguised as a font file.
- **Anthropic and Nscale in Talks for Another $45 Billion Compute Deal** — Anthropic and Nscale are reportedly in talks for a second $45 billion compute deal, following a similar agreement announced a month prior.
- **SAP Signavio Faces German Injunction Over Patent Infringement** — A German court has issued an injunction against SAP, banning specific features of its Signavio product in Germany due to patent infringement claims by Celonis.
- **The 2026 Agentic AI Roadmap Guides Developers from Basics to Production** — A 7-step roadmap has been created to guide developers through building production-ready AI agents, covering foundations to ecosystem considerations.
- **Anthropic Reports Q3 Revenue of $16.8 Billion, Curbs Model Distillation** — Anthropic's Q3 revenue reached $16.8 billion, with a reported $1.70 revenue for every $1 spent on computing power, and the company has "materially" cut back on rival AI labs distilling its models.
- **This week's recap: 98 Zero-Days, Rogue AI Agents, $100M Crypto Theft, 700 Supermarkets Hit** — This article is a weekly security recap mentioning various threats including zero-days, AI agents, and a crypto theft, but provides no new specific details.

---

## Microsoft Releases Guardian Agents to Combat Untrusted AI Agents and Insider Threats

*Top story · AI Agents & Tooling · TechCrunch · 2026-10-20*

![AI agents, AI swarm, agent hackers](https://techcrunch.com/wp-content/uploads/2026/10/Networked-AI-swarm-with-glowing-nodes.png?w=1024)

Microsoft launched Guardian Agents, a new security feature within Project Perception, designed to protect enterprises from AI agent threats. Project Perception, initially introduced in June, focused on external AI hackers, but Microsoft CEO Satya Nadella has shifted focus to internal AI agents as potential "insider threats."

Nadella has warned that enterprises cannot outsource responsibility for AI actions and need separate systems, independent of AI labs, to monitor agents. Microsoft's security business chief, Hayete Gallot, stated that "frontier models, regardless of their origin, cannot be trusted" due to their unpredictability, not malice. Guardian Agents aims to address this by monitoring agents that may have access to sensitive data and mission-critical actions.

Microsoft also added an agent detection feature to Microsoft Defender, capable of identifying up to 60 types of agents employees might introduce. While Microsoft has investments in OpenAI and Anthropic, its strategy is to offer agent security products as an independent auditor of AI agent behavior.

**Key facts**

- Guardian Agents launched
- Part of Project Perception, introduced in June
- Microsoft Defender detects up to 60 agent types

**Why it matters:** Engineers deploying AI agents must now explicitly consider independent monitoring and control mechanisms, separate from the model providers, to manage unpredictable behavior and mitigate potential insider threat vectors. This implies a need to evaluate new security tools like Guardian Agents.

> Enterprises must implement independent security systems to monitor and control AI agents, as even frontier models from trusted providers cannot be fully trusted due to inherent unpredictability.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/19/microsoft-says-ai-agents-are-like-insider-threats-as-frontier-models-cant-be-trusted/)

---

## ConnectWise Shuts Down Cloud Backup and Security Services Due to Unauthorized Access

*Security · The Register · 2026-10-19*

![ConnectWise turns off its SaaS-y backup, security, and management services to probe security SNAFU - The Register](https://image.theregister.com/262396.jpg?imageId=262396&x=0&y=0&cropw=100&croph=100&panox=0&panoy=0&panow=100&panoh=100&width=1200&height=683)

ConnectWise has initiated a "service interruption" for several of its offerings, including Cloud Backup, SaaS Security, and Cloud Management, due to unauthorized access detected within its Cloud Backup environment. The incident, identified on October 15, involved unauthorized access to application identities.

Huntress, a security firm, reported that a Microsoft 365 credential (API secret) belonging to ConnectWise Cloud Backup was compromised and used to gain unauthorized access to customers' M365 environments. In one instance, a ConnectWise Cloud Management application gained Global Administrator privileges and added new credentials to other applications within a client's Microsoft 365 tenant.

ConnectWise's VP of security operations, Jason Ferguson, stated that existing archives remain encrypted, isolated, and preserved, with no evidence of unauthorized access to archives themselves. However, the services remain unavailable as of October 18, preventing end-users from backing up or restoring data. ConnectWise has disabled some integrations and provided indicators of compromise (IoCs) but has not disclosed threat actor attribution.

**Key facts**

- Services suspended: Cloud Backup, SaaS Security, Cloud Management
- Unauthorized access detected Oct 15, 2026
- Microsoft 365 credential (API secret) compromised
- ConnectWise Cloud Management gained Global Admin in client M365 tenant

**Why it matters:** MSPs and their clients using ConnectWise Cloud Backup, SaaS Security, or Cloud Management must immediately review credentials on all their Microsoft 365 applications, as disabling ConnectWise apps alone will not remove any already-added rogue credentials. This is a critical incident requiring immediate action to prevent further tenant compromise.

> ConnectWise's security breach exposes customers to M365 credential theft and requires manual inspection of application credentials to mitigate ongoing risks.

[🔗 Read more at The Register](https://www.theregister.com/security/2026/10/19/connectwise-turns-off-its-saas-y-backup-security-and-management-services-to-probe-security-snafu/5303758)

---

## Plex Media Server Vulnerabilities Exploited to Deploy Crypto Miners and Backdoors

*Security · The Hacker News · 2026-10-19*

![cybersecurity](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2IlqZRz59oSh813xvx6J6LZwp36zTJVBxQ-PeUsJRUAsFcG59ozpg3_EkL6lxZPOdBGD_o8YVUq2CVyutLmT7SgKt513yyCnRmX1J8e5b358cLIneCtSSp46pMvfQ-md9-VagqDnUxxJPuU1CFx7hjpZv75B2E77SI400cPs5PKE4H0uWsGfvEwg_lfzn/s728-nu-rw-lo-l85-e365/prompt-injection-response-d.png)

Threat actors are actively exploiting a chain of four vulnerabilities, dubbed Plex2Shell, in Plex Media Server to deploy cryptocurrency miners and Linux proxy backdoors. This exploitation began a day after a proof-of-concept (PoC) for the flaw chain became public.

The vulnerabilities include CVE-2026-96652 (SSRF, CVSS 5.3), CVE-2026-96654 (URL neutralization, CVSS 6.9), CVE-2026-96655 (SSRF, CVSS 5.3), and CVE-2026-96656 (external file control, CVSS 8.6). When chained, these allow unauthenticated remote code execution on vulnerable Plex Media Server instances. The vulnerabilities were disclosed to Plex on July 27, 2026, by Zach Main and patched in Plex Media Server 1.43.3.10861, released on August 3, 2026.

Exploitation attempts have been observed deploying a miner payload from a remote server (217.60.194.116) and an artifact named "myawesomeproxy," which is a Linux proxy backdoor. Specific IP addresses observed in the attacks include 91.92.40.202, 176.65.139.228, and 45.194.92.222.

**Key facts**

- Plex2Shell: 4 vulnerabilities (CVE-2026-96652, -96654, -96655, -96656)
- Patched in Plex Media Server 1.43.3.10861 on August 3, 2026
- Exploitation seen deploying crypto miners and "myawesomeproxy" backdoor
- PoC went public October 16, 2026

**Why it matters:** System administrators running Plex Media Server must immediately ensure their installations are updated to version 1.43.3.10861 or newer to prevent unauthenticated remote code execution and subsequent compromise with cryptocurrency miners or backdoors.

> Actively exploited Plex Media Server vulnerabilities necessitate urgent patching to prevent remote code execution and system compromise.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/10/hackers-exploit-plex2shell-flaws-to.html)

---

## F5 Releases Out-of-Band Patches for Critical NGINX Code Execution Flaws

*Security · BleepingComputer · 2026-10-19*

![Bullhorn takes staffing platform offline to contain cyberattack](https://www.bleepstatic.com/content/hl-images/2026/10/19/thumb/211x130_bullhorn.jpg)

F5 has issued out-of-band security patches to address multiple NGINX web server vulnerabilities, including three critical-severity flaws that could enable remote code execution. The critical vulnerabilities, CVE-2026-15176 and CVE-2026-97205, affect the ngx_http_v3_module, while CVE-2026-93479 impacts the NGINX map directive.

These flaws can be exploited by unprivileged remote attackers with non-default NGINX configurations, potentially leading to denial-of-service (DoS) attacks or code execution. Successful exploitation causes heap-based buffer overflows or use-after-free errors, resulting in NGINX worker process crashes or restarts. Code execution is possible if Address Space Layout Randomization (ASLR) is disabled or bypassed.

Patches are available for NGINX Plus, NGINX Open Source, NGINX Ingress Controller, NGINX Gateway Fabric, and NGINX Instance Manager. Mitigations for CVE-2026-15176 include avoiding the 'alias' directive in location blocks or the $request_filename variable; for CVE-2026-97205, disabling asynchronous file I/O (AIO) or Server Side Includes (SSI); and for CVE-2026-93479, using named captures instead of unnamed captures and limiting their use to the regex match block. F5 has not flagged these as actively exploited.

**Key facts**

- Three critical NGINX vulnerabilities patched: CVE-2026-15176, CVE-2026-97205, CVE-2026-93479
- Affect ngx_http_v3_module and NGINX map directive
- Patches available for NGINX Plus, NGINX Open Source, NGINX Ingress Controller, NGINX Gateway Fabric, NGINX Instance Manager
- Mitigations provided for each CVE

**Why it matters:** System administrators running NGINX must apply these out-of-band patches immediately or implement specified mitigations to prevent critical remote code execution and denial-of-service attacks, especially if using non-default configurations or the affected modules.

> Critical NGINX vulnerabilities require urgent patching or mitigation to prevent remote code execution and service disruption.

[🔗 Read more at BleepingComputer](https://www.bleepingcomputer.com/news/security/f5-releases-out-of-band-patches-for-critical-nginx-vulnerabilities/)

---

## GhostAction Attackers Distribute Credential Stealers in 94 GitHub Repositories

*Security · The Hacker News · 2026-10-19*

![GhostAction Attackers Plant Credential Stealer Disguised as Font in 94 GitHub Repositories](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtAKfaW5dHhlv9lpzzAju1Cm_EjO4wOkhGQEMspSKCVFUCA_eaanAXGHkb-Dv3c9zSXWHW45I50Fp_bqX6ydaNlPWixkd39bl4IOeYv8xQ0oviE4d6SZcQmQ27ztf-tVV7BozEDeFYi2Fde0LpJAJ9gTHUGSOvc46MtgawesAd5-wljApeBpLyUYnczZnR/s1700-nu-rw-lo-l85-e365/git-font.jpg)

The GhostAction threat group has compromised 94 GitHub repositories by embedding credential-stealing malware. The malware is disguised as a font file and targets developers who might unknowingly integrate it into their projects.

This attack vector allows the attackers to gain unauthorized access to developer credentials, posing a significant supply chain risk. The nature of the disguise, a font, suggests an attempt to bypass typical security scans and appear innocuous within a repository's files.

The widespread compromise across numerous repositories indicates a sophisticated and broad-reaching campaign aimed at exploiting trust within the open-source software ecosystem. Developers are advised to scrutinize dependencies and source code for unusual or unexpected additions.

**Key facts**

- GhostAction group responsible
- 94 GitHub repositories compromised
- Malware disguised as a font file
- Credential stealer deployed

**Why it matters:** Developers must heighten vigilance when pulling dependencies or forking repositories from GitHub, as compromised repositories can introduce credential-stealing malware into their development environments and software supply chains. Regular audits of repository integrity and dependency scanning are crucial.

> Developers must be wary of hidden malware in GitHub repositories, even when disguised as benign files like fonts, to prevent credential theft and supply chain compromises.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/10/ghostaction-attackers-plant-credential.html)

---

## Anthropic and Nscale in Talks for Another $45 Billion Compute Deal

*Cloud & Infrastructure · TechCrunch · 2026-10-20*

![Five smoke stacks stand at a construction site in Texas.](https://techcrunch.com/wp-content/uploads/2026/07/GettyImages-2236544023.jpeg?w=1024)

AI infrastructure provider Nscale and Anthropic are reportedly nearing an agreement for another $45 billion compute deal. This follows an initial $45 billion deal announced just over a month ago, as reported by Bloomberg.

Sources familiar with the matter cautioned that talks are ongoing and details could change. Both companies are also pursuing IPOs, with Anthropic expected to go public this year. Bloomberg reported that Nscale is facing investor pushback on its proposed $30 billion valuation.

> ⚠️ **Heads up:** This report is based on sources familiar with the matter, and talks are still underway, so details could change.

**Key facts**

- Second $45 billion compute deal in talks
- First $45 billion deal announced a month ago
- Nscale proposed valuation: $30 billion

**Why it matters:** The massive scale of these compute deals indicates sustained, high demand for AI infrastructure, which could impact cloud resource availability and pricing for other users over time.

> AI compute demands continue to drive multi-billion dollar infrastructure deals, signaling a persistent, high-cost environment for frontier model development.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/19/nscale-and-anthropic-are-reportedly-in-talks-for-yet-another-45-billion-compute-deal/)

---

## SAP Signavio Faces German Injunction Over Patent Infringement

*Industry · The Register · 2026-10-19*

![Close-up of a hand typing on a laptop keyboard in a dark room](https://image.theregister.com/5265729.jpg?imageId=5265729&panox=0.00&panoy=0.00&panow=100.00&panoh=100.00&heightx=0.00&heighty=0.00&heightw=100.00&heighth=100.00&width=960&height=432&format=webp&format=jpg)

A German court in Munich has issued an injunction preventing SAP from offering certain features of its Signavio product in Germany. The ruling stems from a legal challenge by process mining company Celonis, which alleges patent infringement.

The specific patent infringed covers technology used to determine the lead time between process stages within a process instance. SAP stated that the ruling affects only "one specific function within SAP Signavio Process Intelligence" and not the entire product. SAP Signavio Process Intelligence remains available to customers, and S/4HANA Cloud migrations are unaffected.

SAP disagrees with the decision and has appealed. The company has also challenged the validity of Celonis's patent before the Federal Patent Court. This injunction is part of a broader set of intellectual property disputes between SAP and Celonis, including other patent actions in Germany and the United States.

**Key facts**

- German court issued injunction against SAP Signavio
- Injunction based on Celonis patent infringement claim
- Affects a specific function in SAP Signavio Process Intelligence
- SAP has appealed the decision

**Why it matters:** Engineers using SAP Signavio Process Intelligence, particularly those in Germany, should be aware that certain process analysis functionalities may be restricted or unavailable due to this injunction and ongoing legal appeals.

> A German court injunction restricts specific functions of SAP Signavio due to patent infringement, highlighting legal risks in the competitive process mining market.

[🔗 Read more at The Register](https://www.theregister.com/legal/2026/10/19/saps-signavio-hit-with-function-injunction-in-germany/5303835)

---

## The 2026 Agentic AI Roadmap Guides Developers from Basics to Production

*AI Agents & Tooling · DEV Community · 2026-10-18*

![The 2026 Agentic AI Roadmap: From LLM Basics to Production - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Ff3rec2kx2p9j8itnb0ae.png)

A 7-step learning path, adapted from a video by Krish Naik, has been introduced to help developers bridge the gap between building a basic AI agent and deploying a production-ready agentic AI product. The roadmap aims to provide a structured approach in a rapidly evolving field where new tools constantly emerge.

The steps include: foundation, core components, orchestration, RAG and retrieval, design patterns, safety and evaluation, and finally production and the ecosystem. This guide is designed to be useful for both beginner and senior developers and is built to adapt as the field changes, allowing adjustments within the existing framework rather than starting over.

**Key facts**

- 7-step learning path for agentic AI
- Covers foundation, core components, orchestration, RAG/retrieval, design patterns, safety/evaluation, production/ecosystem
- Adaptable for beginners and senior developers

**Why it matters:** Engineers looking to move AI agent prototypes to production can use this roadmap as a structured guide to cover critical areas like safety, evaluation, and system design, avoiding common pitfalls in a new and complex domain.

> A structured 7-step roadmap is crucial for transitioning AI agent development from simple builds to robust, production-ready systems.

[🔗 Read more at DEV Community](https://dev.to/swayam_dc1eefb8839da110de/the-2026-agentic-ai-roadmap-from-llm-basics-to-production-3eh6)

---

## Anthropic Reports Q3 Revenue of $16.8 Billion, Curbs Model Distillation

*AI Models · Simon Willison's Weblog · 2026-10-17*

![Stacked bar chart titled “Changes merged per day”, for the Anthropic monorepo, January–September 2026. Each day’s bar is split into pull requests (blue) and antique change requests (orange), with a black line for the 7-day average. Weekdays start at around 1,000 merges in January and climb slowly to about 3,000 by late May. Antique change requests appear in late May, overtake pull requests in mid-June and have almost fully replaced them by mid-July, when weekdays reach 6,000–8,000. A labelled “Quiet week” at the end of July dips below 1,000 a day. After that, growth turns steep: over 10,000 a day by mid-August, about 17,000 in early September, and a peak of 30,401 on Sep 9. Dotted lines mark Claude model releases: Opus 4.6 (Feb 5), Sonnet 4.6 (Feb 17), Mythos Preview (Apr 7), Opus 4.7 (Apr 16), Opus 4.8 (May 28), Fable 5 and Mythos 5 (Jun 9), Sonnet 5 (Jun 30), Opus 5 (Jul 24, just before the quiet week), and Fable 5.1 and Mythos 5.1 (Sep 1).](https://static.simonwillison.net/static/2026/anthropic-merges-per-day.webp)

Ahead of its anticipated IPO, Anthropic reported to investors that its Q3 revenue was $16.8 billion, a significant increase from Q2's $11.5 billion and Q1's $4.8 billion. The company achieved an adjusted operating margin of 11% (excluding stock-based compensation).

Anthropic also stated that it generated $1.70 in revenue for every $1 spent on computing power during Q3. The company has "materially" reduced the controversial practice of "distillation," where rival AI labs train their models on Anthropic's outputs. Distillation previously accounted for 5% to 7% of Anthropic's revenue, implying other labs spent over half a billion dollars distilling its models in Q2 alone.

**Key facts**

- Q3 revenue: $16.8 billion
- Q2 revenue: $11.5 billion
- Q1 revenue: $4.8 billion
- $1.70 revenue for every $1 spent on compute in Q3
- Adjusted operating margin: 11%
- Distillation previously 5%-7% of revenue

**Why it matters:** The reported high revenue-to-compute ratio suggests that Anthropic's models are generating significant value, while the crackdown on distillation indicates a move to protect intellectual property and maximize direct monetization, potentially impacting other AI labs relying on this practice.

> Anthropic is demonstrating strong financial performance and actively protecting its model IP by reducing distillation practices.

[🔗 Read more at Simon Willison's Weblog](https://simonwillison.net/blogmarks)

---

## Quick hits

- **[This week's recap: 98 Zero-Days, Rogue AI Agents, $100M Crypto Theft, 700 Supermarkets Hit](https://thehackernews.com/2026/10/weekly-recap-98-zero-days-rogue-ai.html)** (The Hacker News) — This article is a weekly security recap mentioning various threats including zero-days, AI agents, and a crypto theft, but provides no new specific details.

---

## What to watch

- The outcome of Nscale's reported second $45 billion compute deal with Anthropic and its impact on Nscale's IPO valuation.
- The long-term effectiveness and adoption of Microsoft's Guardian Agents in mitigating AI agent risks within enterprise environments.
- Further developments in the legal disputes between SAP and Celonis regarding patent infringement and the scope of the injunction against SAP Signavio.

---

## Sources

- [Microsoft Releases Guardian Agents to Combat Untrusted AI Agents and Insider Threats](https://techcrunch.com/2026/10/19/microsoft-says-ai-agents-are-like-insider-threats-as-frontier-models-cant-be-trusted/) — TechCrunch, 2026-10-20
- [ConnectWise Shuts Down Cloud Backup and Security Services Due to Unauthorized Access](https://www.theregister.com/security/2026/10/19/connectwise-turns-off-its-saas-y-backup-security-and-management-services-to-probe-security-snafu/5303758) — The Register, 2026-10-19
- [Plex Media Server Vulnerabilities Exploited to Deploy Crypto Miners and Backdoors](https://thehackernews.com/2026/10/hackers-exploit-plex2shell-flaws-to.html) — The Hacker News, 2026-10-19
- [F5 Releases Out-of-Band Patches for Critical NGINX Code Execution Flaws](https://www.bleepingcomputer.com/news/security/f5-releases-out-of-band-patches-for-critical-nginx-vulnerabilities/) — BleepingComputer, 2026-10-19
- [GhostAction Attackers Distribute Credential Stealers in 94 GitHub Repositories](https://thehackernews.com/2026/10/ghostaction-attackers-plant-credential.html) — The Hacker News, 2026-10-19
- [Anthropic and Nscale in Talks for Another $45 Billion Compute Deal](https://techcrunch.com/2026/10/19/nscale-and-anthropic-are-reportedly-in-talks-for-yet-another-45-billion-compute-deal/) — TechCrunch, 2026-10-20
- [SAP Signavio Faces German Injunction Over Patent Infringement](https://www.theregister.com/legal/2026/10/19/saps-signavio-hit-with-function-injunction-in-germany/5303835) — The Register, 2026-10-19
- [The 2026 Agentic AI Roadmap Guides Developers from Basics to Production](https://dev.to/swayam_dc1eefb8839da110de/the-2026-agentic-ai-roadmap-from-llm-basics-to-production-3eh6) — DEV Community, 2026-10-18
- [Anthropic Reports Q3 Revenue of $16.8 Billion, Curbs Model Distillation](https://simonwillison.net/blogmarks) — Simon Willison's Weblog, 2026-10-17
- [This week's recap: 98 Zero-Days, Rogue AI Agents, $100M Crypto Theft, 700 Supermarkets Hit](https://thehackernews.com/2026/10/weekly-recap-98-zero-days-rogue-ai.html) — The Hacker News, 2026-10-19
