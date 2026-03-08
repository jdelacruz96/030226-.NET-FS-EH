# React Forms

## Learning Objectives
- Build controlled forms with multiple input types in TypeScript
- Handle text, select, checkbox, and radio inputs
- Manage form state with a single handler using computed property names

## Why This Matters

Forms are the core interaction point for data entry in web applications -- login screens, registration flows, search bars, settings pages, and task creation dialogs. React's controlled component pattern gives you full programmatic control over every input value, enabling real-time validation, conditional fields, and state-driven UI.

## The Concept

### Single Handler for Multiple Inputs

Instead of writing a separate handler for each input, use the input's `name` attribute with computed property names:

```typescript
import { useState, ChangeEvent, FormEvent } from "react";

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  isUrgent: boolean;
}

function TaskForm() {
  const [form, setForm] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    isUrgent: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Submitted:", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Task title" />
      <textarea name="description" value={form.description} onChange={handleChange} />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <label>
        <input name="isUrgent" type="checkbox" checked={form.isUrgent} onChange={handleChange} />
        Urgent
      </label>
      <button type="submit">Create Task</button>
    </form>
  );
}
```

### Input Types Reference

| Input Type | Value Prop | Event Property | TypeScript Event Type |
|---|---|---|---|
| `text` | `value` | `e.target.value` | `ChangeEvent<HTMLInputElement>` |
| `email` | `value` | `e.target.value` | `ChangeEvent<HTMLInputElement>` |
| `password` | `value` | `e.target.value` | `ChangeEvent<HTMLInputElement>` |
| `number` | `value` | `Number(e.target.value)` | `ChangeEvent<HTMLInputElement>` |
| `checkbox` | `checked` | `e.target.checked` | `ChangeEvent<HTMLInputElement>` |
| `radio` | `checked` | `e.target.value` | `ChangeEvent<HTMLInputElement>` |
| `textarea` | `value` | `e.target.value` | `ChangeEvent<HTMLTextAreaElement>` |
| `select` | `value` | `e.target.value` | `ChangeEvent<HTMLSelectElement>` |

### Radio Buttons

Radio buttons share the same `name` and are controlled by matching `value` to state:

```typescript
<div>
  <label>
    <input
      type="radio"
      name="category"
      value="bug"
      checked={form.category === "bug"}
      onChange={handleChange}
    />
    Bug
  </label>
  <label>
    <input
      type="radio"
      name="category"
      value="feature"
      checked={form.category === "feature"}
      onChange={handleChange}
    />
    Feature
  </label>
</div>
```

### Multi-Step Forms

For forms with multiple steps, manage the step index alongside the form data:

```typescript
const [step, setStep] = useState<number>(1);
const [form, setForm] = useState<MultiStepFormData>(initialData);

function nextStep(): void { setStep((s) => s + 1); }
function prevStep(): void { setStep((s) => s - 1); }
```

Render different fieldsets based on the current step using conditional rendering patterns.

### Handling Submission

Forms should prevent the default browser submit behavior and process data in React:

```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) throw new Error("Submission failed");
    setForm(initialFormData); // Reset form
  } catch (error) {
    setError((error as Error).message);
  } finally {
    setIsSubmitting(false);
  }
};
```

## Code Example

```typescript
import { useState, ChangeEvent, FormEvent } from "react";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  subscribe: boolean;
}

function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "", email: "", subject: "general", message: "", subscribe: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form data:", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <select name="subject" value={form.subject} onChange={handleChange}>
        <option value="general">General</option>
        <option value="support">Support</option>
        <option value="feedback">Feedback</option>
      </select>
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" />
      <label>
        <input name="subscribe" type="checkbox" checked={form.subscribe} onChange={handleChange} />
        Subscribe to updates
      </label>
      <button type="submit">Send</button>
    </form>
  );
}

export default ContactPage;
```

## Summary

- Use **controlled components** with `value`, `checked`, and `onChange` for all form inputs.
- A single `handleChange` function with computed property names (`[name]: value`) scales to any number of fields.
- Always call `e.preventDefault()` in the `onSubmit` handler.
- TypeScript event types (`ChangeEvent`, `FormEvent`) ensure type safety across input types.

## Additional Resources
- [React Docs -- Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [React TypeScript Cheatsheet -- Forms and Events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events)
- [MDN -- HTML Form Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
