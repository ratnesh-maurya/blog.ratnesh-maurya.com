---
title: Circuit Breaker
description: 'A circuit breaker is a pattern where a system stops sending requests to a failing service for a period, allowing it to recover and preventing resource…'
questions:
  - What is Circuit Breaker?
  - When is Circuit Breaker used?
  - What are the trade-offs of Circuit Breaker?
---

## Definition

A circuit breaker is a pattern where a system stops sending requests to a failing service for a period, allowing it to recover and preventing resource exhaustion.

## Core concept

Modeled on electrical circuit breakers: if the number of recent failures (exceptions, timeouts) exceeds a threshold, the circuit opens, and calls fail immediately for a timeout period. After a while, a “half-open” trial allows some calls to test if recovery succeeded.

## Use cases

Microservice architectures to prevent cascading failures. If Service B is down, Service A’s circuit breaker trips so that A doesn’t keep sending requests (which would time out), thus freeing threads for other tasks.

## Trade-offs

Adds complexity; need tuning of thresholds and reset times.

## Example

Netflix’s Hystrix library implements this: after e.g. 5 consecutive request failures, further calls fail fast.

## References

Microservices design pattern (no direct cite in sources, but known concept).
