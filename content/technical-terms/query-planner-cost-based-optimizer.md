---
title: Query Planner (Cost-Based Optimizer)
description: The query planner/optimizer is a component that determines the most efficient way to execute a database query. A cost-based optimizer (CBO) estimates the…
questions:
  - What is Query Planner (Cost-Based Optimizer)?
  - When is Query Planner (Cost-Based Optimizer) used?
  - What are the trade-offs of Query Planner (Cost-Based Optimizer)?
---

## Definition

The query planner/optimizer is a component that determines the most efficient way to execute a database query. A cost-based optimizer (CBO) estimates the “cost” (resources, time) of different query plans and picks the cheapest[[\[47\]](https://docs.yugabyte.com/stable/architecture/query-layer/planner-optimizer/ "Query Planner | YugabyteDB Docs")](https://docs.yugabyte.com/stable/architecture/query-layer/planner-optimizer/ "Query Planner | YugabyteDB Docs").

## Core concept

Given an SQL statement, the planner considers possible execution strategies (join orders, use of indexes, etc.). It uses table statistics (row counts, index selectivity) to estimate cost (I/O, CPU). The optimizer picks the plan with lowest estimated cost.

## Use cases

All relational databases (Postgres, Oracle, MySQL) and many distributed SQL engines have CBOs. A good optimizer is crucial for performance, especially on complex queries involving joins and aggregations.

## Trade-offs

Collecting accurate statistics can be overhead. CBO can sometimes misestimate and choose suboptimal plans (necessitating hints or manual indexes). Rule-based optimizers (RBO) exist but are simpler.

## Example

An optimizer might choose between an index scan vs a full table scan. If the table is large and few rows match, it picks index; if many rows, it might choose full scan. It uses stats to decide[[\[47\]](https://docs.yugabyte.com/stable/architecture/query-layer/planner-optimizer/ "Query Planner | YugabyteDB Docs")](https://docs.yugabyte.com/stable/architecture/query-layer/planner-optimizer/ "Query Planner | YugabyteDB Docs").

## References

“The query planner determines the most efficient way to execute a query. The optimizer calculates costs of different execution plans and selects the most cost-effective path”[[\[47\]](https://docs.yugabyte.com/stable/architecture/query-layer/planner-optimizer/ "Query Planner | YugabyteDB Docs")](https://docs.yugabyte.com/stable/architecture/query-layer/planner-optimizer/ "Query Planner | YugabyteDB Docs").
