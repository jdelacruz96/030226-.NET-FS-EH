# TSX Overview

## Learning Objectives
- Describe TSX syntax and explain how it extends JSX with TypeScript's type system
- Understand how TSX compiles to JavaScript function calls and why the `.tsx` file extension matters
- Write type-safe expressions, conditionals, and dynamic content within TSX

## Why This Matters

Every React component you build in this training lives inside a `.tsx` file. TSX is the TypeScript flavor of JSX -- it combines HTML-like markup with full access to TypeScript's type checker. Understanding what TSX really is, how it differs from plain JSX, and what happens at compile time removes the "magic" and helps you debug rendering issues, write cleaner templates, and interpret error messages from the TypeScript compiler.

## The Concept

### What Is TSX?

TSX stands for **TypeScript + JSX**. When you give a file the `.tsx` extension, you tell the TypeScript compiler that the file contains JSX markup and should be parsed accordingly. Without the `.tsx` extension, TypeScript will reject any angle-bracket markup as a syntax error.

Under the hood, TSX compiles to the same function calls as JSX -- the difference is that TypeScript validates your types *before* the code reaches the browser.

```tsx
// This TSX (inside a .tsx file):
const element = <h1 className="title">Hello, TaskFlow</h1>;

// Compiles to this JavaScript (React 17+ automatic runtime):
const element = _jsx("h1", { className: "title", children: "Hello, TaskFlow" });
```

Before React 17, JSX compiled to `React.createElement()` calls, which is why older projects imported React in every file. With the automatic runtime (`"jsx": "react-jsx"` in `tsconfig.json`), that import is no longer required. The `tsconfig.json` setting is what configures how your `.tsx` files are transformed.

### TSX vs. JSX -- What Changes with TypeScript?

| Aspect | JSX (`.jsx`) | TSX (`.tsx`) |
|---|---|---|
| File extension | `.jsx` | `.tsx` |
| Type checking | None at compile time | Full TypeScript type checking |
| Props validation | Runtime only (PropTypes) | Compile-time via interfaces/types |
| Inline style objects | Untyped | Typed as `React.CSSProperties` |
| Generic syntax | `<T>` works freely | `<T,>` or `<T extends unknown>` needed to avoid ambiguity with JSX tags |

The generic syntax difference is a common gotcha. In a `.tsx` file, `<T>` looks like an opening JSX tag to the parser, so you add a trailing comma (`<T,>`) or a constraint (`<T extends unknown>`) to disambiguate.

### TSX Rules

These rules apply equally whether you are writing JSX or TSX. TypeScript enforces them at compile time rather than letting them fail silently at runtime.

#### 1. Single Root Element

Every TSX expression must return a single root element. Use a wrapper `<div>` or a **Fragment** (`<>...</>`) to group siblings:

```tsx
// Valid -- single root:
function Header() {
  return (
    <header>
      <h1>TaskFlow</h1>
      <nav>Navigation</nav>
    </header>
  );
}

// Valid -- Fragment (no extra DOM node):
function Header() {
  return (
    <>
      <h1>TaskFlow</h1>
      <nav>Navigation</nav>
    </>
  );
}

// Invalid -- multiple roots (TypeScript compiler error):
// function Header() {
//   return (
//     <h1>TaskFlow</h1>
//     <nav>Navigation</nav>
//   );
// }
```

#### 2. Close All Tags

Every tag must be closed, including self-closing tags. TypeScript will flag unclosed tags as syntax errors:

```tsx
// HTML allows: <img src="logo.png">
// TSX requires: <img src="logo.png" />
// Same for: <br />, <input />, <hr />
```

#### 3. camelCase Attributes

HTML attributes become camelCase in TSX. TypeScript's type definitions for DOM elements enforce the correct names -- using `class` instead of `className` produces a compile-time error:

| HTML | TSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `tabindex` | `tabIndex` |
| `onclick` | `onClick` |
| `readonly` | `readOnly` |

```tsx
<label htmlFor="email" className="form-label">
  Email
</label>
<input id="email" type="email" readOnly tabIndex={1} />
```

### Embedding Expressions

