# State Management Overview

## Learning Objectives
- Survey the spectrum of state management strategies in React
- Understand when local state, Context, and external libraries are appropriate
- Make informed decisions about state management for different project sizes

## Why This Matters

"How should I manage state?" is one of the most common questions in React development. The answer depends on your application's size, complexity, and team structure. This reading maps the landscape so you can choose the right tool for the job instead of defaulting to the most popular option.

## The Concept

### The State Management Spectrum

React offers a progression of state management approaches, from simple to complex:

```
Local State  -->  Lifted State  -->  Context API  -->  External Libraries
(useState)       (shared parent)    (createContext)    (Redux, Zustand, etc.)
  Simple                                                     Complex
  Small apps                                              Large apps
```

### 1. Local State (`useState`)

State that belongs to a single component and is not shared:

- Toggle states (open/close, show/hide)
- Form input values
- UI state (selected tab, expanded section)

```typescript
const [isOpen, setIsOpen] = useState<boolean>(false);
```

**When to use:** The data is only relevant to this component.

### 2. Lifted State

State owned by a common ancestor and passed to children via props:

- Coordinating sibling components
- Sharing filter/selection state between a list and detail view

```typescript
// Parent owns the state:
const [selectedId, setSelectedId] = useState<number | null>(null);
// Passed to children as props.
```

**When to use:** Two or more closely related components need the same data.

### 3. Context API

State shared across many components without explicit prop passing:

- Theme (light/dark mode)
- Authentication (current user)
- Locale and language settings
- Feature flags

```typescript
const ThemeContext = createContext<ThemeContextValue>(defaultValue);
```

**When to use:** Data is needed by many components at different nesting depths, and it changes infrequently.

### 4. External State Libraries

Dedicated libraries for managing complex, frequently updating global state:

| Library | Approach | Best For |
|---|---|---|
| **Redux Toolkit** | Centralized store, dispatched actions, reducers | Large enterprise apps with strict patterns |
| **Zustand** | Minimal API, hook-based stores | Medium apps wanting simplicity |
| **Jotai** | Atomic state, bottom-up | Apps with many small, independent pieces of state |
| **Recoil** | Atom/selector graph | Apps with derived/computed state |

**When to use:** Complex state logic, many consumers, frequent updates, or need for middleware (logging, persistence, devtools).

### Decision Framework

| Question | Answer | Use |
|---|---|---|
| Is it used by only this component? | Yes | `useState` |
| Is it shared by parent and child? | Yes | `useState` in parent, pass as props |
| Is it shared by siblings? | Yes | Lift state to common ancestor |
| Is it needed by many distant components? | Yes | Context API |
| Does it change frequently with many consumers? | Yes | External library |
| Does it involve complex transitions/side effects? | Yes | `useReducer` or external library |
| Is the team large and needs strict patterns? | Yes | Redux Toolkit |

### Server State vs. Client State

An important distinction:

**Client state:** Data that exists only in the browser (form values, UI state, user preferences). Managed by the tools above.

**Server state:** Data that originates from a backend API (user profiles, task lists, product catalogs). Managed by data-fetching libraries:

| Library | Purpose |
|---|---|
| **TanStack Query (React Query)** | Caching, synchronization, and updating of server state |
| **SWR** | Stale-while-revalidate data fetching |

These libraries handle caching, background refetching, optimistic updates, and error/loading states -- concerns that `useState` + `useEffect` handle poorly at scale.

### The Pragmatic Approach

1. Start with `useState` for everything.
2. Lift state when siblings need to share it.
3. Use Context when prop drilling becomes painful.
4. Introduce an external library only when Context is insufficient (frequent updates, complex logic, devtools needs).

Do not adopt Redux on day one of a project. Let the complexity of the application guide your choice.

## Code Example

The same "theme toggle" feature implemented at three levels:

```typescript
// Level 1: Local state (single component)
function ThemeButton() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>;
}

// Level 2: Lifted state (parent + children)
function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <>
      <Header theme={theme} />
      <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === "light" ? "dark" : "light")} />
    </>
  );
}

// Level 3: Context (available everywhere)
const ThemeContext = createContext<{ theme: string; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === "light" ? "dark" : "light") }}>
      <DeeplyNestedComponent />
    </ThemeContext.Provider>
  );
}
```

## Summary

- React offers a spectrum: `useState` then lifted state then Context then external libraries.
- Start simple and escalate only when complexity demands it.
- Context is for widely shared, infrequently changing data; external libraries handle complex, frequent updates.
- Distinguish **client state** (UI, forms) from **server state** (API data) and use appropriate tools for each.

## Additional Resources
- [React Docs -- Managing State](https://react.dev/learn/managing-state)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
