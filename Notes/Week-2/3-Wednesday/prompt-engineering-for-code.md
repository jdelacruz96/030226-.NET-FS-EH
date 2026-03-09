# Prompt Engineering for Code

## Learning Objectives
- Define prompt engineering and explain why it matters for AI-assisted coding
- Apply proven prompting techniques: zero-shot, few-shot, chain-of-thought, and role-based prompts
- Write effective prompts for code generation, refactoring, and explanation tasks
- Set up and use an AI assistant in the IDE for prompt-driven development

## Why This Matters

The quality of output from an AI coding assistant is directly proportional to the quality of your input. A vague prompt produces vague, generic code. A precise prompt produces targeted, useful output. Prompt engineering is the skill of crafting inputs that get the best possible results from AI tools. Since you will be using AI against the TaskFlow codebase throughout today and tomorrow, learning to prompt effectively is the difference between frustration and productivity.

## The Concept

### What Is Prompt Engineering?

Prompt engineering is the practice of designing and refining the text inputs (prompts) given to an AI model to produce desired outputs. For coding tasks, this means writing clear, specific, and well-structured requests that guide the AI toward generating correct, relevant, and useful code.

A prompt is not just a question or command. It includes:

- **Context:** What the AI needs to know (language, framework, existing code).
- **Instruction:** What you want the AI to do (generate, explain, refactor, test).
- **Constraints:** Rules the output must follow (naming conventions, no external dependencies, specific patterns).
- **Examples (optional):** Sample inputs and outputs that show the AI the expected format.

### Prompting Techniques

#### Zero-Shot Prompting

The simplest approach: give the AI a task with no examples. The model relies entirely on its training data.

**Prompt:**
```
Write a TypeScript function that filters an array of Task objects by status.
The Task type has: id (number), title (string), status ("todo" | "in-progress" | "done").
```

**When it works well:** Simple, well-defined tasks with clear requirements. The model has seen thousands of filter functions and can produce a correct one without examples.

**When it fails:** Complex or unusual tasks where the expected output format is ambiguous.

#### Few-Shot Prompting

Provide one or more examples of the input-output pattern you expect. This teaches the AI the format and style of your desired output.

**Prompt:**
```
Generate JSDoc comments for TypeScript functions. Follow this pattern:

Example input:
function add(a: number, b: number): number {
  return a + b;
}

Example output:
/**
 * Adds two numbers and returns the result.
 * @param a - The first operand.
 * @param b - The second operand.
 * @returns The sum of a and b.
 */
function add(a: number, b: number): number {
  return a + b;
}

Now generate JSDoc for this function:
function filterTasksByStatus(tasks: Task[], status: Task["status"]): Task[] {
  return tasks.filter(task => task.status === status);
}
```

**When to use:** When you want the AI to follow a specific format, style, or convention that may differ from the generic default.

#### Chain-of-Thought Prompting

Ask the AI to reason through the problem step by step before generating the final output. This produces more accurate results for complex tasks.

**Prompt:**
```
I need to write a taskReducer function for a React useReducer hook.

Think through this step by step:
1. What actions should the reducer handle? (add, delete, toggle status)
2. What should the state shape look like? (array of Task objects)
3. How should each action modify the state immutably?
4. What TypeScript types are needed for the action union?

Then generate the complete reducer function with type definitions.
```

**When to use:** Multi-step logic, architectural decisions, or any task where the AI might miss requirements if it jumps straight to code.

#### Role-Based Prompting

Assign the AI a role or persona to shape the tone, depth, and perspective of the response.

**Prompt:**
```
You are a senior DevOps engineer reviewing a junior developer's Dockerfile.
Review the following Dockerfile and identify any issues related to:
- Security (running as root, unpinned versions)
- Performance (layer caching, image size)
- Best practices (multi-stage builds, .dockerignore)

[paste Dockerfile here]
```

**When to use:** Code review, security analysis, or any task where you want the AI to evaluate from a specific perspective.

### Best Practices for Code Prompts

**1. Be Specific About Language and Framework**

Bad: `Write a filter function.`

Good: `Write a TypeScript function that takes an array of Task objects and a status string, and returns only tasks matching that status. Use the Task type from the TaskFlow project: { id: number; title: string; status: "todo" | "in-progress" | "done" }.`

**2. Include Type Information**

AI generates significantly better TypeScript when you provide the exact types:

```
Given this type:
interface Task {
  id: number;
  title: string;
  assignee: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
}

Write a function that groups tasks by priority and returns a Record<Task["priority"], Task[]>.
```

**3. Specify What NOT to Do**

Negative constraints prevent common unwanted patterns:

```
Write a React component for displaying a task card.
- Do NOT use class components.
- Do NOT use any external libraries (no styled-components, no Material UI).
- Do NOT use inline styles. Use CSS class names from taskflow.css.
```

**4. Provide Context From Existing Code**

Paste relevant existing code so the AI matches your project's patterns:

```
Here is our existing TaskList component:
[paste code]

Now write a TaskCard component that follows the same patterns:
- Same import style
- Same prop interface pattern
- Same CSS class naming convention
```

