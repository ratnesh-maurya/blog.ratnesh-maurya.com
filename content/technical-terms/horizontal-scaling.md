---
title: Horizontal Scaling
description: Horizontal scaling (scale-out) means adding more machines (nodes) to a system to handle increased load.
questions:
  - What is Horizontal Scaling?
  - When is Horizontal Scaling used?
  - What are the trade-offs of Horizontal Scaling?
---

## Definition

Horizontal scaling (scale-out) means adding more machines (nodes) to a system to handle increased load.

## Core concept

Instead of upgrading one server, you add parallel machines. The workload and data are distributed among them. More nodes = more capacity linearly.

## Use cases

Web servers and databases that partition (shard) data can scale horizontally almost indefinitely. Cloud-native applications leverage elastic horizontal scaling.

## Trade-offs

Requires designing system to distribute data/requests (sharding, load balancing). It adds inter-node communication and consistency challenges.

## Example

A MongoDB cluster with multiple shards can add new shard servers to store more data and serve queries.

## References

Vertical vs horizontal: “Horizontal scaling – adding new nodes to manage the distributed workload”[[\[38\]](https://www.freecodecamp.org/news/horizontal-vs-vertical-scaling-in-database/ "Horizontal vs. Vertical Scaling – How to Scale a Dat…")](https://www.freecodecamp.org/news/horizontal-vs-vertical-scaling-in-database/ "Horizontal vs. Vertical Scaling – How to Scale a Dat…").
