# Week 1 Project: Full-Stack React & ASP.NET Application

## Project Overview

Over the course of the week, you will build a full-stack application from scratch. The domain and topic of the application are entirely up to you! This is your opportunity to showcase your creativity and interests. Whether it's a personal finance tracker, a recipe manager, a hobby collection catalog, or a lightweight social feed—choose a topic you find engaging.

This is a solo project, and you are encouraged to move at your own pace. If you have prior knowledge or are curious about advanced implementations, feel free to get ahead, add extra features, or explore advanced patterns.

## Technology Stack Requirements

* **Frontend:** React 19, TypeScript (strict mode), React Router DOM, Context API, CSS Modules / Webpack (or Vite).
* **Data Fetching:** Native `fetch` API or Axios (optional, pick your preference).
* **Backend:** ASP.NET Core Web API (C#) using standard Controllers or Minimal APIs. Use an in-memory database or SQLite for data persistence to keep local setup frictionless.

## Application Features & Requirements

### 1. Domain Models & Relationships

You must define **at least two related domain models** for your application (e.g., an `Author` and a `Book`, or a `BudgetCategory` and a `Transaction`).

* Create TypeScript interfaces on the frontend representing these models.
* Create corresponding C# models on the backend.
* Each model must include an `Id` field and at least 3-4 other descriptive properties of varying data types.
* Establish a clear relationship (e.g., One-to-Many) between your two models (e.g., a `Transaction` belongs to a `BudgetCategory`).

### 2. Frontend Views

Your React application must include at least the following views:

* **Dashboard / Home:** A landing page that displays high-level information or aggregates data related to your chosen domains.
* **List View:** A page that fetches and displays a collection of your primary domain items. Implement at least one form of client-side filtering or sorting.
* **Detail View:** A separate route to view the full details of a specific item based on its ID. Include a way to display its related data (e.g., viewing an `Author` and listing their `Books`).
* **Creation & Edit Forms:** Forms with controlled inputs and validation to generate and update items.
* **Deletion:** Include a way for users to delete items (e.g., a delete button on the list or detail view) with an appropriate confirmation prompt.

### 3. State Management

* You must implement the **Context API** along with the `useReducer` hook (or `useState`) to manage global state.
* *Example uses:* Managing a shopping cart, a user's session state, theme preferences (light/dark mode), or centralizing the state of your primary domain objects to avoid unnecessary API calls.
* Avoid prop drilling where utilizing global state is more appropriate and efficient.

### 4. API Integration

* The frontend must make HTTP requests for full CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) to your ASP.NET Core Web API backend.
* Handle application loading states (e.g., spinners or skeleton loaders) and error states gracefully in your components.

### 5. Backend API Contract

Your ASP.NET Core backend must expose RESTful endpoints to support your frontend features. At a minimum, you must implement full CRUD operations for both of your domain models:

* `GET /api/[your-resource]` - Returns all items.
* `GET /api/[your-resource]/{id}` - Returns a specific item by ID.
* `POST /api/[your-resource]` - Creates a new item.
* `PUT /api/[your-resource]/{id}` - Updates an existing item.
* `DELETE /api/[your-resource]/{id}` - Deletes an existing item.

*(Repeat these basic endpoints or implement nested routes for your related domain model as appropriate).*

## Getting Started

It is up to you how you structure your workflow, but a recommended sequence is:

1. **Define Your Idea:** Pitch a simple app idea to yourself. Keep the scope manageable.
2. **Initialize the Backend:** Create a new ASP.NET Core Web API project. Set up your API endpoints and configure your database.
3. **Initialize the Frontend:** Scaffold a new React project with TypeScript enabled.
4. **Build Incrementally:** Start by creating your domain models and presentational components with mocked data before hooking up the routing, global state, and real API calls.
