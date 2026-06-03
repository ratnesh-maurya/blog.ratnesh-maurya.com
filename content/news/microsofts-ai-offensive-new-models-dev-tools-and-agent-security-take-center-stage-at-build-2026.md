---
title: "Microsoft's AI Offensive: New Models, Dev Tools, and Agent Security Take Center Stage at Build 2026"
description: "Catch up on the latest from Microsoft Build 2026! Discover new AI models, a crucial AI behavior testing tool, and an OS-level sandbox for AI agents. Plus, OpenAI expands Codex for white-collar work."
date: "2026-06-03"
tags: ["Microsoft Build 2026", "AI", "Artificial Intelligence", "MAI-Thinking-1", "ASSERT", "MXC", "AI agents", "OpenAI", "Codex", "Software Development", "Windows", "Security"]
source: "tavily"
---


The world of AI and software development is buzzing with activity, especially from **Microsoft** as its annual **Build 2026** conference unfolds. Today's digest highlights significant advancements in AI model development, crucial new tools for testing AI behaviors, and groundbreaking security measures for autonomous AI agents, alongside **OpenAI's** strategic expansion of its **Codex** tools for knowledge workers.

## TL;DR
*   **Microsoft** unveiled **ASSERT**, an open-source framework simplifying AI behavior testing using natural language descriptions.
*   **Microsoft** launched **MAI-Thinking-1**, its first advanced reasoning AI model, among seven new in-house models at **Build 2026**.
*   **Microsoft** introduced **MXC**, an OS-level sandbox for AI agents, integrating security and control directly into **Windows**.
*   **OpenAI** expanded its **Codex** tools with new plugins, specifically targeting white-collar knowledge workers beyond software engineers.
*   **Microsoft Build 2026** is set to unveil a range of AI models and **Windows** improvements, including a new reasoning AI model and a **Copilot** "super app."

---

## New Microsoft tool lets devs spin up AI behavior tests using text descriptions

![New Microsoft tool lets devs spin up AI behavior tests using text descriptions - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/06/GettyImages-172665283.jpg?w=1024)

**Microsoft** has launched **ASSERT** (Adaptive Spec-driven Scoring for Evaluation and Regression Testing), an open-source framework designed to simplify the evaluation of application-specific AI behavior. As AI models become more sophisticated, ensuring they behave as intended for specific products or services has become a critical challenge for developers and companies.

**ASSERT** addresses this by enabling developers to use high-level, natural-language descriptions of goals and policies to generate thorough, scored tests. The framework translates these plain-language descriptions into structured sets of acceptable and unacceptable behaviors, creates problem scenarios and test cases, and runs them against the target AI system. It also records the AI system's actions, including intermediate steps and tool calls, allowing developers to pinpoint exactly where failures occur and to investigate them effectively.

> **ASSERT** makes evaluating application-specific AI behavior easy by using AI to turn high-level, natural-language descriptions of goals, policies, or intended behaviors into thorough, scored tests that can be investigated.

