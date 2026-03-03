# Parent-Child Communication

## Learning Objectives
- Pass data from parent to child via props
- Communicate from child to parent via callback props
- Understand the "lifting state up" pattern at a high level
- Type callback functions in TypeScript

## Why This Matters

React's unidirectional data flow means data travels from parent to child through props. But applications are interactive -- a child component (like a button or form) often needs to tell the parent that something happened. The pattern for this is simple but fundamental: **pass a callback function as a prop**. Mastering this pattern is essential for building any interactive React application.

## The Concept

### Parent to Child: Props

The straightforward direction. A parent passes data down to its children:

```typescript
interface UserProfileProps {
  name: string;
  email: string;
}

function UserProfile({ name, email }: UserProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

function App() {
  return <UserProfile name="Jordan" email="jordan@example.com" />;
}
```

### Child to Parent: Callback Props

When a child needs to send information upward, the parent passes a **callback function** as a prop. The child calls this function when an event occurs:

```typescript
// Parent defines the handler and passes it down:
function TaskBoard() {
  const handleTaskComplete = (taskId: number): void => {
    console.log(`Task ${taskId} completed`);
  };

  return (
    <div>
      <TaskCard id={1} title="Set up project" onComplete={handleTaskComplete} />
      <TaskCard id={2} title="Write tests" onComplete={handleTaskComplete} />
    </div>
  );
}

// Child calls the callback when the user interacts:
interface TaskCardProps {
  id: number;
  title: string;
  onComplete: (taskId: number) => void;
}

function TaskCard({ id, title, onComplete }: TaskCardProps) {
  return (
    <div>
      <span>{title}</span>
      <button onClick={() => onComplete(id)}>Complete</button>
    </div>
  );
}
```

The data flow looks like this:

```
TaskBoard (state + handler)
  |
  |-- passes onComplete callback as prop -->
  |
  TaskCard (calls onComplete when button is clicked)
  |
  |-- onComplete(id) flows back up to TaskBoard -->
```

### Naming Conventions for Callbacks

By convention:
- **Props** that accept callbacks are named with the `on` prefix: `onComplete`, `onChange`, `onDelete`.
- **Handler functions** in the parent are named with the `handle` prefix: `handleComplete`, `handleChange`, `handleDelete`.

This makes the flow clear: `handleComplete` (in the parent) is passed as `onComplete` (to the child).

### Typed Callback Patterns

#### Simple callback (no data):

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void; // No arguments, no return value
}
```

#### Callback with data:

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
}
```

#### Callback with complex data:

```typescript
interface FormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

interface TaskFormProps {
  onSubmit: (data: FormData) => void;
}
```

### Lifting State Up (Preview)

When two sibling components need to share data, the common pattern is to **lift the state up** to their nearest common ancestor:

```typescript
function App() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  return (
    <div>
      {/* Both siblings access the same state via props */}
      <TaskList onSelectTask={setSelectedTaskId} />
      <TaskDetail taskId={selectedTaskId} />
    </div>
  );
}
```

`TaskList` tells the parent which task was selected (via callback), and `TaskDetail` receives the selected ID (via prop). The parent (`App`) is the single source of truth. We will cover this pattern in greater depth on Wednesday.

### Multi-Level Communication

When a callback needs to pass through multiple levels of the component tree, you pass it down through each level:

```typescript
// Grandparent -> Parent -> Child

function App() {
  const handleDelete = (id: number): void => {
    console.log("Deleting task:", id);
  };

  return <TaskSection onDeleteTask={handleDelete} />;
}

function TaskSection({ onDeleteTask }: { onDeleteTask: (id: number) => void }) {
  return <TaskCard id={1} title="Example" onDelete={onDeleteTask} />;
}

function TaskCard({ id, title, onDelete }: { id: number; title: string; onDelete: (id: number) => void }) {
  return (
    <div>
      <span>{title}</span>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}
```

This works but can become tedious for deeply nested trees. On Wednesday, you will learn about the **Context API**, which solves this "prop drilling" problem.

## Code Example

A complete interactive example with bidirectional communication:

```typescript
import { useState } from "react";

interface Item {
  id: number;
  name: string;
}

interface ItemListProps {
  items: Item[];
  onRemove: (id: number) => void;
}

function ItemList({ items, onRemove }: ItemListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}

interface AddItemFormProps {
  onAdd: (name: string) => void;
}

function AddItemForm({ onAdd }: AddItemFormProps) {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add an item"
      />
      <button type="submit">Add</button>
    </form>
  );
}

function ShoppingList() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Keyboard" },
    { id: 2, name: "Monitor" },
  ]);

  const handleAdd = (name: string): void => {
    setItems((prev) => [...prev, { id: Date.now(), name }]);
  };

  const handleRemove = (id: number): void => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1>Shopping List ({items.length} items)</h1>
      <AddItemForm onAdd={handleAdd} />
      <ItemList items={items} onRemove={handleRemove} />
    </div>
  );
}

export default ShoppingList;
```

## Summary

- **Parent to child:** Data flows down via props.
- **Child to parent:** Events flow up via callback functions passed as props.
- Name callback props with `on` (e.g., `onComplete`) and handler functions with `handle` (e.g., `handleComplete`).
- When siblings need shared data, **lift state up** to their common ancestor.
- For deeply nested trees, prop drilling can be mitigated with the Context API (covered Wednesday).

## Additional Resources
- [React Docs -- Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React Docs -- Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React Docs -- Responding to Events](https://react.dev/learn/responding-to-events)
