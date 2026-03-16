---
title: "Optimizing Memory Layout in Go: A Deep Dive into Struct Design"
description: How Go struct field ordering affects memory usage through alignment and padding, with concrete benchmarks showing the difference across millions of allocations and practical tools to detect wasted space.
author: Ratnesh Maurya
date: "2025-01-10"
category: Golang
image: "/images/blog/Optimizing-Memory-Layout-in-Go-A-Deep-Dive-into-Struct-Design.jpg"
tags: ["Go", "Backend", "System Design"]
questions: [
  "How to optimize memory layout in Go?",
  "How does struct field ordering affect memory in Go?",
  "What is memory alignment in Go?",
  "How to reduce memory usage in Go structs?",
  "What is the impact of struct field ordering on performance?",
  "How does Go handle struct memory layout?",
  "What is padding in Go structs?",
  "How to design efficient Go structs?"
]
---

Reorder the fields in a Go struct and the size changes — without changing the data it holds. A `bool` next to an `int64` wastes 7 bytes of padding. Across 10 million allocations, that's 67MB of memory you're paying for but never using.

This matters in high-throughput services where struct slices dominate heap usage: event pipelines, in-memory caches, analytics collectors.

## How alignment and padding work

Go stores struct fields in a contiguous block of memory. Each field must be aligned to a memory address that's a multiple of its own size — `int64` aligns to 8 bytes, `int32` to 4, `bool` to 1. When a smaller field is followed by a larger one, the compiler inserts invisible padding bytes to satisfy the alignment requirement.

```go
type Bad struct {
    Active  bool    // 1 byte
    // 7 bytes padding
    Balance float64 // 8 bytes
    Age     uint8   // 1 byte
    // 7 bytes padding
}
// Total: 24 bytes (only 10 bytes of actual data)
```

Reorder from largest to smallest:

```go
type Good struct {
    Balance float64 // 8 bytes
    Active  bool    // 1 byte
    Age     uint8   // 1 byte
    // 6 bytes padding (struct itself aligns to 8)
}
// Total: 16 bytes (same 10 bytes of data, 8 bytes less waste)
```

That's a 33% reduction per struct, just by reordering fields.

## Measuring the difference

Use `reflect.TypeOf` and `unsafe.Sizeof` to check struct sizes at runtime:

```go
package main

import (
    "fmt"
    "reflect"
    "unsafe"
)

type Bad struct {
    Active  bool
    Balance float64
    Age     uint8
}

type Good struct {
    Balance float64
    Active  bool
    Age     uint8
}

func main() {
    fmt.Println("Bad:", unsafe.Sizeof(Bad{}), "bytes")   // 24
    fmt.Println("Good:", unsafe.Sizeof(Good{}), "bytes") // 16

    // Field-by-field inspection
    t := reflect.TypeOf(Bad{})
    for i := 0; i < t.NumField(); i++ {
        f := t.Field(i)
        fmt.Printf("  %s: size=%d, offset=%d\n", f.Name, f.Type.Size(), f.Offset)
    }
}
```

## How much memory this saves at scale

Here's the math for a real scenario — an analytics service tracking page view events:

```go
type PageView struct {
    // Unoptimized layout
    IsBot      bool      // 1 + 7 padding
    Timestamp  int64     // 8
    StatusCode uint16    // 2 + 6 padding
    Duration   int64     // 8
    UserID     uint32    // 4 + 4 padding
    PathHash   uint64    // 8
}
// Size: 48 bytes

type PageViewOptimized struct {
    // Sorted by alignment: 8 → 4 → 2 → 1
    Timestamp  int64
    Duration   int64
    PathHash   uint64
    UserID     uint32
    StatusCode uint16
    IsBot      bool
}
// Size: 32 bytes
```

| Struct count | Unoptimized | Optimized | Saved |
|-------------|-------------|-----------|-------|
| 100K | 4.6 MB | 3.1 MB | 1.5 MB |
| 1M | 45.8 MB | 30.5 MB | 15.3 MB |
| 10M | 457 MB | 305 MB | 152 MB |

At 10 million structs, the difference is 152MB — enough to matter for your container memory limits and GC pressure.

## Automated detection with fieldalignment

You don't need to manually audit every struct. The `fieldalignment` analyzer from `golang.org/x/tools` catches suboptimal layouts automatically:

```bash
go install golang.org/x/tools/go/analysis/passes/fieldalignment/cmd/fieldalignment@latest
fieldalignment ./...
```

It reports every struct that could be smaller and suggests the optimal field order. You can also run it as part of `golangci-lint` by enabling the `govet` linter with the `fieldalignment` check.

## The alignment rules

| Type | Size | Alignment |
|------|------|-----------|
| `bool`, `byte`, `uint8`, `int8` | 1 byte | 1 |
| `uint16`, `int16` | 2 bytes | 2 |
| `uint32`, `int32`, `float32` | 4 bytes | 4 |
| `uint64`, `int64`, `float64`, pointer, `string`, slice, map, interface | 8 bytes | 8 |

The general rule: **sort fields from largest alignment to smallest.** This minimizes padding because smaller fields can pack together in the leftover space after larger fields.

Structs themselves are padded to a multiple of their largest field's alignment. That's why the `Good` struct above is 16 bytes (multiple of 8) even though the data only needs 10 bytes.

## When not to bother

Field ordering optimization is worth the effort when:
- You allocate millions of the same struct (event pipelines, time-series data, game state)
- The struct is stored in a large slice that stays in memory
- You're hitting container memory limits or seeing heavy GC pauses

It's not worth the effort when:
- The struct is allocated once or a handful of times
- Readability would suffer from rearranging logically grouped fields
- The struct is mostly pointers and strings (already 8-byte aligned)

Run `fieldalignment` on your codebase as a CI check. Fix the easy wins — the structs that save 8+ bytes per instance — and leave the rest alone. The tool does the thinking for you.
