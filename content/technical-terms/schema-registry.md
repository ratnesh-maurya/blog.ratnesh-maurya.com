---
title: Schema Registry
description: A schema registry is a centralized service that stores, versions, and enforces compatibility of data schemas in event streaming and messaging systems.
questions:
  - What is Schema Registry?
  - When is Schema Registry used?
  - What are the trade-offs of Schema Registry?
---

## Definition

A schema registry is a centralized service that stores versioned data schemas and enforces compatibility rules for producers and consumers in messaging and event streaming systems.

## How it works

Without a schema registry, producers and consumers agree on data format through tribal knowledge, documentation, or hope. A schema registry makes this contract explicit and machine-enforced.

The workflow in Confluent Schema Registry (the most widely deployed implementation) works like this: a producer serializes a message using Avro, Protobuf, or JSON Schema. Before sending the first message of a new schema version, the serializer registers the schema with the registry, which assigns it a numeric schema ID. The serializer prepends this ID (a 4-byte integer) to the message payload. On the consumer side, the deserializer reads the schema ID from the message, fetches the corresponding schema from the registry (caching it locally), and uses it to deserialize the payload.

Compatibility enforcement is the key feature. The registry checks each new schema version against previous versions according to a configured compatibility mode: `BACKWARD` (new schema can read old data), `FORWARD` (old schema can read new data), `FULL` (both directions), or `NONE` (no checks). If a producer tries to register a schema that breaks the configured compatibility, the registry returns an HTTP 409 and the message is never sent. This catches breaking changes at deploy time rather than at 3am in production.

Schema IDs are global—every schema version across all subjects gets a unique ID. This means you can inspect any message in any Kafka topic and resolve its schema without knowing which topic it came from.

## When to use it

- Running Kafka with 200+ topics and 30 teams producing events: the registry prevents team A from breaking team B's consumers by removing a required field.
- Migrating event formats incrementally—register a new version with an added field, and consumers that haven't upgraded yet continue working with the old version.
- Building a data lake where Parquet files on S3 are written using schemas fetched from the registry, ensuring all files in a partition share a compatible schema.
- Enforcing that no PII fields are added to analytics events by integrating schema review into CI/CD pipelines.

## Trade-offs

**Gains:** Compile-time and deploy-time safety against schema incompatibilities. Self-documenting data contracts. Efficient serialization (Avro with a registry produces payloads 3–10x smaller than JSON).

**Costs:** The registry becomes a critical dependency—if it goes down, producers using strict mode cannot serialize new messages. Caching mitigates this, but cold starts and cache misses will fail. Operational overhead of running and backing up the registry. Compatibility modes can feel restrictive when you genuinely need a breaking change, forcing you into a new topic or a migration pattern.

## Example

Registering and checking schema compatibility via the REST API:

```bash
# Register a new schema version
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schema": "{\"type\":\"record\",\"name\":\"Order\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"amount\",\"type\":\"double\"},{\"name\":\"region\",\"type\":[\"null\",\"string\"],\"default\":null}]}"}' \
  http://schema-registry:8081/subjects/orders-value/versions

# Check compatibility before deploying
curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schema": "..."}' \
  http://schema-registry:8081/compatibility/subjects/orders-value/versions/latest
```

## Related terms

A schema registry is the enforcement mechanism for schema evolution in streaming systems. It pairs naturally with exactly-once semantics pipelines where format correctness is as critical as delivery guarantees.
