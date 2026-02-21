---
title: Three-Phase Commit (3PC)
description: Three-phase commit is an extension of 2PC designed to reduce blocking. It adds a “pre-commit” phase so participants can make a safe decision without indefinite…
questions:
  - What is Three-Phase Commit (3PC)?
  - When is Three-Phase Commit (3PC) used?
  - What are the trade-offs of Three-Phase Commit (3PC)?
---

## Definition

Three-phase commit is an extension of 2PC designed to reduce blocking. It adds a “pre-commit” phase so participants can make a safe decision without indefinite blocking if the coordinator fails[[\[26\]](https://en.wikipedia.org/wiki/Three-phase_commit_protocol "Three-phase commit protocol - Wikipedia")](https://en.wikipedia.org/wiki/Three-phase_commit_protocol "Three-phase commit protocol - Wikipedia").

## Core concept

3PC introduces three stages: canCommit? (like prepare), preCommit, and doCommit/Abort. After all vote yes in phase 1, the coordinator sends a preCommit message (indicating readiness). Once participants ack, the coordinator finally sends commit. This way, if the coordinator crashes after preCommit but before doCommit, participants know everyone was ready and can elect a new coordinator to finish commit.

## Use cases

More theoretical than widely used; it aims to make distributed commits non-blocking even on coordinator failure.

## Trade-offs

Still not entirely failure-proof (it assumes timely failures and non-crash; truly asynchronous networks can break it). It adds complexity and extra messages vs 2PC.

## Example

Not commonly implemented in off-the-shelf databases, but a system using 3PC would avoid having participants wait forever if the coordinator dies after saying “pre-commit.”

## References

“3PC ensures all nodes agree to commit/abort; it improves on 2PC by eliminating indefinite blocking via a prepared to commit state”[[\[26\]](https://en.wikipedia.org/wiki/Three-phase_commit_protocol "Three-phase commit protocol - Wikipedia")](https://en.wikipedia.org/wiki/Three-phase_commit_protocol "Three-phase commit protocol - Wikipedia").
