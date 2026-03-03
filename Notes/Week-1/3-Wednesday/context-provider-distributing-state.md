# Context Provider: Distributing State

## Learning Objectives
- Wrap component trees with `Context.Provider` to supply state
- Consume context in deeply nested children without prop drilling
- Compose multiple providers for different domains of state

## Why This Matters

Creating a context is only half the equation. The provider determines *which* components have access to the state and *where* in the tree the state boundary lives. Understanding how providers work -- including nesting multiple providers and scoping state to specific subtrees -- gives you precise control over data distribution.

## The Concept

### How Provider Works

The `Provider` component accepts a `value` prop and makes it available to every descendant that calls `useContext` on the same context:

```typescript
<MyContext.Provider value={someValue}>
  {/* All descendants can access someValue via useContext(MyContext) */}
  <ComponentTree />
</MyContext.Provider>
```

Components outside the provider receive the default value passed to `createContext`.

### Scoping Providers

You do not have to wrap the entire application. Providers can scope state to specific subtrees:

```typescript
function App() {
  return (
    <div>
      {/* Only the Dashboard subtree gets the DashboardProvider state */}
      <DashboardProvider>
        <DashboardPage />
      </DashboardProvider>

      {/* The Settings page has its own provider */}
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    </div>
  );
}
```

### Composing Multiple Providers

Real applications often have multiple contexts (auth, theme, notifications). Nest them at the application root:

```typescript
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Router />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

Each provider is independent. A component can consume any or all of them:

```typescript
function Header() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { unreadCount } = useNotifications();

  return (
    <header className={`header-${theme}`}>
      <span>Welcome, {user?.name}</span>
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </header>
  );
}
```

### Reducing Provider Nesting

If you have many providers, the nesting can become deep. A utility function can flatten it:

```typescript
import { ReactNode } from "react";

function ComposeProviders({ providers, children }: {
  providers: Array<({ children }: { children: ReactNode }) => JSX.Element>;
  children: ReactNode;
}) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}

// Usage:
function App() {
  return (
    <ComposeProviders providers={[AuthProvider, ThemeProvider, NotificationProvider]}>
      <Router />
    </ComposeProviders>
  );
}
```

### Consuming State in Deeply Nested Children

The primary benefit of context is that deeply nested components access state directly:

```typescript
// Without Context (prop drilling):
App -> Layout -> Sidebar -> NavMenu -> NavItem (needs theme)
// Every component in the chain must accept and forward 'theme'.

// With Context:
App (ThemeProvider)
  -> Layout
    -> Sidebar
      -> NavMenu
        -> NavItem
          const { theme } = useTheme(); // Direct access!
```

### Provider Value Updates and Re-Rendering

When the provider's `value` changes, all consumers re-render. This is important to understand for performance:

```typescript
// This creates a new object on every render, causing all consumers to re-render:
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}> {/* New object each render */}
      {children}
    </ThemeContext.Provider>
  );
}

// Fix: memoize the value:
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Overriding Context Values

A nested provider can override the value for its subtree:

```typescript
<ThemeContext.Provider value="dark">
  <Sidebar /> {/* Uses "dark" */}

  <ThemeContext.Provider value="light">
    <MainContent /> {/* Uses "light" -- overridden */}
  </ThemeContext.Provider>
</ThemeContext.Provider>
```

This is useful for sections of the UI that need a different theme or configuration.

## Code Example

A complete multi-context application:

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthValue { user: string | null; login: (name: string) => void; logout: () => void; }
const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

// App.tsx
import { AuthProvider } from "./contexts/AuthContext";

function UserPanel() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <button onClick={() => login("Jordan")}>Log In</button>;
  }
  return (
    <div>
      <p>Logged in as {user}</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <h1>My App</h1>
      <UserPanel />
    </AuthProvider>
  );
}

export default App;
```

## Summary

- `Context.Provider` wraps a subtree and supplies a value to all descendant consumers.
- Providers can be scoped to specific sections of the app, not just the root.
- Nest multiple providers for different domains (auth, theme, notifications).
- Memoize provider values to avoid unnecessary consumer re-renders.
- Nested providers can override context values for subtrees.

## Additional Resources
- [React Docs -- Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React Docs -- Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React Docs -- useContext](https://react.dev/reference/react/useContext)
