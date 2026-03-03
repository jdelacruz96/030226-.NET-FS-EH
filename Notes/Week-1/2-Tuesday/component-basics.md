# Component Basics

## Learning Objectives
- Understand the anatomy of a React component
- Identify what a component returns and how it fits into the component tree
- Distinguish between different types of return values

## Why This Matters

Components are the fundamental building blocks of every React application. Before exploring advanced patterns like composition, context, or higher-order components later this week, you need a solid understanding of what a component is at its core -- what it receives, what it returns, and how it connects to the rest of the application.

## The Concept

### What Is a Component?

A React component is a **function that returns JSX** (or `null`). It describes a piece of the UI:

```typescript
function WelcomeBanner() {
  return <h1>Welcome to TaskFlow</h1>;
}
```

That is a complete, valid React component. It takes no inputs, has no state, and returns a single JSX element. Components can be much more complex, but they always follow this pattern: **function in, JSX out**.

### Component Anatomy

Every component has up to four parts:

```typescript
// 1. Props interface (optional, but recommended)
interface StatusBadgeProps {
  status: "active" | "inactive" | "pending";
  label?: string;
}

// 2. Function signature with typed props
function StatusBadge({ status, label = "Status" }: StatusBadgeProps) {
  // 3. Logic (hooks, variables, derived values)
  const colorMap: Record<string, string> = {
    active: "green",
    inactive: "gray",
    pending: "orange",
  };

  // 4. Return JSX
  return (
    <span style={{ color: colorMap[status] }}>
      {label}: {status}
    </span>
  );
}
```

### What Can a Component Return?

| Return Value | Example |
|---|---|
| **JSX element** | `<div>Hello</div>` |
| **Fragment** | `<>Item A, Item B</>` |
| **String or number** | `return "Hello";` or `return 42;` |
| **Array of elements** | `return [<li key="a">A</li>, <li key="b">B</li>];` |
| **null** | `return null;` (renders nothing) |
| **Boolean** | `return false;` (renders nothing -- used in conditional patterns) |

### The Component Tree

Components form a tree structure. The root component (typically `App`) renders child components, which render their own children:

```
App
 +-- Header
 |     +-- Logo
 |     +-- Navigation
 +-- Main
 |     +-- TaskList
 |     |     +-- TaskCard
 |     |     +-- TaskCard
 |     |     +-- TaskCard
 |     +-- Sidebar
 +-- Footer
```

Each node in this tree is a component. React traverses this tree from the root down, calling each component function and assembling the final DOM output.

### Naming Rules

- Component names **must** start with an uppercase letter: `TaskCard`, `Header`, `App`.
- Lowercase names are treated as HTML elements: `div`, `span`, `button`.
- This distinction is how JSX knows whether to create a DOM element or call a component function.

```typescript
// Component (uppercase) -- React calls TaskCard as a function:
<TaskCard title="Deploy" />

// HTML element (lowercase) -- React creates a <div> DOM node:
<div className="container" />
```

### Composing Components

Components can render other components. This is called **composition**:

```typescript
function Header() {
  return (
    <header>
      <Logo />
      <Navigation />
    </header>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <TaskList />
      </main>
      <Footer />
    </div>
  );
}
```

Composition is React's primary mechanism for building complex UIs. You do not use inheritance, you nest and combine components.

### Exporting and Importing

Components are shared between files using ES module syntax:

```typescript
// TaskCard.tsx
export default function TaskCard({ title }: { title: string }) {
  return <div>{title}</div>;
}

// App.tsx
import TaskCard from "./TaskCard";

function App() {
  return <TaskCard title="Build components" />;
}
```

You can also use named exports when a file contains multiple components:

```typescript
// components.tsx
export function Header() { return <header>Header</header>; }
export function Footer() { return <footer>Footer</footer>; }

// App.tsx
import { Header, Footer } from "./components";
```

## Code Example

A small application demonstrating component composition:

```typescript
// App.tsx
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskItem({ title, completed }: Omit<Task, "id">) {
  return (
    <li>
      {completed ? "[x]" : "[ ]"} {title}
    </li>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} title={task.title} completed={task.completed} />
      ))}
    </ul>
  );
}

function App() {
  const tasks: Task[] = [
    { id: 1, title: "Learn component basics", completed: true },
    { id: 2, title: "Build a component tree", completed: false },
  ];

  return (
    <div>
      <h1>TaskFlow</h1>
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
```

## Summary

- A React component is a function that returns JSX (or null).
- Components have four parts: props interface, function signature, logic, and returned JSX.
- Components form a tree; the root (`App`) renders children, which render their own children.
- Component names must be uppercase; lowercase names are treated as HTML elements.
- Composition (nesting components) is React's primary method for building complex UIs.

## Additional Resources
- [React Docs -- Your First Component](https://react.dev/learn/your-first-component)
- [React Docs -- Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
- [React Docs -- Thinking in React](https://react.dev/learn/thinking-in-react)
