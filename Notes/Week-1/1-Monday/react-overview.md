# React Overview

## Learning Objectives
- Describe React's declarative UI approach and component-based architecture
- Understand the key principles that differentiate React from other UI solutions
- Identify the major parts of the React ecosystem

## Why This Matters

React is the most widely adopted front-end library in the industry. Whether you are building an internal tool, a customer-facing web application, or a mobile app (via React Native), React's component model provides the foundation. This overview gives you the mental map of what React is, how it thinks about UI, and what pieces of the ecosystem you will encounter throughout the week.

## The Concept

### What Is React?

React is an open-source JavaScript library for building user interfaces. Created by Meta (formerly Facebook) and released in 2013, React introduced a fundamentally different approach to UI development: **declarative, component-based rendering driven by state**.

Instead of manually manipulating the DOM (Document Object Model), you describe *what* the UI should look like for a given state, and React figures out *how* to update the DOM efficiently.

### Declarative UI

In imperative programming, you tell the computer **how** to do something step by step. In declarative programming, you describe **what** you want, and the system handles the execution.

**Imperative (vanilla JavaScript):**

```typescript
// Manually creating UI elements step by step:
const container = document.getElementById("root")!;
const heading = document.createElement("h1");
heading.textContent = "Hello, TaskFlow";
heading.className = "title";
container.appendChild(heading);

// To update, you must find the element and change it:
heading.textContent = "Updated Title";
```

**Declarative (React):**

```typescript
// Describe what the UI should look like:
function App() {
  const [title, setTitle] = useState<string>("Hello, TaskFlow");

  return <h1 className="title">{title}</h1>;
}
// React handles the DOM updates when 'title' changes.
```

The declarative approach is easier to read, easier to reason about, and less prone to bugs because you never touch the DOM directly.

### Component-Based Architecture

React applications are built from **components** -- self-contained, reusable pieces of UI. Each component encapsulates its own structure (JSX), logic (TypeScript), and optionally its own styles.

```
App
  |-- Header
  |-- TaskList
  |     |-- TaskCard
  |     |-- TaskCard
  |     |-- TaskCard
  |-- Footer
```

Each of these (App, Header, TaskList, TaskCard, Footer) is a React component. You compose them together like building blocks. This is fundamentally different from traditional architectures that separate concerns by file type (HTML in one file, CSS in another, JS in a third).

### Components in Code

A React component is a TypeScript function that returns JSX:

```typescript
interface TaskCardProps {
  title: string;
  completed: boolean;
}

function TaskCard({ title, completed }: TaskCardProps) {
  return (
    <div className="task-card">
      <h3>{title}</h3>
      <span>{completed ? "Done" : "In Progress"}</span>
    </div>
  );
}
```

Components can be nested, reused, and composed:

```typescript
function TaskList() {
  return (
    <div>
      <TaskCard title="Set up project" completed={true} />
      <TaskCard title="Build components" completed={false} />
      <TaskCard title="Deploy to cloud" completed={false} />
    </div>
  );
}
```

### Unidirectional Data Flow

Data in React flows in one direction: **parent to child**, via props. This makes the data flow predictable and easy to trace:

```
App (state lives here)
  |-- passes props down -->
  |     TaskList (receives data as props)
  |       |-- passes props down -->
  |             TaskCard (displays data)
```

When a child needs to communicate back to a parent, it calls a callback function that the parent passed down as a prop. We will cover this pattern in detail on Tuesday.

### The Virtual DOM (Preview)

React maintains a lightweight, in-memory representation of the real DOM called the **Virtual DOM**. When state changes, React:

1. Creates a new Virtual DOM tree.
2. Compares it to the previous tree (a process called **reconciliation** or **diffing**).
3. Calculates the minimal set of changes needed.
4. Applies only those changes to the real DOM.

This is why React is fast even with frequent state changes -- it avoids expensive full-page DOM rewrites. We will explore the Virtual DOM in more depth on Tuesday.

### The React Ecosystem

React's narrowly defined scope means it relies on a rich ecosystem:

| Category | Purpose | Key Tools |
|---|---|---|
| **Build Tooling** | Bundle, compile, and serve the app | Vite, Webpack, esbuild |
| **Routing** | Map URLs to components | React Router |
| **State Management** | Manage complex application state | Context API, Redux, Zustand |
| **HTTP Client** | Communicate with APIs | Axios, Fetch |
| **Testing** | Verify component behavior | Vitest, React Testing Library |
| **Styling** | Style components | CSS Modules, styled-components, Tailwind |
| **Type Safety** | Static type checking | TypeScript |

This is not an exhaustive list, but these are the tools you will encounter during this week's training.

### React's Philosophy

Three principles guide React's design:

1. **Composition over inheritance:** Build complex UIs by combining simple components, not by extending classes.
2. **Explicit data flow:** State changes are explicit and traceable; there is no two-way binding "magic."
3. **Learn once, write anywhere:** React's model applies to web (React DOM), mobile (React Native), desktop, and more.

## Code Example

A minimal but complete React + TypeScript application:

```typescript
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```typescript
// App.tsx
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks] = useState<Task[]>([
    { id: 1, title: "Learn TypeScript", completed: true },
    { id: 2, title: "Build a React app", completed: false },
    { id: 3, title: "Deploy to the cloud", completed: false },
  ]);

  return (
    <div>
      <h1>TaskFlow</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.completed ? "[x]" : "[ ]"} {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

## Summary

- React is a declarative, component-based UI library maintained by Meta.
- You describe what the UI should look like; React handles the DOM updates.
- Components are the building blocks -- reusable, composable, and self-contained.
- Data flows in one direction (parent to child) via props, making the application predictable.
- React is a library, not a framework -- you assemble the ecosystem tools you need.

## Additional Resources
- [React Documentation -- Quick Start](https://react.dev/learn)
- [React Documentation -- Thinking in React](https://react.dev/learn/thinking-in-react)
- [React GitHub Repository](https://github.com/facebook/react)
