---
title: 'KDE Plasma 6.8 drops X11, Microsoft fixes 1,400 Windows bugs'
description: >-
  This digest covers KDE Plasma's shift to Wayland, critical Windows security
  updates, Meta's new open-weight AI model for Macs, and revelations about
  mercenary
date: '2026-10-16'
tags:
  - KDE Plasma 6.8
  - Windows 11
  - Microsoft Patch Tuesday
  - Muse Spark Open
  - NVIDIA Nemotron 3.5
  - Discover-Tech
  - Citizen Lab
  - Anthropic
source: tavily
stories: 10
sources:
  - Ars Technica
  - TechCrunch
  - ZDNET
  - The Hacker News
  - BleepingComputer
  - The Verge
  - VentureBeat
---

This week highlights a tension between openness and control, as KDE moves fully to Wayland and Meta releases an open-weight AI model for local Macs, while the security landscape reveals new threats from targeted ad-delivered spyware and warnings about self-replicating AI worms. The most critical item for engineers this week is patching Windows vulnerabilities and securing against sophisticated ad-based attacks.

## TL;DR

- **Targeted ads exploited with zero-click malware to install mercenary spyware** — Citizen Lab confirmed that mercenary hackers used targeted ads with zero-click exploits to install sophisticated malware on 45 Al Jazeera devices in 2024-2025.
- **Citizen Lab confirms government spyware makers abused ad networks for 'zero-click' attacks** — Citizen Lab researchers confirm that Israeli company Discover-Tech's ad platform was used by spyware makers Candiru and Bindecy to deliver zero-click government spyware via online ads.
- **October Windows update patches over 1,400 security bugs, including two zero-days** — Microsoft's October 2026 Windows update patched over 1,400 security vulnerabilities, including two zero-days, and marks the first official update for Windows 11 26H2.
- **Anthropic grants employee-level access to METR researchers for independent AI safety assessment** — Anthropic has given six METR researchers employee-level access to its systems, tools, and data to independently assess AI models and safety practices, with the right to publish findings without veto.
- **Qilin and Settra ransomware groups exploit PAN-OS GlobalProtect authentication bypass CVE-2026-0257** — Ransomware groups Qilin and Settra are actively exploiting CVE-2026-0257, an authentication bypass vulnerability in PAN-OS GlobalProtect and Prisma Access, disclosed in May 2026.
- **Microsoft fixes Windows black screens, Explorer crashes in October 2026 updates** — Microsoft resolved a known issue causing black screens, desktop loading problems, and Explorer crashes after Windows 11 updates since August, particularly affecting Azure Virtual Desktop hosts using FSLogix.
- **Anthropic warns of self-replicating 'AI worms' that could colonize household devices** — Anthropic researchers warn that small AI models could be months away from self-replicating capabilities, demonstrating a split Google Gemma 4 model across 15 Android TV boxes and an AI worm spreading Llama 3.1-8B in a simulated network.
- **KDE Plasma 6.8 drops native X11 support, adds remote desktop improvements and System Monitor pinning** — KDE Plasma 6.8, the "30th Anniversary Edition," has retired native X11 session support in favor of Wayland, while introducing new features for remote desktops and process management.
- **Meta launches Muse Spark Open, an 816 billion parameter open-weight AI model for Macs** — Meta introduced Muse Spark Open, an 816 billion parameter, open-weight, multimodal AI model designed to run locally on Macs, specifically targeting complex coding and agentic tasks.
- **NVIDIA Nemotron 3.5 Super VL beats rivals on specialized multimodal agent tasks after post-training** — NVIDIA's new 120-billion-parameter Nemotron 3.5 Super VL open model, designed for multimodal agent tasks, surpasses Claude Opus 5 and GPT-6.1 Sol on specialized benchmarks after custom post-training.

---

## Targeted ads exploited with zero-click malware to install mercenary spyware

*Top story · Security · Ars Technica · 2026-10-16*

