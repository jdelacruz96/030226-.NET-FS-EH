# Error Boundaries

## Learning Objectives
- Understand error boundaries as a React mechanism for catching render errors
- Implement an error boundary using a class component (the only remaining class requirement)
- Apply error boundaries strategically in a component tree

## Why This Matters

When a component throws an error during rendering, React unmounts the entire component tree by default -- the user sees a blank screen. Error boundaries catch these errors, display a fallback UI, and keep the rest of the application functional. They are essential for production applications.

## The Concept

### What Is an Error Boundary?

An error boundary is a React component that catches JavaScript errors in its child component tree during rendering, lifecycle methods, and constructors. It then displays a fallback UI instead of crashing the entire application.

### Why a Class Component?

Error boundaries are the one case where class components are still required. React does not yet provide a hooks-based API for `componentDidCatch` or `getDerivedStateFromError`. This is the only class component you need to write in modern React.

### Implementation

```typescript
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Usage

Wrap sections of your application that should gracefully handle errors:

```typescript
function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<p>Something went wrong loading the dashboard.</p>}>
        <Dashboard />
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>Unable to load the sidebar.</p>}>
        <Sidebar />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
```

If `Dashboard` throws an error during rendering, the fallback UI appears, but `Header`, `Sidebar`, and `Footer` remain functional.

### Granularity Strategy

Place error boundaries at different levels for different purposes:

| Level | Purpose | Example |
|---|---|---|
| **App root** | Catch-all; prevent total white screen | `<ErrorBoundary><App /></ErrorBoundary>` |
| **Route level** | Isolate page failures | Wrap each route's component |
| **Feature level** | Isolate individual features | Wrap a widget or data-heavy section |
| **Component level** | Isolate unstable third-party components | Wrap a specific library component |

### What Error Boundaries Do NOT Catch

- Event handler errors (use `try/catch` in the handler)
- Asynchronous code (promises, `setTimeout`)
- Server-side rendering errors
- Errors thrown in the error boundary itself

### Using a Library: react-error-boundary

The `react-error-boundary` library provides a function component wrapper with additional features:

```typescript
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Dashboard />
    </ErrorBoundary>
  );
}
```

## Code Example

```typescript
import { Component, ErrorInfo, ReactNode, useState } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Boundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <p>An error occurred.</p>;
    }
    return this.props.children;
  }
}

// A component that might throw:
function RiskyWidget() {
  const [shouldError, setShouldError] = useState<boolean>(false);
  if (shouldError) throw new Error("Widget crashed!");
  return <button onClick={() => setShouldError(true)}>Break This Widget</button>;
}

function App() {
  return (
    <div>
      <h1>App</h1>
      <ErrorBoundary fallback={<p>Widget failed. The rest of the app still works.</p>}>
        <RiskyWidget />
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

## Summary

- Error boundaries catch render-time errors in child components and display fallback UI.
- They require a class component with `getDerivedStateFromError` and optionally `componentDidCatch`.
- Place boundaries at app, route, feature, or component level depending on your isolation needs.
- They do NOT catch event handler, async, or server-side errors.

## Additional Resources
- [React Docs -- Catching Rendering Errors with Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [react-error-boundary Library](https://github.com/bvaughn/react-error-boundary)
- [React Docs -- componentDidCatch](https://react.dev/reference/react/Component#componentdidcatch)
