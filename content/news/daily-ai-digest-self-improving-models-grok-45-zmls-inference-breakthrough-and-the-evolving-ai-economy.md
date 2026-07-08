---
title: "Daily AI Digest: Self-Improving Models, Grok 4.5, ZML's Inference Breakthrough, and the Evolving AI Economy"
description: "Catch up on the latest AI news: discover how self-improving AIs are becoming accessible, delve into SpaceXAI's new 'Opus-class' Grok 4.5, explore ZML's free tool for multi-chip inference, understand why open-source AI isn't hindering frontier models, and see how Microsoft is cutting AI costs with internal solutions."
date: "2026-07-09"
tags: ["AI", "Self-Improving AI", "Grok 4.5", "SpaceXAI", "ZML", "AI Inference", "Open Source AI", "Anthropic", "Microsoft AI", "Cost Cutting AI", "LLMs", "Andrej Karpathy"]
source: "tavily"
---


The AI landscape is buzzing with innovation, demonstrating a fascinating dichotomy between sophisticated frontier models and practical, cost-efficient solutions. Today's news highlights the increasing accessibility of advanced AI concepts like self-improvement, significant advancements from major players like **SpaceXAI**, and crucial developments in optimizing AI's underlying infrastructure. We also delve into the nuanced relationship between open-source and proprietary AI models and how large corporations are strategically managing their AI expenditures.

## TL;DR
*   **WIRED** demonstrates that self-improving AI isn't just for frontier labs, with one author successfully building their own using **AutoResearch** and **Claude**.
*   **SpaceXAI** has launched **Grok 4.5**, an 'Opus-class' model praised by **Elon Musk** for its efficiency and lower cost.
*   French startup **ZML** released a free product, **ZML/LLMD**, to significantly speed up AI inference across diverse hardware like **Nvidia**, **AMD**, **Google TPU**, and **Apple Metal** chips.
*   A new theory suggests that open-source AI isn't competing with frontier models but rather complements them by handling mature use cases, allowing frontier labs like **Anthropic** to focus on new ones.
*   **Microsoft** is implementing a cost-saving strategy by increasingly using its own **MAI models** in applications like **Excel** and **Word**, reducing reliance on third-party providers like **OpenAI** and **Anthropic**.

---

