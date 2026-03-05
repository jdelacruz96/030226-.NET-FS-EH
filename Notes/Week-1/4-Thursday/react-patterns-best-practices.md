# React Patterns and Best Practices

## Learning Objectives
- Apply established patterns for component design, state management, and code organization
- Recognize anti-patterns and understand why they cause problems
- Adopt conventions used by professional React teams

## Why This Matters

Patterns are proven solutions to recurring problems. Following established React patterns makes your code predictable, maintainable, and understandable by other developers. Anti-patterns, on the other hand, lead to subtle bugs and technical debt. This reading compiles the most important patterns and pitfalls.

## The Concept

### Component Patterns

**1. Extract Early, Extract Often**

If a component exceeds 100 lines or handles multiple responsibilities, extract smaller components:

```typescript
// Before: one large component
function Dashboard() {
  return (
    <div>
      <div className="header">
        <h1>Dashboard</h1>
        <nav>{/* navigation items */}</nav>
      </div>
      <div className="stats">{/* stats rendering */}</div>
      <div className="tasks">{/* task list rendering */}</div>
    </div>
  );
}

// After: composed from focused components
function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <StatsPanel />
      <TaskSection />
    </div>
  );
}
```

**2. Single Responsibility**

Each component should do one thing. A `TaskCard` displays a task. A `TaskList` renders a list of `TaskCard` components. A `TaskForm` handles task creation. They do not overlap.

**3. Prefer Composition Over Configuration**

Instead of adding many boolean props to a single component, compose smaller components:

```typescript
// Over-configured (avoid):
<Card showHeader showFooter showBorder isHighlighted hasCloseButton />

// Composed (prefer):
<Card>
  <CardHeader onClose={handleClose} />
  <CardBody>{content}</CardBody>
  <CardFooter>{actions}</CardFooter>
</Card>
```

### State Patterns

**4. Keep State as Close to Usage as Possible**

Do not lift state higher than necessary. If only one component needs it, keep it local:

```typescript
// Bad: state in App that only SearchBar uses
function App() {
  const [query, setQuery] = useState("");
  return <SearchBar query={query} onChange={setQuery} />;
}

// Good: state in SearchBar itself
function SearchBar() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

**5. Derive, Do Not Duplicate**

If a value can be computed from existing state, compute it during rendering:

```typescript
// Bad: duplicated state
const [items, setItems] = useState<Item[]>([]);
const [itemCount, setItemCount] = useState<number>(0);
// Now you must keep itemCount in sync with items manually.

// Good: derived value
const [items, setItems] = useState<Item[]>([]);
const itemCount = items.length; // Always accurate
```

**6. Group Related State**

If two pieces of state always change together, combine them:

```typescript
// If x and y always update together:
const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
// Instead of two separate useState calls.
```

### Anti-Patterns to Avoid

| Anti-Pattern | Why It Is Bad | What to Do Instead |
|---|---|---|
| Mutating state directly | React misses the change | Use immutable updates |
| Prop drilling through 5+ levels | Brittle, hard to maintain | Use Context or composition |
| `useEffect` for derived data | Unnecessary re-render | Compute during render |
| `useEffect` for event responses | Incorrect mental model | Handle in the event handler |
| Storing derived state | Gets out of sync | Derive during render |
| Giant components (500+ lines) | Hard to read, test, reuse | Extract smaller components |
| Inline function definitions in JSX (in hot paths) | Can break memoization | Define outside JSX or use `useCallback` |

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `TaskCard`, `UserProfile` |
| Props interfaces | PascalCase + `Props` | `TaskCardProps` |
| Event handler props | `on` + event | `onClick`, `onSubmit`, `onDelete` |
| Handler functions | `handle` + event | `handleClick`, `handleSubmit` |
| Boolean props | `is` or `has` prefix | `isActive`, `hasError`, `isLoading` |
| Custom hooks | `use` prefix | `useAuth`, `useFetch`, `useToggle` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |

### File Organization Best Practices

1. One component per file (with rare exceptions for tightly coupled small components).
2. Co-locate related files: `TaskCard.tsx`, `TaskCard.module.css`, `TaskCard.test.tsx`.
3. Use an `index.ts` barrel file for clean imports.
4. Separate types into a `types.ts` file when shared across multiple components.

## Summary

- Extract components early, keep them focused (single responsibility), and compose rather than configure.
- Keep state close to where it is used; derive values instead of duplicating state.
- Avoid common anti-patterns: mutating state, prop drilling, and using effects for derived data.
- Follow consistent naming conventions for components, props, handlers, and hooks.

## Additional Resources
- [React Docs -- Thinking in React](https://react.dev/learn/thinking-in-react)
- [React Docs -- You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Docs -- Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
