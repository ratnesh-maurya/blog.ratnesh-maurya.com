---
title: North Korea's TraderTraitor Steals $6.43B; AI Agents Drive
description: >-
  Europe's supermarkets hit by cyberattacks on refrigerators; OpenAI merges
  ChatGPT tabs; Anthropic's IPO reveals huge compute commitments; AI infostealer
  ranks
date: '2026-11-02'
tags:
  - TraderTraitor
  - Binance
  - Polymarket
  - DebugBear
  - Next.js
  - TypeScript
  - Anthropic
  - OpenAI
source: tavily
stories: 10
sources:
  - The Hacker News
  - TechCrunch
  - The Register
  - DEV Community
  - The New Stack
---

This week highlights a tension between the increasing sophistication of AI and the persistent, fundamental security challenges facing our systems. While AI agents are making development tasks like code rewrites significantly cheaper, the same technology is being leveraged in advanced cyberattacks, demonstrating that foundational security practices remain critical across all industries, from cryptocurrency exchanges to supermarket cold chains.

## TL;DR

- **FBI Attributes Record $6.43 Billion Binance Crypto Heist to North Korea's TraderTraitor** — The FBI has officially linked North Korea's TraderTraitor hacking group to the theft of $6.43 billion in virtual assets from Binance, the largest crypto theft in history.
- **Cyberattacks on Danfoss IoT Refrigerators Spoil Food in European Supermarkets** — A second wave of cyberattacks on internet-connected Danfoss refrigerators caused food spoilage at dozens of supermarket stores in Belgium, Ireland, Luxembourg, and Sweden.
- **VOLTA Infostealer Uses AI Models to Rank Victims' Data by Financial Value** — The new Windows infostealer VOLTA-AUTODOXER utilizes AI models via OpenRouter to analyze and rank stolen victim data based on its monetization potential.
- **Hackers Steal $2.7 Million from Polymarket Traders via Hijacked DebugBear Script** — Hackers stole approximately $2.7 million from 726 Polymarket traders by replacing a legitimate DebugBear page-speed script with malicious code via a DNS compromise.
- **Anthropic's IPO Prospectus Highlights Nearly Trillion-Dollar Compute Commitments** — Anthropic's S-1 filing for its IPO reveals nearly a trillion dollars in compute commitments, indicating significant future cash burn for the AI company.
- **AI Coding Agent Costs Explained: Workload-Based Pricing Averages Thousands Monthly** — A typical AI coding agent workload for a small team can cost thousands of dollars per month due to multiple API calls and context resending per task.
- **Next.js 16.4 Recommends Cache Components, Introduces Agent Upgrade Tooling** — Next.js 16.4 recommends Cache Components for all apps, makes it default for new projects, and introduces agent tooling for upgrades and bug reporting.
- **AI Agents Make Code Rewrites Cheaper, But Testing Still Key** — AI coding agents have significantly reduced the cost of writing code for rewrites, making projects like a 100,000-line C compiler in Rust or a Next.js API re-implementation in Vite cost less than $20,000 in API fees.
- **OpenAI to Merge ChatGPT's Chat and Work Tabs for Unified Experience** — OpenAI is merging the Chat and Work tabs within the ChatGPT desktop app into a single interface, with initial rollout to select users for feedback.
- **AI Helps Developers Choose Tools: The New Stack Tracks AI Recommendations** — The New Stack is tracking how AI recommends developer tools, collecting data on which non-React JavaScript tools AI suggests most often.

---

## FBI Attributes Record $6.43 Billion Binance Crypto Heist to North Korea's TraderTraitor

*Top story · Security · The Hacker News · 2026-11-01*

The U.S. Federal Bureau of Investigation (FBI) has attributed the record-breaking theft of over $6 billion in virtual assets from Binance to TraderTraitor, an elite North Korea-aligned hacking group also known as Jade Sleet. This incident is now the largest cryptocurrency theft in history, surpassing the $1.46 billion taken from Bybit in February 2025. The stolen funds, primarily in Ethereum and Bitcoin across 11 blockchains, are being laundered by converting them into Ethereum and then using DeFi and instant swap services.

