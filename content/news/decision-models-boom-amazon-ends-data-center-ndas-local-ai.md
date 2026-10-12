---
title: Decision Models boom; Amazon ends data center NDAs; local AI
description: >-
  This digest covers the rapid emergence of decision models, Amazon's shift away
  from data center NDAs, the increasing viability of local AI, and the current
date: '2026-10-12'
tags:
  - TypeSafe/Jev
  - Decision Models
  - OpenAI Decisions API
  - Microsoft-Decision-1
  - Perplexity pplx-decider-v1.1-27b
  - Cloudflare clef
  - Liquid d1
  - Amazon
source: tavily
stories: 5
sources:
  - Latent
  - The Verge
  - TechCrunch
---

The AI industry saw a surge in 'decision models' this week, with multiple major players launching offerings that move beyond free text generation towards structured, actionable outputs. This shift, coupled with the increasing focus on local AI for privacy and cloud providers addressing community concerns, highlights a maturing landscape for AI development and deployment. The most significant story is the rapid adoption and valuation of decision models, indicating a new frontier in AI utility.

## TL;DR

- **Decision Models Emerge as New AI Product Category with Multiple Vendor Launches** — Several vendors, including OpenAI, Microsoft, Perplexity, Cloudflare, and Liquid, launched 'decision models' that return typed answers instead of free text.
- **Local AI Becomes More Accessible and Appealing for Privacy-Conscious Users** — Running powerful AI models locally is becoming more viable and appealing due to privacy concerns with cloud services, as hardware improves.
- **Amazon Follows Microsoft in Ending NDAs for Data Center Negotiations with Local Governments** — Amazon will no longer use nondisclosure agreements when negotiating with local governments over data centers, following Microsoft's earlier decision.
- **Voice AI Lacks a 'ChatGPT Moment' Due to Reasoning Speed and Understanding Gaps** — Despite full-duplex models, voice AI hasn't reached its 'ChatGPT moment' because models need faster reasoning and improved understanding of user intent and language nuances.
- **New AI Agents Enable Task Automation Directly Through Text Messaging Platforms** — A growing number of AI agents are now accessible directly through text messages, allowing users to automate tasks without needing dedicated apps.

---

## Decision Models Emerge as New AI Product Category with Multiple Vendor Launches

*Top story · AI Models · Latent · 2026-10-10*

