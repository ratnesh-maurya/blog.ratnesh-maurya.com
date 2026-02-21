---
title: Multi-Leader Replication
description: Multi-leader (also called multi-master) replication allows multiple nodes (leaders) to accept writes. Data is replicated between leaders to keep them in…
questions:
  - What is Multi-Leader Replication?
  - When is Multi-Leader Replication used?
  - What are the trade-offs of Multi-Leader Replication?
---

## Definition

Multi-leader (also called multi-master) replication allows multiple nodes (leaders) to accept writes. Data is replicated between leaders to keep them in sync[[\[11\]](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…")](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…").

## Core concept

Each leader processes write operations locally. Changes are propagated to the other leaders (e.g. via an anti-entropy process or write logs). This increases write throughput and availability (writes can go to any leader).

## Use cases

Systems needing high write availability across regions (e.g. geo-distributed systems) or no single point of failure. For example, some Cassandra or MongoDB setups support multi-leader writes.

## Trade-offs

Concurrency control becomes harder: if two leaders write conflicting changes to the same record, conflict resolution logic is needed. This often involves vector clocks, last-write-wins policies, or application-level reconciliation. Latency can also increase due to cross-node sync.

## Example

CouchDB supports multi-master replication; writes on any node eventually replicate. The system must merge conflicts (CouchDB keeps multiple revisions of a document). BlueGrid notes: “Multi-master replication: all nodes accept writes. Improves availability/throughput but requires conflict detection/resolution”[[\[11\]](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…")](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…").

## References

Multi-leader description[[\[11\]](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…")](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…").
