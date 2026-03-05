# Controlled vs. Uncontrolled Components

## Learning Objectives
- Contrast controlled and uncontrolled form inputs in React
- Implement controlled inputs with TypeScript-typed state
- Understand when uncontrolled inputs are appropriate

## Why This Matters

Forms are the primary way users provide input to web applications. React offers two approaches for managing form inputs: controlled (React state drives the input) and uncontrolled (the DOM drives the input). Choosing correctly impacts data flow predictability, validation strategy, and testability.

## The Concept

### Controlled Components

A **controlled component** is a form element whose value is driven by React state. The component's state is the single source of truth:

```typescript
import { useState, ChangeEvent, FormEvent } from "react";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Submitting:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />
      <button type="submit">Log In</button>
    </form>
  );
}
```

Every keystroke triggers `onChange`, updates state, and React re-renders the input with the new value.

### Uncontrolled Components

An **uncontrolled component** lets the DOM manage the input value. You read the value using a `ref` when you need it:

```typescript
import { useRef, FormEvent } from "react";

function FileUploadForm() {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileInput} />
      <button type="submit">Upload</button>
    </form>
  );
}
```

### Comparison

| Aspect | Controlled | Uncontrolled |
|---|---|---|
| **Value source** | React state | DOM element |
| **Updates** | Every keystroke triggers `onChange` | Value read on demand (via `ref`) |
| **Validation** | Inline, per-keystroke | On submit |
| **Predictability** | High (state = truth) | Lower (DOM = truth) |
| **Use case** | Most form inputs | File inputs, integrations with non-React code |
| **TypeScript typing** | Typed state and events | Typed ref |
| **Recommended** | Yes (default choice) | For specific scenarios |

### When to Use Uncontrolled Components

- **File inputs:** `<input type="file">` cannot be programmatically set, so it is inherently uncontrolled.
- **Integration with non-React libraries:** When a third-party library manages its own DOM state.
- **Performance-critical scenarios:** Large forms where per-keystroke re-renders are expensive (though this is rare with React's batching).

For standard text inputs, selects, and checkboxes, **controlled components are the recommended default**.

### Default Values for Uncontrolled Inputs

Use `defaultValue` (not `value`) for uncontrolled inputs:

```typescript
<input type="text" defaultValue="Initial text" ref={inputRef} />
```

Using `value` without `onChange` on an uncontrolled input will make it read-only.

## Code Example

```typescript
import { useState, ChangeEvent } from "react";

interface FormData {
  username: string;
  bio: string;
  role: string;
}

function ProfileForm() {
  const [form, setForm] = useState<FormData>({ username: "", bio: "", role: "viewer" });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
      <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      <p>Current: {form.username} / {form.role}</p>
    </form>
  );
}

export default ProfileForm;
```

## Summary

- **Controlled** components use React state as the single source of truth; the input's `value` is always driven by state.
- **Uncontrolled** components let the DOM manage the value; you access it via `ref` when needed.
- Controlled components are preferred for most forms because they provide inline validation, predictable data flow, and easier testing.
- Use uncontrolled components for file inputs and non-React library integrations.

## Additional Resources
- [React Docs -- Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [React Docs -- useRef](https://react.dev/reference/react/useRef)
- [React TypeScript Cheatsheet -- Forms and Events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events)
