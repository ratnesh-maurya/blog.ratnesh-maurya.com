---
title: OpenAI enables AI shopping; China trains models on banned Nvidia
description: >-
  This digest covers OpenAI's new AI agent shopping feature, China's use of
  export-banned Nvidia chips for AI models, and increased AI-fueled ransomware.
date: '2026-11-15'
tags:
  - ChatGPT Wallet
  - Nvidia Blackwell
  - OpenAI
  - Ransomware
  - GitHub Skills
  - Kubernetes
  - Google Gemini 4 Carbon
  - Apple Siri AI
source: tavily
stories: 10
sources:
  - TechCrunch
  - WIRED
  - DEV Community
  - GitHub Blog
---

This week, AI's practical applications expanded into consumer shopping with OpenAI's new Wallet feature, while the geopolitical tension around AI hardware intensified with reports of China training its leading models on export-banned Nvidia chips. Simultaneously, the increasing role of AI in cyberattacks highlights a growing security challenge for software businesses.

## TL;DR

- **Chinese AI models trained on US-banned Nvidia Blackwell GPUs despite export controls** — Leading Chinese open-weight AI models, including Moonshot's Kimi K3 and DeepSeek's V4, show evidence of training on US-banned Nvidia Blackwell GPUs, raising concerns about export control effectiveness.
- **AI contributes to a 20-40% increase in global ransomware attacks since spring** — Ransomware attacks globally have increased by 20-40% since spring, with AI assisting in tasks like phishing and negotiation, but operations remain largely human-controlled.
- **OpenAI launches ChatGPT Wallet, enabling AI agents to complete online purchases** — OpenAI has launched ChatGPT Wallet, allowing AI agents (dots) to make online purchases for users after explicit approval, initially for limited US ChatGPT Pro subscribers.
- **AI changes hacking economics, uncovering vulnerabilities faster in 'Black October'** — AI has altered hacking economics by accelerating vulnerability discovery and exploit development, leading to a surge in cybersecurity incidents termed "Black October."
- **FAA groundstop raises questions about AI reliability in aviation after pilotless flight milestone** — A national FAA groundstop on Friday the 13th, following a pilotless Cessna flight, has prompted questions about the safety and reliability of new AI-infused aviation systems like SMART.
- **Kubernetes restarts applications, but does not inherently heal them from failures** — Kubernetes maintains desired application state by restarting failed pods, but it does not automatically diagnose or fix underlying application logic errors.
- **GitHub experienced eight incidents in October, including write outages and Azure network disruption** — GitHub reported eight incidents in October 2026, leading to degraded performance, highlighting ongoing challenges with capacity, isolation, and regional recovery in its Azure migration.
- **GitHub introduces 'agent skills' for reusable, versioned instructions for AI agents** — GitHub launched 'agent skills,' allowing engineers to capture and reuse repeatable instructions for AI agents in versioned directories, promoting consistent workflows.
- **Google Gemini 4 Carbon released to paying developers, Anthropic offers cheaper Claude Fable 5.2** — Google's Gemini 4 Carbon is now available to paying developers and enterprises, with introductory pricing, while Anthropic released a cheaper Claude Fable 5.2 model.
- **OpenAI's ChatGPT app saw mixed success with redesigns and standalone apps, while Apple's Siri AI is rolling out** — OpenAI experienced challenges with ChatGPT app redesigns and standalone applications like Sora, while Apple's improved Siri AI is now rolling out in iOS 27 beta.

---

## Chinese AI models trained on US-banned Nvidia Blackwell GPUs despite export controls

*Top story · AI Models · TechCrunch · 2026-11-14*

