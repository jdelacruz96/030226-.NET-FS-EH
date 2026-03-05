# Conditional Rendering

## Learning Objectives
- Apply multiple conditional rendering patterns in JSX
- Choose the right pattern for different scenarios
- Avoid common pitfalls with falsy values

## Why This Matters

Almost every component needs to render different content based on conditions -- loading states, user roles, empty lists, error messages. React does not have a built-in `if` directive like some frameworks; instead, you use JavaScript expressions. Mastering these patterns makes your components flexible and expressive.

## The Concept

### Pattern 1: Ternary Operator

The most common pattern for choosing between two outputs:

```typescript
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={isActive ? "badge-active" : "badge-inactive"}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
```

### Pattern 2: Logical AND (&&)

Show something or nothing:

```typescript
function Notification({ count }: { count: number }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {count > 0 && <span className="badge">{count} new notifications</span>}
    </div>
  );
}
```

**Pitfall:** Be careful with falsy values. `0 && <Component />` renders `0`, not nothing:

```typescript
// BAD -- renders "0" on screen:
{items.length && <ItemList items={items} />}

// GOOD -- renders nothing when length is 0:
{items.length > 0 && <ItemList items={items} />}
```

### Pattern 3: Early Return

Return early from the component function for guard conditions:

```typescript
function UserProfile({ user }: { user: User | null }) {
  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Pattern 4: Helper Variable

Extract complex conditions into a variable before the return:

```typescript
function TaskDashboard({ tasks, isLoading, error }: DashboardProps) {
  let content: React.ReactNode;

  if (isLoading) {
    content = <p>Loading tasks...</p>;
  } else if (error) {
    content = <p className="error">Error: {error}</p>;
  } else if (tasks.length === 0) {
    content = <p>No tasks yet. Create one to get started.</p>;
  } else {
    content = <TaskList tasks={tasks} />;
  }

  return (
    <div>
      <h1>Tasks</h1>
      {content}
    </div>
  );
}
```

### Pattern 5: Record Lookup (Map Pattern)

For many distinct cases, use a record/map:

```typescript
type Status = "idle" | "loading" | "success" | "error";

const statusMessages: Record<Status, string> = {
  idle: "Ready to start.",
  loading: "Loading data...",
  success: "Data loaded successfully.",
  error: "Something went wrong.",
};

function StatusDisplay({ status }: { status: Status }) {
  return <p>{statusMessages[status]}</p>;
}
```

### Pattern 6: Component Map

Render entirely different components based on state:

```typescript
const stepComponents: Record<number, React.ComponentType> = {
  1: PersonalInfoStep,
  2: AddressStep,
  3: ConfirmationStep,
};

function Wizard({ step }: { step: number }) {
  const StepComponent = stepComponents[step];
  if (!StepComponent) return <p>Invalid step.</p>;
  return <StepComponent />;
}
```

### Choosing the Right Pattern

| Scenario | Recommended Pattern |
|---|---|
| Choose between two outputs | Ternary |
| Show or hide one element | Logical AND (`&&`) |
| Guard clause (no data, not authorized) | Early return |
| Multiple conditions (loading/error/empty/data) | Helper variable |
| Many distinct cases with the same structure | Record lookup |
| Many distinct cases with different components | Component map |

## Code Example

```typescript
import { useState } from "react";

type ViewMode = "grid" | "list" | "compact";

function TaskView() {
  const [mode, setMode] = useState<ViewMode>("grid");
  const [tasks] = useState(["Design", "Implement", "Test"]);

  const viewMap: Record<ViewMode, React.ReactNode> = {
    grid: <div className="grid">{tasks.map((t) => <div key={t} className="card">{t}</div>)}</div>,
    list: <ul>{tasks.map((t) => <li key={t}>{t}</li>)}</ul>,
    compact: <p>{tasks.join(" | ")}</p>,
  };

  return (
    <div>
      <div>
        <button onClick={() => setMode("grid")}>Grid</button>
        <button onClick={() => setMode("list")}>List</button>
        <button onClick={() => setMode("compact")}>Compact</button>
      </div>
      {viewMap[mode]}
    </div>
  );
}

export default TaskView;
```

## Summary

- React uses JavaScript expressions (ternaries, `&&`, variables) for conditional rendering -- no special directives.
- **Ternary** for two-option choices, **`&&`** for show/hide, **early return** for guards, **helper variables** for multiple conditions.
- Watch for the `0 &&` pitfall -- always compare explicitly (`> 0`, `!== 0`).
- Record lookups and component maps scale well for many distinct cases.

## Additional Resources
- [React Docs -- Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [React Docs -- Rendering Lists](https://react.dev/learn/rendering-lists)
