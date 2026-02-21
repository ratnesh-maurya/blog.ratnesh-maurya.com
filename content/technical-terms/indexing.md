---
title: Indexing
description: A database index is a data structure that improves the speed of data retrieval on a table at the cost of additional writes and storage. It works like a book’s…
questions:
  - What is Indexing?
  - When is Indexing used?
  - What are the trade-offs of Indexing?
---

## Definition

A database index is a data structure that improves the speed of data retrieval on a table at the cost of additional writes and storage. It works like a book’s index: instead of scanning every row, the database can use the index to quickly locate relevant entries[[\[1\]](https://en.wikipedia.org/wiki/Database_index "Database index - Wikipedia")](https://en.wikipedia.org/wiki/Database_index "Database index - Wikipedia"). Common index structures are B-trees and hash tables (see B-tree below).

## Core concept

An index maintains sorted keys (e.g. column values) with pointers to data rows. For example, a B-tree index on a user_id column can locate a row in logarithmic time. Creating an index on a column means the database will maintain an ordered copy of that column’s data. When a query filters by that column, the database uses the index to jump near the matching rows, rather than scanning the whole table[[\[1\]](https://en.wikipedia.org/wiki/Database_index "Database index - Wikipedia")](https://en.wikipedia.org/wiki/Database_index "Database index - Wikipedia")[[\[2\]](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…")](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…").

## Use cases

Indexes are most useful for read-heavy workloads with frequent queries on specific columns (e.g., searching by user name, timestamp, or foreign key). They speed up WHERE clause filtering and ORDER BY operations. For example, a secondary (non-primary) index on email in a users table allows quick user lookup by email. Composite indexes span multiple columns (e.g. (last_name, first_name)) to optimize queries that filter or sort on all those columns[[\[3\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")[[\[4\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale").

## Trade-offs

Indexes slow down writes (INSERT/UPDATE/DELETE) because the index must be updated in addition to the table. They also consume space. Over-indexing can hurt performance due to extra maintenance cost. However, smart indexing yields huge read-speed gains.

Example (MySQL):

-- Create an index on the "email" columnCREATE INDEX idx_users_email ON users (email);

The database will maintain a B-tree (by default in MySQL) on users.email, enabling fast lookups by email.

## References

Index definitions in database docs[[\[1\]](https://en.wikipedia.org/wiki/Database_index "Database index - Wikipedia")](https://en.wikipedia.org/wiki/Database_index "Database index - Wikipedia"); characteristics of composite vs. secondary indexes[[\[3\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")[[\[5\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale").
