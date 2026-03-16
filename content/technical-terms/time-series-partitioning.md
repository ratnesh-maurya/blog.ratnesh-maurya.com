---
title: Time-Series Partitioning
description: Time-series partitioning divides data into partitions by time intervals, optimizing for append-heavy workloads and time-windowed queries.
questions:
  - What is Time-Series Partitioning?
  - When is Time-Series Partitioning used?
  - What are the trade-offs of Time-Series Partitioning?
---

## Definition

Time-series partitioning splits data into partitions based on time intervals—hourly, daily, weekly, or monthly—so each partition holds records from a specific time window.

## How it works

Time-series data has a distinctive access pattern: writes are append-only to the current time window, reads filter by time range, and old data becomes progressively less valuable. Time-series partitioning exploits all three characteristics.

The system creates a new partition for each time interval. A metrics table partitioned by day gets a new partition every 24 hours. All writes for March 17, 2026 go to `metrics_20260317`, and writes for March 18 go to `metrics_20260318`. Since writes only target the current partition, write contention is limited to a single, predictably-sized segment.

**Partition pruning** is where the performance payoff happens. A query for `WHERE timestamp BETWEEN '2026-03-15' AND '2026-03-17'` scans exactly three partitions regardless of how many years of data the table holds. Without partitioning, the same query would require a full index scan or table scan across the entire dataset.

TimescaleDB (a PostgreSQL extension) automates this with **hypertables**. You create a hypertable from a regular table, specify the time column and chunk interval, and TimescaleDB automatically creates and manages the underlying chunks. InfluxDB and Prometheus use similar concepts internally—Prometheus stores data in 2-hour blocks, each block being a self-contained directory with an index, chunks, and tombstones. ClickHouse uses monthly partitions by default in its MergeTree engine family.

Data lifecycle management becomes trivial. Deleting data older than 90 days is `DROP PARTITION` (or `drop_chunks()` in TimescaleDB), which is an instant metadata operation rather than a billion-row `DELETE` that locks the table and generates massive WAL.

## When to use it

- Application logs: partition by day, retain 30 days, drop older partitions via a cron job.
- IoT sensor data: 10,000 devices emitting readings every second. Partition by hour so each partition holds ~36M rows—large enough to compress well, small enough to scan quickly.
- Financial tick data: partition by trading day for queries like "show all trades for AAPL on March 15, 2026."
- Observability platforms: Grafana + Prometheus queries almost always include a time range. Partitioning ensures those queries only touch relevant blocks.

## Trade-offs

**Gains:** Fast time-windowed queries through partition pruning. Instant data expiration via partition drops. Predictable partition sizes for capacity planning. Good compression ratios because data within a time window tends to have similar values.

**Costs:** The current partition is always hot—all writes go there, while historical partitions are cold. If the query does not include a time filter, the planner must scan all partitions, which can be worse than an unpartitioned table. Partition management requires automation: creating future partitions ahead of time and dropping expired ones. Choosing the wrong interval creates problems—hourly partitions on a low-traffic table create thousands of tiny, inefficient partitions; monthly partitions on a high-traffic table create partitions too large to scan efficiently.

## Example

TimescaleDB hypertable setup with automated chunking:

```sql
CREATE TABLE metrics (
    time        TIMESTAMPTZ NOT NULL,
    device_id   INT,
    temperature DOUBLE PRECISION,
    humidity    DOUBLE PRECISION
);

SELECT create_hypertable('metrics', 'time', chunk_time_interval => INTERVAL '1 day');

-- Drop data older than 90 days (instant metadata operation)
SELECT drop_chunks('metrics', older_than => INTERVAL '90 days');
```

## Related terms

Time-series partitioning is a specialized application of range partitioning where the partition key is always a timestamp. When time-series data spans multiple regions, it intersects with geo-replication for distributing recent data closer to users.
