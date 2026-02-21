---
title: CDC (Change Data Capture)
description: CDC is the process of tracking and capturing changes in a database and delivering change events (inserts/updates/deletes) to downstream systems.
questions:
  - What is CDC (Change Data Capture)?
  - When is CDC (Change Data Capture) used?
  - What are the trade-offs of CDC (Change Data Capture)?
---

## Definition

CDC is the process of tracking and capturing changes in a database and delivering change events (inserts/updates/deletes) to downstream systems.

## Core concept

Often implemented by reading the database’s write-ahead log or trigger-based hooks. CDC enables streaming changes for ETL, caches, or event-driven architectures.

## Use cases

Keeping search indexes, caches, data warehouses in sync. Streaming analytics (e.g. Debezium is a popular CDC tool).

## Example

In Debezium, an insert into MySQL’s binlog produces an event pushed to Kafka, which a consumer uses to update another system.

## References

Standard data engineering concept.
