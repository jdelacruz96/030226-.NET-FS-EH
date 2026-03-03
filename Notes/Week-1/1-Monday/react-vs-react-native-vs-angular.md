# React vs. React Native vs. Angular

## Learning Objectives
- Compare React, React Native, and Angular across use cases, architecture, and learning curve
- Understand when to choose each technology
- Recognize the architectural differences between a library (React) and a framework (Angular)

## Why This Matters

In enterprise environments, you will encounter teams using different technologies. Understanding the trade-offs between React, React Native, and Angular helps you make informed decisions during project kickoff, participate in technology selection discussions, and appreciate why your organization may have chosen one over another. This comparison also reinforces the library-vs-framework distinction covered in today's earlier reading.

## The Concept

### React (React DOM)

**What it is:** A JavaScript library for building web user interfaces.

**Key characteristics:**
- **Type:** Library (UI rendering only)
- **Platform:** Web (browser)
- **Language:** JavaScript or TypeScript (TSX)
- **Rendering:** Virtual DOM, declarative components
- **Architecture:** Unopinionated -- you choose your own router, state manager, HTTP client, and folder structure
- **Maintained by:** Meta (Facebook)

```typescript
// A React web component:
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
```

### React Native

**What it is:** A framework for building native mobile applications using React's component model.

**Key characteristics:**
- **Type:** Framework (more opinionated than React DOM)
- **Platform:** iOS and Android (native mobile)
- **Language:** JavaScript or TypeScript (TSX)
- **Rendering:** Translates components to **native platform UI elements** (not a WebView)
- **Architecture:** Uses the same component model and hooks as React, but renders native views instead of HTML
- **Maintained by:** Meta (Facebook)

```typescript
// A React Native component:
import { View, Text, StyleSheet } from "react-native";

interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  text: { fontSize: 24, fontWeight: "bold" },
});
```

**Key difference from React DOM:** React Native does not use HTML elements (`div`, `p`, `span`). Instead, it uses platform primitives (`View`, `Text`, `Image`) that map to native iOS and Android controls.

### Angular

**What it is:** A full-featured framework for building web applications.

**Key characteristics:**
- **Type:** Framework (highly opinionated, batteries-included)
- **Platform:** Web (browser)
- **Language:** TypeScript (required, not optional)
- **Rendering:** Real DOM with change detection, declarative templates
- **Architecture:** Opinionated -- includes a built-in router, HTTP client, form handling, dependency injection, and a prescribed module/component structure
- **Maintained by:** Google

```typescript
// An Angular component:
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-greeting",
  template: `<h1>Hello, {{ name }}!</h1>`,
})
export class GreetingComponent {
  @Input() name: string = "";
}
```

### Detailed Comparison

| Aspect | React (DOM) | React Native | Angular |
|---|---|---|---|
| **Category** | Library | Framework | Framework |
| **Platform** | Web | iOS, Android | Web |
| **Language** | JS or TS (optional) | JS or TS (optional) | TypeScript (required) |
| **DOM** | Virtual DOM | Native views (no DOM) | Real DOM with change detection |
| **Routing** | Add React Router | React Navigation | Built-in Angular Router |
| **HTTP** | Add Axios or Fetch | Add Axios or Fetch | Built-in HttpClient |
| **State Management** | Context, Redux, Zustand | Same as React | Services + RxJS (built-in) |
| **Styling** | CSS Modules, styled-components | StyleSheet API | Component-scoped CSS |
| **Learning Curve** | Moderate (fewer concepts) | Moderate (React + mobile APIs) | Steeper (more built-in concepts) |
| **Bundle Size** | Smaller (library only) | N/A (native binary) | Larger (full framework) |
| **Community** | Largest | Large | Large |
| **Flexibility** | Maximum | High | Moderate (conventions enforced) |
| **Ideal For** | SPAs, dashboards, interactive UIs | Cross-platform mobile apps | Enterprise-scale web applications |

### When to Choose Each

#### Choose React When:
- You are building a web application (SPA or multi-route app)
- You want flexibility to choose your own tools and architecture
- Your team values a smaller library with a focused API
- You want the largest ecosystem of third-party packages

#### Choose React Native When:
- You need to build native mobile apps for iOS and Android
- You want to share business logic and component patterns with a React web team
- You need native performance (not a hybrid WebView app)
- Your team already knows React

#### Choose Angular When:
- You are building a large-scale enterprise web application with many developers
- You want a batteries-included framework with built-in solutions for routing, HTTP, forms, and dependency injection
- Your organization prefers strong conventions over flexibility
- Your team is comfortable with TypeScript, decorators, and RxJS

### The "Learn Once, Write Anywhere" Philosophy

React and React Native share the same mental model:
- Components, props, state, and hooks work identically.
- A developer who knows React can learn React Native quickly (and vice versa).

However, **React and React Native are separate libraries with separate renderers.** You cannot drop a React DOM component into a React Native app or vice versa. The component model is shared; the rendering target is different.

### What This Week Covers

This training focuses on **React (DOM)** for web applications, written entirely in TypeScript. The principles you learn -- components, props, state, hooks, and data flow -- apply directly to React Native if you work on mobile projects in the future.

## Code Example

A side-by-side comparison of the same "task card" concept across all three:

```typescript
// REACT (Web)
interface TaskCardProps {
  title: string;
  done: boolean;
}

function TaskCard({ title, done }: TaskCardProps) {
  return (
    <div className="task-card">
      <span>{done ? "[x]" : "[ ]"}</span>
      <p>{title}</p>
    </div>
  );
}
```

```typescript
// REACT NATIVE (Mobile)
import { View, Text } from "react-native";

interface TaskCardProps {
  title: string;
  done: boolean;
}

function TaskCard({ title, done }: TaskCardProps) {
  return (
    <View>
      <Text>{done ? "[x]" : "[ ]"}</Text>
      <Text>{title}</Text>
    </View>
  );
}
```

```typescript
// ANGULAR (Web)
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-task-card",
  template: `
    <div class="task-card">
      <span>{{ done ? "[x]" : "[ ]" }}</span>
      <p>{{ title }}</p>
    </div>
  `,
})
export class TaskCardComponent {
  @Input() title: string = "";
  @Input() done: boolean = false;
}
```

Notice how React and React Native share the same component structure (function + props), while Angular uses a class-based approach with decorators.

## Summary

- **React** is a web UI library -- flexible, focused, and ecosystem-dependent.
- **React Native** applies React's model to native mobile development -- same mental model, different rendering target.
- **Angular** is a full-featured web framework -- opinionated, batteries-included, and enforced by convention.
- The choice depends on your platform (web vs. mobile), team preferences, and project scale.
- This week focuses on React (DOM) with TypeScript -- the skills transfer directly to React Native and inform Angular comparisons.

## Additional Resources
- [React Documentation](https://react.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Angular Documentation](https://angular.dev/)
