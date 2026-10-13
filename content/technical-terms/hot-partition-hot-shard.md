---
title: Hot Partition (Hot Shard)
description: 'A hot partition (or hot shard/key) is a partition that receives a disproportionate share of reads or writes, saturating the node that owns it while the rest of the cluster sits mostly idle.'
questions:
  - What is Hot Partition (Hot Shard)?
  - What causes a Hot Partition (Hot Shard)?
  - How do you fix a Hot Partition (Hot Shard), and what does each fix cost?
---

## Definition

A hot partition (also called a hot shard or hot key) is a partition of data that receives a disproportionately large share of reads or writes. The node that owns it runs out of CPU, disk I/O or network capacity while the other nodes have plenty to spare.

## How it works

A partitioned database spreads data across nodes by a **partition key**. Hash partitioning runs the key through a hash function; range partitioning assigns contiguous key ranges to each node. Either way, every request for a given key goes to the one partition that owns it. Adding nodes only helps if the traffic is spread across many keys.

A partition turns hot for a few well-known reasons:

- **Low-cardinality keys.** Partitioning by `country` or `status` gives only a handful of distinct values, and one of them (the biggest country, the `pending` status) usually dominates.
- **Monotonically increasing keys.** In a range-partitioned store, keys like timestamps or auto-increment IDs send every new write to the partition holding the end of the range. Hashing the key avoids this, but then range scans by time are no longer cheap.
- **Celebrity or viral keys.** Even with a good key, one popular user, product or post can attract more traffic than a single partition can serve.
- **Uneven range splits.** If range boundaries do not match the real key distribution, one range simply holds more of the active data.

The symptom is lopsided metrics: one node shows high CPU, I/O wait, queueing or throttled requests, while its peers are quiet. Latency on that node rises, and client retries can push it further over the edge.

## When to use it

The concept matters whenever data is partitioned:

- **Choosing a partition key** — pick a key with many distinct values and evenly spread access, and check how the busiest key will behave, not just the average.
- **Time-series and event data** — writes cluster on "now", so designs add a bucket or shard number to the time key.
- **Social and e-commerce workloads** — celebrity accounts and flash sales concentrate traffic on a few keys.
- **Capacity investigations** — when a cluster is throttling while overall utilisation looks low, a hot partition is the first thing to rule out.

## Trade-offs

Every fix moves cost somewhere else:

**Better key choice** fixes the cause, but changing a partition key usually means migrating or rewriting the data.

**Salting (key prefixing or suffixing), also called write sharding**, appends a random or computed suffix so one logical key is spread over N physical keys. Writes spread out, but reads must **scatter-gather** across all N keys and merge the results, and N is hard to change later.

**Splitting hot ranges** helps when the heat is spread over many keys in a range. It does nothing for a single hot key, because one key cannot be split.

**Caching hot reads** in front of the database absorbs read-heavy hot keys, at the price of staleness and invalidation work. It does not help hot writes.

**Adaptive capacity** in some managed stores shifts throughput towards busy partitions or splits them automatically. It reacts after the fact and still cannot exceed what one partition can handle for a single key.

## Example

An events table keyed by date sends every write for today to one partition. Salting the key with a shard number spreads the day across eight partitions (eight is an example value):

```python
import random

SHARDS = 8  # example value

# Hot: every write for today lands on one partition
def hot_key(event):
    return event["date"]                  # "2026-10-13"

# Salted: one day spread over SHARDS partitions
def salted_key(event):
    return f'{event["date"]}#{random.randrange(SHARDS)}'

# The cost: reads must query every shard and merge
def read_day(db, date):
    keys = [f"{date}#{i}" for i in range(SHARDS)]
    return [row for k in keys for row in db.query(k)]
```

If a single entity is hot instead (one user), the suffix can be derived from something like the request ID, and reads of that user then fan out the same way.

## Related terms

Data skew is the broader problem of uneven data or work distribution, and a hot partition is its most visible form. Hash partitioning and range partitioning determine how keys map to partitions, and each fails in a different way. Time-series partitioning has to deal with the "latest bucket" hot spot by design. Consistent hashing and resharding move data between nodes, which helps when many keys are hot but not when one key is. Caching is the usual first fix for read-heavy hot keys.
