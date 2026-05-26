---
title: "AI Agents Under Siege: Security Flaws, Soaring Valuations, and the Ethics of Autonomous Warfare"
description: "Catch up on the latest AI news: a critical vulnerability impacts millions of AI agents, OpenRouter achieves a $1.3B valuation, and the debate over AI warfare intensifies as humans train robots for household tasks."
date: "2026-05-27"
tags: ["AI agents", "cybersecurity", "Starlette vulnerability", "OpenRouter", "AI investment", "autonomous warfare", "Project Maven", "humanoid robots", "egocentric data", "AI ethics"]
source: "tavily"
---


The world of AI is buzzing today with a mix of groundbreaking advancements, significant security concerns, and ongoing ethical debates. From a critical vulnerability threatening millions of AI agents to a rapid increase in valuation for an AI gateway, the landscape continues to evolve at breakneck speed. Meanwhile, discussions around AI in warfare become more urgent, even as humans are literally training robots to take over household chores.

## TL;DR
*   A critical "BadHost" vulnerability in the **Starlette** open-source package imperils millions of **AI agents**, allowing potential data breaches.
*   **OpenRouter**, an **LLM** gateway, more than **doubled its valuation to $1.3 billion** in a year, backed by **CapitalG**.
*   **AI warfare** is already a reality, with initiatives like **Project Maven** demonstrating the US military's use of autonomous systems since **2017**.
*   The rapid rise of **AI agents** like **Anthropic's Claude Code** and **OpenClaw** has ushered in a new era of software development.
*   Gig workers are increasingly recording themselves performing chores to generate "egocentric data" for training **humanoid robots**, raising questions about human labor and automation.

---

## Millions of AI agents imperiled by critical vulnerability in open source package - Ars Technica

