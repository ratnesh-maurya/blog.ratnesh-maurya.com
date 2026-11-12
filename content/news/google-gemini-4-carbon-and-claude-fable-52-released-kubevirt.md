---
title: Google Gemini 4 Carbon and Claude Fable 5.2 Released; KubeVirt
description: >-
  Google and Anthropic release new flagship AI models, with Google offering
  competitive pricing. KubeVirt graduates from CNCF, enabling unified VM and
  container
date: '2026-11-12'
tags:
  - Google Gemini 4 Carbon
  - Claude Fable 5.2
  - Anthropic Mythos 5.2
  - KubeVirt
  - Kubernetes
  - TiKV
  - JuiceFS
  - Red Hat OpenShell
source: tavily
stories: 10
sources:
  - VentureBeat
  - The Register
  - Cncf
  - DEV Community
  - Google DeepMind
  - Latent
  - Siliconangle
  - InfoQ
  - GitHub Blog
---

This week's news highlights the ongoing battle for supremacy and developer mindshare in the AI model space, with Google and Anthropic releasing new flagship models and adjusting pricing. Simultaneously, the cloud-native ecosystem continues to mature, with KubeVirt's graduation underscoring a trend towards unifying VM and container workloads on Kubernetes, an increasingly critical platform for AI infrastructure.

## TL;DR

- **Google Gemini 4 Carbon Publicly Available, Undercuts Claude Fable 5.2 on API Price** — Google's Gemini 4 Carbon is now generally available, with an introductory API price of $2/1M input and $10/1M output tokens, significantly undercutting Claude Fable 5.2.
- **Attackers Backdoor Trusted AWS Integrations via Qubole Credentials to Steal Secrets** — Wiz researchers discovered attackers used compromised Qubole AWS IAM credentials to assume customer integration roles, stealing secrets and data from S3 buckets.
- **StepFun Scales Multimodal AI Storage Beyond 10,000 Clients Using Kubernetes and TiKV** — StepFun scaled its AI storage platform for over 10,000 clients by combining Kubernetes, TiKV, and JuiceFS to meet diverse AI workload storage needs.
- **Anthropic Releases Claude Fable 5.2 and Mythos 5.2, Cuts Fable Pricing by 20%** — Anthropic launched Claude Fable 5.2 and Mythos 5.2, with Fable 5.2 generally available and its API pricing reduced by 20%.
- **KubeVirt Graduates from CNCF, Unifying VMs, Containers, and AI Workloads on Kubernetes** — KubeVirt, an open-source project extending Kubernetes to run virtual machines, has graduated from CNCF, allowing unified management of VMs, containers, and AI workloads.
- **Google DeepMind Announces General Availability of Gemini 4 Carbon** — Google DeepMind has made Gemini 4 Carbon available to developers, enterprises, scientists, and consumers, touting its frontier performance in various complex tasks.
- **Mercor Raises $750M Series D at $20B Valuation, Reporting $3B Annualized Revenue** — AI company Mercor secured $750 million in Series D funding at a $20 billion valuation, with $3 billion in annualized revenue.
- **Red Hat Boosts AI Agent Security with OpenShell Integration into Kubernetes and OpenShift** — Red Hat is enhancing AI agent security by integrating Nvidia's OpenShell into OpenShift, providing isolated execution environments and policy controls for agents on Kubernetes.
- **LinkedIn Replaces Argo CD with Custom GitOps Engine for Kubernetes Deployments** — LinkedIn has developed and deployed its own custom GitOps engine to manage Kubernetes deployments, moving away from Argo CD.
- **GitHub Dashboard Updated for More Informative, Compact View** — GitHub has updated its dashboard to be more compact and scannable, reducing padding, fixing title wrapping, and showing more items by default.

---

## Google Gemini 4 Carbon Publicly Available, Undercuts Claude Fable 5.2 on API Price

*Top story · AI Models · VentureBeat · 2026-11-10*

