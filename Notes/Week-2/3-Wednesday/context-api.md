# Context API

## Learning Objectives
- Explain the Context API as a tool for avoiding prop drilling
- Create a context with `createContext` and provide it with `Context.Provider`
- Determine when to use Context vs. external state management libraries

## Why This Matters

The Context API is React's built-in solution for sharing data across the component tree without passing props through every level. It is the bridge between simple prop-based data flow and full-scale state management. Understanding when Context is sufficient -- and when it is not -- helps you make informed architecture decisions.

## The Concept

### What Is the Context API?

The Context API consists of three parts:

1. **`createContext`** -- creates a context object with a default value.
2. **`Context.Provider`** -- wraps a subtree and supplies a value to all descendants.
3. **`useContext`** -- reads the current context value from the nearest provider.

### Creating and Providing Context

```typescript
import { createContext, useState, ReactNode } from "react";

// 1. Define the context value type:
interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// 2. Create the context with a default value:
export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

// 3. Create a Provider component:
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Consuming Context

Any component inside the provider tree can access the value:

```typescript
import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}. Click to switch.
    </button>
  );
}
```

### When to Use Context

Context is well-suited for:

| Use Case | Example |
|---|---|
| **UI themes** | Light/dark mode |
| **Authentication** | Current user, login/logout functions |
| **Locale/language** | i18n strings |
| **Feature flags** | Enable/disable features |
| **App-wide settings** | Font size, accessibility preferences |

### When NOT to Use Context

Context is **not** optimized for high-frequency updates. Every time the context value changes, every consumer re-renders. This makes it unsuitable for:

- Rapidly changing values (mouse position, animation frames)
- Large, complex state trees (use a dedicated state library instead)
- State that only a few closely related components need (just pass props)

### Context vs. Props vs. External State

| Approach | Best For |
|---|---|
| **Props** | Local data between parent and child (1-2 levels) |
| **Context** | Widely shared, infrequently changing data (theme, auth, locale) |
| **Redux / Zustand** | Complex, frequently updated global state with many consumers |

### Avoiding Unnecessary Re-Renders

When the provider re-renders, it typically creates a new `value` object, causing all consumers to re-render. Mitigate this by memoizing the value:

```typescript
import { useMemo, useState, ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Memoize so the object reference only changes when 'theme' changes:
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Splitting Context for Performance

If your context has both rarely-changing and frequently-changing values, split them into separate contexts:

```typescript
// Separate contexts:
const UserContext = createContext<User | null>(null);         // Rarely changes
const NotificationsContext = createContext<Notification[]>([]); // Changes often

// Components only subscribe to the context they need,
// so notification updates do not re-render user-only consumers.
```

## Code Example

A complete authentication context:

```typescript
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextValue {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string): void => setUser(username);
  const logout = (): void => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Usage:
function UserGreeting() {
  const { user, logout } = useAuth();
  if (!user) return <p>Please log in.</p>;
  return (
    <div>
      <p>Welcome, {user}!</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
```

## Summary

- The Context API has three parts: `createContext`, `Provider`, and `useContext`.
- It eliminates prop drilling for data needed by many components.
- Context is ideal for UI themes, authentication, locale, and feature flags.
- It is not optimized for high-frequency updates; use a state management library for complex or rapidly changing state.
- Memoize context values and split contexts to avoid unnecessary re-renders.

## Additional Resources
- [React Docs -- createContext](https://react.dev/reference/react/createContext)
- [React Docs -- Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Kent C. Dodds -- How to Use React Context Effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)
