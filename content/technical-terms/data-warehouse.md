---
title: Data Warehouse
description: 'A data warehouse is a centralized repository that stores curated, cleaned, and structured data optimized for queries and reporting, typically in a columnar…'
questions:
  - What is Data Warehouse?
  - When is Data Warehouse used?
  - What are the trade-offs of Data Warehouse?
---

## Definition

A data warehouse is a centralized repository that stores curated, cleaned, and structured data optimized for queries and reporting, typically in a columnar format.

## Core concept

Data is ETL’ed from operational systems into the warehouse, following a schema (often star/snowflake). It’s designed for analytical queries (OLAP) rather than transactions.

## Use cases

Business intelligence, dashboards, historical analysis.

## Trade-offs

Requires upfront schema design and transformation (ETL). Not suitable for high-write transactional loads.

## Example

Snowflake, Amazon Redshift, or on-prem Oracle/Data Mart.

## References

Established BI practice.
