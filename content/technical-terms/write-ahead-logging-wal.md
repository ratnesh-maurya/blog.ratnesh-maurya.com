---
title: Write-Ahead Logging (WAL)
description: Write-Ahead Logging is a technique where changes are first recorded in a log before being applied to the database files. It ensures atomicity and…
questions:
  - What is Write-Ahead Logging (WAL)?
  - When is Write-Ahead Logging (WAL) used?
  - What are the trade-offs of Write-Ahead Logging (WAL)?
---

## Definition

Write-Ahead Logging is a technique where changes are first recorded in a log before being applied to the database files[[\[27\]](https://en.wikipedia.org/wiki/Write-ahead_logging "Write-ahead logging - Wikipedia")](https://en.wikipedia.org/wiki/Write-ahead_logging "Write-ahead logging - Wikipedia"). It ensures atomicity and durability.

## Core concept

Before modifying any database page, the DB writes a log record describing the change to a durable log on disk. If a crash occurs, the log can be replayed to redo (or undo) changes. Only after the log write completes is the change applied in memory. This way, no committed change is lost.

## Use cases

All major RDBMS use WAL. It is fundamental to transaction durability and crash recovery.

## Trade-offs

Writing to the log introduces overhead (fsync costs), but it’s essential for safe commits.

## Example

In PostgreSQL (and SQLite, SQL Server, etc.), an INSERT will generate a log entry in the WAL file before the row is inserted in the data file. Only once the log is on disk does the transaction commit.

## References

“WAL is a family of techniques for atomicity and durability. A write-ahead log is an append-only log on stable storage: changes are first recorded in the log, before writing to the database”[[\[27\]](https://en.wikipedia.org/wiki/Write-ahead_logging "Write-ahead logging - Wikipedia")](https://en.wikipedia.org/wiki/Write-ahead_logging "Write-ahead logging - Wikipedia").