**5. Ask for Explanation With the Code**

```
Generate a Dockerfile for a React + TypeScript application served by Nginx.
Use a multi-stage build. Add a comment above each instruction explaining why it is there.
```

**6. Iterate, Do Not Rewrite**

If the first output is 80% correct, refine rather than re-prompting from scratch:

```
Good start. Make these changes:
1. The function should return an empty array instead of null when no tasks match.
2. Add a default parameter for status with value "todo".
3. Add JSDoc comments.
```

### Prompt Templates for Common Tasks

#### Generate a Function

```
Write a TypeScript function called [name].
Input: [describe parameters and types]
Output: [describe return type]
Behavior: [describe what it does, edge cases to handle]
Constraints: [any rules -- no external deps, specific patterns, etc.]
```

#### Generate Unit Tests

```
Write unit tests for the following function using [test framework, e.g., Vitest].
Cover these scenarios:
1. [normal case]
2. [edge case]
3. [error case]

Function:
[paste function code]
```

#### Generate Documentation

```
Write a JSDoc/TSDoc comment for the following function.
Include: description, @param for each parameter, @returns, and @example.

[paste function code]
```

#### Explain Code

```
Explain the following TypeScript code line by line.
Assume the reader knows JavaScript but is new to TypeScript and React.

[paste code]
```

#### Generate a Dockerfile

```
Write a Dockerfile for a [framework] application.
- Use a multi-stage build.
- Stage 1: Build the application with [build tool].
- Stage 2: Serve with [server, e.g., Nginx].
- Use Alpine-based images to minimize size.
- Include comments explaining each instruction.
```

### IDE Integration

Modern AI coding assistants integrate directly into your editor, providing two interaction modes:

**Inline Completion:**
- As you type, the AI predicts the next lines.
- Accept with Tab, dismiss with Esc.
- Works best for function bodies, repetitive patterns, and boilerplate.

**Chat Panel:**
- Open a chat panel (usually in the sidebar).
- Type conversational prompts.
- The AI can reference open files, selected code, and project context.
- Best for complex tasks: generating multi-file solutions, explaining unfamiliar code, or troubleshooting errors.

**Tips for IDE integration:**
- Keep relevant files open -- many AI tools use open files as context.
- Select code before prompting to give the AI specific context.
- Use the AI chat for planning ("How should I structure this component?") and inline completion for execution.

### Iteration Strategies

Effective AI-assisted development is iterative:

**Strategy 1: Generate-Review-Refine**
1. Generate a first draft with a broad prompt.
2. Review the output for correctness and fit.
3. Refine with follow-up prompts addressing specific issues.

**Strategy 2: Scaffold Then Fill**
1. Ask AI to generate the skeleton (function signature, type definitions, test structure).
2. Fill in the implementation details yourself, using AI for individual blocks.

**Strategy 3: Compare and Choose**
1. Ask AI to generate two or three different approaches to the same problem.
2. Evaluate each for readability, performance, and maintainability.
3. Choose the best approach or combine elements from multiple.

## Code Example

Here is a worked example of iterative prompt engineering:

**Prompt 1 (initial):**
```
Write a function to count tasks by status.
```

**AI output (too generic):**
```typescript
function countByStatus(tasks) {
  const counts = {};
  tasks.forEach(t => {
    counts[t.status] = (counts[t.status] || 0) + 1;
  });
  return counts;
}
```

**Prompt 2 (refined with types and constraints):**
```
Rewrite this as a TypeScript function with proper typing.
Use the Task type: { id: number; title: string; status: "todo" | "in-progress" | "done" }.
Return type should be Record<Task["status"], number>.
Initialize all status counts to 0 so the return always includes all three statuses.
```

**AI output (much better):**
```typescript
interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
}

function countTasksByStatus(tasks: Task[]): Record<Task["status"], number> {
  const counts: Record<Task["status"], number> = {
    "todo": 0,
    "in-progress": 0,
    "done": 0,
  };

  for (const task of tasks) {
    counts[task.status]++;
  }

  return counts;
}
```

The second output is type-safe, handles all statuses, and matches the project's conventions. Two prompts to get there -- faster than writing it from scratch, faster than debugging a wrong first attempt.

## Summary

- **Prompt engineering** is the skill of crafting inputs that produce high-quality AI outputs.
- **Zero-shot** prompts work for simple tasks; **few-shot** prompts teach format and style; **chain-of-thought** prompts improve complex reasoning; **role-based** prompts shape evaluation perspective.
- Effective prompts are specific about language, types, constraints, and things to avoid.
- **Iteration is expected:** generate a first draft, review, and refine with follow-up prompts.
- IDE integration provides inline completion (Tab to accept) and chat panels for conversational prompting.
- Always review AI output for correctness, security, and fit with your project's conventions.

## Additional Resources
- [OpenAI -- Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google -- Prompting Strategies for AI-Assisted Coding](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- [Microsoft Learn -- Best Practices for GitHub Copilot](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot)
