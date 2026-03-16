---
title: Data Migration
description: Data migration is the process of moving data between storage systems, formats, or schemas, typically during upgrades or platform changes.
questions:
  - What is Data Migration?
  - When is Data Migration used?
  - What are the trade-offs of Data Migration?
---

## Definition

Data migration is the process of moving data from one storage system, format, or schema to another, typically triggered by platform changes, version upgrades, or infrastructure consolidation.

## How it works

Migrations fall into two categories: **offline** and **online**. Offline migration takes the source system down, copies data to the target, and brings the target up. It is simple but requires a maintenance window. For a 500 GB PostgreSQL database, a `pg_dump | pg_restore` pipeline might take 2–4 hours depending on hardware.

Online migration keeps the source live throughout. The typical pattern is dual-write or change data capture (CDC). Tools like Debezium stream row-level changes from MySQL's binlog or PostgreSQL's WAL to the target system in near real-time. You first do a bulk snapshot of existing data, then replay the change stream until the target catches up. Once lag drops below an acceptable threshold (say, under 1 second), you cut over by pointing the application to the new database. Stripe used this approach when migrating from MongoDB to a custom-built system on top of PostgreSQL—running both in parallel for months, comparing outputs, before fully cutting over.

Schema transformations often happen during migration. Column types change (`VARCHAR(50)` to `TEXT`), tables split or merge, and denormalized structures get normalized. ETL pipelines or migration scripts handle these transforms, and validation queries compare row counts and checksums between source and target.

## When to use it

- Moving from a self-managed MySQL instance to Amazon Aurora during a cloud migration.
- Upgrading PostgreSQL from version 14 to 16 when `pg_upgrade` is not viable due to extension incompatibilities.
- Consolidating three microservice databases into a single multi-tenant database.
- Migrating from DynamoDB to CockroachDB when the application outgrows a key-value model and needs relational joins.

## Trade-offs

**Gains:** Access to better performance, lower operational cost, improved features of the target platform, and the ability to restructure data for current application needs.

**Costs:** Risk of data loss or corruption if validation is insufficient. Online migrations add operational complexity—you are running two systems simultaneously. Application code may need temporary compatibility layers to read from both old and new schemas. Rollback is harder once writes go to the new system, since you'd need reverse replication.

## Example

Using Debezium CDC to stream PostgreSQL changes to Kafka during a live migration:

```json
{
  "name": "pg-source-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "source-db.internal",
    "database.port": "5432",
    "database.dbname": "orders",
    "slot.name": "migration_slot",
    "publication.name": "migration_pub",
    "topic.prefix": "migration"
  }
}
```

## Related terms

Data migration frequently involves schema evolution when the target system uses a different schema version. For streaming-based migrations, exactly-once semantics ensures no records are lost or duplicated during the transfer.