Binance paused withdrawals after the incident and has since resumed phase one of withdrawals after conducting security assessments. Of the $6.43 billion stolen, $2.85 billion has been frozen on-chain by Tether, Circle, Ripple, Arbitrum, and Optimism. TraderTraitor, active since at least 2020, has a history of targeting the Web3.0 industry with malware-laced applications, and is believed to have stolen over $6.5 billion in crypto assets in recent years.

**Key facts**

- FBI attributes theft to North Korea's TraderTraitor group
- Record $6.43 billion stolen from Binance
- Funds stolen across 11 blockchains, 82% on Ethereum and Bitcoin
- $2.85 billion frozen on-chain by various entities
- Binance resumed phase one withdrawals after the incident

**Why it matters:** This unprecedented theft underscores the extreme security risks in the crypto exchange and Web3.0 ecosystem. Backend and security engineers working with virtual assets must prioritize advanced threat detection, secure key management, and robust incident response protocols. The attribution to a state-sponsored actor highlights the need for comprehensive defenses against sophisticated, well-resourced adversaries.

> North Korea's TraderTraitor executed the largest crypto heist in history, proving that state-sponsored actors pose a top-tier threat to virtual asset security.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/11/fbi-links-north-koreas-tradertraitor-to.html)

---

## Cyberattacks on Danfoss IoT Refrigerators Spoil Food in European Supermarkets

*Security · TechCrunch · 2026-11-02*

![warning sign on supermarket freezer](https://techcrunch.com/wp-content/uploads/2026/11/supermarket-freezer-hack-2299514106.jpg?w=1024)

Supermarkets across Europe, including Ahold Delhaize and Colruyt, have experienced significant food losses due to cyberattacks targeting their internet-connected refrigerators. Hackers altered temperature settings to defrost units, spoiling goods in dozens of stores in Belgium, Ireland, Luxembourg, and Sweden. This follows earlier attacks in France last month that affected hundreds of supermarkets.

Security researchers attribute the hacks to vulnerable Danfoss refrigerator units, for which the company is no longer providing security updates. Claroty had warned of remote hack risks for these units in August. The attacks underscore vulnerabilities in the food supply chain due to overlooked cybersecurity practices, recalling a 2025 cyberattack on UNFI that led to U.S. food shortages.

**Key facts**

- Second wave of attacks, following incidents in France last month
- Affected dozens of stores in Belgium, Ireland, Luxembourg, Sweden
- Vulnerable internet-connected refrigerators made by Danfoss
- Security company Claroty warned about risks in August

**Why it matters:** This incident demonstrates how unpatched IoT devices can lead to physical-world disruptions and significant financial loss, even in non-traditional sectors. Engineers maintaining operational technology (OT) and IoT infrastructure must prioritize security updates and consider the long-term support lifecycle of connected devices to prevent critical system failures.

> Unpatched IoT devices in critical infrastructure pose substantial real-world risks beyond data breaches, impacting physical operations and supply chains.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/11/02/a-fresh-wave-of-cyberattacks-has-hit-europes-supermarket-refrigerators-destroying-food-across-countries/)

---

## VOLTA Infostealer Uses AI Models to Rank Victims' Data by Financial Value

*Security · The Hacker News · 2026-11-02*

![cybersecurity](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg98jBiF1GNyn9ReXVuuNzrDrJ8-mdCvE5IhR6dUbEnucAAvmCW-lbjZmzjJx0EhFV2R6xhfph0uQ-cz4IO46xmarphU8oOZmuqbdHxTeosFZTJ45LN6VEQOAdLCFB_iwlP3t9_i9qiQqQua1oJMGmp5wILrYvUWRBTMAVJphcDt7Qo0Yi5gK9pIHhW5pAb/s728-nu-rw-lo-l85-e365/wiz-d.png)

