---
title: Deploy a Nanoc Static Site to S3 with GitHub Actions
description: A step-by-step guide to automating Nanoc website deployment to AWS S3 using GitHub Actions, including S3 bucket policy, IAM setup, and the complete workflow YAML.
author: Ratnesh Maurya
date: "2024-11-23"
category: AWS
image: /images/blog/Easily-Deploy-Your-Nanoc-Website-to-S3-with-GitHub-Actions.jpg
tags: ["Cloud & DevOps"]
questions: [
  "How to deploy Nanoc website to S3?",
  "How to automate website deployment with GitHub Actions?",
  "How to deploy static website to AWS S3?",
  "How to set up GitHub Actions workflow for deployment?",
  "How to deploy Nanoc site automatically?",
  "What is the best way to deploy static sites to S3?",
  "How to configure GitHub Actions for S3 deployment?",
  "How to automate Nanoc deployment?"
]
---

Deploying a static site to S3 manually means running `aws s3 sync` from your laptop every time you make a change. That gets old fast. GitHub Actions can automate the entire flow: push to `main`, and the site builds and deploys itself.

This guide walks through the full setup for a [Nanoc](https://nanoc.app/) site, but the S3 + GitHub Actions pattern works for any static site generator.

[Source code on GitHub](https://github.com/ratnesh-maurya/365-Days-of-DevOps/tree/main)

## What you need before starting

- An **AWS account** with an S3 bucket configured for static website hosting
- An **IAM user** with scoped permissions (created in the steps below)
- A **GitHub repository** containing your Nanoc source code

## Step 1: Configure the S3 bucket policy

Your bucket needs a policy that allows public read access to its contents. Apply this to the bucket in the S3 console under Permissions > Bucket Policy:

```json
{
  "Version": "2008-10-17",
  "Id": "PolicyForPublicWebsiteContent",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::docsite-github-action/*"
    }
  ]
}
```

Replace `docsite-github-action` with your actual bucket name.

## Step 2: Create a scoped IAM user

Create a dedicated IAM user for GitHub Actions — don't use your root credentials. Attach this policy, which gives the minimum permissions needed for `s3 sync`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AccessToGetBucketLocation",
      "Effect": "Allow",
      "Action": ["s3:GetBucketLocation"],
      "Resource": ["arn:aws:s3:::*"]
    },
    {
      "Sid": "AccessToWebsiteBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::docsite-github-action",
        "arn:aws:s3:::docsite-github-action/*"
      ]
    }
  ]
}
```

## Step 3: Add AWS credentials to GitHub Secrets

In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add two repository secrets:

- `AWS_ACCESS_KEY_ID` — your IAM user's access key
- `AWS_SECRET_ACCESS_KEY` — the corresponding secret key

These are injected into the workflow at runtime. They never appear in logs.

## Step 4: Create the GitHub Actions workflow

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Nanoc Compile and Upload to S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Set up Ruby and Nanoc
        run: |
          sudo apt-get update
          sudo apt-get install -y ruby-full build-essential zlib1g-dev
          sudo gem install bundler
          sudo gem install nanoc
          sudo gem install adsf
          sudo gem install kramdown

      - name: Build Nanoc Website
        run: |
          ls
          cd tutorial && nanoc

      - name: Set AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Push to S3
        run: aws s3 sync tutorial/output/ s3://docsite-github-action
```

The workflow triggers on every push to `main`. It installs Ruby and Nanoc, compiles the site, and syncs the output directory to your S3 bucket.

## Alternatives to consider

This setup works well for simple static sites, but depending on your needs, other approaches might be a better fit:

| Approach | When to use it |
|----------|---------------|
| **S3 + CloudFront** | You need HTTPS and a CDN for global performance |
| **Vercel / Netlify** | You want zero-config deploys with preview URLs for every PR |
| **GitHub Pages** | You don't need AWS and want the simplest possible hosting |
| **AWS Amplify** | You want managed CI/CD with automatic branch deploys on AWS |

S3 alone doesn't give you HTTPS — you'd need CloudFront in front of it for that. If HTTPS and preview deployments matter to you, Vercel or Netlify will save you time.

## Common pitfalls

- **Forgetting to enable static website hosting** on the S3 bucket — without it, S3 serves files as downloads instead of web pages.
- **Overly broad IAM permissions** — scope the policy to your specific bucket, not `s3:*` on `*`.
- **Cache invalidation** — `s3 sync` updates files but doesn't invalidate CloudFront caches. If you add CloudFront later, add `aws cloudfront create-invalidation` to the workflow.
- **Region mismatch** — set `aws-region` in the workflow to match your bucket's region.

The complete workflow YAML and policies are in the [repo](https://github.com/ratnesh-maurya/365-Days-of-DevOps/tree/main).
