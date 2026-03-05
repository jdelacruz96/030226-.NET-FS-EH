# Higher-Order Components

## Learning Objectives
- Explain the HOC pattern and its purpose
- Compare HOCs to hooks for logic reuse
- Read and write typed HOC signatures in TypeScript

## Why This Matters

Higher-Order Components (HOCs) are a pattern you will encounter in existing codebases -- especially those built before hooks. Understanding HOCs helps you read legacy code, maintain older components, and recognize when hooks offer a simpler alternative.

## The Concept

### What Is a Higher-Order Component?

A Higher-Order Component is a **function that takes a component and returns a new component** with enhanced behavior. It is a pattern, not a React API.

```typescript
function withLogging<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function LoggedComponent(props: P) {
    console.log("Rendering:", WrappedComponent.name, props);
    return <WrappedComponent {...props} />;
  };
}

// Usage:
const LoggedTaskCard = withLogging(TaskCard);
<LoggedTaskCard title="Deploy" priority="high" />
```

The naming convention `with___` is standard for HOCs (`withAuth`, `withTheme`, `withRouter`).

### A Practical Example: Authorization

```typescript
interface WithAuthProps {
  user: { name: string; role: string } | null;
}

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P & WithAuthProps>) {
  return function AuthenticatedComponent(props: P) {
    const user = useAuth(); // Assume a custom hook

    if (!user) {
      return <p>Please log in to access this content.</p>;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage:
interface DashboardProps extends WithAuthProps {
  title: string;
}

function Dashboard({ title, user }: DashboardProps) {
  return <h1>{title} - Welcome, {user?.name}</h1>;
}

const ProtectedDashboard = withAuth(Dashboard);
```

### HOCs vs. Hooks

| Aspect | HOCs | Hooks |
|---|---|---|
| **Mechanism** | Wrap a component | Call inside a component |
| **Component tree** | Adds wrapper layers | No extra layers |
| **Readability** | Can obscure the component hierarchy | Logic is inline and visible |
| **TypeScript typing** | Complex generic signatures | Straightforward return types |
| **Composition** | Can lead to "wrapper hell" | Chain hooks naturally |
| **When to use** | Legacy codebases, decorator-style patterns | New code (preferred) |

### The Same Logic as a Hook

The authorization logic above, reimplemented as a hook:

```typescript
function useRequireAuth(): { user: User; isLoading: boolean } | null {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return null;
  return { user, isLoading };
}

function Dashboard({ title }: { title: string }) {
  const auth = useRequireAuth();
  if (!auth) return <p>Please log in.</p>;
  return <h1>{title} - Welcome, {auth.user.name}</h1>;
}
```

The hook version is simpler, more readable, and does not add wrapper elements to the component tree.

### When HOCs Still Make Sense

- **Decorator patterns:** When you want to apply cross-cutting concerns (logging, error boundaries) without modifying the component's signature.
- **Third-party library integration:** Some libraries (e.g., React Router's `withRouter`) use HOCs.
- **Legacy codebase maintenance:** Rewriting all HOCs to hooks is not always practical.

## Summary

- A HOC is a function that wraps a component with additional behavior.
- HOCs were the primary pattern for logic reuse before hooks.
- Hooks are simpler, more composable, and preferred for new code.
- Understanding HOCs is important for reading and maintaining existing codebases.

## Additional Resources
- [React Legacy Docs -- Higher-Order Components](https://legacy.reactjs.org/docs/higher-order-components.html)
- [React Docs -- Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React TypeScript Cheatsheet -- HOC](https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example)
