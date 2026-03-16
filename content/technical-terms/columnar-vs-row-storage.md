---
title: Columnar vs Row Storage
description: Columnar storage organizes data by columns (all values of one field together) while row storage groups complete records together, each optimized for different query patterns.
questions:
  - What is Columnar vs Row Storage?
  - When is Columnar vs Row Storage used?
  - What are the trade-offs of Columnar vs Row Storage?
---

## Definition

Columnar storage stores all values of a single column contiguously on disk, while row storage stores all fields of a single record together—each layout is optimized for fundamentally different access patterns.

## How it works

In **row storage**, a table with columns `(id, name, email, balance)` and 1 million rows stores data as: `[row1_id, row1_name, row1_email, row1_balance, row2_id, row2_name, ...]`. Reading one complete row is a single sequential read. Inserting a new row appends one contiguous block. PostgreSQL, MySQL, and most OLTP databases use this layout.

In **columnar storage**, the same table stores data as: `[row1_id, row2_id, ... row1M_id], [row1_name, row2_name, ...], [row1_email, ...], [row1_balance, ...]`. Each column is stored in its own file or segment. When a query only needs `balance`, only that column's data is read from disk—the engine skips `name` and `email` entirely.

Columnar storage enables powerful compression. Values in a column share the same type and often have low cardinality. A `status` column with values `["active", "inactive", "suspended"]` compresses to nearly nothing with dictionary encoding. Run-length encoding compresses sorted columns: `["US", "US", "US", ..., "UK", "UK", ...]` becomes `[("US", 500000), ("UK", 300000), ...]`. Compression ratios of 5–10x are common, meaning a 100 GB dataset fits in 10–20 GB.

Modern columnar engines also exploit SIMD (Single Instruction, Multiple Data) CPU instructions. Since column values are tightly packed and same-typed, the CPU can compare or aggregate 8–16 values per instruction cycle.

## When to use it

**Columnar** (OLAP):
- Analytical queries scanning millions of rows but few columns: `SELECT avg(salary) FROM employees WHERE department = 'Engineering'`.
- Data warehouses: Snowflake, BigQuery, Redshift, ClickHouse.
- File formats: Apache Parquet, Apache ORC for data lake storage.

**Row-based** (OLTP):
- Transactional workloads reading/writing complete records: `SELECT * FROM users WHERE id = 42`.
- Applications with frequent single-row inserts: web request logging, user signups.
- Databases: PostgreSQL, MySQL, SQL Server.

## Trade-offs

**Columnar gains**: 10–100x faster analytical scans by reading only needed columns. Superior compression reduces storage costs and I/O. Vectorized execution enables CPU-efficient aggregation.

**Columnar costs**: Single-row reads are expensive—fetching one user's full record requires reading from every column file. Point updates touch multiple column segments. Write amplification on inserts: adding one row means appending to every column file separately. Most columnar databases batch writes into micro-batches to amortize this cost, adding small latency (100ms–1s).

**Row-based gains**: Fast point lookups and single-row operations. Low-latency inserts. Simple transaction semantics with row-level locking.

**Row-based costs**: Full table scans read all columns even when you only need one. Compression is limited because adjacent bytes in a row are different data types.

## Example

The difference in I/O for the same query on a 10-column table with 100M rows:

```
Query: SELECT avg(price) FROM products WHERE category = 'electronics'

Row storage (PostgreSQL):
  - Reads all 10 columns × 100M rows ≈ 8 GB from disk
  - Filters in memory

Columnar storage (ClickHouse):
  - Reads only `price` column (800 MB) + `category` column (200 MB compressed)
  - Total I/O: ~1 GB — an 8x reduction

-- ClickHouse table definition
CREATE TABLE products (
    id          UInt64,
    name        String,
    category    LowCardinality(String),
    price       Decimal(10,2),
    created_at  DateTime
) ENGINE = MergeTree()
ORDER BY (category, created_at);
```

## Related terms

Data warehouses universally use columnar storage. CDC (Change Data Capture) streams row-level changes that must be converted into columnar format on ingestion. The choice between columnar and row storage influences how logical vs physical replication strategies work, since columnar engines often have different WAL structures.
