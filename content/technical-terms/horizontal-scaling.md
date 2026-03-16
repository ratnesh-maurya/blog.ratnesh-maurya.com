---
title: Horizontal Scaling
description: Horizontal scaling (scale-out) adds more machines to a system to handle increased load, distributing work across nodes rather than upgrading a single server.
questions:
  - What is Horizontal Scaling?
  - When is Horizontal Scaling used?
  - What are the trade-offs of Horizontal Scaling?
---

## Definition

Horizontal scaling (scale-out) increases system capacity by adding more machines to a cluster, distributing the workload across multiple nodes rather than upgrading a single server's hardware.

## How it works

In a horizontally scaled system, incoming requests or data are distributed across multiple servers that each handle a portion of the total load. A load balancer routes requests to available nodes, and data is partitioned (sharded) so each node stores a subset.

Adding capacity means adding nodes. If a web application runs on 4 servers and traffic doubles, you deploy 4 more servers behind the same load balancer. The application code doesn't change — the infrastructure scales. Cloud platforms like AWS Auto Scaling Groups and Kubernetes Horizontal Pod Autoscaler automate this: they monitor CPU, memory, or custom metrics and add or remove instances based on thresholds.

Horizontal scaling works best when the workload is stateless or can be partitioned. Stateless web servers are trivially horizontally scalable — any server can handle any request. Databases are harder: they require sharding strategies (hash partitioning, range partitioning) to split data across nodes, and cross-shard queries become complex.

## When to use it

- **Web application servers** — Stateless API servers behind a load balancer. Kubernetes scales pods from 3 to 30 based on request rate.
- **Distributed databases** — Cassandra, CockroachDB, and MongoDB scale by adding nodes to the cluster. Each node handles reads and writes for its partition range.
- **Message processing** — Kafka consumer groups add consumers to increase throughput. Each consumer handles a subset of partitions.
- **CDN edge servers** — Content is cached across hundreds of edge nodes worldwide. More nodes = lower latency for more users.

## Trade-offs

**Gains:** Near-linear capacity growth. No hardware ceiling — you can always add more machines. Fault tolerant — losing one node out of 20 degrades capacity by 5%, not 100%.

**Costs:** Application must be designed for distribution (stateless services, partitioned data). Inter-node communication adds network latency. Consistency becomes harder — distributed consensus protocols (Raft, Paxos) are required for coordinated state. Operational complexity increases (more machines to monitor, deploy, and patch).

## Example

Kubernetes HPA scaling a deployment:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

When average CPU across pods exceeds 70%, Kubernetes adds pods up to 50. When load drops, it scales back to 3.

## Related terms

Vertical scaling takes the opposite approach — upgrading a single machine's CPU, RAM, or disk. Load balancing distributes requests across horizontally scaled nodes. Consistent hashing minimizes data movement when nodes are added or removed.
