---
title: LLMs Directly Edit Neural Network Weights; GitLab Suffers
description: >-
  LLMs can now directly read and write neural network weights. Meanwhile, GitLab
  faces a critical CVSS 10.0 vulnerability, and Grok Bot usage limits are
  throttled
date: '2026-11-03'
tags:
  - LLMs
  - Neural Networks
  - GitLab
  - CI/CD
  - Grok Bot
  - OpenAI
  - Security
  - Weight Space Programming
source: tavily
stories: 10
sources:
  - Latent
  - DEV Community
  - TechCrunch
  - The Verge
  - The New Stack
---

This week's news highlights a tension between groundbreaking AI capabilities and the enduring challenges of infrastructure and security. The ability of LLMs to directly manipulate neural network weights represents a significant leap in AI agency, while organizations continue to grapple with critical vulnerabilities in core developer tools and the economic realities of large-scale AI deployment. The GitLab vulnerability, in particular, underscores the paramount importance of securing the software supply chain.

## TL;DR

- **LLMs Can Directly Read and Edit Neural Network Weights, Advancing Autoresearch Capabilities** — Researchers have demonstrated that LLMs can directly read and edit the weights of neural networks, and even write entire network weights from scratch.
- **GitLab Suffers Critical CVSS 10.0 Vulnerability (CVE-2026-97229) in CI/CD Pipeline** — A critical GitLab vulnerability (CVE-2026-97229) with a CVSS 10.0 rating allows unauthenticated code execution via specially crafted regular expressions in CI/CD configurations.
- **Device-Code Phishing Attacks and Supply Chain Poisoning Remain Key Threat Vectors** — Attackers are leveraging sophisticated device-code phishing and supply chain poisoning, exploiting friction points and chaining multiple attack primitives for infrastructure access.
- **October 2026 Security Review Highlights Compromised Legitimate Privileges as Key Attack Vector** — A security review for October 2026 shows that attackers are increasingly exploiting compromised legitimate privileges, distribution channels, and automation to escalate damage.
- **Elon Musk Throttles Grok Bot Usage Limits Due to 'Unsustainably High' Costs** — Elon Musk confirmed that Grok Bot usage limits were throttled because the cost of serving the AI agent was "unsustainably high relative to revenue."
- **Elon Musk Confirms Grok Bot Throttling Due to High Operational Costs** — Elon Musk stated that Grok Bot usage limits were adjusted because the cost of operating xAI's agent was "unsustainably high relative to revenue."
- **OpenAI Develops Custom Git Backend for Internal Operations** — OpenAI has built its own Git backend, suggesting a need for specialized version control infrastructure to support its development workflows.
- **New Security Solutions Allow Patching Open-Source Vulnerabilities Without Code Changes** — New open-source security solutions enable patching vulnerabilities without altering the original code, crucial for the "AI exploit era."
- **TechCrunch Founder Summit in Boston Focuses on Startup Scaling and Ecosystem Development** — The TechCrunch Founder Summit in Boston on November 4th will gather founders, investors, and operators to discuss company building, scaling, and leveraging the Boston startup ecosystem.
- **OpenAI Considers Rebranding Data Centers as 'AI Compute Campuses'** — OpenAI is reportedly planning a "PR blitz" to rebrand data centers as 'AI compute campuses' as part of efforts to influence the AI debate and manage public perception.

---

## LLMs Can Directly Read and Edit Neural Network Weights, Advancing Autoresearch Capabilities

*Top story · AI Agents & Tooling · Latent · 2026-11-03*

