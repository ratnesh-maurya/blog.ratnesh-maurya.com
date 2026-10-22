---
title: 'Agent Security Auditing Emerges, PHP Vulnerabilities Leaked by'
description: >-
  This digest covers the emergence of security auditing as a product category
  for AI coding agents, a significant supply chain security incident involving
  PHP and
date: '2026-10-22'
tags:
  - AI Agents
  - Security Auditing
  - PHP
  - Chainguard
  - Recursive Flint
  - Cloudflare
  - AWS
  - X.509 PKI
source: tavily
stories: 10
sources:
  - The Register
  - DEV Community
  - TechCrunch
  - Amazon
  - WIRED
  - The New Stack
---

The rapid adoption of AI coding agents is creating new security and operational challenges, as evidenced by the emergence of specialized security auditing tools and a major incident where a supply chain security vendor prematurely disclosed critical PHP vulnerabilities. Meanwhile, developers are seeking ways to manage the costs and maintain control over these powerful AI tools.

## TL;DR

- **PHP Blames Chainguard for Prematurely Revealing Critical PHP Vulnerabilities** — PHP maintainers accused supply chain security firm Chainguard of breaking an embargo by publishing fixed images early, effectively disclosing critical PHP2shell vulnerabilities (CVE-2026-109618, CVE-2026-109619) before a coordinated release.
- **Security Review for AI Agents Becomes a Shippable Product Category** — Security review for AI agents has transitioned from a roadmap item to a shippable product category, driven by increased agent deployment in production.
- **Recursive Launches Flint, a Laptop Coding Model Built Largely by AI** — Recursive, an AI startup, released Flint, a free, open-source coding model built largely by AI that runs on laptops and outperforms similar-sized models in speed and bug fixing.
- **Google Cloud London Outage Caused by "Power Event" in Europe-West2-B Zone** — A "power event" in Google Cloud's europe-west-2-b availability zone in London caused an outage disrupting multiple services for customers across Western Europe.
- **AWS Advises Benchmarking AI Coding Agent Cost and Quality on Custom Codebases** — AWS recommends benchmarking AI coding agent model selection against a company's own code and tasks to optimize cost and quality.
- **Recursive's Flint Model Advances Recursive Self-Improvement in AI Development** — Recursive's Flint AI coding model, developed mostly by its Eureka Machine AI system, demonstrates progress in recursive self-improvement (RSI) in AI.
- **OpenCode Breach Highlights Dual-Use Dilemma in AI Cyber Defense** — A breach involving OpenCode underscored the challenge of creating AI tools that can block malicious cyber activity while still assisting legitimate security defenders.
- **Cloudflare Leads Agent-Written Rust Port of TypeScript** — Cloudflare is spearheading a Rust port of TypeScript, with the code largely written by AI agents, not a fork of TypeScript.
- **Gentle-AI and Agentic-Awesome-Skills Promote Open, Local AI Agent Systems** — The 'Post-Lock-in Agent Era' is emerging with frameworks like 'gentle-ai' and 'agentic-awesome-skills' to counter proprietary AI coding agents by promoting local-first, portable, and human-centric systems.
- **AWS Details Securing AI Agent Identity with X.509 PKI** — AWS published guidance on using X.509 PKI with Keyfactor EJBCA and AWS services to secure AI agent identity when agents access sensitive resources.

---

## PHP Blames Chainguard for Prematurely Revealing Critical PHP Vulnerabilities

*Top story · Security · The Register · 2026-10-22*

