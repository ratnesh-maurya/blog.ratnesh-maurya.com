---
title: Consistent Hashing
description: Consistent hashing is a technique to distribute keys across nodes so that minimal keys need to be moved when nodes join/leave.
questions:
  - What is Consistent Hashing?
  - When is Consistent Hashing used?
  - What are the trade-offs of Consistent Hashing?
---

## Definition

Consistent hashing is a technique to distribute keys across nodes so that minimal keys need to be moved when nodes join/leave.

## Core concept

Hash keys to a large ring; each node owns portions of the ring. When a node is added/removed, only its immediate neighbors’ keys are remapped.

## Use cases

Caching (Memcached) and sharding schemes. Helps rebalance gracefully.

## Trade-offs

Key ownership changes on membership change; may need virtual nodes to balance load.

## References

Web caching design.
