---
title: Hash Partitioning
description: Hash partitioning distributes data across partitions by applying a hash function to a key, producing uniform distribution for point lookups.
questions:
  - What is Hash Partitioning?
  - When is Hash Partitioning used?
  - What are the trade-offs of Hash Partitioning?
---

## Definition

Hash partitioning assigns each row to a partition by computing a hash of the partition key and mapping the hash value to one of N partitions.

## How it works

The partition assignment follows a simple formula: `partition = hash(key) % num_partitions`. If you have 16 partitions and the hash of a user ID produces `283749`, the row goes to partition `283749 % 16 = 5`. A good hash function (MurmurHash3, xxHash, CityHash) distributes keys uniformly across the output space, so partitions end up with roughly equal amounts of data regardless of key distribution patterns.

The problem with naive modular hashing is resizing. If you add a node and go from 16 to 17 partitions, almost every key maps to a different partition, forcing a near-total data reshuffle. **Consistent hashing** solves this. Nodes are placed on a hash ring, and each key maps to the next node clockwise on the ring. Adding a node only affects keys in the arc between the new node and its predecessor—roughly `1/N` of the total data moves. Cassandra, DynamoDB, and Riak all use consistent hashing with virtual nodes (vnodes). Each physical node owns multiple positions on the ring (128–256 vnodes by default in Cassandra), which smooths out load imbalances.

PostgreSQL supports hash partitioning natively since version 11. The planner uses the partition hash to route queries with exact-match `WHERE` clauses directly to the correct partition, skipping the others entirely. But unlike range partitioning, a `WHERE key > 100` query must scan all partitions because the hash destroys key ordering.

## When to use it

- User-facing lookups by primary key: `SELECT * FROM users WHERE user_id = 'u_8f3a2b'` hits exactly one partition.
- Cassandra partition keys: `PRIMARY KEY ((user_id), created_at)` hashes `user_id` to distribute users across the cluster, while `created_at` provides ordering within each partition.
- Distributed caching: Redis Cluster hashes keys into 16,384 hash slots. Each node owns a subset of slots, and `MOVED` redirections handle misrouted commands.
- Sharding a multi-tenant SaaS database by `tenant_id` to prevent one large tenant from overwhelming a single shard (assuming tenant sizes are comparable).

## Trade-offs

**Gains:** Uniform data distribution eliminates hot spots caused by skewed key values (sequential IDs, alphabetical names). Point queries are O(1) partition lookups. Scales horizontally—adding nodes redistributes a predictable fraction of data with consistent hashing.

**Costs:** Range queries become scatter-gather operations. `SELECT * FROM orders WHERE order_date BETWEEN '2025-01-01' AND '2025-03-31'` must query all partitions and merge results, negating the partitioning benefit. Without consistent hashing, resizing is expensive. Even with consistent hashing, "hot keys" still exist—a single viral user in a social app generates disproportionate traffic on one partition regardless of how evenly the hash distributes other keys. And hash-based systems are harder to debug: you cannot predict which partition holds a given key without computing the hash.

## Example

Hash partitioning in PostgreSQL:

```sql
CREATE TABLE sessions (
    session_id TEXT NOT NULL,
    user_id    TEXT,
    data       JSONB,
    created_at TIMESTAMPTZ
) PARTITION BY HASH (session_id);

CREATE TABLE sessions_p0 PARTITION OF sessions FOR VALUES WITH (modulus 4, remainder 0);
CREATE TABLE sessions_p1 PARTITION OF sessions FOR VALUES WITH (modulus 4, remainder 1);
CREATE TABLE sessions_p2 PARTITION OF sessions FOR VALUES WITH (modulus 4, remainder 2);
CREATE TABLE sessions_p3 PARTITION OF sessions FOR VALUES WITH (modulus 4, remainder 3);

-- Hits only sessions_p2 (or whichever partition matches the hash)
SELECT * FROM sessions WHERE session_id = 'sess_abc123';
```

## Related terms

Hash partitioning contrasts with range partitioning, which preserves key order but risks hot spots on sequential keys. When the cluster size changes, hash-partitioned systems require rebalancing to redistribute data to new nodes.
