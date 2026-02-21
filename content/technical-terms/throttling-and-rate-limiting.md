---
title: Throttling and Rate Limiting
description: Throttling controls resource usage by limiting the rate of requests. Rate limiting enforces a maximum number of requests in a time window.
questions:
  - What is Throttling and Rate Limiting?
  - When is Throttling and Rate Limiting used?
  - What are the trade-offs of Throttling and Rate Limiting?
---

## Definition

Throttling controls resource usage by limiting the rate of requests. Rate limiting enforces a maximum number of requests in a time window.

## Core concept

Prevents overload by rejecting or slowing requests above threshold. Often implemented with token buckets or leaky buckets.

## Use cases

APIs often limit clients (e.g., 100 requests/min). Internally, DB connections or job queues may throttle producers.

## Trade-offs

Can degrade user experience if limits are hit, but protects system stability.

## Example

A Redis token bucket algorithm grants a client at most 10 requests per second; extra requests get 429 HTTP responses.

## References

Common API management practice.
