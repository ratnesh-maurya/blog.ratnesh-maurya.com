---
title: Throttling and Rate Limiting
description: Throttling controls resource usage by limiting the rate of requests. Rate limiting enforces a maximum number of requests in a time window to protect services from overload and abuse.
questions:
  - What is Throttling and Rate Limiting?
  - When is Throttling and Rate Limiting used?
  - What are the trade-offs of Throttling and Rate Limiting?
---

## Definition

Throttling controls resource usage by limiting the rate of requests a client can make. Rate limiting enforces a maximum number of requests within a time window, returning errors or delaying excess requests.

## How it works

Rate limiting tracks the number of requests from each client (identified by API key, IP address, or user ID) within a sliding or fixed time window. When a client exceeds the allowed threshold, the server responds with HTTP 429 (Too Many Requests) and typically includes a `Retry-After` header.

Two common algorithms power rate limiting. The **token bucket** algorithm maintains a bucket of tokens that refills at a fixed rate. Each request consumes one token. When the bucket is empty, requests are rejected until tokens refill. This allows short bursts up to the bucket capacity. The **sliding window** algorithm counts requests in a rolling time window (e.g., the last 60 seconds). It provides smoother enforcement than fixed windows, which can allow double the rate at window boundaries.

Throttling is the broader term — it can also mean slowing down responses (adding latency) rather than outright rejecting requests, or progressively degrading service quality as load increases. Rate limiting is a specific form of throttling.

## When to use it

- **Public APIs** — Protect backend services from abusive clients. GitHub's API limits unauthenticated requests to 60/hour; authenticated to 5,000/hour.
- **Login endpoints** — Prevent brute-force password attacks by limiting attempts per IP (e.g., 5 attempts per minute).
- **Internal service-to-service calls** — Prevent a runaway service from overwhelming a downstream dependency.
- **Database connection pools** — Throttle the rate at which new connections are opened to prevent exhausting the pool.

## Trade-offs

**Gains:** Prevents cascading failures, protects shared infrastructure, ensures fair resource distribution across clients, and mitigates denial-of-service attacks.

**Costs:** Legitimate users can be blocked during traffic spikes. Distributed rate limiting (across multiple API gateway instances) requires shared state (typically Redis), adding latency and a new failure point. Setting limits too low hurts usability; too high defeats the purpose.

## Example

A Redis-backed token bucket in a Go middleware:

```go
func RateLimit(redisClient *redis.Client, limit int, window time.Duration) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            key := "ratelimit:" + r.RemoteAddr
            count, _ := redisClient.Incr(r.Context(), key).Result()
            if count == 1 {
                redisClient.Expire(r.Context(), key, window)
            }
            if count > int64(limit) {
                w.Header().Set("Retry-After", "60")
                http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
                return
            }
            next.ServeHTTP(w, r)
        })
    }
}
```

## Related terms

Backpressure applies similar flow control inside streaming systems. Circuit breaker stops calling a failing service entirely rather than throttling. Load balancing distributes requests across servers but doesn't limit volume.
