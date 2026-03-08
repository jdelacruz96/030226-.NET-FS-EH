# Hooks Overview

## Learning Objectives
- Understand what React Hooks are and why they were introduced
- Learn the two fundamental rules of hooks
- Recognize how hooks replace class lifecycle methods

## Why This Matters

Hooks are the feature that made function components fully capable. Before hooks, function components could not hold state or respond to lifecycle events -- those required class components. Hooks unified everything into a simpler, more composable model. Every advanced React pattern you use from this point forward is built on hooks.

## The Concept

### What Are Hooks?

Hooks are special functions that let you "hook into" React features from function components. They were introduced in React 16.8 (February 2019) and have become the standard API for state, side effects, context, and more.

The core hooks you will use most often:

| Hook | Purpose |
|---|---|
| `useState` | Manage local state |
| `useEffect` | Perform side effects (data fetching, subscriptions, DOM manipulation) |
| `useContext` | Consume context values |
| `useReducer` | Manage complex state with a reducer pattern |
| `useRef` | Access DOM elements or persist mutable values across renders |
| `useMemo` | Memoize expensive computations |
| `useCallback` | Memoize callback functions |

### Why Hooks Were Introduced

Before hooks, React developers faced three recurring problems:

**1. Reusing stateful logic was hard.**

Sharing logic between components required patterns like Higher-Order Components (HOCs) or render props, both of which added complexity and wrapper levels to the component tree.

**2. Complex components became hard to understand.**

Class components mixed unrelated logic in the same lifecycle methods. For example, `componentDidMount` might set up a data subscription AND start a timer -- two unrelated concerns in one method.

**3. Classes confused both people and machines.**

`this` binding, constructor boilerplate, and the distinction between class methods and arrow functions created a steep learning curve and made code harder to optimize.

Hooks solve all three problems by letting you extract and reuse stateful logic as standalone functions (custom hooks), group related logic together (multiple `useEffect` calls), and avoid classes entirely.

### The Rules of Hooks

React enforces two strict rules for hooks. Violating them causes bugs that are difficult to diagnose.

**Rule 1: Only call hooks at the top level.**

Do not call hooks inside loops, conditions, or nested functions. Hooks must be called in the **same order** every time a component renders.

```typescript
// CORRECT:
function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  // Hooks are called at the top level, in the same order every render.
  return <div>...</div>;
}

// INCORRECT:
function TaskList({ showFilter }: { showFilter: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  if (showFilter) {
    const [filter, setFilter] = useState<string>("all"); // VIOLATION
  }
  return <div>...</div>;
}
```

Why? React identifies hooks by their call order. If a hook is skipped on some renders, the order shifts, and React assigns the wrong state to the wrong hook.

**Rule 2: Only call hooks from React functions.**

Call hooks from:
- Function components
- Custom hooks (functions whose names start with `use`)

Do not call hooks from:
- Regular JavaScript/TypeScript functions
- Class components
- Event handlers (outside the component body)

### The Shift from Lifecycle Methods to Hooks

Class components organized logic around **when** things happen (mount, update, unmount). Hooks organize logic around **what** you are doing:

| Class Lifecycle | Hook Equivalent | Purpose |
|---|---|---|
| `constructor` | `useState` initial value | Initialize state |
| `componentDidMount` | `useEffect(() => {}, [])` | Run once after first render |
| `componentDidUpdate` | `useEffect(() => {}, [dep])` | Run when dependencies change |
| `componentWillUnmount` | `useEffect` cleanup function | Clean up subscriptions/timers |
| `shouldComponentUpdate` | `React.memo` | Skip unnecessary re-renders |

The key shift: in class components, you split one concern across multiple lifecycle methods. With hooks, you keep one concern in one `useEffect` call.

### Custom Hooks (Preview)

You can create your own hooks by extracting reusable logic into functions that start with `use`:

```typescript
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState<number>(initialValue);

  const increment = (): void => setCount((prev) => prev + 1);
  const decrement = (): void => setCount((prev) => prev - 1);
  const reset = (): void => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Usage in any component:
function CounterWidget() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

Custom hooks are the primary mechanism for sharing stateful logic between components. They are just functions -- no special API, no wrappers, no indirection.

## Code Example

A component using multiple hooks together:

```typescript
import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = (): void => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

function LayoutInfo() {
  const { width, height } = useWindowSize();

  return (
    <p>
      Window: {width} x {height}
      {width < 768 ? " (mobile)" : " (desktop)"}
    </p>
  );
}

export default LayoutInfo;
```

## Summary

- **Hooks** are functions that let you use React features (state, effects, context) in function components.
- They were introduced to solve problems with logic reuse, complex lifecycle methods, and class boilerplate.
- **Two rules:** call hooks at the top level only, and only from React functions or custom hooks.
- Hooks shift the mental model from "when" (lifecycle) to "what" (concern-based organization).
- **Custom hooks** extract reusable stateful logic into shareable functions.

## Additional Resources
- [React Docs -- Hooks at a Glance](https://react.dev/reference/react/hooks)
- [React Docs -- Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React Docs -- Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