Use curly braces `{}` to embed any valid TypeScript expression inside TSX:

```tsx
function Greeting() {
  const name: string = "Trainee";
  const hour: number = new Date().getHours();
  const greeting: string = hour < 12 ? "Good morning" : "Good afternoon";

  return (
    <div>
      <h1>{greeting}, {name}!</h1>
      <p>The current hour is {hour}.</p>
      <p>2 + 2 = {2 + 2}</p>
    </div>
  );
}
```

You can embed:
- Variables and constants (with their TypeScript types)
- Arithmetic and string expressions
- Function calls (return type must be a valid React child)
- Ternary operators
- Array `.map()` calls

You **cannot** embed:
- Statements (`if`, `for`, `while` -- use ternaries or helper functions instead)
- Objects directly (TypeScript will warn that objects are not valid React children)

### Conditional Rendering

Since `if` statements are not expressions, use these patterns in TSX:

**Ternary operator:**
```tsx
<p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>
```

**Logical AND (`&&`):**
```tsx
{hasNotification && <span className="badge">New</span>}
```

**Helper variable with explicit type:**
```tsx
function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  let adminPanel: React.ReactNode = null;
  if (isAdmin) {
    adminPanel = <div className="admin-panel">Admin Controls</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {adminPanel}
    </div>
  );
}
```

Using `React.ReactNode` as the type for the helper variable tells TypeScript that the value can be any renderable content -- a JSX element, a string, a number, `null`, or `undefined`.

### Inline Styles

TSX uses a style object with camelCase properties, not a CSS string. TypeScript provides the `React.CSSProperties` type to ensure you only use valid CSS property names and values:

```tsx
const cardStyle: React.CSSProperties = {
  backgroundColor: "#1a1a2e",
  padding: "16px",
  borderRadius: "8px",
  color: "#e0e0e0",
};

function Card() {
  return <div style={cardStyle}>Styled card</div>;
}
```

If you misspell a property (e.g., `backgroundColour`), TypeScript catches it at compile time rather than silently rendering incorrect styles.

### TSX Is Just Syntax Sugar

Understanding that TSX compiles to function calls clarifies many behaviors:

```tsx
// This TSX:
<TaskCard title="Deploy" priority="high">
  <span>Due today</span>
</TaskCard>

// Becomes:
_jsx(TaskCard, {
  title: "Deploy",
  priority: "high",
  children: _jsx("span", { children: "Due today" }),
});
```

This is why:
- Components must start with uppercase letters (lowercase = HTML element)
- Props are just object properties -- and TypeScript validates them against your interface
- Children are just a special prop

## Code Example

A component demonstrating multiple TSX features together with full type annotations:

```tsx
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskDashboard() {
  const [tasks] = useState<Task[]>([
    { id: 1, title: "Review PRs", completed: true },
    { id: 2, title: "Write tests", completed: false },
    { id: 3, title: "Deploy staging", completed: false },
  ]);

  const completedCount: number = tasks.filter((t) => t.completed).length;

  return (
    <div className="dashboard">
      <h1>TaskFlow Dashboard</h1>
      <p>
        {completedCount} of {tasks.length} tasks completed
      </p>

      {tasks.length === 0 && <p>No tasks yet. Add one to get started.</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.title} {task.completed ? "(Done)" : "(Pending)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskDashboard;
```

## Summary

- TSX is the TypeScript extension of JSX. The `.tsx` file extension tells TypeScript to parse JSX markup and type-check it.
- TSX compiles to function calls (`_jsx` or `React.createElement`); it is not HTML.
- TypeScript enforces JSX rules at compile time: single root element, close all tags, use camelCase attributes.
- Embed expressions with `{}`, use ternaries for conditionals, and `.map()` for lists. TypeScript validates the types of all embedded expressions.
- Components start with uppercase; lowercase names are treated as HTML elements.
- Use `React.CSSProperties` for inline styles and `React.ReactNode` for variables that hold rendered content.

## Additional Resources
- [React Docs -- Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [React Docs -- JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [TypeScript Handbook -- JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [TypeScript Handbook -- React](https://www.typescriptlang.org/docs/handbook/react.html)
