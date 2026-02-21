# Indexing

**Definition:** A database **index** is a data structure that improves the speed of data retrieval on a table at the cost of additional writes and storage. It works like a book’s index: instead of scanning every row, the database can use the index to quickly locate relevant entries【4†L170-L172】. Common index structures are B-trees and hash tables (see B-tree below).

**Core concept:** An index maintains sorted keys (e.g. column values) with pointers to data rows. For example, a B-tree index on a `user_id` column can locate a row in logarithmic time. Creating an index on a column means the database will maintain an ordered copy of that column’s data. When a query filters by that column, the database uses the index to jump near the matching rows, rather than scanning the whole table【4†L170-L172】【6†L178-L182】.

**Use cases:** Indexes are most useful for read-heavy workloads with frequent queries on specific columns (e.g., searching by user name, timestamp, or foreign key). They speed up **WHERE** clause filtering and **ORDER BY** operations. For example, a secondary (non-primary) index on `email` in a users table allows quick user lookup by email. Composite indexes span multiple columns (e.g. `(last_name, first_name)`) to optimize queries that filter or sort on all those columns【79†L135-L139】【79†L136-L139】.

**Trade-offs:** Indexes slow down writes (INSERT/UPDATE/DELETE) because the index must be updated in addition to the table. They also consume space. Over-indexing can hurt performance due to extra maintenance cost. However, smart indexing yields huge read-speed gains.

**Example (MySQL):**
```sql
-- Create an index on the "email" column
CREATE INDEX idx_users_email ON users (email);
```
The database will maintain a B-tree (by default in MySQL) on `users.email`, enabling fast lookups by email.

*References:* Index definitions in database docs【4†L170-L172】; characteristics of composite vs. secondary indexes【79†L135-L139】【79†L117-L120】.

# Clustering

**Definition:** In databases, **clustering** can refer to either grouping similar data together or deploying multiple nodes for scalability/HA. A *database cluster* is a set of database instances (often across multiple machines) working together to serve applications【16†L153-L159】. Clustering typically implies replication and distribution of data across nodes.

**Core concept:** A cluster may use data **sharding** (partitioning data across nodes) or **replication** (copies on multiple nodes) to scale and provide high availability (HA). Clustering ensures that if one node fails, others can take over.

**Use cases:** Large-scale systems (e.g. distributed SQL databases, NoSQL systems like Cassandra or MongoDB) use clusters to handle massive data volumes and throughput. Clustering enables fault tolerance: if one node or shard goes down, the cluster remains available.

**Trade-offs:** Clustering adds complexity (data consistency, network coordination) and operational overhead. You must manage data distribution (sharding keys), replication lags, and avoid “split-brain” scenarios (see below). However, clustering is essential for horizontal scaling and high availability.

**Example:** A **PostgreSQL** or **MySQL** cluster might have one primary and two secondary nodes. Writes go to the primary; reads can come from any node. If the primary fails, a secondary can be promoted (failover).

*References:* Clustering defined as connecting multiple DB instances【16†L153-L159】; cluster advantages (HA, load distribution) from distributed system literature.

# Denormalization

**Definition:** **Denormalization** is the process of intentionally adding redundancy to a database schema to improve read/query performance【18†L97-L100】. In a denormalized design, data that would normally be kept in separate related tables (normalized form) is combined or duplicated, reducing the need for costly joins.

**Core concept:** By storing pre-joined or redundant information, queries can run faster because the DB can read from a single table instead of performing multiple joins at runtime. For example, instead of separate `orders` and `customers` tables linked by a customer ID, you might add customer name and address directly to each order row.

**Use cases:** Denormalization is useful in read-heavy systems (like reporting or OLAP) where join operations become a bottleneck. Data warehouses and analytics often use denormalized schemas (e.g., star schema) to speed up query performance. Caching aggregated or joined data as separate tables (materialized views) is a form of denormalization.

**Trade-offs:** Denormalization improves read performance but sacrifices write performance and storage efficiency. Updates must be applied in multiple places to keep data consistent, increasing complexity. It can also lead to data anomalies if not managed carefully.

**Example:** A web application might maintain a denormalized “recent_activity” table that stores a user’s recent posts along with user name and avatar URL, so each profile page lookup doesn’t have to join `posts` and `users`.

*References:* Denormalization defined as adding redundant data to speed queries【18†L97-L100】.

# Normalization

**Definition:** **Normalization** is the process of organizing database schema to reduce redundancy and improve integrity【21†L30-L32】. Typically, data is divided into multiple tables linked by keys, following normal forms (1NF, 2NF, 3NF, etc.) so each fact is stored once.

**Core concept:** Normalization ensures that each table focuses on a single concept, and each column depends on the primary key. For example, instead of storing customer address in every order row, one would have a `customers` table (with address) and an `orders` table linking to customers by ID. This reduces duplicate data.

**Use cases:** Normalization is key in transactional (OLTP) systems where data consistency and efficient updates are important. It avoids update anomalies: changing a customer’s address happens in one place.

**Trade-offs:** Highly normalized schemas can require many joins to answer complex queries, which can slow down reads. Hence many OLTP systems use normalization up to a practical normal form, and may add some denormalized columns or indexes for performance.

**Example:** A normalized database might have tables: `users(id, name)`, `accounts(id, user_id, balance)`. The `user_id` foreign key links accounts to users, instead of duplicating user name in every account row.

*References:* Normalization defined as reducing redundancy and improving integrity【21†L30-L32】.

# Read Replicas

**Definition:** A **read replica** is a read-only copy of a database instance【23†L10-L13】. The primary database handles writes; read replicas asynchronously replicate data from the primary and serve read queries.

**Core concept:** Read replicas distribute read load. When an application needs to scale beyond one server’s capacity, it can direct SELECT queries to replicas, offloading work from the primary.

**Use cases:** High-traffic systems with many read queries (web apps, reporting) use read replicas. For instance, a social network might route timeline fetches to replicas while writes (posting) go to primary.

**Trade-offs:** Replication adds eventual consistency trade-offs: replicas lag slightly behind the primary, so a recent write might not immediately show up on a replica. Also, replicas must periodically synchronize with the primary, which adds network and I/O overhead. But read throughput and availability improve.

**Example:** **AWS RDS** lets you create a read replica. The docs state: “A read replica is a read-only copy of a DB instance. You can reduce load on the primary by routing queries to the read replica, elastically scaling beyond the capacity of a single DB instance for read-heavy workloads”【23†L10-L13】.

*References:* AWS RDS docs on read replicas【23†L10-L13】.

# Leader–Follower Replication

**Definition:** Leader–Follower (also called master-slave) replication is a strategy where one node (the **leader**) receives all write operations, and one or more follower replicas replicate the leader’s data【6†L184-L189】. Only the leader is writable; followers are read-only copies.

**Core concept:** In this model, the leader commits writes to its log, and followers read that log and apply changes. Each follower remains a consistent copy (eventually) of the leader. For example, in a relational cluster, all INSERT/UPDATE/DELETE happen on the leader, and SELECTs can be on followers.

**Use cases:** Very common in SQL databases (PostgreSQL, MySQL, Microsoft SQL) and distributed systems. Ensures a single source of truth with straightforward conflict avoidance.

**Trade-offs:** Leader-follower provides strong consistency on the leader, but followers can lag (eventual consistency). Write throughput is limited by a single leader’s capacity. If the leader fails, a follower must be promoted (failover), requiring consensus/leader election logic.

**Example:** In a PostgreSQL cluster, one server is primary (leader), and it streams WAL logs to replicas (followers). Followers apply these logs to stay up to date【6†L184-L189】.

*References:* Definition from BlueGrid: “Leader-follower: a single leader accepts writes, while followers replicate from the leader’s log”【6†L184-L189】.

