---
title: Write-Ahead Logging (WAL)
description: Write-ahead logging (WAL) records all changes to a log file before applying them to the database, guaranteeing atomicity and durability by enabling crash recovery through log replay.
questions:
  - What is Write-Ahead Logging (WAL)?
  - When is Write-Ahead Logging (WAL) used?
  - What are the trade-offs of Write-Ahead Logging (WAL)?
---

## Definition

Write-ahead logging (WAL) is a technique where all modifications to data are written to a sequential log file before being applied to the actual data pages, ensuring that committed transactions can be recovered after a crash.

## How it works

When a transaction modifies data (INSERT, UPDATE, DELETE), the database doesn't immediately write the changed data pages to disk — that would require random I/O to scattered locations on disk. Instead, it appends a **log record** describing the change to the WAL file. The WAL is sequential (append-only), which is much faster than random writes.

The critical rule: **the WAL record for a change must be flushed to disk before the data page containing that change is written to disk.** This is the "write-ahead" guarantee. When a transaction commits, the database flushes the WAL up to the commit record to disk (fsync), then acknowledges the commit to the client. The actual data pages can be written lazily in the background.

If the database crashes after a commit but before the data pages are written, the WAL contains all the information needed to reconstruct the committed state. On restart, the recovery process **replays** the WAL from the last checkpoint, reapplying committed changes and rolling back uncommitted transactions.

PostgreSQL calls this "WAL" (files in `pg_wal/`). MySQL InnoDB calls it the "redo log." SQLite calls it "WAL mode." The concept is identical across all of them.

## When to use it

- **Relational databases** — PostgreSQL, MySQL, SQLite, Oracle all use WAL as the foundation of their ACID guarantees. Without WAL, atomicity and durability are impossible to guarantee efficiently.
- **Streaming replication** — PostgreSQL ships WAL records to replicas, which replay them to stay in sync. This is the basis of both streaming replication and logical replication.
- **Point-in-time recovery** — By archiving WAL files, a database can be restored to any point in time by replaying archived WAL records on top of a base backup.
- **Distributed databases** — CockroachDB and TiKV use WAL within each node's storage engine (RocksDB) to ensure local durability.

## Trade-offs

**Gains:** Enables ACID transactions — atomicity (uncommitted changes can be rolled back) and durability (committed changes survive crashes). Sequential writes to WAL are 10-100x faster than random writes to data pages. Enables replication and point-in-time recovery as side effects.

**Costs:** Write amplification — every change is written twice (once to WAL, once to data pages). WAL files consume disk space and must be archived or recycled. Fsync on every commit adds latency (~1-5ms for a single fsync). In high-throughput systems, WAL can become a bottleneck if the disk can't keep up with sequential write volume.

## Example

PostgreSQL WAL configuration:

```sql
-- Check current WAL location
SELECT pg_current_wal_lsn();
-- 0/16B7A40

-- WAL segment size (default 16MB per file)
SHOW wal_segment_size;
-- 16MB

-- Fsync behavior (critical for durability)
SHOW synchronous_commit;
-- on (default — fsync on every commit)

-- Set to 'off' for higher throughput at risk of losing
-- last few transactions on crash
-- ALTER SYSTEM SET synchronous_commit = off;
```

WAL files on disk:
```bash
ls -la /var/lib/postgresql/data/pg_wal/
# 0000000100000000000000A1  16MB
# 0000000100000000000000A2  16MB
# 0000000100000000000000A3  16MB
```

## Related terms

Checkpointing flushes dirty data pages to disk periodically, establishing a point from which WAL replay starts on recovery — reducing recovery time. ACID depends on WAL for its atomicity and durability guarantees. LSM-tree storage engines also use a WAL to ensure durability of in-memory writes before compaction.
