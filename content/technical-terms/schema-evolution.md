---
title: Schema Evolution
description: Schema evolution is the practice of modifying a data schema over time while maintaining compatibility with existing readers and writers.
questions:
  - What is Schema Evolution?
  - When is Schema Evolution used?
  - What are the trade-offs of Schema Evolution?
---

## Definition

Schema evolution is the practice of changing a data schema over time—adding fields, removing fields, changing types—while maintaining compatibility with existing producers and consumers.

## How it works

Schemas change because applications change. The challenge is making those changes without breaking systems that already read or write data in the old format. There are three compatibility levels:

**Backward compatible** changes let new code read old data. Adding a new column with a default value is backward compatible—old rows simply get the default. **Forward compatible** changes let old code read new data. Removing a field that old consumers never used is forward compatible. **Full compatibility** means both directions work. Avro and Protobuf are designed around this: new fields get default values, removed fields are ignored by readers that don't know about them.

In relational databases, schema evolution happens through migrations. A safe evolution sequence for renaming a column might span three deployments: first, add the new column and backfill it; second, update application code to write to both columns and read from the new one; third, drop the old column after all consumers have migrated. Tools like Flyway, Alembic, and `golang-migrate` track which migrations have run by storing version numbers in a metadata table.

In streaming systems, schema evolution is managed by a schema registry. Confluent Schema Registry, for instance, enforces compatibility checks at registration time. If you try to register a schema that removes a required field without a default, the registry rejects it.

## When to use it

- Adding an `email_verified` boolean to a users table in PostgreSQL without downtime—use `ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false`.
- Evolving an Avro schema for Kafka events by adding an optional `region` field with a default of `"us-east-1"`.
- Migrating a Protobuf API from `string address` to a structured `Address` message while keeping old clients functional by deprecating the old field rather than reusing its field number.

## Trade-offs

**Gains:** Continuous delivery without coordinated big-bang deployments. Old and new versions of services coexist during rolling updates. Data written years ago remains readable without transformation.

**Costs:** Discipline required—every change must be evaluated for compatibility. "Just rename the field" becomes a multi-step process. Accumulated optional fields bloat the schema over time. Backward-incompatible changes (like changing a field type from `int` to `string`) require a new topic or table and a migration process rather than an in-place change.

## Example

Safe column addition in PostgreSQL (no table lock on modern versions):

```sql
-- Step 1: Add nullable column with default
ALTER TABLE orders ADD COLUMN priority INT DEFAULT 0;

-- Step 2: Backfill existing rows
UPDATE orders SET priority = 1 WHERE express_shipping = true;

-- Step 3: After all services read the new column, drop the old one
ALTER TABLE orders DROP COLUMN express_shipping;
```

## Related terms

Schema evolution is enforced at scale using a schema registry. When evolving schemas during system transitions, it intersects with data migration strategy.
