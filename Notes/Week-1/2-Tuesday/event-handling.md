# Event Handling in React

## Learning Objectives
- Understand React's synthetic event system
- Apply event binding patterns in function components
- Type event handlers using TypeScript's React event types

## Why This Matters

Every interactive UI responds to user actions -- clicks, key presses, form submissions, mouse movements. React wraps the browser's native event system in a cross-browser abstraction called **synthetic events**. Understanding how React handles events and how to type them in TypeScript is essential for building any interactive component.

## The Concept

### Synthetic Events

React does not attach event listeners directly to individual DOM elements. Instead, it uses **event delegation** -- a single listener is attached at the root of your React tree, and events are dispatched to the correct handler internally. The event object you receive is a `SyntheticEvent`, which wraps the native browser event with a consistent API across all browsers.

```typescript
function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
  console.log("Button clicked");
  console.log("Native event:", event.nativeEvent); // Access the underlying browser event
}
```

### Attaching Event Handlers

In JSX, event handlers are passed as camelCase props (not lowercase HTML attributes):

```typescript
// HTML: <button onclick="handleClick()">
// React JSX:
<button onClick={handleClick}>Click Me</button>
```

Key differences from HTML:
- **camelCase naming:** `onClick`, `onChange`, `onSubmit` (not `onclick`, `onchange`, `onsubmit`)
- **Function reference, not string:** Pass the function itself, not a string of code
- **No `return false`:** Use `event.preventDefault()` to prevent default behavior

### Inline vs. Named Handlers

You can define handlers inline or as named functions:

```typescript
function TaskCard() {
  // Named handler (preferred for readability and reuse):
  const handleDelete = (): void => {
    console.log("Task deleted");
  };

  return (
    <div>
      {/* Named handler */}
      <button onClick={handleDelete}>Delete</button>

      {/* Inline handler (fine for simple one-liners) */}
      <button onClick={() => console.log("Archived")}>Archive</button>
    </div>
  );
}
```

### Passing Arguments to Handlers

When you need to pass data to an event handler, wrap it in an arrow function:

```typescript
interface Task {
  id: number;
  title: string;
}

function TaskList() {
  const tasks: Task[] = [
    { id: 1, title: "Set up project" },
    { id: 2, title: "Build components" },
  ];

  const handleSelect = (taskId: number): void => {
    console.log("Selected task:", taskId);
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title}
          <button onClick={() => handleSelect(task.id)}>Select</button>
        </li>
      ))}
    </ul>
  );
}
```

### Common Event Types in TypeScript

| Event | TypeScript Type | Typical Element |
|---|---|---|
| Click | `React.MouseEvent<HTMLButtonElement>` | `<button>`, `<div>` |
| Input change | `React.ChangeEvent<HTMLInputElement>` | `<input>`, `<textarea>` |
| Select change | `React.ChangeEvent<HTMLSelectElement>` | `<select>` |
| Form submit | `React.FormEvent<HTMLFormElement>` | `<form>` |
| Key press | `React.KeyboardEvent<HTMLInputElement>` | `<input>` |
| Focus | `React.FocusEvent<HTMLInputElement>` | `<input>` |
| Mouse enter/leave | `React.MouseEvent<HTMLDivElement>` | `<div>` |

### Preventing Default Behavior

```typescript
function LoginForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); // Prevents the browser from reloading the page
    console.log("Form submitted via React, not the browser");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Log In</button>
    </form>
  );
}
```

### Event Pooling (Historical Note)

In React versions before 17, synthetic events were "pooled" -- the event object was reused across events, meaning you could not access `event.target` asynchronously. **This is no longer the case in React 17+.** Event objects are now standard and persist as expected. You do not need to call `event.persist()` in modern React.

## Code Example

A complete interactive example combining multiple event types:

```typescript
import { useState, ChangeEvent, FormEvent, KeyboardEvent } from "react";

function SearchForm() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Escape") {
      setQuery("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (query.trim()) {
      setResults((prev) => [...prev, query]);
      setQuery("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchForm;
```

## Summary

- React uses **synthetic events** that provide a cross-browser wrapper around native DOM events.
- Event handlers are passed as camelCase JSX props (`onClick`, `onChange`, `onSubmit`).
- TypeScript provides specific event types (`MouseEvent`, `ChangeEvent`, `FormEvent`) parameterized by the HTML element type.
- Use `event.preventDefault()` to stop default browser behavior; inline arrow functions to pass arguments to handlers.

## Additional Resources
- [React Docs -- Responding to Events](https://react.dev/learn/responding-to-events)
- [React TypeScript Cheatsheet -- Events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events)
- [MDN -- Events Reference](https://developer.mozilla.org/en-US/docs/Web/Events)
