---
title: B-Tree
description: A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time, forming the foundation of most database indexes.
questions:
  - What is B-Tree?
  - When is B-Tree used?
  - What are the trade-offs of B-Tree?
---

## Definition

A B-tree is a self-balancing tree data structure that maintains sorted data and supports searches, insertions, deletions, and range scans in O(log n) time, optimized for systems that read and write large blocks of data.

## How it works

A B-tree organizes data into nodes, where each node contains multiple keys and pointers. Unlike a binary tree (2 children per node), a B-tree node can have hundreds of children, making the tree very shallow. A B-tree of order 500 with 1 billion keys is only 3-4 levels deep.

**Internal nodes** store keys and pointers to child nodes. Keys divide the search space: all keys in the left subtree are less than the node's key, all keys in the right subtree are greater. **Leaf nodes** store the actual key-value pairs (or pointers to the data rows in a database).

When searching, the algorithm starts at the root, compares the search key against the node's keys, and follows the appropriate child pointer — repeating until it reaches a leaf. Because each node is sized to fit a single disk page (typically 4-16KB), each level requires one disk I/O. A 3-level B-tree answers any lookup in 3 disk reads.

**B+ trees** (used by PostgreSQL, MySQL InnoDB, and most databases) are a variant where all data pointers are in leaf nodes, and leaf nodes are linked in a doubly-linked list. This makes range scans efficient: find the start key, then follow the leaf chain.

Insertions and deletions maintain balance automatically through node splits and merges, guaranteeing worst-case O(log n) performance.

## When to use it

- **Database indexes** — The default index type in PostgreSQL, MySQL, SQLite, and Oracle. Every `CREATE INDEX` creates a B-tree (or B+ tree) unless you specify otherwise.
- **Filesystem directory structures** — ext4, NTFS, and APFS use B-trees to organize directory entries.
- **Key-value stores** — BoltDB (Go), LMDB use B+ trees as their storage engine.
- **Range queries** — B-trees excel at `WHERE price BETWEEN 10 AND 50` because the sorted leaf chain can be scanned sequentially.

## Trade-offs

**Gains:** O(log n) lookups with very few disk I/Os (3-4 for billions of keys). Excellent for both point lookups and range scans. Well-understood, battle-tested in every major database for 40+ years.

**Costs:** Write amplification — inserting a single key may trigger node splits that rewrite multiple pages. Random I/O on writes (each update touches nodes at different disk locations). For write-heavy workloads with sequential keys, LSM-trees often outperform B-trees.

## Example

```sql
-- PostgreSQL uses a B-tree index by default
CREATE INDEX idx_users_email ON users (email);

-- This query does a B-tree lookup: O(log n) — typically 2-3 disk reads
SELECT * FROM users WHERE email = 'alice@example.com';

-- Range scan follows the leaf chain
SELECT * FROM users WHERE email BETWEEN 'a' AND 'd' ORDER BY email;

-- Check that the index is being used
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';
-- Index Scan using idx_users_email on users
--   Index Cond: (email = 'alice@example.com'::text)
```

## Related terms

LSM-tree is an alternative index structure optimized for write-heavy workloads (used by Cassandra, RocksDB, LevelDB). Indexing is the broader concept that B-trees implement. Covering index stores additional columns in the B-tree leaf nodes to enable index-only scans.