# Multi-Leader Replication

**Definition:** **Multi-leader** (also called multi-master) replication allows multiple nodes (leaders) to accept writes. Data is replicated between leaders to keep them in sync【6†L178-L183】.

**Core concept:** Each leader processes write operations locally. Changes are propagated to the other leaders (e.g. via an anti-entropy process or write logs). This increases write throughput and availability (writes can go to any leader).

**Use cases:** Systems needing high write availability across regions (e.g. geo-distributed systems) or no single point of failure. For example, some Cassandra or MongoDB setups support multi-leader writes.

**Trade-offs:** Concurrency control becomes harder: if two leaders write conflicting changes to the same record, conflict resolution logic is needed. This often involves vector clocks, last-write-wins policies, or application-level reconciliation. Latency can also increase due to cross-node sync.

**Example:** **CouchDB** supports multi-master replication; writes on any node eventually replicate. The system must merge conflicts (CouchDB keeps multiple revisions of a document). BlueGrid notes: “Multi-master replication: all nodes accept writes. Improves availability/throughput but requires conflict detection/resolution”【6†L178-L183】.

*References:* Multi-leader description【6†L178-L183】.

# Quorum

**Definition:** In distributed systems, a **quorum** is the minimum number of votes (or nodes) that must agree to perform an operation. It is a technique to ensure consistency during reads and writes. For example, in a system of N nodes, one might require at least ⌈N/2⌉ nodes to agree (a majority quorum) to commit a change.

**Core concept:** Quorums avoid split-brain problems by making sure a majority (or other threshold) participates. For instance, in a replicated state machine, a write might be considered committed once a majority of replicas acknowledge it. A read might require contacting a majority to ensure it sees the latest data.

**Use cases:** Quorum-based reads/writes appear in consensus algorithms (Paxos, Raft) and in distributed databases (Cassandra, etc.). Cassandra uses *write_quorum* to require a majority of replicas to acknowledge a write, and *read_quorum* for reads.

**Trade-offs:** Higher quorums mean stronger consistency (since majority overlaps) but higher latency (must wait for more nodes). Lower quorums increase availability but risk serving stale data.

**Example:** In a 5-node cluster, a majority quorum is 3. If 3 nodes agree on a value, it’s safe.

*References:* Definition from Wikipedia: “A quorum is the minimum number of votes a distributed transaction must obtain to perform an operation”【27†L120-L123】.

# Consensus

**Definition:** **Consensus** refers to the process whereby a group of distributed nodes agree on a single value or decision. It is critical in systems that need consistency despite failures or asynchronous communication.

**Core concept:** Consensus algorithms (Paxos, Raft) ensure that, for example, only one value is chosen among proposals, even if some nodes fail. This ensures that all nodes eventually end up in the same state. In a DB, consensus can be used for leader election or commit protocols (e.g. using Paxos for a distributed commit).

**Use cases:** Consensus is at the heart of any replicated system needing fault-tolerance. For instance, selecting a new master in ZooKeeper or committing a transaction in a distributed database.

**Trade-offs:** Consensus can be complex to implement (ensuring safety and liveness). It can add communication overhead (multiple rounds). However, it provides strong consistency guarantees.

**Example:** **Raft** consensus might be used to elect a leader and commit log entries in a distributed SQL cluster.

*References:* GeeksforGeeks: “Distributed consensus… multiple nodes agree on a single value or course of action despite failures. It is crucial for consistency and reliability in decentralized environments”【29†L153-L159】.

# CAP Theorem

**Definition:** The **CAP theorem** (Brewer’s theorem) states that in the presence of a network partition, a distributed data store can only guarantee two of the following three: **Consistency**, **Availability**, and **Partition Tolerance**【30†L137-L139】.

- **Consistency** (all nodes see the same data at the same time).
- **Availability** (every request receives a response, either success or failure).
- **Partition Tolerance** (system continues to operate despite network failures between nodes).

**Core concept:** Under a network partition (P), you must choose between consistency and availability. For example, if a cluster splits, you can either allow writes on both sides (remain available but risk inconsistency) or refuse requests on some nodes (remain consistent but sacrifice availability).

**Use cases:** This theorem guides database design choices. Traditional RDBMS (like single-node DBs) prioritize C/A (no partitions). Distributed NoSQL often choose P/A (partition-tolerant and available, at cost of consistency during partitions), or C/P (sacrificing availability under partitions).

**Trade-offs:** CAP is about worst-case (partitions). Real systems try to maximize all three normally but must degrade gracefully. The theorem implies you cannot have a perfectly consistent and available system under partitions.

**Example:** During a network split, a CP system like MongoDB (with primary/replica model and majority writes) might become unavailable on one side to avoid inconsistency; an AP system like Dynamo might allow writes on both sides and reconcile later.

*References:* “CAP theorem states any distributed data store can provide at most two of: consistency, availability, partition tolerance”【30†L137-L139】.

# BASE

**Definition:** **BASE** is an acronym contrasting ACID for distributed systems: **Basically Available, Soft state, Eventually consistent**. It describes a model where availability is prioritized over strict consistency【11†L61-L64】【12†L316-L322】.

- **Basically Available:** The system guarantees availability (possibly in a degraded manner).
- **Soft state:** The state of the system may change over time, even without input, due to eventual consistency.
- **Eventual consistency:** The system will become consistent over time, assuming no new updates.

**Core concept:** BASE systems allow temporary inconsistencies to achieve higher availability and partition tolerance. Writes do not fail (even under partitions); replicas asynchronously synchronize.

**Use cases:** Many NoSQL databases (Cassandra, Dynamo, Riak) follow BASE. If an Amazon product database is highly distributed, it may allow reading slightly stale data for the sake of high availability.

**Trade-offs:** Accepts eventual consistency (reads may return stale data). There may be conflicts that need resolution. ACID guarantees are relaxed, so transaction isolation and atomicity are weaker.

**Example:** Updating a user profile might not propagate immediately to all replicas. Queries to some replicas return old info, but eventually all become the same.

*References:* “BASE stands for Basically Available, Soft state, Eventually consistent”【12†L316-L322】; AWS notes that BASE systems “prioritize availability over consistency”【11†L61-L64】.

# ACID

**Definition:** **ACID** is an acronym for database transaction properties: **Atomicity, Consistency, Isolation, Durability**【12†L255-L263】.

- **Atomicity:** All changes in a transaction happen, or none do (all-or-nothing).
- **Consistency:** Transactions move the database from one valid state to another, preserving all rules/constraints.
- **Isolation:** Concurrent transactions do not interfere; intermediate states are invisible to others.
- **Durability:** Once a transaction commits, its changes persist even after crashes.

**Core concept:** ACID ensures safe, predictable transactions in relational databases. Each transaction is a unit of work that appears indivisible.

**Use cases:** Financial systems, order processing, any application where accuracy is critical.

**Trade-offs:** ACID (especially strict consistency and isolation) can hurt performance and scalability in distributed systems. Many NoSQL systems relax ACID.

**Example:** In banking, transferring money involves multiple updates; ACID ensures that either both accounts update or neither does, never leaving money in limbo.

*References:* Neo4j’s explanation of ACID components【12†L255-L263】.

# Eventual Consistency

**Definition:** **Eventual consistency** is a weak consistency model where if no new updates are made, all replicas of data will eventually converge to the same state【32†L60-L65】.

**Core concept:** Updates may arrive at replicas at different times, so reads might get stale data for a while. However, given enough time without updates, all copies will match. This model guarantees the system will become consistent, but not immediately.

**Use cases:** Important in distributed, partition-tolerant systems (AP in CAP). E.g., DNS, Amazon’s Dynamo, Cassandra. It allows the system to remain available and partition-tolerant by allowing temporary divergence.

