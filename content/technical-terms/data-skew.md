---
title: Data Skew
description: Data skew is an uneven distribution of data or workload across partitions or nodes, causing hotspots where some partitions handle disproportionate traffic or storage.
questions:
  - What is Data Skew?
  - When is Data Skew used?
  - What are the trade-offs of Data Skew?
---

## Definition

Data skew is an uneven distribution of data or workload across partitions, shards, or processing nodes, where some partitions carry disproportionately more data or traffic than others.

## How it works

In any partitioned system—distributed databases, MapReduce, Spark jobs—data is split across nodes using a partition key. If the key's value distribution is uneven, some partitions become hotspots.

There are two forms. **Storage skew** means some partitions hold far more rows than others. If you partition an e-commerce orders table by `customer_id`, Amazon's own account (buying for fulfillment centers) might generate millions of rows while most customers have a few dozen. **Workload skew** means some partitions receive far more queries, even if row counts are balanced. A viral product page hammered by traffic creates a query hotspot on the partition holding that product's data.

The consequences are severe. In a Spark job with 200 partitions, if one partition holds 40% of the data, that single task takes 10x longer than the rest. The job's wall-clock time equals the slowest partition, wasting the parallelism you paid for. In a sharded database, a hot shard hits CPU or I/O limits while other shards idle.

Detection is straightforward: monitor partition sizes and per-partition latency. In Spark, check the Spark UI's task duration histogram—a long tail means skew. In PostgreSQL with Citus, query `pg_dist_shard` to see row counts per shard.

## When to use it

Data skew is a problem to detect and mitigate, not something you choose to use:

- **Distributed joins in Spark/Flink**: A join where one key (e.g., `country = "US"`) dominates causes one reducer to process most data. Fix: salted keys—append a random suffix to the hot key, replicate the other table's matching rows across salted partitions.
- **Sharded databases**: If you shard by `tenant_id` and one tenant is 100x larger than others, that shard becomes a bottleneck. Fix: split the large tenant across multiple shards, or use consistent hashing with virtual nodes.
- **Time-series ingestion**: Partitioning by timestamp with "current hour" receiving all writes. Fix: add a secondary partition dimension like device_id.
- **Kafka topics**: A topic partitioned by `user_id` where a bot generates millions of events floods one partition while others are empty.

## Trade-offs

**Gains of addressing skew**: Parallel execution actually runs in parallel. Query latencies become predictable. Resource utilization improves across the cluster.

**Costs of mitigation**: Salted keys complicate queries—you must union across all salt values. Repartitioning large datasets is expensive (full data shuffle). Adaptive techniques like Spark 3's Adaptive Query Execution (AQE) help automatically, but add planning overhead. Over-partitioning to prevent skew can itself cause problems (too many small files in HDFS, too many small shards in a database).

## Example

Handling a skewed join in PySpark with key salting:

```python
from pyspark.sql import functions as F

SALT_BUCKETS = 10

# Salt the skewed side (orders has a hot customer_id)
orders_salted = orders.withColumn(
    "salt", (F.rand() * SALT_BUCKETS).cast("int")
).withColumn(
    "customer_id_salted", F.concat(F.col("customer_id"), F.lit("_"), F.col("salt"))
)

# Explode the small side (customers) to match all salt values
customers_exploded = customers.crossJoin(
    F.explode(F.array([F.lit(i) for i in range(SALT_BUCKETS)])).alias("salt")
).withColumn(
    "customer_id_salted", F.concat(F.col("customer_id"), F.lit("_"), F.col("salt"))
)

# Join on salted key — evenly distributed
result = orders_salted.join(customers_exploded, "customer_id_salted")
```

## Related terms

Data skew is mitigated by consistent hashing with virtual nodes. Columnar vs row storage choices affect how skew impacts scan performance. In data warehouse ETL, skew in fact tables is a common reason for slow transformations.
