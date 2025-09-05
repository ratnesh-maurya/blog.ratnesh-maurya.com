---
question: "Why is my JavaScript breaking with 'Unexpected token' errors?"
date: "2024-01-08"
tags: ["javascript", "syntax-errors", "semicolons"]
category: "JavaScript"
---

**The Answer:** You're probably missing a semicolon somewhere! 😅

JavaScript has something called "Automatic Semicolon Insertion" (ASI), but it doesn't always work the way you expect. Sometimes a missing semicolon can cause the next line to be interpreted as part of the previous statement.

**Common scenarios:**

```javascript
// This breaks:
let a = 5
let b = 10
[1, 2, 3].forEach(console.log) // Error!

// JavaScript sees this as:
let a = 5let b = 10[1, 2, 3].forEach(console.log)
```

**How to avoid this:**

1. **Use a linter** like ESLint with semicolon rules
2. **Be consistent** - either always use semicolons or never use them
3. **Use Prettier** to automatically format your code
4. **Learn the ASI rules** if you want to go semicolon-free

**My recommendation:** Just use semicolons. It's clearer, more explicit, and prevents these weird edge cases. Your future self will thank you! 🙏
