---
title: Backpressure
description: Backpressure is a technique to prevent system overload by signaling to upstream components to slow down when downstream is overwhelmed.
questions:
  - What is Backpressure?
  - When is Backpressure used?
  - What are the trade-offs of Backpressure?
---

## Definition

Backpressure is a technique to prevent system overload by signaling to upstream components to slow down when downstream is overwhelmed.

## Core concept

In streaming or concurrent systems, if a consumer can’t keep up, it applies backpressure so producers send data slower or buffer. This avoids unchecked queues and resource exhaustion.

## Use cases

Message brokers (Kafka has backpressure in some flows), streaming frameworks (Reactive Streams). In microservices, one service can return HTTP 503 or throttle signals to slow clients.

## Trade-offs

Adds flow control complexity. If not designed well, backpressure can lead to cascading slowdowns.

## Example

A web API might implement a rate-limit header or connection pool limits to apply backpressure.

## References

Theory of reactive systems (no direct cite).