**Trade-offs:** Inconsistent reads are possible. The application must tolerate reading stale data for some window. Suitable for non-critical data, or where stale reads won’t cause harm.

**Example:** When updating a user’s profile, one server might show the new name instantly, while another may lag by a few seconds. Eventually, all servers reflect the update.

*References:* “Eventual consistency… after some time with no updates, all data replicas will eventually converge to a consistent state”【32†L62-L65】.

# Strong Consistency

**Definition:** **Strong consistency** means every read receives the most recent write (or an error). All nodes see the same data at the same time【34†L131-L134】.

**Core concept:** The system behaves as if there is a single copy of the data. When a client writes new data, subsequent reads (anywhere in the system) immediately reflect that write. This is achieved by coordinating reads/writes (e.g., through consensus or locking).

**Use cases:** When accurate, up-to-date data is critical (e.g., bank account balance). Many traditional RDBMS and synchronous-replication systems provide strong consistency.

**Trade-offs:** Achieving strong consistency requires synchronizing across nodes, which can increase latency and reduce availability during partitions (CP in CAP). Systems may block writes or reads until all nodes confirm the update.

**Example:** In a strongly consistent distributed KV store, once a write completes, any subsequent read (even from other node) sees the updated value.

*References:* G4G: “Strong consistency ensures all users and nodes see the same data immediately after it is updated… every read returns the most recent write”【34†L131-L134】.

# Snapshot Isolation

**Definition:** **Snapshot isolation** is a transaction isolation level where each transaction operates on a *snapshot* of the database as of the start of the transaction【38†L119-L124】. Transactions see a consistent view of data that doesn’t change during the transaction. A transaction under snapshot isolation can commit only if its writes don’t conflict with concurrent writes.

**Core concept:** Readers don’t block writers and vice versa. Each transaction sees the last committed state at its start time. Writes use versioning: on commit, if two transactions have modified the same row, one will abort (to prevent write-write conflict). This avoids many deadlocks of stricter locks.

**Use cases:** Common in modern databases (PostgreSQL’s default), providing high concurrency. Good for read-heavy workloads where you want consistency within a transaction but still allow concurrent updates.

**Trade-offs:** Snapshot isolation is not fully serializable. It can still exhibit *write skew* anomalies. It provides a strong, but not strict, guarantee. It uses more storage (versions) to support multi-version concurrency (see MVCC).

**Example:** Two transactions T1 and T2 both read a row and try to update it. Under snapshot, whichever commits first will succeed; the second will abort because its write would conflict.

*References:* “Snapshot isolation… all reads in a transaction see a consistent snapshot of the DB (values at start), and a transaction commits only if no updates conflict with concurrent writes”【38†L119-L124】.

# MVCC (Multi-Version Concurrency Control)

**Definition:** **MVCC** is a concurrency control method that keeps multiple versions of data records to allow non-blocking reads【40†L151-L156】【40†L159-L163】. Instead of locking, transactions see the version of data that was current at their start.

**Core concept:** Each update creates a new version; the old version isn’t overwritten immediately. Each transaction has a timestamp or ID and sees only versions committed before its start. Thus readers don’t block writers and vice versa.

**Use cases:** MVCC is used by many databases (PostgreSQL, Oracle, SQL Server Snapshot, CouchDB). It provides good performance for mixed read/write workloads.

**Trade-offs:** Requires storing multiple versions (increased storage, need for vacuum/cleanup). Writers still conflict on the same row (only one can commit). Requires version cleanup/gc (or compaction in some systems).

**Example:** Transaction T1 reads row X (version 1). T2 updates X to version 2 but hasn’t committed. T1 still sees version 1 throughout. After commit, new reads see version 2.

*References:* “MVCC aims at solving concurrency by keeping multiple copies… Each user sees a snapshot; changes by a writer are not visible until commit”【40†L151-L156】【40†L159-L163】.

# Two-Phase Commit (2PC)

**Definition:** **Two-phase commit** is an atomic commitment protocol for distributed transactions. A coordinator asks all involved nodes (participants) whether they can commit. If all vote “yes,” the coordinator tells them to commit; if any vote “no,” the coordinator tells all to abort【42†L143-L147】【42†L165-L172】.

**Core concept:**
1. **Prepare phase:** Coordinator asks all participants to prepare and vote (commit or abort). Each participant votes after doing local checks and logging decisions (but hasn’t committed yet).
2. **Commit phase:** If all voted commit, coordinator broadcasts commit; else, broadcast abort. Participants then apply or roll back changes.

**Use cases:** Ensures all-or-nothing across multiple resource managers (e.g. two DB shards) in one global transaction. Common in legacy distributed RDBMS.

**Trade-offs:** 2PC can block: if the coordinator or participants fail at the wrong time, other nodes may wait indefinitely (until manual intervention or timeouts). It also incurs overhead (log writes and two communication rounds). It provides atomicity but not progress under certain failures.

**Example:** Coordinating a bank transfer across two banks: each bank votes on whether it can process its side. Only if both agree, both commit.

*References:* “2PC is a distributed algorithm that coordinates processes in a distributed atomic transaction on whether to commit or abort”【42†L143-L147】 and description of phases【42†L165-L172】.

# Three-Phase Commit (3PC)

**Definition:** **Three-phase commit** is an extension of 2PC designed to reduce blocking. It adds a “pre-commit” phase so participants can make a safe decision without indefinite blocking if the coordinator fails【44†L119-L124】.

**Core concept:** 3PC introduces three stages: canCommit? (like prepare), preCommit, and doCommit/Abort. After all vote yes in phase 1, the coordinator sends a preCommit message (indicating readiness). Once participants ack, the coordinator finally sends commit. This way, if the coordinator crashes after preCommit but before doCommit, participants know everyone was ready and can elect a new coordinator to finish commit.

**Use cases:** More theoretical than widely used; it aims to make distributed commits non-blocking even on coordinator failure.

**Trade-offs:** Still not entirely failure-proof (it assumes timely failures and non-crash; truly asynchronous networks can break it). It adds complexity and extra messages vs 2PC.

**Example:** Not commonly implemented in off-the-shelf databases, but a system using 3PC would avoid having participants wait forever if the coordinator dies after saying “pre-commit.”

*References:* “3PC ensures all nodes agree to commit/abort; it improves on 2PC by eliminating indefinite blocking via a *prepared to commit* state”【44†L119-L124】.

# Write-Ahead Logging (WAL)

**Definition:** **Write-Ahead Logging** is a technique where changes are first recorded in a log before being applied to the database files【49†L133-L141】. It ensures atomicity and durability.

**Core concept:** Before modifying any database page, the DB writes a log record describing the change to a durable log on disk. If a crash occurs, the log can be replayed to redo (or undo) changes. Only after the log write completes is the change applied in memory. This way, no committed change is lost.

**Use cases:** All major RDBMS use WAL. It is fundamental to transaction durability and crash recovery.

**Trade-offs:** Writing to the log introduces overhead (fsync costs), but it’s essential for safe commits.

**Example:** In PostgreSQL (and SQLite, SQL Server, etc.), an INSERT will generate a log entry in the WAL file before the row is inserted in the data file. Only once the log is on disk does the transaction commit.

*References:* “WAL is a family of techniques for atomicity and durability. A write-ahead log is an append-only log on stable storage: changes are first recorded in the log, before writing to the database”【49†L133-L141】.

# Checkpointing

**Definition:** **Checkpointing** is the process of flushing all committed changes from the write-ahead log (WAL) to the main database storage, and then clearing the log【49†L169-L172】.

