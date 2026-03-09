# GenAI for Unit Testing and Documentation

## Learning Objectives
- Use Generative AI to generate unit test suites for existing functions and components
- Apply best practices for prompting AI to produce meaningful, comprehensive tests
- Use AI to generate JSDoc/TSDoc comments, README content, and API documentation from code
- Critically evaluate AI-generated tests and documentation for accuracy and completeness

## Why This Matters

Testing and documentation are two of the most valuable -- and most frequently neglected -- engineering practices. Developers skip them because they are time-consuming, not because they are unimportant. AI coding assistants can dramatically reduce the friction: generating a test suite for a function in seconds rather than 30 minutes, producing thorough JSDoc comments in one prompt rather than typing them manually for every parameter. But speed without accuracy is dangerous. This reading teaches you how to generate tests and documentation with AI and, critically, how to evaluate whether the output is trustworthy.

---

## Part 1: GenAI for Unit Testing

### Why AI-Generated Tests Matter

Unit tests verify that individual functions and components behave correctly. A solid test suite:

- Catches regressions when code changes.
- Documents intended behavior (tests are executable specifications).
- Enables confident refactoring.
- Integrates into CI/CD pipelines as an automated quality gate.

AI can generate test suites significantly faster than manual writing, and it often identifies edge cases that developers overlook because the developer is focused on the happy path.

### Use Cases for AI-Generated Tests

**1. Testing Pure Functions**

Pure functions (same input always produces same output, no side effects) are ideal candidates for AI test generation. The AI can generate input-output pairs exhaustively.

**Example prompt:**
```
Write Vitest unit tests for this function:

function filterByStatus(tasks: Task[], status: Task["status"]): Task[] {
  return tasks.filter((task) => task.status === status);
}

interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
}

Cover these scenarios:
- Returns only tasks matching the given status
- Returns an empty array when no tasks match
- Returns an empty array when the input array is empty
- Does not mutate the original array
- Works with all three status values
```

**2. Testing Reducers**

Reducers are pure functions by design, making them excellent targets:

```
Write Vitest tests for this taskReducer. Test each action type:
- ADD_TASK: adds a new task to the array
- DELETE_TASK: removes the task with the given ID
- TOGGLE_STATUS: cycles the status from todo -> in-progress -> done

[paste reducer code]

Verify that each action produces the correct new state without mutating the previous state.
```

**3. Testing React Components**

AI can generate React Testing Library tests for components:

```
Write React Testing Library tests (with Vitest) for this TaskCard component:

[paste component code]

Test:
- Renders the task title
- Renders the correct status badge
- Calls onStatusChange with the correct arguments when the status button is clicked
- Applies the correct CSS class based on status
```

**4. Generating Test Data**

AI is excellent at generating realistic test fixtures:

```
Generate an array of 10 Task objects for testing.
Use realistic but varied data: mix of statuses, different assignees, 
some with past due dates and some with future dates.

interface Task {
  id: number;
  title: string;
  assignee: string;
  status: "todo" | "in-progress" | "done";
  dueDate: Date;
}
```

### Best Practices for AI Test Generation

**1. Specify the Test Framework**

Always name the framework. AI defaults can vary:

```
Use Vitest with expect assertions. Use describe/it blocks.
Do NOT use Jest-specific APIs (jest.fn, jest.mock).
```

**2. Request Specific Scenarios**

Do not just say "write tests." List the specific behaviors to test:

```
Test these specific scenarios:
1. Adding a task when the list is empty
2. Adding a task when the list already has 5 items
3. Adding a task with the same title as an existing task (should still add)
4. Verifying the new task gets a unique ID
```

**3. Ask for Edge Cases Explicitly**

```
Include edge case tests:
- Empty input arrays
- Null or undefined values (if applicable)
- Boundary values (empty strings, zero, negative numbers)
- Very large inputs (array of 1000 items)
```

**4. Verify the Tests Actually Test Something**

A common AI pitfall is generating tests that always pass because they test the wrong thing:

```typescript
// BAD: This test passes even if the function is broken
it("should return tasks", () => {
  const result = filterByStatus(tasks, "todo");
  expect(result).toBeDefined(); // This tells you nothing useful
});

// GOOD: This test verifies actual behavior
it("should return only tasks with status 'todo'", () => {
  const result = filterByStatus(tasks, "todo");
  expect(result).toHaveLength(2);
  expect(result.every(t => t.status === "todo")).toBe(true);
});
```

Always read each assertion and ask: "Would this test fail if the function were broken?"

**5. Run the Tests**

This seems obvious, but it is the most critical step. AI-generated tests may:
- Reference functions or types incorrectly.
- Use the wrong import paths.
- Make assumptions about the function's behavior that are wrong.

Run `npm test` after adding AI-generated tests. If they fail, the AI either misunderstood the function or generated incorrect assertions.

### Evaluating AI-Generated Tests

| Criterion | What to Check |
|-----------|---------------|
| **Coverage** | Are the happy path, edge cases, and error cases all tested? |
| **Assertions** | Are assertions specific (exact values) or vague (truthy, defined)? |
| **Independence** | Does each test stand alone, or do tests depend on each other? |
| **Readability** | Are test descriptions (it blocks) clear and descriptive? |
| **Correctness** | Do the expected values actually match the function's correct behavior? |
| **Mutability** | For React/reducer tests, does the test verify immutability? |

