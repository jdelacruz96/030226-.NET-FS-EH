# TypeScript Compiler and Installation

## Learning Objectives
- Install TypeScript both globally and locally using npm
- Understand the purpose and key options in `tsconfig.json`
- Compile TypeScript files using the `tsc` command

## Why This Matters

TypeScript does not run directly in the browser or in Node.js. It must be compiled (transpiled) into plain JavaScript first. Understanding how to install and configure the TypeScript compiler is a foundational skill -- it is the bridge between the typed code you write and the JavaScript that actually executes. Every React + TypeScript project you build this week depends on this compilation step, whether it happens explicitly via `tsc` or implicitly through a bundler like Webpack or Vite.

## The Concept

### Installing TypeScript

TypeScript is distributed as an npm package. You can install it in two ways:

**Global Installation** -- available system-wide:

```bash
npm install -g typescript
```

After a global install, the `tsc` command is available from any directory:

```bash
tsc --version
# Output: Version 5.x.x
```

**Local Installation** -- scoped to a single project (recommended for teams):

```bash
npm install --save-dev typescript
```

A local install ensures every developer on the team uses the exact same TypeScript version, avoiding "works on my machine" issues. You run it via `npx`:

```bash
npx tsc --version
```

### The TypeScript Compiler (`tsc`)

The `tsc` command reads `.ts` and `.tsx` files, checks them for type errors, and emits corresponding `.js` files. At its simplest:

```bash
# Compile a single file:
tsc app.ts
# Produces: app.js
```

For larger projects, `tsc` reads configuration from a `tsconfig.json` file.

### Configuring `tsconfig.json`

The `tsconfig.json` file is the central configuration point for the TypeScript compiler. Generate a starter config with:

```bash
tsc --init
```

This creates a `tsconfig.json` with sensible defaults and extensive comments. Here is a simplified version with the most important options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Key Compiler Options Explained

| Option | Purpose |
|---|---|
| `target` | The ECMAScript version the output should conform to (e.g., `ES2020`, `ES6`). |
| `module` | The module system for the output (`ESNext`, `CommonJS`). |
| `lib` | Standard library type definitions to include (`DOM` for browser APIs, `ES2020` for modern JS features). |
| `jsx` | How JSX/TSX is handled. `react-jsx` uses the automatic runtime (React 17+). |
| `strict` | Enables all strict type-checking options. **Always recommended.** |
| `esModuleInterop` | Allows default imports from CommonJS modules (e.g., `import React from 'react'`). |
| `outDir` | Directory for compiled JavaScript output. |
| `rootDir` | Root directory of source files. |
| `include` | Glob patterns specifying which files to compile. |
| `exclude` | Glob patterns specifying which files to skip. |

### The `strict` Flag

The `strict` flag is a shorthand that enables several individual strict checks:

- `strictNullChecks` -- Variables cannot be `null` or `undefined` unless explicitly typed that way.
- `noImplicitAny` -- The compiler will not silently infer the `any` type; you must declare types.
- `strictFunctionTypes` -- Stricter checking of function parameter types.
- `strictPropertyInitialization` -- Class properties must be initialized in the constructor.

Turning `strict` on from the start is strongly recommended. It is far easier to start strict than to retrofit strictness into a loose codebase later.

### Compilation Workflow

A typical workflow looks like this:

```
  Source (.ts / .tsx)
        |
        v
   tsc (compiler)  <-- reads tsconfig.json
        |
        v
   Output (.js)    --> runs in browser / Node.js
```

In a React project, you rarely run `tsc` directly. Instead, a bundler (Webpack, Vite) integrates the TypeScript compiler into its build pipeline. However, understanding `tsc` is essential for debugging configuration issues and for projects that do not use a bundler.

### Watching for Changes

During development, you can have `tsc` automatically recompile when files change:

```bash
tsc --watch
```

This is useful for standalone TypeScript projects. In React projects, the dev server (e.g., Vite) handles this for you.

## Code Example

A complete minimal example from source to compiled output:

```typescript
// src/greet.ts
function greet(name: string): string {
  return `Welcome to the TypeScript + React training, ${name}!`;
}

console.log(greet("Trainee"));
```

Compile and run:

```bash
tsc src/greet.ts --outDir dist
node dist/greet.js
# Output: Welcome to the TypeScript + React training, Trainee!
```

The compiled JavaScript (`dist/greet.js`) will look like:

```javascript
"use strict";
function greet(name) {
    return `Welcome to the TypeScript + React training, ${name}!`;
}
console.log(greet("Trainee"));
```

Notice that the type annotation (`: string`) is stripped -- it was only used during compilation for validation.

## Summary

- TypeScript is installed via npm, either globally (`npm install -g typescript`) or locally (`npm install --save-dev typescript`).
- The `tsc` command compiles `.ts`/`.tsx` files into JavaScript.
- `tsconfig.json` controls compiler behavior; the `strict` flag should always be enabled.
- In React projects, the bundler typically invokes `tsc` for you, but understanding the compiler is essential for troubleshooting.

## Additional Resources
- [TypeScript tsconfig Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript Compiler Options (Handbook)](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [TypeScript Playground (try it online)](https://www.typescriptlang.org/play)
