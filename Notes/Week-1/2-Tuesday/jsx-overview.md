# JSX Overview

## Learning Objectives
- Describe JSX syntax and its purpose in React
- Understand how JSX compiles to `React.createElement` calls
- Write expressions, conditionals, and dynamic content within JSX

## Why This Matters

JSX is the syntax you write every time you create a React component. It looks like HTML, but it is actually a syntax extension for JavaScript (and TypeScript). Understanding what JSX really is -- and what it compiles to -- removes the "magic" and helps you debug rendering issues, write cleaner templates, and understand error messages from the compiler.

## The Concept

### What Is JSX?

JSX stands for **JavaScript XML**. It is a syntax extension that allows you to write HTML-like markup directly inside TypeScript/JavaScript files. JSX is not valid JavaScript or TypeScript on its own -- it must be compiled (transpiled) into standard function calls.

```typescript
// This JSX:
const element = <h1 className="title">Hello, TaskFlow</h1>;

// Compiles to this JavaScript (React 17+ automatic runtime):
const element = _jsx("h1", { className: "title", children: "Hello, TaskFlow" });
```

Before React 17, JSX compiled to `React.createElement()` calls, which is why you had to import React in every file that used JSX. With the automatic runtime (`"jsx": "react-jsx"` in `tsconfig.json`), this import is no longer required.

### JSX Rules

#### 1. Single Root Element

Every JSX expression must return a single root element. Use a wrapper `<div>` or a **Fragment** (`<>...</>`) to group siblings:

```typescript
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

// Invalid -- multiple roots:
// function Header() {
//   return (
//     <h1>TaskFlow</h1>
//     <nav>Navigation</nav>
//   );
// }
```

#### 2. Close All Tags

Every tag must be closed, including self-closing tags:

```typescript
// HTML allows: <img src="logo.png">
// JSX requires: <img src="logo.png" />
// Same for: <br />, <input />, <hr />
```

#### 3. camelCase Attributes

HTML attributes become camelCase in JSX:

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `tabindex` | `tabIndex` |
| `onclick` | `onClick` |
| `readonly` | `readOnly` |

```typescript
<label htmlFor="email" className="form-label">
  Email
</label>
<input id="email" type="email" readOnly tabIndex={1} />
```

### Embedding Expressions

Use curly braces `{}` to embed any valid JavaScript/TypeScript expression inside JSX:

```typescript
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
- Variables and constants
- Arithmetic and string expressions
- Function calls
- Ternary operators
- Array `.map()` calls

You **cannot** embed:
- Statements (`if`, `for`, `while` -- use ternaries or helper functions instead)
- Objects directly (they are not valid React children)

### Conditional Rendering

Since `if` statements are not expressions, use these patterns in JSX:

**Ternary operator:**
```typescript
<p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>
```

**Logical AND (`&&`):**
```typescript
{hasNotification && <span className="badge">New</span>}
```

**Helper variable:**
```typescript
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

### Inline Styles

JSX uses a style object with camelCase properties, not a CSS string:

```typescript
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

### JSX Is Just Syntax Sugar

Understanding that JSX compiles to function calls clarifies many behaviors:

```typescript
// This JSX:
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
- Props are just object properties
- Children are just a special prop

## Code Example

A component demonstrating multiple JSX features together:

```typescript
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

- JSX is a syntax extension that lets you write HTML-like markup in TypeScript files.
- JSX compiles to function calls (`_jsx` or `React.createElement`); it is not HTML.
- Key rules: single root element, close all tags, use camelCase attributes.
- Embed expressions with `{}`, use ternaries for conditionals, and `.map()` for lists.
- Components start with uppercase; lowercase names are treated as HTML elements.

## Additional Resources
- [React Docs -- Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [React Docs -- JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [TypeScript Handbook -- JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