Cybersecurity researchers have uncovered VOLTA-AUTODOXER, a Windows infostealer that leverages large language models (LLMs) to prioritize stolen data by financial value. VOLTA collects a wide range of sensitive information, including browser passwords, payment cards, crypto wallet seed phrases, Slack data, and cloud-provider keys. It enhances this data by searching Gmail for receipts to corroborate home addresses and creates a live Roblox account valuation.

The malware then feeds this structured evidence bundle into an AI system using OpenRouter, an LLM API gateway, with a system prompt instructing the model to act as a "forensic intelligence analyst." It defaults to Anthropic's Claude Opus 4.6, with fallbacks to Moonshot AI's Kimi K2 and Google's Gemini 2.5 Flash, to generate a target assessment that includes a 'WHAT THEY'RE WORTH' section with valuables ranked by monetization tiers (low/medium/high) and an 'OPSEC' assessment.

**Key facts**

- Uses Anthropic's Claude Opus 4.6, Moonshot AI's Kimi K2, and Google's Gemini 2.5 Flash
- Connects via OpenRouter unified LLM API gateway
- Collects passwords, cookies, payment cards, crypto seed phrases, SSH keys
- Exfiltrates data over Telegram in three stages

**Why it matters:** This highlights a new frontier in cybercrime where AI is used not just for initial access, but for intelligent data exfiltration and monetization. Engineers must be aware of such advanced threats to improve defenses, focusing on multi-factor authentication, robust endpoint security, and monitoring for unusual API gateway traffic or LLM usage patterns in their environments.

> AI is now actively used by infostealers to prioritize and monetize stolen data, demanding more intelligent defensive strategies.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/11/new-volta-infostealer-uses-claude.html)

---

## Hackers Steal $2.7 Million from Polymarket Traders via Hijacked DebugBear Script

*Security · The Hacker News · 2026-11-01*

![cybersecurity](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg98jBiF1GNyn9ReXVuuNzrDrJ8-mdCvE5IhR6dUbEnucAAvmCW-lbjZmzjJx0EhFV2R6xhfph0uQ-cz4IO46xmarphU8oOZmuqbdHxTeosFZTJ45LN6VEQOAdLCFB_iwlP3t9_i9qiQqQua1oJMGmp5wILrYvUWRBTMAVJphcDt7Qo0Yi5gK9pIHhW5pAb/s728-nu-rw-lo-l85-e365/wiz-d.png)

On October 29, malicious code injected into Polymarket's website through a compromised DebugBear script resulted in the theft of about $2.7 million from 726 traders. The attackers gained control of DebugBear's DNS records via its domain registrar, allowing them to serve a wallet-draining script in place of Polymarket's legitimate page-speed monitoring script.

This malicious code, which was active for less than an hour, exploited existing access in signed-in Polymarket sessions. It used traders' API keys and the account's own signer to either move positions directly to the hacker's wallet (for crypto wallet sign-ins) or sell positions at unfavorable prices and transfer funds (for email sign-ins). DebugBear stated its own systems were not breached, but its DNS records were compromised.

**Key facts**

- Approximately $2.7 million stolen from 726 wallets
- Incident occurred on October 29
- Malicious code replaced DebugBear RUM script
- DebugBear's DNS records were compromised through its domain registrar

**Why it matters:** This incident underscores the critical vulnerability of third-party scripts and the supply chain for web assets, even for seemingly innocuous performance monitoring tools. Frontend and security engineers must implement robust Subresource Integrity (SRI) or Content Security Policy (CSP) headers to prevent unauthorized script execution from compromised external domains and continuously monitor DNS records for anomalies.

> Compromised third-party scripts via DNS hijacking can lead to direct financial theft, emphasizing the need for strict supply chain security measures and robust content policies.

