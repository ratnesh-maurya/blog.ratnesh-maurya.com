---
title: 'F5 BIG-IP, PHP, VMware vCenter Flaws Patched; AWS CloudWatch Adds'
description: >-
  Critical remote code execution flaws in F5 BIG-IP and PHP default session
  handling receive emergency patches.
date: '2026-11-21'
tags:
  - F5 BIG-IP
  - PHP
  - VMware vCenter
  - AWS CloudWatch
  - EKS
  - Kubernetes
  - Gemini
  - macOS
source: tavily
stories: 8
sources:
  - BleepingComputer
  - Google
  - The New Stack
  - The Hacker News
  - Amazon
  - TechCrunch
---

Today's news highlights a busy week for security teams, with multiple critical vulnerabilities requiring immediate attention in widely used systems like F5 BIG-IP, PHP, and VMware vCenter. Meanwhile, cloud providers are enhancing observability for modern stacks, and AI agents are expanding their reach from specialized decision-making to direct desktop interaction, indicating a growing emphasis on practical AI integration and security across the board.

## TL;DR

- **F5 Releases Emergency Patches for Critical BIG-IP RCE and DoS Flaws** — F5 released emergency out-of-band hotfixes for five critical stack-based buffer overflow vulnerabilities in BIG-IP APM and iRules, allowing remote code execution or denial-of-service.
- **ARMORY CASTLE Exploits Zero-Day in VMware vCenter Server** — Google Threat Intelligence Group and Mandiant reported that ARMORY CASTLE exploited CVE-2026-123890, a zero-day vulnerability in VMware vCenter Server, to gain unauthenticated administrator access.
- **AWS Engineers Advocate Decider Models for Efficient AI Agent Decision-Making** — AWS engineers propose using specialized 'decider models' to make fast, low-latency judgments for AI agents, reducing reliance on larger LLMs for simple decisions.
- **PHP Fixes Critical phpAfterShell Session Flaw Allowing Code Execution** — PHP released fixes for CVE-2026-126714, dubbed phpAfterShell, a critical file-based session storage flaw that can lead to remote code execution when combined with other weaknesses.
- **AWS CloudWatch EKS Container Insights Adds Monitoring for Open Source Kubernetes Tools** — Amazon CloudWatch EKS Container Insights now offers built-in monitoring for popular open-source Kubernetes tools like Karpenter, KEDA, and vLLM without needing Prometheus or Grafana.
- **Google Gemini Desktop App Gains macOS Computer Use Capabilities for Agentic Tasks** — Google Gemini desktop application on macOS now offers 'computer use' features, enabling the AI to navigate native Mac apps and browse websites to complete multi-step tasks.
- **Windows 11 Optional Update KB5132057 Brings Search, Hello, and Run Dialog Improvements** — Microsoft released Windows 11 KB5132057, an optional update with 28 changes, including a new WinUI 3-based Search Box, improved Windows Hello, and a faster Run dialog.
- **Anthropic Employee Claims AI-Assisted Solution to Riemann Hypothesis Amidst Human Proofs** — Levent Alpöge, an Anthropic mathematician, announced an AI-assisted, Lean-compilable solution to the 167-year-old Riemann Hypothesis, coinciding with an independent human-generated proof.

---

## F5 Releases Emergency Patches for Critical BIG-IP RCE and DoS Flaws

*Top story · Security · BleepingComputer · 2026-11-20*

