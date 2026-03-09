# Azure Pipelines Architecture

## Learning Objectives
- Identify the structural components of an Azure Pipeline: Stages, Jobs, Steps, and Tasks
- Understand the role of Agents and Agent Pools in pipeline execution
- Read and write annotated Azure Pipelines YAML with confidence
- Explain how pipeline components nest and relate to each other

## Why This Matters

When you look at an `azure-pipelines.yml` file for the first time, the hierarchy of keywords -- `stages`, `jobs`, `steps`, `task`, `script` -- can be disorienting. This document breaks down the architecture so that when you write or modify pipeline YAML this week, you understand what each layer does and why it exists. Knowing the architecture also helps you debug pipeline failures, because each layer reports its own status.

## The Concept

### The Pipeline Hierarchy

An Azure Pipeline is structured as a hierarchy of nested components. From outermost to innermost:

```
Pipeline
  |-- Stage (logical grouping, e.g., "Build", "Test", "Deploy")
  |     |-- Job (a unit of work that runs on one agent)
  |     |     |-- Step (a single action within a job)
  |     |     |     |-- task: (a pre-built Azure DevOps task, e.g., NodeTool@0)
  |     |     |     |-- script: (a custom shell command)
  |     |     |     |-- bash: / powershell: / pwsh: (shell-specific commands)
```

Think of it like a project plan:
- **Stages** are milestones ("Build the house", "Inspect the house").
- **Jobs** are work crews ("Foundation crew", "Electrical crew").
- **Steps** are individual tasks each crew member performs ("Pour concrete", "Wire the outlets").

### Stages

A **stage** is a logical division of the pipeline. Stages run sequentially by default, though you can configure them to run in parallel or with dependencies.

```yaml
stages:
  - stage: Build
    displayName: "Build and Test"
    jobs:
      - job: BuildJob
        steps:
          - script: echo "Building..."

  - stage: Deploy
    displayName: "Deploy to Azure"
    dependsOn: Build          # Runs only after Build succeeds
    jobs:
      - job: DeployJob
        steps:
          - script: echo "Deploying..."
```

**Common stage patterns:**

| Stage Name | Purpose |
|------------|---------|
| Build | Compile/bundle the application, run linting |
| Test | Execute unit and integration tests |
| Publish | Package and store the build artifact |
| DeployStaging | Deploy to a staging environment |
| DeployProduction | Deploy to production (often with an approval gate) |

**When you do not need stages:** For simple pipelines with a single purpose (build and test only), you can omit the `stages` keyword entirely and define `jobs` or even just `steps` at the top level. Azure Pipelines infers a single implicit stage.

### Jobs

A **job** is a collection of steps that execute on a single agent. Each job runs on a fresh agent instance, meaning jobs are isolated from each other.

```yaml
jobs:
  - job: UnitTests
    displayName: "Run Unit Tests"
    steps:
      - script: npm test

  - job: LintCheck
    displayName: "Run Linter"
    steps:
      - script: npm run lint
```

**Key properties of jobs:**

- **Isolation:** Each job gets a clean environment. Files created in one job are not available in another unless you use artifacts.
- **Parallelism:** Jobs within the same stage run in parallel by default (unless you specify `dependsOn`).
- **Conditions:** You can conditionally skip a job using the `condition` keyword.

**When you do not need jobs:** For simple pipelines, you can omit the `jobs` keyword and define `steps` directly. Azure Pipelines creates an implicit single job.

### Steps

A **step** is the smallest unit of work in a pipeline. Each step is either a **task** (a pre-built action) or a **script** (a custom command).

```yaml
steps:
  # A task: pre-built, maintained by Microsoft or the community
  - task: NodeTool@0
    inputs:
      versionSpec: "18.x"
    displayName: "Install Node.js 18"

  # A script: runs a shell command
  - script: npm ci
    displayName: "Install dependencies"

  # A script with multiple commands
  - script: |
      npm run lint
      npm test
    displayName: "Lint and test"
```

**Tasks vs. Scripts:**

| Feature | `task:` | `script:` |
|---------|---------|-----------|
| **Source** | Pre-built modules from Azure DevOps Marketplace | Inline shell commands you write |
| **Versioned** | Yes (`TaskName@Version`, e.g., `NodeTool@0`) | No -- whatever you type runs |
| **Inputs** | Structured YAML inputs | Command-line arguments |
| **Use when** | A well-maintained task exists for the action | You need custom or simple commands |

**Common tasks you will use this week:**

| Task | Purpose |
|------|---------|
| `NodeTool@0` | Install a specific Node.js version |
| `PublishPipelineArtifact@1` | Save build outputs for use in later stages |
| `Docker@2` | Build, push, or run Docker images |
| `AzureWebAppContainer@1` | Deploy a container to Azure App Service |