![Jensen Huang](https://techcrunch.com/wp-content/uploads/2026/11/GettyImages-2301327883.jpg?w=1024)

A new research effort claims that leading open-weight AI models developed by Chinese companies were trained on Nvidia chips restricted from export to China. Will DePue, a former OpenAI researcher at Unemployment Labs, analyzed the weights of models from DeepSeek, Moonshot AI, MiniMax, and Ant Group, finding evidence that closely watched models like Moonshot's Kimi K3 releases and DeepSeek's V4 models bear fingerprints of training on Blackwell chips.

Nvidia CEO Jensen Huang left the company after admitting to an affair with Alice Huang, an executive at Megaspeed, a company implicated in smuggling Nvidia chips into China. Alice Huang is also alleged to be a Chinese intelligence agent. The US government's export controls ban Blackwell GPUs for export to China or Chinese-owned firms, allowing only less powerful H200 chips via circuitous routes with a 25% tariff.

Epoch AI estimates that about two million advanced chips entered China in 2024 and 2025 through schemes to hide their final destination, with 275,000 Nvidia AI accelerators imported to Malaysia alone. While chips could be in offshore data centers, the ban's goal is to prevent Chinese AI labs from training on the most powerful chips. Megaspeed, through its subsidiary Speedmatrix, has been central to this trade and subject to US and Singaporean investigations.

**Key facts**

- Chinese AI models show Blackwell GPU training fingerprints
- Nvidia CEO Jensen Huang left the company
- US export controls ban Blackwell GPUs to China
- 2 million advanced chips estimated to enter China in 2024-2025
- 275,000 Nvidia AI accelerators imported to Malaysia in 2024-2025

**Why it matters:** AI engineers and policymakers need to understand that hardware export controls are being circumvented, allowing Chinese labs to access state-of-the-art compute. This impacts the competitive landscape and may necessitate a re-evaluation of how to enforce technology restrictions, potentially focusing on chip usage rather than ownership or installation location.

> Despite export bans, Chinese AI labs are accessing top-tier Nvidia GPUs, demonstrating the difficulty of controlling advanced technology flow and its implications for global AI development parity.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/11/13/export-banned-nvidia-chips-are-behind-chinas-most-powerful-ai-models-uh-oh-jensen/)

---

## AI contributes to a 20-40% increase in global ransomware attacks since spring

*Security · WIRED · 2026-11-14*