## I Built a Self-Improving AI, and So Can You
![I Built a Self-Improving AI, and So Can You - WIRED](https://media.wired.com/photos/6a4d3e5ad99ed47ae9e00cc8/191:100/w_1280,c_limit/AI-Lab-I-Made-A-Self-Improving-AI-Business.jpg)
In an intriguing experiment, a **WIRED** author successfully built a self-improving AI model, demonstrating that this advanced concept isn't exclusively within the domain of large frontier labs. The project aimed to automate newsletter busywork by training and continuously improving a small language model. The author utilized **AutoResearch**, a tool created by AI researcher **Andrej Karpathy** (known for his work at **OpenAI**, **Tesla**, and now **Anthropic**), and leveraged **Claude** for the heavy lifting of training and refinement.

The process involved setting up **Claude** with specific instructions and providing the necessary computational resources, including an **Nvidia DGX** desktop supercomputer. Over several days, the author observed **Claude** autonomously adjusting parameters and training regimes, continually refining the smaller model's output. While early results were incoherent, subsequent self-improvements led to more articulate and less repetitive responses, highlighting the practical potential of recursive self-improvement beyond the pursuit of superintelligence.

> Self-improving AI, once considered the exclusive pursuit of frontier labs, can be practically applied by individuals to automate tasks and continually refine models.

[🔗 Read more](https://www.wired.com/story/frontier-labs-arent-the-only-ones-pursuing-self-improving-ai/)

---

## SpaceXAI releases Grok 4.5, which Elon describes as an ‘Opus-class model’
![SpaceXAI releases Grok 4.5, which Elon describes as an ‘Opus-class model’ - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/05/GettyImages-2259661359.jpg?w=1024)
**SpaceXAI** has unveiled its latest large language model, **Grok 4.5**, marking its first major release since the company went public. **Elon Musk**, founder of **SpaceXAI** and **X**, described **Grok 4.5** as an 'Opus-class model,' drawing a direct comparison to **Anthropic's** powerful **Opus LLM**, which is designed for intensive and complex tasks. The company positions **Grok 4.5** as a versatile workhorse capable of handling a broad spectrum of automated tasks, including coding, app-building, office work, research, and various forms of knowledge work.

A key advantage highlighted by **SpaceXAI** is the model's efficiency, boasting 'twice greater token efficiency' than other leading models. This efficiency is crucial in an industry where token costs are a growing concern for AI consumers, potentially offering significant cost savings. While benchmark metrics released by **SpaceXAI** Wednesday demonstrated strong competitiveness with top models from rivals, they were described as just shy of best-in-class, yet still a formidable offering in the rapidly evolving AI market.

> **SpaceXAI's Grok 4.5** aims to provide 'Opus-class' performance with improved token efficiency and lower costs, positioning it as a significant contender in the LLM landscape.

[🔗 Read more](https://techcrunch.com/2026/07/08/spacexai-releases-grok-4-5-which-elon-describes-as-an-opus-class-model/)

---

## Hot French startup ZML releases free product to speed inference across lots of AI chips
![Hot French startup ZML releases free product to speed inference across lots of AI chips - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/07/ZML-founder-Steeve-Morin.jpg?w=1024)
French AI startup **ZML** has launched a free inference-performance software product, **ZML/LLMD**, designed to accelerate the processing of prompts for a variety of open-source large language models across diverse AI chips. This move challenges **Nvidia's** longstanding dominance in the chip market by enabling optimal performance on hardware from **AMD**, **Google's TPU**, **Apple Metal**, **Intel Arc**, and even **Nvidia's** own chips. Endorsed by Turing Award winner **Yann LeCun**, **ZML's** offering seeks to break existing silos and maximize the speed of different chips for AI applications.

According to **ZML** founder **Steeve Morin**, the company's ambition is to make various chips available for AI use cases at their maximum speed, and sometimes even faster. Morin emphasized that optimizing inference has become more critical than model training as AI becomes integrated into daily life. He noted that current software and architecture barriers often lead to vendor lock-in, making it difficult to achieve peak performance across a mixed hardware environment. **ZML/LLMD** aims to address this by providing a unified solution for multi-chip inference optimization.

> **ZML's LLMD** aims to democratize high-performance AI inference by allowing open-source LLMs to run at peak speed across a wide array of AI chips, including those from **Nvidia**, **AMD**, **Google**, **Apple**, and **Intel**.

[🔗 Read more](https://techcrunch.com/2026/07/08/hot-french-startup-zml-releases-free-product-to-speed-inference-across-lots-of-ai-chips/)

---

## Why the rise of open source AI isn’t hurting Anthropic … yet
![Why the rise of open source AI isn’t hurting Anthropic … yet - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/06/GettyImages-2256487455.jpg?w=1024)
**Decagon CEO Jesse Zhang** recently put forth a provocative theory arguing that open-source AI is not directly competing with frontier labs like **Anthropic**, but rather serving a complementary role in the AI economy. Zhang's perspective suggests that while more mature AI deployments are indeed transitioning to lighter, often open-source models for cost-efficiency, the overall spending on expensive state-of-the-art frontier models remains largely unchanged. This indicates a two-phase lifecycle for AI adoption, where frontier models are used to initially prove out complex use cases, which are then migrated to cheaper open-source alternatives once they mature.

This dynamic allows frontier labs to continuously innovate and develop new, complex AI capabilities without experiencing a decline in demand for their advanced models. Data from **Vercel’s AI gateway dashboard** supports this, showing that despite **DeepSeek** surging ahead in token volumes, and **Z.ai** (behind **GLM-5.2**) also growing, overall spend on frontier models remains stable. This suggests that as established use cases shift to more affordable models, new and demanding applications continue to emerge, requiring the cutting-edge capabilities offered by frontier AI research.

> Open-source AI models are not displacing frontier models but rather enabling a lifecycle where frontier AI proves new use cases before they are optimized and transitioned to more cost-effective open-source solutions.

[🔗 Read more](https://techcrunch.com/2026/07/07/why-the-rise-of-open-source-ai-isnt-hurting-anthropic-yet/)

---

## Microsoft joins AI cost-cutting trend by relying more on its own models
![Microsoft joins AI cost-cutting trend by relying more on its own models - TechCrunch](https://techcrunch.com/wp-content/uploads/2025/01/GettyImages-2153485379.jpg?w=1024)
Amid rising AI costs, **Microsoft** has reportedly initiated a cost-cutting strategy by reducing its reliance on third-party AI models from **OpenAI** and **Anthropic**, instead deploying its own in-house **MAI models**. This shift is particularly noticeable in widely used applications like **Excel** and **Word**, where **Microsoft's** homegrown **MAI models** are now responding to a certain percentage of user prompts. Previously, **Microsoft** had heavily advertised that much of **Office 365** was powered by models from its external partners.

While **Microsoft** continues to utilize models from **OpenAI** and **Anthropic**, the company has been increasingly focused on developing its own AI agents. This strategy was highlighted at its annual Build conference last month, where **Microsoft** announced the launch of **seven new MAI models**, including an agentic coder and a text-to-image generator. This strategic pivot towards internal AI development demonstrates a broader industry trend among tech giants to internalize AI capabilities and manage associated operational costs more effectively.

> **Microsoft** is strategically reducing its dependence on third-party AI providers like **OpenAI** and **Anthropic** by deploying its own **MAI models** in core products to cut costs and enhance internal AI capabilities.

[🔗 Read more](https://techcrunch.com/2026/07/07/microsoft-joins-ai-cost-cutting-trend-by-relying-more-on-its-own-models/)
