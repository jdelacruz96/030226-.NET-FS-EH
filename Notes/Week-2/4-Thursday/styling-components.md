# Styling Components in React

## Learning Objectives
- Survey the major styling approaches: CSS Modules, styled-components, Tailwind CSS, and inline styles
- Understand trade-offs across maintainability, performance, and developer experience
- Choose the right styling strategy for different project needs

## Why This Matters

Styling is as important as logic in a production React application. The approach you choose affects how components are scoped, how styles are maintained, and how the team collaborates on design. React does not prescribe a styling solution, so understanding the landscape helps you make an informed choice.

## The Concept

### 1. CSS Modules

CSS Modules scope class names to individual components by generating unique identifiers at build time. This eliminates global namespace collisions.

**How it works:**

```css
/* TaskCard.module.css */
.card {
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
}
```

```typescript
// TaskCard.tsx
import styles from "./TaskCard.module.css";

function TaskCard({ title }: { title: string }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
}
```

The generated HTML might look like: `<div class="TaskCard_card_a1b2c">`.

| Pro | Con |
|---|---|
| True scope isolation | Requires a build tool (Webpack, Vite) |
| Standard CSS syntax | Dynamic styles need extra work |
| No runtime overhead | Class name composition can be verbose |

### 2. styled-components (CSS-in-JS)

`styled-components` lets you write CSS directly in TypeScript using tagged template literals. Styles are scoped to the component and support dynamic values.

```typescript
import styled from "styled-components";

interface CardProps {
  $priority: "low" | "medium" | "high";
}

const Card = styled.div<CardProps>`
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid ${({ $priority }) =>
    $priority === "high" ? "#e74c3c" :
    $priority === "medium" ? "#f39c12" : "#2ecc71"};
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
`;

function TaskCard({ title, priority }: { title: string; priority: "low" | "medium" | "high" }) {
  return (
    <Card $priority={priority}>
      <Title>{title}</Title>
    </Card>
  );
}
```

| Pro | Con |
|---|---|
| Dynamic styles based on props | Runtime CSS generation (small performance cost) |
| Full CSS power (media queries, pseudo-elements) | Additional dependency |
| Co-located styles and logic | Larger bundle size |
| Automatic vendor prefixing | Learning curve for template literals |

### 3. Tailwind CSS

Tailwind CSS provides utility classes that you compose directly in JSX. Instead of writing custom CSS, you apply predefined classes.

```typescript
function TaskCard({ title, priority }: { title: string; priority: string }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <span className={`text-sm ${priority === "high" ? "text-red-500" : "text-green-500"}`}>
        {priority}
      </span>
    </div>
  );
}
```

| Pro | Con |
|---|---|
| Rapid prototyping | Long class strings in JSX |
| Consistent design tokens | Learning the utility class names |
| Small production CSS (purges unused) | Less readable for complex styles |
| No custom CSS files needed | Requires Tailwind configuration |

### 4. Inline Styles

React supports inline styles as JavaScript objects with camelCase properties:

```typescript
const cardStyle: React.CSSProperties = {
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "16px",
};

function TaskCard({ title }: { title: string }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
    </div>
  );
}
```

| Pro | Con |
|---|---|
| No build step required | No pseudo-classes (`:hover`, `:focus`) |
| Dynamic values are easy | No media queries |
| TypeScript-typed (`React.CSSProperties`) | No keyframe animations |
| Good for one-off dynamic values | Not suitable as a primary styling strategy |

### Comparison Table

| Approach | Scoping | Dynamic Styles | Runtime Cost | Ecosystem |
|---|---|---|---|---|
| **CSS Modules** | Component-scoped | Limited | None | Built into Vite/Webpack |
| **styled-components** | Component-scoped | Excellent | Small | Separate library |
| **Tailwind CSS** | Utility classes | Via class toggling | None | Separate framework |
| **Inline Styles** | Element-scoped | Excellent | None | Built into React |

### Choosing a Strategy

- **CSS Modules:** Good default for teams that prefer standard CSS with component scoping.
- **styled-components:** Best when styles depend heavily on props and state.
- **Tailwind CSS:** Ideal for rapid development with a consistent design system.
- **Inline Styles:** Use sparingly for dynamic, one-off values (e.g., computed positions).

Many projects mix approaches -- for example, CSS Modules for layout and inline styles for dynamic values.

## Summary

- React does not prescribe a styling solution; choose based on team preferences and project needs.
- **CSS Modules** offer scoping with standard CSS syntax and zero runtime cost.
- **styled-components** (CSS-in-JS) excels at dynamic, prop-driven styles.
- **Tailwind CSS** provides utility-first classes for rapid, consistent design.
- **Inline styles** are useful for dynamic values but lack pseudo-classes and media queries.

## Additional Resources
- [Vite CSS Modules Documentation](https://vitejs.dev/guide/features.html#css-modules)
- [styled-components Documentation](https://styled-components.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
