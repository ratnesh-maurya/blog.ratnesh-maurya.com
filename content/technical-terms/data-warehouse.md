---
title: Data Warehouse
description: A data warehouse is a centralized analytical store that holds curated, structured data optimized for complex queries and reporting, separate from operational systems.
questions:
  - What is Data Warehouse?
  - When is Data Warehouse used?
  - What are the trade-offs of Data Warehouse?
---

## Definition

A data warehouse is a centralized repository of structured, curated data—extracted from operational systems—designed for analytical queries and reporting rather than transactional workloads.

## How it works

Data flows from source systems (application databases, SaaS APIs, event streams) through an ETL or ELT pipeline into the warehouse. ETL (Extract, Transform, Load) transforms data before loading; ELT loads raw data first, then transforms it inside the warehouse using SQL (the modern approach with tools like dbt).

The warehouse organizes data using dimensional modeling. The most common pattern is the **star schema**: a central fact table (e.g., `fact_orders` with order_id, amount, timestamp, foreign keys) surrounded by dimension tables (`dim_customer`, `dim_product`, `dim_date`). This denormalized structure trades storage efficiency for query speed—a single join answers most business questions.

Under the hood, most warehouses use columnar storage. When a query scans `SELECT sum(amount) FROM fact_orders WHERE region = 'APAC'`, only the `amount` and `region` columns are read from disk. Combined with compression (run-length encoding, dictionary encoding), this means warehouses can scan billions of rows in seconds. Snowflake, BigQuery, and Redshift all use columnar formats internally.

Warehouses also separate compute from storage. Snowflake spins up compute clusters on demand. BigQuery charges per query bytes scanned. This model means you pay for storage cheaply and burst compute when analysts need it.

## When to use it

- **Business intelligence**: Dashboards in Looker, Tableau, or Metabase running against the warehouse. Analysts write SQL to answer questions like "what's the monthly revenue trend by product line?"
- **Historical analysis**: Warehouses retain years of data. Comparing Q1 2024 to Q1 2023 requires this history.
- **Cross-system reporting**: Orders come from Postgres, payments from Stripe, marketing data from Google Ads. The warehouse joins them into a single model.
- **Regulatory reporting**: Financial audits need consistent, versioned data snapshots.

## Trade-offs

**Gains**: Fast analytical queries across large datasets. Single source of truth for reporting. Separation from operational load—queries don't slow down production databases.

**Costs**: Data is not real-time. Even with streaming ELT, warehouse data typically lags 1–15 minutes behind source systems. Schema design is upfront work—poorly modeled data leads to slow, confusing queries. Cost scales with data volume and query frequency: a Snowflake bill can reach $50K/month for a mid-size company if warehouses aren't suspended when idle.

## Example

A star schema in a warehouse:

```sql
-- Fact table
CREATE TABLE fact_orders (
  order_id    BIGINT,
  customer_id BIGINT,
  product_id  BIGINT,
  order_date  DATE,
  quantity    INT,
  amount      DECIMAL(12,2)
);

-- Dimension table
CREATE TABLE dim_customer (
  customer_id BIGINT,
  name        VARCHAR(200),
  region      VARCHAR(50),
  segment     VARCHAR(50)
);

-- Typical analytical query
SELECT d.region, DATE_TRUNC('month', f.order_date) AS month,
       SUM(f.amount) AS revenue
FROM fact_orders f
JOIN dim_customer d ON f.customer_id = d.customer_id
WHERE f.order_date >= '2024-01-01'
GROUP BY d.region, month
ORDER BY month, revenue DESC;
```

## Related terms

Data warehouses rely on columnar vs row storage for performance. CDC (Change Data Capture) is the mechanism that feeds real-time changes into the warehouse. The warehouse is distinct from federation, which queries distributed sources without centralizing the data.
