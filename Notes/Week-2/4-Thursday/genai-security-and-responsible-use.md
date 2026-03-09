# GenAI Security and Responsible Use

## Learning Objectives
- Explain both the security benefits and security risks of using GenAI in development
- Identify common security problems in AI-generated code and apply mitigation strategies
- Conduct an AI-assisted security analysis of application code and Dockerfiles
- Apply an ethical-use checklist for responsible integration of AI tools in professional practice

## Why This Matters

AI coding assistants accelerate development, but speed without care creates risk. An AI can generate a Dockerfile that works perfectly -- and runs as root with no resource limits. It can produce a form handler that processes user input -- and is vulnerable to cross-site scripting. It can scaffold an API -- with hardcoded credentials in the source. Security is not a feature the AI optimizes for unless you explicitly ask. This reading equips you to use AI tools responsibly: leveraging their speed while maintaining the security posture that professional software demands.

This is the final reading topic for the week. Everything you have learned -- DevOps practices, containerization, CI/CD pipelines, AI-assisted coding -- converges here. The question is not whether to use AI tools, but *how* to use them without creating liabilities.

---

## Part 1: Security Benefits and Risks of GenAI

### How AI Improves Security

When used deliberately, AI coding assistants can improve a codebase's security posture:

**1. Automated Vulnerability Detection**

AI can scan code and identify patterns associated with known vulnerability classes:

```
Analyze this form handler for security vulnerabilities.
Check for: XSS, injection, CSRF, improper input validation, 
and insecure data handling.

[paste code]
```

AI checks every line against a vast database of known vulnerability patterns. A human reviewer might miss a subtle XSS vector in line 47; AI systematically checks all lines.

**2. Secure Code Generation**

When explicitly prompted, AI generates code with security controls built in:

```
Write a form handler that sanitizes all user input before processing.
Use DOMPurify for HTML sanitization. Validate that the email field 
matches a standard email pattern. Reject any input longer than 500 characters.
```

**3. Configuration Auditing**

AI can review Dockerfiles, pipeline YAML, and infrastructure configurations for security anti-patterns:

```
Review this Dockerfile for security issues. Check for:
- Running as root
- Unpinned base image tags
- Missing .dockerignore
- Exposed sensitive files
- Unnecessary packages installed
```

**4. Dependency Risk Assessment**

```
Review the dependencies in this package.json. Identify any packages 
that have known vulnerabilities, are unmaintained, or could be replaced 
with built-in alternatives.
```

### How AI Creates Security Risks

Conversely, careless use of AI introduces distinct security risks:

**Risk 1: Insecure Default Code**

AI generates code that *works* but does not prioritize security unless asked:

```typescript
// AI might generate (insecure):
app.use(cors({ origin: "*" }));  // Allows any origin -- too permissive

// Secure version:
app.use(cors({ origin: "https://taskflow.azurewebsites.net" }));
```

The AI's goal is to produce code that runs without errors. `origin: "*"` achieves that. Security requires a more restrictive configuration.

**Risk 2: Hardcoded Secrets**

AI may include placeholder secrets that look like real values:

```typescript
// AI might generate:
const API_KEY = "sk-abc123456789";  // Never hardcode secrets
const DB_PASSWORD = "admin123";     // This is a placeholder, but it works

// Correct approach:
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

A developer who accepts this without review ships hardcoded credentials to a public repository.

**Risk 3: Injection Vulnerabilities**

AI may generate code that directly interpolates user input:

```typescript
// AI might generate (vulnerable to SQL injection):
const query = `SELECT * FROM tasks WHERE status = '${userInput}'`;

// Secure version (parameterized query):
const query = "SELECT * FROM tasks WHERE status = $1";
const result = await db.query(query, [userInput]);
```

**Risk 4: Overly Permissive Configurations**

```dockerfile
# AI might generate (insecure Dockerfile):
FROM node:18                 # Full image with unnecessary tools
USER root                    # Running as root (or omitting USER entirely)
COPY . .                     # No .dockerignore -- copies .env, .git, etc.
EXPOSE 0.0.0.0:8080          # Bound to all interfaces

