---
title: Federation
description: 'Federation refers to a setup where multiple autonomous databases or services coordinate to respond to queries, often by delegating parts of a query to…'
questions:
  - What is Federation?
  - When is Federation used?
  - What are the trade-offs of Federation?
---

## Definition

Federation refers to a setup where multiple autonomous databases or services coordinate to respond to queries, often by delegating parts of a query to different sources, but without a shared storage layer.

## Core concept

Often used in multi-tenant SaaS: each tenant has its own DB, and a proxy layer (federation engine) routes queries to the correct shard. The data is not physically unified.

## Use cases

SaaS scaling, horizontal sharding with independent nodes.

## References

Typical concept in distributed DB, no specific source.
