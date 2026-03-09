# GenAI Code Generation

## Learning Objectives
- Use Generative AI to scaffold functions, components, and boilerplate code
- Apply best practices for prompting AI to generate production-quality code
- Critically review AI-generated code for correctness, security, and fit
- Identify use cases where AI code generation provides the highest value

## Why This Matters

Code generation is the most visible and widely adopted use case for AI coding assistants. When done well, it eliminates hours of repetitive work -- scaffolding components, writing utility functions, generating configuration files. When done carelessly, it introduces bugs, security vulnerabilities, and code that nobody on the team understands. This reading teaches you how to use AI code generation effectively: knowing what to generate, how to prompt for it, and how to evaluate the result.

## The Concept

### What AI Code Generation Actually Is

When you ask an AI to "write a function," the model is not compiling or executing code. It is predicting the most likely sequence of tokens (characters, words, symbols) based on patterns in its training data. The result looks like code -- and often is valid code -- but it has not been verified by any compiler, interpreter, or test suite.

This means:

- AI-generated code compiles and runs correctly **most of the time** for common patterns.
- It fails **some of the time** for unusual patterns, edge cases, or project-specific logic.
- It fails **quietly** -- the code looks correct but has subtle bugs that only surface in specific conditions.

Your job is to bridge the gap between "looks correct" and "is correct."

### High-Value Use Cases

AI code generation delivers the most value in these scenarios:

#### 1. Boilerplate and Scaffolding

Generating the structural skeleton of a component, module, or configuration file. The pattern is well-established, and the AI has seen thousands of examples.

**Example prompt:**
```
Generate a React functional component called TaskFilter.
Props: statuses (string array of available statuses), selectedStatus (string), onStatusChange (callback).
The component renders a dropdown select element with an option for each status.
Use TypeScript with a props interface. No external libraries.
```

**Why this works well:** React component patterns are among the most common in the AI's training data. The output is almost always structurally correct.

#### 2. Utility Functions

Small, self-contained functions with clear inputs and outputs. These are easy to test, easy to verify, and easy for AI to get right.

**Example prompt:**
```
Write a TypeScript function called formatDate that takes a Date object
and returns a string in "MMM DD, YYYY" format (e.g., "Mar 08, 2026").
Do not use external date libraries. Use Intl.DateTimeFormat.
```

#### 3. Data Transformations

Functions that reshape data from one format to another. AI excels here because the transformation logic is often mechanical.

**Example prompt:**
```
Write a function that takes an array of Task objects and returns 
a Map<string, Task[]> grouped by assignee.
Task type: { id: number; title: string; assignee: string; status: string }
```

#### 4. Configuration Files

Dockerfiles, pipeline YAML, linter configs, and TypeScript configurations follow rigid formats. AI generates these quickly and accurately.

**Example prompt:**
```
Generate a multi-stage Dockerfile for a Vite + React + TypeScript application.
Stage 1: Build with node:18-alpine, run npm ci and npm run build.
Stage 2: Serve with nginx:alpine, copy dist/ to /usr/share/nginx/html.
Add comments explaining each instruction.
```

#### 5. API Integration Code

Axios or fetch calls, request/response type definitions, and error handling wrappers. These follow predictable patterns.

**Example prompt:**
```
Write a TypeScript module called api.ts that exports functions for:
- getTasks(): fetches GET /api/tasks, returns Promise<Task[]>
- createTask(task: NewTask): posts to POST /api/tasks, returns Promise<Task>
- deleteTask(id: number): sends DELETE /api/tasks/:id, returns Promise<void>
Use Axios. Include error handling that throws a descriptive error message.
Define the Task and NewTask types.
```

### Lower-Value Use Cases

AI code generation is less reliable for:

- **Complex business logic** with many conditional branches and project-specific rules.
- **Performance-critical code** where algorithmic efficiency matters (AI may choose a naive approach).
- **Code that depends on internal APIs** the AI has not seen in training data.
- **Architectural decisions** -- AI can generate code that *works* but follows an inappropriate pattern for your project.

For these cases, use AI as a starting point but expect to write or rewrite significant portions yourself.

### Best Practices for AI Code Generation

**1. Provide the Types**

TypeScript types are the single most effective piece of context you can give an AI. Types constrain the output and make errors more obvious.

```
// Instead of:
"Write a function to update a task"

// Provide:
"Write a function with this signature:
function updateTask(tasks: Task[], id: number, updates: Partial<Task>): Task[]
It should return a new array with the matching task updated (immutable update)."
```

**2. One Task Per Prompt**

Do not ask AI to generate an entire module in one prompt. Break it into focused requests:

```
// Prompt 1: Generate the type definitions
// Prompt 2: Generate the reducer function
// Prompt 3: Generate the context provider
// Prompt 4: Generate the custom hook
```

Each output is small enough to review carefully.

**3. Specify Error Handling**

AI often generates the "happy path" and ignores error cases unless told otherwise:

```
Handle these error cases:
- Input array is empty (return empty array)
- No task matches the given ID (throw an Error with a descriptive message)
- Status value is not one of the allowed values (throw a TypeError)
```

**4. Request Comments**

```
Add a comment above each significant block explaining the reasoning, 
not just what the code does.
```

**5. Compare to Manual Code**

