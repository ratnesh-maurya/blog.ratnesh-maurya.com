---
title: Data Lake
description: 'A data lake is a centralized repository that stores large volumes of raw data (structured, semi-structured, unstructured) in its native format, usually in a…'
questions:
  - What is Data Lake?
  - When is Data Lake used?
  - What are the trade-offs of Data Lake?
---

## Definition

A data lake is a centralized repository that stores large volumes of raw data (structured, semi-structured, unstructured) in its native format, usually in a distributed storage (like S3 or HDFS).

## Core concept

Unlike a data warehouse, a lake holds raw logs, files, streams, etc. It emphasizes storage first, schema later (schema-on-read). Analysts and data scientists can explore data using various tools (Spark, Presto, etc.).

## Use cases

Big data analytics, machine learning, IoT data ingestion.

## Trade-offs

Lakes can become “data swamps” without proper cataloging/metadata. Query performance depends on the processing layer.

## Example

AWS S3 as a data lake storing CSV logs, Parquet files, etc., with Athena or EMR used to query it.

## References

Data engineering.
