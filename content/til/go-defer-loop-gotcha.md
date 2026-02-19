---
title: "Go defer inside a loop doesn't run until the function returns"
date: "2025-02-10"
category: "Go"
tags: ["go", "defer", "loops", "gotchas"]
---

A classic Go gotcha: `defer` in a loop defers until the **surrounding function** returns, not until the loop iteration ends.

```go
// BAD: files are not closed after each iteration
for _, filename := range files {
    f, _ := os.Open(filename)
    defer f.Close() // Only runs when the whole function exits!
}
```

If you open 1,000 files, all 1,000 stay open until the function exits. Under high load this exhausts file descriptors.

**Fix 1**: Wrap in an anonymous function so defer runs per iteration.

```go
for _, filename := range files {
    func() {
        f, _ := os.Open(filename)
        defer f.Close() // Now runs at end of anonymous func
        process(f)
    }()
}
```

**Fix 2**: Just call Close() explicitly without defer.

```go
for _, filename := range files {
    f, _ := os.Open(filename)
    process(f)
    f.Close()
}
```
