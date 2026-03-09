# Azure DevOps Services

## Learning Objectives
- Identify the core services in the Azure DevOps suite: Azure Boards, Azure Repos, and Azure Pipelines
- Describe how each service contributes to the software delivery lifecycle
- Explain how the three services integrate to create a unified project workflow
- Navigate the Azure DevOps portal interface at a conceptual level

## Why This Matters

Azure DevOps is the platform you will use throughout this week to host your code, automate your builds, and deploy your applications. While there are competing platforms (GitHub, GitLab, Jenkins), Azure DevOps provides an integrated suite where project management, source control, and CI/CD live under one roof. Understanding what each service does -- and how they connect -- ensures you are not just following steps blindly but understanding why the platform is structured the way it is.

## The Concept

### Azure DevOps at a Glance

Azure DevOps is a cloud-hosted platform by Microsoft that provides a complete set of development tools for planning, building, testing, and deploying software. It is available as a cloud service (Azure DevOps Services) and an on-premises product (Azure DevOps Server, formerly TFS).

The platform is organized into **projects**. Each project is a container for a team's work and includes access to all of the services described below.

### Azure Boards

Azure Boards is the project management and work-tracking service. It provides tools for planning sprints, tracking user stories, managing bugs, and visualizing workflow.

**Key features:**

- **Work Items:** The fundamental unit -- a user story, task, bug, epic, or feature. Each work item has a title, description, assignee, state (New, Active, Resolved, Closed), and links to code changes.
- **Backlogs:** Ordered lists of work items, organized by iteration (sprint). Teams can drag and drop items to prioritize.
- **Sprint Boards:** Kanban-style boards that show work items moving through columns (To Do, In Progress, Done). Useful during daily standups.
- **Queries:** Custom filters to find work items matching specific criteria (e.g., "all open bugs assigned to me").

**How it connects to the lifecycle:**

Azure Boards is the **Plan** phase of the DevOps lifecycle. It answers the question: "What are we building, and who is responsible?"

```
Azure Boards (Plan)
    |
    v
"Build feature X" --> Developer starts coding in Azure Repos
```

### Azure Repos

Azure Repos is the source-control service. It provides Git repositories (or Team Foundation Version Control, though Git is the modern standard) for storing and managing code.

**Key features:**

- **Git Repositories:** Full-featured Git hosting. Each project can have multiple repositories.
- **Branch Policies:** Rules that protect important branches. For example, you can require that:
  - All changes to `main` go through a Pull Request.
  - At least one reviewer approves the PR.
  - A CI build passes before the PR can be merged.
- **Pull Requests (PRs):** A formal process for reviewing code changes before they are merged. PRs include file diffs, inline comments, approval workflows, and links to related work items.
- **Branch Management:** Create feature branches, view branch history, compare branches, and delete merged branches from the web UI.

**How it connects to the lifecycle:**

Azure Repos is the **Code** phase. It answers: "Where does the code live, and how do we control changes to it?"

```
Azure Boards (Plan) --> Azure Repos (Code)
                            |
                            v
                        Developer pushes code --> triggers Azure Pipelines
```

### Azure Pipelines

Azure Pipelines is the CI/CD service. It automates building, testing, and deploying code whenever changes are pushed to a repository.

**Key features:**

- **YAML Pipelines:** Pipeline definitions written in YAML and stored in the repository (pipeline-as-code). This is the modern, recommended approach.
- **Classic Pipelines:** A legacy GUI-based editor for defining pipelines. Still available but not recommended for new projects.
- **Hosted Agents:** Microsoft-managed virtual machines (Ubuntu, Windows, macOS) that execute pipeline steps. No infrastructure to maintain.
- **Self-Hosted Agents:** You can also run pipeline agents on your own machines if you need specific software or network access.
- **Triggers:** Pipelines can be triggered by code pushes, PR creation, schedule (cron), or manually.
- **Artifacts:** Build outputs (compiled code, Docker images, test reports) can be published as pipeline artifacts for use in later stages.
- **Environments and Approvals:** Define deployment targets (staging, production) with approval gates and rollback capabilities.

**How it connects to the lifecycle:**

Azure Pipelines covers **Build, Test, Release, and Deploy**. It answers: "How does code go from a repository to a running application?"

