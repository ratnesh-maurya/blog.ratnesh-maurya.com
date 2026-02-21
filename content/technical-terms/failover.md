---
title: Failover
description: Failover is the automatic or manual switching of operations from a failed primary system to a secondary (standby) system.
questions:
  - What is Failover?
  - When is Failover used?
  - What are the trade-offs of Failover?
---

## Definition

Failover is the automatic or manual switching of operations from a failed primary system to a secondary (standby) system.

## Core concept

In high-availability setups, a standby server is kept updated and ready. If the primary fails (hardware/network crash), failover redirects traffic to the standby with minimal downtime.

## Use cases

Database clusters (e.g. two-node replication), application servers with hot standby. Ensures continuity of service.

## Trade-offs

There is typically a slight delay during failover. If not automatic, it requires detection logic and possibly manual intervention. Proper design is needed to avoid split-brain (see above).

## Example

Oracle Data Guard or AWS RDS Multi-AZ use automatic failover: the standby takes over transparently to clients when primary is unreachable[[\[36\]](https://www.ibm.com/docs/en/db2/11.5.x?topic=strategies-failover "High availability through failover")](https://www.ibm.com/docs/en/db2/11.5.x?topic=strategies-failover "High availability through failover").

## References

“Failover is the transfer of workload from a primary to a secondary system in the event of a primary failure”[[\[36\]](https://www.ibm.com/docs/en/db2/11.5.x?topic=strategies-failover "High availability through failover")](https://www.ibm.com/docs/en/db2/11.5.x?topic=strategies-failover "High availability through failover").
