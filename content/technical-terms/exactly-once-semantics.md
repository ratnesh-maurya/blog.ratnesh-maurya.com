---
title: Exactly-Once Semantics
description: Exactly-once semantics guarantees that a message or operation is processed once and only once, despite retries, crashes, and network failures.
questions:
  - What is Exactly-Once Semantics?
  - When is Exactly-Once Semantics used?
  - What are the trade-offs of Exactly-Once Semantics?
---

## Definition

Exactly-once semantics guarantees that a message or operation is processed once and only once, even in the presence of retries, crashes, and network failures.

## How it works

True exactly-once delivery is impossible in theory (the Two Generals Problem proves this), so practical systems achieve exactly-once *processing* through a combination of at-least-once delivery plus idempotent handling on the consumer side.

Kafka's approach (since version 0.11) uses **idempotent producers** and **transactional APIs**. Each producer gets a Producer ID (PID) and tags every message with a monotonically increasing sequence number. The broker deduplicates messages with the same PID and sequence. On the consumer side, Kafka Streams commits offsets and output writes atomically using transactions—if the consumer crashes mid-processing, the uncommitted transaction is aborted, and reprocessing starts from the last committed offset.

Flink takes a different approach with **distributed snapshots** (the Chandy-Lamport algorithm). It periodically injects barrier markers into the data stream. When all operators have received a barrier, Flink checkpoints their state to durable storage (S3, HDFS). On failure, Flink restores from the last checkpoint and replays input from that point. Since source offsets and operator state are checkpointed together, no record is processed twice or skipped.

Both approaches require the **sink** to be idempotent or transactional. Writing to a database with a unique constraint on a message ID, or using upserts keyed on a deduplication ID, ensures that even if a write is retried, the result is the same.

## When to use it

- Processing payment events from a Kafka topic where a duplicate charge would cost real money.
- Aggregating ad impression counts where double-counting directly inflates billing.
- Updating inventory levels in an e-commerce system—processing an order event twice would decrement stock below actual levels.
- ETL pipelines writing to a data warehouse where duplicated rows break downstream analytics.

## Trade-offs

**Gains:** Correctness guarantees that eliminate an entire category of bugs. No need for manual reconciliation or after-the-fact deduplication jobs.

**Costs:** Higher latency—Kafka transactions add ~5–20ms overhead per batch. Throughput drops because writes are coordinated. Flink checkpointing pauses processing briefly during barrier alignment. The system also needs durable state storage for deduplication IDs or checkpoint data, increasing infrastructure cost. And the complexity is real: debugging a failed transaction across a Kafka Streams topology is significantly harder than debugging a simple consumer.

## Example

Kafka producer configured for exactly-once:

```java
Properties props = new Properties();
props.put("bootstrap.servers", "broker1:9092");
props.put("enable.idempotence", "true");
props.put("transactional.id", "payment-processor-1");
props.put("acks", "all");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions();
producer.beginTransaction();
producer.send(new ProducerRecord<>("payments-out", key, value));
producer.sendOffsetsToTransaction(offsets, consumerGroupId);
producer.commitTransaction();
```

## Related terms

Exactly-once processing depends on idempotency at the sink layer. It is often paired with a schema registry to ensure message format consistency across the pipeline.
