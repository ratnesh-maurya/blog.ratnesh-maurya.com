---
question: "You accidentally deleted an important branch that was never merged and no one has a local copy. How do you recover it?"
date: "2026-04-01"
tags: ["git", "branch-recovery", "reflog", "disaster-recovery"]
category: "Git"
---

**The Answer:** Recover the commit first, then recreate the branch pointer. Most of the time, the data is still there. ✅

When a branch is deleted, Git usually removes only the **reference** (the branch name), not the commit objects immediately. Recovery depends on where the commits still exist.

**Fast recovery flow (best to worst):**

1. **Check local reflog (if your clone had ever seen the branch):**
   ```bash
   git reflog --all --date=iso | grep "<branch-name-or-commit-hint>"
   ```
   If you find the commit SHA:
   ```bash
   git checkout -b <recovered-branch> <sha>
   ```

2. **Search dangling commits in the repo object database:**
   ```bash
   git fsck --lost-found --no-reflogs
   ```
   Inspect candidate commits:
   ```bash
   git show <sha>
   ```
   Then restore:
   ```bash
   git checkout -b <recovered-branch> <sha>
   ```

3. **Check remote hosting refs/history:**
   - If the branch had an open PR, the PR often still points to the head commit.
   - CI logs, deployment metadata, or old release notes may contain the commit SHA.

4. **If GitHub branch was deleted and no one has SHA:**
   - Check closed/open PRs, workflow logs, and commit search in the repository.
   - As last resort, contact GitHub Support quickly (garbage collection can eventually prune unreachable objects).

**Important:** Once you recover the SHA, immediately recreate and push:

```bash
git checkout -b <recovered-branch> <sha>
git push -u origin <recovered-branch>
```

**Prevention tips:**

- Protect critical branches with deletion restrictions.
- Require PRs for long-running work.
- Keep backups/mirrors for high-risk repos.
- Turn on branch protection + status checks.

In short: branch name gone ≠ work gone. Find the commit SHA, recreate the branch, push it, and protect important branches going forward.
