---
title: Logical vs Physical Replication
description: Logical replication streams row-level change events (inserts, updates, deletes) while physical replication copies raw WAL bytes, producing a byte-identical standby.
questions:
  - What is Logical vs Physical Replication?
  - When is Logical vs Physical Replication used?
  - What are the trade-offs of Logical vs Physical Replication?
---

## Definition

Physical replication copies the raw write-ahead log (WAL) at the byte level to create an identical standby, while logical replication streams decoded row-level changes that can be selectively applied to subscribers with potentially different schemas.

## How it works

**Physical replication** ships WAL segments (or streams them continuously) from the primary to a standby. The standby replays these bytes exactly as they were written—same data files, same indexes, same internal page layout. The result is a byte-for-byte clone. In PostgreSQL, this is `pg_basebackup` + streaming replication. In MySQL, it's the native binary log replication in row-based mode.

The standby can serve read queries (a "hot standby") but cannot accept writes or have a different schema. It runs the exact same major version of the database software. Physical replication is fast because WAL replay is sequential I/O with minimal parsing.

**Logical replication** decodes the WAL into structured change events: "INSERT into table `orders` with values (id=5, amount=99.50)" rather than "write these bytes at page offset 0x3F20." PostgreSQL's logical replication uses publications and subscriptions. The publisher decodes its WAL through an output plugin (like `pgoutput`), and the subscriber applies the changes as SQL-level operations.

Because logical replication works at the row level, the subscriber can have additional indexes, different column defaults, or even additional columns not present on the publisher. Tables can be selectively replicated—publish only the `orders` and `customers` tables, not the entire database.

## When to use it

**Physical replication**:
- High-availability failover: a hot standby that promotes to primary within seconds when the primary fails.
- Read replicas serving the same workload as the primary (same schema, same version).
- Disaster recovery to a different data center.

**Logical replication**:
- Replicating a subset of tables to a reporting database with additional analytical indexes.
- Online major version upgrades: replicate from PostgreSQL 14 to PostgreSQL 16, then switch traffic.
- Multi-master topologies: BDR (Bi-Directional Replication) for PostgreSQL uses logical replication.
- Cross-platform replication: streaming changes from PostgreSQL to a different system entirely (which is essentially CDC).

## Trade-offs

**Physical replication gains**: Lower overhead—the standby replays binary WAL with no decoding step. No row-level filtering or transformation. Guaranteed identical copy. Sub-second replication lag under normal load.

**Physical replication costs**: Standby must run the same major version and architecture. Cannot replicate selectively. Standby is read-only. Major version upgrades require downtime or a different approach.

**Logical replication gains**: Schema flexibility. Selective table replication. Cross-version compatibility. Enables zero-downtime upgrades. Subscriber can have its own indexes and even accept direct writes.

**Logical replication costs**: Higher CPU on the publisher (WAL decoding). Replication lag is typically higher (10ms–1s vs sub-ms). Large transactions (e.g., `UPDATE 10M rows`) can cause subscriber lag spikes. Sequences, DDL changes, and large objects are not automatically replicated—you must handle them separately.

## Example

Setting up both in PostgreSQL:

```sql
-- Physical replication: on the standby
-- (after pg_basebackup)
-- postgresql.conf on standby:
-- primary_conninfo = 'host=primary.db port=5432 user=replicator'
-- hot_standby = on

-- Logical replication: on the publisher
CREATE PUBLICATION orders_pub FOR TABLE orders, customers;

-- On the subscriber (can be a different PG version)
CREATE SUBSCRIPTION orders_sub
  CONNECTION 'host=publisher.db port=5432 dbname=app user=replicator'
  PUBLICATION orders_pub;

-- Verify replication status
SELECT * FROM pg_stat_subscription;
```

## Related terms

Logical replication is the database-native equivalent of CDC (Change Data Capture)—both decode WAL into structured events, but CDC targets non-database consumers like Kafka. Physical replication produces replicas suited for federation architectures where standbys serve different read workloads.
