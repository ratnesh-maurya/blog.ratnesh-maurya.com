---
title: Strong Consistency
description: Strong consistency means every read receives the most recent write (or an error). All nodes see the same data at the same time.
questions:
  - What is Strong Consistency?
  - When is Strong Consistency used?
  - What are the trade-offs of Strong Consistency?
---

## Definition

Strong consistency means every read receives the most recent write (or an error). All nodes see the same data at the same time[[\[20\]](https://www.geeksforgeeks.org/system-design/strong-consistency-in-system-design/ "Strong Consistency in System Design - GeeksforGeeks")](https://www.geeksforgeeks.org/system-design/strong-consistency-in-system-design/ "Strong Consistency in System Design - GeeksforGeeks").

## Core concept

The system behaves as if there is a single copy of the data. When a client writes new data, subsequent reads (anywhere in the system) immediately reflect that write. This is achieved by coordinating reads/writes (e.g., through consensus or locking).

## Use cases

When accurate, up-to-date data is critical (e.g., bank account balance). Many traditional RDBMS and synchronous-replication systems provide strong consistency.

## Trade-offs

Achieving strong consistency requires synchronizing across nodes, which can increase latency and reduce availability during partitions (CP in CAP). Systems may block writes or reads until all nodes confirm the update.

## Example

In a strongly consistent distributed KV store, once a write completes, any subsequent read (even from other node) sees the updated value.

## References

G4G: “Strong consistency ensures all users and nodes see the same data immediately after it is updated… every read returns the most recent write”[[\[20\]](https://www.geeksforgeeks.org/system-design/strong-consistency-in-system-design/ "Strong Consistency in System Design - GeeksforGeeks")](https://www.geeksforgeeks.org/system-design/strong-consistency-in-system-design/ "Strong Consistency in System Design - GeeksforGeeks").