![PHP blames supply chain security biz Chainguard for putting huge chunks of the web at risk](https://image.theregister.com/5304620.jpg?imageId=5304620&x=0&y=0&cropw=100&croph=100&panox=0&panoy=0&panow=100&panoh=100&width=1200&height=683)

PHP maintainers have accused Chainguard of prematurely revealing critical PHP vulnerabilities, PHP2shell (CVE-2026-109618 and CVE-2026-109619), which allow unauthenticated attackers to execute code. Researchers at Calif, OpenAI, and Wiz used AI models to discover these bugs between August and September.

PHP maintainers stated that two CVE IDs began circulating on October 20th, prompting them to move the disclosure forward from Thursday to Wednesday, October 21st. Calif then "mistakenly" published a video with a proof-of-concept exploit. On October 21st at 07:41 UTC, more than six hours before the coordinated release, Chainguard published built images containing the fix. This action, according to PHP, allowed attackers to study the fix in binary form while other users awaited the official release.

**Key facts**

- Vulnerabilities: PHP2shell (CVE-2026-109618, CVE-2026-109619)
- Discovered by: Calif, OpenAI, Wiz using AI models
- Discovery period: August-September
- Chainguard broke embargo: October 21st, 07:41 UTC
- PHP patch moved from Thursday to Wednesday

**Why it matters:** This incident underscores the risks of uncoordinated vulnerability disclosures, particularly for widely used software like PHP. Engineers should immediately apply patches for CVE-2026-109618 and CVE-2026-109619 and reinforce strict adherence to coordinated vulnerability disclosure protocols within their organizations and with third-party vendors.

> Premature disclosure of vulnerabilities, even by security vendors, can leave systems exposed; timely patching remains critical.

[🔗 Read more at The Register](https://www.theregister.com/security/2026/10/22/php-blames-supply-chain-security-biz-chainguard-for-putting-huge-chunks-of-the-web-at-risk/5304611)

---

## Security Review for AI Agents Becomes a Shippable Product Category

*Security · DEV Community · 2026-10-22*

![Who Audits the Agent? Security Review Is a Category - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fagentconn.com%2Fblog%2Fwho-audits-the-agent-security-review-skills-hero.jpg)

AI coding agents are now authoring over 10% of merged PRs at Monzo and handling 1,800 tasks daily, with GEICO burning $1,000 in tokens daily for agent fleets. This shift from experimental use to production deployment has made the security review of agent-generated work a critical concern.

The demand for agent security solutions has converged with an ecosystem of academic benchmarks, open-source scanners, commercial toolkits, and industry standards. Cloudflare's `security-audit-skill` GitHub repository, with 37,000 stars and gaining 2,000 daily, exemplifies this new product category.

**Key facts**

- Monzo: agents author >10% of merged PRs
- Monzo: agents handle 1,800 tasks per day
- GEICO: AI war room burns $1,000 in tokens daily
- Cloudflare `security-audit-skill` has 37,000 GitHub stars
- Cloudflare `security-audit-skill` gaining 2,000 stars/day

**Why it matters:** Engineers must now integrate specialized security auditing tools into their CI/CD pipelines to vet code generated by AI agents, much like traditional static analysis, to prevent the introduction of vulnerabilities into production systems.

> As AI agents ship production code, dedicated security review processes and tools are becoming a necessity.

[🔗 Read more at DEV Community](https://dev.to/max_quimby/who-audits-the-agent-security-review-is-a-category-g4e)

---

## Recursive Launches Flint, a Laptop Coding Model Built Largely by AI

*AI Models · TechCrunch · 2026-10-22*

![Recursive launches Flint, a laptop coding model it says was largely built by AI - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/05/GettyImages-2157738833.jpg?resize=1200,800)

Recursive, an AI startup, launched Flint, a free coding model available on Hugging Face under the Apache 2.0 license. Flint was developed primarily by Recursive's automated research system, the Eureka Machine, which contributed to nearly every development step, enabling a small team to build the model in under four months.

Flint is a mixture-of-experts model, using 2.5 billion of its 40 billion parameters per task, making it suitable for laptops and significantly smaller than Meta’s Muse Spark Open (816 billion parameters). It generates about 131 tokens per second on a MacBook Pro with an M4 Pro chip, roughly twice the speed of Google’s Gemma 4 and Nvidia’s Nemotron 3.5 Lightning. Flint outperformed other models under 50 billion parameters on the SWE-Bench Verified bug-fixing benchmark.

**Key facts**

- Flint model parameters: 40 billion total, 2.5 billion active
- Developed in under 4 months by Recursive's Eureka Machine
- License: Apache 2.0 (on Hugging Face)
- Generation speed: 131 tokens/sec on M4 Pro MacBook Pro
- Faster than Google Gemma 4 (58-69 tokens/sec) and Nvidia Nemotron 3.5 Lightning (58-69 tokens/sec)
- Outperformed models under 50 billion parameters on SWE-Bench Verified

**Why it matters:** Engineers can evaluate Flint for local, private, and cost-free coding assistance, especially for smaller tasks. Its performance and offline capabilities offer an alternative to cloud-based proprietary models, which can impact workflow, data privacy, and operational costs.

> Flint offers a fast, local, and AI-developed coding assistant for laptop users, providing a cost-effective and private alternative.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/21/recursive-launches-flint-a-laptop-coding-model-it-says-was-largely-built-by-ai/)

---

## Google Cloud London Outage Caused by "Power Event" in Europe-West2-B Zone

*Cloud & Infrastructure · The Register · 2026-10-20*

![Google Cloud says a 'power event' caused today's outage - The Register](https://image.theregister.com/253305.jpg?imageId=253305&x=0&y=0&cropw=100&croph=100&panox=0&panoy=0&panow=100&panoh=100&width=1200&height=683)

Google Cloud experienced an outage in its London region's europe-west-2-b availability zone, starting at 0608 UTC on October 20th. The cause was attributed to a "power event." This incident disrupted services for numerous customers in Western Europe, including major financial institutions like Lloyds Bank and HSBC, logistics firms like Royal Mail and DPD, and other companies such as Rightmove and Cloudflare.

The outage affected at least 38 services, including BigQuery Data TransferService, Cloud Filestore, Cloud Run, Google App Engine, Google Cloud NetApp Volumes, Google Kubernetes Engine, and Managed Service for Apache Kafka. Google Cloud announced a tentative full recovery by 1300 UTC. This event highlights the cascading failure potential in modern cloud ecosystems, where a problem in one region can affect multiple layers of dependent services.

**Key facts**

- Outage started: October 20, 0608 UTC
- Affected zone: europe-west-2-b (London region)
- Cause: "power event"
- Affected services: BigQuery Data TransferService, Cloud Filestore, Cloud Run, Google App Engine, Google Cloud NetApp Volumes, Google Kubernetes Engine, Managed Service for Apache Kafka
- Estimated total affected services: 38
- Tentative full recovery: October 20, 1300 UTC

**Why it matters:** This outage reinforces the need for true multi-region and multi-cloud resilience strategies. Engineers should design for regional failures through workload portability and tested disaster recovery procedures, rather than assuming cloud migration alone ensures resilience.

> Cloud outages, even regional ones, demand multi-region architectural resilience to prevent widespread service disruption.

[🔗 Read more at The Register](https://www.theregister.com/paas-and-iaas/2026/10/20/google-cloud-says-a-power-event-caused-todays-outage/5304160)

---

## AWS Advises Benchmarking AI Coding Agent Cost and Quality on Custom Codebases

*AI Agents & Tooling · Amazon · 2026-10-22*

![Tokenomics for coding agents: benchmark cost and quality on your own code | AWS Cloud Financial Management](https://d2908q01vomqb2.cloudfront.net/2e01e17467891f7c933dbaa00e1459d23db3fe4f/2026/10/17/token_for_coding-1120x630.png)

Agentic coding assistants are now daily tools, making their operational cost a significant budget line. Models like Claude Code, Codex, Cursor, or Kiro run against repositories multiple times daily, consuming tokens that incur costs. This necessitates a strategic approach to model selection to manage expenses as usage scales across an engineering organization.

AWS suggests quantifying coding work costs across available models, harnesses, and hosting paths. This data can then be used to create a cost-and-quality frontier specific to a company's code and tasks, which developers can consult before choosing a model. This custom benchmarking is crucial because public leaderboards or vendor benchmarks do not provide a universal source of truth for individual codebases.

**Key facts**

- Models mentioned: Claude Code, Codex, Cursor, Kiro
- Benchmarking is specific to user's code and tasks

**Why it matters:** Engineers need to develop internal benchmarking capabilities to evaluate the cost-effectiveness and quality of different AI coding models for their specific projects, rather than relying on generic benchmarks, to control growing inference expenses.

> Tailored internal benchmarking is key to optimizing AI coding agent model choices for cost and quality.

[🔗 Read more at Amazon](https://aws.amazon.com/blogs/aws-cloud-financial-management/tokenomics-for-coding-agents-benchmark-cost-and-quality-on-your-own-code)

---

## Recursive's Flint Model Advances Recursive Self-Improvement in AI Development

*AI Models · WIRED · 2026-10-21*

![A brain shape filled with gears and a plant at several growth stages](https://media.wired.com/photos/6ad8079d19d8dd7213438cc0/master/w_2560%2Cc_limit/business_ai_lab_recursive_improvement.jpg)

Recursive's Flint, an open-weight AI coding model, signifies a step forward in recursive self-improvement (RSI), where AI helps build better AI. The company's Eureka Machine, an AI system, automated most of Flint's development, including devising new training methods, model architectures, and silicon-optimized code.

This approach allowed a small team to develop a "world-class model" in months. While RSI has raised concerns about AI control, Recursive CEO Richard Socher states their system is human-overseen. Recursive has raised $650 million at a $4.65 billion valuation.

**Key facts**

- Flint is an open-weight AI coding model
- Developed by Recursive's Eureka Machine AI system
- Recursive raised $650 million at a $4.65 billion valuation

**Why it matters:** This development indicates a potential shift in how AI models are built, with increasing automation in the development process. Engineers may see faster iterations and more specialized models emerge, though the immediate practical impact on their daily work is currently limited to awareness of evolving AI development methodologies.

> AI is increasingly developing AI, accelerating model creation and potentially leading to more advanced, specialized systems.

[🔗 Read more at WIRED](https://www.wired.com/story/recursive-self-improvement-flint-latest-model-scary-good/)

---

## OpenCode Breach Highlights Dual-Use Dilemma in AI Cyber Defense

*Security · DEV Community · 2026-10-21*

![OpenCode breach highlights the limits of AI cyber defense - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F1ae7toprgk3mhxa2sgak.jpg)

A breach involving OpenCode has intensified the debate on the dual-use nature of AI tools in cybersecurity. AI systems, increasingly used for code writing, review, threat analysis, and routine technical work, can also be misused for intrusions, data theft, or service disruption.

OpenCode is an AI coding agent that operates across development workflows. When such a tool is breached, the risk extends beyond the software to the information and permissions it accesses. The core dilemma is that safeguards preventing models from generating malicious instructions can inadvertently hinder legitimate cyber defense actions, where security analysts need to examine similar techniques to understand and counter threats.

**Key facts**

- OpenCode is an AI coding agent
- Breach highlights AI's dual-use nature in security

**Why it matters:** Security teams must carefully select and configure AI-powered defense tools to ensure they provide adequate protection without impeding legitimate incident response activities. This requires a nuanced understanding of how AI systems interpret and respond to requests, balancing proactive defense with defensive utility.

> AI security tools need to be carefully designed to distinguish between malicious and legitimate defensive uses of cyber techniques.

[🔗 Read more at DEV Community](https://dev.to/the_daily_flare/opencode-breach-highlights-the-limits-of-ai-cyber-defense-4g4b)

---

## Cloudflare Leads Agent-Written Rust Port of TypeScript

*Developer Tools · The New Stack · 2026-10-21*

![“We are not forking TypeScript”: Cloudflare spearheads Rust port written by agents, for agents - The New Stack](https://cdn.thenewstack.io/media/2026/10/c52c16e4-tsrs-feat-image.jpg)

Cloudflare is leading an initiative to port TypeScript to Rust, emphasizing that this is not a fork of TypeScript. The significant aspect of this project is that AI agents are performing a large portion of the code writing for the port. This approach highlights the increasing role of AI agents in substantial development efforts, particularly in language and runtime projects.

**Key facts**

- Cloudflare spearheads Rust port of TypeScript
- Port is largely written by AI agents
- This is not a fork of TypeScript

**Why it matters:** Engineers might soon interact with programming language tools where the underlying implementation was primarily authored by AI. This could influence future toolchain development and potentially lead to faster cross-language porting initiatives, impacting ecosystem choices.

> AI agents are now contributing significantly to core language infrastructure projects like Rust ports.

[🔗 Read more at The New Stack](https://thenewstack.io/cloudflare-rust-typescript-tsrs)

---

## Gentle-AI and Agentic-Awesome-Skills Promote Open, Local AI Agent Systems

*AI Agents & Tooling · DEV Community · 2026-10-20*

![The Post-Lock-in Agent Era: How 'gentle-ai' and 'agentic-awesome-skills' Are Reclaiming Control from Proprietary Coding Agents - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fj1t1b5howtvnqpqhkllh.png)

The current AI-assisted development landscape is characterized by powerful, yet proprietary, coding agents that create vendor lock-in through specific ecosystems, data pipelines, and opaque APIs. In response, a counter-trend termed the "Post-Lock-in Agent Era" is gaining traction.

This shift is represented by conceptual frameworks such as 'gentle-ai' and 'agentic-awesome-skills'. These frameworks advocate for local-first, portable, and human-centric agent systems. The goal is to allow software engineers and systems architects to maintain control over their code, reduce latency costs, and build resilient AI pipelines independent of single vendors.

**Key facts**

- Emerging frameworks: 'gentle-ai', 'agentic-awesome-skills'
- Focus on local-first, portable, human-centric agent systems

**Why it matters:** Backend and systems engineers should evaluate open and local-first AI agent solutions to avoid vendor lock-in, reduce operational costs, and maintain full control over their code and data, prioritizing architectural resilience and sovereignty.

> Open, local AI agent systems offer an alternative to proprietary tools, enabling greater control and reduced vendor dependency.

[🔗 Read more at DEV Community](https://dev.to/tamizuddin/the-post-lock-in-agent-era-how-gentle-ai-and-agentic-awesome-skills-are-reclaiming-control-28m1)

---

## AWS Details Securing AI Agent Identity with X.509 PKI

*Security · Amazon · 2026-10-20*

![Securing AI agent identity with X.509 PKI on AWS | Artificial Intelligence](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2026/10/16/ML-21717-featured-image.png)

When AI agents interact with databases, APIs, and business operations, establishing cryptographic identity through X.509 public key infrastructure (PKI) becomes essential. Traditional methods like shared API keys or OAuth tokens in agent chains do not meet enterprise zero-trust requirements for multi-agent AI frameworks.

The Model Context Protocol (MCP), used by multi-agent AI frameworks to connect agents to external tools, lacks a built-in authentication standard. AWS outlines a solution using Keyfactor EJBCA and AWS services, incorporating signed request envelopes for cryptographic proof-of-possession on agent calls and user-signed delegation assertions to authorize agents without sharing credentials.

**Key facts**

- Uses X.509 PKI for AI agent identity
- Integrates Keyfactor EJBCA with AWS services
- Model Context Protocol (MCP) lacks authentication standard

**Why it matters:** Engineers deploying AI agents in sensitive environments must implement robust identity management using PKI to prevent impersonation and unauthorized access. This requires architectural changes to how agents authenticate with internal systems and external tools, moving beyond simple API keys.

> PKI is critical for securing AI agent identities and enforcing zero-trust principles in enterprise deployments.

[🔗 Read more at Amazon](https://aws.amazon.com/blogs/machine-learning/securing-ai-agent-identity-with-x-509-pki-on-aws)

---

## What to watch

- The development and adoption rates of new security review tools for AI agents, as Cloudflare's `security-audit-skill` trends.
- How the PHP community and Chainguard address coordinated vulnerability disclosure following the recent incident, and any resulting changes in industry best practices.
- The performance and real-world adoption of Recursive's Flint model, particularly its impact on local-first AI coding workflows and cost savings.

---

## Sources

- [PHP Blames Chainguard for Prematurely Revealing Critical PHP Vulnerabilities](https://www.theregister.com/security/2026/10/22/php-blames-supply-chain-security-biz-chainguard-for-putting-huge-chunks-of-the-web-at-risk/5304611) — The Register, 2026-10-22
- [Security Review for AI Agents Becomes a Shippable Product Category](https://dev.to/max_quimby/who-audits-the-agent-security-review-is-a-category-g4e) — DEV Community, 2026-10-22
- [Recursive Launches Flint, a Laptop Coding Model Built Largely by AI](https://techcrunch.com/2026/10/21/recursive-launches-flint-a-laptop-coding-model-it-says-was-largely-built-by-ai/) — TechCrunch, 2026-10-22
- [Google Cloud London Outage Caused by "Power Event" in Europe-West2-B Zone](https://www.theregister.com/paas-and-iaas/2026/10/20/google-cloud-says-a-power-event-caused-todays-outage/5304160) — The Register, 2026-10-20
- [AWS Advises Benchmarking AI Coding Agent Cost and Quality on Custom Codebases](https://aws.amazon.com/blogs/aws-cloud-financial-management/tokenomics-for-coding-agents-benchmark-cost-and-quality-on-your-own-code) — Amazon, 2026-10-22
- [Recursive's Flint Model Advances Recursive Self-Improvement in AI Development](https://www.wired.com/story/recursive-self-improvement-flint-latest-model-scary-good/) — WIRED, 2026-10-21
- [OpenCode Breach Highlights Dual-Use Dilemma in AI Cyber Defense](https://dev.to/the_daily_flare/opencode-breach-highlights-the-limits-of-ai-cyber-defense-4g4b) — DEV Community, 2026-10-21
- [Cloudflare Leads Agent-Written Rust Port of TypeScript](https://thenewstack.io/cloudflare-rust-typescript-tsrs) — The New Stack, 2026-10-21
- [Gentle-AI and Agentic-Awesome-Skills Promote Open, Local AI Agent Systems](https://dev.to/tamizuddin/the-post-lock-in-agent-era-how-gentle-ai-and-agentic-awesome-skills-are-reclaiming-control-28m1) — DEV Community, 2026-10-20
- [AWS Details Securing AI Agent Identity with X.509 PKI](https://aws.amazon.com/blogs/machine-learning/securing-ai-agent-identity-with-x-509-pki-on-aws) — Amazon, 2026-10-20
