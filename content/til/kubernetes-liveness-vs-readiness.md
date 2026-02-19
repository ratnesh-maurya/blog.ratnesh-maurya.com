---
title: "Kubernetes: liveness vs readiness probes are not the same thing"
date: "2025-02-01"
category: "Kubernetes"
tags: ["kubernetes", "k8s", "probes", "devops"]
---

Confusing these two causes subtle production incidents.

**Liveness probe** — answers: "Is this container dead and should be restarted?"
- Failure → Kubernetes kills and restarts the container
- Use for: detecting deadlocks, infinite loops, completely broken state

**Readiness probe** — answers: "Is this container ready to serve traffic?"
- Failure → Kubernetes removes the pod from the Service endpoints (stops sending traffic)
- Use for: startup time, temporary overload, database connection not ready

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 15

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

Common mistake: using the same endpoint for both. Your `/healthz` (liveness) should be a simple "am I alive" check. Your `/ready` should check DB connection, cache, etc.