### Agents and Agent Pools

An **agent** is the machine that executes your pipeline. Azure DevOps provides two types:

**Microsoft-Hosted Agents:**
- Pre-configured virtual machines managed by Microsoft.
- Available images: `ubuntu-latest`, `windows-latest`, `macos-latest`.
- Each job gets a fresh VM. After the job completes, the VM is destroyed.
- No maintenance required on your end.

```yaml
pool:
  vmImage: "ubuntu-latest"   # Use a Microsoft-hosted Ubuntu agent
```

**Self-Hosted Agents:**
- Machines you configure and manage yourself (physical servers, VMs, containers).
- Useful when you need specific software, network access, or persistent state between runs.
- Registered to a named **agent pool**.

```yaml
pool:
  name: "my-private-pool"    # Use a self-hosted agent pool
```

For this week's demos and exercises, you will use **Microsoft-hosted agents** (`ubuntu-latest`). They are free for public projects and include a limited free tier for private projects.

### Putting It All Together

Here is a fully annotated pipeline YAML that demonstrates every architectural layer:

```yaml
# ===========================================================
# Pipeline for TaskFlow: Build, Test, and Deploy
# ===========================================================

# TRIGGER: When does this pipeline run?
trigger:
  - main                    # Run on every push to the 'main' branch

# AGENT POOL: Where does this pipeline run?
pool:
  vmImage: "ubuntu-latest"  # Microsoft-hosted Ubuntu VM

# ===========================================================
# STAGES: The high-level phases of this pipeline
# ===========================================================
stages:

  # ----- Stage 1: Build and Test -----
  - stage: Build
    displayName: "Build and Test"
    jobs:
      - job: BuildAndTest
        displayName: "Install, Lint, Test, Build"
        steps:

          # Step 1: Install Node.js (Task)
          - task: NodeTool@0
            inputs:
              versionSpec: "18.x"
            displayName: "Install Node.js 18"

          # Step 2: Install project dependencies (Script)
          - script: npm ci
            displayName: "Install dependencies"

          # Step 3: Run the linter (Script)
          - script: npm run lint
            displayName: "Lint code"

          # Step 4: Run unit tests (Script)
          - script: npm test
            displayName: "Run unit tests"

          # Step 5: Build the application (Script)
          - script: npm run build
            displayName: "Build TaskFlow"

          # Step 6: Publish the build output (Task)
          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: "dist"
              artifactName: "taskflow-dist"
            displayName: "Publish dist/ artifact"

  # ----- Stage 2: Deploy to Staging -----
  - stage: DeployStaging
    displayName: "Deploy to Staging"
    dependsOn: Build           # Only run after Build succeeds
    condition: succeeded()     # Only if the previous stage passed
    jobs:
      - deployment: StagingDeploy
        displayName: "Deploy to Azure App Service"
        environment: "staging"   # Named environment with optional approvals
        strategy:
          runOnce:
            deploy:
              steps:
                - script: echo "Deploying to staging environment..."
                  displayName: "Deploy"
```

### Reading a Pipeline Failure

When a pipeline fails, the Azure DevOps UI shows you exactly where:

```
Pipeline Run #47 -- FAILED
  |-- Stage: Build -- PASSED
  |     |-- Job: BuildAndTest -- PASSED
  |           |-- Step: Install Node.js 18 -- PASSED
  |           |-- Step: Install dependencies -- PASSED
  |           |-- Step: Lint code -- FAILED    <-- Problem is here
  |           |-- Step: Run unit tests -- SKIPPED (previous step failed)
  |           |-- Step: Build TaskFlow -- SKIPPED
  |-- Stage: DeployStaging -- SKIPPED (Build stage failed)
```

Because every layer reports its status independently, you can pinpoint the exact step that failed and read its logs. This hierarchical reporting is one of the key benefits of the staged architecture.

## Summary

- Azure Pipelines use a nested hierarchy: **Pipeline > Stage > Job > Step**.
- **Stages** are logical groups (Build, Deploy). They run sequentially by default.
- **Jobs** are units of work that run on an agent. Jobs within a stage can run in parallel.
- **Steps** are individual actions: either pre-built **tasks** or custom **scripts**.
- **Agents** execute the pipeline. Microsoft-hosted agents (`ubuntu-latest`) require zero setup.
- For simple pipelines, you can omit `stages` and `jobs` -- Azure Pipelines infers them.
- The hierarchical architecture makes failures easy to pinpoint: you can trace a failure to a specific step in a specific job.

## Additional Resources
- [Microsoft Learn -- Azure Pipelines Key Concepts](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts)
- [Microsoft Learn -- YAML Pipeline Schema Reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)
- [Microsoft Learn -- Microsoft-Hosted Agents](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/hosted)
