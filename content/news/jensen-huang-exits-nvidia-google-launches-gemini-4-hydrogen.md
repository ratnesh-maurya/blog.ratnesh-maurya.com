---
title: Jensen Huang exits Nvidia; Google launches Gemini 4 Hydrogen
description: >-
  Nvidia CEO Jensen Huang resigns, CFO Colette Kress named interim CEO. Google
  releases Gemini 4 Hydrogen with a 1M context window.
date: '2026-11-14'
tags:
  - Nvidia
  - Jensen Huang
  - Gemini 4 Hydrogen
  - Google
  - Amazon Bedrock
  - Vercel
  - Kubernetes
  - Argus SBOM Guard
source: tavily
stories: 10
sources:
  - Techmeme
  - Amazon
  - Cncf
  - Vercel
  - DEV Community
---

This week's tech news highlights a significant leadership change at Nvidia, a major player in the AI hardware space, alongside new model releases and crucial infrastructure updates. The biggest story is Jensen Huang's departure from Nvidia, which casts a shadow over the future direction of a company central to the AI boom. Meanwhile, advancements in AI models and tooling, and critical infrastructure improvements for Kubernetes and serverless platforms, suggest a continued push towards more efficient and controllable AI development and deployment.

## TL;DR

- **Jensen Huang Resigns as Nvidia CEO; Colette Kress Appointed Interim CEO** — Jensen Huang has resigned as CEO, President, and board member of Nvidia; CFO Colette Kress will serve as interim CEO as the board considers candidates.
- **Amazon Bedrock Offers Built-in Cost Attribution and Controls for AI Tools** — Amazon Bedrock now provides zero-instrumentation cost attribution that traces every inference call to the IAM principal, integrating with AWS Cost and Usage Reports (CUR 2.0) for per-user cost visibility.
- **Google Launches Gemini 4 Hydrogen Model with 1M Context Window at New Price Points** — Google has launched Gemini 4 Hydrogen, an upgrade to Gemini 3.8 Flash, featuring a 1M context window at $1.50/1M input and $7.50/1M output tokens.
- **Kubernetes Gains Gang Scheduling and Topology-Aware Placement for AI Training Workloads** — Kubernetes is enhancing its scheduling capabilities with gang scheduling and topology-aware placement to support distributed AI training workloads, ensuring simultaneous pod starts and optimal GPU communication.
- **Vercel Introduces Backends on Vercel: Python, Containers, and Daemons for Diverse Workloads** — Vercel now supports diverse backend runtimes including Python and container images, along with Daemons for continuous background jobs, to match compute to various workload types.
- **NVIDIA NeMo Switchyard Routes Coding Agent Requests to Optimal Models on Amazon Bedrock** — NVIDIA NeMo Switchyard is an open-source library that helps AI agents choose the right model on Amazon Bedrock, optimizing for cost per solved task rather than per-token price.
- **Argus SBOM Guard: An Open-Source Tool for SBOM-Driven Vulnerability Management** — Argus SBOM Guard is a new open-source project designed to address the practical challenges of integrating Software Bills of Materials (SBOMs) into vulnerability management workflows.
- **Model Context Protocol Servers Silently Increase Token Usage in Tool-Heavy AI Agents** — Model Context Protocol (MCP) servers, when connected to AI agents, can silently consume significant portions of the context window with schema definitions, increasing token usage and degrading performance.
- **CVE-2026-102870 Remediation Requires Specific Package Version Verification for Blazor WebAssembly Debugger** — Remediating CVE-2026-102870, a high-severity code injection in the Blazor WebAssembly debugger, requires verifying specific package version updates and rebuilding development environments.
- **OpenFold3-preview Deploys on Amazon SageMaker JumpStart for Biomolecular Structure Prediction** — OpenFold3-preview is now available on Amazon SageMaker JumpStart, allowing users to deploy the model for predicting 3D structures of proteins, DNA, RNA, and ligand complexes.

---

## Jensen Huang Resigns as Nvidia CEO; Colette Kress Appointed Interim CEO

*Top story · Industry · Techmeme · 2026-11-13*

![Techmeme: Sources: Kalshi is in talks to raise funding at a $65B valuation, weeks after closing a round at a $40B valuation; its annual run rate recently surpassed $5B (Bloomberg)](https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i9qWVD5Su12s/v1/1200x800.jpg)

Jensen Huang has stepped down from his roles as CEO, President, and board member of Nvidia. Following his resignation, Executive Vice President and Chief Financial Officer Colette Kress has been appointed interim CEO.

Harvey C. Jones has been named the first-ever Chair of the Board. Nvidia's stock (NVDA) dropped 4.34% following the announcement.

