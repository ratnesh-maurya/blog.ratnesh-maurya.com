---
title: Schema Registry
description: A schema registry is a centralized service to store and enforce data schema versions for messages/events (common in streaming systems like Kafka).
questions:
  - What is Schema Registry?
  - When is Schema Registry used?
  - What are the trade-offs of Schema Registry?
---

## Definition

A schema registry is a centralized service to store and enforce data schema versions for messages/events (common in streaming systems like Kafka).

## Core concept

Producers write data with a schema ID, consumers retrieve the schema to deserialize. Ensures forward/backward compatibility.

## Use cases

Kafka with Avro/JSON schemas.

## Trade-offs

Operational overhead of registry service, managing compatibility rules.
