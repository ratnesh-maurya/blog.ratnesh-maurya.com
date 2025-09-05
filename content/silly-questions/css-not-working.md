---
question: "Why isn't my CSS working? I've been staring at it for hours!"
date: "2024-01-05"
tags: ["css", "debugging", "typos"]
category: "CSS"
---

**The Answer:** You probably have a typo in your CSS selector or property name! 🤦‍♂️

This happens to everyone. You write what you think is perfect CSS, but there's a tiny typo that breaks everything.

**Common culprits:**

1. **Typos in class names:**
   ```css
   /* You wrote */
   .btn-primray { color: blue; }
   
   /* But your HTML has */
   <button class="btn-primary">Click me</button>
   ```

2. **Missing semicolons:**
   ```css
   .my-class {
     color: red  /* Missing semicolon! */
     background: blue;
   }
   ```

3. **Wrong property names:**
   ```css
   .my-class {
     text-colour: red; /* Should be 'color' */
     font-wieght: bold; /* Should be 'weight' */
   }
   ```

4. **Selector specificity issues:**
   ```css
   /* This is more specific and overrides your styles */
   div.container .my-class { color: green; }
   
   /* Your style gets overridden */
   .my-class { color: red; }
   ```

**How to debug:**

1. **Use browser dev tools** - Right-click → Inspect Element
2. **Check the computed styles** - See what's actually being applied
3. **Look for crossed-out styles** - These are being overridden
4. **Validate your CSS** - Use a CSS validator to catch syntax errors

**Pro tip:** Use a good code editor with CSS IntelliSense. It'll catch most typos before you even save the file!

Remember: CSS is case-sensitive for class names but not for property names. `background-Color` works, but `.MyClass` and `.myclass` are different! 🎨
