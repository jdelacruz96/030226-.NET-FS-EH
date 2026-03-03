# Node.js as a JavaScript Runtime

## Learning Objectives
- Define Node.js and explain its role as a runtime outside the browser
- Understand the event loop at a high level
- Recognize npm as the package manager that powers the React ecosystem

## Why This Matters

Before React can run in your browser, an entire toolchain compiles, bundles, and serves your code. That toolchain runs on Node.js. The TypeScript compiler, Webpack, Vite, ESLint, testing frameworks -- all of them are Node.js programs. Understanding what Node.js is and how its package ecosystem works is essential for setting up, debugging, and maintaining every React project you will build this week.

## The Concept

### What Is Node.js?

Node.js is a **JavaScript runtime** built on Chrome's V8 engine. It allows you to execute JavaScript outside of a web browser -- on your local machine, on a server, or in a CI/CD pipeline.

Before Node.js (released in 2009), JavaScript was confined to the browser. Node.js changed that by providing:

- A way to run JavaScript on the server
- Access to the file system, network, and operating system APIs
- A package ecosystem (npm) that now hosts over two million packages

### The Event Loop (High Level)

Node.js uses a **single-threaded, event-driven** architecture. Instead of spawning a new thread for every incoming request (like traditional servers), Node.js processes events in a loop:

```
1. Receive a request or callback
2. If the operation is non-blocking (e.g., reading a file), register a callback and move on
3. When the operation completes, the callback is placed on the event queue
4. The event loop picks up the next callback and executes it
```

This design makes Node.js highly efficient for I/O-heavy workloads (web servers, build tools, file processing). It is less suited for CPU-intensive computation, but that is not its primary use case in front-end development.

For React development, you do not need to master the event loop. You need to know that Node.js is what executes the build tools and dev servers you rely on.

### npm: The Node Package Manager

npm is installed automatically with Node.js. It serves two purposes:

1. **A command-line tool** for installing, updating, and managing packages.
2. **A registry** (npmjs.com) hosting packages that anyone can publish or consume.

Common npm commands you will use daily:

```bash
# Initialize a new project:
npm init -y

# Install a package (production dependency):
npm install react

# Install a package (development dependency):
npm install --save-dev typescript

# Install all dependencies listed in package.json:
npm install

# Run a script defined in package.json:
npm run dev

# Update packages to their latest compatible versions:
npm update
```

### npx: Running Packages Without Installing

`npx` is a tool bundled with npm that lets you execute a package without permanently installing it. This is commonly used for project scaffolding:

```bash
# Create a new React + TypeScript project with Vite:
npx create-vite@latest my-app --template react-ts
```

`npx` downloads the package, runs it, and discards it.

### Node.js Version Management

Different projects may require different Node.js versions. Tools like `nvm` (Node Version Manager) let you switch versions seamlessly:

```bash
# Install a specific version:
nvm install 20

# Switch to it:
nvm use 20

# Check current version:
node --version
```

Using a consistent Node.js version across the team prevents compatibility issues.

### How Node.js Connects to React Development

| Node.js Role | What It Does |
|---|---|
| **Build tool runtime** | Runs Webpack, Vite, and the TypeScript compiler |
| **Dev server** | Serves your React app locally with hot-reloading |
| **Package management** | Installs React, TypeScript, and every other dependency via npm |
| **Testing** | Runs test frameworks like Vitest and Jest |
| **Linting** | Runs ESLint to enforce code quality rules |

You do not deploy Node.js to the browser. The browser only receives the compiled JavaScript that Node.js tooling produces.

## Code Example

Verifying your Node.js and npm installation:

```bash
# Check Node.js version:
node --version
# v20.11.0

# Check npm version:
npm --version
# 10.2.0

# Run a quick TypeScript check:
npx tsc --version
# Version 5.3.3
```

A simple Node.js script demonstrating runtime execution:

```typescript
// hello-node.ts
const platform: string = process.platform;
const nodeVersion: string = process.version;

console.log(`Running on ${platform} with Node.js ${nodeVersion}`);
```

```bash
npx ts-node hello-node.ts
# Output: Running on win32 with Node.js v20.11.0
```

## Summary

- Node.js is a JavaScript runtime that enables JavaScript execution outside the browser.
- Its event-driven, non-blocking architecture makes it efficient for I/O-heavy tasks like build tooling.
- npm is the package manager that installs and manages every dependency in a React project.
- Node.js is a development-time dependency for React -- it runs your build tools, dev server, and test suite.

## Additional Resources
- [Node.js Official Documentation](https://nodejs.org/en/docs)
- [npm Documentation](https://docs.npmjs.com/)
- [Node.js Event Loop Explained (Node.js Guides)](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
