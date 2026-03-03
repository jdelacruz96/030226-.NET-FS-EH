# The useReducer Hook

## Learning Objectives
- Use `useReducer` for complex state logic with typed actions and dispatch
- Understand the reducer pattern (state, action, dispatch)
- Determine when to choose `useReducer` over `useState`

## Why This Matters

`useState` works well for simple, independent state values. But when state transitions become complex -- multiple related values that update together, or state changes that depend on the previous state in non-trivial ways -- `useReducer` provides a more structured approach. It is the same pattern behind Redux, so learning it here prepares you for external state management libraries as well.

## The Concept

### The Reducer Pattern

A reducer is a pure function that takes the current state and an action, then returns the new state:

```
(state, action) => newState
```

The three key concepts:

| Concept | Purpose |
|---|---|
| **State** | The current data |
| **Action** | An object describing what happened (has a `type` and optional `payload`) |
| **Dispatch** | A function that sends an action to the reducer |

### Basic Usage

```typescript
import { useReducer } from "react";

// 1. Define state and action types:
interface CounterState {
  count: number;
}

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset"; payload: number };

// 2. Define the reducer:
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: action.payload };
    default:
      return state;
  }
}

// 3. Use the reducer in a component:
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset", payload: 0 })}>Reset</button>
    </div>
  );
}
```

### Why Type the Actions?

TypeScript discriminated unions ensure that:
- Only valid action types can be dispatched.
- Each action type has the correct payload shape.
- The switch statement in the reducer is exhaustive.

```typescript
// TypeScript catches invalid actions at compile time:
dispatch({ type: "multiply" }); // Error: '"multiply"' is not assignable
dispatch({ type: "reset" });    // Error: Property 'payload' is missing
```

### A Realistic Example: Form State

```typescript
interface FormState {
  name: string;
  email: string;
  isSubmitting: boolean;
  error: string | null;
}

type FormAction =
  | { type: "updateField"; field: keyof Omit<FormState, "isSubmitting" | "error">; value: string }
  | { type: "submitStart" }
  | { type: "submitSuccess" }
  | { type: "submitError"; error: string }
  | { type: "reset" };

const initialFormState: FormState = {
  name: "",
  email: "",
  isSubmitting: false,
  error: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "updateField":
      return { ...state, [action.field]: action.value };
    case "submitStart":
      return { ...state, isSubmitting: true, error: null };
    case "submitSuccess":
      return { ...initialFormState };
    case "submitError":
      return { ...state, isSubmitting: false, error: action.error };
    case "reset":
      return { ...initialFormState };
    default:
      return state;
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    dispatch({ type: "submitStart" });
    try {
      await submitForm(state);
      dispatch({ type: "submitSuccess" });
    } catch (err) {
      dispatch({ type: "submitError", error: (err as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.name}
        onChange={(e) => dispatch({ type: "updateField", field: "name", value: e.target.value })}
        disabled={state.isSubmitting}
      />
      <input
        value={state.email}
        onChange={(e) => dispatch({ type: "updateField", field: "email", value: e.target.value })}
        disabled={state.isSubmitting}
      />
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

### useState vs. useReducer

| Scenario | Prefer |
|---|---|
| Single primitive value (counter, toggle) | `useState` |
| Multiple independent values | `useState` (one per value) |
| Multiple related values that update together | `useReducer` |
| Complex state transitions (e.g., form with loading/error) | `useReducer` |
| State logic shared across components | `useReducer` + Context |
| Simple object state | Either works |

### Lazy Initialization

Like `useState`, you can lazily initialize the reducer state:

```typescript
function init(initialCount: number): CounterState {
  return { count: initialCount };
}

const [state, dispatch] = useReducer(counterReducer, 10, init);
// 'init' is called with 10, returning { count: 10 }
```

## Code Example

A task management reducer:

```typescript
import { useReducer } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type TaskAction =
  | { type: "add"; title: string }
  | { type: "toggle"; id: number }
  | { type: "remove"; id: number };

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "add":
      return [...state, { id: Date.now(), title: action.title, completed: false }];
    case "toggle":
      return state.map((task) =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case "remove":
      return state.filter((task) => task.id !== action.id);
    default:
      return state;
  }
}

function TaskManager() {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  return (
    <div>
      <button onClick={() => dispatch({ type: "add", title: `Task #${tasks.length + 1}` })}>
        Add Task
      </button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => dispatch({ type: "toggle", id: task.id })}
              style={{ textDecoration: task.completed ? "line-through" : "none", cursor: "pointer" }}
            >
              {task.title}
            </span>
            <button onClick={() => dispatch({ type: "remove", id: task.id })}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
```

## Summary

- `useReducer` manages state through a pure reducer function: `(state, action) => newState`.
- Actions are typed using TypeScript discriminated unions for compile-time safety.
- Use `useReducer` when state transitions are complex, when multiple values update together, or when you want to centralize state logic.
- The reducer pattern is foundational -- it is the same pattern used by Redux and other state management libraries.

## Additional Resources
- [React Docs -- useReducer](https://react.dev/reference/react/useReducer)
- [React Docs -- Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [React TypeScript Cheatsheet -- useReducer](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#usereducer)
