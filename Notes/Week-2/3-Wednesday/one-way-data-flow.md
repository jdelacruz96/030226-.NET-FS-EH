# One-Way Data Flow

## Learning Objectives
- Understand React's unidirectional data flow principle
- Explain why one-way data flow makes applications easier to debug
- Contrast one-way data flow with two-way data binding

## Why This Matters

React's data flow model is intentionally one-directional: data moves from parent to child through props, and events move from child to parent through callbacks. This constraint -- which may feel limiting at first -- is one of React's greatest strengths. It makes state changes predictable, bugs traceable, and applications maintainable.

## The Concept

### The Direction of Data

In React, data flows in one direction: **top-down**.

```
App (owns state)
  |-- passes data as props -->
      Dashboard
        |-- passes data as props -->
            TaskList
              |-- passes data as props -->
                  TaskCard (displays data)
```

When `TaskCard` needs to change data, it does NOT modify props. It calls a callback function the parent provided:

```
TaskCard -- calls onComplete() -->
    TaskList -- calls onTaskComplete() -->
        Dashboard -- calls handleComplete() -->
            App (updates state)
```

The state update in `App` triggers a re-render that flows back down through the tree.

### Why One-Way?

**Predictability:** You always know where data comes from (a parent) and where changes happen (the state owner). There are no hidden updates or circular dependencies.

**Traceability:** When something goes wrong, you trace the data from the top of the tree downward. The component that owns the state is the only place the data can change.

**Testability:** Components are pure functions of their props. Given the same props, they produce the same output.

### Contrast: Two-Way Data Binding

In frameworks with two-way data binding (e.g., Angular's `[(ngModel)]`), a form input and a model variable are linked bidirectionally. Changing the input updates the model, and changing the model updates the input automatically.

```
// Two-way binding (Angular-style concept):
Model <--> View
// Changing either one updates the other.
```

This is convenient for simple forms but can lead to difficult-to-trace bugs in complex applications because changes can originate from either direction.

React's approach:

```
// One-way data flow (React):
State --> View (via props)
View --> State (via explicit callback)
```

Every state change is explicit. There is no behind-the-scenes synchronization.

### Controlled Components: One-Way in Practice

React forms demonstrate one-way data flow clearly:

```typescript
import { useState, ChangeEvent } from "react";

function NameInput() {
  const [name, setName] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value); // Explicit update
  };

  // The input's value is driven by state (one-way: state -> view).
  // The onChange handler sends updates back (view -> state, explicitly).
  return <input value={name} onChange={handleChange} />;
}
```

The input does not "own" its value. React state owns the value, and the input simply reflects it.

### Benefits for Debugging

When a component displays the wrong data, the debugging process is straightforward:

1. Find the component displaying the wrong value.
2. Check its props -- where does this prop come from?
3. Trace up to the parent. Check the parent's state or props.
4. Repeat until you find the state owner where the incorrect value originates.

This linear debugging path is a direct consequence of one-way data flow.

## Code Example

```typescript
import { useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("Hello");

  return (
    <div>
      {/* Data flows DOWN via props */}
      <Display text={message} />
      {/* Events flow UP via callbacks */}
      <Editor value={message} onChange={setMessage} />
    </div>
  );
}

function Display({ text }: { text: string }) {
  return <h1>{text}</h1>;
}

function Editor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  );
}

export default App;
```

## Summary

- React enforces **one-way data flow**: data moves down through props; events move up through callbacks.
- This makes state changes explicit, predictable, and easy to trace.
- Two-way data binding is convenient but obscures where changes originate.
- Controlled components are the purest expression of one-way data flow in forms.

## Additional Resources
- [React Docs -- Thinking in React](https://react.dev/learn/thinking-in-react)
- [React Docs -- Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React Docs -- State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
