---
title: Idempotency
description: Idempotency means an operation produces the same result whether executed once or multiple times, making retries safe in distributed systems.
questions:
  - What is Idempotency?
  - When is Idempotency used?
  - What are the trade-offs of Idempotency?
---

## Definition

Idempotency means applying an operation multiple times produces the same result as applying it once, making retries safe in distributed systems where network failures and timeouts are routine.

## How it works

In HTTP, `PUT` and `DELETE` are idempotent by design. Setting a user's email to `alice@example.com` with `PUT /users/42` produces the same state whether the request executes once or five times. `POST`, by contrast, is not idempotent—submitting a payment form twice could charge the customer twice.

To make non-idempotent operations safe, systems use **idempotency keys**. The client generates a unique key (typically a UUID) and sends it with the request. The server stores this key alongside the result of the first successful execution. On subsequent requests with the same key, the server returns the stored result instead of re-executing the operation. Stripe's API implements this with the `Idempotency-Key` header—retrying a charge with the same key within 24 hours returns the original response.

At the database level, idempotency is often achieved through **upserts** (`INSERT ... ON CONFLICT DO UPDATE`) or **conditional writes** (`UPDATE ... WHERE version = $expected`). In message processing, consumers track processed message IDs in a deduplication table. Before processing a message, the consumer checks if the ID exists; if so, it skips processing. The deduplication table and the business write should happen in the same database transaction to avoid partial failures.

## When to use it

- Payment APIs: Stripe, PayPal, and Adyen all require idempotency keys on charge requests to prevent double-billing when a client retries after a timeout.
- Webhook handlers: a payment gateway may deliver the same webhook event multiple times. The handler should check the event ID before applying side effects.
- Kafka consumers: if a consumer crashes after processing a message but before committing the offset, the message will be redelivered. Idempotent writes to the downstream database prevent duplicates.
- Infrastructure provisioning: Terraform's `apply` is designed to be idempotent—running it twice with the same config produces the same infrastructure state.

## Trade-offs

**Gains:** Safe retries across the entire stack. Clients can retry aggressively without causing data corruption. Simplifies error handling—instead of complex "did it succeed or not?" logic, just retry.

**Costs:** Requires a deduplication store (table, Redis set, or in-memory cache) that must be fast and durable. The store needs a TTL or cleanup policy—Stripe expires idempotency keys after 24 hours. For high-throughput systems, the dedup lookup adds latency per request (typically 1–5ms with Redis). Designing every write path to be idempotent takes discipline; it is easy to miss edge cases like partial failures in multi-step operations.

## Example

Idempotent payment endpoint using a deduplication key in Python/FastAPI:

```python
@app.post("/charges")
async def create_charge(charge: ChargeRequest, idempotency_key: str = Header()):
    existing = await db.fetch_one(
        "SELECT response FROM idempotency_keys WHERE key = $1", idempotency_key
    )
    if existing:
        return JSONResponse(content=json.loads(existing["response"]))

    result = await payment_gateway.charge(charge.amount, charge.currency)

    await db.execute(
        "INSERT INTO idempotency_keys (key, response, created_at) VALUES ($1, $2, NOW())",
        idempotency_key, json.dumps(result),
    )
    return result
```

## Related terms

Idempotency is the foundation of exactly-once semantics—without idempotent consumers, exactly-once delivery guarantees are meaningless. It is also critical during data migration, where retrying failed migration batches must not create duplicate records.
