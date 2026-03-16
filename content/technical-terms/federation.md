---
title: Federation
description: Federation is an architecture where multiple autonomous databases or services coordinate to answer queries without sharing a single storage layer.
questions:
  - What is Federation?
  - When is Federation used?
  - What are the trade-offs of Federation?
---

## Definition

Federation is an architecture where multiple autonomous databases or services coordinate to answer queries, each owning its own data, without a shared storage layer.

## How it works

In a federated system, a routing layer (sometimes called a federation engine or proxy) sits in front of independent data stores. When a query arrives, the router determines which backend(s) hold the relevant data, fans the query out, collects the results, and merges them before returning a unified response.

Each backend operates independently—it has its own schema, its own storage engine, and can even run different database software. PostgreSQL's `postgres_fdw` is a textbook example: it lets one Postgres instance query tables on a remote Postgres server as if they were local. Similarly, Presto/Trino federates queries across Hive, MySQL, Cassandra, and S3 in a single SQL statement.

The key distinction from sharding: in sharding, all shards run the same schema and the system decides placement. In federation, the backends are autonomous. They may have been built independently by different teams, run different engines, and contain logically distinct datasets. The federation layer unifies access.

## When to use it

- **Multi-tenant SaaS**: Each tenant gets its own database. A federation proxy routes requests by tenant ID to the correct backend. Shopify's architecture routes merchant queries to per-pod MySQL instances this way.
- **Cross-service queries**: An analytics team needs to join user data from a Postgres service with order data from a DynamoDB service. A Trino cluster federates across both.
- **Mergers and acquisitions**: Two companies combine, each with their own ERP database. A federation layer provides unified reporting without a full data migration.
- **Regulatory compliance**: EU user data stays in an EU database, US data in a US database. The application federates across both, but data residency is preserved.

## Trade-offs

**Gains**: Each backend scales independently. Teams own their data without central coordination. No single point of storage failure. Schema flexibility—backends can evolve independently.

**Costs**: Cross-backend joins are expensive. A federated join between Postgres and Cassandra requires pulling data to the federation layer and joining in memory. Transactions spanning multiple backends need distributed coordination (2PC or sagas), which adds latency and complexity. Debugging is harder because a slow query could be bottlenecked on any backend.

Latency depends on the slowest backend. If one system is overloaded, the entire federated query stalls waiting for it.

## Example

Querying across two Postgres servers using `postgres_fdw`:

```sql
-- On the federation server
CREATE EXTENSION postgres_fdw;

CREATE SERVER orders_db FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (host 'orders.internal', dbname 'orders', port '5432');

CREATE USER MAPPING FOR analyst SERVER orders_db
  OPTIONS (user 'readonly', password 'secret');

CREATE FOREIGN TABLE remote_orders (
  id bigint, user_id bigint, total numeric, created_at timestamptz
) SERVER orders_db OPTIONS (table_name 'orders');

-- Now join local users with remote orders
SELECT u.email, sum(o.total)
FROM users u JOIN remote_orders o ON u.id = o.user_id
GROUP BY u.email;
```

## Related terms

Federation often works alongside logical vs physical replication for syncing subsets of data between backends. It addresses different problems than data warehousing, which consolidates everything into one store for analytics.
