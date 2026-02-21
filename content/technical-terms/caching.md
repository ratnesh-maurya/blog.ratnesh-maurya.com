---
title: Caching
description: Caching stores frequently accessed data in a faster storage (often memory) to speed up retrieval.
questions:
  - What is Caching?
  - When is Caching used?
  - What are the trade-offs of Caching?
---

## Definition

Caching stores frequently accessed data in a faster storage (often memory) to speed up retrieval.

## Core concept

Instead of querying the database each time, an application checks the cache first. If the data (e.g. query result, object) is cached (cache hit), it returns quickly; if not, it fetches from the DB (cache miss) and often populates the cache.

## Use cases

Web apps often cache expensive or frequent reads (product info, session data). Content Delivery Networks cache static content at edge. Databases use in-memory caches (Redis, Memcached) for hot data.

## Trade-offs

Cache can become stale (data may change in DB but not immediately in cache). Developers must manage cache invalidation carefully. Also adds complexity and memory cost, but greatly reduces DB load and latency.

## Example

A Redis cache storing results of SELECT price FROM products WHERE id=42;. App checks Redis key product:42; if found, skip DB.

## References

“Database caching is used for frequent calls to data that doesn’t change often… helps applications load faster by reducing data retrieval latency”[[\[42\]](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-caching "What Is Caching? | Microsoft Azure")](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-caching "What Is Caching? | Microsoft Azure").
