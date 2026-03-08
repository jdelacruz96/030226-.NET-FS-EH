# Rendering in React

## Learning Objectives
- Understand the React rendering process: initial render, re-renders, and commit
- Explain reconciliation and how React determines what to update
- Recognize when and why React batches state updates

## Why This Matters

"Rendering" in React does not mean painting pixels on the screen. It means React calling your component functions to determine what the UI should look like. Understanding this process helps you predict when your components will re-execute, diagnose performance issues, and write code that works with React's rendering model rather than against it.

## The Concept

### The Three Phases

React's rendering process has three distinct phases:

1. **Trigger:** Something causes a render -- either the initial mount or a state change.
2. **Render:** React calls your component functions to compute the new JSX output.
3. **Commit:** React applies the necessary changes to the DOM.

```
Trigger  -->  Render (call components)  -->  Commit (update DOM)
```

### Phase 1: Trigger

A render is triggered by:

- **Initial render:** When `ReactDOM.createRoot(root).render(<App />)` is called for the first time.
- **State update:** When `setState` (or `dispatch` from `useReducer`) is called within a component.

Props changing alone do not trigger a render -- a parent must re-render (due to its own state change), which then re-renders its children with the new props.

### Phase 2: Render (Calling Components)

During the render phase, React calls your component function:

```typescript
function TaskCard({ title, completed }: TaskCardProps) {
  // This function body executes during the render phase.
  // It should be a pure function: same inputs = same output.
  return (
    <div>
      <h3>{title}</h3>
      <span>{completed ? "Done" : "Pending"}</span>
    </div>
  );
}
```

Key points:
- React calls this function to get the JSX "recipe" for the UI.
- The function should be **pure** -- no side effects, no direct DOM manipulation.
- React may call this function multiple times (e.g., in Strict Mode during development).

For a re-render, React calls the component function again and **compares the new output to the previous output** to determine what changed. This comparison process is called **reconciliation** (or **diffing**).

### Phase 3: Commit

After React determines the minimal set of DOM changes needed, it commits them:

- New elements are created and inserted into the DOM.
- Changed elements have their attributes updated.
- Removed elements are deleted from the DOM.
- **Unchanged elements are left alone** -- React does not touch them.

This is why React is fast: it avoids rewriting the entire DOM on every state change.

### Reconciliation (Diffing)

React's reconciliation algorithm compares two trees of React elements and produces the minimum set of operations to transform one into the other.

**Rules React follows:**

1. **Different element types:** If the root element type changes (e.g., `<div>` becomes `<section>`), React destroys the old tree and builds a new one from scratch.
2. **Same element type:** React keeps the DOM node and only updates the changed attributes.
3. **Lists with keys:** React uses keys to match elements in the old and new lists, minimizing unnecessary creation and destruction.

```typescript
// Before:
<ul>
  <li key="a">Task A</li>
  <li key="b">Task B</li>
</ul>

// After (Task C added at the top):
<ul>
  <li key="c">Task C</li>
  <li key="a">Task A</li>
  <li key="b">Task B</li>
</ul>

// With keys: React knows A and B did not change; it only inserts C.
// Without keys: React would update all three items by position.
```

### State Update Batching

React batches multiple state updates within the same event handler into a single re-render:

```typescript
function Counter() {
  const [count, setCount] = useState<number>(0);
  const [label, setLabel] = useState<string>("Count");

  const handleClick = (): void => {
    setCount((prev) => prev + 1); // Queued
    setLabel("Updated Count");     // Queued
    // React does NOT re-render between these two calls.
    // Both updates are applied in a single render.
  };

  return (
    <div>
      <p>{label}: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}
```

As of React 18, batching applies to **all** state updates, including those inside `setTimeout`, promises, and native event handlers -- not just React event handlers.

### When Does a Component Re-Render?

A component re-renders when:

1. **Its own state changes** (via `setState` or `dispatch`).
2. **Its parent re-renders** (and passes new or same props -- the child is still called).
3. **A context value it consumes changes** (we will cover this on Wednesday).

A component does **not** re-render when:
- An unrelated component's state changes.
- A sibling component's state changes (unless they share a parent that re-renders).

### Pure Components and React.memo (Preview)

If a parent re-renders but passes the same props to a child, the child still re-renders by default. To skip unnecessary re-renders, you can wrap the child in `React.memo`:

```typescript
const TaskCard = React.memo(function TaskCard({ title }: { title: string }) {
  console.log("TaskCard rendered");
  return <div>{title}</div>;
});

// TaskCard will only re-render if 'title' actually changes.
```

This is an optimization technique; use it when profiling reveals a performance issue, not as a default.

## Code Example

Demonstrating that rendering is about calling functions, not painting pixels:

```typescript
import { useState } from "react";

function RenderCounter() {
  const [count, setCount] = useState<number>(0);

  // This log runs every time the component renders:
  console.log("RenderCounter rendered. Count:", count);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment (triggers re-render)
      </button>
    </div>
  );
}

export default RenderCounter;
```

Each click triggers: **Trigger** (state change) then **Render** (function called, new JSX produced) then **Commit** (DOM updated with the new count).

## Summary

- React rendering has three phases: **Trigger**, **Render** (call components), and **Commit** (update DOM).
- The render phase calls your component function to compute JSX -- it does not touch the DOM.
- **Reconciliation** compares old and new component output to determine the minimal DOM updates.
- React **batches** multiple state updates into a single re-render for performance.
- Components re-render when their state changes or their parent re-renders.

## Additional Resources
- [React Docs -- Render and Commit](https://react.dev/learn/render-and-commit)
- [React Docs -- State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React Docs -- Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
