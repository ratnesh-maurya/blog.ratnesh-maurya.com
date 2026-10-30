---
title: 'Google unveils Gemini 4 Carbon and Robotics ER 2, Mistral'
description: >-
  Google announces Gemini 4 Carbon with cybersecurity advancements and makes
  Gemini Robotics ER 2 available.
date: '2026-10-30'
tags:
  - Gemini 4 Carbon
  - Gemini Robotics ER 2
  - Mistral Large 4
  - GitHub Copilot Fusion
  - Cloud SQL
  - AWS Graviton
  - Mintive
  - Anthropic Claude Code
source: tavily
stories: 10
sources:
  - Google
  - TechCrunch
  - Mistral
  - The New Stack
  - Amazon
---

Today's news highlights a competitive landscape in AI, with major players Google and Mistral pushing new models focused on security, coding, and robotics. Concurrently, a new player, Mintive, enters the AI agent management space, backed by significant industry figures, while GitHub's Copilot Fusion aims to enhance developer tooling.

## TL;DR

- **Google Announces Gemini 4 Carbon, a New Frontier Model with Cybersecurity Focus** — Google introduced Gemini 4 Carbon, its strongest frontier model with state-of-the-art cybersecurity and long-horizon capabilities, ranking #1 on the Artificial Analysis Intelligence Index.
- **Mistral Releases Weights for Trillion-Parameter AI Model, Targeting Cybersecurity** — Mistral released the weights for its 1-trillion-parameter multimodal model, Mistral Large 4 (Le Chonk), which shows improved coding and cybersecurity capabilities.
- **Mistral Large 4 (Le Chonk) Achieves Top Ranks in Open-Weight Coding Benchmarks** — Mistral Large 4 (Le Chonk), a 1-trillion-parameter model, now leads open-weight coding benchmarks and offers three reasoning modes for cost-performance balance.
- **Google Cloud SQL Announces Blue-Green Deployments for Near-Zero Downtime Upgrades** — Google Cloud SQL introduced a preview of fully managed blue-green deployments for MySQL, enabling major version upgrades and configuration updates with minimal downtime.
- **GitHub Debuts Copilot Fusion, Claiming Better Performance and Cost-Efficiency Than Claude Code** — GitHub launched Copilot Fusion, a new model selection and orchestration system that it claims outperforms Anthropic's Claude Code at half the API cost.
- **Gemini Robotics Embodied Reasoning 2 Now Available on Google Cloud for Enterprise Robotics** — Gemini Robotics Embodied Reasoning 2 (ER 2), a specialized Gemini model for robots, is now available in public preview on Google Cloud for enterprise production environments.
- **BMW Group Migrates Connected Vehicle Platform to AWS Graviton for Cost and Environmental Gains** — BMW Group migrated its Connected Vehicle platform, Orbit, from x86 to Arm-based AWS Graviton to improve economic and environmental goals without service disruption.
- **Mintive Raises $11 Million to Tackle Enterprise AI Agent Identity and Governance Market** — Mintive, an agent identity startup founded by ex-Google Brain and Coursera engineers, raised $11 million to provide governance, provisioning, and identity management for enterprise AI agents.
- **Anthropic Launches Reporting Tools to Track AI Spending Value for Enterprises** — Anthropic introduced new reporting tools for enterprises to understand the value of their AI token spending, providing granular insights into team performance, costs, and workflow breakdowns.
- **GitHub Leaders Dismiss Need for New GitHub, Focus on Copilot Integration** — GitHub's leadership does not believe the world needs a new GitHub, emphasizing their focus on integrating AI tools like Copilot within their existing platform.

---

## Google Announces Gemini 4 Carbon, a New Frontier Model with Cybersecurity Focus

*Top story · AI Models · Google · 2026-10-28*

Google has announced Gemini 4 Carbon, described as its strongest frontier model, featuring state-of-the-art cybersecurity and long-horizon capabilities. This new model ranks #1 on the updated v5.0 of the Artificial Analysis Intelligence Index with a score of 59.