---

## Part 2: GenAI for Documentation

### Why AI Documentation Generation Matters

Good documentation:

- Reduces onboarding time for new team members.
- Serves as a reference for the developer who wrote the code (you will forget how it works in six months).
- Improves IDE experience -- JSDoc/TSDoc comments power autocomplete tooltips.
- Enables automated API documentation generation.

AI can generate documentation from code faster than any human, and it is usually structurally correct. The risk is factual errors -- describing what the code *should* do rather than what it *actually* does.

### Use Cases for AI Documentation

#### 1. JSDoc / TSDoc Comments

AI generates function-level documentation that integrates with IDE autocomplete:

**Prompt:**
```
Add TSDoc comments to every exported function in this module.
Include: description, @param for each parameter, @returns, and @example.

[paste module code]
```

**Expected output:**
```typescript
/**
 * Filters an array of tasks to include only those with the specified status.
 *
 * @param tasks - The full array of tasks to filter.
 * @param status - The status value to match against.
 * @returns A new array containing only tasks with the matching status.
 *
 * @example
 * ```typescript
 * const todoTasks = filterByStatus(allTasks, "todo");
 * ```
 */
export function filterByStatus(tasks: Task[], status: Task["status"]): Task[] {
  return tasks.filter((task) => task.status === status);
}
```

#### 2. README Generation

AI can produce a comprehensive README.md from the project structure and key files:

**Prompt:**
```
Generate a README.md for the TaskFlow project based on this information:

- Project: TaskFlow Team Task Manager
- Tech stack: React 18, TypeScript 5, Vite, CSS (taskflow.css)
- Package manager: npm
- Key scripts: npm run dev (dev server), npm run build (production), npm test (Vitest)
- Folder structure: src/ (components, context, styles), public/, dist/ (build output)
- Deployment: Docker container with Nginx, deployed to Azure App Service

Include sections:
1. Overview
2. Tech Stack
3. Getting Started (prerequisites, install, run)
4. Project Structure
5. Available Scripts
6. Deployment
7. Contributing Guidelines
```

#### 3. API Documentation

For backend services or utility modules:

```
Generate API documentation in Markdown for this REST API module.
For each endpoint, include: HTTP method, URL, request body (if any), 
response body, status codes, and an example curl command.

[paste route handler code]
```

#### 4. Inline Code Comments

For complex logic that would benefit from explanation:

```
Add inline comments to this function explaining each step.
Assume the reader understands TypeScript but not the business logic.
Comments should explain WHY, not WHAT (the code shows WHAT).

[paste function code]
```

### Best Practices for AI Documentation

**1. Documentation Must Match the Code**

The most common documentation bug is describing intended behavior that differs from actual behavior. After AI generates documentation, verify each claim:

- Does the `@returns` description match what the function actually returns?
- Does the `@example` snippet actually work if you paste it?
- Are parameter descriptions accurate?

**2. Keep It Concise**

AI tends to be verbose. Good documentation is precise and scannable:

```typescript
// AI might generate (too verbose):
/**
 * This function takes in an array of task objects and iterates through 
 * each one, checking if the status property matches the provided status 
 * parameter, and returns a new array containing only those task objects 
 * whose status property is equal to the provided status value.
 */

// Edit to (concise):
/**
 * Filters tasks by status, returning a new array of matching tasks.
 */
```

**3. Document the Why, Not the What**

```typescript
// BAD (documents the what -- the code already says this):
// Increment the counter by 1
counter++;

// GOOD (documents the why -- not obvious from the code):
// Retry count is tracked to trigger circuit breaker after 3 failures
counter++;
```

**4. Generate Once, Maintain Manually**

AI-generated documentation is a starting point. As the code evolves, update the documentation manually. Do not re-generate from scratch each time -- you will lose the human refinements.

### Evaluating AI-Generated Documentation

| Criterion | What to Check |
|-----------|---------------|
| **Accuracy** | Does the documentation match the actual code behavior? |
| **Completeness** | Are all parameters, return values, and exceptions documented? |
| **Conciseness** | Is it scannable, or overly verbose? |
| **Examples** | Do the examples compile and produce the described output? |
| **Currency** | Does it reference the correct library versions and APIs? |

---

## Putting It Together

In today's demo, you will watch the instructor use AI to generate:
1. Unit tests for the `taskReducer` function.
2. JSDoc/TSDoc documentation for the `TaskContext` module.
3. A `README.md` for the TaskFlow project.

For each, the instructor will critically review the output, point out what the AI got right, what it got wrong, and how to fix it. This is the pattern you will follow in the exercise.

## Summary

- AI generates unit tests quickly, but every test must be reviewed for meaningful assertions, correct expected values, and actual coverage.
- Specify the test framework, list scenarios explicitly, and run the tests before trusting them.
- AI generates documentation (JSDoc, READMEs, API docs, inline comments) faster than manual writing, but accuracy must be verified against the actual code.
- Good documentation describes **why**, not what. Edit AI output for conciseness.
- Both testing and documentation are **starting points** when AI-generated. Human review and maintenance are non-negotiable.

## Additional Resources
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [TSDoc -- Writing TypeScript Documentation Comments](https://tsdoc.org/)
