---
title: ACID
description: 'ACID is an acronym for database transaction properties: Atomicity, Consistency, Isolation, Durability.'
questions:
  - What is ACID?
  - When is ACID used?
  - What are the trade-offs of ACID?
---

## Definition

ACID is an acronym for database transaction properties: Atomicity, Consistency, Isolation, Durability.

Atomicity: All changes in a transaction happen, or none do (all-or-nothing).

Consistency: Transactions move the database from one valid state to another, preserving all rules/constraints.

Isolation: Concurrent transactions do not interfere; intermediate states are invisible to others.

Durability: Once a transaction commits, its changes persist even after crashes.

## Core concept

ACID ensures safe, predictable transactions in relational databases. Each transaction is a unit of work that appears indivisible.

## Use cases

Financial systems, order processing, any application where accuracy is critical.

## Trade-offs

ACID (especially strict consistency and isolation) can hurt performance and scalability in distributed systems. Many NoSQL systems relax ACID.

## Example

In banking, transferring money involves multiple updates; ACID ensures that either both accounts update or neither does, never leaving money in limbo.

## References

Neo4j’s explanation of ACID components[\[17\]](https://neo4j.com/blog/graph-database/acid-vs-base-consistency-models-explained/ "Data Consistency Models: ACID vs. BASE Databases Exp…").