![AINews TypeSafe/Jev at >$100M ARR, $7.5B valuation 3 weeks after launch](https://substackcdn.com/image/fetch/$s_!JxMf!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F__ss-rehost__tw-video-preview-13_2108594586310631424.jpg)

A new product category called 'decision models' has emerged, with multiple vendors releasing their own implementations. These models return typed answers, such as probabilities, selections from a list, or scores, in a single forward pass, rather than generating free text. Jev is cited as a reference point for these new models.

OpenAI launched its Decisions API with three request types (probability, pick from list, score), running on GPT-6 Luna, and claiming to be up to 10 times faster with a cost of $0.10 per million input tokens. Microsoft introduced Microsoft-Decision-1, positioned for LLM judges and screening scientific hypotheses. Perplexity's pplx-decider-v1.1-27b claims 94.5% accuracy on the Decision Bench across 1,071 cases at $0.017 per 1,000 decisions. Cloudflare's new clef-omni accepts audio, video, image, and text, with clef-flash now cheaper than Jev and overall about two times faster. Liquid d1 is now available on Vercel AI Gateway with vision support.

TypeSafe/Jev, a reference for this category, reached over $100 million ARR and a $7.5 billion valuation three weeks after its launch. An early evaluator noted that decision models still struggle with consistency and complex decisions.

**Key facts**

- TypeSafe/Jev: >$100M ARR, $7.5B valuation 3 weeks after launch
- OpenAI Decisions API: GPT-6 Luna, $0.10/M input tokens, up to 10x faster
- Perplexity pplx-decider-v1.1-27b: 94.5% accuracy on Decision Bench, $0.017 per 1K decisions
- Cloudflare clef: about 2x faster than Jev

**Why it matters:** Engineers should evaluate these new decision models as they offer a more structured and potentially faster way to integrate AI logic into applications, moving beyond free-form text generation. This could simplify integration for tasks requiring clear-cut answers, but engineers must also consider reported struggles with consistency and complex decisions.

> Decision models represent a significant evolution in AI, providing structured outputs for specific tasks and potentially streamlining AI integration.

[🔗 Read more at Latent](https://www.latent.space/p/ainews-typesafejev-at-100m-arr-75b)

---

## Local AI Becomes More Accessible and Appealing for Privacy-Conscious Users

*AI Agents & Tooling · The Verge · 2026-10-11*

![Antonio G. Di Benedetto](https://platform.theverge.com/wp-content/uploads/sites/2/chorus/author_profile_images/195792/ANTONIO_DI_BENEDETTO.0.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400)

Local AI is gaining traction as users become more hesitant to share personal data with cloud-based AI services. The ability to run powerful models locally offers enhanced privacy. New hardware, such as Apple's M5 Ultra Mac Studio and upcoming RTX Spark Windows machines with up to 128GB of RAM, is designed to support local and agentic AI.

An M5 Ultra Mac Studio with 256GB of unified memory can run large models, such as the 125-billion parameter Qwen 3.8 Flash Next model, which is around 105GB in size. Open-source agents like Hermes Agent are available for macOS, Windows, and Linux, allowing users to run local LLMs for free. Initial experiments show that setting up and controlling these local agents, even via a Telegram bot, can be straightforward, though the abundance of available models can be overwhelming.

**Key facts**

- Apple's M5 Ultra Mac Studio with 256GB unified memory.
- RTX Spark Windows machines with up to 128GB of RAM.
- Hermes Agent supports macOS, Windows, and Linux.
- Qwen 3.8 Flash Next: 125-billion parameters, ~105GB size.

**Why it matters:** Backend and systems engineers can now consider deploying and experimenting with powerful AI models locally for applications requiring high data privacy or custom, offline processing. This opens new architectural possibilities for sensitive data handling and edge AI, shifting some processing away from public cloud services.

> Local AI offers a privacy-centric alternative to cloud AI, supported by advancing hardware and accessible open-source tools.

[🔗 Read more at The Verge](https://www.theverge.com/ai-artificial-intelligence/1008484/learning-local-ai-hermes-qwen-model-mac-studio-testing-diary-progress)

---

## Amazon Follows Microsoft in Ending NDAs for Data Center Negotiations with Local Governments

*Cloud & Infrastructure · TechCrunch · 2026-10-11*

![Can the AI industry persuade data center opponents by getting rid of NDAs? - TechCrunch](https://techcrunch.com/wp-content/uploads/2026/09/9-DSCF1649.jpg?w=1024)

Amazon announced it will cease using nondisclosure agreements (NDAs) during negotiations with local governments concerning data centers. This move mirrors Microsoft's previous decision to eliminate NDAs in similar contexts. The announcement was part of a broader blog post by Amazon advocating for the community benefits of data centers.

Industry observers suggest that the backlash against AI and data centers is partly due to poor communication from the industry. Secrecy surrounding these projects, including details about who will use a data center or the specific terms of tax subsidies, has been identified as a long-standing issue that can lead to public distrust and allow companies to ask for more concessions. While some recent data center moratoriums are temporary, the industry appears concerned about public opposition.

> ⚠️ **Heads up:** The article questions whether this will actually have a positive effect, as people are "pretty entrenched right now."

**Key facts**

- Amazon ended NDAs in data center negotiations.
- Microsoft previously ended data center NDAs.

**Why it matters:** This change indicates a potential shift in how major cloud providers engage with communities for infrastructure development. Engineers involved in site reliability or capacity planning should be aware that future data center projects might face increased public scrutiny and potentially slower approval processes due to greater transparency.

> Increased transparency in data center negotiations could lead to more public involvement and potentially impact the timeline for new infrastructure builds.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/11/can-the-ai-industry-persuade-data-center-opponents-by-getting-rid-of-ndas/)

---

## Voice AI Lacks a 'ChatGPT Moment' Due to Reasoning Speed and Understanding Gaps

*AI Agents & Tooling · TechCrunch · 2026-10-11*

![PolyAI CTO Shawn Wen, Otter CMO Alex Gay, TechCrunch reporter Ivan Mehta](https://techcrunch.com/wp-content/uploads/2026/10/Screenshot-2026-10-10-at-2.42.28-PM.jpg?w=1024)

Voice AI has not yet had its 'ChatGPT moment,' according to industry executives, despite the development of full-duplex models that can speak and listen simultaneously. Shawn Wen, CTO of enterprise voice AI platform PolyAI, states that the next challenge is to make reasoning very fast so that conversations feel natural and models can fetch answers quickly. He emphasizes that AI agents in customer service must sound less robotic and instill confidence in users.

Alex Gay, CMO for Otter, a meeting notetaker, highlights the importance of speaker identification, intent capture, and integrating organizational knowledge for automation. He also noted that for digital twins representing people in meetings, the output voice needs to convey emotive expressions to facilitate debate and strategic discussions. Both Wen and Gay agree that Automatic Speech Recognition (ASR) models often miss important keywords, leading to issues in capturing context and impacting the accuracy of downstream actions like transcriptions and summaries. Improving ASR models and language understanding is critical for building user trust. Transparency in voice AI tools, such as notifying users when they are being recorded or interacting with an AI, is also deemed important.

**Key facts**

- PolyAI CTO Shawn Wen cited need for faster reasoning in voice AI.
- Otter CMO Alex Gay noted challenges in speaker identification and intent capture.
- ASR models often miss keywords, impacting context and transcription accuracy.

**Why it matters:** Engineers developing or integrating voice AI solutions should prioritize improving reasoning speed and ASR accuracy to overcome current limitations. Simply having full-duplex capabilities is insufficient; focus must be on natural interaction, context retention, and reliable transcription to build user trust and enable effective automation.

> Effective voice AI needs rapid reasoning, accurate understanding, and transparency to move beyond its current limitations and achieve widespread user adoption.

[🔗 Read more at TechCrunch](https://techcrunch.com/?p=3176054)

---

## New AI Agents Enable Task Automation Directly Through Text Messaging Platforms

*AI Agents & Tooling · TechCrunch · 2026-10-10*

![Discussion, chat and commenting concept.](https://techcrunch.com/wp-content/uploads/2017/12/gettyimages-673436934-e1790964942865.jpg?w=1024)

AI agents are increasingly integrating with text messaging platforms, enabling users to interact with them like ordinary contacts to complete various tasks. These agents can remember context, connect to existing apps and services, and perform actions such as scheduling appointments, organizing calendars, researching travel, sending emails, and setting reminders.

Notable examples include Instinct, which recently achieved a $10 billion valuation after a $1 billion funding round. Caddy operates within iMessage and RCS, identifying actionable information from phone content and connecting to calendars and conversations to add events, set reminders, and do research. Caddy has been in public beta since April 2026. Comma manages tasks across work and personal life, working through completion, checking its own work, and remaining accessible via Signal, Telegram, and WeChat. It maintains context across devices and conversations, provides daily briefings, and summarizes calls. Comma is open source and free to start. Fambot acts as a "chief of staff" for families, organizing school communications, activities, and meal planning across an app and SMS. It sends daily summaries and connects to services like Gmail, Google Calendar, Outlook, and WhatsApp. Fambot launched in beta in early September 2026 and is currently free, with future plans for a subscription model. Folk offers similar capabilities via iMessage, WhatsApp, and Telegram, including managing reminders, researching, and tracking flights.

**Key facts**

- Instinct: $10B valuation, $1B funding.
- Caddy: public beta since April 2026, works on iMessage and RCS.
- Comma: open source, free to start, supports Signal, Telegram, WeChat.
- Fambot: beta since early September 2026, connects to Gmail, Google Calendar, Outlook, WhatsApp.

**Why it matters:** Engineers developing user-facing automation or productivity tools should consider integrating with messaging platforms to leverage these new AI agent capabilities. This approach can reduce friction for users by meeting them where they already communicate, but requires careful design for privacy, security, and context management within chat interfaces.

> Messaging-based AI agents offer a convenient, app-free way to automate daily tasks, expanding the reach of AI-powered services.

[🔗 Read more at TechCrunch](https://techcrunch.com/2026/10/10/all-the-ai-agents-that-can-live-in-your-text-messages/)

---

## What to watch

- Will the increased transparency in data center negotiations lead to a measurable slowdown or redirection of major cloud infrastructure projects?
- How will the reported struggles of decision models with consistency and complex decisions be addressed by vendors, and will this impact their broader adoption?
- Can local AI's growing appeal for privacy-conscious users shift the balance of power from large cloud providers to more decentralized or edge-based AI deployments?

---

## Sources

- [Decision Models Emerge as New AI Product Category with Multiple Vendor Launches](https://www.latent.space/p/ainews-typesafejev-at-100m-arr-75b) — Latent, 2026-10-10
- [Local AI Becomes More Accessible and Appealing for Privacy-Conscious Users](https://www.theverge.com/ai-artificial-intelligence/1008484/learning-local-ai-hermes-qwen-model-mac-studio-testing-diary-progress) — The Verge, 2026-10-11
- [Amazon Follows Microsoft in Ending NDAs for Data Center Negotiations with Local Governments](https://techcrunch.com/2026/10/11/can-the-ai-industry-persuade-data-center-opponents-by-getting-rid-of-ndas/) — TechCrunch, 2026-10-11
- [Voice AI Lacks a 'ChatGPT Moment' Due to Reasoning Speed and Understanding Gaps](https://techcrunch.com/?p=3176054) — TechCrunch, 2026-10-11
- [New AI Agents Enable Task Automation Directly Through Text Messaging Platforms](https://techcrunch.com/2026/10/10/all-the-ai-agents-that-can-live-in-your-text-messages/) — TechCrunch, 2026-10-10
