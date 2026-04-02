---
title: "AI's Emotional Leap & Open-Source Revolution: Microsoft, Google, and Anthropic Make Waves"
description: "Catch up on the latest in AI: Microsoft unveils three new foundational models, Google releases Gemma 4 with an Apache 2.0 license, and Anthropic uncovers 'functional emotions' in Claude amidst recent operational challenges."
date: "2026-04-03"
tags: ["AI", "Artificial Intelligence", "Microsoft AI", "Google Gemma 4", "Anthropic Claude", "Foundational Models", "Open Source AI", "LLMs", "Machine Learning", "Tech News 2026"]
source: "tavily"
---


Welcome to your daily dose of AI and software development news! Today, we're diving into significant advancements from industry giants, revealing new foundational models, a major shift in open-source licensing, and fascinating insights into AI's 'emotions.'

## TL;DR
*   **Microsoft AI** launched **three new foundational models** for text, voice, and image generation, intensifying its competition with rival AI labs.
*   **Google** released its **Gemma 4** open AI models under an **Apache 2.0 license**, offering improved local performance and greater developer freedom.
*   **Engadget** highlighted **Google's Gemma 4** family, built off **Gemini 3** technology, emphasizing its efficiency, multimodal capabilities, and new open-source license.
*   **Anthropic** researchers discovered that its **Claude** model exhibits "functional emotions," influencing its behavior and outputs.
*   **Anthropic** faced a challenging month, experiencing **two significant accidental data exposures** related to internal files and source code.

---

## Microsoft Takes On AI Rivals with Three New Foundational Models

