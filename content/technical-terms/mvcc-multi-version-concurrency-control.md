---
title: MVCC (Multi-Version Concurrency Control)
description: 'MVCC is a concurrency control method that keeps multiple versions of data records to allow non-blocking reads. Instead of locking, transactions see the…'
questions:
  - What is MVCC (Multi-Version Concurrency Control)?
  - When is MVCC (Multi-Version Concurrency Control) used?
  - What are the trade-offs of MVCC (Multi-Version Concurrency Control)?
---

## Definition

MVCC is a concurrency control method that keeps multiple versions of data records to allow non-blocking reads[[\[22\]](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia")](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia")[[\[23\]](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia")](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia"). Instead of locking, transactions see the version of data that was current at their start.

## Core concept

Each update creates a new version; the old version isn’t overwritten immediately. Each transaction has a timestamp or ID and sees only versions committed before its start. Thus readers don’t block writers and vice versa.

## Use cases

MVCC is used by many databases (PostgreSQL, Oracle, SQL Server Snapshot, CouchDB). It provides good performance for mixed read/write workloads.

## Trade-offs

Requires storing multiple versions (increased storage, need for vacuum/cleanup). Writers still conflict on the same row (only one can commit). Requires version cleanup/gc (or compaction in some systems).

## Example

Transaction T1 reads row X (version 1). T2 updates X to version 2 but hasn’t committed. T1 still sees version 1 throughout. After commit, new reads see version 2.

## References

“MVCC aims at solving concurrency by keeping multiple copies… Each user sees a snapshot; changes by a writer are not visible until commit”[[\[22\]](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia")](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia")[[\[23\]](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia")](https://en.wikipedia.org/wiki/Multiversion_concurrency_control "Multiversion concurrency control - Wikipedia").
