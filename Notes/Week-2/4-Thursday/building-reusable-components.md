# Building Reusable Components

## Learning Objectives
- Design components with flexible, well-typed APIs
- Apply composition, variant props, and polymorphic patterns
- Build a small component library mindset

## Why This Matters

Reusable components reduce duplication, enforce consistency, and speed up development. A well-designed `Button`, `Card`, or `Modal` component serves the entire application and evolves without breaking consumers. Thinking about reusability from the start saves significant refactoring later.

## The Concept

### Designing a Reusable API

A reusable component should be:

- **Composable:** Accept `children` for flexible content.
- **Configurable:** Expose props for variants, sizes, and behavior.
- **Typed:** Use TypeScript to document the API and catch misuse.
- **Accessible:** Include ARIA attributes and keyboard support.

### Variant Props

Use union types to define component variants:

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ variant = "primary", size = "medium", disabled = false, onClick, children }: ButtonProps) {
  const className = `btn btn-${variant} btn-${size}`;
  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

// Usage:
<Button variant="danger" size="small" onClick={handleDelete}>Delete</Button>
<Button>Default Primary Medium</Button>
```

### Extending Native HTML Props

Allow consumers to pass any valid HTML attribute:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, id, ...rest }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="input-group">
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...rest} className={error ? "input-error" : ""} />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

// Usage -- all standard input props are available:
<Input label="Email" type="email" required placeholder="you@example.com" error={errors.email} />
```

### The Children Pattern for Composition

Components that accept `children` are inherently more reusable:

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}

// Reused with any content:
<Card><UserProfile /></Card>
<Card><TaskList /></Card>
<Card className="highlighted"><ImportantNotice /></Card>
```

### Compound Components

For related components that work together (like `Tabs` and `TabPanel`), create a compound component API:

```typescript
interface TabsProps {
  children: React.ReactNode;
}

function Tabs({ children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

function Tab({ index, children }: { index: number; children: React.ReactNode }) {
  const { activeIndex, setActiveIndex } = useTabsContext();
  return (
    <button
      role="tab"
      aria-selected={activeIndex === index}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
}

function TabPanel({ index, children }: { index: number; children: React.ReactNode }) {
  const { activeIndex } = useTabsContext();
  if (activeIndex !== index) return null;
  return <div role="tabpanel">{children}</div>;
}

// Usage:
<Tabs>
  <TabList>
    <Tab index={0}>Overview</Tab>
    <Tab index={1}>Details</Tab>
  </TabList>
  <TabPanel index={0}><Overview /></TabPanel>
  <TabPanel index={1}><Details /></TabPanel>
</Tabs>
```

### Forwarding Refs

For components that wrap native elements, use `forwardRef` so consumers can access the underlying DOM node:

```typescript
import { forwardRef } from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, ...rest }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...rest} />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
```

## Code Example

```typescript
interface AlertProps {
  severity: "info" | "success" | "warning" | "error";
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

function Alert({ severity, title, onClose, children }: AlertProps) {
  return (
    <div className={`alert alert-${severity}`} role="alert">
      <div className="alert-content">
        {title && <strong>{title}: </strong>}
        {children}
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close alert">
          X
        </button>
      )}
    </div>
  );
}

// Usage:
<Alert severity="error" title="Validation Error" onClose={() => setShowError(false)}>
  Please fill in all required fields.
</Alert>
<Alert severity="info">Your session will expire in 5 minutes.</Alert>

export default Alert;
```

## Summary

- Reusable components expose a **typed, configurable API** with variant props, defaults, and `children`.
- Extend native HTML attributes (`React.InputHTMLAttributes`, etc.) to let consumers pass standard props.
- Use **compound components** for tightly related component groups.
- Forward refs to give consumers access to underlying DOM elements.

## Additional Resources
- [React Docs -- Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React Docs -- forwardRef](https://react.dev/reference/react/forwardRef)
- [React TypeScript Cheatsheet -- Component Patterns](https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase)