Gemini 4 Carbon demonstrates significant improvements across coding and agentic tasks. It leads in key cybersecurity defense capabilities, scoring 88.2% in SEC-bench Pro for vulnerability finding, 54.8% in ExploitGym for exploitation, and 71.0% in CWE-bench for patching. Internal benchmarks also show a strong uplift in generating secure code and reducing vulnerabilities in live coding environments.

**Key facts**

- Gemini 4 Carbon is Google's strongest model
- Ranks #1 on Artificial Analysis Intelligence Index v5.0 (score 59)
- Achieves 88.2% in SEC-bench Pro, 54.8% in ExploitGym, 71.0% in CWE-bench

**Why it matters:** This model offers significant advancements for cybersecurity and coding, potentially enabling engineers to develop more secure applications and identify vulnerabilities more effectively. Teams focused on security and secure development lifecycles should investigate its capabilities.

> Gemini 4 Carbon sets a new benchmark for AI in cybersecurity defense, offering enhanced capabilities for vulnerability finding, exploitation, and patching.

[🔗 Read more at Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon)

---

## Mistral Releases Weights for Trillion-Parameter AI Model, Targeting Cybersecurity

*AI Models · TechCrunch · 2026-10-29*

Mistral has released the weights for its flagship 1-trillion-parameter multimodal model, Mistral Large 4, codenamed "Le Chonk." This model, previously in public preview, now offers improved coding, cybersecurity, and reasoning efficiency.

The company states that Mistral Large 4 leads open-weight benchmarks in coding and defensive security. It was trained from scratch on European infrastructure and is designed to support sovereign AI initiatives, offering customizable, self-hosted deployment options.

**Key facts**

- Mistral Large 4 (Le Chonk) is a 1-trillion-parameter model
- Leads open-weight benchmarks in coding and defensive security
- Trained on European infrastructure

**Why it matters:** Engineers working with open-source models, especially in security and coding, should evaluate Mistral Large 4 for its claimed performance and self-hosting options, which could impact model selection and deployment strategies.

> Mistral's open-weight release of Large 4 provides a powerful, customizable option for developers focused on secure coding and cybersecurity applications.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/29/mistral-releases-weights-for-its-trillion-parameter-ai-model-targeting-cybersecurity)

---

## Mistral Large 4 (Le Chonk) Achieves Top Ranks in Open-Weight Coding Benchmarks

*AI Models · Mistral · 2026-10-29*

