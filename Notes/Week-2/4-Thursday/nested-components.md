# Nested Components

## Learning Objectives
- Understand patterns for deeply nested component trees
- Apply composition to manage complexity
- Distinguish composition from inheritance in React

## Why This Matters

Real-world applications have components nested many levels deep. Poorly managed nesting leads to prop drilling, rigid hierarchies, and components that are difficult to reuse. This reading covers the patterns that keep deep component trees manageable.

## The Concept

### Composition: The React Way

React uses composition, not inheritance, to build complex UIs. You combine components by nesting them:

```typescript
function App() {
  return (
    <Layout>
      <Header>
        <Logo />
        <Navigation />
      </Header>
      <Main>
        <Sidebar>
          <FilterPanel />
        </Sidebar>
        <Content>
          <TaskList />
        </Content>
      </Main>
      <Footer />
    </Layout>
  );
}
```

Each component accepts `children` and renders them without knowing what they contain.

### The Children Prop for Flexibility

The `children` prop makes components flexible wrappers:

```typescript
interface PanelProps {
  title: string;
  children: React.ReactNode;
}

function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel-content">{children}</div>
    </section>
  );
}

// Reused with different content:
<Panel title="Tasks"><TaskList /></Panel>
<Panel title="Team"><TeamList /></Panel>
<Panel title="Stats"><StatsChart /></Panel>
```

### Render Props (Named Slots)

For components that need to inject data into their children, pass a render function:

```typescript
interface DataLoaderProps<T> {
  url: string;
  render: (data: T, loading: boolean) => React.ReactNode;
}

function DataLoader<T>({ url, render }: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); });
  }, [url]);

  return <>{render(data as T, loading)}</>;
}

// Usage:
<DataLoader<Task[]>
  url="/api/tasks"
  render={(tasks, loading) =>
    loading ? <p>Loading...</p> : <TaskList tasks={tasks} />
  }
/>
```

### Why Not Inheritance

React explicitly recommends composition over inheritance. The team has stated that at Meta, they have not found a single use case where inheritance would be recommended over composition for component reuse.

| Inheritance Pattern | Composition Alternative |
|---|---|
| `class SpecialButton extends Button` | `<Button variant="special">` (prop) |
| `class AdminDashboard extends Dashboard` | `<Dashboard><AdminPanel /></Dashboard>` (children) |
| `class EnhancedList extends List` | Custom hook + standard `List` component |

### Managing Deep Nesting

When nesting becomes excessive, apply these strategies:

1. **Extract components:** If a component is too large or deeply nested, extract parts into separate files.
2. **Use Context:** Eliminate prop drilling through intermediate layers.
3. **Flatten with hooks:** Move logic into custom hooks instead of wrapping with HOCs.
4. **Component composition:** Let parent components assemble children rather than having deeply nested default structures.

## Code Example

```typescript
interface PageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

function PageLayout({ sidebar, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <aside className="sidebar">{sidebar}</aside>
      <main className="main-content">{children}</main>
    </div>
  );
}

function DashboardPage() {
  return (
    <PageLayout sidebar={<FilterPanel />}>
      <h1>Dashboard</h1>
      <TaskList />
    </PageLayout>
  );
}

export default DashboardPage;
```

## Summary

- React uses **composition** (nesting and `children`) instead of inheritance.
- The `children` prop makes components flexible, reusable wrappers.
- Render props let parent components inject data into child rendering logic.
- Extract components, use Context, and flatten with hooks to manage deep nesting.

## Additional Resources
- [React Docs -- Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React Legacy Docs -- Composition vs. Inheritance](https://legacy.reactjs.org/docs/composition-vs-inheritance.html)
- [React Docs -- Thinking in React](https://react.dev/learn/thinking-in-react)
