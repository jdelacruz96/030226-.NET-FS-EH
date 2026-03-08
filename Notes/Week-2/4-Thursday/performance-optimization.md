# Performance Optimization

## Learning Objectives
- Identify common performance bottlenecks in React applications
- Apply `React.memo`, `useMemo`, and `useCallback` appropriately
- Use React DevTools Profiler to measure rendering performance
- Implement code splitting with `React.lazy` and `Suspense`

## Why This Matters

React's Virtual DOM and batching make most applications fast by default. But as applications grow -- large lists, complex calculations, frequent state updates -- performance can degrade. Knowing when and how to optimize prevents premature optimization while giving you the tools to fix real problems.

## The Concept

### The Golden Rule

**Do not optimize prematurely.** Write clear, readable code first. Optimize only when you have measured a performance problem. Unnecessary `useMemo` and `useCallback` add complexity without benefit.

### React.memo

Prevents a component from re-rendering when its props have not changed:

```typescript
import { memo } from "react";

interface TaskCardProps {
  title: string;
  completed: boolean;
}

const TaskCard = memo(function TaskCard({ title, completed }: TaskCardProps) {
  console.log("TaskCard rendered:", title);
  return (
    <div>
      <span style={{ textDecoration: completed ? "line-through" : "none" }}>{title}</span>
    </div>
  );
});

// TaskCard only re-renders if 'title' or 'completed' actually change.
```

**When to use:** A component renders the same output for the same props, and its parent re-renders frequently.

**When NOT to use:** The component is cheap to render, or its props change on every render anyway.

### useMemo

Memoizes the result of an expensive computation:

```typescript
import { useMemo } from "react";

function Analytics({ transactions }: { transactions: Transaction[] }) {
  // Only recomputes when 'transactions' changes:
  const summary = useMemo(() => {
    return {
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
      count: transactions.length,
      average: transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
        : 0,
    };
  }, [transactions]);

  return (
    <div>
      <p>Total: ${summary.total}</p>
      <p>Average: ${summary.average.toFixed(2)}</p>
    </div>
  );
}
```

**When to use:** The computation is genuinely expensive (sorting large arrays, complex calculations).

**When NOT to use:** Simple operations like filtering a small array or string concatenation.

### useCallback

Memoizes a function reference so it stays stable across renders:

```typescript
import { useCallback, useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Stable reference -- does not change between renders:
  const handleDelete = useCallback((id: number): void => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []); // Empty deps because setTasks is stable

  return (
    <ul>
      {tasks.map((task) => (
        <MemoizedTaskItem key={task.id} task={task} onDelete={handleDelete} />
      ))}
    </ul>
  );
}
```

**When to use:** Passing callbacks to memoized child components (`React.memo`). Without `useCallback`, a new function is created on each render, breaking the memoization.

**When NOT to use:** The child is not memoized (the stable reference provides no benefit).

### Code Splitting with React.lazy

Load components on demand instead of bundling everything upfront:

```typescript
import { lazy, Suspense } from "react";

const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Suspense>
  );
}
```

The `SettingsPage` bundle is only downloaded when the user navigates to `/settings`.

### Virtualizing Long Lists

For lists with hundreds or thousands of items, render only the visible items using virtualization:

```typescript
// Libraries: react-window, react-virtualized, @tanstack/virtual
import { FixedSizeList } from "react-window";

function VirtualizedList({ items }: { items: string[] }) {
  return (
    <FixedSizeList height={400} width={300} itemCount={items.length} itemSize={35}>
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
}
```

### React DevTools Profiler

The Profiler tab in React DevTools lets you:

1. **Record** a rendering session.
2. **See which components rendered** and why.
3. **Measure render duration** for each component.
4. **Identify unnecessary re-renders.**

Steps:
1. Open React DevTools then navigate to the Profiler tab.
2. Click "Record" and interact with your app.
3. Click "Stop" and review the flame chart.
4. Look for components that render frequently or take a long time.

### Optimization Decision Tree

```
Is there a measured performance problem?
  No  -> Do not optimize.
  Yes -> What is the problem?
    Unnecessary re-renders?
      -> Use React.memo + useCallback for callbacks
    Expensive computation on every render?
      -> Use useMemo
    Large bundle size / slow initial load?
      -> Use React.lazy + Suspense
    Long list rendering?
      -> Use virtualization (react-window)
    Frequent state updates causing wide re-renders?
      -> Move state closer to where it is used
      -> Split Context into smaller contexts
```

## Summary

- **Do not optimize prematurely** -- measure first with React DevTools Profiler.
- `React.memo` skips re-renders when props are unchanged.
- `useMemo` caches expensive computation results; `useCallback` caches function references.
- `React.lazy` + `Suspense` enables code splitting for faster initial loads.
- Virtualization libraries handle long lists efficiently by rendering only visible items.

## Additional Resources
- [React Docs -- Optimizing Performance](https://react.dev/learn/react-compiler)
- [React Docs -- useMemo](https://react.dev/reference/react/useMemo)
- [React Docs -- useCallback](https://react.dev/reference/react/useCallback)
- [React DevTools Profiler Guide](https://react.dev/learn/react-developer-tools)
