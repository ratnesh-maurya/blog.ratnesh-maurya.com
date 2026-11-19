---
title: 'Ruby, NGINX Critical Vulnerabilities; Windows Server 2028 Hardens'
description: >-
  This digest covers critical security patches for Ruby and NGINX, Google's new
  Gemini 4 Neon AI model, and Microsoft's security-hardened Windows Server 2028
date: '2026-11-19'
tags:
  - Ruby
  - NGINX
  - Windows Server 2028
  - Gemini 4 Neon
  - Anthropic
  - AI Agents
  - Security
  - Chainguard
source: tavily
stories: 10
sources:
  - The Hacker News
  - The Register
  - VentureBeat
  - WIRED
  - TechCrunch
  - BleepingComputer
  - Siliconangle
---

Today's news highlights a tension between rapid AI advancement and the growing sophistication of cyber threats, underscored by major vulnerability disclosures in foundational software. The most impactful story is the emergency patches for NGINX and Ruby, which require immediate attention from developers and administrators.

## TL;DR

- **Ruby Releases Critical Fixes for 7 Regex and String Memory-Safety Flaws, 5 With RCE PoCs** — Ruby released versions 4.0.10, 3.4.13, and 3.3.14 to fix seven memory-safety flaws, five of which have proof-of-concept exploits for remote code execution.
- **AI Helps Researchers Find 10 Critical NGINX Bugs, Including Remote Code Execution** — F5 released emergency patches for 10 bugs in open-source NGINX, including critical remote code execution flaws affecting NGINX servers with HTTP/2 enabled, found by AI-assisted research.
- **Google Launches Gemini 4 Neon AI Model with Opus 5.5-Level Coding Performance at Lower Prices** — Google launched Gemini 4 Neon, a new mid-range AI large language model on its paid Gemini API, offering Opus 5.5-level coding performance at 25% lower token prices.
- **Criminals Adopt New AI Agent Hacking Tools for Autonomous Attacks** — Cybercriminals are increasingly using AI-powered penetration testing tools like Artex to autonomously scan networks, find vulnerabilities, and launch attacks at unprecedented speeds.
- **Windows Server 2028 Public Preview Hardens Security Defaults, Impacts Compatibility** — Microsoft released Windows Server 2028 into public preview with a hardened Server Core configuration by default, which improves security but may break compatibility with older protocols and scripts.
- **OX Security Launches OX Radar and Response Center for Prioritized Threat Management** — OX Security launched OX Radar and Response Center, providing security teams a centralized platform to track high-priority cyber threats, assess their impact on organizations, and manage remediation.
- **Microsoft Reveals Windows Server 2028 with Default Hardened Security at Ignite 2026** — Microsoft officially announced Windows Server 2028 at Ignite 2026, featuring a hardened Server Core configuration by default and new security baselines to reduce initial security setup work.
- **Decision Model Use Surges; Customization Becomes Next Frontier** — Decision model usage is rapidly increasing, accounting for over a quarter of Vercel AI router requests in October, with customization emerging as a key differentiator for these models.
- **Chainguard Launches Self-Serve Free and $500/Month Team Plans for Software Supply Chain Security** — Chainguard now offers self-serve Starter (free) and Team ($500/month) plans, providing access to its software supply chain security products, including minimal container images and scanned dependencies.
- **Anthropic CEO Reaffirms Commitment to Responsible AI Development at Nasdaq IPO** — Anthropic CEO Dario Amodei reaffirmed the company's commitment to responsible AI development and safety, vowing to pace AI training and deployment despite IPO pressures.

---

## Ruby Releases Critical Fixes for 7 Regex and String Memory-Safety Flaws, 5 With RCE PoCs

*Top story · Security · The Hacker News · 2026-11-19*

![cybersecurity](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1FgbfB9gCsTYnkXg_UHMHoWinmHvbkdAdbnpnrFQzzIG00gtoQsaz3DVhUgvHic2vd-yM_5XIb9H5N6i7stc2WQFHqPn9bN7B_IIFDtEJbNnNcvNZ3IbmHi-kKM8V_3VaZj1zzoHwCVjkzUQwFzzTMhaTH7W2jlKhsI9m3HEBAVjHyuBiJBdX0l8jX9Ll/s727-nu-rw-lo-l85-e365/wiz-d.png)

