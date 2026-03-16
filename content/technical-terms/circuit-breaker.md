---
title: Circuit Breaker
description: A circuit breaker stops sending requests to a failing downstream service after consecutive failures, preventing cascading failures and giving the service time to recover.
questions:
  - What is Circuit Breaker?
  - When is Circuit Breaker used?
  - What are the trade-offs of Circuit Breaker?
---

## Definition

A circuit breaker is a resilience pattern that stops calling a failing downstream service after a threshold of consecutive failures, returning an immediate error or fallback response instead of waiting for timeouts.

## How it works

The circuit breaker has three states, modeled after an electrical circuit breaker:

**Closed (normal)** — Requests flow through to the downstream service. The breaker counts consecutive failures (timeouts, HTTP 5xx responses, connection refused). When failures reach a threshold (e.g., 5 in a row), the circuit opens.

**Open (tripped)** — All requests fail immediately with a predefined error or fallback response, without attempting the downstream call. This prevents threads from blocking on timeouts and protects the upstream service's resources. The circuit stays open for a configurable duration (e.g., 30 seconds).

**Half-open (testing)** — After the open duration expires, the breaker allows a single test request through. If it succeeds, the circuit closes and normal traffic resumes. If it fails, the circuit opens again for another timeout period.

This pattern prevents cascading failures in microservice architectures. Without a circuit breaker, if Service B is slow (responding in 30 seconds instead of 200ms), Service A's thread pool fills up waiting for B's responses, and A itself becomes unresponsive — which then cascades to everything that depends on A.

## When to use it

- **Microservice-to-microservice calls** — An order service calling a payment service. If payments is down, orders should fail fast with a clear error rather than timing out.
- **External API integrations** — Calling a third-party API (Stripe, Twilio) that has intermittent outages. The circuit breaker stops hammering the failing API.
- **Database connections** — If the database is overwhelmed, a circuit breaker on the connection pool prevents queueing thousands of connection attempts.
- **Any remote call with a timeout** — HTTP, gRPC, database queries. If the call can hang, it should have a circuit breaker.

## Trade-offs

**Gains:** Prevents resource exhaustion (threads, connections, memory) during downstream outages. Reduces recovery time — the failing service isn't hit with retried requests while recovering. Provides a clear signal to upstream services that a dependency is down.

**Costs:** Adds complexity to service communication. Requires tuning: failure threshold too low causes false trips; too high delays protection. The fallback response may not be acceptable for all operations (e.g., you can't fall back on a payment charge). In distributed systems, each instance maintains its own circuit state, so detection timing varies across instances.

## Example

Using resilience4j in Java (Spring Boot):

```java
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
public PaymentResult charge(Order order) {
    return paymentClient.charge(order.getAmount(), order.getPaymentToken());
}

public PaymentResult paymentFallback(Order order, Throwable t) {
    return PaymentResult.deferred("Payment service unavailable, will retry");
}
```

Configuration:
```yaml
resilience4j.circuitbreaker:
  instances:
    paymentService:
      failure-rate-threshold: 50        # open after 50% failure rate
      minimum-number-of-calls: 10       # need at least 10 calls to evaluate
      wait-duration-in-open-state: 30s  # stay open for 30 seconds
      permitted-number-of-calls-in-half-open-state: 3
```

## Related terms

Throttling and rate limiting control request volume proactively, while circuit breakers react to observed failures. Backpressure signals producers to slow down — circuit breakers stop calling entirely. Failover switches to a backup system, which can be combined with a circuit breaker (trip the breaker, fail over to a secondary).
