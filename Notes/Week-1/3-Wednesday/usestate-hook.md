# The useState Hook

## Learning Objectives
- Use `useState` with TypeScript generics to manage component state
- Understand lazy initialization and updater function patterns
- Apply `useState` to common scenarios: primitives, objects, and arrays

## Why This Matters

`useState` is the most frequently used hook in React. It is the mechanism that makes a component interactive -- tracking form values, toggling UI elements, managing lists, and more. Knowing how to type it properly with TypeScript generics ensures your state is predictable and your editor catches mistakes before they reach the browser.

## The Concept

### Basic Usage

`useState` returns a tuple: the current state value and a function to update it.

```typescript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState<number>(0);
  //      ^state   ^setter           ^generic  ^initial value

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### TypeScript Generics with useState

The generic parameter tells TypeScript what type the state holds:

```typescript
// Primitive types:
const [name, setName] = useState<string>("");
const [count, setCount] = useState<number>(0);
const [isActive, setIsActive] = useState<boolean>(false);

// When TypeScript can infer the type, the generic is optional:
const [name, setName] = useState(""); // Inferred as string
const [count, setCount] = useState(0); // Inferred as number
```

**Use the explicit generic when inference is insufficient:**

```typescript
// Nullable state:
const [user, setUser] = useState<User | null>(null);

// Empty array (TypeScript cannot infer the element type from []):
const [tasks, setTasks] = useState<Task[]>([]);

// Union types:
const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
```

### The Updater Function Pattern

When the new state depends on the previous state, use the **updater function** form:

```typescript
// Direct update (fine when not dependent on previous state):
setCount(5);

// Updater function (required when dependent on previous state):
setCount((prev) => prev + 1);
```

Why does this matter? React batches state updates. If you call `setCount(count + 1)` three times in the same event handler, `count` has the same value in all three calls, so you only increment by 1. The updater function receives the most recent state:

```typescript
const incrementByThree = (): void => {
  // WRONG -- all three read the same 'count' value:
  // setCount(count + 1);
  // setCount(count + 1);
  // setCount(count + 1);

  // CORRECT -- each reads the latest state:
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
};
```

### Lazy Initialization

If the initial state requires an expensive computation, pass a function instead of a value. React will call it only on the first render:

```typescript
// This runs on EVERY render (wasteful):
const [data, setData] = useState(expensiveComputation());

// This runs only on the FIRST render (lazy):
const [data, setData] = useState(() => expensiveComputation());
```

### Managing Object State

When state is an object, you must replace the entire object (not mutate it):

```typescript
interface FormState {
  name: string;
  email: string;
  role: string;
}

function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    role: "trainee",
  });

  const handleChange = (field: keyof FormState, value: string): void => {
    // Spread the previous state and override the changed field:
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form>
      <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
    </form>
  );
}
```

### Managing Array State

Common array operations with immutable state updates:

```typescript
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add an item:
  const addTask = (title: string): void => {
    setTasks((prev) => [...prev, { id: Date.now(), title, completed: false }]);
  };

  // Remove an item:
  const removeTask = (id: number): void => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Update an item:
  const toggleTask = (id: number): void => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return <div>...</div>;
}
```

### State Is Preserved Between Renders

React remembers state values between renders. Each call to the component function receives the current state, not the initial value:

```typescript
function Counter() {
  const [count, setCount] = useState<number>(0);
  // First render: count = 0
  // After one click: count = 1
  // After two clicks: count = 2
  // useState(0) is only used on the FIRST render.
  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
}
```

### Multiple State Variables vs. Single Object

Prefer **multiple `useState` calls** for independent values:

```typescript
// Preferred -- independent state variables:
const [name, setName] = useState<string>("");
const [age, setAge] = useState<number>(0);
const [isActive, setIsActive] = useState<boolean>(true);

// Acceptable for tightly related values:
const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
```

If you have many related state variables that update together, consider `useReducer` instead (covered in the next reading).

## Code Example

A complete interactive form demonstrating multiple `useState` patterns:

```typescript
import { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = (): void => {
    if (!input.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: input.trim(), completed: false }]);
    setInput("");
  };

  const toggleTodo = (id: number): void => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div>
      <h1>Todos ({filteredTodos.length})</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)} style={{ cursor: "pointer" }}>
            {todo.completed ? "[x]" : "[ ]"} {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

## Summary

- `useState<T>(initialValue)` creates a state variable with a typed setter function.
- Use explicit generics when inference is insufficient (nullable types, empty arrays, union types).
- Use the **updater function** (`prev => ...`) when new state depends on previous state.
- State updates must be **immutable** -- spread objects and arrays instead of mutating.
- Use **lazy initialization** for expensive initial computations.

## Additional Resources
- [React Docs -- useState](https://react.dev/reference/react/useState)
- [React Docs -- Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [React Docs -- Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
