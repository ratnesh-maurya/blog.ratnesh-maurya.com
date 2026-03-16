---
title: Range Partitioning
description: Range partitioning divides data into partitions based on ordered key ranges, keeping contiguous values together for efficient range scans.
questions:
  - What is Range Partitioning?
  - When is Range Partitioning used?
  - What are the trade-offs of Range Partitioning?
---

## Definition

Range partitioning splits data into partitions based on contiguous ranges of a sort key, so that each partition holds an ordered subset of the key space.

## How it works

A range-partitioned table defines boundary values that divide the key space into segments. Rows are routed to the partition whose range contains the row's key value. Unlike hash partitioning, which scatters data uniformly, range partitioning preserves key ordering within and across partitions.

Consider a table of orders partitioned by `order_date`. You define boundaries: partition `p_2025_q1` holds dates from `2025-01-01` to `2025-03-31`, `p_2025_q2` holds `2025-04-01` to `2025-06-30`, and so on. A query for `WHERE order_date BETWEEN '2025-02-01' AND '2025-02-28'` touches only `p_2025_q1`, while the rest of the partitions are pruned entirely. This is **partition pruning**, and it is the primary performance benefit.

HBase and Google Bigtable use range partitioning internally. The row key space is split into tablets or regions, each managed by a separate server. As a region grows, it splits at a midpoint. The master tracks the mapping of key ranges to servers in a metadata table. Clients query the metadata to find which server holds a given key range, then send requests directly to that server.

PostgreSQL supports declarative range partitioning since version 10. You define a parent table, specify the partition key, and create child tables for each range. The query planner automatically routes queries and prunes irrelevant partitions.

## When to use it

- Time-based analytics: partition a `page_views` table by month so that queries like "total views in March 2025" scan a single partition instead of the full table.
- Log storage: partition by date so that dropping data older than 90 days is a `DROP PARTITION` operation (instant) rather than a `DELETE` over billions of rows.
- Multi-tenant systems: partition a `tenants` table by `tenant_id` range when tenant IDs are sequential and workload is roughly uniform.
- HBase tables storing sensor data keyed by `device_id:timestamp`—range partitioning keeps each device's readings on the same region server.

## Trade-offs

**Gains:** Efficient range scans and ordered traversal. Partition pruning dramatically reduces I/O for time-windowed or range-filtered queries. Easy lifecycle management—archiving old data is a metadata operation.

**Costs:** Susceptible to hot spots. If you partition by timestamp and all current writes go to the latest partition, that partition becomes a bottleneck while older ones sit idle. This is why HBase documentation warns against monotonically increasing row keys. Rebalancing after a split requires moving data between servers. And choosing the right range boundaries upfront is hard—too few partitions create large segments, too many create management overhead.

## Example

Declarative range partitioning in PostgreSQL:

```sql
CREATE TABLE orders (
    id BIGINT,
    order_date DATE NOT NULL,
    customer_id INT,
    total NUMERIC
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2025_q1 PARTITION OF orders
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

CREATE TABLE orders_2025_q2 PARTITION OF orders
    FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');

-- Only scans orders_2025_q1
SELECT * FROM orders WHERE order_date = '2025-03-15';
```

## Related terms

Range partitioning contrasts with hash partitioning, which distributes data uniformly but sacrifices range query efficiency. For time-based workloads specifically, time-series partitioning is a specialized form of range partitioning optimized for append-heavy, time-windowed access patterns.
