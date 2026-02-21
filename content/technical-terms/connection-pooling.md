---
title: Connection Pooling
description: 'Connection pooling maintains a pool of open database connections that can be reused, reducing the overhead of opening/closing connections.'
questions:
  - What is Connection Pooling?
  - When is Connection Pooling used?
  - What are the trade-offs of Connection Pooling?
---

## Definition

Connection pooling maintains a pool of open database connections that can be reused, reducing the overhead of opening/closing connections.

## Core concept

Opening a DB connection is costly (network handshake, auth). A pool holds a number of ready connections. When an app needs to query, it takes a connection from the pool, uses it, and returns it. This amortizes the cost of connecting.

## Use cases

Any persistent application server (Java, Node.js, Go) uses connection pools for its DB client. High-traffic services that repeatedly query the DB see huge benefits.

## Trade-offs

Pools consume resources (each connection uses server memory). If too many connections are open, it can overload the DB. Pool sizing and timeouts must be tuned carefully.

Example (Go with pgx):

config, _ := pgxpool.ParseConfig(databaseURL)config.MaxConns = 10pool, _ := pgxpool.ConnectConfig(context.Background(), config)

This creates a pool of up to 10 Postgres connections, reused across queries.

## References

“Connection pooling is a way to reduce cost of opening/closing connections by maintaining a pool of open connections that can be passed from operation to operation”[[\[41\]](https://www.cockroachlabs.com/blog/what-is-connection-pooling/ "What is connection pooling, and why should you care")](https://www.cockroachlabs.com/blog/what-is-connection-pooling/ "What is connection pooling, and why should you care").
