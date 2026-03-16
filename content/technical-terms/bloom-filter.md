---
title: Bloom Filter
description: A Bloom filter is a space-efficient probabilistic data structure that tests set membership, answering "definitely not in set" or "possibly in set" with tunable false positive rates but zero false negatives.
questions:
  - What is Bloom Filter?
  - When is Bloom Filter used?
  - What are the trade-offs of Bloom Filter?
---

## Definition

A Bloom filter is a probabilistic data structure that tests whether an element is a member of a set. It can report false positives ("possibly in set" when it's not) but never false negatives ("definitely not in set" is always correct).

## How it works

A Bloom filter uses a bit array of `m` bits (initially all zeros) and `k` independent hash functions. To **add** an element, hash it with all `k` functions and set the corresponding `k` bit positions to 1. To **query** membership, hash the element with all `k` functions and check those positions — if all are 1, the element is "possibly present"; if any is 0, the element is "definitely not present."

False positives occur when different elements happen to set the same bit positions. The false positive rate depends on three parameters: bit array size `m`, number of hash functions `k`, and number of inserted elements `n`. The optimal `k` is `(m/n) * ln(2)`. For 1 million elements with a 1% false positive rate, you need about 9.6 million bits (1.2 MB) and 7 hash functions.

Bloom filters cannot delete elements (setting a bit to 0 might affect other elements). **Counting Bloom filters** replace each bit with a counter to support deletion, at the cost of more memory.

## When to use it

- **Database reads** — Cassandra and HBase use Bloom filters on each SSTable to check if a key might be present before reading from disk. A negative result skips the disk I/O entirely, saving ~10ms per avoided read.
- **Web caching** — CDNs use Bloom filters to track which URLs have been requested recently. A URL that's "definitely not cached" skips the cache lookup.
- **Spell checkers** — Check if a word is in the dictionary without loading the entire dictionary into memory.
- **Network security** — Firewalls check if an IP is in a blocklist. The Bloom filter fits in L1 cache and answers in nanoseconds.
- **Duplicate detection** — A streaming system checks if a message ID has been seen before, avoiding expensive database lookups for the common case (not a duplicate).

## Trade-offs

**Gains:** Extremely space-efficient — a 1% false positive Bloom filter uses ~10 bits per element, regardless of element size. Query time is O(k) — constant and fast. Perfect for "is this definitely NOT in the set?" queries that gate expensive operations.

**Costs:** Cannot delete elements (standard Bloom filter). Cannot enumerate the set — you can only test membership. False positives are unavoidable (though tunable). The filter must be sized upfront; adding more elements than planned increases the false positive rate.

## Example

```python
import hashlib

class BloomFilter:
    def __init__(self, size: int, num_hashes: int):
        self.bits = [0] * size
        self.size = size
        self.num_hashes = num_hashes

    def _hashes(self, item: str):
        for i in range(self.num_hashes):
            h = int(hashlib.sha256(f"{item}{i}".encode()).hexdigest(), 16)
            yield h % self.size

    def add(self, item: str):
        for pos in self._hashes(item):
            self.bits[pos] = 1

    def might_contain(self, item: str) -> bool:
        return all(self.bits[pos] for pos in self._hashes(item))

bf = BloomFilter(size=10_000, num_hashes=7)
bf.add("user:42")
bf.might_contain("user:42")  # True (correct)
bf.might_contain("user:99")  # False (correct — definitely not in set)
```

## Related terms

LSM-tree storage engines (Cassandra, RocksDB) use Bloom filters on each SSTable to avoid unnecessary disk reads. Caching serves a similar purpose — avoiding expensive lookups — but stores the actual data rather than just membership information. Consistent hashing distributes keys across nodes, while Bloom filters test key existence within a node.
