# Props and State

## Learning Objectives
- Differentiate props from state and understand each one's role
- Explain unidirectional data flow through props
- Define typed interfaces for props and state in TypeScript

## Why This Matters

Props and state are the two mechanisms that control what a React component renders. Confusing them leads to bugs -- mutating props, duplicating state, or passing data in the wrong direction. A clear mental model of props vs. state is essential for writing predictable, maintainable components.

## The Concept

### Props: Data Passed In

**Props** (short for "properties") are the inputs a component receives from its parent. They are:

- **Read-only:** A component must never modify its own props.
- **Passed from parent to child:** Data flows downward in the component tree.
- **Typed with interfaces:** TypeScript enforces the expected shape.

```typescript
interface GreetingProps {
  name: string;
  role: string;
}

function Greeting({ name, role }: GreetingProps) {
  // props are read-only -- you cannot do: name = "someone else";
  return <p>{name} is a {role}.</p>;
}

// Parent passes props:
<Greeting name="Jordan" role="developer" />
```

### State: Data Managed Internally

**State** is data that a component **owns and manages itself**. When state changes, React re-renders the component. State is:

- **Mutable via setter functions:** Updated with `setState` (from `useState`).
- **Private to the component:** Other components cannot access it directly.
- **The trigger for re-renders:** Changing state is the primary way to make the UI update.

```typescript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Props vs. State at a Glance

| Aspect | Props | State |
|---|---|---|
| **Source** | Passed from parent | Created within the component |
| **Mutability** | Read-only (immutable to the receiver) | Mutable via setter function |
| **Purpose** | Configure a component from outside | Track internal, changing data |
| **Triggers re-render** | Only when the parent re-renders with new values | Yes, directly |
| **Analogous to** | Function parameters | Local variables that persist across renders |

### Thinking About It: Function Parameters vs. Local Variables

A component is a function. Props are its parameters; state is its local variables that React remembers between calls:

```typescript
// Think of it this way:
function TaskCard(props: TaskCardProps) {
  // props = function parameters (from the caller)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // state = local variable (owned by this function, remembered by React)

  return (
    <div>
      <h3>{props.title}</h3>
      {isExpanded && <p>{props.description}</p>}
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Collapse" : "Expand"}
      </button>
    </div>
  );
}
```

### When to Use Props vs. State

| Question | If Yes: |
|---|---|
| Does this data come from a parent component? | **Props** |
| Does this data change over time due to user interaction? | **State** |
| Is this data needed only by this component? | **State** |
| Does this data need to be shared with child components? | **State** in the parent, then passed as **props** |
| Is this data static configuration? | **Props** |

### Data Flow: Props Down, Events Up

React enforces a **unidirectional (one-way) data flow:**

1. A parent holds state.
2. The parent passes data **down** to children as props.
3. When a child needs to communicate **up**, it calls a callback function that the parent provided as a prop.

```typescript
interface TaskItemProps {
  title: string;
  onComplete: (title: string) => void;
}

function TaskItem({ title, onComplete }: TaskItemProps) {
  return (
    <div>
      <span>{title}</span>
      <button onClick={() => onComplete(title)}>Mark Complete</button>
    </div>
  );
}

function TaskBoard() {
  const handleComplete = (title: string): void => {
    console.log(`Completed: ${title}`);
  };

  return (
    <div>
      <TaskItem title="Learn Props" onComplete={handleComplete} />
      <TaskItem title="Learn State" onComplete={handleComplete} />
    </div>
  );
}
```

### Common Mistakes

**1. Duplicating props into state:**

```typescript
// Bad -- unnecessary duplication:
function BadComponent({ initialName }: { initialName: string }) {
  const [name, setName] = useState<string>(initialName);
  // 'name' will NOT update when 'initialName' changes after mount!
  return <p>{name}</p>;
}

// Good -- just use the prop directly:
function GoodComponent({ name }: { name: string }) {
  return <p>{name}</p>;
}
```

Only copy a prop into state when you genuinely need to decouple from the parent (e.g., a form field initialized from a prop but independently edited).

**2. Mutating props:**

```typescript
// NEVER do this:
function BadCard(props: { items: string[] }) {
  props.items.push("new item"); // Mutating a prop -- breaks React's model
  return <ul>{props.items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
}
```

## Code Example

A component that demonstrates both props and state working together:

```typescript
import { useState } from "react";

interface ProfileCardProps {
  name: string;
  title: string;
}

function ProfileCard({ name, title }: ProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  return (
    <div className="profile-card">
      <h3>{name}</h3>
      <p>{title}</p>
      <button onClick={() => setIsFollowing(!isFollowing)}>
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}

function TeamPage() {
  return (
    <div>
      <h1>Our Team</h1>
      <ProfileCard name="Alex" title="Front-End Engineer" />
      <ProfileCard name="Jordan" title="DevOps Lead" />
      <ProfileCard name="Taylor" title="UX Designer" />
    </div>
  );
}

export default TeamPage;
```

Each `ProfileCard` receives `name` and `title` as props (from the parent) and manages `isFollowing` as state (internal, interactive).

## Summary

- **Props** are external inputs passed from parent to child; they are read-only.
- **State** is internal data managed by the component; updating it triggers a re-render.
- Data flows **downward** via props; events flow **upward** via callback props.
- Do not duplicate props into state unnecessarily. Never mutate props.
- TypeScript interfaces enforce the shape of both props and state.

## Additional Resources
- [React Docs -- Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React Docs -- State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React Docs -- Thinking in React](https://react.dev/learn/thinking-in-react)