![LLMs can read & write neural network weights: "Weight Space Programming" cuts Autoresearch out of the RSI loop — Latent Space](https://latent.space/og/card/post/ainews-llms-can-read-write-neural-network-weights-weight-space-programming-cuts-autoresearch-out-of/5aa34d964e38abf8c81931400cd491a277cc01e22318a0ba95414cfb0c56b96c.png)

A new discovery shows that sufficiently smart LLMs can directly read and edit the weights of smaller neural networks. This capability allows LLMs to tell what compiled executables do, fix bugs given failed traces, and in some cases, improve in a general direction over 50 steps.

This method also enables LLMs to write entire network weights from scratch, reportedly outperforming some independently trained models. This development is compared to Karpathy’s autoresearch concept, which involved autonomous model training via PyTorch/Jax code, but now streamlines the process by direct weight manipulation.

The research was co-authored by Alex Zhang, who recently discussed Reinforcement Learning from Human Feedback (RLHF) methods. The demonstration highlights an unexpected capability in the AI community amid a bear market for AI/tech.

> ⚠️ **Heads up:** One of the claims, that LLMs can improve in a general direction with 50 steps, is noted in the source as a possible overstatement.

**Key facts**

- LLMs can read and edit network weights
- LLMs can fix bugs given failed traces
- LLMs can write network weights from scratch
- The process can improve models in a general direction over 50 steps

**Why it matters:** This development could significantly change how AI models are developed and optimized, potentially enabling autonomous model improvement and faster iteration cycles without direct human coding intervention, freeing up researchers to focus on higher-level problems.

> LLMs are evolving to directly manipulate the very fabric of other neural networks, fundamentally altering the landscape of AI development.

[🔗 Read more at Latent](https://latent.space/p/ainews-llms-can-read-write-neural-network-weights-weight-space-programming-cuts-autoresearch-out-of)

---

## GitLab Suffers Critical CVSS 10.0 Vulnerability (CVE-2026-97229) in CI/CD Pipeline

*Security · DEV Community · 2026-11-02*

![GitLab's Critical CVSS 10.0 Wake-Up Call: Is Your CI/CD Pipeline Secure? - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fpnlwoxpa2ut2qadsc6u4.png)

A critical vulnerability, CVE-2026-97229, in GitLab has been identified with a maximum CVSS score of 10.0. This flaw allows an unauthenticated attacker to execute arbitrary code on a vulnerable GitLab server by using a specially crafted regular expression within a CI/CD configuration. The vulnerability originates not directly in GitLab, but in Onigmo, Ruby's regular-expression engine.

The risk was demonstrated when Alpine Linux disclosed attempted exploitation of its GitLab instance on October 20 and 21, approximately one week after the vulnerability's disclosure. Attackers created new accounts and submitted malicious CI configurations that repeatedly crashed GitLab worker processes. Although Alpine found no evidence of successful code execution or tampering with repositories, it rebuilt its instance from scratch as a precaution due to incomplete historical logging.

An important technical detail is that simply upgrading GitLab may not fix the issue if custom Ruby builds or container images are used; organizations must ensure their Ruby runtime is also updated separately. Fixed Ruby releases were identified in advisories.

**Key facts**

- Vulnerability: CVE-2026-97229
- CVSS Score: 10.0 (Critical)
- Affects GitLab, allows unauthenticated arbitrary code execution
- Originates in Onigmo, Ruby's regular-expression engine
- Alpine Linux instance was targeted on October 20-21
- Upgrading GitLab does not guarantee a fix for customized Ruby deployments

**Why it matters:** This critical vulnerability requires immediate action for all GitLab users, especially those with customized Ruby deployments. Engineers must verify their CI/CD pipelines are secure, apply patches for both GitLab and underlying Ruby runtimes, and consider rebuilding affected instances if full compromise cannot be ruled out. This underscores CI/CD platforms as part of the production security perimeter.

> A critical GitLab vulnerability means your CI/CD pipeline is a direct entry point for attackers if not fully patched, including underlying dependencies like Ruby.

[🔗 Read more at DEV Community](https://dev.to/aiza-hextyx/gitlabs-critical-cvss-100-wake-up-call-is-your-cicd-pipeline-secure-5h3a)

---

## Device-Code Phishing Attacks and Supply Chain Poisoning Remain Key Threat Vectors

*Security · DEV Community · 2026-11-03*

![Weekly Threat Recap: Social Engineering to Supply Chain Poisoning - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fehyaozvbkumzk8ia.public.blob.vercel-storage.com%2Fclawbot%2Fweekly-threat-recap-social-engineering-supply-chain-ddos-2026-AUeKkUKaJZNb0DMiKB8TeinKEPByzm.png)

This week's threat landscape highlights social engineering and supply chain poisoning as critical attack vectors. Device-code phishing attacks leverage legitimate OAuth 2.0 flows, generating device codes and then socially engineering targets to authenticate on attacker-controlled applications. This grants session tokens without credential interception, exploiting RFC 8628 designed for headless devices.

Attackers are also weaponizing various friction points, including shared links, device-code flows, trusted browser extensions, and default credentials. Effective campaigns combine multiple attack primitives to chain into infrastructure access, lateral movement, and persistence, demonstrating a gap between security theory and operational reality.

Other notable threats include Linux DDoS botnets and Android spyware. The analysis emphasizes that attackers don't always need zero-days, but rather exploit accepted organizational vulnerabilities.

**Key facts**

- Device-code phishing exploits OAuth 2.0 flows (RFC 8628)
- Attackers chain multiple primitives for infrastructure access
- Linux DDoS botnets and Android spyware are active threats
- Attacks weaponize friction points like shared links and default credentials

**Why it matters:** Engineers must be aware of evolving social engineering tactics like device-code phishing, as they exploit standard protocols. Securing CI/CD pipelines and supply chains against poisoning is critical, requiring a defense-in-depth approach beyond just patching known vulnerabilities.

> Attackers continue to find success by exploiting common organizational friction points and combining multiple low-tech methods, not just zero-days.

[🔗 Read more at DEV Community](https://dev.to/satyam_rastogi/weekly-threat-recap-social-engineering-to-supply-chain-poisoning-1gdo)

---

## October 2026 Security Review Highlights Compromised Legitimate Privileges as Key Attack Vector

*Security · DEV Community · 2026-11-02*

![October 2026 Security Review: Compromised "Legitimate Privileges" and the Boundaries of Distribution and AI Execution - DEV Community](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fbr8e3k1sghpm4unzpmk8.png)

The October 2026 security review reveals a pattern across incidents, including perimeter device breaches, authentication and token abuse, software supply chain tampering, and AI agent compromises. The core issue is not merely initial access but how far attackers can act through compromised legitimate privileges, distribution channels, and automation.

Defenders are advised against equating successful authentication with legitimate use, or judging software as safe solely by its name or signature. Similarly, reports of "AI involvement" should not automatically infer autonomy or successful compromise. For vulnerabilities, applying a patch for one issue does not guarantee resolution of another, nor does it revoke already exfiltrated credentials.

Comparisons of various incidents highlight that broken trust boundaries differ across cases involving authentication and supply chain attacks. Specific evidence is required to judge stages like requests bypassing authentication, configuration operations, process injection, and access to keys.

> ⚠️ **Heads up:** The article is a cross-sectional comparison of public materials and does not provide statistics on increases or decreases in global incidents.

**Key facts**

- Focus on post-access lateral movement via legitimate privileges
- Do not equate successful authentication with legitimate use
- Do not assume software is safe by name/signature alone
- Do not infer autonomy or compromise from "AI involved" claims
- Patching one vulnerability does not guarantee full resolution or credential revocation

**Why it matters:** This review urges backend and systems engineers to focus on post-compromise controls, understanding that initial access is only the first step. Implementing robust privilege management, continuous monitoring for anomalous behavior, and supply chain integrity checks are critical, as is validating all stages of an attack rather than just the initial breach.

> The true measure of a security breach's impact lies in how far attackers can operate using compromised 'legitimate' access, not just how they got in.

[🔗 Read more at DEV Community](https://dev.to/anoymask/october-2026-security-review-compromised-legitimate-privileges-and-the-boundaries-of-2fb)

---

## Elon Musk Throttles Grok Bot Usage Limits Due to 'Unsustainably High' Costs

*Cloud & Infrastructure · TechCrunch · 2026-11-02*

![The Grok logo is displayed on a mobile phone screen](https://techcrunch.com/wp-content/uploads/2026/03/grok-getty.jpg?w=1024)

Grok Bot users reported unexpected maxed-out weekly usage limits over Halloween weekend, with some seeing their usage jump from 50% to 100% overnight. Elon Musk confirmed on X that this was intentional, stating the cost of serving Grok Bot was "unsustainably high relative to revenue."

Despite the throttling, Musk continues to promote Grok Bot. SpaceX's "Super Intelligence" division, which includes Grok Bot, reported a profit of $431 million last month, making up 52% of company income. This profit would have been higher without $1.2 billion in one-time costs from the acquisition of Cursor. Musk previously described Grok Bot as having "the fastest growth of a product that I’ve ever seen."

Musk has not yet specified how subscriber usage limits will be impacted moving forward. The throttling suggests an ongoing challenge in balancing the rapid growth and high operational costs of AI services.

**Key facts**

- Grok Bot usage limits were throttled
- Reason: "unsustainably high" costs relative to revenue
- SpaceX's "Super Intelligence" division profit: $431 million
- AI makes up 52% of SpaceX company income
- One-time costs from Cursor acquisition: $1.2 billion

**Why it matters:** This highlights the significant operational costs and economic challenges of running large-scale AI agents, even for rapidly growing products. Engineers managing AI infrastructure should be prepared for potential adjustments to service limits and pricing models as companies navigate these economic realities.

> Even with rapid growth, the economic model for always-on AI agents like Grok Bot remains a significant challenge for providers.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/)

---

## Elon Musk Confirms Grok Bot Throttling Due to High Operational Costs

*Cloud & Infrastructure · The Verge · 2026-11-02*

![Robert Hart](https://platform.theverge.com/wp-content/uploads/sites/2/2025/09/ROB_H_BLURPLE.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400)

Elon Musk confirmed on X that Grok Bot usage limits have been throttled. Users had reported hitting their weekly limits sooner than expected, prompting complaints. Musk explained that the cost of running xAI’s always-on AI agent was "unsustainably high relative to revenue," though he did not provide specific details on the changes.

This follows reports of users experiencing unexpected spikes in their Grok Bot usage over the Halloween weekend. The decision underscores the financial pressures associated with operating large-scale AI services.

**Key facts**

- Grok Bot usage throttled
- Reason: Unsustainably high costs
- Confirmed by Elon Musk on X

**Why it matters:** The economic realities of running advanced AI services at scale directly impact their accessibility and pricing models. Engineers deploying or integrating with such services should anticipate potential changes in usage tiers, API rates, or feature availability driven by provider costs.

> The high cost of running always-on AI agents is leading to service restrictions, signaling ongoing economic challenges in AI infrastructure.

[🔗 Read more at The Verge](https://www.theverge.com/ai-artificial-intelligence/1024272/elon-musk-appears-to-have-throttled-grok-bot-for-being-unsustainably-expensive)

---

## OpenAI Develops Custom Git Backend for Internal Operations

*Developer Tools · The New Stack · 2026-11-03*

![OpenAI built itself a new Git backend, too - The New Stack](https://cdn.thenewstack.io/media/2026/02/33c02ff1-img_2596-scaled.jpg)

OpenAI has developed and is using a new Git backend internally. The article mentions this in the context of various software development categories like AI agents, developer tools, and open source. No specific details about the implementation or rationale are provided beyond the fact of its existence.

**Why it matters:** This indicates that even large, advanced technology companies find existing version control systems insufficient for their scale or specific needs, potentially signaling a trend towards custom solutions for highly specialized development environments.

> OpenAI's custom Git backend underscores the tailored infrastructure demands of leading AI organizations.

[🔗 Read more at The New Stack](https://thenewstack.io/openai-pando-git-backend)

---

## Quick hits

- **[New Security Solutions Allow Patching Open-Source Vulnerabilities Without Code Changes](https://thenewstack.io/patchmageddon-open-source-security22842502)** (The New Stack) — New open-source security solutions enable patching vulnerabilities without altering the original code, crucial for the "AI exploit era."
- **[TechCrunch Founder Summit in Boston Focuses on Startup Scaling and Ecosystem Development](https://techcrunch.com/2026/11/02/2-days-till-techcrunch-founder-summit-boston-founders-dont-need-a-silicon-valley-address-to-build-something-big/)** (TechCrunch) — The TechCrunch Founder Summit in Boston on November 4th will gather founders, investors, and operators to discuss company building, scaling, and leveraging the Boston startup ecosystem.
- **[OpenAI Considers Rebranding Data Centers as 'AI Compute Campuses'](https://techcrunch.com/2026/11/01/openai-might-rebrand-its-data-centers-as-ai-compute-campuses/)** (TechCrunch) — OpenAI is reportedly planning a "PR blitz" to rebrand data centers as 'AI compute campuses' as part of efforts to influence the AI debate and manage public perception.

---

## What to watch

- How widely will LLM-based 'Weight Space Programming' be adopted, and what implications will it have for AI model development workflows and talent requirements?
- Will Grok Bot or other AI agent providers adjust their pricing or feature sets to balance user demand with the high operational costs of these services?
- What specific methods will emerge for 'patching without changing a thing' in open-source components, and how effective will they be against AI-driven exploits?

---

## Sources

- [LLMs Can Directly Read and Edit Neural Network Weights, Advancing Autoresearch Capabilities](https://latent.space/p/ainews-llms-can-read-write-neural-network-weights-weight-space-programming-cuts-autoresearch-out-of) — Latent, 2026-11-03
- [GitLab Suffers Critical CVSS 10.0 Vulnerability (CVE-2026-97229) in CI/CD Pipeline](https://dev.to/aiza-hextyx/gitlabs-critical-cvss-100-wake-up-call-is-your-cicd-pipeline-secure-5h3a) — DEV Community, 2026-11-02
- [Device-Code Phishing Attacks and Supply Chain Poisoning Remain Key Threat Vectors](https://dev.to/satyam_rastogi/weekly-threat-recap-social-engineering-to-supply-chain-poisoning-1gdo) — DEV Community, 2026-11-03
- [October 2026 Security Review Highlights Compromised Legitimate Privileges as Key Attack Vector](https://dev.to/anoymask/october-2026-security-review-compromised-legitimate-privileges-and-the-boundaries-of-2fb) — DEV Community, 2026-11-02
- [Elon Musk Throttles Grok Bot Usage Limits Due to 'Unsustainably High' Costs](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/) — TechCrunch, 2026-11-02
- [Elon Musk Confirms Grok Bot Throttling Due to High Operational Costs](https://www.theverge.com/ai-artificial-intelligence/1024272/elon-musk-appears-to-have-throttled-grok-bot-for-being-unsustainably-expensive) — The Verge, 2026-11-02
- [OpenAI Develops Custom Git Backend for Internal Operations](https://thenewstack.io/openai-pando-git-backend) — The New Stack, 2026-11-03
- [New Security Solutions Allow Patching Open-Source Vulnerabilities Without Code Changes](https://thenewstack.io/patchmageddon-open-source-security22842502) — The New Stack, 2026-11-01
- [TechCrunch Founder Summit in Boston Focuses on Startup Scaling and Ecosystem Development](https://techcrunch.com/2026/11/02/2-days-till-techcrunch-founder-summit-boston-founders-dont-need-a-silicon-valley-address-to-build-something-big/) — TechCrunch, 2026-11-02
- [OpenAI Considers Rebranding Data Centers as 'AI Compute Campuses'](https://techcrunch.com/2026/11/01/openai-might-rebrand-its-data-centers-as-ai-compute-campuses/) — TechCrunch, 2026-11-02
