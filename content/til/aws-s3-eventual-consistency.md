---
title: "AWS S3 now provides strong read-after-write consistency"
date: "2025-01-25"
category: "AWS"
tags: ["aws", "s3", "consistency", "cloud"]
---

Before December 2020, S3 had eventual consistency for overwrite PUTs and DELETEs — meaning you could read stale data immediately after a write. This caught many developers off guard.

Since December 2020, **S3 provides strong read-after-write consistency for all operations** — PUTs, DELETEs, and LIST operations — at no extra cost.

This means:
- Write an object → immediately readable
- Delete an object → immediately gone from LIST
- Overwrite an object → next GET returns the new version

```go
// This is now safe — no sleep/retry needed after upload
_, err := s3Client.PutObject(ctx, &s3.PutObjectInput{
    Bucket: aws.String("my-bucket"),
    Key:    aws.String("config.json"),
    Body:   bytes.NewReader(data),
})

// This will always return the latest data
result, err := s3Client.GetObject(ctx, &s3.GetObjectInput{
    Bucket: aws.String("my-bucket"),
    Key:    aws.String("config.json"),
})
```

Old codebases may still have unnecessary retry loops from the eventual consistency era — worth cleaning up.