[🔗 Read more at The Hacker News](https://thehackernews.com/2026/11/hackers-steal-about-27-million-from.html)

---

## Anthropic's IPO Prospectus Highlights Nearly Trillion-Dollar Compute Commitments

*AI Models · The Register · 2026-11-02*

![Anthropic's IPO prospectus is big on promises, short on answers to tough questions](https://image.theregister.com/225166.jpg?imageId=225166&x=0&y=0&cropw=100&croph=100&panox=0&panoy=0&panow=100&panoh=100&width=1200&height=683)

Anthropic has filed for its initial public offering, with its S-1 prospectus revealing substantial financial commitments. The company faces nearly a trillion dollars in compute commitments, suggesting a high rate of cash consumption in the foreseeable future. The prospectus also highlights that a significant portion of Anthropic's computing power relies on customers who are also competitors.

Despite these large future expenditures, Anthropic reported operating losses of approximately $700 million on $16.3 billion in net revenues. The filing also mentioned $80.7 billion in total losses, attributed to an accounting adjustment.

**Key facts**

- Nearly a trillion dollars in compute commitments
- Operating losses of approximately $700 million
- Reported $16.3 billion in net revenues
- Total losses of $80.7 billion due to an accounting adjustment

**Why it matters:** The massive compute commitments signal the high capital expenditure required to train and run large AI models. Engineers in AI infrastructure and operations should expect this trend to continue, influencing cloud provider pricing, hardware demand, and the overall cost structure of developing and deploying large-scale AI solutions.

> Anthropic's IPO filing underscores the immense, trillion-dollar compute costs associated with developing and operating advanced AI models.

[🔗 Read more at The Register](https://www.theregister.com/ai-and-ml/2026/11/02/anthropics-ipo-prospectus-is-big-on-promises-short-on-answers-to-tough-questions/5306811)

---

## AI Coding Agent Costs Explained: Workload-Based Pricing Averages Thousands Monthly

*AI Agents & Tooling · DEV Community · 2026-11-02*

![What an AI coding agent actually costs per month (and 5 ways to cut it) - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F5eykvf1umnse0frw7w3a.png)

The cost of using AI coding agents, such as Claude Code or Codex, can be substantial, often reaching thousands of dollars monthly for a realistic workload. Unlike chatbots that make one request per question, agents operate in loops, sending multiple API calls for each task. Each step in an agent's process—reading files, planning, editing, running tests, and debugging—involves a separate API call that resends the entire context, including instructions and read files. This leads to a single 'fix this bug' task generating 10-20 calls, each potentially with 20,000 input tokens.

For a workload involving 5 tasks per day, 5-10 steps per task, 20,000 input tokens per step, and 500 output tokens per step, the monthly cost for various models ranges from $1,800 to $4,900, assuming a 50% cache hit rate. OpenRouter's Claude Opus 4.6 is priced at $4,900/month, while Anthropic's Claude Code 4.6 costs $4,300/month. Google's Gemini 2.5 Flash is $2,200/month, and Moonshot AI's Kimi K2 is $1,800/month. These figures are based on list prices as of November 2, 2026, and exclude cache-write fees or subscription discounts.

**Key facts**

- Typical workload for a small team costs $1,800 - $4,900 per month
- A single task can involve 10-20 API calls
- Each API call resends the entire context
- Prices checked on November 2, 2026

**Why it matters:** Engineers adopting AI coding agents must understand the token-based pricing model and its implications for cost. Optimizing agent prompts, leveraging caching, and selecting cost-effective models are crucial for managing cloud spend, as agents' iterative nature can quickly accumulate high API charges.

> AI coding agents are expensive due to their iterative, context-heavy operations; cost optimization is critical for adoption.

[🔗 Read more at DEV Community](https://dev.to/agentcosthub/what-an-ai-coding-agent-actually-costs-per-month-and-5-ways-to-cut-it-14n6)

---

## Next.js 16.4 Recommends Cache Components, Introduces Agent Upgrade Tooling

*Developer Tools · DEV Community · 2026-11-02*

![October 2026 for React and AI Devs: Next.js 16.4, TypeScript 7.1 Beta, a Big TanStack Month, Convex 1.47 to 1.49 - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F9n05k0o8tgs9jow43jg8.png)

Next.js 16.4, released on October 6, recommends Cache Components for all Next.js applications, making it the default for new `create-next-app` projects and signaling it will be the default in Next.js 17. The update also includes new agent tooling: `next upgrade --agent` provides version-specific upgrade steps, `experimental.agentUpgrade` nudges developers during `next dev` and `next build` about relevant upgrades (security fixes by default), and `experimental.agentFeedback` allows agents to draft bug reports for review before submission. The experimental Rust React Compiler now has a fast path for files that don't need compilation, reducing memory usage by 30% and compile times by 15%. Other improvements include a 20-25% smaller Turbopack disk cache, lazy server HMR, and shorter CSS Module class names in production. Next.js has also scheduled a security release for November 3, addressing seven medium-severity vulnerabilities.

**Key facts**

- Next.js 16.4 released October 6
- Cache Components recommended for all apps, default in new projects
- New agent tooling: `next upgrade --agent`, `experimental.agentUpgrade`, `experimental.agentFeedback`
- Rust React Compiler: 30% less memory, 15% faster compiles
- Next.js security release scheduled for November 3

**Why it matters:** For React and Next.js developers, the push towards Cache Components and integrated AI tooling will streamline development and maintenance workflows, but requires understanding new configurations and security updates. Developers should plan for the upcoming security release on November 3 and evaluate the new agent features for potential integration into their upgrade and bug reporting processes.

> Next.js 16.4 introduces AI-assisted developer tools and makes Cache Components standard, requiring developers to adapt to new workflows and security updates.

[🔗 Read more at DEV Community](https://dev.to/sushilmagare10/october-2026-for-react-and-ai-devs-nextjs-164-typescript-71-beta-a-big-tanstack-month-convex-571h)

---

## AI Agents Make Code Rewrites Cheaper, But Testing Still Key

*Developer Tools · DEV Community · 2026-11-02*

![Agents Made Rewrites Cheap to Type. Spolsky's 2000 Warning Was Never About Typing - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F401nkdx91llm0119pejm.jpg)

AI coding agents have dramatically lowered the monetary cost of code generation for large-scale rewrites. Anthropic's Claude agents were used to rewrite a 100,000-line C compiler in Rust, costing under $20,000 in API fees over two weeks. Similarly, Cloudflare's vinext project, a re-implementation of the Next.js API on Vite, cost roughly $1,100 in Claude API tokens using OpenCode. These projects relied heavily on comprehensive, existing test suites (e.g., GCC torture test suite, Next.js repository tests) to validate the agent-generated code.

This shift challenges Joel Spolsky's 2000 warning against rewrites, which focused on the hidden costs beyond typing. The article argues that while agents make the 'typing' aspect of rewrites cheap, the critical, time-consuming part—developing a robust test suite to ensure correctness—remains essential and expensive. Without a strong test suite, the output from AI agents, however cheap to generate, cannot be reliably integrated.

**Key facts**

- Anthropic agents wrote 100,000-line C compiler in Rust for under $20,000
- Cloudflare's vinext cost roughly $1,100 in Claude API tokens
- Both projects relied on extensive pre-existing test suites
- Challenges Joel Spolsky's 2000 rewrite warning

**Why it matters:** Engineers can now leverage AI agents to drastically reduce the human effort and time associated with generating code for large refactors and rewrites. However, this only applies when a comprehensive, automated test suite is already in place. The core engineering challenge shifts from writing code to writing robust tests and effectively managing the agent-driven development lifecycle.

> AI agents make code generation cheap, but robust test suites remain the true bottleneck for successful, reliable software rewrites.

[🔗 Read more at DEV Community](https://dev.to/gabrielanhaia/agents-made-rewrites-cheap-to-type-spolskys-2000-warning-was-never-about-typing-4d0)

---

## Quick hits

- **[OpenAI to Merge ChatGPT's Chat and Work Tabs for Unified Experience](https://techcrunch.com/2026/11/02/openai-is-finally-merging-chatgpts-chat-and-work-tabs/)** (TechCrunch) — OpenAI is merging the Chat and Work tabs within the ChatGPT desktop app into a single interface, with initial rollout to select users for feedback.
- **[AI Helps Developers Choose Tools: The New Stack Tracks AI Recommendations](https://thenewstack.io/tracking-ai-tool-recommendations)** (The New Stack) — The New Stack is tracking how AI recommends developer tools, collecting data on which non-React JavaScript tools AI suggests most often.

---

## What to watch

- The upcoming Next.js security release on November 3, and the advisories for the seven medium-severity vulnerabilities it addresses.
- The broader impact of Anthropic's compute commitments on cloud and AI infrastructure pricing as other AI companies approach IPOs.
- How security practices for third-party scripts and IoT devices evolve to counter sophisticated AI-enhanced cyberattacks like VOLTA-AUTODOXER and the Danfoss refrigerator hacks.

---

## Sources

- [FBI Attributes Record $6.43 Billion Binance Crypto Heist to North Korea's TraderTraitor](https://thehackernews.com/2026/11/fbi-links-north-koreas-tradertraitor-to.html) — The Hacker News, 2026-11-01
- [Cyberattacks on Danfoss IoT Refrigerators Spoil Food in European Supermarkets](https://techcrunch.com/2026/11/02/a-fresh-wave-of-cyberattacks-has-hit-europes-supermarket-refrigerators-destroying-food-across-countries/) — TechCrunch, 2026-11-02
- [VOLTA Infostealer Uses AI Models to Rank Victims' Data by Financial Value](https://thehackernews.com/2026/11/new-volta-infostealer-uses-claude.html) — The Hacker News, 2026-11-02
- [Hackers Steal $2.7 Million from Polymarket Traders via Hijacked DebugBear Script](https://thehackernews.com/2026/11/hackers-steal-about-27-million-from.html) — The Hacker News, 2026-11-01
- [Anthropic's IPO Prospectus Highlights Nearly Trillion-Dollar Compute Commitments](https://www.theregister.com/ai-and-ml/2026/11/02/anthropics-ipo-prospectus-is-big-on-promises-short-on-answers-to-tough-questions/5306811) — The Register, 2026-11-02
- [AI Coding Agent Costs Explained: Workload-Based Pricing Averages Thousands Monthly](https://dev.to/agentcosthub/what-an-ai-coding-agent-actually-costs-per-month-and-5-ways-to-cut-it-14n6) — DEV Community, 2026-11-02
- [Next.js 16.4 Recommends Cache Components, Introduces Agent Upgrade Tooling](https://dev.to/sushilmagare10/october-2026-for-react-and-ai-devs-nextjs-164-typescript-71-beta-a-big-tanstack-month-convex-571h) — DEV Community, 2026-11-02
- [AI Agents Make Code Rewrites Cheaper, But Testing Still Key](https://dev.to/gabrielanhaia/agents-made-rewrites-cheap-to-type-spolskys-2000-warning-was-never-about-typing-4d0) — DEV Community, 2026-11-02
- [OpenAI to Merge ChatGPT's Chat and Work Tabs for Unified Experience](https://techcrunch.com/2026/11/02/openai-is-finally-merging-chatgpts-chat-and-work-tabs/) — TechCrunch, 2026-11-02
- [AI Helps Developers Choose Tools: The New Stack Tracks AI Recommendations](https://thenewstack.io/tracking-ai-tool-recommendations) — The New Stack, 2026-10-31
