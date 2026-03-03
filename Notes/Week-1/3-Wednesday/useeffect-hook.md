# The useEffect Hook

## Learning Objectives
- Use `useEffect` to perform side effects in function components
- Understand dependency arrays and when effects re-run
- Write cleanup functions to prevent memory leaks
- Recognize common mistakes with `useEffect`

## Why This Matters

Components are pure functions that compute UI from state and props. But applications have side effects -- data fetching, subscriptions, timers, DOM manipulation, logging. `useEffect` is the hook that lets you synchronize your component with external systems while keeping the rendering logic pure.

## The Concept

### What Is a Side Effect?

A side effect is any operation that reaches outside the component to interact with the external world:

- Fetching data from an API
- Setting up a WebSocket or event listener
- Updating the document title
- Writing to `localStorage`
- Starting a timer

These operations do not belong in the render phase (the function body). They belong in `useEffect`.

### Basic Syntax

```typescript
useEffect(() => {
  // Effect code runs AFTER the component renders.
  document.title = `TaskFlow - ${taskCount} tasks`;
}, [taskCount]); // Dependency array
```

### The Dependency Array

The second argument to `useEffect` is an array of values that the effect depends on. It controls when the effect re-runs:

| Dependency Array | Behavior |
|---|---|
| `[a, b]` | Runs after render if `a` or `b` changed since the last render |
| `[]` | Runs once after the first render (mount only) |
| Omitted entirely | Runs after every render (rarely what you want) |

```typescript
// Runs on mount only:
useEffect(() => {
  console.log("Mounted");
}, []);

// Runs when 'query' changes:
useEffect(() => {
  searchAPI(query);
}, [query]);

// Runs after EVERY render (avoid this pattern):
useEffect(() => {
  console.log("Rendered");
});
```

### Cleanup Functions

The function returned from `useEffect` is the **cleanup function**. React calls it:
- Before re-running the effect (when dependencies change)
- When the component unmounts

```typescript
useEffect(() => {
  const handleResize = (): void => {
    console.log("Window resized:", window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  // Cleanup: remove the listener to prevent memory leaks
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

### Data Fetching with useEffect

A common pattern: fetch data when a component mounts or when a dependency changes.

```typescript
import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskList({ projectId }: { projectId: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false; // Prevent state updates on unmounted component

    setLoading(true);
    setError(null);

    fetch(`/api/projects/${projectId}/tasks`)
      .then((res) => res.json())
      .then((data: Task[]) => {
        if (!cancelled) {
          setTasks(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true; // Cleanup: mark as cancelled if projectId changes
    };
  }, [projectId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

### Common Mistakes

**1. Missing dependencies:**

```typescript
// BAD -- 'count' is used but not in the dependency array:
useEffect(() => {
  document.title = `Count: ${count}`;
}, []); // Stale: title never updates after mount

// GOOD:
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

Use the `react-hooks/exhaustive-deps` ESLint rule to catch this automatically.

**2. Creating infinite loops:**

```typescript
// BAD -- setting state causes a re-render, which re-runs the effect:
useEffect(() => {
  setCount(count + 1); // Infinite loop!
}); // No dependency array = runs every render

// GOOD -- only run when a specific value changes:
useEffect(() => {
  if (data) {
    setProcessedData(transform(data));
  }
}, [data]);
```

**3. Not cleaning up subscriptions:**

```typescript
// BAD -- listener is never removed:
useEffect(() => {
  window.addEventListener("scroll", handleScroll);
}, []);

// GOOD -- cleanup on unmount:
useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### You Might Not Need an Effect

Not everything belongs in `useEffect`. Derived values should be computed during rendering:

```typescript
// BAD -- unnecessary effect:
const [items, setItems] = useState<Item[]>([]);
const [filteredItems, setFilteredItems] = useState<Item[]>([]);

useEffect(() => {
  setFilteredItems(items.filter((i) => i.active));
}, [items]);

// GOOD -- derive during render:
const [items, setItems] = useState<Item[]>([]);
const filteredItems = items.filter((i) => i.active);
```

## Code Example

```typescript
import { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []); // Run once on mount

  return <p>Current time: {time.toLocaleTimeString()}</p>;
}

export default Clock;
```

## Summary

- `useEffect` runs side effects after React renders the component.
- The **dependency array** controls when the effect re-runs: specific values, mount-only (`[]`), or every render (omitted).
- Always return a **cleanup function** for subscriptions, timers, and listeners.
- Avoid common mistakes: missing dependencies, infinite loops, and unnecessary effects.
- Derive values during rendering instead of using effects for computed data.

## Additional Resources
- [React Docs -- useEffect](https://react.dev/reference/react/useEffect)
- [React Docs -- Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React Docs -- You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
