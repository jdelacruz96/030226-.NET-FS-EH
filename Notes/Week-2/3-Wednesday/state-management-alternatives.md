# State Management Alternatives

## Learning Objectives
- Compare Redux Toolkit, Zustand, Jotai, and Recoil
- Evaluate trade-offs across API complexity, performance, and ecosystem
- Read introductory code snippets for each library

## Why This Matters

The React ecosystem offers multiple state management libraries, each with a different philosophy. Being familiar with the landscape helps you evaluate recommendations, read codebases that use different tools, and make informed choices when starting new projects.

## The Concept

### Redux Toolkit

**Philosophy:** Single centralized store, strict unidirectional flow, dispatched actions.

Redux Toolkit (RTK) is the official, batteries-included way to use Redux. It simplifies the boilerplate that made older Redux verbose.

```typescript
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 } as CounterState,
  reducers: {
    increment: (state) => { state.value += 1; }, // RTK uses Immer internally
    decrement: (state) => { state.value -= 1; },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

const store = configureStore({ reducer: { counter: counterSlice.reducer } });

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
```

| Strength | Weakness |
|---|---|
| Mature ecosystem, excellent DevTools | More boilerplate than alternatives |
| Middleware support (thunks, sagas) | Steeper learning curve |
| Predictable, testable patterns | Overkill for small apps |

### Zustand

**Philosophy:** Minimal API, hooks-first, no providers needed.

Zustand is a lightweight store that feels like `useState` for global state.

```typescript
import { create } from "zustand";

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Usage in a component:
function Counter() {
  const { count, increment } = useCounterStore();
  return <button onClick={increment}>Count: {count}</button>;
}
```

| Strength | Weakness |
|---|---|
| Extremely simple API | Smaller ecosystem than Redux |
| No provider wrapper needed | Less opinionated (fewer guardrails) |
| Tiny bundle size (~1 KB) | No built-in DevTools (uses Redux DevTools adapter) |

### Jotai

**Philosophy:** Atomic, bottom-up state. Each piece of state is an independent "atom."

```typescript
import { atom, useAtom } from "jotai";

const countAtom = atom<number>(0);
const doubleCountAtom = atom<number>((get) => get(countAtom) * 2); // Derived atom

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubleCount] = useAtom(doubleCountAtom);

  return (
    <div>
      <p>Count: {count}, Double: {doubleCount}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

| Strength | Weakness |
|---|---|
| No boilerplate, feels like `useState` | Less structured for large teams |
| Excellent for derived/computed state | Smaller community than Redux |
| Fine-grained re-renders (atom-level) | Fewer middleware options |

### Recoil

**Philosophy:** Atom/selector graph with React-native feel. Created by Meta.

```typescript
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const countState = atom<number>({
  key: "countState",
  default: 0,
});

const doubleCountState = selector<number>({
  key: "doubleCountState",
  get: ({ get }) => get(countState) * 2,
});

function Counter() {
  const [count, setCount] = useRecoilState(countState);
  const doubleCount = useRecoilValue(doubleCountState);

  return (
    <div>
      <p>Count: {count}, Double: {doubleCount}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

| Strength | Weakness |
|---|---|
| Natural React feel (atoms + selectors) | Still experimental (less stable API) |
| Good for derived data graphs | Requires `RecoilRoot` provider |
| Concurrent mode support | Smaller adoption than Redux or Zustand |

### Comparison Table

| Aspect | Redux Toolkit | Zustand | Jotai | Recoil |
|---|---|---|---|---|
| **API Complexity** | Higher | Minimal | Minimal | Moderate |
| **Bundle Size** | ~11 KB | ~1 KB | ~3 KB | ~14 KB |
| **Provider Required** | Yes | No | Yes (Provider optional) | Yes |
| **DevTools** | Excellent | Via adapter | Via adapter | Experimental |
| **Middleware** | Built-in | Middleware API | Limited | Limited |
| **Learning Curve** | Steeper | Low | Low | Moderate |
| **Best For** | Large enterprise apps | Small-to-medium apps | Derived state, atoms | Data-graph-heavy apps |
| **Adoption** | Very high | Growing fast | Growing | Moderate |

### When to Use Which

- **Redux Toolkit:** Your team is large, you need strict patterns, middleware, and battle-tested DevTools.
- **Zustand:** You want the simplest possible API with a small footprint.
- **Jotai:** You have many small, independent pieces of state with derived values.
- **Recoil:** You have complex derived state relationships and want a React-native feel.

For this training, you will use React's built-in tools (Context + `useReducer`). The external libraries are here for awareness -- you will encounter them in production codebases.

## Summary

- **Redux Toolkit** is mature, opinionated, and best for large teams with complex state.
- **Zustand** is minimal, hook-based, and ideal for projects that want simplicity.
- **Jotai** uses atoms for fine-grained, bottom-up state with excellent derived state support.
- **Recoil** offers a React-native atom/selector model for data-graph patterns.
- Start with built-in tools; adopt an external library when you have a clear need.

## Additional Resources
- [Redux Toolkit Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Jotai Documentation](https://jotai.org/)
- [Recoil Documentation](https://recoiljs.org/)