Ruby's maintainers have released emergency fixes for seven memory-safety flaws found in its regular expression engine and string case-conversion code. Five of these vulnerabilities have proof-of-concept (PoC) exploits that can lead to remote code execution (RCE) via crafted input.

The project rates three flaws as critical, three as high, and one as moderate. The critical flaws include a one-byte heap overflow in string case conversion (GHSA-34m4-m9fh-gqp5), a double free in regex compilation (GHSA-7x2q-68qv-6p8x), and a heap overflow during regex compilation (GHSA-3p8q-wmhx-vm2w). Fixed versions are Ruby 4.0.10, 3.4.13, and 3.3.14. No active attacks have been reported so far.

**Key facts**

- 7 memory-safety flaws
- 5 RCE PoCs
- Ruby 4.0.10, 3.4.13, 3.3.14 released
- 3 flaws rated Critical

**Why it matters:** Ruby developers must update immediately to the patched versions to mitigate the risk of remote code execution, especially if their applications process untrusted string or regex input. Failure to patch could expose systems to severe compromise.

> Update Ruby to the latest patched versions to prevent potential remote code execution from critical regex and string vulnerabilities.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/11/ruby-releases-fixes-for-7-regex-and.html)

---

## AI Helps Researchers Find 10 Critical NGINX Bugs, Including Remote Code Execution

*Security · The Register · 2026-11-19*