```
Azure Boards (Plan) --> Azure Repos (Code) --> Azure Pipelines (Build, Test, Deploy)
```

### How They Work Together

The real power of Azure DevOps emerges when the three services are used in concert. Here is a typical workflow for the TaskFlow project:

**Step 1: Plan**
A product owner creates a work item in Azure Boards: "Add a dashboard summary component." The work item is assigned to a developer and placed in the current sprint.

**Step 2: Code**
The developer creates a feature branch in Azure Repos: `feature/dashboard-summary`. They write the code, commit, and push to the remote.

**Step 3: Build and Test (CI)**
The push triggers an Azure Pipeline. The pipeline installs dependencies, runs linting, executes unit tests, and builds the application. If the build passes, a green status is reported.

**Step 4: Code Review**
The developer opens a Pull Request in Azure Repos, linking it to the work item from Step 1. The PR shows the code diff and the pipeline status (green/red). A teammate reviews the code and approves.

**Step 5: Merge and Deploy**
The PR is merged to `main`. This triggers the pipeline again, this time including a deployment stage that pushes the application to Azure App Service.

**Step 6: Close the Loop**
The work item in Azure Boards is automatically moved to "Closed" (or the developer updates it manually). The feature is live.

```
Azure Boards          Azure Repos              Azure Pipelines
-----------          -----------              ---------------
[Work Item] -------> [Feature Branch] -------> [CI Build: Pass]
                     [Pull Request]                |
                     [Code Review]                 |
                     [Merge to main] -----------> [CD Deploy: Live]
[Work Item: Closed] <----------------------------------------------------
```

### Other Azure DevOps Services (Brief Mentions)

Azure DevOps includes additional services that you may encounter but are outside the scope of this week:

- **Azure Test Plans:** Manual and exploratory testing tools.
- **Azure Artifacts:** Package management (npm, NuGet, Maven feeds). Useful for sharing libraries across projects.

These exist within the same portal and can be accessed from the project sidebar.

### Navigating the Portal

When you log into Azure DevOps (`dev.azure.com`), the layout is organized as follows:

```
Organization
  |-- Project 1
  |     |-- Overview (wiki, dashboards)
  |     |-- Boards (work items, sprints)
  |     |-- Repos (code, PRs, branches)
  |     |-- Pipelines (builds, releases)
  |     |-- Test Plans
  |     |-- Artifacts
  |
  |-- Project 2
        |-- ...
```

Each service is accessible via the left-hand navigation bar within a project. You will interact with Repos and Pipelines most frequently this week.

## Code Example

The integration between services is most visible in a `azure-pipelines.yml` file stored in Azure Repos that defines an Azure Pipeline:

```yaml
# This file lives in Azure Repos (source control)
# It defines an Azure Pipeline (CI/CD)
# It can be linked to Azure Boards work items via commit messages

trigger:
  - main

pool:
  vmImage: "ubuntu-latest"

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "18.x"
    displayName: "Install Node.js"

  - script: npm ci
    displayName: "Install dependencies"

  - script: npm run lint
    displayName: "Lint"

  - script: npm test
    displayName: "Run tests"

  - script: npm run build
    displayName: "Build TaskFlow"

  - task: PublishPipelineArtifact@1
    inputs:
      targetPath: "dist"
      artifactName: "taskflow-dist"
    displayName: "Publish build artifact"
```

When a developer commits with a message like `"Fixes AB#42: Add dashboard summary"`, Azure DevOps automatically links the commit to work item #42 in Azure Boards, closing the loop between code and planning.

## Summary

- **Azure Boards** handles project management: work items, sprints, and backlogs (the Plan phase).
- **Azure Repos** provides Git hosting with branch policies and pull requests (the Code phase).
- **Azure Pipelines** automates CI/CD: build, test, and deploy (the Build through Deploy phases).
- The three services integrate tightly -- code pushes trigger pipelines, PRs show build status, and commit messages link back to work items.
- Azure DevOps organizes everything under Organizations and Projects, accessible through a single web portal.

## Additional Resources
- [Microsoft Learn -- What is Azure DevOps?](https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops)
- [Azure DevOps Documentation -- Azure Repos](https://learn.microsoft.com/en-us/azure/devops/repos/git/gitworkflow)
- [Azure DevOps Documentation -- Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines)
