# GenAI for Code Review and Codebase Search

## Learning Objectives
- Use AI tools to assist with code review: identifying issues, suggesting improvements, and evaluating pull requests
- Apply AI-powered codebase search to navigate unfamiliar code by intent rather than exact names
- Develop an evaluation framework for determining when AI-generated content is trustworthy
- Understand the limits of AI-assisted code review and when human judgment is essential

## Why This Matters

Code review is one of the highest-leverage activities in software engineering. A thorough review catches bugs, enforces standards, shares knowledge, and improves design. But it is also one of the most time-consuming. AI tools can augment the review process -- catching mechanical issues so human reviewers can focus on design and logic. Meanwhile, AI-powered codebase search lets you navigate a project by *what the code does* rather than *what it is named*, which is invaluable when working on unfamiliar codebases like one you might inherit. This reading covers both capabilities and, critically, how to evaluate whether AI output should be trusted.

---

## Part 1: AI-Assisted Code Review

### What AI Code Review Does

AI code review tools analyze code changes (diffs, pull requests, or entire files) and produce observations in categories such as:

- **Bug detection:** Logic errors, off-by-one mistakes, null reference risks.
- **Style and convention:** Naming inconsistencies, formatting issues, missing documentation.
- **Security:** Hardcoded credentials, injection vulnerabilities, overly permissive configurations.
- **Performance:** Unnecessary operations, suboptimal algorithms, missing memoization.
- **Best practices:** Framework-specific anti-patterns, deprecated API usage.

### Using AI as a Pre-Reviewer

Before requesting a human review, run your changes through AI analysis:

**Prompt for a general code review:**
```
Review this code change as if you were a senior developer performing a 
pull request review. Focus on:
1. Correctness: Does the logic do what the author intends?
2. Edge cases: Are there inputs or states that would cause unexpected behavior?
3. TypeScript types: Are the types accurate and specific enough?
4. React patterns: Are hooks used correctly? Any missing dependencies?
5. Readability: Would a new team member understand this code?

For each issue, state:
- The location (function/line)
- The severity (critical / major / minor / suggestion)
- What the problem is
- A suggested fix

[paste code changes]
```

**Prompt for a targeted review:**
```
Review the error handling in this pull request.
Specifically check:
- Are all async operations wrapped in try/catch?
- Do error messages provide enough context for debugging?
- Are errors properly propagated (not swallowed)?
- Is user-facing error display appropriate?

[paste code]
```

### AI Review vs. Human Review

AI and human reviewers have complementary strengths:

| Aspect | AI Review | Human Review |
|--------|-----------|-------------|
| **Speed** | Instant | Hours to days |
| **Consistency** | Applies the same rules every time | Varies by reviewer and day |
| **Coverage** | Checks every line mechanically | May skim large diffs |
| **Pattern detection** | Excellent at finding known anti-patterns | Excellent at spotting novel issues |
| **Design evaluation** | Cannot assess architectural fit | Can evaluate whether the approach is right for the project |
| **Business logic** | No understanding of requirements | Understands the product context |
| **Context** | Limited to the provided code | Knows the team's history and decisions |

**The recommended workflow:**

```
Developer writes code
    |
    v
AI pre-review (catches mechanical issues)
    |
    v
Developer fixes AI findings
    |
    v
Human review (evaluates design, architecture, business logic)
    |
    v
Code is merged
```

AI handles the "did they forget a null check?" questions. Humans handle the "is this the right approach?" questions.

### Evaluating AI Review Comments

Not every AI review comment is worth acting on. Use this decision framework:

**1. Is the finding accurate?**
Does the AI correctly identify a real issue, or is it a false positive? AI may flag code as "potentially buggy" when it is actually correct in context.

**2. Is the finding relevant?**
The AI might suggest using a utility function that does not exist in your project, or applying a pattern that contradicts your team's conventions.

**3. Is the severity appropriate?**
AI sometimes escalates minor style preferences to "critical" issues. Calibrate: is this actually going to cause a bug in production, or is it a stylistic choice?

**4. Is the suggested fix correct?**
Even when the AI correctly identifies a problem, its suggested fix might introduce new issues. Always verify the fix independently.

---

## Part 2: Searching Codebases with GenAI

### What AI-Powered Search Does

Traditional code search (grep, `Ctrl+Shift+F`) matches exact text. AI-powered search matches *intent*:

| Query Type | Traditional Search | AI-Powered Search |
|------------|-------------------|-------------------|
| "Find the login function" | `grep -r "function login"` -- exact match | "Where does user authentication happen?" -- semantic match |
| "Find API calls" | `grep -r "axios\|fetch"` -- pattern match | "Which functions make HTTP requests?" -- concept match |
| "Find state management" | `grep -r "useReducer\|useState"` -- keyword match | "How is application state managed?" -- architectural match |

### Use Cases for AI Codebase Search

**1. Onboarding to a new codebase:**
```
Explain the architecture of this project. Where is:
- The routing configuration?
- The state management logic?
- The API integration layer?
- The main entry point?

[provide file tree or key files]
```

