---
title: Data Locality
description: 'Data locality is the principle of placing computation (queries, processing) close to where the data resides, rather than moving large data sets across the…'
questions:
  - What is Data Locality?
  - When is Data Locality used?
  - What are the trade-offs of Data Locality?
---

## Definition

Data locality is the principle of placing computation (queries, processing) close to where the data resides, rather than moving large data sets across the network.

## Core concept

By co-locating computation with data, systems reduce network transfer and latency. For example, in Hadoop/Spark, tasks are scheduled on nodes that already store the data block.

## Use cases

Big data processing (Hadoop, Spark), edge computing, and distributed databases optimize by moving small computations to data (e.g., map tasks) rather than shuffling large volumes of data.

## Trade-offs

To exploit locality, data must be partitioned effectively. In some cases, data might be replicated to achieve locality. If data is poorly distributed, locality gains are limited.

## Example

A Spark job runs its map tasks on nodes holding the input files (HDFS blocks).

## References

“Data locality is the process of moving computation to the node where the data resides”[[\[33\]](https://www.thoughtworks.com/insights/decoder/d/data-locality "Data locality | Thoughtworks")](https://www.thoughtworks.com/insights/decoder/d/data-locality "Data locality | Thoughtworks").
