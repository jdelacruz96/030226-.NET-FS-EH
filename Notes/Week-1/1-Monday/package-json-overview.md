# package.json Overview

## Learning Objectives
- Understand the role of `package.json` as the manifest for a Node.js project
- Distinguish between `dependencies` and `devDependencies`
- Read and write npm scripts for common development tasks
- Interpret semantic versioning (semver) notation

## Why This Matters

Every React project -- and every Node.js project -- begins with a `package.json` file. It is the single source of truth for what your project depends on, how to build it, how to test it, and how to run it. Misunderstanding this file leads to broken installs, version conflicts, and confused team members. Mastering `package.json` is a prerequisite for every tool and framework you will use this week.

## The Concept

### What Is `package.json`?

`package.json` is a JSON file at the root of any Node.js project. It serves as the project manifest, containing metadata (name, version, description) and operational configuration (dependencies, scripts, engines).

Create one interactively:

```bash
npm init
```

Or with all defaults:

```bash
npm init -y
```

### Anatomy of `package.json`

```json
{
  "name": "taskflow-app",
  "version": "1.0.0",
  "description": "A React + TypeScript task management application",
  "main": "dist/index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "vite": "^5.0.0",
    "eslint": "^8.55.0",
    "vitest": "^1.0.0"
  }
}
```

### Dependencies vs. devDependencies

| Field | Purpose | Example Packages |
|---|---|---|
| `dependencies` | Packages required at **runtime** -- they ship with your application. | `react`, `react-dom`, `axios` |
| `devDependencies` | Packages required only during **development** -- build tools, linters, test frameworks. | `typescript`, `vite`, `eslint`, `vitest` |

Install to each category using:

```bash
# Production dependency:
npm install react

# Development dependency:
npm install --save-dev typescript
```

The distinction matters for production builds. When deploying, you can run `npm install --production` to skip devDependencies and reduce the install footprint.

### npm Scripts

The `scripts` field defines custom commands that you run with `npm run <script-name>`:

```bash
npm run dev      # Starts the development server
npm run build    # Compiles TypeScript and builds for production
npm run lint     # Runs ESLint across the source directory
npm run test     # Runs the test suite
```

Two scripts have shorthand forms:
- `npm start` (equivalent to `npm run start`)
- `npm test` (equivalent to `npm run test`)

Scripts can chain other scripts and use shell operators:

```json
"scripts": {
  "prebuild": "npm run lint",
  "build": "tsc && vite build"
}
```

The `pre` prefix runs automatically before the named script. In the example above, `npm run build` will first execute `npm run lint`.

### Semantic Versioning (Semver)

Dependency versions follow the **MAJOR.MINOR.PATCH** format:

| Segment | Meaning | Example |
|---|---|---|
| MAJOR | Breaking changes | `2.0.0` -- API changed incompatibly |
| MINOR | New features, backward-compatible | `1.3.0` -- added a new function |
| PATCH | Bug fixes, backward-compatible | `1.3.7` -- fixed a rendering bug |

Version range operators in `package.json`:

| Notation | Meaning |
|---|---|
| `^18.2.0` | Compatible with 18.x.x (allows minor and patch updates) |
| `~18.2.0` | Approximately 18.2.x (allows patch updates only) |
| `18.2.0` | Exact version, no updates |
| `*` | Any version (rarely used in practice) |

The caret (`^`) is the default when you run `npm install`. It provides a good balance between stability and receiving bug fixes.

### The `package-lock.json` File

When you run `npm install`, npm generates `package-lock.json`. This file records the **exact** resolved versions of every package (including transitive dependencies). It ensures that every developer on the team installs the identical dependency tree.

- **Always commit `package-lock.json` to version control.**
- **Never edit it manually.**

### The `node_modules` Directory

All installed packages are stored in the `node_modules` directory. This directory is large, auto-generated, and should **never** be committed to version control. Add it to `.gitignore`:

```
node_modules/
```

## Code Example

Creating a minimal `package.json` for a TypeScript + React project:

```bash
mkdir taskflow-app
cd taskflow-app
npm init -y
npm install react react-dom
npm install --save-dev typescript @types/react @types/react-dom
```

The resulting `package.json` will contain:

```json
{
  "name": "taskflow-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

## Summary

- `package.json` is the manifest for every Node.js and React project.
- `dependencies` are runtime packages; `devDependencies` are development-only tools.
- npm scripts automate common tasks like building, linting, and testing.
- Semantic versioning (`MAJOR.MINOR.PATCH`) communicates the nature of changes; the caret (`^`) allows compatible updates.
- Always commit `package-lock.json`; never commit `node_modules`.

## Additional Resources
- [npm Docs -- package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [Semantic Versioning Specification (semver.org)](https://semver.org/)
- [Node.js Guides -- An Introduction to the npm Package Manager](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)
