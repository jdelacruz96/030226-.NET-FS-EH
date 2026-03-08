# Lists and Keys

## Learning Objectives
- Render lists dynamically using `.map()` in JSX
- Understand the purpose and importance of the `key` prop
- Avoid common pitfalls when rendering lists in React

## Why This Matters

Almost every application displays collections of data -- task lists, product catalogs, user tables, notification feeds. React provides a straightforward pattern for rendering these collections, but it relies on a critical concept -- the `key` prop -- to maintain performance and correctness. Misusing keys is one of the most common sources of subtle rendering bugs.

## The Concept

### Rendering Lists with `.map()`

In JSX, you render arrays by mapping each item to a JSX element:

```typescript
interface Task {
  id: number;
  title: string;
}

function TaskList() {
  const tasks: Task[] = [
    { id: 1, title: "Set up project" },
    { id: 2, title: "Build components" },
    { id: 3, title: "Write tests" },
  ];

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

The `.map()` method transforms each item in the array into a `<li>` element. React renders them all as children of the `<ul>`.

### What Is the `key` Prop?

The `key` prop is a special string (or number) attribute that React uses to **identify which items in a list have changed, been added, or been removed**. It is not passed to the component as a prop -- React uses it internally for its reconciliation algorithm.

```typescript
// React uses the key to track each element:
<li key={task.id}>{task.title}</li>
```

### Why Keys Matter

When React re-renders a list, it needs to determine:
1. Which items are new (need to be created)
2. Which items are gone (need to be removed)
3. Which items have changed position (need to be moved)

Without stable keys, React falls back to comparing elements by their position in the array. This can cause:
- Incorrect state preservation (state "sticks" to the wrong item)
- Unnecessary DOM updates
- Broken animations and transitions

### Rules for Keys

**1. Keys must be unique among siblings:**

```typescript
// Good -- unique IDs:
{tasks.map((task) => (
  <TaskCard key={task.id} title={task.title} />
))}

// Bad -- duplicate keys will cause warnings and bugs:
{tasks.map((task) => (
  <TaskCard key="task" title={task.title} />
))}
```

**2. Keys must be stable (do not change between renders):**

```typescript
// Good -- the ID does not change:
<li key={task.id}>{task.title}</li>

// Bad -- Math.random() generates a new key every render:
<li key={Math.random()}>{task.title}</li>
```

**3. Do not use array index as key (when items can be reordered, added, or deleted):**

```typescript
// Risky -- if the array order changes, React misidentifies elements:
{tasks.map((task, index) => (
  <li key={index}>{task.title}</li>
))}
```

Using the index as a key is acceptable **only** when:
- The list is static (never reordered, inserted, or deleted)
- Items have no local state or side effects

**4. Keys only need to be unique among siblings, not globally:**

```typescript
// These two lists can use the same key values -- they are separate:
<ul>{teamA.map((m) => <li key={m.id}>{m.name}</li>)}</ul>
<ul>{teamB.map((m) => <li key={m.id}>{m.name}</li>)}</ul>
```

### What Makes a Good Key?

| Source | Good Key? | Why |
|---|---|---|
| Database ID (`task.id`) | Yes | Unique and stable |
| UUID from `crypto.randomUUID()` | Yes (if generated once) | Unique and stable if created at item creation time |
| Array index | Conditional | Only safe for truly static, never-reordered lists |
| `Math.random()` | No | Changes every render |
| Object hash | Sometimes | Must be deterministic and unique |

### Rendering Complex List Items

Keys go on the outermost returned element, not on an inner element:

```typescript
interface Project {
  id: number;
  name: string;
  status: string;
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map((project) => (
        // Key goes here -- the outermost element:
        <div key={project.id} className="project-card">
          <h3>{project.name}</h3>
          <span>{project.status}</span>
        </div>
      ))}
    </div>
  );
}
```

### Filtering and Sorting

You can chain `.filter()` and `.sort()` before `.map()`:

```typescript
function ActiveTasks({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks
        .filter((task) => !task.completed)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
    </ul>
  );
}
```

## Code Example

A full example with adding and removing items, demonstrating why stable keys matter:

```typescript
import { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
}

function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Learn JSX" },
    { id: 2, text: "Understand keys" },
    { id: 3, text: "Build a component" },
  ]);

  const addTodo = (): void => {
    const newTodo: TodoItem = {
      id: Date.now(), // Simple unique ID
      text: `New task #${todos.length + 1}`,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const removeTodo = (id: number): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

## Summary

- Use `.map()` to transform arrays into lists of JSX elements.
- Every element in a mapped list must have a `key` prop that is **unique among siblings** and **stable across renders**.
- Prefer database IDs or other meaningful identifiers over array indices.
- Never use `Math.random()` or other non-deterministic values as keys.
- Keys help React's reconciliation algorithm efficiently update, add, and remove list items.

## Additional Resources
- [React Docs -- Rendering Lists](https://react.dev/learn/rendering-lists)
- [React Docs -- Why Does React Need Keys?](https://react.dev/learn/rendering-lists#why-does-react-need-keys)
- [Kent C. Dodds -- Understanding React's Key Prop](https://kentcdodds.com/blog/understanding-reacts-key-prop)
