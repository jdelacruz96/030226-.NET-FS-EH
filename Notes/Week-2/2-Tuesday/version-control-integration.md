# Version Control Integration

## Learning Objectives
- Describe common Git branching strategies: GitFlow and trunk-based development
- Explain how pull requests enable code review and quality enforcement
- Configure branch policies in Azure Repos to protect critical branches
- Understand the role of code review in a DevOps workflow

## Why This Matters

Version control is more than a place to store code -- it is the foundation of collaboration and quality control in a DevOps team. How you branch, review, and merge directly affects how fast you can deliver features and how many bugs reach production. Yesterday you learned about Azure Repos as a service. Today, we go deeper into *how* teams use Git within Azure Repos to manage changes safely and efficiently.

## The Concept

### Git Branching: The Core Idea

In Git, a branch is a lightweight pointer to a commit. Branching allows multiple developers to work on different features simultaneously without stepping on each other's code. When work is complete, branches are merged back together.

```
main ────o────o────o────o────o────o
               \              /
feature/add-dashboard ──o──o──o
```

The question is not *whether* to use branches -- every professional team does. The question is *how* to organize them. That is where branching strategies come in.

### GitFlow

GitFlow is a branching model introduced by Vincent Driessen in 2010. It defines a strict workflow with multiple long-lived and short-lived branches.

**Branch types in GitFlow:**

| Branch | Lifetime | Purpose |
|--------|----------|---------|
| `main` | Permanent | Always reflects production-ready code |
| `develop` | Permanent | Integration branch for features |
| `feature/*` | Temporary | One per feature, branched from `develop` |
| `release/*` | Temporary | Prep for a release (versioning, final fixes) |
| `hotfix/*` | Temporary | Emergency fixes branched from `main` |

**The GitFlow workflow:**

```
main ──────o─────────────────────o──── (tagged release)
            \                   /
develop ─────o───o───o───o───o─o────
              \     /       \  /
feature/A ─────o──o     feature/B ──o
```

1. Developers create `feature/*` branches from `develop`.
2. Completed features are merged back to `develop` via pull request.
3. When ready for release, a `release/*` branch is created from `develop`.
4. The release branch is tested, finalized, and merged to both `main` and `develop`.
5. Emergency patches use `hotfix/*` branches from `main`, merged back to both `main` and `develop`.

**When GitFlow works well:**
- Projects with scheduled release cycles (e.g., monthly releases).
- Large teams where parallel development on many features is common.
- Products that maintain multiple versions simultaneously.

**When GitFlow is overkill:**
- Small teams deploying continuously.
- Projects that ship every commit or multiple times per day.
- Single-version SaaS applications.

### Trunk-Based Development

Trunk-based development is a simpler model where all developers commit to a single branch (`main` or `trunk`) frequently -- ideally multiple times per day.

**Rules of trunk-based development:**

1. There is one main branch. It is always in a deployable state.
2. Feature branches exist but are very short-lived (hours, not weeks).
3. Developers integrate their changes into the trunk frequently to avoid long-lived branches.
4. Feature flags (not branches) are used to hide incomplete work from users.

```
main ──o──o──o──o──o──o──o──o──o──o──
         \  /     \  /       \  /
         (short feature branches)
```

**When trunk-based development works well:**
- Teams with a fast CI/CD pipeline (this is where your pipeline from Monday comes in).
- Small to medium teams where coordination overhead is low.
- SaaS applications deploying continuously.
- Teams that want to reduce merge conflicts by integrating early and often.

**Comparison:**

| Aspect | GitFlow | Trunk-Based |
|--------|---------|-------------|
| Branch count | Many long-lived branches | One main branch, short-lived feature branches |
| Merge frequency | Features accumulated, merged periodically | Merged multiple times per day |
| Release process | Explicit release branches | Every commit to main is releasable |
| Complexity | Higher | Lower |
| Risk of merge conflicts | Higher (long-lived branches diverge) | Lower (frequent integration) |
| Best for | Scheduled releases, large teams | Continuous deployment, small-to-mid teams |

Most modern DevOps teams lean toward trunk-based development because it aligns with CI/CD principles: integrate early, deploy frequently, keep the main branch releasable.

### Pull Requests