# Secure version:
FROM node:18-alpine          # Minimal image
RUN addgroup -S app && adduser -S app -G app
USER app                     # Non-root user
COPY --chown=app:app . .     # Correct ownership
EXPOSE 8080                  # Port only (binding controlled at runtime)
```

**Risk 5: Prompt Injection and Data Leakage**

If AI tools have access to your codebase, be mindful of what you share through prompts:

- Do not paste production credentials, API keys, or customer data into AI prompts.
- Be aware that some AI services may retain prompt data for training (check the provider's data policy).
- In enterprise settings, use approved AI tools that comply with your organization's data handling policies.

---

## Part 2: Common Security Problems and Solutions

### Problem 1: Cross-Site Scripting (XSS)

XSS occurs when untrusted data is rendered as HTML in the browser, allowing attackers to inject malicious scripts.

**AI might generate:**
```typescript
// Dangerous: renders raw HTML from user input
function TaskTitle({ title }: { title: string }) {
  return <div dangerouslySetInnerHTML={{ __html: title }} />;
}
```

**Secure approach:**
```typescript
// Safe: React escapes text content by default
function TaskTitle({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

React's JSX escapes content by default. The risk arises when developers (or AI) use `dangerouslySetInnerHTML` or bypass React's rendering.

**Mitigation:** Never use `dangerouslySetInnerHTML` with user-supplied content unless you sanitize it first (e.g., with DOMPurify).

### Problem 2: Insecure Docker Images

**Common AI-generated Docker issues:**

| Issue | Risk | Fix |
|-------|------|-----|
| No `USER` directive | Container runs as root; a container escape grants root on the host | Add `USER` with a non-root user |
| Unpinned image tags (`FROM node:latest`) | Image changes unexpectedly; may introduce vulnerabilities | Pin to a specific version (`FROM node:18.19-alpine`) |
| No `.dockerignore` | `.env`, `.git`, credentials copied into the image | Create a `.dockerignore` excluding sensitive files |
| Unnecessary packages | Larger attack surface | Use Alpine images; install only what is needed |
| Build secrets in image | Credentials baked into a layer visible with `docker history` | Use multi-stage builds; secrets only in build stage |

### Problem 3: Missing Input Validation

AI often generates handlers that process input without validation:

```typescript
// AI might generate (no validation):
function handleSubmit(data: FormData) {
  const title = data.get("title") as string;
  const priority = data.get("priority") as string;
  createTask({ title, priority });
}

// With validation:
function handleSubmit(data: FormData) {
  const title = data.get("title");
  const priority = data.get("priority");

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("Title is required");
  }
  if (title.length > 200) {
    throw new Error("Title must be 200 characters or fewer");
  }

  const validPriorities = ["low", "medium", "high"] as const;
  if (!validPriorities.includes(priority as any)) {
    throw new Error("Invalid priority value");
  }

  createTask({
    title: title.trim(),
    priority: priority as Task["priority"],
  });
}
```

**Rule:** Always validate user input at the boundary where it enters your application, regardless of whether the AI included validation.

### Problem 4: Exposed Sensitive Information

```yaml
# AI might generate in pipeline YAML (insecure):
variables:
  DB_PASSWORD: "mySecurePassword123"  # Visible in YAML, version control

# Secure approach:
variables:
  - group: production-secrets  # Linked to Azure DevOps variable group (encrypted)
```

**Rule:** Never store secrets in code files, pipeline YAML, or Dockerfiles. Use environment variables, secret managers, or variable groups.

---

## Part 3: Security Best Practices for AI-Assisted Development

### The Security Review Checklist

Apply this checklist to all AI-generated code before accepting:

**Authentication and Authorization:**
- [ ] No hardcoded credentials, API keys, or tokens
- [ ] Secrets loaded from environment variables or a secret manager
- [ ] Access control checks present where needed

**Input Handling:**
- [ ] All user input is validated (type, length, format, allowed values)
- [ ] No raw HTML rendering of user input (no `dangerouslySetInnerHTML` with unsanitized data)
- [ ] No string interpolation in SQL queries (use parameterized queries)

**Configuration:**
- [ ] CORS is restricted to specific origins (not `*`)
- [ ] Docker containers run as non-root users
- [ ] Base image tags are pinned to specific versions
- [ ] `.dockerignore` excludes `.env`, `.git`, `node_modules`

**Data Handling:**
- [ ] Sensitive data is not logged
- [ ] Error messages do not expose internal details (stack traces, file paths)
- [ ] HTTPS is used for all external communication

**Dependencies:**
- [ ] Dependencies are pinned (lock file committed)
- [ ] No unnecessary dependencies included
- [ ] Known vulnerable packages addressed

### Security-Minded Development Workflow

```
1. Generate code with AI
    |
    v
2. Review for security (use the checklist above)
    |
    v
3. Ask AI specifically about security
   "Review this code for security vulnerabilities"
    |
    v
4. Run automated tools (SonarCloud, npm audit)
    |
    v
5. Human security review for critical code
    |
    v
6. Merge with confidence
```

The key is that step 1 (AI generates code) is never the last step. Security review is always layered: AI review + automated tools + human review.

---

## Part 4: Responsible AI Use

### What Responsible Use Means

Responsible AI use in software development means:

1. **Transparency:** Being honest about when AI was used to generate or modify code.
2. **Accountability:** Taking personal responsibility for all code you commit, regardless of who (or what) generated it.
3. **Verification:** Never trusting AI output blindly. Always reviewing, testing, and validating.
4. **Privacy:** Not sharing sensitive data (customer information, credentials, proprietary code) with AI tools unless they are approved for that purpose.
5. **Intellectual humility:** Recognizing that AI is a tool, not an authority. It can be wrong, biased, or outdated.

### The Ethical-Use Checklist

Before committing AI-generated code, verify:

- [ ] **I understand the code.** I can explain every line to a teammate.
- [ ] **I have tested the code.** It passes unit tests and behaves correctly for typical and edge-case inputs.
- [ ] **I have reviewed for security.** I have checked for the common vulnerability patterns listed above.
- [ ] **I am not exposing sensitive data.** I did not paste customer data, credentials, or proprietary algorithms into an AI prompt.
- [ ] **I am complying with my organization's AI policy.** I am using an approved tool in an approved manner.
- [ ] **I am giving proper credit.** If my team has a policy about disclosing AI use, I am following it.
- [ ] **I will maintain this code.** I am prepared to debug, update, and extend it as if I wrote it entirely myself.

### Common Ethical Concerns

**Concern: "Is it cheating to use AI?"**

Using AI tools is no different from using Stack Overflow, documentation, or autocomplete. The professional obligation is to understand and take responsibility for the code, not to type every character yourself.

**Concern: "Who owns AI-generated code?"**

This is an evolving legal question. In most professional settings, the code you commit to your employer's repository is owned by the employer, regardless of how it was generated. Consult your organization's policy for specifics.

**Concern: "What if the AI generates code from someone else's project?"**

LLMs are trained on public code, some of which has specific licenses. In practice, AI output for standard patterns (sorting, filtering, API handlers) is too generic to be attributable. For unusual or highly specific code, be cautious: if the AI output looks like a direct copy of a specific open-source project, verify the license.

**Concern: "What if I rely too heavily on AI and my skills atrophy?"**

Use AI as a productivity tool, not a crutch. Continue to write code without AI assistance regularly. Understand what the AI generates rather than treating it as a black box. The best developers use AI to go faster while maintaining deep understanding.

## Summary

- AI improves security when used deliberately: automated vulnerability detection, secure code generation (when prompted), and configuration auditing.
- AI creates security risks when used carelessly: insecure defaults, hardcoded secrets, injection vulnerabilities, overly permissive configurations, and data leakage through prompts.
- Apply the security review checklist to all AI-generated code: check authentication, input handling, configuration, data handling, and dependencies.
- Responsible AI use requires transparency, accountability, verification, privacy, and intellectual humility.
- The ethical-use checklist ensures you understand, test, and own every line of AI-generated code you commit.
- AI is a tool. You are the engineer. The responsibility for the code's correctness, security, and quality is yours.

## Additional Resources
- [OWASP -- Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
- [Microsoft -- Responsible AI Principles](https://www.microsoft.com/en-us/ai/responsible-ai)
- [NIST -- AI Risk Management Framework](https://www.nist.gov/artificial-intelligence/ai-risk-management-framework)
