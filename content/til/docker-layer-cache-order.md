---
title: "Docker layer cache order matters — put COPY last"
date: "2025-02-15"
category: "Docker"
tags: ["docker", "dockerfile", "caching", "devops"]
---

Docker caches each instruction as a layer. Once a layer changes, all subsequent layers are rebuilt. Order your Dockerfile so things that change least often come first.

**Bad — copies source code before installing dependencies:**

```dockerfile
FROM golang:1.23
WORKDIR /app
COPY . .                    # Changes every commit
RUN go mod download         # Busts cache every time
RUN go build -o server .
```

**Good — install dependencies first, copy source last:**

```dockerfile
FROM golang:1.23
WORKDIR /app
COPY go.mod go.sum ./       # Only changes when deps change
RUN go mod download         # Cached until go.mod changes
COPY . .                    # Changes every commit
RUN go build -o server .
```

The result: `go mod download` is cached across commits that don't change dependencies, making builds significantly faster in CI.