A **pull request** (PR) is a request to merge changes from one branch into another. It serves as a checkpoint where code is reviewed, tested, and approved before it enters the target branch.

**Anatomy of a pull request in Azure Repos:**

1. **Title and Description:** A summary of what changed and why.
2. **File Diff:** A line-by-line view of every file that was added, modified, or deleted.
3. **Inline Comments:** Reviewers leave comments on specific lines of code.
4. **Build Status:** The CI pipeline runs automatically and reports pass/fail directly on the PR.
5. **Work Item Links:** The PR can be linked to Azure Boards work items (e.g., `Fixes AB#42`).
6. **Approval Status:** One or more reviewers approve (or request changes).

**Why PRs matter in DevOps:**

- They are the primary mechanism for **code review** -- catching bugs, enforcing patterns, and sharing knowledge.
- They integrate with the CI pipeline, ensuring that only tested code is merged.
- They create a documented history of decisions: why a change was made, who reviewed it, and what feedback was given.

### Branch Policies

Azure Repos allows you to enforce **branch policies** on protected branches (typically `main`). These policies prevent code from being merged unless specific criteria are met.

**Common branch policies:**

| Policy | What It Enforces |
|--------|-----------------|
| **Require pull request** | Changes to `main` must go through a PR (no direct commits) |
| **Minimum reviewers** | At least N people must approve the PR (commonly 1 or 2) |
| **Build validation** | A CI build must pass before the PR can be completed |
| **Comment resolution** | All review comments must be resolved |
| **Work item linking** | The PR must be linked to at least one Azure Boards work item |

**How to configure branch policies (Azure Repos):**

1. Navigate to Repos > Branches.
2. Find the `main` branch and click the three-dot menu > Branch Policies.
3. Enable the desired policies.
4. Save.

Once configured, any PR targeting `main` must satisfy all policies before the "Complete" button becomes available. This is automation enforcing quality -- a core DevOps principle.

### Code Review Best Practices

Effective code review is a skill that benefits the reviewer as much as the author:

**For authors:**
- Keep PRs small. Aim for fewer than 400 lines of changes. Large PRs get rubber-stamped, not reviewed.
- Write a clear description explaining *what* changed and *why*.
- Self-review your diff before requesting review. Catch the obvious issues yourself.

**For reviewers:**
- Focus on logic, correctness, and design -- not just formatting (linting tools handle that).
- Ask questions rather than making demands. "Why did you choose this approach?" is more productive than "Change this."
- Approve promptly. Blocking a PR for days without feedback slows the entire team.
- Distinguish between "must fix" and "nice to have" comments.

**For the team:**
- Agree on review turnaround expectations (e.g., review within 4 hours).
- Rotate reviewers to spread knowledge across the team.
- Use automated tools (linting, testing, static analysis) to handle mechanical checks so humans can focus on design-level review.

## Code Example

A practical illustration of a workflow using branch policies and PRs:

```bash
# Developer creates a feature branch from main
git checkout main
git pull origin main
git checkout -b feature/dashboard-filter

# Developer makes changes and commits
git add .
git commit -m "Add filter component to dashboard - Fixes AB#15"

# Developer pushes the branch to Azure Repos
git push origin feature/dashboard-filter
```

At this point, the developer opens a Pull Request in the Azure Repos web UI. The branch policy configuration ensures:

1. The CI pipeline runs automatically against the feature branch.
2. At least one reviewer must approve.
3. The build must pass before the PR can be completed.

Once all conditions are met, the PR is completed and the feature branch is merged to `main`.

## Summary

- **GitFlow** uses multiple long-lived branches and is suited for scheduled release cycles and large teams.
- **Trunk-based development** keeps a single main branch with short-lived feature branches and aligns with CI/CD practices.
- **Pull requests** are the quality gate between branches, combining code review with automated testing.
- **Branch policies** in Azure Repos automate quality enforcement: requiring PRs, reviewers, and passing builds before merges.
- Effective code review focuses on logic and design, keeps PRs small, and leverages automation for mechanical checks.

## Additional Resources
- [Microsoft Learn -- Branch Policies in Azure Repos](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies)
- [Atlassian -- Comparing Git Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Trunk Based Development](https://trunkbaseddevelopment.com/)