**Key facts**

- Jensen Huang resigned as CEO, President, and board member
- Colette Kress appointed interim CEO
- Harvey C. Jones appointed Chair of the Board
- NVDA stock dropped 4.34%

**Why it matters:** Engineers in AI and high-performance computing should monitor Nvidia's strategic direction and product roadmap under new leadership, as changes could impact hardware availability, software ecosystem support, and pricing for critical infrastructure.

> Nvidia enters a new era with Jensen Huang's departure, leaving the AI industry to watch for shifts in leadership and strategy.

[🔗 Read more at Techmeme](https://www.techmeme.com/261112/p58)

---

## Amazon Bedrock Offers Built-in Cost Attribution and Controls for AI Tools

*AI Agents & Tooling · Amazon · 2026-11-14*

![Cost attribution and controls for AI developer and productivity tools on Amazon Bedrock | Artificial Intelligence](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2026/11/12/ML-21035-featured-image-2.png)

Amazon Bedrock has introduced built-in, zero-instrumentation cost attribution that links every inference call back to the IAM principal that initiated it. This identity information, along with organizational tags, flows into AWS Cost and Usage Reports (CUR 2.0) and AWS Cost Explorer.

The mechanism works for any AI coding or productivity tool using the `bedrock-runtime` or `bedrock-mantle` endpoints, propagating identity automatically once configured. It supports IAM users, per-application roles, federated identities, and LLM gateways. This allows organizations to track per-user costs, identify high-spending teams, and forecast budgets. While CUR 2.0 provides aggregated usage per principal per export interval, per-prompt detail requires model invocation logs or request metadata tagging.

**Key facts**

- Zero-instrumentation cost attribution in Amazon Bedrock
- Traces inference calls to IAM principal
- Integrates with AWS Cost and Usage Reports (CUR 2.0) and Cost Explorer
- Works with `bedrock-runtime` and `bedrock-mantle` endpoints
- Supports IAM users, roles, federated identities, and LLM gateways
- CUR 2.0 provides aggregated usage (hourly/daily), not per-request cost

**Why it matters:** Backend and AI platform engineers can leverage Bedrock's new cost attribution to gain granular visibility into AI inference spend, enabling better FinOps practices, budgeting, and chargebacks for AI tool usage within their organizations without additional instrumentation.

> Amazon Bedrock's cost attribution provides essential per-user and per-team spend visibility for AI inference, simplifying FinOps and budget management.

[🔗 Read more at Amazon](https://aws.amazon.com/blogs/machine-learning/cost-attribution-and-controls-for-ai-developer-and-productivity-tools-on-amazon-bedrock)

---

## Google Launches Gemini 4 Hydrogen Model with 1M Context Window at New Price Points

*AI Models · Techmeme · 2026-11-13*

![Techmeme: Google launches Gemini 4 Hydrogen, calling it a major upgrade over Gemini 3.8 Flash, at $1.50/1M input and $7.50/1M output tokens across its 1M context window (Koray Kavukcuoglu/Google)](https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-4-hydrogen__key-art__lockup__16-9.width-1300.jpg)

Google has released Gemini 4 Hydrogen, described as a major upgrade from its predecessor, Gemini 3.8 Flash. The new model offers a 1M context window.

Pricing for Gemini 4 Hydrogen is set at $1.50 per 1 million input tokens and $7.50 per 1 million output tokens.

**Key facts**

- Gemini 4 Hydrogen launched
- Upgrade from Gemini 3.8 Flash
- 1M context window
- $1.50/1M input tokens
- $7.50/1M output tokens

**Why it matters:** Engineers can evaluate Gemini 4 Hydrogen for applications requiring large context windows, potentially improving the performance and reducing complexity of tasks in AI agents and data processing, but should carefully assess the new pricing model for cost efficiency.

> Gemini 4 Hydrogen brings a larger context window and new pricing, making it a contender for context-heavy AI tasks.

[🔗 Read more at Techmeme](https://www.techmeme.com/261112/p46)

---

## Kubernetes Gains Gang Scheduling and Topology-Aware Placement for AI Training Workloads

*Cloud & Infrastructure · Cncf · 2026-11-12*

![Gang scheduling and topology-aware placement for AI training in Kubernetes | CNCF](https://www.cncf.io/wp-content/uploads/2026/11/Blog-Default-8.jpg)

Distributed AI training workloads, which require specific inter-GPU bandwidth and simultaneous pod scheduling, pose challenges for Kubernetes' default independent pod scheduler. To address this, Kubernetes is adopting gang scheduling and topology-aware scheduling (TAS).

TAS optimizes the relative placement of pods to enable fast communication between GPUs. Gang scheduling ensures all pods in a distributed job start at the same time, preventing idle GPU allocation. These features are implemented by Kueue and the Coscheduling plugin, augmenting Kubernetes' native scheduler to meet the precise coordination and placement demands of AI training, thereby helping organizations maximize the value from their GPU capacity.

**Key facts**

- Kubernetes default scheduler unsuited for AI training
- Distributed AI training needs inter-GPU bandwidth and simultaneous pod starts
- Topology-aware scheduling (TAS) for fast GPU communication
- Gang scheduling for simultaneous pod starts
- Implemented by Kueue and Coscheduling plugin

**Why it matters:** Platform and MLOps engineers can now deploy distributed AI training workloads on Kubernetes more efficiently, leveraging gang scheduling to prevent idle GPU resources and topology-aware placement for optimized inter-GPU communication. This improves resource utilization and training performance for costly AI infrastructure.

> Kubernetes is becoming more capable for distributed AI training by adding gang and topology-aware scheduling, crucial for efficient GPU utilization.

[🔗 Read more at Cncf](https://www.cncf.io/blog/2026/11/12/gang-scheduling-and-topology-aware-placement-for-ai-training-in-kubernetes)

---

## Vercel Introduces Backends on Vercel: Python, Containers, and Daemons for Diverse Workloads

*Developer Tools · Vercel · 2026-11-14*

![Backends | Vercel Knowledge Base](https://vercel.com/api/docs-og/architecture?variant=backends)

Vercel is expanding its backend capabilities, allowing developers to choose from Python, container images, and Daemons to match execution models to specific workloads. This includes Vercel Functions for HTTP requests, container images for custom runtimes, and Daemons for continuous background workers.

Developers can start from zero-config Python and TypeScript API frameworks, enabling features like streaming, middleware, and cron jobs. Examples include deploying FastAPI and Express apps. The platform aims to support various backend workload types, such as interactive APIs, queued jobs, durable processes, cron batches, realtime connections, and compute-heavy tasks.

**Key facts**

- Supports Python, container images, and Daemons
- Vercel Functions for HTTP requests
- Container images for custom runtimes
- Daemons for continuous background workers
- Zero-config FastAPI and Express app deployment

**Why it matters:** Backend engineers can now leverage Vercel for a broader range of backend workloads beyond serverless functions, using familiar runtimes like Python and custom containers, and deploying long-running background processes, which could simplify deployment and operations for full-stack applications.

> Vercel's expanded backend support for Python, containers, and Daemons simplifies deploying varied workload types, from APIs to long-running jobs.

[🔗 Read more at Vercel](https://vercel.com/kb/architecture/backends)

---

## NVIDIA NeMo Switchyard Routes Coding Agent Requests to Optimal Models on Amazon Bedrock

*AI Agents & Tooling · Amazon · 2026-11-14*

![Route coding agent requests to the right model on Amazon Bedrock with NVIDIA NeMo Switchyard | Artificial Intelligence](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2026/11/11/ML-22318-featured-image.png)

NVIDIA NeMo Switchyard is an open-source library designed to enable AI agents to select the most suitable model for each request. It supports defining models and routing strategies, including LiteLLM integration for stage routing based on tool activity and random routing for traffic splits.

The tool aims to optimize for cost per solved task, which considers total task cost, including retries and unfinished tasks, rather than just per-token pricing. A sample deployment uses AWS CDK to deploy LiteLLM with the Switchyard plugin on Amazon ECS (AWS Fargate) to call models on Amazon Bedrock, allowing benchmarks for cost per solved task for routed vs. single-model groups. The sample uses `switchyard-server` 0.3.0 and LiteLLM v1.102.0 and is noted as experimental for non-production usage.

> ⚠️ **Heads up:** The article states that the sample code uses an experimental integration and is for non-production usage, with configurations and APIs subject to change.

**Key facts**

- NVIDIA NeMo Switchyard is open source
- Optimizes for cost per solved task
- LiteLLM integration supports stage and random routing
- Deploys on Amazon ECS (AWS Fargate) via AWS CDK
- Uses `switchyard-server` 0.3.0 and LiteLLM v1.102.0
- Sample code is for non-production usage

**Why it matters:** Engineers building AI agents on Amazon Bedrock can use NeMo Switchyard to implement intelligent model routing, potentially reducing overall operational costs for complex coding tasks by selecting models based on task completion metrics rather than raw token prices.

> Optimizing AI agent costs means focusing on the total cost of a solved task, not just token price, a problem NeMo Switchyard aims to address through intelligent model routing.

[🔗 Read more at Amazon](https://aws.amazon.com/blogs/machine-learning/route-coding-agent-requests-to-the-right-model-on-amazon-bedrock-with-nvidia-nemo-switchyard)

---

## Argus SBOM Guard: An Open-Source Tool for SBOM-Driven Vulnerability Management

*Security · DEV Community · 2026-11-13*

![From SBOM to Vulnerability Management: Why I built Argus SBOM Guard - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fvmkm296znmjbr6maat97.png)

Argus SBOM Guard is an open-source project created to help organizations manage vulnerabilities using Software Bills of Materials (SBOMs). The tool aims to overcome challenges in modern vulnerability management, where applications rely on hundreds of open-source and third-party components, often with multiple layers of transitive dependencies.

The project emphasizes the distinction between identifying a vulnerability and managing a risk, highlighting the need to quickly determine affected systems, track vulnerable dependencies and their versions, and monitor issues until resolution. Generating an SBOM is presented as a crucial first step, but Argus SBOM Guard focuses on the subsequent process of leveraging SBOMs for effective vulnerability management within a broader risk management framework.

**Key facts**

- Argus SBOM Guard is open-source
- Aims to integrate SBOMs with vulnerability management
- Addresses challenges of complex software supply chains
- Focuses on identifying affected systems and tracking issues

**Why it matters:** Security and DevOps engineers can leverage Argus SBOM Guard to operationalize their SBOMs, moving beyond simple generation to active vulnerability management. This can improve the speed and accuracy of identifying and remediating vulnerabilities in complex software supply chains.

> Argus SBOM Guard offers a practical, open-source approach to using SBOMs for actionable vulnerability management in complex software environments.

[🔗 Read more at DEV Community](https://dev.to/trottomv/from-sbom-to-vulnerability-management-why-i-built-argus-sbom-guard-3oic)

---

## Model Context Protocol Servers Silently Increase Token Usage in Tool-Heavy AI Agents

*AI Agents & Tooling · DEV Community · 2026-11-12*

![Your MCP Servers Are Silently Draining Your Context Window: The Hidden Cost of Tool-Heavy AI Agents - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fa20dm7o9oqkdd8zvyns3.jpg)

Connecting Model Context Protocol (MCP) servers to an AI coding agent can lead to substantial, unseen token consumption. An example showed a two-word prompt, "Run tests," consuming 28,400 input tokens before the LLM generated any output, without any attached source files or conversation history.

The culprit is the schema definitions from MCP servers (e.g., GitHub, Jira, Postgres, Sentry, Slack, Docker, filesystem) that are implicitly included in the prompt. This "schema bloat" effectively drains the model's active context window, which can degrade reasoning accuracy, slow down time-to-first-token, and deplete token budgets.

**Key facts**

- MCP servers cause "schema bloat"
- 28,400 input tokens consumed by a two-word prompt in an example
- Affects context window, reasoning accuracy, and time-to-first-token
- Includes MCP servers for GitHub, Jira, Postgres, Sentry, Slack, Docker, filesystem

**Why it matters:** AI engineers developing tool-heavy agents need to be aware of the hidden costs of Model Context Protocol (MCP) server integrations, as tool schema definitions can silently consume large numbers of tokens, impacting prompt efficiency, model performance, and API billing. Optimizing tool definitions or considering alternative integration patterns might be necessary.

> Tool-heavy AI agents, particularly those using Model Context Protocol servers, can unknowingly burn through context window tokens with tool schema definitions, leading to higher costs and reduced performance.

[🔗 Read more at DEV Community](https://dev.to/necoz/your-mcp-servers-are-silently-draining-your-context-window-the-hidden-cost-of-tool-heavy-ai-agents-fkl)

---

## CVE-2026-102870 Remediation Requires Specific Package Version Verification for Blazor WebAssembly Debugger

*Security · DEV Community · 2026-11-12*

![Verifying CVE-2026-102870 remediation with package versions and build evidence - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F924otetzojz0r67679h2.png)

Remediation for CVE-2026-102870, a High-severity (CVSS 3.1 score 8.8) code injection vulnerability in the Blazor WebAssembly debugger, requires more than a generic .NET update. The vulnerability (CWE-94) affects `Microsoft.AspNetCore.Components.WebAssembly.Server` and `Microsoft.AspNetCore.Components.WebAssembly.DevServer` packages.

Vulnerable ranges are 10.0.0 through 10.0.13 and 11.0.0-preview.1 through 11.0.0-rc.3.26522.148. Fixed versions are 10.0.14 and 11.0.0-rc.3.26522.148. Verification must confirm the resolved package version via lockfiles, restore logs, or SBOMs, ensure a clean environment restore, and restart debuggers and development environments. The exploit allows attacker-controlled values to escape string literals and execute code on the developer machine during expression evaluation.

**Key facts**

- CVE-2026-102870: High severity (CVSS 3.1 score 8.8)
- CWE-94 code injection in Blazor WebAssembly debugger
- Affected packages: `Microsoft.AspNetCore.Components.WebAssembly.Server`, `Microsoft.AspNetCore.Components.WebAssembly.DevServer`
- Vulnerable versions: 10.0.0-10.0.13, 11.0.0-preview.1-11.0.0-rc.3.26522.148
- Fixed versions: 10.0.14, 11.0.0-rc.3.26522.148

**Why it matters:** Developers and security engineers working with Blazor WebAssembly must specifically verify package versions for CVE-2026-102870 remediation, as generic updates are insufficient. This highlights the need for precise dependency management and build evidence to ensure critical vulnerabilities are actually patched in development environments.

> Effective vulnerability remediation demands precise package version verification and environmental rebuilds, not just general updates.

[🔗 Read more at DEV Community](https://dev.to/ioneyrezende/verifying-cve-2026-102870-remediation-with-package-versions-and-build-evidence-2hb0)

---

## Quick hits

- **[OpenFold3-preview Deploys on Amazon SageMaker JumpStart for Biomolecular Structure Prediction](https://aws.amazon.com/blogs/machine-learning/category/post-types/technical-how-to)** (Amazon) — OpenFold3-preview is now available on Amazon SageMaker JumpStart, allowing users to deploy the model for predicting 3D structures of proteins, DNA, RNA, and ligand complexes.

---

## What to watch

- The long-term strategic direction of Nvidia under interim CEO Colette Kress and the board's eventual choice for a permanent CEO.
- How Google's Gemini 4 Hydrogen, with its large context window, will be adopted by developers and its impact on the competitive landscape of large language models.
- The practical adoption and performance benchmarks of NVIDIA NeMo Switchyard and LiteLLM for optimizing AI agent costs in production environments on Amazon Bedrock.

---

## Sources

- [Jensen Huang Resigns as Nvidia CEO; Colette Kress Appointed Interim CEO](https://www.techmeme.com/261112/p58) — Techmeme, 2026-11-13
- [Amazon Bedrock Offers Built-in Cost Attribution and Controls for AI Tools](https://aws.amazon.com/blogs/machine-learning/cost-attribution-and-controls-for-ai-developer-and-productivity-tools-on-amazon-bedrock) — Amazon, 2026-11-14
- [Google Launches Gemini 4 Hydrogen Model with 1M Context Window at New Price Points](https://www.techmeme.com/261112/p46) — Techmeme, 2026-11-13
- [Kubernetes Gains Gang Scheduling and Topology-Aware Placement for AI Training Workloads](https://www.cncf.io/blog/2026/11/12/gang-scheduling-and-topology-aware-placement-for-ai-training-in-kubernetes) — Cncf, 2026-11-12
- [Vercel Introduces Backends on Vercel: Python, Containers, and Daemons for Diverse Workloads](https://vercel.com/kb/architecture/backends) — Vercel, 2026-11-14
- [NVIDIA NeMo Switchyard Routes Coding Agent Requests to Optimal Models on Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/route-coding-agent-requests-to-the-right-model-on-amazon-bedrock-with-nvidia-nemo-switchyard) — Amazon, 2026-11-14
- [Argus SBOM Guard: An Open-Source Tool for SBOM-Driven Vulnerability Management](https://dev.to/trottomv/from-sbom-to-vulnerability-management-why-i-built-argus-sbom-guard-3oic) — DEV Community, 2026-11-13
- [Model Context Protocol Servers Silently Increase Token Usage in Tool-Heavy AI Agents](https://dev.to/necoz/your-mcp-servers-are-silently-draining-your-context-window-the-hidden-cost-of-tool-heavy-ai-agents-fkl) — DEV Community, 2026-11-12
- [CVE-2026-102870 Remediation Requires Specific Package Version Verification for Blazor WebAssembly Debugger](https://dev.to/ioneyrezende/verifying-cve-2026-102870-remediation-with-package-versions-and-build-evidence-2hb0) — DEV Community, 2026-11-12
- [OpenFold3-preview Deploys on Amazon SageMaker JumpStart for Biomolecular Structure Prediction](https://aws.amazon.com/blogs/machine-learning/category/post-types/technical-how-to) — Amazon, 2026-11-12
