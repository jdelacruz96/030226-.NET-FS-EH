# React Component Architecture

## Learning Objectives
- Apply component composition patterns to organize a React application
- Understand separation of concerns in the context of React components
- Design a folder structure that scales for team projects

## Why This Matters

A React application of any meaningful size will have dozens or hundreds of components. Without a clear architectural strategy, the codebase becomes difficult to navigate, test, and maintain. This reading covers the composition patterns and folder structures that professional teams use to keep React projects organized.

## The Concept

### Composition Over Inheritance

React does not use class inheritance to build complex components. Instead, it relies on **composition** -- combining simple components to create complex ones.

```typescript
// Composition: building a page from smaller components
function DashboardPage() {
  return (
    <div className="dashboard">
      <PageHeader title="Dashboard" />
      <div className="dashboard-content">
        <StatsSummary />
        <TaskList />
        <ActivityFeed />
      </div>
      <PageFooter />
    </div>
  );
}
```

Each component (`PageHeader`, `StatsSummary`, `TaskList`, etc.) is independent, testable, and reusable. None of them inherits from a shared base class.

### The Children Pattern

The `children` prop is the foundation of composition. It lets a component wrap arbitrary content:

```typescript
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage -- the Card component does not know or care what its children are:
<Card title="Team Members">
  <UserList />
</Card>

<Card title="Recent Activity">
  <ActivityFeed />
</Card>
```

### Separation of Concerns in React

Traditional web development separates concerns by file type: HTML for structure, CSS for styles, JavaScript for behavior. React separates concerns **by component** -- each component bundles its own structure, logic, and styles:

```
Traditional:                      React:
  structure.html                    TaskCard.tsx (JSX + logic)
  styles.css                        TaskCard.module.css (styles)
  behavior.js                       TaskCard.test.tsx (tests)
```

This is not a violation of separation of concerns -- it is a different axis of separation. Instead of separating by technology, React separates by **feature** or **UI element**.

### Component Categories

Components in a professional project typically fall into these categories:

| Category | Purpose | Example |
|---|---|---|
| **Page components** | Represent a full route/page | `DashboardPage`, `SettingsPage` |
| **Feature components** | Implement a specific feature | `TaskList`, `UserProfile` |
| **UI components** | Reusable, generic UI elements | `Button`, `Card`, `Modal`, `Badge` |
| **Layout components** | Define page structure | `MainLayout`, `Sidebar`, `Header` |

### Folder Structure Patterns

#### Flat Structure (Small Projects)

```
src/
  components/
    Button.tsx
    Card.tsx
    Header.tsx
    TaskCard.tsx
    TaskList.tsx
  pages/
    HomePage.tsx
    DashboardPage.tsx
  App.tsx
  main.tsx
```

Suitable for projects with fewer than 20 components.

#### Feature-Based Structure (Medium to Large Projects)

```
src/
  features/
    tasks/
      components/
        TaskCard.tsx
        TaskList.tsx
        TaskFilter.tsx
      hooks/
        useTasks.ts
      types/
        task.ts
      TaskPage.tsx
    auth/
      components/
        LoginForm.tsx
        SignupForm.tsx
      hooks/
        useAuth.ts
      types/
        user.ts
      LoginPage.tsx
  shared/
    components/
      Button.tsx
      Card.tsx
      Modal.tsx
    hooks/
      useLocalStorage.ts
    types/
      common.ts
  layouts/
    MainLayout.tsx
    AuthLayout.tsx
  App.tsx
  main.tsx
```

This structure groups related code by feature, making it easy to find, modify, and delete an entire feature without hunting through a flat list.

### Component Design Principles

**1. Single Responsibility:** Each component should do one thing well.

```typescript
// Good -- focused on rendering a single task:
function TaskCard({ title, status }: TaskCardProps) {
  return (
    <div className="task-card">
      <h3>{title}</h3>
      <StatusBadge status={status} />
    </div>
  );
}

// Avoid -- a component that fetches, filters, sorts, AND renders:
// function TaskEverything() { ... }
```

**2. Keep Components Small:** If a component exceeds 100-150 lines, consider splitting it.

**3. Co-locate Related Files:** Keep a component's styles, tests, and types near the component itself:

```
TaskCard/
  TaskCard.tsx
  TaskCard.module.css
  TaskCard.test.tsx
  index.ts
```

**4. Use an Index File for Clean Imports:**

```typescript
// TaskCard/index.ts
export { default } from "./TaskCard";

// Usage elsewhere:
import TaskCard from "./TaskCard"; // Resolves to TaskCard/index.ts
```

## Code Example

A small application demonstrating compositional architecture:

```typescript
// shared/components/Card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// features/tasks/components/TaskItem.tsx
interface TaskItemProps {
  title: string;
  completed: boolean;
}

export function TaskItem({ title, completed }: TaskItemProps) {
  return (
    <li className={completed ? "completed" : ""}>
      {title}
    </li>
  );
}

// features/tasks/TaskPage.tsx
import { Card } from "../../shared/components/Card";
import { TaskItem } from "./components/TaskItem";

export function TaskPage() {
  const tasks = [
    { id: 1, title: "Architect components", completed: true },
    { id: 2, title: "Implement features", completed: false },
  ];

  return (
    <Card title="My Tasks">
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} title={task.title} completed={task.completed} />
        ))}
      </ul>
    </Card>
  );
}
```

## Summary

- React uses **composition** (not inheritance) to build complex UIs from simple components.
- The `children` prop enables flexible, wrapper-style composition.
- Separate concerns **by component/feature**, not by file type.
- Use a **feature-based folder structure** as projects grow.
- Keep components focused (single responsibility), small, and co-located with their related files.

## Additional Resources
- [React Docs -- Thinking in React](https://react.dev/learn/thinking-in-react)
- [React Docs -- Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Bulletproof React -- Project Structure](https://github.com/alan2207/bulletproof-react)
