---
title: Checkpointing
description: 'Checkpointing is the process of flushing all committed changes from the write-ahead log (WAL) to the main database storage, and then clearing the…'
questions:
  - What is Checkpointing?
  - When is Checkpointing used?
  - What are the trade-offs of Checkpointing?
---

## Definition

Checkpointing is the process of flushing all committed changes from the write-ahead log (WAL) to the main database storage, and then clearing the log.

## Core concept

Without checkpoints, the log would grow indefinitely. Periodically (or when the log reaches a threshold), the DB writes all in-memory changes to disk and marks a checkpoint. This means everything before that point is safely on disk, so the log can be truncated.

## Use cases

All WAL-based systems do checkpointing (Postgres, SQLite, etc.). Checkpoints shorten recovery time.

## Trade-offs

Checkpoint operations can cause write bursts and latency when flushing pages. Tuning checkpoint frequency balances performance vs recovery time.

## Example

PostgreSQL’s CHECKPOINT writes all dirty pages to disk. After checkpoint, WAL segments before that point can be archived or deleted.

## References

“After a certain number of operations, perform a checkpoint: write all changes in the WAL to the database and clear the log”[[\[28\]](https://en.wikipedia.org/wiki/Write-ahead_logging "Write-ahead logging - Wikipedia")](https://en.wikipedia.org/wiki/Write-ahead_logging "Write-ahead logging - Wikipedia").