![Google Gemini 4 Carbon is now publicly available — and it undercuts Claude Fable 5.2 and Opus 5.5 on API price | VentureBeat](https://images.ctfassets.net/jdtwqhzvc2n1/1goGiwLboF5JITTDXQkXcp/a2028256f6639fd85a66768837bee60a/Retro_Carbon_Code_Explosion.png?w=800&q=75)

Google has made its flagship AI model, Gemini 4 Carbon, generally available to developers, enterprises, scientists, and consumers. Carbon is positioned as Google's strongest model for complex agentic work in software engineering, cybersecurity, knowledge work, and science. Its API pricing starts at $2 per million uncached input tokens and $10 per million output tokens, which is one-quarter of Fable 5.2’s standard rates through November 30, and half once Google raises its price to $4 and $20. While Carbon previously led on some benchmarks, Anthropic's Fable has since taken the lead on Artificial Analysis's general intelligence index.

**Key facts**

- Gemini 4 Carbon now generally available
- Introductory API input price: $2/1M tokens
- Introductory API output price: $10/1M tokens
- Google plans to raise prices to $4/1M input and $20/1M output
- Available in Gemini API, Google AI Ultra, and AI Mode in Search

**Why it matters:** This release provides a powerful new option for engineers building agentic AI applications, offering highly competitive pricing compared to Anthropic's latest models, which could significantly impact cost-effectiveness for heavy users.

> Gemini 4 Carbon is now available and offers an aggressive introductory price for API usage, potentially lowering the cost of advanced AI agentic workflows.

[🔗 Read more at VentureBeat](https://venturebeat.com/technology/google-gemini-4-carbon-is-now-publicly-available-and-it-undercuts-claude-fable-5-2-and-opus-5-5-on-api-price)

---

## Attackers Backdoor Trusted AWS Integrations via Qubole Credentials to Steal Secrets

*Security · The Register · 2026-11-10*

![Attackers backdoor trusted AWS integrations to steal secrets](https://image.theregister.com/1681829.jpg?imageId=1681829&x=0&y=0&cropw=100&croph=100&panox=0&panoy=0&panow=100&panoh=100&width=1200&height=683)

Wiz researchers, in collaboration with Google's Mandiant, uncovered a supply-chain attack where unknown attackers used compromised Identity and Access Management (IAM) credentials linked to Qubole's AWS account. These compromised credentials were used to call the sts:AssumeRole API, obtaining temporary credentials for customer-managed integration roles. This allowed attackers to access multiple customer AWS environments, enumerate cloud resources, harvest secrets from services like Lambda, Secrets Manager, and SSM Parameter Store, and siphon data from S3 buckets. The malicious activity, traced back to October 14, leveraged trust policies that remained active even after some organizations deprecated the Qubole platform, enabling the attackers to exploit cross-account trust relationships. A separate campaign using customer-owned AWS access keys for Qubole integrations was also observed between October 8 and October 11.

**Key facts**

- Attackers compromised Qubole's AWS IAM credentials
- Accessed customer AWS environments via sts:AssumeRole API
- Stole secrets from Lambda, Secrets Manager, SSM Parameter Store
- Exfiltrated data from S3 buckets
- Malicious activity began October 14
- Qubole AWS account 805246085872, IAM user ID AIDA3W7DIFLYOLTK63SFS involved

**Why it matters:** This highlights a critical supply chain security vulnerability in cloud environments: the persistent danger of third-party integration access and the need for rigorous review of IAM trust policies, even for deprecated services. Engineers must audit and revoke stale cross-account trust relationships immediately.

> Compromised third-party AWS integration credentials pose a significant supply chain risk, emphasizing the need to actively manage and revoke all unnecessary cross-account trust policies.

[🔗 Read more at The Register](https://www.theregister.com/security/2026/11/09/attackers-backdoor-trusted-aws-integrations-to-steal-secrets/5308553)

---

## StepFun Scales Multimodal AI Storage Beyond 10,000 Clients Using Kubernetes and TiKV

*Cloud & Infrastructure · Cncf · 2026-11-11*

![StepFun | CNCF](https://www.cncf.io/wp-content/uploads/2026/11/Blog-Feature-Image-Template-4.jpg)

StepFun, a developer of 22 multimodal foundation models, faced challenges scaling its storage infrastructure across GPU clusters, private data centers, and public clouds. Their previous commercial storage system struggled with performance and scalability for various AI lifecycle stages, from data preparation to inference. To overcome this, StepFun built a unified storage platform leveraging CNCF projects Kubernetes and TiKV, along with JuiceFS, an open-source distributed file system. This new architecture allowed them to scale beyond 10,000 JuiceFS clients, improve targeted read-only operations by approximately 50%, and reduce safetensors read amplification by about 71%.

**Key facts**

- StepFun developed 22 foundation models, 16 multimodal
- Scaled beyond 10,000 JuiceFS clients
- Improved targeted read-only operations by ~50%
- Reduced safetensors read amplification by ~71%

**Why it matters:** This case study demonstrates a practical, open-source approach to building scalable, unified storage for diverse multimodal AI workloads across hybrid environments, offering a blueprint for engineers facing similar infrastructure challenges.

> Combining Kubernetes, TiKV, and JuiceFS provides a robust, scalable storage solution for complex AI workloads in hybrid cloud environments.

[🔗 Read more at Cncf](https://www.cncf.io/case-studies/stepfun)

---

## Anthropic Releases Claude Fable 5.2 and Mythos 5.2, Cuts Fable Pricing by 20%

*AI Models · DEV Community · 2026-11-11*

![AI Weekly: Fable 5.2, Muse Ember, and TPU 8i Max - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fg2l2e3qm7dzdgho92x2y.png)

Anthropic released Claude Fable 5.2 and Claude Mythos 5.2, both based on a single underlying model. Fable 5.2 is generally available with safeguards against offensive security and research-level biology, while Mythos 5.2, which lacks these safeguards, is restricted to organizations in Anthropic's Cyber and Life Sciences Verification Programs, and Claude Enterprise customers. Fable 5.2 features a 1 million token context window, up to 128,000 output tokens, and a June 2026 knowledge cutoff. Its API price was reduced by 20%, now costing $8 per million input tokens and $40 per million output tokens, down from $10 and $50 for Fable 5.1.

**Key facts**

- Claude Fable 5.2 and Mythos 5.2 released on November 9
- Fable 5.2 API input price: $8/1M tokens (down from $10)
- Fable 5.2 API output price: $40/1M tokens (down from $50)
- Context window: 1 million tokens
- Output tokens: up to 128,000
- Knowledge cutoff: June 2026

**Why it matters:** Engineers evaluating Claude models can now access Fable 5.2 with a significant price reduction, making it more competitive for large-scale applications, though Mythos 5.2's restricted availability for sensitive use cases is important to note.

> Claude Fable 5.2 is now 20% cheaper for API access, while its more powerful, less guarded counterpart, Mythos 5.2, is only for vetted enterprises.

[🔗 Read more at DEV Community](https://dev.to/alexmercedcoder/ai-weekly-fable-52-muse-ember-and-tpu-8i-max-3k1o)

---

## KubeVirt Graduates from CNCF, Unifying VMs, Containers, and AI Workloads on Kubernetes

*Cloud & Infrastructure · Cncf · 2026-11-10*

![Cloud Native Computing Foundation Announces KubeVirt Graduation | CNCF](https://www.cncf.io/wp-content/uploads/2026/11/Press-Release-Images-for-Site-15.jpg)

The Cloud Native Computing Foundation (CNCF) announced the graduation of KubeVirt, an open-source project that extends Kubernetes to run and manage virtual machines (VMs) alongside containers. This graduation signifies its production maturity after 10 years of development. KubeVirt enables organizations to unify VM, container, and AI workloads under a single Kubernetes control plane, simplifying infrastructure management and supporting modernization without requiring application rewrites. It was created by Red Hat in 2016 and was accepted into the CNCF Sandbox in September 2019, moving to Incubating in April 2022. Recent updates in KubeVirt v1.8 added a Hypervisor Abstraction Layer, Intel TDX attestation for confidential VMs, storage-agnostic incremental backup, and performance improvements for AI and HPC workloads.

**Key facts**

- KubeVirt graduated from CNCF
- 10 years of development since Red Hat created it in 2016
- Accepted into CNCF Sandbox in Sep 2019, Incubating in Apr 2022
- KubeVirt v1.8 released in March, with Hypervisor Abstraction Layer and Intel TDX attestation

**Why it matters:** KubeVirt's graduation means engineers can now confidently leverage a mature, Kubernetes-native solution to consolidate legacy VM-based applications with modern containerized and AI workloads, streamlining operations and facilitating incremental modernization.

> KubeVirt's graduation establishes it as a production-ready solution for managing VMs, containers, and AI workloads uniformly on Kubernetes.

[🔗 Read more at Cncf](https://www.cncf.io/announcements/2026/11/10/cloud-native-computing-foundation-announces-kubevirt-graduation)

---

## Google DeepMind Announces General Availability of Gemini 4 Carbon

*AI Models · Google DeepMind · 2026-11-10*

![Gemini 4 Carbon is now available](https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_4_carbon_key_art_16-9_lockup.width-1300.jpg)

Google DeepMind announced that Gemini 4 Carbon is now available for developers, enterprises, scientists, and consumers. The model is highlighted for its strong performance in cybersecurity capabilities and long-horizon agentic workflows across complex knowledge work, software engineering, and scientific reasoning. This release builds on an earlier announcement and access for selected cybersecurity defenders in Google's Fairwind program.

**Key facts**

- Gemini 4 Carbon generally available since November 10, 2026
- Strongest model for cybersecurity and long-horizon agentic workflows

**Why it matters:** This general availability expands access to a frontier AI model, offering engineers more powerful tools for automating complex tasks in software development, scientific research, and cybersecurity applications.

> Gemini 4 Carbon is now broadly accessible, providing a high-performance model for advanced AI applications.

[🔗 Read more at Google DeepMind](https://deepmind.google/blog/gemini-4-carbon-is-now-available)

---

## Mercor Raises $750M Series D at $20B Valuation, Reporting $3B Annualized Revenue

*AI Models · Latent · 2026-11-11*

![Mercor $750m Series D at $20B valuation, $3B run rate — Latent Space](https://latent.space/og/card/post/ainews-mercor-750m-series-d-at-20b-valuation-3b-run-rate/0a6ebbfe98ad97a5127fc1c24df129ccd58884d32c867036ad2d48f36fe03fee.png)

Mercor, an AI company, has closed a $750 million Series D funding round, bringing its valuation to $20 billion. The company reported $3 billion in annualized revenue, having previously crossed $1 billion in February and $2 billion in June. Mercor also stated it spends three times as much on inference as on employee salaries, indicating the significant role of AI in its operations.

**Key facts**

- Mercor raised $750 million in Series D funding
- Company valuation reached $20 billion
- $3 billion in annualized revenue
- Spends 3x more on inference than employee salaries

**Why it matters:** The high inference spending relative to salaries at Mercor illustrates the potential for AI models to become a major operational cost for businesses, shifting budget allocations from human capital to compute resources for AI-driven workflows.

> AI inference costs can significantly outweigh salary expenses for AI-native companies, signaling a shift in operational expenditures.

[🔗 Read more at Latent](https://latent.space/p/ainews-mercor-750m-series-d-at-20b-valuation-3b-run-rate)

---

## Red Hat Boosts AI Agent Security with OpenShell Integration into Kubernetes and OpenShift

*Security · Siliconangle · 2026-11-10*

Red Hat is extending its Kubernetes management capabilities to AI agent workloads, focusing on security and resource management. Their collaboration with Nvidia involves integrating OpenShell, a runtime that places AI agents in isolated execution environments and applies policy to their access. This integration aims to address the security concerns arising from autonomous agents that can generate commands, invoke tools, and access enterprise systems. OpenShell uses sandboxing, process-aware policies, and controls over network access and credentials. Red Hat states OpenShell can work with OpenShift's sandboxed containers, adding application-level restrictions within a virtual-machine boundary to limit potential damage from agent misbehavior.

**Key facts**

- Red Hat collaborates with Nvidia on OpenShell
- OpenShell provides isolated execution environments for AI agents
- Utilizes sandboxing, process-aware policy, and network/credential controls
- Integrates with OpenShift's sandboxed containers

**Why it matters:** As AI agents gain autonomy, this initiative provides critical infrastructure-level security for deploying them in enterprise environments, offering backend and systems engineers tools to define permissions and isolate agent actions, thus mitigating risks.

> Red Hat is building Kubernetes-native security for AI agents through OpenShell, crucial for safe enterprise deployment.

[🔗 Read more at Siliconangle](https://siliconangle.com/2026/11/10/red-hat-ai-agent-infrastructure-kubeconna)

---

## Quick hits

- **[LinkedIn Replaces Argo CD with Custom GitOps Engine for Kubernetes Deployments](https://www.infoq.com/news/2026/11/kubernetes-argocd-linkedin)** (InfoQ) — LinkedIn has developed and deployed its own custom GitOps engine to manage Kubernetes deployments, moving away from Argo CD.
- **[GitHub Dashboard Updated for More Informative, Compact View](https://github.blog/changelog/2026-11-10-a-more-informative-github-dashboard)** (GitHub Blog) — GitHub has updated its dashboard to be more compact and scannable, reducing padding, fixing title wrapping, and showing more items by default.

---

## What to watch

- The sustained pricing strategies for Gemini 4 Carbon versus Claude Fable 5.2 as the introductory offers expire.
- The adoption rate of KubeVirt for unifying VM and container workloads in enterprise environments and its impact on infrastructure complexity.
- The evolution of Red Hat's OpenShell and its broader integration into Kubernetes-native security frameworks for AI agents.

---

## Sources

- [Google Gemini 4 Carbon Publicly Available, Undercuts Claude Fable 5.2 on API Price](https://venturebeat.com/technology/google-gemini-4-carbon-is-now-publicly-available-and-it-undercuts-claude-fable-5-2-and-opus-5-5-on-api-price) — VentureBeat, 2026-11-10
- [Attackers Backdoor Trusted AWS Integrations via Qubole Credentials to Steal Secrets](https://www.theregister.com/security/2026/11/09/attackers-backdoor-trusted-aws-integrations-to-steal-secrets/5308553) — The Register, 2026-11-10
- [StepFun Scales Multimodal AI Storage Beyond 10,000 Clients Using Kubernetes and TiKV](https://www.cncf.io/case-studies/stepfun) — Cncf, 2026-11-11
- [Anthropic Releases Claude Fable 5.2 and Mythos 5.2, Cuts Fable Pricing by 20%](https://dev.to/alexmercedcoder/ai-weekly-fable-52-muse-ember-and-tpu-8i-max-3k1o) — DEV Community, 2026-11-11
- [KubeVirt Graduates from CNCF, Unifying VMs, Containers, and AI Workloads on Kubernetes](https://www.cncf.io/announcements/2026/11/10/cloud-native-computing-foundation-announces-kubevirt-graduation) — Cncf, 2026-11-10
- [Google DeepMind Announces General Availability of Gemini 4 Carbon](https://deepmind.google/blog/gemini-4-carbon-is-now-available) — Google DeepMind, 2026-11-10
- [Mercor Raises $750M Series D at $20B Valuation, Reporting $3B Annualized Revenue](https://latent.space/p/ainews-mercor-750m-series-d-at-20b-valuation-3b-run-rate) — Latent, 2026-11-11
- [Red Hat Boosts AI Agent Security with OpenShell Integration into Kubernetes and OpenShift](https://siliconangle.com/2026/11/10/red-hat-ai-agent-infrastructure-kubeconna) — Siliconangle, 2026-11-10
- [LinkedIn Replaces Argo CD with Custom GitOps Engine for Kubernetes Deployments](https://www.infoq.com/news/2026/11/kubernetes-argocd-linkedin) — InfoQ, 2026-11-12
- [GitHub Dashboard Updated for More Informative, Compact View](https://github.blog/changelog/2026-11-10-a-more-informative-github-dashboard) — GitHub Blog, 2026-11-10