**Core concept:** Without checkpoints, the log would grow indefinitely. Periodically (or when the log reaches a threshold), the DB writes all in-memory changes to disk and marks a checkpoint. This means everything before that point is safely on disk, so the log can be truncated.

**Use cases:** All WAL-based systems do checkpointing (Postgres, SQLite, etc.). Checkpoints shorten recovery time.

**Trade-offs:** Checkpoint operations can cause write bursts and latency when flushing pages. Tuning checkpoint frequency balances performance vs recovery time.

**Example:** PostgreSQL’s `CHECKPOINT` writes all dirty pages to disk. After checkpoint, WAL segments before that point can be archived or deleted.

*References:* “After a certain number of operations, perform a checkpoint: write all changes in the WAL to the database and clear the log”【49†L169-L172】.

# Compaction

**Definition:** **Compaction** is the process of merging and recycling data files to reclaim space and improve read performance, especially in Log-Structured Merge (LSM) tree systems【53†L1-L4】【52†L37-L44】.

**Core concept:** In LSM-based stores (Cassandra, RocksDB, etc.), data is written to immutable files (SSTables). Over time, these files accumulate overlapping key ranges and duplicate/deleted entries. Compaction periodically merges older files, discards obsolete versions, and creates consolidated sorted files. This reduces storage bloat and read amplification.

**Use cases:** Databases using LSM trees (Cassandra, HBase, Scylla, etc.) rely on compaction. It’s essential for garbage collecting deleted data and optimizing queries.

**Trade-offs:** Compaction uses CPU, I/O, and memory; it can impact write throughput temporarily. Different strategies (size-tiered vs leveled) have different read/write amplification trade-offs. However, compaction is necessary to avoid unbounded storage growth.

**Example:** Cassandra runs compaction tasks to merge SSTables. After many updates/deletes, a manual or automatic compaction would consolidate data so that reads only hit a few large sorted files.

*References:* “Compaction is used for garbage collection and merge sort on data, necessary for an LSM-Tree system”【53†L1-L4】; introduced “to optimize read performance and space by recycling old data and merging multiple layers”【52†L37-L44】.

# Rebalancing (Data Rebalancing)

**Definition:** **Rebalancing** is redistributing data across nodes or partitions to ensure even load and resource utilization【55†L80-L88】.

**Core concept:** As data grows or cluster membership changes, some nodes can become “hot” while others underutilized. Rebalancing moves data (or partitions) so each node handles similar amounts. This prevents hotspots and optimizes performance.

**Use cases:** Distributed storage (HDFS, Cassandra, Elasticsearch) and sharded databases do automatic or manual rebalancing when adding/removing nodes. For example, when a new node is added to a storage cluster, data blocks are reassigned.

**Trade-offs:** Rebalancing itself consumes network and I/O. Systems try to do it gradually. But without it, clusters become unbalanced, hurting throughput and availability.

**Example:** In **Cassandra**, when a node joins the ring, data tokens shift and other nodes stream partitions to the newcomer until token ranges are balanced.

*References:* Definition: “redistributing data across nodes/partitions for optimal utilization and balanced load”【55†L80-L88】.

# Resharding

**Definition:** **Resharding** is changing the number or configuration of shards (data partitions) in a sharded database, moving data between shards accordingly.

**Core concept:** Initially, a system may start with a few shards. As data grows or load increases, more shards are needed. Resharding adds shards and redistributes data (and queries) to them. It’s essentially rebalancing with a focus on splits.

**Use cases:** Any sharded system needing capacity planning. For instance, PlanetScale describes adding shards as data grows【57†L153-L156】.

**Trade-offs:** Resharding can be complex and requires migrating data without downtime. Some systems use consistent hashing to minimize data movement when resharding.

**Example:** In a MySQL sharded cluster, going from 2 to 3 shards is resharding. Tools like Vitess (as in PlanetScale) handle moving rows to the new shard.

*References:* PlanetScale: “As data grows, we can add more shards… a process known as resharding”【57†L153-L156】.

# Data Locality

**Definition:** **Data locality** is the principle of placing computation (queries, processing) close to where the data resides, rather than moving large data sets across the network【59†L222-L224】.

**Core concept:** By co-locating computation with data, systems reduce network transfer and latency. For example, in Hadoop/Spark, tasks are scheduled on nodes that already store the data block.

**Use cases:** Big data processing (Hadoop, Spark), edge computing, and distributed databases optimize by moving small computations to data (e.g., map tasks) rather than shuffling large volumes of data.

**Trade-offs:** To exploit locality, data must be partitioned effectively. In some cases, data might be replicated to achieve locality. If data is poorly distributed, locality gains are limited.

**Example:** A Spark job runs its map tasks on nodes holding the input files (HDFS blocks).

*References:* “Data locality is the process of moving computation to the node where the data resides”【59†L222-L224】.

# Hot Partition (Hot Shard)

**Definition:** A **hot partition** (or hot shard/key) is a data partition that receives disproportionately high traffic, causing resource saturation【61†L80-L82】.

**Core concept:** In a sharded system, if one shard/key sees most reads/writes, it becomes a bottleneck. That node may run out of CPU, memory, or I/O capacity, causing high latency or failures, while other shards are idle.

**Use cases:** This often happens with poorly chosen partition keys or time-based partitions. E.g., in a time-series DB, the latest time partition may be “hot” as new data arrives. Or a social network user with many connections might create a hot key.

**Trade-offs:** Hot partitions degrade performance and can lead to cascading failures if not mitigated (e.g. by adding more replicas or adjusting traffic).

**Example:** If userID 1234 is extremely popular, all requests for that user hit the same partition, overwhelming it. Techniques like splitting keys, caching, or read-replicas can alleviate this.

*References:* “Hot Shard/Partition: a shard’s resource saturation resulting in backlog of requests”【61†L80-L82】.

# Split-Brain

**Definition:** **Split-brain** is a failure scenario in clustered systems where network failures cause two (or more) segments of the cluster to believe they are the sole primary system, leading to divergent data updates【63†L143-L147】.

**Core concept:** If cluster nodes lose communication (network partition) and there is no quorum mechanism, each side may independently accept writes. When connectivity returns, the data sets have “diverged” with conflicting changes.

**Use cases:** Split-brain is a hazard in any HA cluster (databases, file systems, etc.). Systems often use heartbeats and quorum to avoid it. Without protection, risk of data corruption is high.

**Trade-offs:** Avoiding split-brain often means sacrificing availability (one side stops accepting writes without quorum). Letting both sides go can preserve availability but then manual conflict resolution is needed after heal.

**Example:** In an HA PostgreSQL cluster of 2 nodes without a witness: if the heartbeat fails, both might think the other is down and both become primary, causing different clients to write conflicting data.

*References:* “Split-brain is a state of data inconsistencies from the maintenance of two separate datasets with overlap… servers not communicating”【63†L143-L147】.

# Failover

**Definition:** **Failover** is the automatic or manual switching of operations from a failed primary system to a secondary (standby) system【65†L4-L7】.

**Core concept:** In high-availability setups, a standby server is kept updated and ready. If the primary fails (hardware/network crash), failover redirects traffic to the standby with minimal downtime.

**Use cases:** Database clusters (e.g. two-node replication), application servers with hot standby. Ensures continuity of service.

**Trade-offs:** There is typically a slight delay during failover. If not automatic, it requires detection logic and possibly manual intervention. Proper design is needed to avoid split-brain (see above).

**Example:** Oracle Data Guard or AWS RDS Multi-AZ use automatic failover: the standby takes over transparently to clients when primary is unreachable【65†L4-L7】.

*References:* “Failover is the transfer of workload from a primary to a secondary system in the event of a primary failure”【65†L4-L7】.

# High Availability (HA)

