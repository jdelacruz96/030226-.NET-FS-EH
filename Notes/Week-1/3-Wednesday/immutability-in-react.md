# Immutability in React

## Learning Objectives
- Explain why immutability is critical for React's change detection
- Apply immutable update patterns for objects and arrays
- Avoid common mutation mistakes that cause silent bugs

## Why This Matters

React determines whether to re-render by checking if state has changed. It does this by comparing **references**, not by deep-comparing values. If you mutate an object or array in place, the reference stays the same, and React does not detect the change -- your UI silently goes stale. Understanding immutability is essential for writing correct React applications.

## The Concept

### How React Detects Changes

```typescript
const [tasks, setTasks] = useState<Task[]>([{ id: 1, title: "Learn React", completed: false }]);

// MUTATION (BAD) -- same reference, React does NOT detect the change:
tasks[0].completed = true;
setTasks(tasks); // React sees the same array reference -- no re-render!

// IMMUTABLE UPDATE (GOOD) -- new reference, React detects the change:
setTasks(tasks.map((t) => (t.id === 1 ? { ...t, completed: true } : t)));
// New array with a new object -- React re-renders.
```

### Immutable Object Updates

Use the spread operator to create a new object with updated properties:

```typescript
interface UserSettings {
  name: string;
  email: string;
  theme: "light" | "dark";
}

const [settings, setSettings] = useState<UserSettings>({
  name: "Jordan",
  email: "jordan@example.com",
  theme: "light",
});

// Update one field immutably:
setSettings((prev) => ({ ...prev, theme: "dark" }));
// Creates: { name: "Jordan", email: "jordan@example.com", theme: "dark" }
```

For nested objects:

```typescript
interface Profile {
  name: string;
  address: {
    city: string;
    zip: string;
  };
}

const [profile, setProfile] = useState<Profile>({
  name: "Jordan",
  address: { city: "Austin", zip: "73301" },
});

// Update nested property immutably:
setProfile((prev) => ({
  ...prev,
  address: { ...prev.address, city: "Portland" },
}));
```

### Immutable Array Updates

| Operation | Mutating (avoid) | Immutable (use) |
|---|---|---|
| **Add** | `arr.push(item)` | `[...arr, item]` |
| **Remove** | `arr.splice(index, 1)` | `arr.filter((_, i) => i !== index)` |
| **Update** | `arr[i] = newItem` | `arr.map((item, i) => i === index ? newItem : item)` |
| **Sort** | `arr.sort()` | `[...arr].sort()` |
| **Reverse** | `arr.reverse()` | `[...arr].reverse()` |

```typescript
const [items, setItems] = useState<string[]>(["React", "TypeScript"]);

// Add:
setItems((prev) => [...prev, "Vite"]);

// Remove by value:
setItems((prev) => prev.filter((item) => item !== "TypeScript"));

// Update by index:
setItems((prev) => prev.map((item, i) => (i === 0 ? "Next.js" : item)));
```

### Why Not Just Deep Compare?

Deep comparison (recursively checking every property) is expensive. For large state trees with hundreds of properties, deep comparison on every render would destroy performance. Reference comparison (`oldState === newState`) is instant. Immutable updates make reference comparison reliable -- if the reference changed, the data changed.

### Common Mutation Mistakes

```typescript
// Mistake 1: Sorting in place
const sorted = tasks.sort((a, b) => a.title.localeCompare(b.title));
// .sort() mutates the original array!
// Fix: const sorted = [...tasks].sort(...)

// Mistake 2: Pushing to an array
tasks.push(newTask);
setTasks(tasks); // Same reference -- no re-render
// Fix: setTasks([...tasks, newTask])

// Mistake 3: Direct property assignment
tasks[0].completed = true;
setTasks(tasks); // Same reference -- no re-render
// Fix: setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t))
```

## Code Example

```typescript
import { useState } from "react";

interface Note {
  id: number;
  text: string;
}

function NoteApp() {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (text: string): void => {
    setNotes((prev) => [...prev, { id: Date.now(), text }]);
  };

  const updateNote = (id: number, newText: string): void => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const removeNote = (id: number): void => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div>
      <button onClick={() => addNote(`Note #${notes.length + 1}`)}>Add Note</button>
      {notes.map((note) => (
        <div key={note.id}>
          <span>{note.text}</span>
          <button onClick={() => updateNote(note.id, note.text + " (edited)")}>Edit</button>
          <button onClick={() => removeNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default NoteApp;
```

## Summary

- React detects state changes by **reference comparison**, not deep comparison.
- Mutating state in place does not change the reference, so React misses the update.
- Always create **new objects and arrays** when updating state (spread operator, `.map()`, `.filter()`).
- Avoid mutating methods like `.push()`, `.sort()`, `.splice()`, and direct property assignment on state.

## Additional Resources
- [React Docs -- Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [React Docs -- Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- [Immer Library (for complex nested immutable updates)](https://immerjs.github.io/immer/)