**2. Finding related code:**
```
I am adding a new task filtering feature. Where in the codebase
are tasks currently filtered, sorted, or transformed? I need to
follow existing patterns.
```

**3. Impact analysis:**
```
I need to change the Task interface to add a "priority" field.
Which files would be affected? List every file that imports or
references the Task type.
```

**4. Understanding data flow:**
```
Trace the data flow for a task from creation to display:
1. Where is a new task created (user interaction)?
2. How is it stored (state management)?
3. How does it reach the component that displays it?
```

### Limitations of AI Search

- AI search cannot index your entire codebase in real-time. Most IDE integrations only consider open files and a limited context window.
- AI may miss references that use dynamic property access, string interpolation, or indirect invocation.
- For definitive "find all references," use your IDE's built-in Go to References or `grep` -- they are exhaustive. Use AI search for exploratory, intent-based queries.

---

## Part 3: Assessing AI-Generated Content Quality

### The Evaluation Framework

Every piece of AI-generated content -- code, tests, documentation, review comments -- must pass through a quality assessment. Here is a structured framework:

#### Level 1: Surface Validation

| Check | Method |
|-------|--------|
| Does it compile/parse? | Run the compiler, linter, or formatter |
| Are there syntax errors? | IDE underlines, `npm run build` |
| Do imports resolve? | Check that referenced modules exist |

If it fails Level 1, reject immediately and re-prompt or write manually.

#### Level 2: Correctness Validation

| Check | Method |
|-------|--------|
| Does it produce the correct output for known inputs? | Write or run unit tests |
| Does it handle edge cases? | Test with empty inputs, boundary values, nulls |
| Are types accurate? | TypeScript compiler (`tsc --noEmit`) |
| Does it match the specification? | Compare behavior to requirements |

If it fails Level 2, identify the specific errors and either fix them or re-prompt with corrections.

#### Level 3: Quality Validation

| Check | Method |
|-------|--------|
| Is it readable? | Can a teammate understand it without explanation? |
| Does it follow project conventions? | Compare against existing code patterns |
| Is it maintainable? | Would future changes be easy or hard? |
| Is it secure? | Check for common vulnerability patterns |

Level 3 failures are not blockers but should be addressed before merging.

#### Level 4: Appropriateness Validation

| Check | Method |
|-------|--------|
| Does it solve the right problem? | Step back -- is this the approach your team would choose? |
| Is it over-engineered? | Is the AI introducing unnecessary abstraction? |
| Does it fit the project's architecture? | Would it feel natural in the codebase? |

Level 4 requires human judgment that AI cannot provide. This is where your experience and team knowledge are irreplaceable.

### Trust Calibration

Over time, you develop a sense for when AI output is likely to be trustworthy:

**High trust (accept with brief review):**
- Boilerplate code (React component skeletons, CRUD operations)
- Well-established patterns (filtering, sorting, mapping)
- Configuration files (tsconfig, Dockerfile, linter configs)
- Documentation for simple functions

**Medium trust (review carefully, test thoroughly):**
- Business logic functions
- State management code (reducers, context)
- API integration code
- Unit tests (verify assertions are meaningful)

**Low trust (verify every line, consider writing manually):**
- Security-related code (authentication, input validation, encryption)
- Performance-critical code (algorithms, caching logic)
- Code using project-specific internal APIs
- Infrastructure-as-code that provisions real resources

### When Human Judgment Must Override

Regardless of how confident the AI seems, these scenarios always require human decision-making:

1. **Architectural decisions:** AI does not understand your team's long-term plans. It may suggest a pattern that works today but creates problems as the project grows.

2. **Business rule implementation:** AI does not know your product requirements unless you spell them out completely. It fills gaps with assumptions that may be wrong.

3. **Security boundaries:** AI may generate code that appears secure but has subtle vulnerabilities. Security-critical code should be reviewed by a human with security expertise.

4. **Trade-off decisions:** When there are multiple valid approaches, the choice depends on team context, performance requirements, and maintainability priorities that AI cannot weigh.

## Summary

- AI augments code review by catching mechanical issues (bugs, style, security patterns) so humans can focus on design and architecture.
- AI code review is instant and consistent but cannot evaluate architectural fit or business logic.
- AI-powered codebase search matches intent rather than exact text, enabling exploratory navigation of unfamiliar code.
- Use a 4-level evaluation framework (Surface, Correctness, Quality, Appropriateness) to assess all AI-generated content.
- Trust calibration improves with experience: boilerplate is high-trust, security code is low-trust, and human judgment always has the final word.

## Additional Resources
- [Google Engineering Practices -- How to Write Code Review Comments](https://google.github.io/eng-practices/review/reviewer/comments.html)
- [Microsoft -- Code with AI Responsibly](https://learn.microsoft.com/en-us/ai/responsible-ai-overview)
- [Codeium Documentation -- Codebase Search](https://codeium.com/documentation)
