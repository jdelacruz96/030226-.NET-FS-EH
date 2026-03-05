# Custom Hooks

## Learning Objectives
- Create reusable custom hooks that encapsulate stateful logic
- Apply naming conventions and typing patterns for custom hooks
- Compose custom hooks to build complex behavior from simple parts

## Why This Matters

Custom hooks are the primary mechanism for sharing logic between function components. Instead of duplicating state management code, event listeners, or data-fetching patterns across components, you extract them into a reusable hook. This is the modern replacement for mixins, higher-order components, and render props.

## The Concept

### What Is a Custom Hook?

A custom hook is a function whose name starts with `use` and that calls other hooks. It follows the same rules as built-in hooks (call at the top level, only from React functions).

```typescript
import { useState } from "react";

function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggle = (): void => setValue((prev) => !prev);
  return [value, toggle];
}

// Usage:
function Accordion() {
  const [isOpen, toggle] = useToggle(false);
  return (
    <div>
      <button onClick={toggle}>{isOpen ? "Close" : "Open"}</button>
      {isOpen && <p>Accordion content here.</p>}
    </div>
  );
}
```

### Return Value Patterns

Custom hooks can return values in different shapes depending on the use case:

**Tuple (like `useState`):**
```typescript
function useCounter(initial: number = 0): [number, () => void, () => void] {
  const [count, setCount] = useState<number>(initial);
  const increment = (): void => setCount((c) => c + 1);
  const decrement = (): void => setCount((c) => c - 1);
  return [count, increment, decrement];
}
```

**Object (preferred when returning many values):**
```typescript
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

function useCounter(initial: number = 0): UseCounterReturn {
  const [count, setCount] = useState<number>(initial);
  return {
    count,
    increment: () => setCount((c) => c + 1),
    decrement: () => setCount((c) => c - 1),
    reset: () => setCount(initial),
  };
}
```

### Practical Custom Hooks

#### useLocalStorage

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T): void => {
    setStored(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [stored, setValue];
}

// Usage:
const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
```

#### useFetch

```typescript
interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: T) => {
        if (!cancelled) { setData(json); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage:
function TaskList() {
  const { data: tasks, loading, error } = useFetch<Task[]>("/api/tasks");
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{tasks?.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
}
```

### Composing Hooks

Custom hooks can call other custom hooks:

```typescript
function usePersistedCounter(key: string, initial: number = 0) {
  const [count, setCount] = useLocalStorage<number>(key, initial);

  const increment = (): void => setCount(count + 1);
  const decrement = (): void => setCount(count - 1);

  return { count, increment, decrement };
}
```

### Rules for Custom Hooks

1. Name must start with `use` (e.g., `useForm`, `useAuth`, `useWindowSize`).
2. Can call other hooks (built-in or custom).
3. Must follow the Rules of Hooks (top level only, React functions only).
4. Each component calling the hook gets its own independent state -- hooks do not share state between components.

## Code Example

```typescript
import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      console.log("Searching for:", debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />;
}

export default SearchPage;
```

## Summary

- Custom hooks extract reusable stateful logic into functions prefixed with `use`.
- They can return tuples (for simple values) or objects (for many values).
- Custom hooks compose naturally -- they can call other hooks, including other custom hooks.
- Each component gets its own independent copy of the hook's state.

## Additional Resources
- [React Docs -- Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [useHooks.com -- Collection of Custom Hooks](https://usehooks.com/)
- [React TypeScript Cheatsheet -- Custom Hooks](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks)
