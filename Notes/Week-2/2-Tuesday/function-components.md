# Function Components

## Learning Objectives
- Understand function components as the modern default in React
- Compare function components to class components and recognize the advantages
- Apply TypeScript typing patterns to function components

## Why This Matters

If you read older React tutorials, you will encounter class-based components with lifecycle methods like `componentDidMount` and `render()`. Modern React has shifted decisively to **function components**. Every new component you write this week (and in professional work) will be a function component. Understanding why this shift happened -- and how to type function components properly -- sets you up for the rest of the curriculum.

## The Concept

### What Is a Function Component?

A function component is a plain TypeScript function that accepts props as an argument and returns JSX:

```typescript
interface WelcomeProps {
  name: string;
}

function Welcome({ name }: WelcomeProps) {
  return <h1>Welcome, {name}!</h1>;
}
```

That is it. No class, no `extends`, no `render()` method. The function *is* the component.

### Arrow Function Syntax

You can also write components as arrow functions. Both styles are equivalent:

```typescript
// Function declaration:
function Welcome({ name }: WelcomeProps) {
  return <h1>Welcome, {name}!</h1>;
}

// Arrow function:
const Welcome = ({ name }: WelcomeProps) => {
  return <h1>Welcome, {name}!</h1>;
};
```

Teams typically pick one style and stay consistent. Both are fully supported.

### Class Components (for Context)

Before hooks (React 16.8, released February 2019), the only way to use state or lifecycle behavior was through class components:

```typescript
import { Component } from "react";

interface WelcomeProps {
  name: string;
}

interface WelcomeState {
  greeting: string;
}

class Welcome extends Component<WelcomeProps, WelcomeState> {
  constructor(props: WelcomeProps) {
    super(props);
    this.state = { greeting: "Hello" };
  }

  render() {
    return <h1>{this.state.greeting}, {this.props.name}!</h1>;
  }
}
```

Class components are verbose, require understanding of `this` binding, and mix concerns (lifecycle methods, state, rendering) in a single class body.

### Why Function Components Won

| Aspect | Class Components | Function Components |
|---|---|---|
| **Syntax** | Verbose (`class`, `extends`, `render()`) | Concise (plain function) |
| **State** | `this.state` / `this.setState` | `useState` hook |
| **Side Effects** | `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` | `useEffect` hook |
| **`this` Binding** | Required (source of many bugs) | Not needed |
| **Code Reuse** | Mixins, HOCs, render props (complex) | Custom hooks (simple) |
| **Testability** | Harder (need to instantiate class) | Easier (call the function) |
| **Bundle Size** | Larger | Smaller |
| **React Team Recommendation** | Legacy support | Preferred for all new code |

### TypeScript Typing Patterns

#### Typing Props Directly

The most common and recommended pattern:

```typescript
interface TaskCardProps {
  title: string;
  priority: "low" | "medium" | "high";
  onComplete: () => void;
}

function TaskCard({ title, priority, onComplete }: TaskCardProps) {
  return (
    <div className={`task priority-${priority}`}>
      <h3>{title}</h3>
      <button onClick={onComplete}>Complete</button>
    </div>
  );
}
```

#### Using `React.FC` (Know It, But Prefer the Above)

You may see `React.FC` (FunctionComponent) in older codebases:

```typescript
const TaskCard: React.FC<TaskCardProps> = ({ title, priority, onComplete }) => {
  return (
    <div className={`task priority-${priority}`}>
      <h3>{title}</h3>
      <button onClick={onComplete}>Complete</button>
    </div>
  );
};
```

`React.FC` was once popular but has fallen out of favor because:
- It implicitly includes `children` in the props type (even when the component should not accept children).
- It prevents easy use of generics.
- The direct typing pattern is simpler and more explicit.

The React TypeScript Cheatsheet recommends the direct typing pattern.

#### Default Props

Use JavaScript default parameters:

```typescript
interface AlertProps {
  message: string;
  severity?: "info" | "warning" | "error";
}

function Alert({ message, severity = "info" }: AlertProps) {
  return <div className={`alert alert-${severity}`}>{message}</div>;
}
```

#### Generic Components

Function components can be generic -- useful for components that work with different data shapes:

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, index) => <li key={index}>{renderItem(item)}</li>)}</ul>;
}

// Usage:
<List
  items={["React", "TypeScript", "Vite"]}
  renderItem={(item) => <span>{item}</span>}
/>
```

### Component as Values

Because function components are just functions, they can be stored in variables, passed as props, and returned from other functions:

```typescript
const components: Record<string, React.ComponentType> = {
  home: HomePage,
  about: AboutPage,
  dashboard: DashboardPage,
};

function DynamicPage({ pageName }: { pageName: string }) {
  const PageComponent = components[pageName];
  if (!PageComponent) return <NotFoundPage />;
  return <PageComponent />;
}
```

## Code Example

A complete example using modern function component patterns:

```typescript
import { useState } from "react";

interface ToggleProps {
  label: string;
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
}

function Toggle({ label, initialValue = false, onChange }: ToggleProps) {
  const [isOn, setIsOn] = useState<boolean>(initialValue);

  const handleToggle = (): void => {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange?.(newValue); // Optional chaining -- only calls onChange if it exists
  };

  return (
    <button onClick={handleToggle} aria-pressed={isOn}>
      {label}: {isOn ? "ON" : "OFF"}
    </button>
  );
}

function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <Toggle label="Dark Mode" onChange={(v) => console.log("Dark mode:", v)} />
      <Toggle label="Notifications" initialValue={true} />
      <Toggle label="Auto-save" />
    </div>
  );
}

export default SettingsPage;
```

## Summary

- Function components are the modern standard -- plain functions that take props and return JSX.
- Class components still work but are considered legacy; all new code should use function components.
- Type props directly in the function signature rather than using `React.FC`.
- Use default parameters for optional props and generics for reusable data-agnostic components.
- Hooks (covered Wednesday) are what make function components fully capable of managing state and side effects.

## Additional Resources
- [React Docs -- Your First Component](https://react.dev/learn/your-first-component)
- [React TypeScript Cheatsheet -- Function Components](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components)
- [React Docs -- Hooks at a Glance](https://react.dev/reference/react/hooks)