![Image may contain Body Part Finger Hand Person Computer Computer Hardware Computer Keyboard Electronics and Hardware](https://media.wired.com/photos/6af88e4339637940f3ecc20a/master/w_2560%2Cc_limit/image%2520(76)

Ransomware and data extortion attacks have seen a significant increase, with claimed incidents spiking over the last few months. Researchers estimate nearly 3,000 alleged attacks on leak sites over the summer, representing a 20-40% increase since spring. This rise is particularly evident in international attacks, with the United States remaining steady but high.

While fully AI-powered ransomware attacks are not yet prevalent, cybercriminals are using Large Language Models (LLMs) for tasks such as creating better phishing emails and aiding in negotiation processes. The underlying business model for ransomware is already effective, and successful groups like the Gentlemen, Qilin, and Akira are still primarily human-operated. However, experimentation with AI suggests this could change rapidly in the future.

Broader scamming trends, such as a drastic spike in successful scams in Japan due to AI-generated convincing content, indicate how AI can enhance initial access techniques for ransomware. Between July and September, approximately 111 ransomware groups made claims of attacks.

**Key facts**

- Alleged ransomware attacks reached nearly 3,000 over summer
- 20-40% increase in ransomware attacks since spring by some estimates
- Around 111 ransomware groups claimed attacks between July and September
- AI is used for phishing emails and negotiation, not full attack automation

**Why it matters:** Backend and security engineers must recognize that AI lowers the barrier to entry for attackers and increases the sophistication of social engineering. Existing security measures against phishing and initial access may need re-evaluation, and incident response teams should prepare for a higher volume and potentially more convincing attacks.

> AI is amplifying the threat of ransomware by enhancing attack components like phishing, making robust and adaptive security defenses more critical than ever.

[🔗 Read more at WIRED](https://www.wired.com/story/beware-the-new-ai-fueled-ransomware-boom/)

---

## OpenAI launches ChatGPT Wallet, enabling AI agents to complete online purchases

*AI Agents & Tooling · TechCrunch · 2026-11-13*

![ChatGPT Wallet](https://techcrunch.com/wp-content/uploads/2026/11/chatgpt-wallet.jpg?w=1024)

OpenAI has introduced a new Wallet feature for ChatGPT, enabling its AI agents, referred to as dots, to assist users in making online purchases and completing transactions on their behalf. This feature is initially available to a limited number of US ChatGPT Pro subscribers who are 18 years or older and possess a US-issued Visa, Mastercard, or American Express.

Users maintain control over purchases, needing to review items, totals, and payment cards, and must approve transactions using security checks like Face ID or fingerprints. Payment information is tokenized, meaning actual card details are not shared with the AI agent or merchant. The merchant automatically receives necessary fulfillment details such as shipping address and contact information.

This move by OpenAI follows a trend where consumer-facing AI tools are exploring practical applications, with Meta’s Muse, which has over 10 million users, reporting AI-assisted shopping as a top activity. Other personal AI agents, like Instinct, also support making purchases. OpenAI plans to expand availability and future controls like spending limits and category restrictions. Some retailers, including Amazon, are blocking AI agents to steer users towards their own AI solutions, prompting OpenAI to release a Commerce Partner Playbook for retailers.

**Key facts**

- ChatGPT Wallet launched by OpenAI
- Available to limited US ChatGPT Pro subscribers, 18+
- Supports Visa, Mastercard, American Express
- Purchases require user approval via Face ID or fingerprint
- Meta's Muse has 10 million+ users for AI-assisted shopping
- Amazon is blocking AI agents from its site

**Why it matters:** For AI and backend engineers, this signifies a significant step towards autonomous agentic commerce, requiring robust integration patterns, secure payment tokenization, and API design that anticipates AI interactions. It also highlights the emerging challenge of managing AI agent access for retailers and potentially new forms of bot-driven traffic.

> AI agents are moving beyond recommendations to autonomous purchasing, necessitating new security, integration, and user control paradigms for developers building agent-enabled platforms or e-commerce systems.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/)

---

## AI changes hacking economics, uncovering vulnerabilities faster in 'Black October'

*Security · DEV Community · 2026-11-13*

![AI Has Changed the Economics of Hacking: What Changes for Businesses After Black October - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fl66l7zkrt1a77i55spfl.png)

October saw a wave of AI-enabled cybersecurity incidents, dubbed "Black October," exposing a growing challenge for software businesses. AI has changed the economics of hacking by accelerating the discovery of vulnerabilities and the development of exploits, making it faster and more accessible for attackers.

Previously, examining unfamiliar code, identifying weaknesses, and developing exploits required significant time and specialized expertise. Now, automated scanners can rapidly analyze large codebases, and coding agents assist in identifying vulnerabilities and creating exploitation methods. This means that software previously considered well-scrutinized may no longer meet the same security standards.

Some open-weight AI models have undergone "abliteration," where their internal refusal mechanisms and safety guardrails are removed without retraining, potentially making them more amenable to malicious uses. While AI doesn't add expertise or guarantee successful attacks, it significantly lowers the barrier to entry and increases the speed at which sophisticated attacks can be mounted, challenging existing assumptions about software security and development.

**Key facts**

- October incidents termed "Black October"
- AI accelerates vulnerability discovery and exploit development
- Automated scanners and coding agents assist attackers
- Some open-weight models have undergone "abliteration"

**Why it matters:** Software and security engineers must re-evaluate their assumptions about code scrutiny and vulnerability timelines. AI's ability to rapidly identify and exploit flaws means existing software may have newly exposed weaknesses. Businesses need to enhance defensive AI strategies, prioritize continuous security testing, and consider AI-driven threat modeling to keep pace with evolving attack capabilities.

> AI is dramatically accelerating the pace of vulnerability discovery and exploitation, requiring businesses to adapt their software development and security practices to a new, faster threat landscape.

[🔗 Read more at DEV Community](https://dev.to/dailycontext/ai-has-changed-the-economics-of-hacking-what-changes-for-businesses-after-black-october-5h4c)

---

## FAA groundstop raises questions about AI reliability in aviation after pilotless flight milestone

*Industry · WIRED · 2026-11-14*

![No Pilots. Few Air Traffic Controllers. What Could Go Wrong? - WIRED](https://media.wired.com/photos/6af209fa2480549f4d787257/191:100/w_1280,c_limit/ai_aviation.jpg)

On Friday the 13th, the FAA issued a national groundstop, causing widespread airline chaos. The administration stated there was no evidence of a cyberattack or a connection to the new AI-infused air traffic control system, SMART. However, Homeland Security secretary Markwayne Mullin could not definitively rule out AI failure.

This incident occurred weeks after a Cessna Caravan completed a 3,200-mile coast-to-coast journey without human hands on the controls, marking a significant milestone for Joby Aviation. A safety pilot was on board but did not intervene. This pilotless flight highlights the accelerating integration of AI into the aviation industry, a sector traditionally conservative due to safety concerns.

The push for AI in aviation began with the Next Generation Air Transportation System (NextGen) project in 2007, which mandated changes like ADS-B by 2020 to allow drones and human-piloted aircraft to share airspace. Despite promises of improved efficiency, some former FAA employees express concern about the rapid adoption of AI, calling it a "Pandora's box."

**Key facts**

- FAA issued a national groundstop on Friday the 13th
- Cessna Caravan completed a 3,200-mile pilotless flight in September
- SMART is a new AI-infused air traffic control system
- NextGen project mandated ADS-B by 2020 for shared airspace

**Why it matters:** System engineers in safety-critical domains should closely monitor the ongoing challenges in AI reliability and certification in aviation. The FAA groundstop and the pilotless flight highlight the tension between adopting new AI capabilities for efficiency and ensuring robust fault tolerance and verifiable safety in complex systems.

> The aviation industry's rapid adoption of AI brings both unprecedented automation and significant questions about the reliability and safety of these new systems.

[🔗 Read more at WIRED](https://www.wired.com/story/no-pilots-few-air-traffic-controllers-what-could-go-wrong/)

---

## Kubernetes restarts applications, but does not inherently heal them from failures

*Cloud & Infrastructure · DEV Community · 2026-11-13*

![☸️ Kubernetes Is Not Healing Your Application. It's Just Restarting It. Here's What You Need to Know. - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F2cfqpp8bgr7owoh56zcd.png)

Kubernetes is designed to maintain the desired state of infrastructure by continuously observing the cluster and reconciling it towards the specified state, such as maintaining a set number of replicas for an application. If a Pod crashes, Kubernetes' controller attempts to create a replacement to meet the `replicas` requirement.

However, a common misunderstanding is that Kubernetes automatically makes applications healthy. The system restarts Pods that crash, but it cannot understand or fix underlying application failures. If an application's code has a bug or misconfiguration, Kubernetes will repeatedly restart the Pod, leading to a `CrashLoopBackOff` status, without resolving the root cause of the application's broken state.

The reconciliation loop ensures that if a Pod disappears, a new one is created, but this mechanism is about infrastructure stability rather than application-level intelligence or self-healing. Engineers must diagnose and fix application-specific issues themselves; Kubernetes only ensures the specified number of application instances are attempted.

**Key facts**

- Kubernetes maintains desired state through reconciliation loop
- It restarts crashed Pods to meet replica count
- Does not diagnose or fix application logic errors
- CrashLoopBackOff indicates repeated application failure

**Why it matters:** Backend and SRE engineers deploying to Kubernetes must focus on building resilient, self-healing applications rather than relying solely on Kubernetes for recovery. Understanding that Kubernetes restarts, but doesn't heal, means investing more in application-level observability, robust error handling, and proper health checks to avoid infinite crash loops and ensure true application health.

> Kubernetes provides infrastructure resilience through restarts, but application health remains the developer's responsibility, requiring robust application design and monitoring.

[🔗 Read more at DEV Community](https://dev.to/yash_sonawane25/kubernetes-is-not-healing-your-application-its-just-restarting-it-heres-what-you-need-to-5c1p)

---

## GitHub experienced eight incidents in October, including write outages and Azure network disruption

*Developer Tools · GitHub Blog · 2026-11-13*

![GitHub availability report: October 2026 - The GitHub Blog](https://github.blog/wp-content/uploads/2025/08/wallpaper-generic-.png)

GitHub experienced eight incidents in October 2026, resulting in degraded performance across its services. These issues highlighted the need for capacity growth to be matched with safer operations, stronger isolation, and validated regional recovery, especially during its ongoing migration to Azure.

Significant efforts were made to add independently scalable Azure capacity, removing potential failure escalation points. As of November 9, 140 of 151 production services and 32 of 50 MySQL primaries were running in Azure Central US. Azure is now serving 63% of migrated-service reads, 66% of monolith reads, and 52% of Git reads. Compute capacity across all nine Central US Kubernetes clusters has more than doubled, absorbing 82% traffic increase for migrated services since March.

Despite these improvements, reliability issues persisted. An October 7 write outage exposed an unsafe interaction between database orchestration and production routing. An Azure network disruption on October 29 affected all three Central US availability zones and at least 34,128 signed-in users. The buildout for East US 3 is approximately one week behind schedule, with the next phase of traffic ramp-up planned for the first week of December.

**Key facts**

- 8 incidents caused degraded GitHub performance in October
- 140 of 151 production services now in Azure Central US
- 63% of migrated-service reads served by Azure
- Central US Kubernetes clusters capacity doubled
- October 7 write outage affected database orchestration
- October 29 Azure network disruption affected 34,128+ users

**Why it matters:** Backend and SRE teams should note GitHub's ongoing challenges in a large-scale cloud migration, particularly regarding database orchestration, network disruptions, and the need for robust isolation. This provides a case study for the complexities of ensuring high availability during significant infrastructure shifts and the importance of validated regional recovery strategies.

> Even with substantial capacity growth, large cloud migrations like GitHub's require continuous refinement of operational safety, dependency isolation, and regional recovery to maintain reliability.

[🔗 Read more at GitHub Blog](https://github.blog/news-insights/company-news/github-availability-report-october-2026)

---

## GitHub introduces 'agent skills' for reusable, versioned instructions for AI agents

*AI Agents & Tooling · GitHub Blog · 2026-11-13*

![Build once, run on any agent: A practical guide to agent skills - The GitHub Blog](https://github.blog/wp-content/uploads/2026/11/5b5fed0ce69f241f469053d4f178383688adb2fb7ef44dff82c1a2dd6a626fa1-1920x1080-1.png)

GitHub has introduced "agent skills," a mechanism to capture repeatable engineering tasks as versioned instructions for AI agents. These skills are stored in a directory centered on a `SKILL.md` file, which describes when and how to perform a task. This allows engineers to reuse instructions across different agents, ensuring consistency and preventing knowledge loss.

Skills are designed to define a clear job with specific inputs and outputs. For example, a `proof-agent` skill can be used for adversarial verification of AI-generated work, spawning an independent verifier to check for false claims, broken code, or security issues. The `SKILL.md` frontmatter names the task and its purpose, while a "When to Verify" section specifies invocation conditions. The environment running the agent still provides the necessary tools, credentials, and permissions; the skill itself does not grant access.

This approach aims to enable engineers to define a task once and then apply it consistently, whether for individual use or as part of a team's pipeline, improving workflow efficiency and reducing the need to repeatedly explain complex tasks.

**Key facts**

- Agent skills capture repeatable tasks for AI agents
- Skills are stored in versioned directories with a `SKILL.md` file
- Proof Agent uses a separate verifier for AI-generated work
- Environment provides tools/credentials; skill defines the task

**Why it matters:** AI and DevOps engineers should consider adopting agent skills to standardize and version their AI-driven automation workflows. This approach promotes reusability, reduces cognitive load, and enhances collaboration when integrating AI agents into existing CI/CD pipelines or operational tasks, ensuring consistency and auditability for automated actions.

> Agent skills provide a structured way to define and share AI agent instructions, making automation more consistent, auditable, and reusable across engineering teams.

[🔗 Read more at GitHub Blog](https://github.blog/ai-and-ml/github-copilot/build-once-run-on-any-agent-a-practical-guide-to-agent-skills)

---

## Google Gemini 4 Carbon released to paying developers, Anthropic offers cheaper Claude Fable 5.2

*AI Agents & Tooling · DEV Community · 2026-11-12*

![AI Dev Weekly #34: Gemini 4 Carbon, Claude Fable 5.2 and Muse Ember - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fwww.aimadetools.com%2F_astro%2Fai-dev-weekly-034-gemini-carbon-claude-fable-52-muse-ember.BI1qf99w.png)

Google has made Gemini 4 Carbon available to paying developers and enterprises through Google AI Studio and Gemini for business, following a limited rollout two weeks prior. The introductory pricing until November 30 is $2 per million input tokens and $10 per million output tokens, after which rates will increase to $4 and $20, respectively.

In related news, Anthropic has released Claude Fable 5.2, a cheaper model, alongside a restricted Mythos model. Meta also introduced a new model for high-volume agent work, and OpenAI added a dedicated API model specifically for approved security teams.

These releases highlight the ongoing trend of AI model providers offering specialized versions and varied pricing tiers to cater to different developer needs and use cases, from general development to high-volume agent tasks and security applications.

**Key facts**

- Gemini 4 Carbon available to paying developers Nov 10
- Introductory pricing: $2/M input, $10/M output tokens until Nov 30
- Rates rise to $4/M input, $20/M output tokens after Nov 30
- Anthropic released Claude Fable 5.2 and Mythos
- Meta introduced a model for high-volume agent work
- OpenAI added an API model for approved security teams

**Why it matters:** AI engineers need to evaluate new models like Gemini 4 Carbon and Claude Fable 5.2 for their specific cost-performance trade-offs in different workflows. The emergence of specialized models for security teams and high-volume agent work indicates a need to align model choice with application requirements and budget, rather than a one-size-fits-all approach.

> The AI model market is diversifying with specialized models and tiered pricing, requiring developers to carefully select the right tool for each specific workflow and cost constraint.

[🔗 Read more at DEV Community](https://dev.to/ai_made_tools/ai-dev-weekly-34-gemini-4-carbon-claude-fable-52-and-muse-ember-3ol6)

---

## Quick hits

- **[OpenAI's ChatGPT app saw mixed success with redesigns and standalone apps, while Apple's Siri AI is rolling out](https://techcrunch.com/2026/11/14/the-ai-graveyard-a-running-list-of-projects-and-startups-that-didnt-make-it/)** (TechCrunch) — OpenAI experienced challenges with ChatGPT app redesigns and standalone applications like Sora, while Apple's improved Siri AI is now rolling out in iOS 27 beta.

---

## What to watch

- How will US export controls on advanced AI chips evolve to prevent circumvention, particularly concerning offshore data centers?
- Will the rise of AI-fueled ransomware lead to new international cybersecurity regulations or a shift in corporate defense strategies?
- How will OpenAI evolve its ChatGPT Wallet, especially concerning retailer adoption and user-configurable spending limits, and will Amazon's competitive stance continue to block AI agents?

---

## Sources

- [Chinese AI models trained on US-banned Nvidia Blackwell GPUs despite export controls](https://techcrunch.com/2026/11/13/export-banned-nvidia-chips-are-behind-chinas-most-powerful-ai-models-uh-oh-jensen/) — TechCrunch, 2026-11-14
- [AI contributes to a 20-40% increase in global ransomware attacks since spring](https://www.wired.com/story/beware-the-new-ai-fueled-ransomware-boom/) — WIRED, 2026-11-14
- [OpenAI launches ChatGPT Wallet, enabling AI agents to complete online purchases](https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/) — TechCrunch, 2026-11-13
- [AI changes hacking economics, uncovering vulnerabilities faster in 'Black October'](https://dev.to/dailycontext/ai-has-changed-the-economics-of-hacking-what-changes-for-businesses-after-black-october-5h4c) — DEV Community, 2026-11-13
- [FAA groundstop raises questions about AI reliability in aviation after pilotless flight milestone](https://www.wired.com/story/no-pilots-few-air-traffic-controllers-what-could-go-wrong/) — WIRED, 2026-11-14
- [Kubernetes restarts applications, but does not inherently heal them from failures](https://dev.to/yash_sonawane25/kubernetes-is-not-healing-your-application-its-just-restarting-it-heres-what-you-need-to-5c1p) — DEV Community, 2026-11-13
- [GitHub experienced eight incidents in October, including write outages and Azure network disruption](https://github.blog/news-insights/company-news/github-availability-report-october-2026) — GitHub Blog, 2026-11-13
- [GitHub introduces 'agent skills' for reusable, versioned instructions for AI agents](https://github.blog/ai-and-ml/github-copilot/build-once-run-on-any-agent-a-practical-guide-to-agent-skills) — GitHub Blog, 2026-11-13
- [Google Gemini 4 Carbon released to paying developers, Anthropic offers cheaper Claude Fable 5.2](https://dev.to/ai_made_tools/ai-dev-weekly-34-gemini-4-carbon-claude-fable-52-and-muse-ember-3ol6) — DEV Community, 2026-11-12
- [OpenAI's ChatGPT app saw mixed success with redesigns and standalone apps, while Apple's Siri AI is rolling out](https://techcrunch.com/2026/11/14/the-ai-graveyard-a-running-list-of-projects-and-startups-that-didnt-make-it/) — TechCrunch, 2026-11-14
