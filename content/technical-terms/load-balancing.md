---
title: Load Balancing
description: Load balancing distributes incoming network requests across multiple servers to prevent overload, improve response times, and provide fault tolerance through redundancy.
questions:
  - What is Load Balancing?
  - When is Load Balancing used?
  - What are the trade-offs of Load Balancing?
---

## Definition

Load balancing distributes incoming requests or connections across multiple backend servers so that no single server becomes a bottleneck while others sit idle.

## How it works

A load balancer sits between clients and a pool of backend servers. When a request arrives, the load balancer selects a server based on an algorithm and forwards the request. Common algorithms include:

- **Round-robin** — Requests cycle through servers sequentially (A, B, C, A, B, C...). Simple but ignores server load.
- **Least connections** — Routes to the server with the fewest active connections. Better for long-lived connections (WebSockets, database queries).
- **Weighted round-robin** — Assigns a weight to each server based on capacity. A server with weight 3 gets three times the traffic of weight 1.
- **IP hash** — Hashes the client IP to consistently route the same client to the same server. Useful for session affinity.

Load balancers operate at different OSI layers. **L4 (transport)** load balancers route based on IP and port — fast but no content awareness. **L7 (application)** load balancers inspect HTTP headers, URLs, and cookies — slower but can route `/api/*` to API servers and `/static/*` to CDN origin servers.

Health checks run continuously against each backend (typically HTTP GET to `/healthz`). If a server fails health checks, the load balancer stops sending traffic to it until it recovers.

## When to use it

- **Web application clusters** — 10 Nginx instances behind an AWS ALB serving 50K requests/second.
- **Database read replicas** — PgBouncer or ProxySQL distributing read queries across PostgreSQL replicas.
- **Microservices** — Envoy or Istio sidecar proxies load-balance gRPC calls between service instances within a Kubernetes cluster.
- **Global traffic distribution** — DNS-based load balancing (AWS Route 53, Cloudflare) routes users to the nearest regional cluster.

## Trade-offs

**Gains:** Higher throughput, lower latency (requests go to less-loaded servers), fault tolerance (failed servers are removed from the pool automatically), and the ability to perform rolling deployments with zero downtime.

**Costs:** The load balancer itself can be a single point of failure — mitigated by running multiple load balancers in active-passive or active-active configurations. Adds a network hop (~1ms latency). Session affinity (sticky sessions) reduces the effectiveness of load distribution. L7 load balancers add TLS termination overhead.

## Example

An Nginx load balancer config:

```nginx
upstream api_servers {
    least_conn;
    server 10.0.1.10:8080 weight=3;
    server 10.0.1.11:8080 weight=2;
    server 10.0.1.12:8080 weight=1;
}

server {
    listen 80;
    location / {
        proxy_pass http://api_servers;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

This routes to three servers with weighted least-connections. The first server (weight 3) handles 3x more traffic than the third (weight 1), but only if it has fewer active connections.

## Related terms

Horizontal scaling adds more servers behind a load balancer. Failover is the process of switching to a backup when the primary fails — load balancers automate this via health checks. Consistent hashing is a load distribution algorithm that minimizes reassignment when servers are added or removed.
