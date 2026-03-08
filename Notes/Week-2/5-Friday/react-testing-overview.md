# React Testing Overview

## Learning Objectives
- Understand the testing pyramid for React applications
- Distinguish between unit tests, integration tests, and end-to-end tests
- Recognize the roles of Jest, React Testing Library, and Cypress/Playwright

## Why This Matters

Code without tests is code you cannot refactor with confidence. Testing ensures that components render correctly, user interactions produce expected results, and regressions are caught before deployment. This reading covers what to test, how to think about testing React components, and which tools to use.

## The Concept

### The Testing Pyramid

```
           /\
          /  \       End-to-End (E2E)
         /    \      Few, slow, high confidence
        /------\
       /        \    Integration
      /          \   Some, moderate speed
     /------------\
    /              \  Unit
   /                \ Many, fast, focused
  /__________________\
```

| Layer | What It Tests | Speed | Confidence | Tools |
|---|---|---|---|---|
| **Unit** | Individual functions, hooks, utilities | Fast | Focused | Jest, Vitest |
| **Integration** | Components interacting together | Moderate | High | React Testing Library |
| **E2E** | Full user flows in a real browser | Slow | Highest | Cypress, Playwright |

### What to Test in React

| Test This | Why |
|---|---|
| Does the component render without crashing? | Basic smoke test |
| Does it display the correct content given props? | Verifies data flow |
| Does it respond to user interactions correctly? | Verifies behavior |
| Does it handle edge cases (empty data, errors)? | Prevents regressions |

### What NOT to Test

- Implementation details (internal state variable names, private functions)
- Third-party library behavior (React Router works, `fetch` works)
- CSS styling (unless specific visual behavior matters)

### React Testing Library Philosophy

React Testing Library encourages testing from the user's perspective:

> "The more your tests resemble the way your software is used, the more confidence they can give you."

This means:
- Query elements the way users find them: by text, label, role, placeholder.
- Simulate real user interactions: clicks, typing, form submission.
- Assert on visible output, not internal state.

### Jest / Vitest: The Test Runner

```typescript
// math.test.ts
import { add } from "./math";

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("handles negative numbers", () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

### React Testing Library: Component Tests

```typescript
// TaskCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard";

describe("TaskCard", () => {
  it("renders the task title", () => {
    render(<TaskCard title="Build feature" completed={false} />);
    expect(screen.getByText("Build feature")).toBeInTheDocument();
  });

  it("shows completed styling when completed", () => {
    render(<TaskCard title="Done task" completed={true} />);
    const element = screen.getByText("Done task");
    expect(element).toHaveStyle({ textDecoration: "line-through" });
  });

  it("calls onDelete when delete button is clicked", () => {
    const handleDelete = jest.fn();
    render(<TaskCard title="Task" completed={false} onDelete={handleDelete} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
```

### Key Queries

| Query | Use When |
|---|---|
| `getByText` | Finding by visible text |
| `getByRole` | Finding by ARIA role (button, heading, textbox) |
| `getByLabelText` | Finding form inputs by their label |
| `getByPlaceholderText` | Finding inputs by placeholder |
| `getByTestId` | Last resort -- finding by `data-testid` attribute |

### Testing Hooks

Use `renderHook` from React Testing Library:

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("starts with the initial value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments the count", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

### Project Setup

For a Vite + React project:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vite.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
```

## Summary

- Test from the **user's perspective** -- query by text, role, and label, not internal state.
- Use the **testing pyramid**: many unit tests, some integration tests, few E2E tests.
- **React Testing Library** + **Vitest/Jest** is the standard stack for component testing.
- Test rendering, user interactions, and edge cases; avoid testing implementation details.

## Additional Resources
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
