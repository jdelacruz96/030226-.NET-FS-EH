# createContext: Centralized State

## Learning Objectives
- Use `createContext()` to build a centralized state store with TypeScript
- Structure a context module with typed state, actions, and a custom hook
- Understand the relationship between `createContext`, `useReducer`, and `useContext`

## Why This Matters

Combining `createContext` with `useReducer` gives you a Redux-like centralized state management pattern using only React's built-in APIs. This is sufficient for many applications and is the standard approach for managing global state without introducing external dependencies.

## The Concept

### The Pattern

A centralized state store using Context combines three elements:

1. **`createContext`** -- creates the context that will hold the state and dispatch function.
2. **`useReducer`** -- manages the state transitions via a typed reducer.
3. **A Provider component** -- wraps the tree and makes the store available.

### Step-by-Step Implementation

**Step 1: Define types**

```typescript
// store/types.ts

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface AppState {
  tasks: Task[];
  filter: "all" | "active" | "completed";
}

export type AppAction =
  | { type: "ADD_TASK"; title: string }
  | { type: "TOGGLE_TASK"; id: number }
  | { type: "REMOVE_TASK"; id: number }
  | { type: "SET_FILTER"; filter: AppState["filter"] };
```

**Step 2: Create the reducer**

```typescript
// store/reducer.ts

import { AppState, AppAction } from "./types";

export const initialState: AppState = {
  tasks: [],
  filter: "all",
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: Date.now(), title: action.title, completed: false },
        ],
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task
        ),
      };
    case "REMOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}
```

**Step 3: Create the context**

```typescript
// store/AppContext.tsx

import { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";
import { AppState, AppAction } from "./types";
import { appReducer, initialState } from "./reducer";

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

// Custom hook with safety check:
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Provider component:
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
```

**Step 4: Use it in the application**

```typescript
// main.tsx
import { AppProvider } from "./store/AppContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
```

```typescript
// components/TaskList.tsx
import { useAppContext } from "../store/AppContext";

function TaskList() {
  const { state, dispatch } = useAppContext();

  const filteredTasks = state.tasks.filter((task) => {
    if (state.filter === "active") return !task.completed;
    if (state.filter === "completed") return task.completed;
    return true;
  });

  return (
    <ul>
      {filteredTasks.map((task) => (
        <li key={task.id}>
          <span
            onClick={() => dispatch({ type: "TOGGLE_TASK", id: task.id })}
            style={{ textDecoration: task.completed ? "line-through" : "none", cursor: "pointer" }}
          >
            {task.title}
          </span>
          <button onClick={() => dispatch({ type: "REMOVE_TASK", id: task.id })}>X</button>
        </li>
      ))}
    </ul>
  );
}
```

### File Organization

```
src/
  store/
    types.ts            # State and action type definitions
    reducer.ts          # Reducer function and initial state
    AppContext.tsx       # Context, Provider, and custom hook
  components/
    TaskList.tsx         # Consumer component
    AddTaskForm.tsx      # Consumer component
  App.tsx
  main.tsx
```

### Advantages of This Pattern

- Zero external dependencies -- uses only React built-ins.
- TypeScript provides full type safety on actions and state.
- The custom hook (`useAppContext`) provides a clean consumption API.
- The reducer centralizes state logic, making it easy to test independently.

## Summary

- `createContext` + `useReducer` creates a centralized, type-safe state store.
- Define types, build a reducer, create a context with a custom hook, and wrap your app in a provider.
- This pattern is suitable for small-to-medium applications without the need for external libraries.
- The custom hook pattern (`useAppContext`) provides a clean API and catches missing providers at runtime.

## Additional Resources
- [React Docs -- Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React Docs -- createContext](https://react.dev/reference/react/createContext)
- [React Docs -- useReducer](https://react.dev/reference/react/useReducer)