![Millions of AI agents imperiled by critical vulnerability in open source package - Ars Technica](https://cdn.arstechnica.net/wp-content/uploads/2026/02/gatekeeping-ai-agents-640x360.jpg)

A severe vulnerability, dubbed "**BadHost**" and tracked as **CVE-2026-48710**, has been discovered in **Starlette**, a widely used open-source framework. This flaw poses a critical risk to millions of **AI agents** and tools globally, potentially allowing hackers to infiltrate servers, steal sensitive data, and acquire credentials for third-party accounts. **Starlette**, an implementation of the **ASGI** (asynchronous server gateway interface), boasts an astounding **325 million downloads per week**, making the potential impact widespread, as thousands of other open-source projects rely on it.

Exploiting **BadHost** is described as "trivial" and affects most systems not protected by a properly configured firewall. The vulnerability targets **ASGI** and **Starlette's** access to **MCP** (model context protocol) servers, which store valuable credentials for AI agents to interact with external systems like user databases, email, and calendar accounts. Frameworks built on **Starlette**, including **FastAPI**, **vLLM**, and **LiteLLM**, are also vulnerable. Users are urged to update to **Starlette versions 1.0.1** or later, which was released last Friday, to mitigate this significant security threat.

> A single character injected into the HTTP Host header bypasses path-based authentication.

[🔗 Read more](https://arstechnica.com/information-technology/2026/05/millions-of-ai-agents-imperiled-by-critical-vulnerability-in-open-source-package/)

---

## OpenRouter more than doubles valuation to $1.3B in a year - TechCrunch

![paper plane made from a ten-dollar bill 'flying' with contrails](https://techcrunch.com/wp-content/uploads/2026/02/GettyImages-157503102.jpg?w=1024)

**OpenRouter**, the unified gateway and API for **Large Language Models (LLMs)**, has seen its valuation soar to approximately **$1.3 billion** post-money, more than doubling its estimated **$547 million** valuation from just a year ago. This significant leap follows a successful **$113 million Series B** funding round led by **CapitalG**, the growth venture fund of **Google** parent company **Alphabet**. The company, founded in **2023**, previously raised **$40 million** in Series A funding in June **2025**, with participation from prominent firms like **Andreessen Horowitz**, **Menlo Ventures**, and **Sequoia**.

The rapid increase in **OpenRouter's** popularity and valuation reflects a shift in the AI industry from training to inference and, more recently, to **AI agents**. As an **AI gateway**, **OpenRouter** plays a crucial role in helping developers connect to various **LLMs** and other **AI services**, streamlining the often-complex integration process. The company's ability to adapt and grow with the evolving demands of AI development has clearly resonated with investors.

> The gateway helps.

[🔗 Read more](https://techcrunch.com/2026/05/26/openrouter-more-than-doubles-valuation-to-1-3b-in-a-year/)

---

## AI warfare is already here - The Verge

![268475_AI’s_red_line_JMac2](https://platform.theverge.com/wp-content/uploads/sites/2/2026/05/268475_AIs_red_line_JMac2.png?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400)

The discussion around lethal autonomous weapons, once a hypothetical concern, has become a stark reality. As early as **November 2017**, at the Convention on Certain Conventional Weapons in Geneva, experts recognized that the future of AI warfare was much closer than anticipated. This realization was spurred by a short film called *Slaughterbots* and the ongoing **US Department of Defense** initiative, **Project Maven**, which uses **AI** to analyze drone surveillance footage. **Google** was a key tech company involved in **Maven** by late **2017**.

Branka Marijan, a senior researcher at **Project Ploughshares**, noted that the systems discussed weren't futuristic but *existing platforms* with varying degrees of autonomy, capable of selecting and engaging targets based on sensor data. This marked a shift from human-directed drone warfare to the prospect of humans being entirely removed from the decision-making loop. The **US military** has supported **AI development** for decades, and this has fundamentally transformed modern warfare, blurring the lines between human and machine combat decisions.

> The systems we were talking about were not futuristic. They were existing platforms that had degrees of autonomy in them, or the capability to select and engage targets based on sensor data and sensor input.

[🔗 Read more](https://www.theverge.com/ai-artificial-intelligence/937028/military-ai-warfare-red-lines)

---

## AI Agents Plunged the Tech World Into Chaos. Here’s Exactly How That Happened - WIRED

![AI Agents Plunged the Tech World Into Chaos. Here’s Exactly How That Happened - WIRED](https://media.wired.com/photos/69fdc07896ebc549bb094216/191:100/w_1280,c_limit/agents_unleashed_web-1x1.jpg)

The long-anticipated age of **AI agents** has dramatically arrived, fundamentally transforming the tech world. This shift is largely attributed to two key breakthroughs: **Anthropic's** paradigm-busting **Claude Code** and the open-source tool **OpenClaw**. In **August 2025**, Peter Steinberger, a self-proclaimed "Claudeholic," was already dedicating significant time to coding tools like **Claude Code**. The release of **Opus 4.5**, a new version of **Claude Code**, further accelerated this trend by enabling more complex programming tasks, extended memory, and the ability to manage a team of **AI subagents**.

**Anthropic** claims that **Opus 4.5** scored higher than any human candidate on their "notoriously difficult" take-home engineering exam, raising significant questions about the future of engineering as a profession. Following this, in **November 2025**, Steinberger launched **OpenClaw**, a tool that simplifies the creation of personal **AI agents**. These agents can autonomously access user data, apps, and even credit cards to perform tasks, demonstrating a persistent, Terminator-like capability. **OpenClaw** quickly gained immense popularity, racking up over **100,000 GitHub stars** in less than two weeks and reaching **366,000 stars** by early May.

> It feels like becoming Spider-Man.

[🔗 Read more](https://www.wired.com/story/how-ai-agents-plunged-tech-world-into-chaos/)

---

## I Spent a Week Recording Myself Doing Chores for Money. Who's the Robot Now? - WIRED

![Photo Illustration of Robots watching People do ordinary tasks](https://media.wired.com/photos/6a077b4e67132e88ffa730a4/master/w_2560%2Cc_limit/AIPanic_TrainingRobots_v2.1.jpg)

The increasing demand for **humanoid robots** capable of assisting with household tasks has given rise to a new form of gig work: recording oneself performing chores to generate "egocentric data." A **WIRED** reporter recently spent a week capturing first-person videos of mundane activities like slicing cucumbers and folding laundry using an **iPhone** strapped to their forehead. This highly specific footage, which includes thousands of close-ups of hands performing precise actions, is crucial for fine-tuning robots to develop essential fine motor skills and excel at real-world tasks.

**Avi Patel**, the **22-year-old** founder of data collection marketplace **Kled**, envisions a future where "every person on the planet" records themselves doing dishes to create robots that eliminate the need for such chores. This industry is booming, with investors estimating that leading companies will purchase hundreds of millions of hours of such data from third-party suppliers in the coming years. Countries like **India**, where self-employed workers average around **$125 a month**, are already seeing these first-person video gigs offer comparable rates. As interest grows, companies like **DoorDash**, with its new **Tasks app**, are expanding data collection efforts to the **U.S.**, fundamentally reshaping the gig economy and the relationship between human labor and **AI** development.

> I want every person on the planet to be recording themselves doing the dishes. That's going to make a robot so that you never have to do the dishes ever again.

[🔗 Read more](https://www.wired.com/story/household-chores-training-robots/)