[🔗 Read more](https://techcrunch.com/2026/06/02/new-microsoft-tool-lets-devs-spin-up-ai-behavior-tests-using-text-descriptions/)

---

## Microsoft’s first advanced reasoning AI is here

![Vector illustration of the Microsoft logo.](https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25832912/STK095_MICROSOFT_2_CVirginia_A.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400)

At its **Build 2026** conference, **Microsoft** announced a significant expansion of its in-house AI model development, including the introduction of **MAI-Thinking-1**, its new "flagship" model. This move signifies a shift for **Microsoft**, which previously relied heavily on **OpenAI's** models but recently renegotiated its partnership to loosen ties. **MAI-Thinking-1** is described as a "medium-sized model" that, according to **Microsoft**, "matches leading models" on "key" software engineering benchmarks. It was notably trained "from the ground up on clean data, without distillation from third-party models."

In addition to **MAI-Thinking-1**, **Microsoft** revealed six other new models focused on diverse applications. These include **MAI-Image 2.5** for text-to-image generation and editing, **MAI-Transcribe-1.5** which is said to be **five times faster** than competing models, and **MAI-Voice-2** (with a flash version coming soon) offering **15 new languages** and voice options. A new coding model, **MAI-Code-1-Flash**, is also integrated into **GitHub Copilot** and **Visual Studio Code**, boasting "inference-efficient" performance. These releases underscore **Microsoft's** commitment to developing a comprehensive suite of in-house AI capabilities.

> **MAI-Thinking-1** is a "medium-sized model" that "matches leading models" on "key" software engineering benchmarks.

[🔗 Read more](https://www.theverge.com/tech/941664/microsoft-ai-model-reasoning-mai-thinking-1-build-2026)

---

## Microsoft launches MXC, an OS-level sandbox for AI agents, with OpenAI and Nvidia already on board

![Nuneybits Vector art of the Microsoft logo centered on a clean 168d84f7-6dbd-4a4d-8842-922c6c2ff4b6](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2F2Bj8ehmUSTCeqnkJ3pPCjc%2Ff9782b3575c73ccecb809afd58e7acd2%2FNuneybits_Vector_art_of_the_iconic_Microsoft_Windows_logo_on_a__b8c7cdb1-4983-4e68-94a9-93fbef23357b.webp%3Fw%3D1000%26q%3D100&w=3840&q=85)

Addressing critical security concerns surrounding the increasing autonomy of AI agents, **Microsoft** unveiled **Microsoft Execution Containers** (MXC) at its **Build** developer conference. **MXC** is a policy-driven execution layer built directly into the **Windows** operating system, designed to provide a secure sandbox environment for AI agents. This innovation allows developers and IT administrators to precisely define and enforce what an AI agent can and cannot access at runtime, with these boundaries managed by the OS kernel.

**MXC** is presented as an SDK and a policy model, not a direct product purchase, and is embedded within **Windows** and the **Windows Subsystem for Linux**. It offers a "composable sandbox spectrum," ranging from lightweight process isolation, already adopted by **GitHub Copilot's** command-line interface, to more robust micro-virtual machines, Linux containers, and full cloud instances on **Windows 365**. A crucial feature of **MXC** is its ability to bind every agent to a strong identity, whether local or cloud-provisioned via **Microsoft Entra**, ensuring that all agent actions are attributable, auditable, and governable. This aims to resolve the paradox of deploying powerful autonomous AI agents safely within enterprise networks, by providing a fundamentally more controlled operational environment.

> The industry has not done, at least not with any consistency, is answer the question that keeps chief information security officers awake at night: what happens when an agent goes wrong?

[🔗 Read more](https://venturebeat.com/security/microsoft-launches-mxc-an-os-level-sandbox-for-ai-agents-with-openai-and-nvidia-already-on-board)

---

## OpenAI launches new Codex tools for white-collar work

![The OpenAI logo is displayed on a smartphone screen placed on a reflective surface onto which lines of computer code.](https://techcrunch.com/wp-content/uploads/2026/05/openai-logo-code-background.jpg?w=1024)

**OpenAI** is intensifying its efforts to attract enterprise users by releasing a new suite of capabilities for its **Codex** tool, explicitly aimed at expanding its utility in the workplace beyond traditional software engineering tasks. This strategic move is supported by an internal report from **OpenAI** detailing how **Codex** is increasingly being utilized for various knowledge work functions.

The report highlights that **Codex** now boasts over **5 million weekly active users**, a **six-fold increase** since the launch of its desktop app in February. While developers remain the largest user group, knowledge workers now constitute approximately **20 percent** of users and are growing at a rate **three times faster** than other segments. To cater to this expanding demographic, **OpenAI** has introduced a set of **six plug-ins** specifically designed to enhance **Codex's** functionality for diverse white-collar roles, signaling a clear push into broader enterprise applications.

> While developers remain the largest user group, knowledge workers now represent about **20 percent** of users and are growing more than **three times as fast**.

[🔗 Read more](https://techcrunch.com/2026/06/02/openai-launches-new-codex-tools-for-white-collar-work/)

---

## Microsoft to unveil new AI models and Windows improvements at Build

![Microsoft to unveil new AI models and Windows improvements at Build - The Verge](https://platform.theverge.com/wp-content/uploads/sites/2/2026/03/MS_BUILD.jpg?quality=90&strip=all&crop=0%2C10.732984293194%2C100%2C78.534031413613&w=1200)

**Microsoft** is hosting its annual **Build** conference in San Francisco, an event seen as pivotal for the company to reconnect with developers and shape the future of its AI and **Windows** strategies. According to sources, the conference is expected to feature major announcements regarding new AI models integrated into **Windows**, a new reasoning model from **Microsoft AI**, and the debut of a **Copilot** "super app." The context of this year's **Build** is particularly significant as **Microsoft** continues to reorient its entire business around AI, shifting to a more intimate venue and aiming to restore trust in **Windows** and **GitHub**.

Crucially for developers, **Microsoft** is also anticipated to reveal enhancements to the **Windows** experience. This includes a new **Windows 11** developer-optimized environment, which is expected to offer a distraction-free workspace with pre-installed apps, tools, and scripts – features highly requested by the developer community. Furthermore, there will be updates on **Microsoft's** ongoing efforts to rewrite parts of **Windows 11** to improve performance. The conference will also highlight how **Windows** is adapting to new silicon, such as **Nvidia's RTX Spark**, with a strong focus on running local AI models on **Windows** to leverage local compute resources over costly cloud alternatives. **Windows** chief **Pavan Davuluri** has previously hinted at "something new coming for developers" at **Build**, suggesting the introduction of next-generation smaller AI models.

> Build will include a Copilot super app, a new reasoning AI model, and lots of Windows improvements.

[🔗 Read more](https://www.theverge.com/report/940861/microsoft-build-ai-models-windows-dev-mode-what-to-expect)
