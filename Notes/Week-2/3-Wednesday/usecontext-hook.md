# The useContext Hook

## Learning Objectives
- Understand `useContext` as a way to consume context values
- Use `useContext` to avoid prop drilling
- Type context values with TypeScript

## Why This Matters

As applications grow, passing data through multiple levels of the component tree (prop drilling) becomes tedious and error-prone. `useContext` lets any component in the tree access shared data directly, without every intermediate component needing to forward props. This reading covers the consumption side; the "Context API" reading covers creating and providing context.

## The Concept

### The Problem: Prop Drilling

```typescript
// Without context -- every level must forward the theme prop:
function App() {
  const theme = "dark";
  return <Layout theme={theme} />;
}
function Layout({ theme }: { theme: string }) {
  return <Sidebar theme={theme} />;
}
function Sidebar({ theme }: { theme: string }) {
  return <NavItem theme={theme} />;
}
function NavItem({ theme }: { theme: string }) {
  return <span className={`nav-item ${theme}`}>Dashboard</span>;
}
```

`Layout` and `Sidebar` do not use `theme` -- they only pass it along. This is prop drilling.

### The Solution: useContext

With context, `NavItem` can access `theme` directly:

```typescript
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function NavItem() {
  const theme = useContext(ThemeContext);
  return <span className={`nav-item ${theme}`}>Dashboard</span>;
}
```

No intermediate components need to know about `theme` at all.

### How useContext Works

1. A context is created with `createContext`.
2. A `Provider` component wraps part of the tree and supplies a value.
3. Any descendant component calls `useContext(MyContext)` to read the current value.

```typescript
// ThemeContext.tsx
import { createContext } from "react";

export const ThemeContext = createContext<string>("light");
```

```typescript
// App.tsx
import { ThemeContext } from "./ThemeContext";

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}
```

```typescript
// Any descendant:
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Click Me</button>;
}
```

### Typing Context with TypeScript

Always type the context value explicitly:

```typescript
interface AppSettings {
  theme: "light" | "dark";
  language: string;
  fontSize: number;
}

const SettingsContext = createContext<AppSettings>({
  theme: "light",
  language: "en",
  fontSize: 14,
});
```

For contexts that might not have a provider (e.g., when the value is set dynamically), use `null` as the default and handle it:

```typescript
interface AuthContextValue {
  user: string;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Custom hook that throws if used outside the provider:
function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### When useContext Re-Renders

A component using `useContext` re-renders whenever the **context value changes**. This means:

- If the provider's `value` prop changes (by reference), all consumers re-render.
- If the provider's `value` is a new object on every render, all consumers re-render on every render.

To prevent unnecessary re-renders, memoize the context value (covered in the Context API reading).

## Code Example

```typescript
import { createContext, useContext, useState } from "react";

// 1. Create typed context:
interface UserContext {
  username: string;
  role: string;
}

const UserCtx = createContext<UserContext>({ username: "Guest", role: "viewer" });

// 2. Consumer component:
function UserBadge() {
  const { username, role } = useContext(UserCtx);
  return <span>{username} ({role})</span>;
}

// 3. Provider in the tree:
function App() {
  const [user] = useState<UserContext>({ username: "Jordan", role: "admin" });

  return (
    <UserCtx.Provider value={user}>
      <header>
        <UserBadge />
      </header>
    </UserCtx.Provider>
  );
}

export default App;
```

## Summary

- `useContext` reads the current value from a React context, bypassing intermediate components.
- It eliminates prop drilling for data that many components need (themes, auth, settings).
- Always type context values explicitly; use a custom hook with a null check for safety.
- Components re-render when their consumed context value changes.

## Additional Resources
- [React Docs -- useContext](https://react.dev/reference/react/useContext)
- [React Docs -- Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React TypeScript Cheatsheet -- Context](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context)