**Definition:** **High availability** means a system is continuously operational and accessible with minimal downtime (often 99.99% uptime or better)【67†L25-L28】.

**Core concept:** HA designs avoid single points of failure by using redundancy (multiple nodes, replicas), automatic failover, and distributed architectures. The goal is close to “always on” operation.

**Use cases:** Critical services like banking, healthcare, cloud services (AWS, Azure) use HA to meet SLAs. Databases can use clustering, replication, and load balancing for HA.

**Trade-offs:** HA adds cost and complexity: extra hardware, more complex architecture, and sophisticated monitoring. But it prevents service outages.

**Example:** A highly available web app might run on multiple servers behind a load balancer; if one fails, traffic shifts to others seamlessly.

*References:* HA defined as being “accessible and reliable close to 100% of the time”【67†L25-L28】.

# Horizontal Scaling

**Definition:** **Horizontal scaling** (scale-out) means adding more machines (nodes) to a system to handle increased load【69†L178-L181】.

**Core concept:** Instead of upgrading one server, you add parallel machines. The workload and data are distributed among them. More nodes = more capacity linearly.

**Use cases:** Web servers and databases that partition (shard) data can scale horizontally almost indefinitely. Cloud-native applications leverage elastic horizontal scaling.

**Trade-offs:** Requires designing system to distribute data/requests (sharding, load balancing). It adds inter-node communication and consistency challenges.

**Example:** A MongoDB cluster with multiple shards can add new shard servers to store more data and serve queries.

*References:* Vertical vs horizontal: “Horizontal scaling – adding new nodes to manage the distributed workload”【69†L178-L181】.

# Vertical Scaling

**Definition:** **Vertical scaling** (scale-up) is increasing the resources (CPU, RAM, disk) of a single machine【69†L74-L78】.

**Core concept:** A stronger server can handle more load by itself. It is often easier to implement (no distributed changes) but has practical limits (max hardware).

**Use cases:** Single-server databases or apps where distributing is difficult. If ease of development and consistency is critical, a beefier server might be used.

**Trade-offs:** There’s a ceiling: you can only add so much memory/CPU. One big node is a single point of failure (no HA). Also can be expensive.

**Example:** Switching from a 4-core to 16-core CPU machine for the DB.

*References:* “Vertical scaling increases capacity of a single machine by adding resources”【69†L74-L78】.

# Load Balancing

**Definition:** **Load balancing** is distributing incoming requests or tasks across multiple servers/resources to optimize performance and avoid overload【71†L188-L192】.

**Core concept:** A load balancer (software/hardware) sits in front of servers and routes each new request based on an algorithm (round-robin, least-connections, etc.). This ensures no single server gets overwhelmed while others idle.

**Use cases:** Web servers behind an HA proxy; database replicas behind a proxy; microservices with many instances.

**Trade-offs:** Load balancers can become bottlenecks or single points of failure (mitigated by redundancy). Poor algorithms may lead to uneven distribution.

**Example:** An HAProxy or AWS ELB sends each client HTTP request to the least-loaded web server.

*References:* “Load balancing is the process of distributing a set of tasks over a set of resources… making processing more efficient”【71†L188-L192】.

# Connection Pooling

**Definition:** **Connection pooling** maintains a pool of open database connections that can be reused, reducing the overhead of opening/closing connections【73†L77-L80】.

**Core concept:** Opening a DB connection is costly (network handshake, auth). A pool holds a number of ready connections. When an app needs to query, it takes a connection from the pool, uses it, and returns it. This amortizes the cost of connecting.

**Use cases:** Any persistent application server (Java, Node.js, Go) uses connection pools for its DB client. High-traffic services that repeatedly query the DB see huge benefits.

**Trade-offs:** Pools consume resources (each connection uses server memory). If too many connections are open, it can overload the DB. Pool sizing and timeouts must be tuned carefully.

**Example (Go with pgx):**
```go
config, _ := pgxpool.ParseConfig(databaseURL)
config.MaxConns = 10
pool, _ := pgxpool.ConnectConfig(context.Background(), config)
```
This creates a pool of up to 10 Postgres connections, reused across queries.

*References:* “Connection pooling is a way to reduce cost of opening/closing connections by maintaining a pool of open connections that can be passed from operation to operation”【73†L77-L80】.

# Caching

**Definition:** **Caching** stores frequently accessed data in a faster storage (often memory) to speed up retrieval【75†L443-L447】.

**Core concept:** Instead of querying the database each time, an application checks the cache first. If the data (e.g. query result, object) is cached (cache hit), it returns quickly; if not, it fetches from the DB (cache miss) and often populates the cache.

**Use cases:** Web apps often cache expensive or frequent reads (product info, session data). Content Delivery Networks cache static content at edge. Databases use in-memory caches (Redis, Memcached) for hot data.

**Trade-offs:** Cache can become stale (data may change in DB but not immediately in cache). Developers must manage cache invalidation carefully. Also adds complexity and memory cost, but greatly reduces DB load and latency.

**Example:** A Redis cache storing results of `SELECT price FROM products WHERE id=42;`. App checks Redis key `product:42`; if found, skip DB.

*References:* “Database caching is used for frequent calls to data that doesn’t change often… helps applications load faster by reducing data retrieval latency”【75†L443-L447】.

# Materialized Views

**Definition:** A **materialized view** is a database object that stores the result of a query as a physical table【77†L51-L59】. Unlike a regular (virtual) view, it contains actual data.

**Core concept:** On creation, the view’s underlying query is executed and the results are stored. The DB can index this data. Materialized views must be refreshed (either periodically or on demand) to stay up-to-date with source tables.

**Use cases:** Data warehousing and analytics: complex joins/aggregations are precomputed for fast reads. Reporting queries can run against the materialized view instead of the raw tables.

**Trade-offs:** Cost of storage and refresh: if underlying data changes frequently, the view must be updated often (full or incremental refresh). Stale data risk exists if refresh lags.

**Example:** If you have large `orders` and `customers` tables, you could create a materialized view `sales_summary` that joins them and aggregates by month. Queries on `sales_summary` are then very fast.

*References:* “A materialized view is a duplicate data table created by combining data from multiple existing tables for faster data retrieval”【77†L51-L59】.

# Secondary Indexes

**Definition:** A **secondary index** is any index on a table column that is not the primary key. It is stored separately from the table rows【79†L135-L139】.

**Core concept:** In many DBs, the primary key index (clustered index) is built into the table structure. A secondary index is an auxiliary data structure (often a B-tree) mapping the indexed column to row pointers (primary keys). For example, if `users(id)` is primary, an index on `users(email)` would be a secondary index.

**Use cases:** Speeds up queries on non-PK columns. Useful when filtering or joining on those columns.

**Trade-offs:** Every insert/update requires updating secondary indexes. They add overhead to writes and use extra space.

**Example:** `CREATE INDEX idx_users_email ON users(email);` creates a secondary index on email.

*References:* “A secondary index is a separate data structure that maintains a copy of part of the data”【79†L135-L139】.

# Composite Index

**Definition:** A **composite index** (multi-column index) indexes multiple columns together in one index. It creates a single B-tree keyed by the tuple of column values【79†L136-L139】.

**Core concept:** If queries often filter on (col1, col2) together, a composite index `(col1, col2)` can satisfy both. The order matters: it can be used for queries on `col1` or `col1, col2`, but not efficiently on `col2` alone (unless DB supports index skip-scan).

**Use cases:** Cover complex queries: e.g. `WHERE department = 'X' AND salary > 1000`. An index on `(department, salary)` helps.

**Trade-offs:** More columns in index means larger index. Also, the leftmost prefix rule (if query doesn’t use the first column, index can’t be used).

*References:* “When you create a composite index, MySQL creates a B-tree on the specified columns”【79†L136-L139】.