For critical code, generate the AI version and also write your own. Compare them:
- Did the AI take a shorter or more elegant approach?
- Did it miss an edge case you caught?
- Did it use an unfamiliar pattern that is actually better?

This comparison builds your judgment about when to trust AI output.

### Reviewing AI-Generated Code

Every piece of AI-generated code must pass this checklist before acceptance:

**Correctness:**
- [ ] Does it compile without errors?
- [ ] Does it handle the happy path correctly?
- [ ] Does it handle edge cases (empty inputs, null values, boundary conditions)?
- [ ] Are the types correct and complete?

**Security:**
- [ ] No hardcoded secrets or credentials?
- [ ] No injection vulnerabilities (SQL, XSS, command injection)?
- [ ] No overly permissive configurations (CORS *, wildcard permissions)?
- [ ] Input validation present where needed?

**Maintainability:**
- [ ] Does it follow the project's naming conventions?
- [ ] Is it readable and well-structured?
- [ ] Are there comments explaining non-obvious logic?
- [ ] Is it testable (pure functions, minimal side effects)?

**Fit:**
- [ ] Does it match the project's existing patterns and architecture?
- [ ] Does it use the same libraries and utilities already in the project?
- [ ] Will a teammate understand it without explanation?

### Common AI Code Generation Pitfalls

**Pitfall 1: Outdated APIs**

AI may use deprecated APIs from older library versions:

```typescript
// AI might generate (React 17 pattern):
ReactDOM.render(<App />, document.getElementById("root"));

// Correct for React 18+:
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
```

**Always verify:** Check the generated code against the current documentation for the library version you are using.

**Pitfall 2: Invented Functions**

AI may call functions or methods that do not exist:

```typescript
// AI might generate:
const tasks = await axios.getJson("/api/tasks");
// "getJson" is not an Axios method -- the correct method is axios.get()
```

**Always verify:** Confirm that every function call, method, and import references something real.

**Pitfall 3: Ignoring Immutability**

In React state management, state must be updated immutably. AI sometimes generates mutations:

```typescript
// AI might generate (WRONG -- mutates state):
state.tasks.push(newTask);
return state;

// Correct (immutable update):
return { ...state, tasks: [...state.tasks, newTask] };
```

**Always verify:** In React contexts, ensure state updates create new objects/arrays rather than modifying existing ones.

## Code Example

A complete worked example: generating a utility module for TaskFlow.

**Prompt:**
```
Write a TypeScript utility module called taskUtils.ts for the TaskFlow project.

Include these exported functions:
1. filterByStatus(tasks: Task[], status: Task["status"]): Task[]
   - Returns tasks matching the given status
2. sortByTitle(tasks: Task[]): Task[]
   - Returns a new array sorted alphabetically by title (case-insensitive)
3. getOverdueTasks(tasks: Task[], currentDate: Date): Task[]
   - Returns tasks where dueDate < currentDate and status is not "done"

Use this Task type:
interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
}

All functions must return new arrays (no mutation). Include JSDoc comments.
```

**Expected AI output (review and verify):**

```typescript
interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
}

/**
 * Filters tasks by their current status.
 * @param tasks - The array of tasks to filter.
 * @param status - The status to filter by.
 * @returns A new array containing only tasks with the specified status.
 */
export function filterByStatus(tasks: Task[], status: Task["status"]): Task[] {
  return tasks.filter((task) => task.status === status);
}

/**
 * Sorts tasks alphabetically by title (case-insensitive).
 * @param tasks - The array of tasks to sort.
 * @returns A new array of tasks sorted by title.
 */
export function sortByTitle(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );
}

/**
 * Returns tasks that are past their due date and not yet completed.
 * @param tasks - The array of tasks to check.
 * @param currentDate - The reference date for determining overdue status.
 * @returns A new array containing only overdue, incomplete tasks.
 */
export function getOverdueTasks(tasks: Task[], currentDate: Date): Task[] {
  return tasks.filter(
    (task) => task.dueDate < currentDate && task.status !== "done"
  );
}
```

**Review notes:**
- Correctness: All three functions return new arrays (no mutation). Types are correct.
- `sortByTitle` uses the spread operator to create a new array before sorting -- correct immutable pattern.
- `getOverdueTasks` compares Date objects directly, which works in JavaScript/TypeScript.
- JSDoc comments are present and accurate.
- Verdict: Accept with high confidence. Add to the project.

## Summary

- AI code generation is most effective for boilerplate, utility functions, data transformations, configuration files, and API integration code.
- Provide types, be specific, request one task per prompt, and specify error handling for best results.
- Every piece of AI-generated code must be reviewed for correctness, security, maintainability, and fit with the project.
- Common pitfalls include outdated APIs, invented functions, and immutability violations.
- Treat AI-generated code as a first draft, not a finished product. You own every line you accept.

## Additional Resources
- [GitHub -- Getting the Most Out of Copilot](https://github.blog/developer-skills/github/how-to-get-the-most-out-of-github-copilot/)
- [Microsoft Learn -- AI-Assisted Coding Best Practices](https://learn.microsoft.com/en-us/training/modules/introduction-prompt-engineering-with-github-copilot/)
- [Stack Overflow -- 2024 Developer Survey: AI Tools](https://survey.stackoverflow.co/2024/ai/)