![Mistral Large 4 (Le Chonk) is now open weight | Mistral](https://mistral.ai/cms-media/api/media/file/cover-mistral-sovereign%20copie.webp)

Mistral Large 4 (Le Chonk), a 1-trillion-parameter natively multimodal model, has been released with significantly improved coding and defensive cybersecurity capabilities following three weeks of additional reinforcement learning.

The model now leads open-weight coding on FrontierCode and Terminal-Bench, and matches other top open-weight models on the Artificial Analysis Coding Agent Index with greater token efficiency. It also features enhanced reasoning efficiency, leading to lower inference costs.

**Key facts**

- Mistral Large 4 is a 1-trillion-parameter model
- Leads FrontierCode and Terminal-Bench for open-weight coding
- Offers three reasoning modes for cost-performance balance

**Why it matters:** This release offers engineers a high-performing open-weight model for coding tasks, potentially improving development efficiency and reducing inference costs through its reasoning modes and token efficiency.

> Mistral Large 4's strong coding performance and cost-efficiency make it a notable open-weight model for developer tools and AI-assisted coding.

[🔗 Read more at Mistral](https://mistral.ai/news/mistral-large-4-oss)

---

## Google Cloud SQL Announces Blue-Green Deployments for Near-Zero Downtime Upgrades

*Cloud & Infrastructure · Google · 2026-10-29*

![Cloud SQL blue-green deployments | Google Cloud Blog](https://storage.googleapis.com/gweb-cloudblog-publish/images/Hero.max-1000x1000.png)

Google Cloud SQL is introducing a preview of fully managed blue-green deployments, starting with Cloud SQL for MySQL. This feature aims to enable major version upgrades and configuration updates with minimal downtime, addressing the challenges of traditional, high-downtime database upgrades.

The blue-green deployment process allows continuous synchronization of a parallel environment, enabling safe testing with production data before a seamless cutover. It also provides a built-in fallback mechanism, allowing the original database instance to remain available as a safety net if issues arise.

> ⚠️ **Heads up:** This feature is currently in public preview.

**Key facts**

- Cloud SQL for MySQL offers blue-green deployments in preview
- Enables near-zero downtime for major version upgrades and configuration updates
- Supports pre-cutover verification with production data

**Why it matters:** This feature significantly reduces the operational risk and downtime associated with database upgrades, allowing backend and systems engineers to perform critical updates during business hours. It improves security, performance, and access to new database features by simplifying version migration.

> Cloud SQL's blue-green deployments for MySQL transform database upgrades from a high-risk, off-hours task into a predictable, low-downtime operation.

[🔗 Read more at Google](https://cloud.google.com/blog/products/databases/cloud-sql-blue-green-deployments)

---

## GitHub Debuts Copilot Fusion, Claiming Better Performance and Cost-Efficiency Than Claude Code

*Developer Tools · The New Stack · 2026-10-28*

![GitHub debuts Copilot Fusion, a new model selection & orchestration system that beats Claude Code for half the API cost - The New Stack](https://cdn.thenewstack.io/media/2026/10/b78f2934-screenshot-2026-10-28-at-12.17.49.png)

GitHub has unveiled Copilot Fusion, an advanced model selection and orchestration system. GitHub claims that Copilot Fusion surpasses the performance of Anthropic's Claude Code while operating at half the API cost.

This new system integrates multiple models to enhance code generation and developer assistance. The announcement suggests a strategic move by GitHub to consolidate its position in the AI-powered developer tool market by offering a more efficient and cost-effective solution.

**Key facts**

- GitHub Copilot Fusion is a new model selection and orchestration system
- Claims to outperform Anthropic's Claude Code
- Claims to achieve performance at half the API cost of Claude Code

**Why it matters:** Developers and engineering teams should evaluate Copilot Fusion for potential improvements in code quality, generation speed, and significant cost savings compared to existing AI coding assistants. This could influence tooling choices and budget allocations for AI-powered development.

> GitHub Copilot Fusion offers a compelling, more cost-effective alternative to Claude Code for AI-assisted coding.

[🔗 Read more at The New Stack](https://thenewstack.io/github-copilot-fusion)

---

## Gemini Robotics Embodied Reasoning 2 Now Available on Google Cloud for Enterprise Robotics

*AI Models · Google · 2026-10-28*

![Gemini Robotics Embodied Reasoning 2 is now available on Google Cloud | Google Cloud Blog](https://storage.googleapis.com/gweb-cloudblog-publish/images/gemini-robotics-2__blog__cover.width-2200..max-2200x2200.png)

Gemini Robotics Embodied Reasoning 2 (ER 2), a specialized Gemini model serving as a high-level brain for robots, is now available in public preview on the Gemini platform via Google Cloud. This model is designed to enable robots to think, act, and adapt in the physical world across various robot embodiments.

ER 2 combines advanced spatial and temporal video understanding with long-horizon planning and safety guardrails. It allows robots to converse with humans, orchestrate low-level action models and hardware APIs, execute multi-minute tasks, and collaborate in multi-robot teams. The model can classify task progress, pinpoint critical events in video feeds with 91.3% accuracy and a 0.96-second mean absolute frame distance, and runs at 4x execution speed at a fraction of the compute cost of larger models.

> ⚠️ **Heads up:** This feature is currently in public preview.

**Key facts**

- Gemini Robotics ER 2 available in public preview on Google Cloud
- Pinpoints critical video events with 91.3% accuracy and 0.96-second MAFD
- Runs at 4x execution speed of larger models at fraction of cost

**Why it matters:** Engineers developing physical AI and robotics applications can now leverage a specialized, high-performance model with enterprise-grade security and lifecycle management. This could accelerate the development and deployment of adaptive, multi-agent robotic systems in production environments.

> Gemini Robotics ER 2 on Google Cloud provides an advanced, secure platform for developing and deploying embodied reasoning capabilities in enterprise robotics.

[🔗 Read more at Google](https://cloud.google.com/blog/products/ai-machine-learning/gemini-robotics-embodied-reasoning-2-is-now-available-on-google-cloud)

---

## BMW Group Migrates Connected Vehicle Platform to AWS Graviton for Cost and Environmental Gains

*Cloud & Infrastructure · Amazon · 2026-10-30*

![How BMW Group accelerated connected vehicle workloads on AWS Graviton | AWS Architecture Blog](https://d2908q01vomqb2.cloudfront.net/fc074d501302eb2b93e2554793fcaf50b3bf7291/2026/10/22/ARCHBLOG-1717-featured-image.png)

BMW Group's Connected Company, which manages digital services for over 24.5 million vehicles, started migrating its Orbit platform from x86 to Arm-based AWS Graviton in 2024. This move is part of a modernization strategy to achieve economic and environmental objectives.

The migration involved adopting Karpenter to replace fixed Managed Node Groups with dynamic, policy-driven node pools, allowing automatic provisioning of appropriate instance types. This foundational change enabled application teams to transition to AWS Graviton at their own pace.

**Key facts**

- BMW Group Connected Company manages 24.5 million vehicles worldwide
- Migration from x86 to Arm-based AWS Graviton began in 2024
- Karpenter was used for dynamic node provisioning

**Why it matters:** Engineers can learn from BMW's methodology for large-scale migrations to Arm-based architectures, particularly the use of Karpenter for flexible and policy-driven compute provisioning on AWS Graviton, which can optimize costs and energy efficiency.

> Large-scale cloud migrations to Arm-based compute can be achieved incrementally and without service disruption by leveraging dynamic provisioning tools like Karpenter.

[🔗 Read more at Amazon](https://aws.amazon.com/blogs/architecture/how-bmw-group-accelerated-connected-vehicle-workloads-on-aws-graviton)

---

## Mintive Raises $11 Million to Tackle Enterprise AI Agent Identity and Governance Market

*AI Agents & Tooling · TechCrunch · 2026-10-29*

![Mintive founders](https://techcrunch.com/wp-content/uploads/2026/10/mintive-founders.jpg?w=1024)

Mintive, an early-stage startup, has secured $11 million in funding, including a $7 million seed round led by Cowboy Ventures, with additional investments from Coatue, Operator Collective, Hustle Fund, and angel investors including Jeff Dean and Andrej Karpathy.

Founded by Jiquan Ngiam (Coursera's founding engineer) and Vijay Vasudevan (TensorFlow co-creator), Mintive offers a platform that includes an MCP gateway for authorizing cloud service agent access, an LLM gateway for model routing and cost capping, agent identity and authorization management, and an agent monitor. The company claims over 50 enterprise customers, including Ro, Modern Treasury, and Stability AI, since its product launch in February.

**Key facts**

- Mintive raised $11 million total, including a $7 million seed round
- Founders: Jiquan Ngiam (Coursera founding engineer), Vijay Vasudevan (TensorFlow co-creator)
- 50+ enterprise customers since February launch

**Why it matters:** This highlights the growing need for specialized tooling to manage the complexity of enterprise AI agents, particularly regarding identity, authorization, and cost control, indicating a new area for engineers to integrate and secure AI systems.

> Enterprise AI agent management, particularly for identity and governance, is emerging as a critical and competitive infrastructure layer for AI deployments.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/29/agent-identity-startup-mintive-lands-cowboy-ventures-coatue-angels-jeff-dean-andrej-karpathy/)

---

## Anthropic Launches Reporting Tools to Track AI Spending Value for Enterprises

*AI Agents & Tooling · TechCrunch · 2026-10-29*

![Anthropic just launched tools to show companies what their AI spending is buying - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/10/01-workstreams-overview.png?w=680)

Anthropic has released a new suite of reporting tools designed to give enterprise customers a more detailed understanding of the return on investment from their token spend on AI. These tools allow managers to view team work over specific date ranges, analyze output, cost, and identify workflow inefficiencies. Anthropic states it will not use this data for model training by default.

Internal analytics and employee surveys are used to generate these reports, which also offer recommendations for improving results. The company is also creating pooled group budgets to help teams manage token spending. Data from Jellyfish, a developer tool company, shows Anthropic's Claude Code and related tools account for nearly a third of all proposed code changes in their survey, with spending growing 10x since the beginning of the year, now representing about 2% of total engineering costs.

**Key facts**

- Anthropic's Claude Code grew spending 10x in 2026, reaching 2% of engineering cost
- New reporting tools track team work, output, cost, and workflow breakdowns
- Anthropic will not use this data for model training by default

**Why it matters:** Engineers and engineering managers can leverage these tools to justify AI spending, optimize usage, and improve the efficiency of AI-driven workflows. This shifts the focus from simple adoption to strategic cost management and performance optimization of AI agents.

> Anthropic's new reporting tools aim to provide transparency and optimization for enterprise AI spending, addressing a critical need for ROI measurement.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/28/anthropic-just-launched-tools-to-show-companies-what-their-ai-spending-is-buying/)

---

## Quick hits

- **[GitHub Leaders Dismiss Need for New GitHub, Focus on Copilot Integration](https://thenewstack.io/github-agentic-infrastructure-rebuild)** (The New Stack) — GitHub's leadership does not believe the world needs a new GitHub, emphasizing their focus on integrating AI tools like Copilot within their existing platform.

---

## What to watch

- The adoption rates and real-world performance comparisons of GitHub Copilot Fusion against Anthropic's Claude Code for enterprise coding tasks.
- Further developments and enterprise use cases of Gemini 4 Carbon's cybersecurity capabilities in live defense scenarios.
- How Mintive's agent identity and governance platform scales and competes against offerings from major cloud providers and other startups in the crowded AI agent management market.

---

## Sources

- [Google Announces Gemini 4 Carbon, a New Frontier Model with Cybersecurity Focus](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon) — Google, 2026-10-28
- [Mistral Releases Weights for Trillion-Parameter AI Model, Targeting Cybersecurity](https://techcrunch.com/2026/10/29/mistral-releases-weights-for-its-trillion-parameter-ai-model-targeting-cybersecurity) — TechCrunch, 2026-10-29
- [Mistral Large 4 (Le Chonk) Achieves Top Ranks in Open-Weight Coding Benchmarks](https://mistral.ai/news/mistral-large-4-oss) — Mistral, 2026-10-29
- [Google Cloud SQL Announces Blue-Green Deployments for Near-Zero Downtime Upgrades](https://cloud.google.com/blog/products/databases/cloud-sql-blue-green-deployments) — Google, 2026-10-29
- [GitHub Debuts Copilot Fusion, Claiming Better Performance and Cost-Efficiency Than Claude Code](https://thenewstack.io/github-copilot-fusion) — The New Stack, 2026-10-28
- [Gemini Robotics Embodied Reasoning 2 Now Available on Google Cloud for Enterprise Robotics](https://cloud.google.com/blog/products/ai-machine-learning/gemini-robotics-embodied-reasoning-2-is-now-available-on-google-cloud) — Google, 2026-10-28
- [BMW Group Migrates Connected Vehicle Platform to AWS Graviton for Cost and Environmental Gains](https://aws.amazon.com/blogs/architecture/how-bmw-group-accelerated-connected-vehicle-workloads-on-aws-graviton) — Amazon, 2026-10-30
- [Mintive Raises $11 Million to Tackle Enterprise AI Agent Identity and Governance Market](https://techcrunch.com/2026/10/29/agent-identity-startup-mintive-lands-cowboy-ventures-coatue-angels-jeff-dean-andrej-karpathy/) — TechCrunch, 2026-10-29
- [Anthropic Launches Reporting Tools to Track AI Spending Value for Enterprises](https://techcrunch.com/2026/10/28/anthropic-just-launched-tools-to-show-companies-what-their-ai-spending-is-buying/) — TechCrunch, 2026-10-29
- [GitHub Leaders Dismiss Need for New GitHub, Focus on Copilot Integration](https://thenewstack.io/github-agentic-infrastructure-rebuild) — The New Stack, 2026-10-29