# Covering Index

**Definition:** A **covering index** is a (secondary or composite) index that includes *all* columns needed for a query【79†L117-L120】. The index “covers” the query, so the database can retrieve all data from the index itself without accessing the table (clustered index).

**Core concept:** If an index contains every column in a `SELECT` query (both filtering and returned columns), then the DB engine can find results purely in the index (often a B-tree leaf node) and avoid the extra lookup to the table rows, which speeds up reads.

**Use cases:** Performance tuning: if a query selects only certain columns, adding them to the index (as included columns or by extending the composite key) can eliminate table access.

**Trade-offs:** The index becomes wider (bigger). It’s only useful for specific queries. But it can significantly reduce read I/O.

**Example:** If we often run `SELECT last_name, first_name FROM users WHERE email = ?`, an index on `(email, last_name, first_name)` is covering: it has the filter column (`email`) and both output columns, so the DB reads from the index alone【79†L117-L120】.

*References:* “A covering index is a regular index that provides all the data required for a query without accessing the actual table”【79†L117-L120】.

# Bloom Filter

**Definition:** A **Bloom filter** is a space-efficient probabilistic data structure to test whether an element is in a set【81†L190-L194】. It can tell “possibly in set” or “definitely not in set,” allowing false positives but no false negatives.

**Core concept:** A Bloom filter uses a bit array and several hash functions. To add an element, it hashes it and sets bits. To test membership, it checks those bits. If any is 0, the item is definitely not present. If all are 1, the item is *possibly* present (could be a false positive due to collisions).

**Use cases:** Databases use Bloom filters to avoid unnecessary reads. For example, Cassandra uses Bloom filters to check if an SSTable might contain a key. If the filter says “no,” it skips disk I/O for that table. Web caches might use Bloom filters to quickly rule out misses.

**Trade-offs:** Very memory-efficient for large sets, but risk of false positives (leading to wasted reads). False positive rate grows with more elements or too small a filter.

**Example:** A DB wants to check if key K exists in a storage file. It first queries the Bloom filter. If result is “definitely not,” skip the file.

*References:* “A Bloom filter is a space-efficient probabilistic data structure… used to test whether an element is a member of a set. False positives are possible, false negatives are not”【81†L190-L194】.

# LSM Tree

**Definition:** A **Log-Structured Merge-tree (LSM tree)** is a data structure optimized for high write volumes【83†L138-L145】. It buffers writes in memory and periodically merges them to disk in large batches.

**Core concept:** An LSM tree has multiple levels: a small in-memory tree (level 0) and larger on-disk trees (level 1+). Writes are first logged (WAL) and inserted into the in-memory component. When it fills, it flushes to disk as a sorted file (SSTable). Background compaction merges overlapping files across levels.

**Use cases:** NoSQL stores (Cassandra, RocksDB, HBase) use LSM to achieve high write throughput. It turns random writes into sequential I/O.

**Trade-offs:** Read amplification (may have to check multiple levels) and compaction overhead. But significantly faster writes and cheaper disk usage patterns.

**Example:** Write 1 million key-value pairs; instead of 1M random disk writes, an LSM will write them to memory and then to a few large files sequentially.

*References:* “An LSM tree is a data structure that makes for efficient indexed access to files with high insert volume. It maintains data in two or more structures optimized for their storage; data is synchronized in batches”【83†L138-L145】.

# B-tree

**Definition:** A **B-tree** is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time【85†L199-L202】.

**Core concept:** Unlike a binary tree (2 children max), a B-tree node can have many children, keeping the tree short and wide. This optimizes disk/block accesses. Data is stored in sorted order in nodes (pages), minimizing the number of disk reads for range queries.

**Use cases:** B-trees (or variants like B+ trees) are the default index structure in many RDBMS (MySQL InnoDB, Oracle, etc.) and file systems. They serve as clustered indexes and primary keys.

**Trade-offs:** B-trees handle point queries and sequential scans well. However, they can suffer write-amplification on SSDs and are not as write-friendly as LSM trees in heavy write scenarios.

**Example:** A B-tree of order m stores up to m children; searching involves descending from root to a leaf by binary searching keys at each node.

*References:* “A B-tree is a self-balancing tree that maintains sorted data and allows searches, insertions, deletions in O(log n) time”【85†L199-L202】.

# Query Planner (Cost-Based Optimizer)

**Definition:** The **query planner/optimizer** is a component that determines the most efficient way to execute a database query. A *cost-based optimizer (CBO)* estimates the “cost” (resources, time) of different query plans and picks the cheapest【87†L515-L519】.

**Core concept:** Given an SQL statement, the planner considers possible execution strategies (join orders, use of indexes, etc.). It uses table statistics (row counts, index selectivity) to estimate cost (I/O, CPU). The optimizer picks the plan with lowest estimated cost.

**Use cases:** All relational databases (Postgres, Oracle, MySQL) and many distributed SQL engines have CBOs. A good optimizer is crucial for performance, especially on complex queries involving joins and aggregations.

**Trade-offs:** Collecting accurate statistics can be overhead. CBO can sometimes misestimate and choose suboptimal plans (necessitating hints or manual indexes). Rule-based optimizers (RBO) exist but are simpler.

**Example:** An optimizer might choose between an index scan vs a full table scan. If the table is large and few rows match, it picks index; if many rows, it might choose full scan. It uses stats to decide【87†L515-L519】.

*References:* “The query planner determines the most efficient way to execute a query. The optimizer calculates costs of different execution plans and selects the most cost-effective path”【87†L515-L519】.

# Deadlock

**Definition:** A **deadlock** occurs when two or more transactions block each other indefinitely, each holding a resource the other needs【89†L97-L100】.

**Core concept:** Imagine T1 locks row A and wants row B, while T2 locks row B and wants A. Neither can proceed, causing a circular wait.

**Use cases:** Deadlocks can happen in any system with locking and concurrency. DBMS detect deadlocks (e.g., by waits-for graph) and resolve by aborting one transaction.

**Trade-offs:** Solutions include lock timeouts, lock ordering rules, or avoidance techniques. Deadlocks reduce throughput; detecting and rolling back the “victim” frees resources.

**Example:** In SQL Server, if two sessions lock rows in opposite order, the engine will detect a cycle and kill one transaction (the “deadlock victim”)【89†L97-L100】.

*References:* “A deadlock occurs… when two or more transactions block each other indefinitely by each holding a resource the other needs”【89†L97-L100】.

# Lock Escalation

**Definition:** **Lock escalation** is the process of converting many fine-grained locks (like row or page locks) into a coarser lock (like a table lock) to reduce lock management overhead【91†L49-L50】.

**Core concept:** If a transaction holds thousands of locks on a table, the DBMS may escalate to a single table-level lock. This reduces memory for lock tracking but makes the transaction more restrictive (blocking others on the whole table).

**Use cases:** Common in SQL Server and others to manage lock memory. If a large batch update locks many rows, it might be more efficient to hold one table lock.

**Trade-offs:** Escalation can hurt concurrency (many rows locked become one big lock). Sometimes it causes unexpected blocking. The DB often triggers escalation only when limits are reached.

**Example:** A loop updating 100,000 rows may accumulate page locks; the server might escalate to one table lock to manage resources【91†L49-L50】.

*References:* “Lock escalation is the process of converting many fine-grained locks (such as row or page locks) to table locks”【91†L49-L50】.

# Optimistic Locking

**Definition:** **Optimistic locking** is a concurrency control strategy where a transaction proceeds without locking resources, checking for conflicts only at commit. Typically implemented via version checks.

**Core concept:** When reading, the transaction notes a version (timestamp or version number) of the data. On write/commit, it verifies the version is unchanged. If it changed, the transaction aborts and retries. No locks are held during the transaction.

