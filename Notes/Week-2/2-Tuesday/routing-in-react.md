# Routing in React

## Learning Objectives
- Understand what client-side routing is and why SPAs need it
- Set up React Router with `BrowserRouter`, `Routes`, and `Route`
- Navigate between pages using `Link` and programmatic navigation

## Why This Matters

A Single-Page Application loads once, but users still expect to navigate between different "pages" using the URL bar and the browser's back/forward buttons. React Router is the standard solution for mapping URLs to components. This reading covers the essentials -- enough to build multi-page React applications for the rest of the week.

## The Concept

### What Is Client-Side Routing?

In a traditional website, clicking a link causes the browser to request a new HTML page from the server. In an SPA, **client-side routing** intercepts link clicks, updates the URL, and renders a different React component -- all without a page reload.

React does not include a router. The community standard is **React Router**, a dedicated library for declarative routing.

### Installation

```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

> Note: Recent versions of `react-router-dom` ship their own TypeScript types, so the `@types` package may not be necessary. Install it if your editor reports missing types.

### Core Components

#### `BrowserRouter`

Wraps your entire application and enables routing. It uses the browser's History API to keep the URL in sync with the UI:

```typescript
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

#### `Routes` and `Route`

`Routes` is the container that matches the current URL to a set of `Route` components:

```typescript
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
```

- `path` defines the URL pattern.
- `element` specifies the component to render when the path matches.

#### `Link`

`Link` replaces the `<a>` tag for internal navigation. It prevents a full page reload:

```typescript
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
```

**Do not use `<a href="...">` for internal routes** -- it would cause a full page reload, defeating the purpose of the SPA.

#### `NavLink`

`NavLink` is like `Link` but adds styling to the active link:

```typescript
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "nav-active" : "")}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "nav-active" : "")}
      >
        About
      </NavLink>
    </nav>
  );
}
```

### Dynamic Routes

Use a colon (`:`) to define URL parameters:

```typescript
<Route path="/tasks/:taskId" element={<TaskDetailPage />} />
```

Access the parameter inside the component with `useParams`:

```typescript
import { useParams } from "react-router-dom";

function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();

  return <h1>Viewing Task #{taskId}</h1>;
}
```

### Programmatic Navigation

Use the `useNavigate` hook to navigate in response to events (e.g., after a form submission):

```typescript
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // After successful login:
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Log In</button>
    </form>
  );
}
```

### Catch-All (404) Route

Place a wildcard route at the end to handle unmatched URLs:

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### Nested Routes

Routes can be nested to share layouts:

```typescript
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
```

The `Layout` component uses `<Outlet />` to render the matched child route:

```typescript
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

## Code Example

A complete minimal app with routing:

```typescript
// App.tsx
import { Routes, Route, Link } from "react-router-dom";

function HomePage() {
  return <h1>Home</h1>;
}

function AboutPage() {
  return <h1>About TaskFlow</h1>;
}

function NotFoundPage() {
  return <h1>404 -- Page Not Found</h1>;
}

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
```

## Summary

- **React Router** provides client-side routing for React SPAs.
- Wrap your app in `BrowserRouter`; define routes with `Routes` and `Route`.
- Use `Link` (not `<a>`) for internal navigation to avoid page reloads.
- Use `useParams` for dynamic route segments and `useNavigate` for programmatic navigation.
- Nested routes with `Outlet` enable shared layouts across pages.

## Additional Resources
- [React Router Documentation](https://reactrouter.com/en/main)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [React Docs -- Start a New React Project](https://react.dev/learn/start-a-new-react-project)