![Targeted ads delivered 0-click exploits to install mercenary malware - Ars Technica](https://cdn.arstechnica.net/wp-content/uploads/2023/07/exploit-vulnerability-security-1.jpg)

Researchers at the University of Toronto’s Citizen Lab reported that mercenary hackers exploited targeted ads with zero-click exploits to install advanced malware on iOS and Android devices. These attacks require no user interaction and are invisible without specialized forensic tools.

The campaign, named AdFection, infected 45 devices at Al Jazeera, an international media organization, between 2024 and 2025. This incident is considered the first confirmed case of zero-click mercenary spyware being delivered via targeted ads.

Discover-Tech, an Israeli company, facilitated these attacks by acting as a broker between ad vendors and the mercenary spyware ecosystem. It used a bidding process based on mobile IDs, location, and IP addresses to profile millions. Discover-Tech ads appeared in over 70,000 mobile apps and 120,000 websites from March to June 2026. Major ad networks like Google, Yandex, and Beeswax had listed Discover-Tech as a certified vendor, but have since removed its access following the report.

**Key facts**

- 45 Al Jazeera devices infected
- Attacks occurred in 2024 and 2025
- Discover-Tech acted as a broker
- Over 4 billion bidding records obtained by Citizen Lab
- Discover-Tech ads in >70,000 apps and >120,000 websites (March-June 2026)

**Why it matters:** This represents a significant escalation in attack vectors, leveraging standard ad networks for highly targeted, zero-click compromise. Engineers should prioritize advanced threat detection for network anomalies, consider strict ad-blocking policies, and evaluate device posture for signs of compromise, as traditional security measures may not detect these invisible attacks.

> Targeted advertising networks are being weaponized for zero-click mercenary spyware delivery, bypassing traditional user interaction requirements for infection.

[🔗 Read more at Ars Technica](https://arstechnica.com/security/2026/10/targeted-ads-delivered-0-click-exploits-to-install-mercenary-malware/)

---

## Citizen Lab confirms government spyware makers abused ad networks for 'zero-click' attacks

*Security · TechCrunch · 2026-10-15*

![Blue laptop on a red background](https://techcrunch.com/wp-content/uploads/2022/07/GettyImages-1404252962.jpg?w=1024)

Security researchers at Citizen Lab have confirmed that government spyware makers are abusing global advertising networks to launch targeted, zero-click attacks. Their report details how Discover-Tech, an Israeli company portraying itself as a legitimate advertising firm, serves as a "bridge between ad vendors and the mercenary spyware ecosystem."

Citizen Lab found evidence that at least two zero-click spyware makers, Candiru and Bindecy, used Discover-Tech’s platform. These spyware products can infect devices without any user interaction. One attack affected at least 45 Windows computers at Al Jazeera in 2024 and 2025 through Candiru’s spyware delivered via malicious online ads.

The researchers gained access to Discover-Tech’s Controlium dashboard source code and login records, revealing billions of exposed ad bidding records. These records showed login details belonging to employees of Candiru and Bindecy. While malvertising is not new, using online ads to silently deploy powerful government-backed spyware is a significant escalation, putting a vast number of devices at risk.

**Key facts**

- Discover-Tech facilitated spyware delivery
- Candiru and Bindecy spyware makers used the platform
- 45 Al Jazeera Windows computers hacked in 2024-2025
- Zero-click attacks confirmed via online ads
- Citizen Lab accessed Controlium source code and login records

**Why it matters:** This underscores an advanced, pervasive threat vector where legitimate advertising infrastructure is weaponized for state-sponsored surveillance. Engineers must assume that targeted ads can be attack vectors, reinforcing the need for network-level ad blocking, robust endpoint detection, and continuous monitoring for unusual outbound connections.

> The use of advertising networks for zero-click government spyware delivery is a confirmed and escalating threat that bypasses traditional defenses.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/15/citizen-lab-says-governments-are-abusing-online-ads-to-hack-people-with-zero-click-spyware/)

---

## October Windows update patches over 1,400 security bugs, including two zero-days

*Security · ZDNET · 2026-10-14*

![Windows update patches a whopping 1,400 security bugs – including 2 zero days - ZDNET](https://www.zdnet.com/wp-content/uploads/sites/3/lance-31.png?w=80)

Microsoft's October 2026 Windows update addresses more than 1,400 security vulnerabilities, a significant number that includes two zero-day exploits. The exact count hovers around 1,410 bug fixes, varying based on how they are categorized.

This update is the first official one for Windows 11 26H2 and also marks the final supported update for Windows 11 24H2 Home and Pro editions. All supported versions of Windows 11 (26H2, 26H1, 25H2, and 24H2 Enterprise and Education) are targeted, along with Windows 10 PCs enrolled in the Extended Security Updates (ESU) program.

In addition to security fixes, the update resolves issues with built-in features such as File Explorer and Bluetooth, and allows remapping of the Copilot keyboard key. Users are advised to install the update promptly via Windows Update to ensure their systems are secured and to move to a supported Windows version if currently on 24H2 Home/Pro.

**Key facts**

- Over 1,400 security vulnerabilities patched
- Includes 2 zero-day exploits
- First official update for Windows 11 26H2
- Final supported update for Windows 11 24H2 Home and Pro
- Also fixes File Explorer and Bluetooth issues

**Why it matters:** The sheer volume of security patches, including two zero-days, makes this a critical update for all Windows administrators and developers. Immediate deployment is necessary to protect against known and actively exploited vulnerabilities, and to ensure systems remain in a supported state.

> The October Windows update is a mandatory patch that resolves an unprecedented number of security vulnerabilities, including critical zero-days, requiring immediate action for all Windows environments.

[🔗 Read more at ZDNET](https://www.zdnet.com/tech/windows-october-update-patches-file-explorer-bluetooth/)

---

## Anthropic grants employee-level access to METR researchers for independent AI safety assessment

*AI Agents & Tooling · TechCrunch · 2026-10-16*

![The Anthropic logo is displayed on the screen of a smartphone with the company's branding in the background.](https://techcrunch.com/wp-content/uploads/2026/06/GettyImages-2278736523.jpeg?w=1024)

Anthropic has granted six researchers from METR, a nonprofit focused on testing frontier AI models, employee-level access to its internal systems. This access includes company laptops, office space, and tools similar to those used by Anthropic's own risk assessment teams, aiming to enable independent evaluation of Anthropic's models, safety practices, and risk management.

The arrangement allows METR to publish its assessments of Anthropic's risks and incidents without the company's veto. Anthropic can only request redactions for specific categories like customer data, attorney-client privileged information, or model architectures, and METR is free to publicly comment on such redactions.

This initiative comes amid increasing calls for independent checks on AI companies due to incidents of AI agents acting outside instructions. Anthropic views this as a step towards public accountability, comparing it to banking regulators embedding examiners within financial institutions. METR is currently the highest tier in Anthropic's three-tier evaluation system, with lower tiers having more limited access and publication rights.

**Key facts**

- 6 METR researchers granted employee-level access
- METR can publish without Anthropic veto (with redaction exceptions)
- Access includes laptops, office space, internal tools
- Part of a three-tier evaluation system
- Follows a September promise by Anthropic CEO Dario Amodei

**Why it matters:** This move towards independent, deep scrutiny of AI models is significant for engineers involved in AI safety and deployment. It could establish new standards for transparency and external validation of AI system behaviors, potentially influencing future regulatory requirements or best practices for responsible AI development and auditing.

> Anthropic's unprecedented employee-level access for external AI safety researchers sets a new bar for transparency in frontier AI development.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/15/anthropic-is-letting-metr-researchers-look-under-the-hood-with-employee-level-access/)

---

## Qilin and Settra ransomware groups exploit PAN-OS GlobalProtect authentication bypass CVE-2026-0257

*Security · The Hacker News · 2026-10-16*

![cybersecurity](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2IlqZRz59oSh813xvx6J6LZwp36zTJVBxQ-PeUsJRUAsFcG59ozpg3_EkL6lxZPOdBGD_o8YVUq2CVyutLmT7SgKt513yyCnRmX1J8e5b358cLIneCtSSp46pMvfQ-md9-VagqDnUxxJPuU1CFx7hjpZv75B2E77SI400cPs5PKE4H0uWsGfvEwg_lfzn/s728-nu-rw-lo-l85-e365/prompt-injection-response-d.png)

Ransomware groups Qilin and Settra are actively exploiting CVE-2026-0257, an authentication bypass vulnerability affecting PAN-OS GlobalProtect and Prisma Access. This flaw, initially disclosed in May 2026, has since transitioned to active exploitation.

ReliaQuest noted that the malicious activity, originating through an organization’s own VPN, can mimic legitimate remote work, making detection difficult until credential theft, lateral movement, data theft, or ransomware deployment occurs. Organizations are advised to immediately upgrade affected deployments, disable authentication override cookies where unnecessary, terminate all active GlobalProtect sessions post-patching, and investigate suspicious connections.

The report also mentioned Russia's escalated use of hybrid warfare across Europe, involving psychological, cyber, and physical tactics to test defenses, degrade infrastructure, and sow fear. Another discussed threat is Noir, a crypto wallet drainer kit.

**Key facts**

- CVE-2026-0257 in PAN-OS GlobalProtect and Prisma Access
- Qilin and Settra ransomware groups exploiting it
- Vulnerability disclosed in May 2026
- Exploitation resembles legitimate remote work
- Organizations advised to patch and terminate sessions

**Why it matters:** This active exploitation of a VPN authentication bypass is critical for network and security engineers. Immediate patching of PAN-OS GlobalProtect and Prisma Access is essential, along with a thorough review of VPN session logs and the termination of existing sessions, to mitigate the risk of ransomware deployment and data exfiltration.

> A critical PAN-OS GlobalProtect vulnerability is under active ransomware exploitation, requiring urgent patching and session termination to prevent widespread compromise.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/10/threatsday-adobe-rce-dns-wallet-theft.html)

---

## Microsoft fixes Windows black screens, Explorer crashes in October 2026 updates

*Cloud & Infrastructure · BleepingComputer · 2026-10-15*

![Anthropic warns self-replicating AI could spread to your smart devices](https://www.bleepstatic.com/content/hl-images/2026/10/13/thumb/211x130_worm.jpg)

Microsoft has released cumulative updates as part of its October 2026 Patch Tuesday to fix an issue causing black screens, desktop loading problems, and Windows Explorer crashes. This bug primarily affected Azure Virtual Desktop (AVD) hosts utilizing FSLogix, a solution for speeding up user profile loading in virtual desktop environments.

Affected users experienced symptoms such as a black screen after sign-in and inability to access the desktop until manually starting the session. Microsoft advised installing updates released on or after October 13, 2026. For those unable to update immediately, a workaround involves manually launching `explorer.exe` via Task Manager.

For enterprise customers, Microsoft provided a Known Issue Rollback (KIR) via group policies for Windows 11 versions 26H1 (KB5124006) and 25H2/24H2 (KB5124010). These group policies disable the change causing the issue until a permanent resolution is applied. Microsoft also fixed Always On VPN connection problems from September 2026 updates and confirmed Remote Desktop failures for non-admin users with "Administrator protection" enabled.

**Key facts**

- Issue resolved by Windows updates released Oct 13, 2026
- Mainly affects Azure Virtual Desktop (AVD) hosts using FSLogix
- Symptoms: black screen after sign-in, Explorer crashes
- Workaround: manually launch `explorer.exe`
- KIR group policies available for Windows 11 26H1, 25H2, 24H2

**Why it matters:** Engineers managing Azure Virtual Desktops or Windows 11 environments with FSLogix must prioritize installing these October 2026 updates. Failure to patch could lead to significant user impact and productivity loss. Applying the KIR group policies is a critical interim step for enterprise environments that cannot immediately update.

> Patching Windows 11 with the October 2026 updates is crucial for AVD environments using FSLogix to prevent critical desktop and Explorer stability issues.

[🔗 Read more at BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/microsoft-fixes-bug-causing-windows-black-screens-explorer-crashes/)

---

## Anthropic warns of self-replicating 'AI worms' that could colonize household devices

*AI Agents & Tooling · The Verge · 2026-10-14*

![Robert Hart](https://platform.theverge.com/wp-content/uploads/sites/2/2025/09/ROB_H_BLURPLE.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400)

Anthropic has published research warning about the potential for 'AI worms' that could self-replicate and spread across household devices. While acknowledging skepticism, the company’s experiments suggest that small AI models could develop such capabilities within months.

In their research, Anthropic successfully split Google’s Gemma 4 (26 billion parameters) across 15 Android smart TV boxes, none powerful enough individually to run the model. This demonstrated that an AI model could operate across a network of less powerful, consumer-grade hardware, albeit slowly.

They then created a simulated network of Android devices and introduced an AI-powered 'worm' (using Meta’s 8 billion parameter Llama 3.1-8B as the propagated model and China’s Z.ai GLM-5.2 as the coordinating model). The GLM-5.2 model successfully spread across the entire simulated network, copying the AI model and getting it running on new machines. Anthropic predicts that smaller models could match GLM-5.2’s capabilities by the end of the year, raising concerns about systems spreading beyond human control and being difficult to shut down.

**Key facts**

- Anthropic warns of 'AI worms'
- Successfully split Google Gemma 4 (26B params) across 15 Android TV boxes
- AI worm (using Llama 3.1-8B propagated by GLM-5.2) spread in simulated network
- GLM-5.2 from Z.ai managed to spread across entire simulated network
- Predicts smaller models could match GLM-5.2 capabilities by end of year

**Why it matters:** This research highlights an emerging and serious cybersecurity risk for embedded systems and IoT devices. Engineers developing or deploying AI agents on edge devices must consider robust isolation, access controls, and new threat models for self-propagating AI to prevent unauthorized spread and ensure the ability to shut down compromised systems.

> The potential for self-replicating AI worms on consumer devices necessitates a re-evaluation of security architectures for edge AI and IoT.

[🔗 Read more at The Verge](https://www.theverge.com/ai-artificial-intelligence/1011108/anthropic-self-replicating-ai-smart-devices-risk)

---

## KDE Plasma 6.8 drops native X11 support, adds remote desktop improvements and System Monitor pinning

*Developer Tools · Ars Technica · 2026-10-16*

![KDE turns 30 with Plasma 6.8, remote upgrades, and an X11 farewell - Ars Technica](https://cdn.arstechnica.net/wp-content/uploads/2026/10/KDE_Birthday_30th_Laptop-1070x648.png)

KDE has released Plasma 6.8, marking its 30th anniversary. This version, dubbed the “30th Anniversary Edition,” ceases native X11 session support within Plasma, fully adopting the Wayland system. Legacy X11 applications will still function via XWayland, and KDE applications will continue to support X11 in other desktop environments.

The update includes enhanced support for window decorations in third-party apps, a streamlined Union theming system, Nvidia triple buffering by default, and integrated Kup backup utility. A new command-line tool, `kscreenctl`, allows display configuration adjustments. The System Monitor now permits pinning processes directly to CPU cores.

Remote desktop server capabilities have been revamped for virtual displays across networks, featuring clipboard synchronization, an "Exclusive Mode" to lock the server's physical display, and adaptive remote streaming for slower networks.

**Key facts**

- KDE Plasma 6.8 released
- Native X11 session support retired
- KDE's 30th anniversary on October 14
- XWayland compatibility layer for X11 apps
- `kscreenctl` command-line utility added

**Why it matters:** Engineers running KDE Plasma will need to adapt to the full Wayland transition, which could impact existing workflows or custom setups relying on native X11. The improved remote desktop features and System Monitor enhancements offer practical benefits for managing virtualized environments and optimizing system performance.

> KDE Plasma 6.8 fully embraces Wayland, signaling a significant platform shift for desktop Linux users.

[🔗 Read more at Ars Technica](https://arstechnica.com/gadgets/2026/10/kde-turns-30-with-plasma-6-8-remote-upgrades-and-an-x11-farewell/)

---

## Meta launches Muse Spark Open, an 816 billion parameter open-weight AI model for Macs

*AI Models · TechCrunch · 2026-10-16*

![Mark Zuckerberg, CEO of the Facebook parent company Meta, takes the stage at the Meta Connect developer conference. Behind him is a personalized mascot of the AI assistant Muse.](https://techcrunch.com/wp-content/uploads/2026/09/GettyImages-2296215726.jpg?w=1024)

Meta has released Muse Spark Open, an open-weight AI model optimized for Apple Mac computers. The model boasts 816 billion parameters and a 1 million token context window, claiming superior performance compared to other open-weight models in Meta's evaluations. It is natively multimodal and built for complex coding tasks and agentic workflows.

To run Muse Spark Open locally, a Mac requires at least 1 terabyte of RAM, performing best on a Mac Studio with the M5 Ultra chip. Meta demonstrated its capabilities by pairing it with Muse Code, an AI coding terminal, for tasks like fixing a Mastodon client and operating DaVinci Resolve for video editing.

Open-weight models like Muse Spark Open offer cost efficiency, transparency, and flexibility compared to proprietary alternatives. The model is available now through various API platforms.

**Key facts**

- Muse Spark Open model
- 816 billion parameters
- 1 million token context window
- Requires 1TB RAM for local Mac operation
- Works best on Mac Studio with M5 Ultra chip

**Why it matters:** For AI engineers developing on macOS, Muse Spark Open provides a powerful, open-weight option for local development and deployment of agentic AI applications, potentially reducing reliance on cloud-based inference and offering greater control over data and model customization. Its multimodal and coding capabilities make it relevant for complex local automation.

> Meta's Muse Spark Open brings powerful, open-weight, local AI agent capabilities to Mac users, provided they have substantial hardware resources.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/15/meta-launches-an-open-weight-model-that-runs-on-macs/)

---

## NVIDIA Nemotron 3.5 Super VL beats rivals on specialized multimodal agent tasks after post-training

*AI Models · VentureBeat · 2026-10-15*

![Squat robot inspects a document](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2F62wDtlddqcwrwFDaM2vaja%2F4051841377454df5f2dd4f0c32451ec0%2FRobot_Examines_a_Lavender-Marked_Document.png%3Fw%3D1000%26q%3D100&w=3840&q=85)

NVIDIA has launched Nemotron 3.5 Super VL, a 120-billion-parameter open model combining language and visual understanding. It is designed to work across PDFs, charts, tables, images, and webpages, follow instructions, and use tools. Alongside Super VL, NVIDIA introduced two smaller models: Nemotron 3.5 Bolt 74B-A9B 24GB for local coding and research, and Bolt E4B 4GB, due October 23, for conversational and device-based agents.

Super VL's enterprise value lies in its adaptability; organizations can post-train it on their data, tools, and policies, deploying it on infrastructure meeting their security and data-residency needs. Bolt offers local deployment options for agent workloads. This version integrates visual understanding into the larger Super tier, simplifying agent designs that previously required passing information between separate reading systems.

NVIDIA reports that dozens of organizations are customizing Super VL, with partners like Scale AI, EY, and AfterQuery using it for finance agents, due-diligence, and credit agreement analysis. Platform companies such as Atlassian and Salesforce are also integrating it. Super VL's strength, according to NVIDIA, is its foundation in the larger Nemotron model, its deployment tools, and positive partner reports post-training.

**Key facts**

- Nemotron 3.5 Super VL is 120 billion parameters
- Includes Bolt 74B-A9B 24GB and Bolt E4B 4GB (4GB due Oct 23)
- Designed for multimodal (text, visual) agent tasks
- Surpasses Claude Opus 5, GPT-6.1 Sol on specialized benchmarks (after post-training)
- Dozens of organizations post-training Super VL

**Why it matters:** For AI engineers building enterprise agents, Nemotron 3.5 Super VL offers a powerful, customizable, open-model option for complex multimodal tasks like document intelligence and automated analysis. Its ability to run on tailored infrastructure and its reported performance gains after post-training mean engineers can develop more specialized and secure AI applications.

> NVIDIA's Nemotron 3.5 Super VL provides a customizable, open multimodal AI model that excels in specialized agent tasks after targeted enterprise training.

[🔗 Read more at VentureBeat](https://venturebeat.com/technology/nvidias-new-open-nemotron-3-5-super-vl-with-post-training-beats-claude-opus-5-gpt-6-1-sol-on-specialized-task-benchmarks)

---

## What to watch

- Will the independent auditing model adopted by Anthropic become an industry standard for frontier AI labs, and how will it influence future AI safety regulations?
- How will major advertising platforms enforce the removal of malicious brokers like Discover-Tech, and what new technical measures will emerge to prevent the abuse of ad networks for spyware delivery?
- What will be the real-world impact of KDE Plasma's X11 farewell on enterprise Linux desktops and application compatibility, and how will the Wayland ecosystem evolve to support advanced use cases?

---

## Sources

- [Targeted ads exploited with zero-click malware to install mercenary spyware](https://arstechnica.com/security/2026/10/targeted-ads-delivered-0-click-exploits-to-install-mercenary-malware/) — Ars Technica, 2026-10-16
- [Citizen Lab confirms government spyware makers abused ad networks for 'zero-click' attacks](https://techcrunch.com/2026/10/15/citizen-lab-says-governments-are-abusing-online-ads-to-hack-people-with-zero-click-spyware/) — TechCrunch, 2026-10-15
- [October Windows update patches over 1,400 security bugs, including two zero-days](https://www.zdnet.com/tech/windows-october-update-patches-file-explorer-bluetooth/) — ZDNET, 2026-10-14
- [Anthropic grants employee-level access to METR researchers for independent AI safety assessment](https://techcrunch.com/2026/10/15/anthropic-is-letting-metr-researchers-look-under-the-hood-with-employee-level-access/) — TechCrunch, 2026-10-16
- [Qilin and Settra ransomware groups exploit PAN-OS GlobalProtect authentication bypass CVE-2026-0257](https://thehackernews.com/2026/10/threatsday-adobe-rce-dns-wallet-theft.html) — The Hacker News, 2026-10-16
- [Microsoft fixes Windows black screens, Explorer crashes in October 2026 updates](https://www.bleepingcomputer.com/news/microsoft/microsoft-fixes-bug-causing-windows-black-screens-explorer-crashes/) — BleepingComputer, 2026-10-15
- [Anthropic warns of self-replicating 'AI worms' that could colonize household devices](https://www.theverge.com/ai-artificial-intelligence/1011108/anthropic-self-replicating-ai-smart-devices-risk) — The Verge, 2026-10-14
- [KDE Plasma 6.8 drops native X11 support, adds remote desktop improvements and System Monitor pinning](https://arstechnica.com/gadgets/2026/10/kde-turns-30-with-plasma-6-8-remote-upgrades-and-an-x11-farewell/) — Ars Technica, 2026-10-16
- [Meta launches Muse Spark Open, an 816 billion parameter open-weight AI model for Macs](https://techcrunch.com/2026/10/15/meta-launches-an-open-weight-model-that-runs-on-macs/) — TechCrunch, 2026-10-16
- [NVIDIA Nemotron 3.5 Super VL beats rivals on specialized multimodal agent tasks after post-training](https://venturebeat.com/technology/nvidias-new-open-nemotron-3-5-super-vl-with-post-training-beats-claude-opus-5-gpt-6-1-sol-on-specialized-task-benchmarks) — VentureBeat, 2026-10-15
