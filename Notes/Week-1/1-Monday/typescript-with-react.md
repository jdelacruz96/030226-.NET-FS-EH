# TypeScript with React

## Learning Objectives
- Understand how TypeScript integrates with React projects
- Type component props using interfaces
- Type component state with `useState` generics
- Type event handlers for common DOM events

## Why This Matters

React and TypeScript are a natural pairing. TypeScript catches prop mismatches, state mutation errors, and event handler typos at compile time -- errors that would otherwise surface as confusing runtime bugs in plain JavaScript. This reading sets the foundation for every React component you will write this week, ensuring you know how to type the three most common patterns: props, state, and events.

## The Concept

### How TypeScript Integrates with React

React projects use `.tsx` files (TypeScript + JSX) instead of `.jsx`. The TypeScript compiler processes these files, validates all type annotations, and emits standard JavaScript that React can render.

To use TypeScript in a React project, you need:

1. **TypeScript itself:** `npm install --save-dev typescript`
2. **React type definitions:** `npm install --save-dev @types/react @types/react-dom`
3. **A `tsconfig.json`** with `"jsx": "react-jsx"` (for React 17+ automatic runtime)

Most scaffolding tools (Vite with the `react-ts` template, Create React App with `--template typescript`) set this up automatically.

### Typing Props with Interfaces

Props are the primary way data flows into a React component. In TypeScript, you define the shape of props using an `interface` or `type`:

```typescript
// TaskCard.tsx

interface TaskCardProps {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  isCompleted: boolean;
  onToggle: () => void;
}

function TaskCard({ title, description, priority, isCompleted, onToggle }: TaskCardProps) {
  return (
    <div className={`task-card priority-${priority}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <label>
        <input type="checkbox" checked={isCompleted} onChange={onToggle} />
        {isCompleted ? "Done" : "Pending"}
      </label>
    </div>
  );
}

export default TaskCard;
```

If a parent component passes the wrong type -- for example, `priority={3}` instead of a string -- the compiler flags it immediately.

### Optional and Default Props

Mark optional props with `?`:

```typescript
interface HeaderProps {
  title: string;
  subtitle?: string; // Optional -- may be undefined
}

function Header({ title, subtitle = "Welcome" }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
```

### Typing State with `useState`

The `useState` hook accepts a generic type parameter that defines the type of the state value:

```typescript
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskList() {
  // Explicit generic -- state is an array of Task objects:
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const addTask = (title: string): void => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div>
      <p>Filter: {filter}</p>
      <p>Tasks: {tasks.length}</p>
    </div>
  );
}
```

When TypeScript can infer the type from the initial value, the generic is optional:

```typescript
const [count, setCount] = useState(0); // Inferred as number
const [name, setName] = useState(""); // Inferred as string
```

Use the explicit generic when:
- The initial value is `null` or an empty array (where inference is insufficient)
- You want to document the type for readability

```typescript
const [user, setUser] = useState<User | null>(null);
```

### Typing Event Handlers

React provides synthetic event types that mirror native DOM events. The most common:

```typescript
import { ChangeEvent, FormEvent, MouseEvent } from "react";

function SearchBar() {
  const [query, setQuery] = useState<string>("");

  // Typing an input change event:
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  // Typing a form submission event:
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Searching for:", query);
  };

  // Typing a button click event:
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Button clicked at:", event.clientX, event.clientY);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={query} onChange={handleChange} />
      <button type="submit" onClick={handleClick}>
        Search
      </button>
    </form>
  );
}
```

### Common React Event Types

| Event Type | HTML Element | Use Case |
|---|---|---|
| `ChangeEvent<HTMLInputElement>` | `<input>`, `<textarea>` | Text input changes |
| `ChangeEvent<HTMLSelectElement>` | `<select>` | Dropdown selection changes |
| `FormEvent<HTMLFormElement>` | `<form>` | Form submission |
| `MouseEvent<HTMLButtonElement>` | `<button>`, `<div>` | Click events |
| `KeyboardEvent<HTMLInputElement>` | `<input>` | Key press events |

### The `children` Prop

To accept child elements, use `React.ReactNode`:

```typescript
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage:
<Card title="Welcome">
  <p>This is the card body content.</p>
</Card>
```

## Code Example

A complete, self-contained example combining all three patterns:

```typescript
// UserGreeting.tsx
import { useState, ChangeEvent, FormEvent } from "react";

interface UserGreetingProps {
  defaultName?: string;
  greeting?: string;
}

function UserGreeting({ defaultName = "Trainee", greeting = "Welcome" }: UserGreetingProps) {
  const [name, setName] = useState<string>(defaultName);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {submitted ? (
        <h1>{greeting}, {name}!</h1>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Enter your name:
            <input type="text" value={name} onChange={handleChange} />
          </label>
          <button type="submit">Greet Me</button>
        </form>
      )}
    </div>
  );
}

export default UserGreeting;
```

## Summary

- React + TypeScript projects use `.tsx` files and require `@types/react` for type definitions.
- Props are typed using `interface` or `type` -- the compiler validates every prop passed to a component.
- State is typed using generics: `useState<Type>(initialValue)`.
- Event handlers use React's synthetic event types (`ChangeEvent`, `FormEvent`, `MouseEvent`).
- These three patterns -- typed props, typed state, typed events -- form the backbone of every React component you will write this week.

## Additional Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Docs -- TypeScript](https://react.dev/learn/typescript)
- [TypeScript Handbook -- JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
