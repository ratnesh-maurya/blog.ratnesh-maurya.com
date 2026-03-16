---
title: "S3 Policies Explained: Bucket Policies vs IAM Policies vs ACLs"
description: How S3 access control actually works — the difference between bucket policies, IAM policies, and ACLs, with working JSON examples for common scenarios like public read access, encryption enforcement, and user-scoped permissions.
author: Ratnesh Maurya
date: "2023-11-23"
category: AWS
image: /images/blog/Understanding-S3-and-S3-Policies.jpg
tags: ["Cloud & DevOps", "Backend"]
questions: [
  "What is Amazon S3?",
  "How do S3 policies work?",
  "How to secure S3 buckets with policies?",
  "What are S3 bucket policies?",
  "How to grant read-only access to S3 bucket?",
  "How to require encryption in S3?",
  "What is the difference between S3 bucket policies and IAM policies?",
  "How to configure S3 policies for public access?"
]
---

S3 has three overlapping access control systems — bucket policies, IAM policies, and ACLs — and the interaction between them confuses most people the first time. Here's how each one works, when to use which, and the JSON to copy for the most common scenarios.

## The three access control layers

Every S3 request is evaluated against all applicable policies. If any of them explicitly deny the request, it's denied. Otherwise, at least one policy must explicitly allow it.

| Mechanism | Attached to | Written by | Best for |
|-----------|-------------|------------|----------|
| **Bucket policies** | The S3 bucket | Bucket owner | Cross-account access, public access, IP restrictions |
| **IAM policies** | IAM users/roles/groups | Account admin | Controlling what your own users and services can do |
| **ACLs** | Buckets or objects | Object owner | Legacy use only — AWS recommends disabling these |

**The rule of thumb:** Use IAM policies for your own users, bucket policies for external access or bucket-wide rules, and ignore ACLs unless you're dealing with legacy configurations.

## Anatomy of an S3 policy

Every policy is a JSON document with these fields:

- **Version** — always `"2012-10-17"` (the current policy language version)
- **Statement** — an array of permission rules, each containing:
  - **Effect** — `"Allow"` or `"Deny"`
  - **Principal** — who the rule applies to (`"*"` for everyone, or a specific ARN)
  - **Action** — which S3 operations (`s3:GetObject`, `s3:PutObject`, etc.)
  - **Resource** — which bucket/objects (specified as an ARN)
  - **Condition** (optional) — extra constraints like IP range, encryption type, or request origin

## Common policies with working JSON

### Public read-only access

Makes all objects in a bucket publicly readable. Use this for static website hosting or public assets:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

This allows anyone to read objects but not list the bucket contents, upload, or delete. The `/*` in the Resource means all objects inside the bucket.

### Deny uploads without encryption

Forces all uploaded objects to use server-side encryption. Note: this uses `Deny` + a `StringNotEquals` condition, not `Allow`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::my-bucket/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "AES256"
        }
      }
    }
  ]
}
```

This is the correct pattern. A common mistake is using `Allow` with a `StringEquals` condition — that permits encrypted uploads but doesn't block unencrypted ones if another policy allows `s3:PutObject`.

### Scoped access for a specific IAM user

Grants a single user read and write access to a bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "UserReadWrite",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/deploy-bot"
      },
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Sid": "UserListBucket",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/deploy-bot"
      },
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::my-bucket"
    }
  ]
}
```

Note the two statements: object-level actions use `my-bucket/*` (objects inside), while `ListBucket` uses `my-bucket` (the bucket itself). Mixing these up is a common source of "Access Denied" errors.

### Restrict access by IP range

Allows access only from your office or VPN IP range:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RestrictToOfficeIP",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ],
      "Condition": {
        "NotIpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        }
      }
    }
  ]
}
```

## Bucket policy vs IAM policy: when to use which

| Scenario | Use |
|----------|-----|
| Grant another AWS account access to your bucket | Bucket policy (cross-account) |
| Make a bucket publicly readable | Bucket policy (Principal: `*`) |
| Control what your CI/CD pipeline can do | IAM policy on the pipeline's IAM role |
| Restrict access by IP or VPN | Bucket policy with Condition |
| Give a Lambda function access to a bucket | IAM policy on the Lambda execution role |
| Deny all public access organization-wide | S3 Block Public Access (account-level setting) |

In general: if the question is "who can access this bucket?", use a bucket policy. If the question is "what can this user/role do?", use an IAM policy.

## Common mistakes

- **Forgetting S3 Block Public Access.** Even if your bucket policy allows public reads, the account-level Block Public Access setting overrides it. Check this first when public access isn't working.
- **Resource ARN mismatch.** `s3:ListBucket` needs the bucket ARN (`arn:aws:s3:::my-bucket`), while `s3:GetObject` needs the object ARN (`arn:aws:s3:::my-bucket/*`). This trips up almost everyone.
- **Using ACLs.** AWS recommends disabling ACLs on new buckets (S3 Object Ownership: "Bucket owner enforced"). Bucket policies and IAM policies cover every use case that ACLs used to handle, with better auditability.
- **Overly broad wildcards.** `"Action": "s3:*"` with `"Resource": "*"` is an admin-level policy. Scope both to the specific actions and bucket you need.

The [AWS Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html) can help you build policies interactively if you're not sure about the syntax.
