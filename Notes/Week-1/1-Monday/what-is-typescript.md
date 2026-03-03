# What Is TypeScript

## Learning Objectives
- Define TypeScript and its relationship to ECMAScript
- Understand how TypeScript compiles to a target JavaScript version
- Recognize TypeScript's position in the broader JavaScript ecosystem

## Why This Matters

Before diving into advanced TypeScript features, you need a clear, concise mental model of what TypeScript actually is. Many developers conflate TypeScript with entirely new languages or assume it replaces JavaScript. Neither is true. TypeScript is an extension of JavaScript, and everything you learn about TypeScript builds directly on your JavaScript knowledge. This clarity will prevent confusion as you start writing typed React components later today.

## The Concept

### A Concise Definition

TypeScript is a **statically typed superset of JavaScript** developed and maintained by Microsoft. It adds optional type annotations, interfaces, enums, generics, and other features on top of standard JavaScript. The TypeScript compiler (`tsc`) strips these additions and outputs plain JavaScript that runs anywhere JavaScript runs.

In short: **TypeScript = JavaScript + Types**.

### Relationship to ECMAScript

ECMAScript (ES) is the official specification that defines JavaScript. When you hear "ES6," "ES2020," or "ESNext," those refer to specific versions of the ECMAScript specification.

TypeScript tracks the ECMAScript specification closely:

- Every valid ECMAScript feature is valid TypeScript.
- TypeScript often implements proposed ECMAScript features (such as decorators or optional chaining) before they are finalized in the spec.
- The `target` option in `tsconfig.json` determines which ECMAScript version the compiler outputs.

```json
{
  "compilerOptions": {
    "target": "ES2020"
  }
}
```

With this setting, TypeScript will compile your code into syntax compatible with ES2020. If you use a newer feature (like top-level `await`), the compiler will either emit it directly (if the target supports it) or transform it into an older equivalent.

### The Compilation Target

TypeScript's type system exists **only at compile time**. At runtime, there is no trace of TypeScript -- the browser or Node.js executes plain JavaScript.

```
  TypeScript Source (.ts / .tsx)
         |
    tsc compiler
         |
  JavaScript Output (.js)  -->  Browser / Node.js
```

This means:
- There is **zero runtime overhead** from TypeScript's type system.
- Type errors are caught during development, not in production.
- You can adopt TypeScript incrementally -- rename `.js` to `.ts` and add types gradually.

### What TypeScript Adds to JavaScript

| Feature | JavaScript | TypeScript |
|---|---|---|
| Type annotations | Not available | `let x: number = 5;` |
| Interfaces | Not available | `interface User { name: string; }` |
| Enums | Not available | `enum Direction { Up, Down }` |
| Generics | Not available | `Array<string>`, `useState<number>()` |
| Access modifiers | Not available | `public`, `private`, `protected` |
| Type inference | N/A | Compiler infers types when not annotated |

### Type Inference

You do not have to annotate every variable. TypeScript's type inference engine deduces types from context:

```typescript
// Explicit annotation:
let greeting: string = "Hello, TypeScript";

// Inferred -- TypeScript knows this is a string:
let greeting = "Hello, TypeScript";

// Both are equivalent. The compiler enforces the type either way:
greeting = 42; // Error: Type 'number' is not assignable to type 'string'.
```

This means TypeScript is not verbose by default -- you only annotate when inference is insufficient or when you want to communicate intent clearly (such as in function signatures and interfaces).

### TypeScript's Position in the Ecosystem

TypeScript is not a competitor to JavaScript -- it is a layer on top of it. The ecosystem reflects this:

- **React** ships with first-class TypeScript support.
- **Node.js** type definitions are maintained by the `@types/node` package.
- **VS Code** is built with TypeScript and provides best-in-class TypeScript tooling.
- **DefinitelyTyped** (`@types/*` packages) provides type definitions for thousands of JavaScript libraries.

## Code Example

A minimal TypeScript example demonstrating the core ideas:

```typescript
// TypeScript adds types; JavaScript does all the work at runtime.

type Role = "admin" | "editor" | "viewer"; // Union type -- only these three values are valid.

interface TeamMember {
  name: string;
  role: Role;
  yearsOfExperience: number;
}

function introduce(member: TeamMember): string {
  return `${member.name} is a${member.role === "admin" ? "n" : ""} ${member.role} with ${member.yearsOfExperience} year(s) of experience.`;
}

const dev: TeamMember = {
  name: "Jordan",
  role: "editor",
  yearsOfExperience: 3,
};

console.log(introduce(dev));
// "Jordan is an editor with 3 year(s) of experience."
```

After compilation, the type annotations and interface disappear. The output is clean JavaScript.

## Summary

- TypeScript is a statically typed superset of JavaScript maintained by Microsoft.
- It compiles to plain JavaScript and introduces zero runtime overhead.
- TypeScript tracks the ECMAScript specification and adds types, interfaces, enums, and generics on top of it.
- Type inference reduces verbosity -- you only annotate when needed.
- The React ecosystem has first-class TypeScript support, making it the natural choice for typed component development.

## Additional Resources
- [TypeScript Official Site](https://www.typescriptlang.org/)
- [TypeScript Handbook -- The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [DefinitelyTyped Repository](https://github.com/DefinitelyTyped/DefinitelyTyped)
