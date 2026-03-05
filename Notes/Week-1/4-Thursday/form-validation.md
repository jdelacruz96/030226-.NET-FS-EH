# Form Validation

## Learning Objectives
- Implement inline validation using controlled component state
- Display validation errors conditionally
- Understand client-side vs. server-side validation roles

## Why This Matters

Users make mistakes -- they leave fields empty, type invalid emails, or submit incomplete data. Form validation provides immediate feedback, improving user experience and reducing server load. React's controlled component model makes validation straightforward because you have access to every field's value at all times.

## The Concept

### Client-Side vs. Server-Side Validation

| Validation Type | Purpose | When It Runs |
|---|---|---|
| **Client-side** | Immediate UX feedback | On change, on blur, or on submit |
| **Server-side** | Security and data integrity | On form submission (API request) |

**Both are required.** Client-side validation improves UX but can be bypassed. Server-side validation is the true gatekeeper.

### Validation Strategies

**On Submit:** Validate all fields when the form is submitted.

**On Blur:** Validate a field when the user leaves it (loses focus).

**On Change:** Validate as the user types (use sparingly -- can be annoying for incomplete input).

### Basic Validation Pattern

```typescript
import { useState, FormEvent } from "react";

interface FormErrors {
  name?: string;
  email?: string;
}

function RegistrationForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid. Submitting:", { name, email });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
```

### Validation on Blur

```typescript
const [touched, setTouched] = useState<Record<string, boolean>>({});

const handleBlur = (field: string): void => {
  setTouched((prev) => ({ ...prev, [field]: true }));
  setErrors(validate());
};

// Only show errors for fields the user has interacted with:
{touched.name && errors.name && <p className="error">{errors.name}</p>}
```

### Generic Validation Hook

```typescript
interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

function useFormValidation(
  values: Record<string, string>,
  rules: Record<string, ValidationRule[]>
): { errors: Record<string, string>; isValid: boolean; validate: () => Record<string, string> } {
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    for (const [field, fieldRules] of Object.entries(rules)) {
      for (const rule of fieldRules) {
        if (!rule.test(values[field] || "")) {
          newErrors[field] = rule.message;
          break; // Show first error only
        }
      }
    }

    return newErrors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid, validate };
}
```

### Form Libraries (Awareness)

For complex forms, dedicated libraries handle validation, touched state, and submission:

| Library | Approach |
|---|---|
| **React Hook Form** | Minimal re-renders, uncontrolled inputs with validation |
| **Formik** | Controlled inputs with built-in validation schema support |
| **Yup / Zod** | Schema-based validation (works with any form library) |

These are beyond this week's scope but are commonly used in production.

## Code Example

```typescript
import { useState, FormEvent } from "react";

interface Errors {
  username?: string;
  password?: string;
}

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validate = (): Errors => {
    const errs: Errors = {};
    if (!username.trim()) errs.username = "Username is required.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    return errs;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) return <p>Login successful. Welcome, {username}!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      <div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
```

## Summary

- Validate on submit (most common), on blur (good UX), or on change (sparingly).
- Store errors in a typed state object and display them conditionally next to each field.
- Client-side validation improves UX but never replaces server-side validation.
- Custom validation hooks and libraries (React Hook Form, Formik) scale for complex forms.

## Additional Resources
- [React Docs -- Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation (Schema Validation)](https://zod.dev/)
