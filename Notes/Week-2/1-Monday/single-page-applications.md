# Single-Page Applications

## Learning Objectives
- Define what a Single-Page Application (SPA) is and how it differs from a multi-page application
- Understand client-side routing at a high level
- Recognize why React is commonly used to build SPAs

## Why This Matters

React was designed to build Single-Page Applications. Understanding the SPA architecture is essential context for everything you will do this week -- from component rendering to routing to state management. When you know how SPAs work under the hood, you can make better decisions about performance, user experience, and application structure.

## The Concept

### What Is a Single-Page Application?

A Single-Page Application (SPA) is a web application that loads a **single HTML page** and dynamically rewrites its content as the user interacts with it, rather than loading entirely new pages from the server.

In a traditional multi-page application (MPA), every navigation triggers a full page reload:

```
User clicks "About" link
     |
Browser sends GET /about to server
     |
Server returns a complete HTML page
     |
Browser discards current page and renders the new one
```

In an SPA, navigation happens **within the browser**, without a full page reload:

```
User clicks "About" link
     |
JavaScript intercepts the click
     |
The router updates the URL and renders the About component
     |
No request to the server for a new HTML page
```

The result is a faster, more fluid user experience that feels like a native application.

### How SPAs Work

1. **Initial Load:** The browser requests the application. The server responds with a single HTML file and a JavaScript bundle.
2. **JavaScript Takes Over:** The JavaScript bundle initializes the application, renders the UI, and manages all subsequent user interactions.
3. **Dynamic Updates:** When the user navigates or interacts, JavaScript updates the DOM directly. Only data (often JSON from an API) is fetched from the server -- not new HTML pages.

```
  Browser                         Server
  ------                         ------
  GET /  ---------------------->  index.html + bundle.js
                                  (one-time load)
  
  User clicks "Dashboard"
  JavaScript renders Dashboard
  component -- no server request
  
  Component needs data  -------->  GET /api/tasks  (JSON response)
  JavaScript updates the DOM
```

### SPA vs. Multi-Page Application

| Aspect | Multi-Page App (MPA) | Single-Page App (SPA) |
|---|---|---|
| **Page Load** | Full reload on every navigation | Single initial load; updates are in-place |
| **Server Role** | Renders and returns complete HTML | Serves static files + JSON APIs |
| **User Experience** | Page flashes/blinks between navigations | Smooth, app-like transitions |
| **Speed (after load)** | Slower -- full HTML must be fetched each time | Faster -- only data payloads are exchanged |
| **Initial Load** | Faster per-page (less JS) | Slower (larger initial JS bundle) |
| **SEO** | Easier (server-rendered HTML) | Requires extra work (SSR/SSG) |
| **Complexity** | Simpler architecture | Requires client-side routing, state management |

### Client-Side Routing

In an SPA, the URL still changes as the user navigates -- but the browser does not send a request to the server for a new page. This is handled by a **client-side router**.

At a high level, client-side routing works by:

1. Intercepting link clicks and browser navigation events.
2. Reading the new URL path.
3. Matching the path to a component.
4. Rendering that component in place, without a full page reload.

We will cover React Router in depth on Tuesday. For now, understand that the router is the traffic controller that decides which component is displayed for a given URL.

### Trade-Offs of SPAs

**Advantages:**
- Fast, fluid user experience after the initial load
- Rich interactivity without page refreshes
- Clear separation between front-end (React) and back-end (API server)

**Challenges:**
- Larger initial JavaScript bundle (mitigated by code splitting)
- SEO requires additional techniques like Server-Side Rendering (SSR) or Static Site Generation (SSG)
- Browser history and the back button must be managed explicitly by the router
- Accessibility requires deliberate focus management when views change

### Where React Fits

React is a UI library purpose-built for the SPA architecture. Its component model, virtual DOM, and unidirectional data flow are designed to efficiently update the page in response to user interactions -- exactly what an SPA demands. Combined with a client-side router (React Router) and a state management solution, React provides the full toolkit for building production-grade SPAs.

## Code Example

A conceptual illustration of SPA navigation (using pseudocode to avoid spoiling React Router specifics for Tuesday):

```typescript
// Simplified client-side routing concept:

type Route = {
  path: string;
  component: () => string; // Returns HTML content
};

const routes: Route[] = [
  { path: "/", component: () => "<h1>Home</h1>" },
  { path: "/about", component: () => "<h1>About</h1>" },
  { path: "/dashboard", component: () => "<h1>Dashboard</h1>" },
];

function navigate(path: string): void {
  const route = routes.find((r) => r.path === path);
  if (route) {
    // Update the URL without a page reload:
    window.history.pushState({}, "", path);
    // Render the matched component into the page:
    document.getElementById("app")!.innerHTML = route.component();
  }
}
```

This is a drastically simplified version of what React Router does. The key idea: JavaScript controls which content is displayed, and the browser never leaves the page.

## Summary

- A Single-Page Application loads one HTML page and uses JavaScript to dynamically update the UI.
- SPAs provide a faster, more fluid user experience compared to traditional multi-page applications.
- Client-side routing manages URL changes without server requests for new HTML.
- React is designed to build SPAs and provides the component model, rendering engine, and ecosystem to do so effectively.
- We will cover React Router (the client-side routing library for React) in detail on Tuesday.

## Additional Resources
- [MDN Web Docs -- SPA (Single-Page Application)](https://developer.mozilla.org/en-US/docs/Glossary/SPA)
- [React Documentation -- Thinking in React](https://react.dev/learn/thinking-in-react)
- [Web.dev -- What Are Single-Page Apps?](https://web.dev/articles/what-are-single-page-apps)
