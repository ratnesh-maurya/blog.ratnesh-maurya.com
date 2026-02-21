---
title: High Availability (HA)
description: High availability means a system is continuously operational and accessible with minimal downtime (often 99.99% uptime or better).
questions:
  - What is High Availability (HA)?
  - When is High Availability (HA) used?
  - What are the trade-offs of High Availability (HA)?
---

## Definition

High availability means a system is continuously operational and accessible with minimal downtime (often 99.99% uptime or better).

## Core concept

HA designs avoid single points of failure by using redundancy (multiple nodes, replicas), automatic failover, and distributed architectures. The goal is close to “always on” operation.

## Use cases

Critical services like banking, healthcare, cloud services (AWS, Azure) use HA to meet SLAs. Databases can use clustering, replication, and load balancing for HA.

## Trade-offs

HA adds cost and complexity: extra hardware, more complex architecture, and sophisticated monitoring. But it prevents service outages.

## Example

A highly available web app might run on multiple servers behind a load balancer; if one fails, traffic shifts to others seamlessly.

## References

HA defined as being “accessible and reliable close to 100% of the time”[[\[37\]](https://www.ibm.com/think/topics/high-availability "What is High Availability? | IBM")](https://www.ibm.com/think/topics/high-availability "What is High Availability? | IBM").
