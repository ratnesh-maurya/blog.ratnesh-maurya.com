---
title: Easily Deploy Your Nanoc Website to S3 with GitHub Actions
description: Learn how to deploy your Nanoc website to an AWS S3 bucket using GitHub Actions. This step-by-step guide provides detailed instructions for automating your deployment process.
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


In the ever-evolving realm of web development, streamlining deployment processes has become crucial for maintaining efficiency and ensuring seamless website updates. GitHub Actions, a powerful tool for automating tasks within your GitHub repository, offers an excellent solution for deploying your Nanoc website to an AWS S3 bucket.

This article delves into the intricacies of deploying a Nanoc website to S3 using GitHub Actions, providing a step-by-step guide to help you seamlessly automate your deployment process.

[Repo Link here](https://github.com/ratnesh-maurya/365-Days-of-DevOps/tree/main)

## Prerequisites:

Before embarking on this deployment journey, ensure you have the following prerequisites in place:

1.  **AWS Account and S3 Bucket:** Create an AWS account if you haven't already. Set up an S3 bucket to host your Nanoc website.
2.  **IAM Credentials:** Generate IAM credentials with the necessary permissions to access the S3 bucket. Refer to the IAM policy provided in the repository for detailed permission requirements.
3.  **GitHub Repository**: Maintain a GitHub repository containing the source code for your Nanoc website.

Leveraging GitHub Actions for Deployment:

GitHub Actions simplifies the deployment process by automating the following tasks:

1.  Checkout Repository: Retrieves the source code from your GitHub repository.
2.  Set up Ruby and Nanoc:Installs Ruby, Bundler, Nanoc, and other required gems.
3.  Build Nanoc Website: Compiles the Nanoc website within the tutorial directory.
4.  Configure AWS Credentials: Secures AWS credentials for the GitHub Actions workflow using the provided secrets.
5.  Deploy to S3: Synchronizes the compiled Nanoc website from the tutorial/output/ directory to the specified S3 bucket.

**Step-by-Step Deployment Guide**:

1.  Configure S3 Bucket: Create an S3 bucket to host your Nanoc website. Apply the provided S3 bucket policy to the newly created bucket.

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

1.  Create IAM User and Policy: Create an IAM user in your AWS account. Attach the provided IAM user policy to the newly created IAM user.

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

1.  Add Secrets to GitHub Repository:Navigate to the Settings tab in your GitHub repository.Access the Secrets section.Add two secrets:AWS_ACCESS_KEY_ID: Paste your AWS Access Key ID. AWS_SECRET_ACCESS_KEY: Paste your AWS Secret Access Key.
2.  Deploy Using GitHub Actions: Push the latest changes to your GitHub repository's main branch.GitHub Actions will automatically trigger the deployment workflow.

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

Conclusion:

Harnessing the power of GitHub Actions for deploying your Nanoc website to S3 streamlines your workflow and ensures consistent, automated updates. By following the provided steps and prerequisites, you can seamlessly deploy your website with ease and efficiency.

Remember, the provided S3 bucket policy and IAM user policy are for reference only. You may need to adjust them to fit your specific requirements. Additionally, ensure you have the necessary permissions to create an IAM user and IAM policy in your AWS account.

By leveraging GitHub Actions for Nanoc website deployment, you can focus on developing and enhancing your website while GitHub handles the deployment process seamlessly. Embrace the power of automation and streamline your web development workflow with GitHub Actions.