![Hackers use autonomous AI tool Cairn to find zero-day, take over server](https://www.bleepstatic.com/content/hl-images/2022/05/12/thumb/211x130_evil-hacker-ai.jpg)

F5 issued emergency patches for five critical BIG-IP vulnerabilities (CVE-2026-121805, CVE-2026-120292, CVE-2026-120285, CVE-2026-116953, and CVE-2026-123637) that can lead to remote code execution (RCE) or denial-of-service (DoS). These flaws affect BIG-IP Access Policy Manager (APM) and the iRules scripting feature.

The vulnerabilities are rated critical and can be exploited by unauthenticated threat actors to terminate the Traffic Management Microkernel (TMM) process and execute arbitrary code. F5 also released hotfixes for a high-severity integer underflow vulnerability (CVE-2026-126822) in BIG-IP APM SAML, which can also be abused for DoS attacks.

F5 advises immediate installation of the out-of-band hotfixes, as no other mitigation measures are available. While no active exploits have been confirmed for these specific issues, F5 vulnerabilities are frequently targeted by cybercrime and nation-state groups, with over 177,000 BIG-IP instances and 14,600 BIG-IP APM fingerprints currently exposed online.

**Key facts**

- 5 critical vulnerabilities (CVE-2026-121805, CVE-2026-120292, CVE-2026-120285, CVE-2026-116953, CVE-2026-123637)
- 1 high-severity vulnerability (CVE-2026-126822)
- Affects BIG-IP Access Policy Manager (APM) and BIG-IP iRules
- Over 177,000 BIG-IP instances and 14,600 BIG-IP APM fingerprints exposed online

**Why it matters:** Backend and systems engineers using F5 BIG-IP products must immediately apply the released emergency hotfixes to prevent remote code execution and denial-of-service attacks, as these vulnerabilities are critical and frequently exploited by threat actors.

> Patch F5 BIG-IP immediately to prevent critical RCE and DoS exploits.

[🔗 Read more at BleepingComputer](https://www.bleepingcomputer.com/news/security/f5-releases-emergency-patches-for-critical-big-ip-rce-flaws/)

---

## ARMORY CASTLE Exploits Zero-Day in VMware vCenter Server

*Security · Google · 2026-11-19*

![ARMORY CASTLE Exploits vSphere | Google Cloud Blog](https://storage.googleapis.com/gweb-cloudblog-publish/images/03_ThreatIntelligenceWebsiteBannerIdeas_BA.max-2600x2600.png)

Mandiant and Google Threat Intelligence Group (GTIG) disclosed that the suspected PRC-nexus threat actor ARMORY CASTLE (formerly UNC5221) exploited a zero-day vulnerability, CVE-2026-123890, in VMware vCenter Server. VMware also disclosed this vulnerability on November 19, 2026.

This vulnerability is an unauthenticated Secure Remote Password (SRP-6a) session key disclosure flaw over DCE/RPC, allowing a remote authentication bypass to establish an authenticated session as `administrator@vsphere.local`. Attackers can then execute arbitrary commands and exfiltrate files, including the `data.mdb` database, using the `vmdirdbcp` RPC interface.

ARMORY CASTLE exploited this in early September 2026 using a Golang utility called BONESAW to exfiltrate LMDB, hijack SAML STS, and create an SSO Administrator account. Organizations are strongly advised to apply security patches provided by Broadcom immediately to remediate the vulnerability.

**Key facts**

- CVE-2026-123890 impacts VMware vCenter Server
- Unauthenticated SRP-6a session key disclosure vulnerability
- Exploited by ARMORY CASTLE in early September 2026
- Threat actor used 'BONESAW' utility for exploitation
- VMware disclosed vulnerability on November 19, 2026

**Why it matters:** Systems administrators managing VMware vCenter Server deployments must apply Broadcom's security patches immediately to mitigate CVE-2026-123890, an unauthenticated remote authentication bypass vulnerability actively exploited by ARMORY CASTLE, to prevent full compromise of their vSphere environments.

> Patch VMware vCenter Server for CVE-2026-123890 to block active administrator bypass exploits.

[🔗 Read more at Google](https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-vsphere)

---

## AWS Engineers Advocate Decider Models for Efficient AI Agent Decision-Making

*AI Agents & Tooling · The New Stack · 2026-11-20*

![Does your AI agent need an LLM to decide what to do next? - The New Stack](https://cdn.thenewstack.io/media/2026/11/65a3138e-for-thumbnail-20.png)

Mike Chambers, a senior AI DevEx engineer at AWS, suggests using 'decider models' to streamline AI agent workflows by handling small, frequent judgments. These specialized AI models, also known as decision models or System One models, choose from a fixed set of options or rate inputs on a scale, providing calibrated probabilities without generating free-form text.

Decider models, like AWS's open-source Strands Decider 2B, can act as an 'agentic-powered if statement,' offering faster responses than general-purpose LLMs for tasks like semantic lookups or relevance scoring. Chambers demonstrated their use with the open-source Strands framework and Amazon Bedrock AgentCore Memory, placing decider models both before and after memory lookups.

One application is in model routing, where a decider can send routine prompts to smaller models while reserving more capable LLMs for complex tasks, leading to efficiency gains by reducing service calls and providing less extraneous context to the main model. While beneficial for predictable output, testing is required to ensure reliability.

**Key facts**

- Decider models: specialized AI models for fixed-option choices or scaled ratings
- Strands Decider 2B: AWS's 2-billion-parameter open-source decision model (released October 1)
- Can be used for model routing and pre/post-memory retrieval in AI agents
- Returns numeric scores in a single forward pass without token generation

**Why it matters:** AI engineers building agents can use decider models to optimize performance and cost by offloading simple, high-frequency decisions from large language models, making agentic workflows faster and more efficient.

> Integrate decider models to make AI agents more efficient by handling routine decisions without full LLM inference.

[🔗 Read more at The New Stack](https://thenewstack.io/aws-decider-models-agents)

---

## PHP Fixes Critical phpAfterShell Session Flaw Allowing Code Execution

*Security · The Hacker News · 2026-11-19*

![cybersecurity](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1FgbfB9gCsTYnkXg_UHMHoWinmHvbkdAdbnpnrFQzzIG00gtoQsaz3DVhUgvHic2vd-yM_5XIb9H5N6i7stc2WQFHqPn9bN7B_IIFDtEJbNnNcvNZ3IbmHi-kKM8V_3VaZj1zzoHwCVjkzUQwFzzTMhaTH7W2jlKhsI9m3HEBAVjHyuBiJBdX0l8jX9Ll/s727-nu-rw-lo-l85-e365/wiz-d.png)

PHP has released updates to fix a critical vulnerability, CVE-2026-126714, known as phpAfterShell, rated 9.2 on CVSS 4.0. This flaw in PHP's default file-based session handler can be exploited by an attacker to create arbitrary objects by cutting off a session write at the opportune moment.

When combined with a suitable gadget chain in the application, these manipulated objects can enable an attacker to execute arbitrary code on the server. The vulnerability primarily affects PHP 8.2 (before 8.2.36), 8.3 (before 8.3.37), 8.4 (before 8.4.28), and 8.5 (before 8.5.13), with PHP 8.6.0 including the fix.

PHP versions 8.1 and older are end-of-life and unsupported, though older unpatched builds are also affected. The fix was not included in the October 21 releases that addressed PHP2Shell. The vulnerability can be exploited via PHP's upload progress feature if active, allowing session writes before application code runs, even without an upload page. As an interim measure, setting `session.upload_progress.enabled = 0` in `php.ini` can close this specific attack path, but it is not a full fix.

**Key facts**

- CVE-2026-126714, rated 9.2 on CVSS 4.0
- Affects PHP 8.2 (before 8.2.36), 8.3 (before 8.3.37), 8.4 (before 8.4.28), 8.5 (before 8.5.13)
- PHP 8.6.0 includes the fix
- Exploitable via default file-based session handler and upload progress feature

**Why it matters:** Engineers running PHP applications using default file-based sessions must update to the latest patched versions immediately. If unable to update, disabling `session.upload_progress.enabled` is a temporary partial mitigation, but full patching is crucial to prevent remote code execution.

> Update PHP to patch the critical phpAfterShell session flaw, or temporarily disable upload progress.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/11/phpaftershell-explained-how-hackers.html)

---

## AWS CloudWatch EKS Container Insights Adds Monitoring for Open Source Kubernetes Tools

*Cloud & Infrastructure · Amazon · 2026-11-21*

![AWS re:Invent Livestream](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/homepage/interactive-cards/hero/reinvent-2026-reserved-seating-open.eaa8db6e0dbacc663af0d170ee58ccac0f62871c.png)

Amazon CloudWatch EKS Container Insights now includes built-in monitoring capabilities for several open-source Kubernetes tools running on Amazon EKS clusters. Supported tools include Karpenter, KEDA, vLLM, KServe, SGLang, Ray, and Knative Serving.

This new feature provides pre-built dashboards, eliminating the need for users to run and manage Prometheus or Grafana. Monitoring automatically starts when OTel Container Insights is enabled. Specific metrics for AI inference workloads include queued requests, time to first token, and KV cache usage per model server.

For autoscaling, users can monitor failed scalers and scale loop durations. All metrics are tagged with pod, workload, and node information, facilitating tracing. These EKS solutions are available in version 8.0.0 and later of the add-on and Helm chart in all AWS Regions where CloudWatch supports OpenTelemetry metrics, with costs based on OpenTelemetry ingestion rates.

**Key facts**

- Built-in monitoring for Karpenter, KEDA, vLLM, KServe, SGLang, Ray, Knative Serving
- Available in version 8.0.0+ of add-on and Helm chart
- Metrics tagged with pod, workload, node
- Charged at Amazon EKS OpenTelemetry ingestion rate of $0.08 per GB

**Why it matters:** Backend and AI engineers managing EKS clusters can leverage CloudWatch EKS Container Insights to gain immediate visibility into their open-source Kubernetes tools and AI inference workloads, reducing operational overhead by eliminating the need for self-managed Prometheus and Grafana.

> Use CloudWatch EKS Container Insights for integrated monitoring of key open-source Kubernetes tools on EKS.

[🔗 Read more at Amazon](https://aws.amazon.com/about-aws/whats-new/2026/11/cloudwatch-eks-kubernetes-tools)

---

## Google Gemini Desktop App Gains macOS Computer Use Capabilities for Agentic Tasks

*AI Agents & Tooling · TechCrunch · 2026-11-19*

![Google gives Gemini the ability to use your Mac for you - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/11/hero_header_CU_copy.width-2200.format-webp.jpeg?resize=1200,675)

Google has introduced 'computer use' capabilities to its Gemini desktop application for macOS, allowing the AI to act as an agent directly on the user's computer. This feature enables Gemini to navigate native Mac applications and browse websites in the background to complete multi-step tasks.

Users can instruct Gemini, then observe its progress in a live preview within the chat interface, while their screen and cursor remain free for other work. As with similar agentic offerings, users can pause, stop, and approve Gemini's actions before execution. This functionality requires the Gemini app for Mac and a Google AI Plus, Pro, or Ultra subscription.

Google suggests the feature can automate tedious workflows such as filling out forms, organizing files, creating slideshows from local files, or integrating information from online dashboards. This launch places Google in a competitive space, as other AI model makers like OpenAI, Anthropic, and Meta already offer similar agentic desktop features.

**Key facts**

- Gemini desktop app feature available on macOS
- Requires Gemini app for Mac and Google AI Plus, Pro, or Ultra subscription
- Initially available in English in the U.S.
- Allows AI to navigate native Mac apps and browse web for task completion

**Why it matters:** Engineers and power users on macOS now have an AI agent that can directly interact with their desktop environment, potentially automating repetitive tasks across applications and web browsers, shifting how complex workflows are approached.

> Gemini's new macOS computer use features enable direct AI interaction with desktop apps for task automation.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/11/19/google-gives-gemini-the-ability-to-use-your-mac-for-you/)

---

## Windows 11 Optional Update KB5132057 Brings Search, Hello, and Run Dialog Improvements

*Developer Tools · BleepingComputer · 2026-11-20*

![Hackers use autonomous AI tool Cairn to find zero-day, take over server](https://www.bleepstatic.com/content/hl-images/2022/05/12/thumb/211x130_evil-hacker-ai.jpg)

Microsoft has released the KB5132057 November optional cumulative update for Windows 11 versions 25H2 and 26H2, introducing 28 changes and fixes. This preview update is for IT administrators to test improvements before the next Patch Tuesday.

Key enhancements include a new Windows Search Box built on WinUI 3, which removes promotional web content and features indexer-based search for File Explorer, making it faster. Windows Hello facial recognition is improved for dark rooms with an automatic brightness adjustment option. A redesigned Run dialog, unveiled in May, is also included, boasting a time-to-show of 94 ms.

Other notable changes include inline actions in Windows Search for common tasks like toggling dark mode or Bluetooth, and support for web sign-in on Microsoft Entra hybrid-joined devices using FIDO2 security keys, passkeys, or Temporary Access Pass (TAP) at the lock screen.

**Key facts**

- KB5132057 update for Windows 11 versions 25H2 and 26H2
- Includes 28 changes and fixes
- New Run dialog with 94 ms time-to-show
- Builds updated to 26300.10075 (26H2) and 26200.10075 (25H2)
- Web sign-in supported on Microsoft Entra hybrid-joined devices

**Why it matters:** While an optional update, developers and IT professionals can preview quality-of-life improvements in Windows Search, Windows Hello, and the Run dialog, potentially streamlining daily tasks and improving security options for enterprise users.

> Windows 11's optional update offers early access to UI and security improvements for testing.

[🔗 Read more at BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/windows-11-kb5132057-update-released-with-28-changes-and-fixes/)

---

## Quick hits

- **[Anthropic Employee Claims AI-Assisted Solution to Riemann Hypothesis Amidst Human Proofs](https://techcrunch.com/2026/11/20/ai-claimed-a-solution-to-the-167-year-old-riemann-hypothesis-and-a-human-did-too/)** (TechCrunch) — Levent Alpöge, an Anthropic mathematician, announced an AI-assisted, Lean-compilable solution to the 167-year-old Riemann Hypothesis, coinciding with an independent human-generated proof.

---

## What to watch

- Monitor the rollout and adoption of CloudWatch EKS Container Insights' new monitoring features for cost and effectiveness in large-scale Kubernetes environments.
- Observe the stability and reliability of Google Gemini's new macOS computer use features as more users adopt them for automating daily tasks, and its expansion to other platforms.
- Track the mathematical community's full verification and acceptance of the Riemann Hypothesis proofs, particularly given the blend of human and AI contributions.

---

## Sources

- [F5 Releases Emergency Patches for Critical BIG-IP RCE and DoS Flaws](https://www.bleepingcomputer.com/news/security/f5-releases-emergency-patches-for-critical-big-ip-rce-flaws/) — BleepingComputer, 2026-11-20
- [ARMORY CASTLE Exploits Zero-Day in VMware vCenter Server](https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-vsphere) — Google, 2026-11-19
- [AWS Engineers Advocate Decider Models for Efficient AI Agent Decision-Making](https://thenewstack.io/aws-decider-models-agents) — The New Stack, 2026-11-20
- [PHP Fixes Critical phpAfterShell Session Flaw Allowing Code Execution](https://thehackernews.com/2026/11/phpaftershell-explained-how-hackers.html) — The Hacker News, 2026-11-19
- [AWS CloudWatch EKS Container Insights Adds Monitoring for Open Source Kubernetes Tools](https://aws.amazon.com/about-aws/whats-new/2026/11/cloudwatch-eks-kubernetes-tools) — Amazon, 2026-11-21
- [Google Gemini Desktop App Gains macOS Computer Use Capabilities for Agentic Tasks](https://techcrunch.com/2026/11/19/google-gives-gemini-the-ability-to-use-your-mac-for-you/) — TechCrunch, 2026-11-19
- [Windows 11 Optional Update KB5132057 Brings Search, Hello, and Run Dialog Improvements](https://www.bleepingcomputer.com/news/microsoft/windows-11-kb5132057-update-released-with-28-changes-and-fixes/) — BleepingComputer, 2026-11-20
- [Anthropic Employee Claims AI-Assisted Solution to Riemann Hypothesis Amidst Human Proofs](https://techcrunch.com/2026/11/20/ai-claimed-a-solution-to-the-167-year-old-riemann-hypothesis-and-a-human-did-too/) — TechCrunch, 2026-11-21
