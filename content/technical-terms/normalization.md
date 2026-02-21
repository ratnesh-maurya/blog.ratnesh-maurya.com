---
title: Normalization
description: 'Normalization is the process of organizing database schema to reduce redundancy and improve integrity. Typically, data is divided into multiple tables…'
questions:
  - What is Normalization?
  - When is Normalization used?
  - What are the trade-offs of Normalization?
---

## Definition

Normalization is the process of organizing database schema to reduce redundancy and improve integrity[[\[8\]](https://www.geeksforgeeks.org/dbms/what-is-data-normalization-and-why-is-it-important/ "What is Data Normalization and Why Is It Important? …")](https://www.geeksforgeeks.org/dbms/what-is-data-normalization-and-why-is-it-important/ "What is Data Normalization and Why Is It Important? …"). Typically, data is divided into multiple tables linked by keys, following normal forms (1NF, 2NF, 3NF, etc.) so each fact is stored once.

## Core concept

Normalization ensures that each table focuses on a single concept, and each column depends on the primary key. For example, instead of storing customer address in every order row, one would have a customers table (with address) and an orders table linking to customers by ID. This reduces duplicate data.

## Use cases

Normalization is key in transactional (OLTP) systems where data consistency and efficient updates are important. It avoids update anomalies: changing a customer’s address happens in one place.

## Trade-offs

Highly normalized schemas can require many joins to answer complex queries, which can slow down reads. Hence many OLTP systems use normalization up to a practical normal form, and may add some denormalized columns or indexes for performance.

## Example

A normalized database might have tables: users(id, name), accounts(id, user_id, balance). The user_id foreign key links accounts to users, instead of duplicating user name in every account row.

## References

Normalization defined as reducing redundancy and improving integrity[[\[8\]](https://www.geeksforgeeks.org/dbms/what-is-data-normalization-and-why-is-it-important/ "What is Data Normalization and Why Is It Important? …")](https://www.geeksforgeeks.org/dbms/what-is-data-normalization-and-why-is-it-important/ "What is Data Normalization and Why Is It Important? …").