![Oil platform under maintenance in Bergen harbor, with cranes, work decks and reflections at dusk.](https://image.theregister.com/5311057.jpg?imageId=5311057&panox=0.00&panoy=0.00&panow=100.00&panoh=100.00&heightx=0.00&heighty=0.00&heightw=100.00&heighth=100.00&width=960&height=432&format=webp&format=jpg)

F5 has issued emergency patches for 10 vulnerabilities in open-source NGINX, including critical remote code execution (RCE) flaws. These RCE bugs allow attackers to hijack NGINX servers with HTTP/2 enabled, affecting millions of websites, for data theft and service disruption. One of these critical RCE flaws, CVE-2026-123007, has been present in NGINX versions since 1.9.5 in 2015.

All vulnerabilities were discovered by researchers using AI, with no evidence of active exploitation found so far. The two most serious RCE flaws, CVE-2026-123633 and CVE-2026-123007, both received a critical 9.2 CVSS rating. These are memory-safety issues in how NGINX handles HTTP/2 traffic: a use-after-free and an incorrect flow-control accounting leading to an invalid memory copy. Rapid7 has published a proof-of-concept for CVE-2026-123007.

**Key facts**

- 10 NGINX bugs patched
- Critical RCE flaws (CVE-2026-123633, CVE-2026-123007)
- Affects NGINX 1.9.5 and later with HTTP/2 enabled
- CVSS rating: 9.2 Critical
- AI-assisted discovery

**Why it matters:** NGINX administrators must update to version 1.31.9 immediately, especially if HTTP/2 is enabled. These critical RCE flaws pose a severe risk to web server integrity and data security, necessitating prompt patching to prevent unauthenticated remote code execution.

> Patch NGINX to version 1.31.9 immediately, particularly if HTTP/2 is active, to close critical remote code execution vulnerabilities.

[🔗 Read more at The Register](https://www.theregister.com/security/2026/11/18/ai-found-more-critical-bugs-in-another-widely-used-technology-running-225m-websites/5310887)

---

## Google Launches Gemini 4 Neon AI Model with Opus 5.5-Level Coding Performance at Lower Prices

*AI Models · VentureBeat · 2026-11-19*

![Neon signs leading back to Google-style G logo](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2F2QF7Skzr9Imsoy1b60RkQ%2Fa9c6133de99c6e350b9401461a0e727f%2FNeon_Work_Street_at_Night.png%3Fw%3D1000%26q%3D100&w=3840&q=85)

Google has released Gemini 4 Neon, a new mid-range large language model available through the paid Gemini API in Google AI Studio and Android Studio, as well as in the Gemini app and Google Antigravity. Neon is described as highly performant and fast, matching or exceeding Gemini 4 Carbon's overall quality at three times the speed and 60% of the cost.

Neon's API token prices are $3 per million input tokens and $15 per million output tokens. Google states that Neon scores within about a percentage point of Anthropic's flagship Opus 5.5 on two engineering benchmarks, despite costing 25% less than Opus 5.5's standard rates of $4 and $20. Early users highlight Neon's utility in tasks requiring multi-step evidence tracing and producing human-inspectable output, such as analyzing billing records, finding software flaws, or testing research hypotheses.

**Key facts**

- Gemini 4 Neon launched
- Matches or exceeds Gemini 4 Carbon quality at 3x speed, 60% cost
- Input tokens: $3/million, Output tokens: $15/million
- 25% lower price than Anthropic Opus 5.5

**Why it matters:** Engineers using Google's AI models should evaluate Gemini 4 Neon for tasks requiring strong reasoning and code analysis capabilities, especially if cost-efficiency and speed are priorities, as it offers competitive performance at a lower price point than some frontier models.

> Google's Gemini 4 Neon delivers high-performance AI reasoning and coding at a significantly lower cost, making it a compelling option for a range of engineering tasks.

[🔗 Read more at VentureBeat](https://venturebeat.com/technology/google-launches-gemini-4-neon-with-opus-5-5-level-coding-performance-at-25-lower-api-token-prices)

---

## Criminals Adopt New AI Agent Hacking Tools for Autonomous Attacks

*Security · WIRED · 2026-11-18*

![Image may contain Publication Adult Person Head and Face](https://media.wired.com/photos/6afdd3316a27dda013bf584c/master/w_2560%2Cc_limit/Security_Criminals%2520Have%2520a%2520New%2520Favorite%2520AI%2520Hacking%2520Tool_v2.jpg)

Security researchers report that cybercriminals have begun adopting AI-powered penetration testing tools, leading to a new era of faster and more accessible cyberattacks. Since August, multiple organizations have been targeted by criminals using these tools, which leverage large language models (LLMs) to autonomously scan for vulnerabilities and execute attack plans written by human operators.

These AI agent frameworks, like the open-source Go-based Artex, do not introduce new attack methods but significantly accelerate existing ones. Artex, published on GitHub in July, acts as an all-in-one tool for initial network analysis, gaining access, lateral movement, and data exfiltration. These tools allow less skilled hackers to launch attacks in hours that would typically take days. While frontier AI models have safety guardrails, free Chinese and "abliterated" models are reportedly improving at bypassing these defenses.

**Key facts**

- Increased use of AI hacking tools since August
- Artex: open-source, Go-based framework
- Attacks take hours instead of days
- Safety guardrails bypassed by some models

**Why it matters:** Backend and security engineers need to assume that internet-facing systems are constantly being scanned at machine speed for vulnerabilities. This necessitates a proactive approach to patching, robust intrusion detection, and continuous security assessments to counter AI-accelerated attacks.

> AI agents are transforming hacking by enabling rapid, autonomous attacks, requiring engineers to intensify their defensive strategies and patch cycles.

[🔗 Read more at WIRED](https://www.wired.com/story/artex-ai-hacking-tools/)

---

## Windows Server 2028 Public Preview Hardens Security Defaults, Impacts Compatibility

*Cloud & Infrastructure · The Register · 2026-11-18*

![Windows Server 2028 won't be compatible by default - The Register](https://image.theregister.com/5234606.jpg?imageId=5234606&x=0&y=0&cropw=100&croph=100&panox=0&panoy=0&panow=100&panoh=100&width=1200&height=683)

Microsoft has launched the public preview of Windows Server 2028, introducing a significantly hardened Server Core configuration by default and a new security baseline. This change means hundreds of security settings are enabled from the first boot, departing from the previous "compatible by default" approach of Windows Server. While enhancing security, this default hardening may cause compatibility issues with older protocols, legacy authentication, and some existing management tools and scripts that worked on Windows Server 2025.

Key security enhancements include Trusted Launch for virtual machines and Confidential VM support. The release also includes native NVMe storage enabled by default, NVMe over TCP and RDMA, and planned booting from ReFS. Intune management for Windows Server has also entered preview, offering familiar endpoint management workflows for configuration, compliance, applications, and updates. Windows Server 2028 is also being pitched for running AI models locally, supporting accelerators like AMD's Instinct MI350P.

**Key facts**

- Windows Server 2028 public preview
- Hardened Server Core by default
- Hundreds of security settings on from first boot
- Native NVMe storage by default
- Intune management for Windows Server in preview

**Why it matters:** Administrators planning to adopt Windows Server 2028 must conduct thorough compatibility testing for their existing applications, scripts, and management tools before deployment, as the new default hardened security settings may break established configurations.

> Windows Server 2028 prioritizes security by default, requiring administrators to proactively test for compatibility with their existing infrastructure.

[🔗 Read more at The Register](https://www.theregister.com/os-platforms/2026/11/18/windows-server-2028-wont-be-compatible-by-default/5310766)

---

## OX Security Launches OX Radar and Response Center for Prioritized Threat Management

*Security · TechCrunch · 2026-11-18*

![OX Security launches OX Radar and Response Center to show companies which cyber threats actually affect them - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/11/OX_Radar_and_Response_Center_17945974179WTwcGhmix-800x500-1.jpg?w=800)

OX Security has released OX Radar and Response Center, an AI-native application protection solution designed to help security teams manage cyber threats. OX Radar continuously monitors emerging vulnerabilities, compromised software dependencies, and actively exploited threats by scanning CVE databases, KEV catalogs (CISA, ENISA), security advisories, and vendor research every 10 minutes.

The Response Center integrates with OX Security's platform to automatically check supported threats against customer environments, identifying affected assets and providing context for remediation. It determines exploitability using AI-generated exploit checks, runtime visibility, EPSS exploit predictions, and VEX exploitability status. Additionally, a public OX Radar threat feed offers broader security research across software and AI supply chains, analyzing newly published npm and PyPI packages, AI skills, and Model Context Protocol (MCP) servers.

**Key facts**

- OX Radar and Response Center launched
- Monitors threats every 10 minutes
- Integrates with CISA, ENISA KEV catalogs
- Public OX Radar threat feed available
- AI-generated exploit checks

**Why it matters:** Security and backend engineers can use OX Radar and Response Center to streamline vulnerability management, quickly identify which high-priority threats affect their specific environments, and receive guided remediation steps, reducing manual investigation time for proliferating software and AI components.

> OX Security's new tools help security teams prioritize and respond to relevant cyber threats faster by automatically assessing impact on their unique environments.

[🔗 Read more at TechCrunch](https://techcrunch.com/press-release/ox-security-launches-ox-radar-and-response-center-to-show-companies-which-cyber-threats-actually-affect-them/)

---

## Microsoft Reveals Windows Server 2028 with Default Hardened Security at Ignite 2026

*Cloud & Infrastructure · BleepingComputer · 2026-11-18*

![Critical NGINX ‘NGINX2Root’ bugs let attackers hijack servers](https://www.bleepstatic.com/content/hl-images/2026/11/19/thumb/211x130_nginx.jpg)

At the Ignite 2026 conference, Microsoft announced Windows Server 2028, its next major server operating system, which includes a hardened Server Core configuration by default. This new default aims to reduce the effort of establishing a secure baseline from day one, with hundreds of security settings enabled from the initial boot. These settings cover identity and authentication, network exposure, cryptography, privilege and admin access, platform and code integrity, and remote access and observability.

Key security features include Kerberos over NTLM, protected LSASS, SMB signing and encryption, and TLS limited to modern cipher suites. The OS also improves performance with native NVMe storage, NVMe over TCP and RDMA, and ReFS boot capabilities. For management, Intune integration for Windows Servers is introduced, extending endpoint management workflows. Windows Server 2028 also supports AI accelerators for deploying and configuring inference environments, including Windows ML, Foundry Local, vLLM, and Llama.cpp.

**Key facts**

- Windows Server 2028 announced at Ignite 2026
- Hardened Server Core by default
- New security baseline
- Supports AI accelerators (AMD Instinct MI350P)
- Intune management for Windows Servers

**Why it matters:** Admins should be aware of the shift to default hardened security in Windows Server 2028. This will require pre-deployment testing and potential configuration adjustments for existing applications and services to ensure compatibility and avoid operational disruptions.

> Windows Server 2028 comes with out-of-the-box hardened security, demanding administrative foresight for smooth upgrades and deployments.

[🔗 Read more at BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/microsoft-announces-windows-server-2028-with-hardened-security/)

---

## Decision Model Use Surges; Customization Becomes Next Frontier

*AI Agents & Tooling · TechCrunch · 2026-11-17*

![Sqwish co-founders Federica Freddi and Ushnish Sengupta.](https://techcrunch.com/wp-content/uploads/2026/11/attachment-1.jpeg?w=1024)

Decision models, a type of LLM tuned for quick, cost-effective decisions between preset options, are seeing a rapid increase in adoption. In October, more than one in four requests on Vercel’s AI model router went to decision models. TypeSafe's Jev family of models currently dominates this category. Following Jev's success, many new decision models have emerged, including Microsoft-Decision-1.1, now widely available on Azure.

Customization is becoming crucial for these models. Sqwish, a UK-based AI startup, raised $3 million pre-seed for its kettei fat decision model, which offers built-in post-training tools allowing customers to use their own production data to improve the model's judgment. TypeSafe and Microsoft also emphasize balancing cost, latency, intelligence, and calibration, recognizing that benchmarks alone are insufficient for real-world enterprise usage.

**Key facts**

- Decision models: >25% of Vercel AI router requests in October
- TypeSafe Jev models dominate usage
- Microsoft-Decision-1.1 rolled out on Azure
- Sqwish raised $3M pre-seed for kettei fat model
- Sqwish offers post-training customization with customer data

**Why it matters:** Engineers can leverage decision models for fast, cost-effective automated decision-making in production, such as in billing systems or security evaluations. The emergence of customization tools means engineers can fine-tune these models with proprietary data for greater accuracy in specific business contexts.

> Decision models are gaining traction for rapid, low-cost choices, with customization tools now allowing engineers to adapt them for specific enterprise needs.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/11/17/as-decision-model-use-skyrockets-is-customization-is-the-next-frontier/)

---

## Chainguard Launches Self-Serve Free and $500/Month Team Plans for Software Supply Chain Security

*Developer Tools · Siliconangle · 2026-11-17*

![theCUBE](https://s3.us-west-2.amazonaws.com/cube365-prod/related-content/e810e50d-1091-4ce3-9cc2-0232848a8d60.png)

Chainguard Inc., a software supply chain security company, has transitioned to a self-serve model with the launch of a free "Chainguard Starter" plan and a paid "Team" plan at $500 a month. The Starter plan covers most of Chainguard's products with usage limits suitable for personal projects or small teams, allowing users to sign up without a credit card or sales call.

This move aims to provide immediate access to hardened security tools, especially after incidents like "Black October," which saw numerous supply chain attacks and vulnerability disclosures. The Starter plan includes five container images from Chainguard's catalog of over 3,000 minimal images (claimed near-zero known vulnerabilities, up to 100GB/month downloads), signed build provenance, and software bills of materials. It also offers Chainguard Libraries for malware- and greyware-scanned dependencies (50,000 pulls/month) for various languages, with a seven-day cooldown for new versions. Additionally, Starter includes 500 virtual CPU hours/month for Chainguard Checks (hardened CI runners) and Chainguard Workspaces (hardened coding agent sandboxes), and 1 million tokens/month for its AI agent, Guardener.

**Key facts**

- Chainguard Starter (free) and Team ($500/month) plans
- Starter includes 5 container images, 100GB/month downloads
- 3,000+ minimal container images in catalog
- 50,000 dependency pulls/month for scanned libraries
- 500 vCPU hours/month for Checks and Workspaces
- 1 million tokens/month for Guardener AI agent

**Why it matters:** Developers and small teams can now access hardened container images, scanned dependencies, and secure CI/CD runners through Chainguard's self-serve plans. This enables faster adoption of supply chain security best practices, reducing the attack surface in their applications and builds without procurement delays.

> Chainguard's new self-serve plans make robust software supply chain security tools, including minimal images and scanned libraries, immediately accessible to all developers.

[🔗 Read more at Siliconangle](https://siliconangle.com/2026/11/17/chainguard-goes-self-serve-with-free-starter-plan-and-500-a-month-team-plan/)

---

## Quick hits

- **[Anthropic CEO Reaffirms Commitment to Responsible AI Development at Nasdaq IPO](https://techcrunch.com/2026/11/19/at-nasdaq-opening-bell-anthropic-ceo-recommits-to-pacing-ai-development/)** (TechCrunch) — Anthropic CEO Dario Amodei reaffirmed the company's commitment to responsible AI development and safety, vowing to pace AI training and deployment despite IPO pressures.

---

## What to watch

- Monitor for active exploitation reports of the NGINX and Ruby vulnerabilities and ensure immediate patching upon confirmation.
- Observe how Microsoft's default hardened security in Windows Server 2028 impacts enterprise upgrade cycles and the development of new management tools.
- Track the adoption and efficacy of AI-powered hacking tools like Artex and the countermeasures developed by security vendors to stay ahead of these accelerated threats.

---

## Sources

- [Ruby Releases Critical Fixes for 7 Regex and String Memory-Safety Flaws, 5 With RCE PoCs](https://thehackernews.com/2026/11/ruby-releases-fixes-for-7-regex-and.html) — The Hacker News, 2026-11-19
- [AI Helps Researchers Find 10 Critical NGINX Bugs, Including Remote Code Execution](https://www.theregister.com/security/2026/11/18/ai-found-more-critical-bugs-in-another-widely-used-technology-running-225m-websites/5310887) — The Register, 2026-11-19
- [Google Launches Gemini 4 Neon AI Model with Opus 5.5-Level Coding Performance at Lower Prices](https://venturebeat.com/technology/google-launches-gemini-4-neon-with-opus-5-5-level-coding-performance-at-25-lower-api-token-prices) — VentureBeat, 2026-11-19
- [Criminals Adopt New AI Agent Hacking Tools for Autonomous Attacks](https://www.wired.com/story/artex-ai-hacking-tools/) — WIRED, 2026-11-18
- [Windows Server 2028 Public Preview Hardens Security Defaults, Impacts Compatibility](https://www.theregister.com/os-platforms/2026/11/18/windows-server-2028-wont-be-compatible-by-default/5310766) — The Register, 2026-11-18
- [OX Security Launches OX Radar and Response Center for Prioritized Threat Management](https://techcrunch.com/press-release/ox-security-launches-ox-radar-and-response-center-to-show-companies-which-cyber-threats-actually-affect-them/) — TechCrunch, 2026-11-18
- [Microsoft Reveals Windows Server 2028 with Default Hardened Security at Ignite 2026](https://www.bleepingcomputer.com/news/microsoft/microsoft-announces-windows-server-2028-with-hardened-security/) — BleepingComputer, 2026-11-18
- [Decision Model Use Surges; Customization Becomes Next Frontier](https://techcrunch.com/2026/11/17/as-decision-model-use-skyrockets-is-customization-is-the-next-frontier/) — TechCrunch, 2026-11-17
- [Chainguard Launches Self-Serve Free and $500/Month Team Plans for Software Supply Chain Security](https://siliconangle.com/2026/11/17/chainguard-goes-self-serve-with-free-starter-plan-and-500-a-month-team-plan/) — Siliconangle, 2026-11-17
- [Anthropic CEO Reaffirms Commitment to Responsible AI Development at Nasdaq IPO](https://techcrunch.com/2026/11/19/at-nasdaq-opening-bell-anthropic-ceo-recommits-to-pacing-ai-development/) — TechCrunch, 2026-11-19
