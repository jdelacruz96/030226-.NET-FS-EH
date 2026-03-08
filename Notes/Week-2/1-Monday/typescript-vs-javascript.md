# TypeScript vs. JavaScript

## Learning Objectives
- Identify the key differences between JavaScript and TypeScript
- Understand the role of static typing in reducing runtime errors
- Evaluate when TypeScript is the right choice for a project

## Why This Matters

In the modern front-end ecosystem, TypeScript has become a standard for professional-grade development. Teams working on large-scale React applications, cloud-native services, and enterprise products consistently choose TypeScript over plain JavaScript. Understanding the distinction between these two languages is not just academic -- it directly impacts the quality of the code you ship, the speed at which you onboard new team members, and the confidence you have when refactoring.

This is the foundation of our weekly epic: **From TypeScript Foundations to React Mastery and Cloud Awareness**. Every React component, hook, and API call you write this week will use TypeScript.

## The Concept

### JavaScript: The Starting Point

JavaScript is the scripting language of the web. It runs in every browser, powers Node.js on the server, and is the backbone of virtually every interactive website. It is dynamically typed, meaning that variable types are determined at runtime rather than at compile time.

```typescript
// In plain JavaScript, this is perfectly legal:
let count = 5;
count = "five"; // No error -- the type changed from number to string silently
```

This flexibility is useful for quick prototyping, but it can lead to subtle bugs that only surface when a user clicks a specific button or a server processes a specific request.

### TypeScript: JavaScript with a Safety Net

TypeScript is a **superset** of JavaScript. Every valid JavaScript file is also valid TypeScript, but TypeScript adds an optional static type system and compile-time checking on top of it. The TypeScript compiler (`tsc`) analyzes your code and catches errors *before* the code reaches the browser or server.

```typescript
let count: number = 5;
count = "five"; // Compile-time error: Type 'string' is not assignable to type 'number'.
```

This means bugs are caught during development, not in production.

### Side-by-Side Comparison

| Feature | JavaScript | TypeScript |
|---|---|---|
| **Typing** | Dynamic (resolved at runtime) | Static (resolved at compile time) |
| **File Extension** | `.js`, `.jsx` | `.ts`, `.tsx` |
| **Compilation** | Interpreted directly | Compiled to JavaScript via `tsc` |
| **Tooling Support** | Good (basic autocomplete) | Excellent (rich autocomplete, inline errors, refactoring) |
| **Type Annotations** | Not supported natively | First-class feature |
| **Learning Curve** | Lower initial barrier | Slightly higher, but pays dividends quickly |
| **Error Detection** | Mostly at runtime | At compile time, before code runs |
| **Ecosystem** | Universal | Growing rapidly; most major libraries ship type definitions |

### Interface and Type Annotations

One of TypeScript's most powerful features is the ability to define the **shape** of data using interfaces and type aliases:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}

// The compiler ensures you pass the correct shape:
greetUser({ id: 1, name: "Ada", email: "ada@example.com", isActive: true }); // Valid
greetUser({ id: 1, name: "Ada" }); // Error: missing 'email' and 'isActive'
```

### When to Choose TypeScript Over JavaScript

- **Team projects:** TypeScript serves as living documentation. New developers can read the types and understand the codebase faster.
- **Long-lived codebases:** Refactoring is dramatically safer when the compiler validates every change.
- **API-heavy applications:** Typing API responses prevents entire categories of "undefined is not a function" errors.
- **Enterprise environments:** TypeScript is the standard at companies like Microsoft, Google, Airbnb, and Stripe.

When might JavaScript still make sense? For very small scripts, quick throwaway prototypes, or environments where adding a build step is impractical.

## Code Example

Below is a practical example demonstrating how TypeScript catches a common bug that JavaScript would miss:

```typescript
// types.ts
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

// utils.ts
function formatPrice(product: Product): string {
  // TypeScript guarantees 'product.price' is a number here.
  return `$${product.price.toFixed(2)}`;
}

// This call is safe:
const item: Product = { id: 101, name: "Keyboard", price: 49.99, inStock: true };
console.log(formatPrice(item)); // "$49.99"

// This call would fail at compile time, not in production:
// formatPrice({ id: 102, name: "Mouse", price: "free", inStock: true });
// Error: Type 'string' is not assignable to type 'number'.
```

## Summary

- JavaScript is dynamically typed and runs natively in browsers and Node.js.
- TypeScript is a statically typed superset of JavaScript that compiles down to plain JavaScript.
- TypeScript catches errors at compile time, provides superior tooling, and scales better for teams and large projects.
- Every piece of React code you write this week will use TypeScript, so this distinction is the foundation for everything ahead.

## Additional Resources
- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript for JavaScript Programmers (TypeScript Handbook)](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [MDN Web Docs -- JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
