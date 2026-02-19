---
title: "Go maps are not safe for concurrent reads and writes"
date: "2025-01-10"
category: "Go"
tags: ["go", "concurrency", "maps"]
---

Accessing a Go map from multiple goroutines simultaneously — even for reads — can cause a panic if any goroutine is writing.

```go
// This will panic under concurrent access
m := map[string]int{}
go func() { m["key"] = 1 }()
go func() { fmt.Println(m["key"]) }()
```

The fix: use `sync.RWMutex` for read-heavy maps, or `sync.Map` for maps with high write concurrency.

```go
var mu sync.RWMutex
mu.Lock()
m["key"] = 1
mu.Unlock()

mu.RLock()
val := m["key"]
mu.RUnlock()
```

Go 1.9+ detects concurrent map writes and panics immediately — by design — so the bug is never silent.
