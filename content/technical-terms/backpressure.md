---
title: Backpressure
description: Backpressure is a flow control mechanism where a slow consumer signals upstream producers to reduce their sending rate, preventing unbounded queue growth and resource exhaustion.
questions:
  - What is Backpressure?
  - When is Backpressure used?
  - What are the trade-offs of Backpressure?
---

## Definition

Backpressure is a flow control mechanism where a downstream consumer that can't keep up signals upstream producers to slow down, preventing unbounded queue growth and out-of-memory crashes.

## How it works

In any pipeline where data flows from producers to consumers, the consumer's processing speed may be slower than the producer's sending speed. Without backpressure, unprocessed messages accumulate in buffers or queues until memory is exhausted and the system crashes.

Backpressure inverts this dynamic. The consumer communicates its capacity upstream — either explicitly (by requesting a specific number of items, as in Reactive Streams) or implicitly (by blocking on a full channel, as in Go's buffered channels). When the producer receives this signal, it slows down, buffers locally, or drops messages according to a policy.

There are three common strategies: **block** (producer waits until the consumer is ready — simplest but can stall the entire pipeline), **drop** (newest or oldest messages are discarded — used when freshness matters more than completeness), and **sample** (only every Nth item is processed — common in metrics and monitoring).

## When to use it

- **Stream processing pipelines** — Kafka consumers apply backpressure by controlling how fast they poll. If processing is slow, the consumer simply polls less frequently, and Kafka retains messages on disk.
- **HTTP APIs under load** — A service returns 503 with a Retry-After header when its internal queue is full, pushing backpressure to the client.
- **Go channel pipelines** — A buffered channel of capacity N blocks the sender when full, naturally applying backpressure.
- **Database write batching** — When bulk-inserting rows, backpressure from the database (connection timeouts, slow commits) signals the application to reduce batch size or frequency.

## Trade-offs

**Gains:** Prevents OOM crashes, keeps latency predictable under load, and avoids cascading failures where one slow component brings down the entire pipeline.

**Costs:** Adds complexity to the producer (must handle slow-down signals gracefully). Can cause cascading slowdowns if not bounded — backpressure from service C slows service B, which slows service A, which slows the user-facing API. Setting appropriate buffer sizes and timeout policies requires tuning.

## Example

Backpressure with a Go buffered channel:

```go
jobs := make(chan Job, 100) // buffer of 100

// Producer — blocks when channel is full
go func() {
    for _, item := range items {
        jobs <- item // backpressure: blocks here if consumer is slow
    }
    close(jobs)
}()

// Consumer — processes at its own pace
for job := range jobs {
    process(job)
}
```

When the consumer is slow, the channel fills to 100 and the producer blocks — no memory growth, no crash.

## Related terms

Throttling and rate limiting apply similar flow control at the API level. Circuit breaker stops calling a failing downstream entirely. Load balancing distributes work across consumers to reduce the need for backpressure.