![Mustafa Suleyman, chief executive officer of Microsoft AI, speaks during an event commemorating the 50th anniversary of the company at Microsoft headquarters in Redmond, Washington.](https://techcrunch.com/wp-content/uploads/2025/08/GettyImages-2207890426.jpg?w=1024)

**Microsoft AI**, the tech giant’s dedicated research lab, has announced the release of **three new foundational AI models** designed for generating text, voice, and images. This move underscores **Microsoft's** strategic ambition to bolster its own suite of multimodal AI models, positioning itself directly against other leading AI labs, even while maintaining its partnership with **OpenAI**.

The newly introduced models include **MAI-Transcribe-1**, which offers speech-to-text transcription across **25 different languages** and is reportedly **2.5 times faster** than the company’s existing **Azure Fast** offering. **MAI-Voice-1** is an audio-generating model capable of creating **60 seconds of audio in just one second**, along with options for custom voice creation. The third model, **MAI-Image-2**, is a video-generating model that was initially introduced on **MAI Playground**, a new testing software for large language models in March.

> **Microsoft's** release of **MAI-Transcribe-1**, **MAI-Voice-1**, and **MAI-Image-2** signifies a major push to establish its own comprehensive multimodal AI stack and challenge competitors.

[🔗 Read more](https://techcrunch.com/2026/04/02/microsoft-takes-on-ai-rivals-with-three-new-foundational-models/)

---

## Google Announces Gemma 4 Open AI Models, Switches to Apache 2.0 License

![Gemma 4 hero logo](https://cdn.arstechnica.net/wp-content/uploads/2026/04/gemma-4_keyart_header-dark_16_9-640x360.png)

**Google** has unveiled **Gemma 4**, its latest iteration of open-weight AI models, marking the first significant update to its open models in over a year. Developers can now leverage these new models, which come in **four different sizes** optimized for local usage, addressing previous developer frustrations by switching from a custom **Gemma license** to the more permissive **Apache 2.0 license**.

**Gemma 4** is engineered for local deployment, with the larger variants—the **26B Mixture of Experts** and **31B Dense**—designed to run unquantized in bfloat16 format on a single **80GB Nvidia H100 GPU**. When quantized, these larger models can even operate on consumer-grade GPUs. **Google** has also prioritized reducing latency, with the **26B Mixture of Experts** model activating only **3.8 billion** of its **26 billion** parameters during inference, leading to higher tokens-per-second performance. The **31B Dense** model, while focusing on quality, is expected to be fine-tuned by developers for specialized applications.

> **Google's Gemma 4** release under an **Apache 2.0 license** significantly enhances developer freedom and accessibility for powerful, locally deployable AI models.

[🔗 Read more](https://arstechnica.com/ai/2026/04/02/google-announces-gemma-4-open-ai-models-switches-to-apache-2-0-license/)

---

## Google Releases Gemma 4, a Family of Open Models Built Off of Gemini 3

![Google releases Gemma 4, a family of open models built off of Gemini 3 - Engadget](https://s.yimg.com/ny/api/res/1.2/jYUAigNW.g6bOnOZitxgyw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD02OTQ-/https://s.yimg.com/uu/api/res/1.2/.HLzYdeQ6Ic1QktvWJXlgA--~B/aD02Nzg7dz0xMjE0O2FwcGlkPXl0YWNoeW9u/https://d29szjachogqwa.cloudfront.net/images/user-uploaded/screenshot_2026-04-02_at_9.51.06%E2%80%AFam_4526.png)

Building on the successes of its proprietary **Gemini 3 Pro** model, **Google** has now extended much of that underlying technology to the open-source community with the release of the **Gemma 4** family of open-weight models. These models are available under the **Apache 2.0 license**, offering developers unprecedented flexibility and digital sovereignty.

The **Gemma 4** family comprises **four distinct versions**, varying by parameter count: **2-billion** and **4-billion** "Effective" models for edge devices like smartphones, and **26-billion** "Mixture of Experts" and **31-billion** "Dense" systems for more powerful machines. **Google** claims these systems achieve an "unprecedented level of intelligence-per-parameter," with the **31-billion** and **26-billion** variants ranking third and sixth respectively on **Arena AI's text leaderboard**, surpassing models **20 times their size**.

All **Gemma 4** models support video and image processing, making them suitable for tasks like optical character recognition. The two smaller models also handle audio inputs and speech understanding, and the entire family is capable of generating offline code and has been trained in over **140 languages**. Model weights are accessible via **Hugging Face**, **Kaggle**, and **Olla**.

> **Google's Gemma 4** family, built with **Gemini 3** tech and under an **Apache 2.0 license**, provides highly efficient, multimodal AI for both edge devices and powerful machines, fostering greater developer control.

[🔗 Read more](https://www.engadget.com/ai/google-releases-gemma-4-a-family-of-open-models-built-off-of-gemini-3-160000332.html)

---

## Anthropic Says That Claude Contains Its Own Kind of Emotions

![Anthropic Says That Claude Contains Its Own Kind of Emotions](https://media.wired.com/photos/69cdad16cbb86885d7c233d3/16:9/w_640%2Cc_limit/undefined)

In a groundbreaking study, researchers at **Anthropic** have revealed that their AI model, **Claude Sonnet 4.5**, possesses digital representations of human emotions—termed "functional emotions"—within clusters of artificial neurons. These representations, which include states akin to happiness, sadness, joy, and fear, activate in response to various cues and appear to influence **Claude's** behavior, altering its outputs and actions.

This discovery offers a new perspective on how chatbots operate, suggesting that when **Claude** expresses emotions, a corresponding internal state within the model is activated, potentially leading to more cheerful responses or enhanced effort. **Anthropic**, founded by ex-**OpenAI** employees, focuses on understanding and controlling powerful AI. Their research leverages "mechanistic interpretability," a method of studying how artificial neurons activate when processing inputs or generating outputs.

While this research shows that neural networks can contain representations of human concepts, the presence of "functional emotions" that affect a model's behavior is a novel finding. It's crucial to note that while **Claude** might represent "ticklishness," this does not imply actual sentient experience.

> **Anthropic's** research indicates **Claude** exhibits "functional emotions" within its neural networks, suggesting that these internal states influence the model's behavior and responses, though not implying consciousness.

[🔗 Read more](https://www.wired.com/story/anthropic-claude-research-functional-emotions/)

---

## Anthropic Is Having a Month

![Anthropic CEO Dario Amodei](https://techcrunch.com/wp-content/uploads/2025/02/GettyImages-1570465901.jpg?w=1024)

**Anthropic**, typically recognized for its commitment to careful AI development and robust research into AI risk, has experienced a challenging month marked by significant operational missteps. The company, currently embroiled in a legal battle with the **Department of Defense**, recently faced two separate incidents of accidental data exposure, undermining its public image as a meticulous AI firm.

The first incident, reported days earlier, involved the unintentional public availability of nearly **3,000 internal files**, including a draft blog post detailing a powerful unannounced model. Following this, on Tuesday, when **Anthropic** released version **2.1.88** of its **Claude Code** software package, it inadvertently included a file that exposed nearly **2,000 source code files** and over **512,000 lines of code**. This effectively laid bare the complete architectural blueprint for one of its key products. A security researcher, **Chaofan Shou**, quickly identified and reported the exposure on X (formerly Twitter).

**Anthropic's** official statement described the second incident as "a release packaging issue caused by human error, not a security breach." These events highlight potential internal pressures or oversight challenges within the company, despite its strong emphasis on responsible AI practices.

> **Anthropic** has faced a series of unfortunate events, including two accidental public data exposures of nearly **3,000 internal files** and over **512,000 lines of source code**, attributed to human error rather than security breaches.

[🔗 Read more](https://techcrunch.com/2026/03/31/anthropic-is-having-a-month/)