**Use cases:** Web apps and ORMs often use optimistic locking for performance when conflicts are rare (e.g., many users read the same data but few update it).

**Trade-offs:** Risk of transaction abort: more work on retry if conflicts occur. Best for low-contention scenarios.

**Example:** A row has a `version` column. T1 reads version=1. T2 updates row and sets version=2. T1, on update, sees version changed and rolls back.

*References:* Common knowledge in DB concurrency (no direct cite).

# Pessimistic Locking

**Definition:** **Pessimistic locking** is the strategy of locking data resources before accessing them to prevent conflicts. A transaction acquires locks on rows it will read or write.

**Core concept:** Locks ensure that no other transaction can modify (or sometimes read) the data until the lock is released. This prevents anomalies but can cause contention.

**Use cases:** High-conflict environments (finance) where you avoid retries. Row-level locks (SELECT ... FOR UPDATE) in SQL are an example.

**Trade-offs:** Can lead to reduced concurrency and possible deadlocks.

**Example:** T1 does `SELECT ... FOR UPDATE` locking the row; T2 tries same row and must wait until T1 commits.

*References:* Common DB theory (no direct cite).

# Dirty Read

**Definition:** A **dirty read** is when a transaction reads data written by another uncommitted transaction. If that other transaction rolls back, the reading transaction got invalid data.

**Core concept:** Dirty reads violate isolation. Isolation levels above READ UNCOMMITTED prevent dirty reads.

**Use cases:** Rarely acceptable. Sometimes non-critical data analytics might allow it for speed.

**Example:** T1 does `UPDATE accounts SET balance=100 WHERE id=1;` but hasn’t committed. T2 reads balance=100 (dirty). If T1 aborts, T2 read was invalid.

*References:* Standard transaction isolation concepts.

# Phantom Read

**Definition:** A **phantom read** occurs when a transaction re-reads rows matching a condition and finds new rows that were inserted or deleted by another transaction after the initial read.

**Core concept:** In other words, the set of rows returned changes (some “phantom” row appears or disappears) due to concurrent inserts/deletes by others.

**Use cases:** Phantom reads are prevented in the *Serializable* isolation level.

**Example:** T1 runs `SELECT * FROM employees WHERE dept='Sales'` and gets 10 rows. T2 inserts a new Sales employee and commits. T1 runs same SELECT again and sees 11 rows. The extra row is a phantom.

*References:* Standard DB isolation definitions.

# Read Skew

**Definition:** **Read skew** is an anomaly where a transaction reads outdated data in one table or column while reading updated related data in another, leading to inconsistency across reads within the same transaction.

**Core concept:** It happens when isolation level doesn’t enforce strict ordering of reads.

**Use cases:** Eliminated by higher isolation (repeatable read or serializable).

**Example:** In a bank DB, one transaction reads old balance but new transaction count in same transaction, leading to internal inconsistency.

*References:* Known anomaly (less common term).

# Write Skew

**Definition:** **Write skew** is an anomaly where two concurrent transactions each read overlapping data and then write non-overlapping fields, resulting in an overall invalid state despite no single column being overwritten.

**Core concept:** Occurs under snapshot isolation. Example: two doctors scheduling themselves off on same day, checking each other’s availability and both writing an appointment because they didn’t see the other’s write at start.

**Use cases:** Snapshot isolation can allow write skew. Serializable isolation prevents it.

**Example:** Table of on-call doctors with boolean fields. Both T1 and T2 see the other is on-call, each marks themselves off. Both commit, now no doctor is on-call (invalid).

*References:* Known concept in transaction anomalies.

# Data Skew

**Definition:** **Data skew** is an uneven distribution of data (or workload) across partitions or nodes. Some partitions get more data/traffic than others.

**Core concept:** In parallel processing or sharding, skewed partition keys result in hotspots. E.g., one database shard stores 90% of keys.

**Use cases:** Important in distributed databases and analytics. Skew can slow down operations (some workers have much more to do).

**Trade-offs:** Mitigation can include re-partitioning or using consistent hashing.

**Example:** In a MapReduce job, if one reducer gets most keys, it slows the whole job.

*References:* Data engineering concept.

# Backpressure

**Definition:** **Backpressure** is a technique to prevent system overload by signaling to upstream components to slow down when downstream is overwhelmed.

**Core concept:** In streaming or concurrent systems, if a consumer can’t keep up, it applies backpressure so producers send data slower or buffer. This avoids unchecked queues and resource exhaustion.

**Use cases:** Message brokers (Kafka has backpressure in some flows), streaming frameworks (Reactive Streams). In microservices, one service can return HTTP 503 or throttle signals to slow clients.

**Trade-offs:** Adds flow control complexity. If not designed well, backpressure can lead to cascading slowdowns.

**Example:** A web API might implement a rate-limit header or connection pool limits to apply backpressure.

*References:* Theory of reactive systems (no direct cite).

# Circuit Breaker

**Definition:** A **circuit breaker** is a pattern where a system stops sending requests to a failing service for a period, allowing it to recover and preventing resource exhaustion.

**Core concept:** Modeled on electrical circuit breakers: if the number of recent failures (exceptions, timeouts) exceeds a threshold, the circuit opens, and calls fail immediately for a timeout period. After a while, a “half-open” trial allows some calls to test if recovery succeeded.

**Use cases:** Microservice architectures to prevent cascading failures. If Service B is down, Service A’s circuit breaker trips so that A doesn’t keep sending requests (which would time out), thus freeing threads for other tasks.

**Trade-offs:** Adds complexity; need tuning of thresholds and reset times.

**Example:** Netflix’s Hystrix library implements this: after e.g. 5 consecutive request failures, further calls fail fast.

*References:* Microservices design pattern (no direct cite in sources, but known concept).

# Throttling and Rate Limiting

**Definition:** **Throttling** controls resource usage by limiting the rate of requests. **Rate limiting** enforces a maximum number of requests in a time window.

**Core concept:** Prevents overload by rejecting or slowing requests above threshold. Often implemented with token buckets or leaky buckets.

**Use cases:** APIs often limit clients (e.g., 100 requests/min). Internally, DB connections or job queues may throttle producers.

**Trade-offs:** Can degrade user experience if limits are hit, but protects system stability.

**Example:** A Redis token bucket algorithm grants a client at most 10 requests per second; extra requests get 429 HTTP responses.

*References:* Common API management practice.

# CDC (Change Data Capture)

**Definition:** **CDC** is the process of tracking and capturing changes in a database and delivering change events (inserts/updates/deletes) to downstream systems.

**Core concept:** Often implemented by reading the database’s write-ahead log or trigger-based hooks. CDC enables streaming changes for ETL, caches, or event-driven architectures.

**Use cases:** Keeping search indexes, caches, data warehouses in sync. Streaming analytics (e.g. Debezium is a popular CDC tool).

**Example:** In Debezium, an insert into MySQL’s binlog produces an event pushed to Kafka, which a consumer uses to update another system.

*References:* Standard data engineering concept.

# Logical vs Physical Replication

**Definition:** **Logical replication** replicates database changes at a logical level (e.g. SQL statements or row change events). **Physical replication** copies the exact data files or binary log (WAL) at the block/byte level.

**Core concept:** Physical replication (e.g. streaming WAL) creates a hot standby that is byte-for-byte identical. Logical replication can allow different schema on subscriber, selective tables, and is usually more flexible.

**Use cases:** PostgreSQL: WAL shipping is physical (exact copy); logical replication streams SQL changes to replicate a subset or to different schema.

*References:* Database docs (no specific cite in our scraped sources).

# Geo-Replication

