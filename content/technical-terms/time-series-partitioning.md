---
title: Time-Series Partitioning
description: 'Partitioning data by time (e.g., daily/weekly/monthly partitions). Each partition holds data for a time range.'
questions:
  - What is Time-Series Partitioning?
  - When is Time-Series Partitioning used?
  - What are the trade-offs of Time-Series Partitioning?
---

## Definition

Partitioning data by time (e.g., daily/weekly/monthly partitions). Each partition holds data for a time range.

## Core concept

Especially useful for time-series data: older data can be archived/dropped easily. Queries often filter by time, so partitions improve prune efficiency.

## Use cases

Logs, metrics (e.g. Prometheus, InfluxDB) often partition by day.

## Trade-offs

Need to manage partitions (create/destroy). If time skew occurs, new partitions are always hot, old ones cold.

## References

Time series DB best practices.
