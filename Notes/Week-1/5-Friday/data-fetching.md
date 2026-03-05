# Data Fetching in React

## Learning Objectives
- Fetch data from APIs using `useEffect` and `fetch` with TypeScript
- Manage loading, error, and success states
- Understand the limitations of `useEffect` for data fetching and when to use dedicated libraries

## Why This Matters

Almost every React application fetches data from a server. The pattern of fetching in `useEffect`, managing loading/error states, and handling cleanup is foundational. Understanding this pattern -- and its limitations -- prepares you for both simple projects and the data-fetching libraries used in production.

## The Concept

### The Basic Pattern

```typescript
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data: User[]) => {
        if (!cancelled) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}
```

### Using async/await

`useEffect` cannot be an async function directly, but you can define an async function inside it:

```typescript
useEffect(() => {
  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks?project=${projectId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [projectId]);
```

### Extracting a Custom Hook

The fetch pattern is so common that it should be a reusable hook:

```typescript
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  const refetch = (): void => setTrigger((t) => t + 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: T) => {
        if (!cancelled) { setData(json); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [url, trigger]);

  return { data, loading, error, refetch };
}

// Usage:
function ProjectList() {
  const { data: projects, loading, error, refetch } = useFetch<Project[]>("/api/projects");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error} <button onClick={refetch}>Retry</button></p>;
  return <ul>{projects?.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

### Limitations of useEffect for Data Fetching

| Limitation | Impact |
|---|---|
| No caching | Every mount fetches again |
| No deduplication | Multiple components fetching the same URL make separate requests |
| No background refetching | Data becomes stale without manual refresh |
| Race conditions | Must handle cleanup manually |
| No optimistic updates | Cannot update UI before server confirms |

### Production Libraries

For production applications, dedicated libraries solve these problems:

| Library | Key Feature |
|---|---|
| **TanStack Query (React Query)** | Caching, background refetching, pagination, mutations |
| **SWR** | Stale-while-revalidate strategy, lightweight |
| **RTK Query** | Built into Redux Toolkit, integrates with Redux stores |

These libraries handle caching, deduplication, refetching, and error recovery automatically.

## Code Example

```typescript
import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

function PostViewer() {
  const [postId, setPostId] = useState<number>(1);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((res) => res.json())
      .then((data: Post) => {
        if (!cancelled) { setPost(data); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [postId]);

  return (
    <div>
      <div>
        <button onClick={() => setPostId((id) => Math.max(1, id - 1))}>Previous</button>
        <span> Post #{postId} </span>
        <button onClick={() => setPostId((id) => id + 1)}>Next</button>
      </div>
      {loading ? <p>Loading...</p> : post && <div><h2>{post.title}</h2><p>{post.body}</p></div>}
    </div>
  );
}

export default PostViewer;
```

## Summary

- Fetch data inside `useEffect` with cleanup to prevent stale state updates.
- Manage three states: **loading**, **error**, and **data**.
- Extract the fetch pattern into a reusable `useFetch` custom hook.
- For production, use TanStack Query, SWR, or RTK Query for caching, deduplication, and refetching.

## Additional Resources
- [React Docs -- Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [SWR Documentation](https://swr.vercel.app/)
