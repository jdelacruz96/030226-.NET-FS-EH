# Lifting State Up

## Learning Objectives
- Describe the pattern of lifting state to the nearest common ancestor
- Apply lifting state to coordinate sibling components
- Understand the trade-offs of lifting state

## Why This Matters

When two or more components need to share the same data, someone must own that data. The answer in React is always the same: move the state up to the nearest common ancestor and pass it down as props. This fundamental pattern appears in every React application and is the stepping stone to understanding more advanced state management solutions.

## The Concept

### The Pattern

When sibling components need the same state:

1. **Identify the nearest common ancestor** of the components that need the data.
2. **Move the state** to that ancestor.
3. **Pass the state down** via props.
4. **Pass updater functions down** via callback props.

### Before: Duplicated State

```typescript
// BAD -- each component has its own copy of the temperature:
function CelsiusInput() {
  const [celsius, setCelsius] = useState<number>(0);
  return <input value={celsius} onChange={(e) => setCelsius(Number(e.target.value))} />;
}

function FahrenheitInput() {
  const [fahrenheit, setFahrenheit] = useState<number>(32);
  return <input value={fahrenheit} onChange={(e) => setFahrenheit(Number(e.target.value))} />;
}
// These two inputs are not synchronized -- changing one does not update the other.
```

### After: Lifted State

```typescript
// GOOD -- state lives in the parent, which is the single source of truth:
function TemperatureConverter() {
  const [celsius, setCelsius] = useState<number>(0);
  const fahrenheit = celsius * (9 / 5) + 32;

  return (
    <div>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitDisplay value={fahrenheit} />
    </div>
  );
}

interface CelsiusInputProps {
  value: number;
  onChange: (value: number) => void;
}

function CelsiusInput({ value, onChange }: CelsiusInputProps) {
  return (
    <label>
      Celsius:
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function FahrenheitDisplay({ value }: { value: number }) {
  return <p>Fahrenheit: {value.toFixed(1)}</p>;
}
```

### A Practical Example: Filters and Lists

A common pattern in dashboards: a filter component and a list component that need to share the filter value.

```typescript
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
}

// Parent owns the state:
function TaskDashboard() {
  const [filter, setFilter] = useState<string>("all");
  const [tasks] = useState<Task[]>([
    { id: 1, title: "Design components", status: "done" },
    { id: 2, title: "Implement API", status: "in-progress" },
    { id: 3, title: "Write tests", status: "todo" },
  ]);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <TaskFilter current={filter} onChange={setFilter} />
      <TaskList tasks={filtered} />
    </div>
  );
}

// Child 1: Filter controls
interface TaskFilterProps {
  current: string;
  onChange: (value: string) => void;
}

function TaskFilter({ current, onChange }: TaskFilterProps) {
  return (
    <div>
      {["all", "todo", "in-progress", "done"].map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          style={{ fontWeight: current === status ? "bold" : "normal" }}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

// Child 2: Task list
function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title} [{task.status}]
        </li>
      ))}
    </ul>
  );
}
```

### Trade-Offs

| Benefit | Cost |
|---|---|
| Single source of truth -- no out-of-sync copies | More props to pass |
| Siblings stay synchronized | Parent becomes more complex |
| Predictable data flow | Deep trees may require prop drilling |

When prop drilling becomes excessive (passing through 3+ levels), consider the Context API or an external state management library.

### The Decision Framework

1. Does only one component need this state? Keep it local (`useState`).
2. Do a parent and its direct children need it? Lift it one level.
3. Do distant components need it? Lift it to the common ancestor, or use Context.
4. Does the entire app need it? Use Context or a state management library.

## Code Example

```typescript
import { useState } from "react";

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <ItemList onSelect={setSelectedId} selectedId={selectedId} />
      <ItemDetail itemId={selectedId} />
    </div>
  );
}

function ItemList({ onSelect, selectedId }: { onSelect: (id: number) => void; selectedId: number | null }) {
  const items = [
    { id: 1, name: "React" },
    { id: 2, name: "TypeScript" },
    { id: 3, name: "Vite" },
  ];

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{ fontWeight: item.id === selectedId ? "bold" : "normal", cursor: "pointer" }}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}

function ItemDetail({ itemId }: { itemId: number | null }) {
  if (!itemId) return <p>Select an item to view details.</p>;
  return <p>Viewing details for item #{itemId}</p>;
}

export default App;
```

## Summary

- **Lifting state up** means moving shared state to the nearest common ancestor.
- The ancestor passes state down as props and updater callbacks for child-to-parent communication.
- This pattern ensures a single source of truth and keeps sibling components synchronized.
- When lifting state causes excessive prop drilling, escalate to Context or a state management library.

## Additional Resources
- [React Docs -- Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React Docs -- Thinking in React (Step 4)](https://react.dev/learn/thinking-in-react#step-4-identify-where-your-state-should-live)
- [React Docs -- Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