**Definition:** **Geo-replication** is replicating data across geographically distributed data centers.

**Core concept:** Ensures data is available near where it’s needed globally and provides disaster recovery. Usually asynchronous to tolerate high latencies, leading to eventual consistency across regions.

**Use cases:** Cloud storage (S3 cross-region), globally distributed databases (Cassandra in multi-DC mode, CockroachDB).

**Trade-offs:** Increased latency for cross-region sync, potential staleness. But improves read locality and resilience.

*References:* Networking and cloud best practices.

# Federation

**Definition:** **Federation** refers to a setup where multiple autonomous databases or services coordinate to respond to queries, often by delegating parts of a query to different sources, but without a shared storage layer.

**Core concept:** Often used in multi-tenant SaaS: each tenant has its own DB, and a proxy layer (federation engine) routes queries to the correct shard. The data is not physically unified.

**Use cases:** SaaS scaling, horizontal sharding with independent nodes.

*References:* Typical concept in distributed DB, no specific source.

# Data Lake

**Definition:** A **data lake** is a centralized repository that stores large volumes of raw data (structured, semi-structured, unstructured) in its native format, usually in a distributed storage (like S3 or HDFS).

**Core concept:** Unlike a data warehouse, a lake holds raw logs, files, streams, etc. It emphasizes storage first, schema later (schema-on-read). Analysts and data scientists can explore data using various tools (Spark, Presto, etc.).

**Use cases:** Big data analytics, machine learning, IoT data ingestion.

**Trade-offs:** Lakes can become “data swamps” without proper cataloging/metadata. Query performance depends on the processing layer.

**Example:** AWS S3 as a data lake storing CSV logs, Parquet files, etc., with Athena or EMR used to query it.

*References:* Data engineering.

# Data Warehouse

**Definition:** A **data warehouse** is a centralized repository that stores curated, cleaned, and structured data optimized for queries and reporting, typically in a columnar format.

**Core concept:** Data is ETL’ed from operational systems into the warehouse, following a schema (often star/snowflake). It’s designed for analytical queries (OLAP) rather than transactions.

**Use cases:** Business intelligence, dashboards, historical analysis.

**Trade-offs:** Requires upfront schema design and transformation (ETL). Not suitable for high-write transactional loads.

**Example:** Snowflake, Amazon Redshift, or on-prem Oracle/Data Mart.

*References:* Established BI practice.

# Columnar vs Row Storage

**Definition:** **Columnar storage** stores data column-by-column (all values of one column together). **Row-based storage** stores data row-by-row (complete records together).

**Core concept:** Columnar DBs compress and read column values efficiently, great for analytical queries scanning few columns across many rows. Row stores are better for transactional workloads with many small writes/reads of individual rows.

**Use cases:** OLAP and data warehousing use columnar (e.g. Parquet, Redshift). OLTP use row-oriented (MySQL, Postgres).

**Trade-offs:** Columnar reduces I/O for read queries on subsets of columns, but slower for point updates (writing a single row touches multiple column files).

*References:* Data warehouse literature.

# Time-Series Partitioning

**Definition:** Partitioning data by time (e.g., daily/weekly/monthly partitions). Each partition holds data for a time range.

**Core concept:** Especially useful for time-series data: older data can be archived/dropped easily. Queries often filter by time, so partitions improve prune efficiency.

**Use cases:** Logs, metrics (e.g. Prometheus, InfluxDB) often partition by day.

**Trade-offs:** Need to manage partitions (create/destroy). If time skew occurs, new partitions are always hot, old ones cold.

*References:* Time series DB best practices.

# Hash Partitioning

**Definition:** **Hash partitioning** assigns data to shards by hashing a key and using the hash result to pick a partition.

**Core concept:** If data is uniformly hashed, it distributes data evenly. Good for equality-based queries (exact key lookup).

**Use cases:** Many NoSQL (Cassandra) use consistent hashing.

**Trade-offs:** Range queries on the key aren’t contiguous, so less efficient. Adding nodes requires rehashing or consistent hashing.

*References:* Hash partitioning common in distributed cache design.

# Range Partitioning

**Definition:** **Range partitioning** divides data by ordered key ranges. Each shard holds a contiguous range of key values.

**Core concept:** Good for range queries: all values in a range reside together. For instance, shard1 holds keys 0-1000, shard2 1001-2000, etc.

**Use cases:** Partitioning logs by date (Jan 2026 in one partition).

**Trade-offs:** Can lead to hot shards if data skews. Splitting ranges as data grows requires resharding.

*References:* Sharding tutorials.

# Consistent Hashing

**Definition:** **Consistent hashing** is a technique to distribute keys across nodes so that minimal keys need to be moved when nodes join/leave.

**Core concept:** Hash keys to a large ring; each node owns portions of the ring. When a node is added/removed, only its immediate neighbors’ keys are remapped.

**Use cases:** Caching (Memcached) and sharding schemes. Helps rebalance gracefully.

**Trade-offs:** Key ownership changes on membership change; may need virtual nodes to balance load.

*References:* Web caching design.

# Data Migration

**Definition:** **Data migration** involves moving data between systems or formats (e.g., during an upgrade or platform change).

**Core concept:** Can be online (live with replication) or offline (downtime). Includes schema changes, data type conversions.

**Use cases:** Upgrading DB versions, moving to cloud, consolidating two DBs.

**Trade-offs:** Risks of downtime, compatibility issues.

# Schema Evolution

**Definition:** **Schema evolution** refers to managing changes to the database schema over time without disrupting services.

**Core concept:** Techniques include adding nullable columns, versioned schemas, or using schema-on-read systems. In Avro/Protobuf, adding fields with defaults allows compatibility.

**Use cases:** Microservices migrating from one schema version to next without downtime.

**Trade-offs:** Complexity in migration scripts, ensuring backward compatibility.

# Schema Registry

**Definition:** A **schema registry** is a centralized service to store and enforce data schema versions for messages/events (common in streaming systems like Kafka).

**Core concept:** Producers write data with a schema ID, consumers retrieve the schema to deserialize. Ensures forward/backward compatibility.

**Use cases:** Kafka with Avro/JSON schemas.

**Trade-offs:** Operational overhead of registry service, managing compatibility rules.

# Idempotency

**Definition:** **Idempotency** means an operation can be applied multiple times without changing the result beyond the initial application. In distributed systems, it ensures retries don’t duplicate work.

**Core concept:** HTTP PUT is idempotent (setting value to X is same if done once or many times). Using unique request IDs or checks can achieve it.

**Use cases:** Exactly-once messaging, reliable REST APIs.

**Trade-offs:** Requires storage of seen requests or unique constraints.

# Exactly-Once Semantics

**Definition:** Guarantees that an operation (like processing a message) is performed only once, despite retries and failures.

**Core concept:** Combines idempotency, deduplication, and atomic commit to ensure no duplicates or misses.

**Use cases:** Financial transactions, critical event handling.

**Trade-offs:** More complex (stateful dedup store, distributed transactions) and often requires idempotent design.

---

**Sources:**
Definitions and concepts drawn from database texts and official documentation, such as AWS/IBM blogs, database docs, and system design references【4†L170-L172】【6†L178-L183】【23†L10-L13】【29†L153-L159】【30†L137-L139】【32†L62-L65】【34†L131-L134】【38†L119-L124】【40†L151-L156】【42†L143-L147】【44†L119-L124】【49†L133-L141】【53†L1-L4】【55†L80-L88】【57†L153-L156】【59†L222-L224】【61†L80-L82】【63†L143-L147】【65†L4-L7】【67†L25-L28】【69†L74-L81】【71†L188-L192】【73†L77-L80】【75†L443-L447】【77†L51-L59】【79†L117-L120】【81†L190-L194】.
