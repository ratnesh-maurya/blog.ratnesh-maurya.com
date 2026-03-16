---
title: CDC (Change Data Capture)
description: CDC is the process of tracking and capturing row-level changes (inserts, updates, deletes) in a database and streaming those change events to downstream systems in near real-time.
questions:
  - What is CDC (Change Data Capture)?
  - When is CDC (Change Data Capture) used?
  - What are the trade-offs of CDC (Change Data Capture)?
---

## Definition

CDC (Change Data Capture) is the process of detecting and capturing row-level changes in a database and delivering those changes as a stream of events to downstream consumers.

## How it works

The most reliable CDC approach reads the database's **write-ahead log** (WAL in PostgreSQL, binlog in MySQL, oplog in MongoDB). Every committed change is already written to this log for crash recovery—CDC piggybacks on it. A CDC connector reads the log position, extracts change events (with before/after row images), and publishes them to a message broker like Kafka.

Debezium is the dominant open-source CDC platform. It runs as a Kafka Connect connector, reading the WAL of PostgreSQL, MySQL, SQL Server, MongoDB, and others. Each change produces a Kafka message with a structured payload: the operation type (`c` for create, `u` for update, `d` for delete), the table name, the primary key, the before and after values, and a source timestamp.

Alternative approaches exist. **Trigger-based CDC** installs database triggers that write changes to a shadow table—simple but adds write overhead and couples the CDC mechanism to application writes. **Polling-based CDC** queries a `last_updated` column periodically—easy to implement but misses deletes, has latency proportional to poll interval, and puts load on the source database. Log-based CDC avoids both problems: it's non-intrusive to application writes and captures all change types.

Once events are in Kafka, consumers can materialize them however they need: update an Elasticsearch index, sync a Redis cache, feed a data warehouse, or trigger a microservice workflow.

## When to use it

- **Search index sync**: An e-commerce site needs product updates reflected in Elasticsearch within seconds. CDC from Postgres → Kafka → Elasticsearch consumer replaces scheduled full reindexing.
- **Cache invalidation**: Instead of TTL-based expiration, CDC events tell the cache exactly which keys changed. Precise, no stale reads during the TTL window.
- **Data warehouse loading**: Streaming CDC into Snowflake or BigQuery via Kafka gives near-real-time analytics without batch ETL jobs.
- **Event-driven microservices**: The orders service writes to its database. CDC publishes `order.created` events to Kafka. The shipping service consumes them—no dual-write problem, no distributed transactions.
- **Audit logging**: CDC captures every change with timestamps, producing a complete audit trail without modifying application code.

## Trade-offs

**Gains**: Near-zero latency propagation (sub-second typical). No impact on application write path. Captures all change types including deletes. Single source of truth remains the database.

**Costs**: Operational complexity—you need Kafka (or equivalent), Debezium, and monitoring for connector lag. Schema changes in the source database require careful handling (schema registry, compatibility modes). WAL retention must be configured to prevent the CDC connector from falling behind and losing events. Disk usage increases if the WAL retention window is large. Initial snapshot of existing data can take hours for large tables.

## Example

Debezium connector configuration for PostgreSQL → Kafka:

```json
{
  "name": "pg-cdc-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "db.internal",
    "database.port": "5432",
    "database.user": "debezium",
    "database.dbname": "appdb",
    "database.server.name": "prod",
    "plugin.name": "pgoutput",
    "table.include.list": "public.orders,public.customers",
    "topic.prefix": "cdc",
    "slot.name": "debezium_slot",
    "publication.name": "dbz_publication"
  }
}
```

This produces Kafka topics like `cdc.public.orders` with change events for every insert, update, and delete.

## Related terms

CDC is a primary mechanism for feeding data warehouses with fresh data. It relates to logical vs physical replication—CDC is essentially logical replication to non-database targets. Downstream consumers often use columnar vs row storage depending on their query patterns.
