---
title: Data Lake
description: A data lake is a centralized repository that stores large volumes of raw data in its native format, allowing schema-on-read analysis with tools like Spark, Presto, and Athena.
questions:
  - What is Data Lake?
  - When is Data Lake used?
  - What are the trade-offs of Data Lake?
---

## Definition

A data lake is a centralized storage repository that holds raw data — structured, semi-structured, and unstructured — in its native format, deferring schema and transformation to query time.

## How it works

A data lake stores data as-is: CSV files, JSON logs, Parquet files, images, video, raw database exports. Unlike a data warehouse, which requires data to be cleaned, transformed, and loaded into a predefined schema (schema-on-write), a data lake accepts everything first and applies schema when the data is read (schema-on-read).

The storage layer is typically a distributed object store like AWS S3, Google Cloud Storage, or HDFS. Data is organized into zones — raw (landing), cleaned (curated), and enriched (analytics-ready). A metadata catalog (AWS Glue, Apache Hive Metastore) tracks what files exist, their schemas, and partitioning, enabling query engines to find and read data efficiently.

Query engines like Apache Spark, Presto/Trino, or AWS Athena sit on top of the lake and process data in place without moving it into a separate database. Modern "lakehouse" architectures (Delta Lake, Apache Iceberg, Apache Hudi) add ACID transactions, schema enforcement, and time-travel queries directly on lake storage — bridging the gap between lakes and warehouses.

## When to use it

- **Machine learning pipelines** — Store raw training data (text, images, sensor readings) alongside feature-engineered datasets. ML teams can access any historical version.
- **Log and event ingestion** — Centralize application logs, clickstream events, and IoT sensor data from multiple sources before deciding how to analyze them.
- **Data exploration** — Data scientists query raw data to discover patterns before committing to a warehouse schema.
- **Compliance and audit** — Keep immutable copies of raw data for regulatory requirements (GDPR right of access, financial auditing).

## Trade-offs

**Gains:** Stores any data format at low cost (S3 storage is ~$0.023/GB/month). No upfront schema design required. Supports diverse workloads — batch analytics, ML training, ad-hoc exploration — from one storage layer.

**Costs:** Without governance, lakes become "data swamps" — terabytes of undocumented, duplicate, or stale files that nobody can find or trust. Query performance is slower than a tuned warehouse for structured analytics. Requires a catalog and access control layer to be useful at scale.

## Example

An AWS data lake for application analytics:

```
s3://company-data-lake/
  raw/
    events/2025/03/17/   ← daily Parquet partitions from Kafka
    logs/api-gateway/    ← raw JSON access logs
  curated/
    events_cleaned/      ← deduplicated, schema-validated
  analytics/
    user_cohorts/        ← pre-aggregated for dashboards
```

Query with Athena:
```sql
SELECT user_id, count(*) as events
FROM curated.events_cleaned
WHERE event_date = '2025-03-17'
GROUP BY user_id
ORDER BY events DESC
LIMIT 100;
```

## Related terms

Data warehouse stores structured, pre-transformed data optimized for analytical queries — complementary to a lake. CDC (Change Data Capture) streams database changes into a lake in real time. Columnar storage formats like Parquet are the standard file format for lake data.
