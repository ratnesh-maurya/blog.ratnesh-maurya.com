---
title: Consistent Hashing
description: Consistent hashing is a technique to distribute keys across nodes so that minimal keys need to be moved when nodes join/leave.
questions:
  - What is Consistent Hashing?
  - When is Consistent Hashing used?
  - What are the trade-offs of Consistent Hashing?
---

## Definition

Consistent hashing maps both keys and nodes onto the same hash ring so that adding or removing a node only redistributes a fraction of the keys, rather than reshuffling all of them.

## How it works

Imagine a circular space of hash values from 0 to 2^32 − 1. Each node is hashed to a position on this ring. Each key is also hashed, and assigned to the first node encountered when walking clockwise from the key's position. When a node leaves, only the keys that were assigned to it move to the next clockwise node. When a node joins, it takes over a portion of its clockwise neighbor's keys.

In practice, raw consistent hashing produces uneven load because nodes land at arbitrary positions. The fix is **virtual nodes** (vnodes): each physical node gets 100–200 positions on the ring. This smooths the distribution. Cassandra, for example, defaults to 256 vnodes per node. DynamoDB uses a similar partitioning strategy internally.

The hash function matters. A cryptographic hash like SHA-1 gives uniform distribution but costs CPU. A faster hash like xxHash or MurmurHash3 is common in production systems where nanoseconds count per lookup.

## When to use it

- **Distributed caches**: Memcached pools and Redis clusters use consistent hashing to route keys. When a cache node dies, only ~1/N of keys are invalidated instead of all of them.
- **Sharded databases**: Vitess and CockroachDB use hash-range partitioning derived from consistent hashing principles.
- **Load balancers**: Envoy and HAProxy offer consistent hashing for session-sticky routing—requests from the same client IP always hit the same backend.
- **CDNs**: Akamai's original architecture was built on consistent hashing to map URLs to edge servers.

## Trade-offs

**Gains**: Minimal key movement during scaling events. O(log N) lookup with a sorted ring. Graceful degradation—losing one node affects only its key range.

**Costs**: Virtual nodes add memory overhead (a ring with 50 physical nodes × 200 vnodes = 10,000 ring entries). Rebalancing is still not zero—if a node holds 100 GB of data and leaves, that data must transfer to its successor. Hot keys (e.g., a viral tweet's cache key) still concentrate on one node regardless of how the ring is structured.

## Example

A simplified consistent hash ring in Python:

```python
import hashlib
import bisect

class ConsistentHash:
    def __init__(self, nodes, vnodes=150):
        self.ring = []
        self.node_map = {}
        for node in nodes:
            for i in range(vnodes):
                h = int(hashlib.md5(f"{node}:{i}".encode()).hexdigest(), 16)
                self.ring.append(h)
                self.node_map[h] = node
        self.ring.sort()

    def get_node(self, key):
        h = int(hashlib.md5(key.encode()).hexdigest(), 16)
        idx = bisect.bisect_right(self.ring, h) % len(self.ring)
        return self.node_map[self.ring[idx]]

ring = ConsistentHash(["cache-1", "cache-2", "cache-3"])
print(ring.get_node("user:9281"))  # deterministic node assignment
```

## Related terms

Consistent hashing is often combined with data skew mitigation strategies and is closely related to federation patterns for distributing workloads. CDC pipelines frequently sit downstream of consistently-hashed shards to capture changes per partition.
