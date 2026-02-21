---
title: Two-Phase Commit (2PC)
description: Two-phase commit is an atomic commitment protocol for distributed transactions. A coordinator asks all involved nodes (participants) whether they can commit.…
questions:
  - What is Two-Phase Commit (2PC)?
  - When is Two-Phase Commit (2PC) used?
  - What are the trade-offs of Two-Phase Commit (2PC)?
---

## Definition

Two-phase commit is an atomic commitment protocol for distributed transactions. A coordinator asks all involved nodes (participants) whether they can commit. If all vote “yes,” the coordinator tells them to commit; if any vote “no,” the coordinator tells all to abort[[\[24\]](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia")](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia")[[\[25\]](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia")](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia").

## Core concept

1. Prepare phase: Coordinator asks all participants to prepare and vote (commit or abort). Each participant votes after doing local checks and logging decisions (but hasn’t committed yet).2. Commit phase: If all voted commit, coordinator broadcasts commit; else, broadcast abort. Participants then apply or roll back changes.

## Use cases

Ensures all-or-nothing across multiple resource managers (e.g. two DB shards) in one global transaction. Common in legacy distributed RDBMS.

## Trade-offs

2PC can block: if the coordinator or participants fail at the wrong time, other nodes may wait indefinitely (until manual intervention or timeouts). It also incurs overhead (log writes and two communication rounds). It provides atomicity but not progress under certain failures.

## Example

Coordinating a bank transfer across two banks: each bank votes on whether it can process its side. Only if both agree, both commit.

## References

“2PC is a distributed algorithm that coordinates processes in a distributed atomic transaction on whether to commit or abort”[[\[24\]](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia")](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia") and description of phases[[\[25\]](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia")](https://en.wikipedia.org/wiki/Two-phase_commit_protocol "Two-phase commit protocol - Wikipedia").
