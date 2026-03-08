# Component Lifecycle

## Learning Objectives
- Map class lifecycle methods to their hooks equivalents
- Understand the mount, update, and unmount phases
- Apply `useEffect` to replicate lifecycle behavior in function components

## Why This Matters

The component lifecycle describes the stages a component goes through from creation to removal. Even though modern React uses hooks instead of lifecycle methods, understanding the lifecycle phases helps you reason about when effects run, when cleanup happens, and how to debug timing-related issues.

## The Concept

### The Three Phases

Every React component goes through three phases:

1. **Mounting:** The component is created and inserted into the DOM for the first time.
2. **Updating:** The component re-renders due to state or prop changes.
3. **Unmounting:** The component is removed from the DOM.

### Class Lifecycle Methods (for Reference)

```typescript
class TaskCard extends Component<TaskCardProps, TaskCardState> {
  // MOUNTING
  constructor(props: TaskCardProps) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
    // Runs once after the component is first rendered to the DOM.
    // Use for: API calls, subscriptions, DOM measurements.
  }

  // UPDATING
  componentDidUpdate(prevProps: TaskCardProps, prevState: TaskCardState) {
    // Runs after every re-render (except the first).
    // Use for: reacting to prop/state changes.
    if (prevProps.taskId !== this.props.taskId) {
      // Fetch new data when taskId changes.
    }
  }

  // UNMOUNTING
  componentWillUnmount() {
    // Runs just before the component is removed from the DOM.
    // Use for: cleanup (cancel timers, unsubscribe, close connections).
  }

  render() {
    return <div>{this.props.title}</div>;
  }
}
```

### Hooks Equivalents

Function components do not have lifecycle methods. Instead, `useEffect` covers all three phases:

#### Mounting: Run Once After First Render

```typescript
useEffect(() => {
  // This runs ONCE after the component mounts.
  console.log("Component mounted");
  fetchData();
}, []); // Empty dependency array = run only on mount
```

#### Updating: Run When Dependencies Change

```typescript
useEffect(() => {
  // This runs whenever 'taskId' changes.
  console.log("taskId changed to:", taskId);
  fetchTaskDetails(taskId);
}, [taskId]); // Dependency array with specific values
```

#### Unmounting: Cleanup Function

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // Cleanup function runs when the component unmounts
  // OR before the effect re-runs on dependency change.
  return () => {
    clearInterval(timer);
    console.log("Timer cleaned up");
  };
}, []);
```

### Complete Lifecycle Mapping

| Phase | Class Method | Hooks Equivalent |
|---|---|---|
| **Mount** | `constructor` | `useState(initialValue)` |
| **Mount** | `componentDidMount` | `useEffect(() => { ... }, [])` |
| **Update** | `componentDidUpdate` | `useEffect(() => { ... }, [deps])` |
| **Unmount** | `componentWillUnmount` | `useEffect` return (cleanup function) |
| **Conditional render** | `shouldComponentUpdate` | `React.memo(Component)` |

### The Execution Order

When a component mounts:

```
1. Component function is called (render phase)
2. React commits the output to the DOM
3. useEffect callbacks run (after paint)
```

When state or props change:

```
1. Component function is called again (render phase)
2. React diffs and commits changes to the DOM
3. useEffect cleanup functions run (from the previous render)
4. useEffect callbacks run (with new values)
```

When a component unmounts:

```
1. useEffect cleanup functions run
2. Component is removed from the DOM
```

### Multiple Effects for Multiple Concerns

Unlike class components (where all mount logic goes in `componentDidMount`), you can have multiple `useEffect` calls -- one per concern:

```typescript
function UserDashboard({ userId }: { userId: number }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Effect 1: Fetch user profile
  useEffect(() => {
    fetchProfile(userId).then(setProfile);
  }, [userId]);

  // Effect 2: Set up notification subscription
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(userId, setNotifications);
    return () => unsubscribe(); // Cleanup
  }, [userId]);

  // Effect 3: Update document title
  useEffect(() => {
    document.title = profile ? `${profile.name} - Dashboard` : "Dashboard";
  }, [profile]);

  return <div>...</div>;
}
```

Each effect is independent, focused, and has its own dependency array and cleanup.

## Code Example

A practical lifecycle demonstration:

```typescript
import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup: clear the interval when isRunning changes or component unmounts
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div>
      <p>Elapsed: {seconds}s</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={() => { setIsRunning(false); setSeconds(0); }}>
        Reset
      </button>
    </div>
  );
}

export default Timer;
```

## Summary

- Components go through three phases: **mount**, **update**, and **unmount**.
- Class lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) map directly to `useEffect` with different dependency arrays.
- `useEffect` with an empty array runs on mount; with dependencies, it runs on update; its return function runs on cleanup/unmount.
- Use **multiple effects** to separate concerns instead of cramming everything into one.

## Additional Resources
- [React Docs -- Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React Docs -- Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [React Docs -- You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
