---
title: Schema Evolution
description: Schema evolution refers to managing changes to the database schema over time without disrupting services.
questions:
  - What is Schema Evolution?
  - When is Schema Evolution used?
  - What are the trade-offs of Schema Evolution?
---

## Definition

Schema evolution refers to managing changes to the database schema over time without disrupting services.

## Core concept

Techniques include adding nullable columns, versioned schemas, or using schema-on-read systems. In Avro/Protobuf, adding fields with defaults allows compatibility.

## Use cases

Microservices migrating from one schema version to next without downtime.

## Trade-offs

Complexity in migration scripts, ensuring backward compatibility.
