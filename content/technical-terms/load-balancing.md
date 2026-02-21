---
title: Load Balancing
description: Load balancing is distributing incoming requests or tasks across multiple servers/resources to optimize performance and avoid overload.
questions:
  - What is Load Balancing?
  - When is Load Balancing used?
  - What are the trade-offs of Load Balancing?
---

## Definition

Load balancing is distributing incoming requests or tasks across multiple servers/resources to optimize performance and avoid overload.

## Core concept

A load balancer (software/hardware) sits in front of servers and routes each new request based on an algorithm (round-robin, least-connections, etc.). This ensures no single server gets overwhelmed while others idle.

## Use cases

Web servers behind an HA proxy; database replicas behind a proxy; microservices with many instances.

## Trade-offs

Load balancers can become bottlenecks or single points of failure (mitigated by redundancy). Poor algorithms may lead to uneven distribution.

## Example

An HAProxy or AWS ELB sends each client HTTP request to the least-loaded web server.

## References

“Load balancing is the process of distributing a set of tasks over a set of resources… making processing more efficient”[[\[40\]](https://en.wikipedia.org/wiki/Load_balancing_(computing "Load balancing (computing) - Wikipedia").
