---
title: Vertical Scaling
description: 'Vertical scaling (scale-up) is increasing the resources (CPU, RAM, disk) of a single machine.'
questions:
  - What is Vertical Scaling?
  - When is Vertical Scaling used?
  - What are the trade-offs of Vertical Scaling?
---

## Definition

Vertical scaling (scale-up) is increasing the resources (CPU, RAM, disk) of a single machine[[\[39\]](https://www.freecodecamp.org/news/horizontal-vs-vertical-scaling-in-database/ "Horizontal vs. Vertical Scaling – How to Scale a Dat…")](https://www.freecodecamp.org/news/horizontal-vs-vertical-scaling-in-database/ "Horizontal vs. Vertical Scaling – How to Scale a Dat…").

## Core concept

A stronger server can handle more load by itself. It is often easier to implement (no distributed changes) but has practical limits (max hardware).

## Use cases

Single-server databases or apps where distributing is difficult. If ease of development and consistency is critical, a beefier server might be used.

## Trade-offs

There’s a ceiling: you can only add so much memory/CPU. One big node is a single point of failure (no HA). Also can be expensive.

## Example

Switching from a 4-core to 16-core CPU machine for the DB.

## References

“Vertical scaling increases capacity of a single machine by adding resources”[[\[39\]](https://www.freecodecamp.org/news/horizontal-vs-vertical-scaling-in-database/ "Horizontal vs. Vertical Scaling – How to Scale a Dat…")](https://www.freecodecamp.org/news/horizontal-vs-vertical-scaling-in-database/ "Horizontal vs. Vertical Scaling – How to Scale a Dat…").
