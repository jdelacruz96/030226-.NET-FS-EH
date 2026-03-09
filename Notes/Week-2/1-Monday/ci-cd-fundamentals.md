# CI/CD Fundamentals

## Learning Objectives
- Define Continuous Integration, Continuous Delivery, and Continuous Deployment
- Distinguish between Continuous Delivery and Continuous Deployment
- Explain the benefits of each practice and why they matter for team velocity
- Understand the pipeline-as-code philosophy and why YAML-defined pipelines are the industry standard

## Why This Matters

CI/CD is the engine that turns DevOps principles into action. Without automation, every deployment is a manual, error-prone event that teams dread. With CI/CD, deployments become routine, low-risk, and even boring -- which is exactly what you want. This week, you will build a CI/CD pipeline that takes the TaskFlow application from a local repository to a live Azure URL. Understanding the theory behind CI, CD, and pipeline-as-code ensures you know *why* every step in that pipeline exists.

## The Concept

### Continuous Integration (CI)

Continuous Integration is the practice of frequently merging code changes into a shared repository, where each merge triggers an automated build and test process.

**The rules of CI:**

1. **Commit frequently.** Developers push small changes multiple times per day, not large batches once a week.
2. **Build on every commit.** An automated process compiles the code (or bundles it, in the case of a JavaScript/TypeScript application like TaskFlow) every time new code is pushed.
3. **Test on every commit.** Automated tests (unit tests, linting, static analysis) run as part of the build. If tests fail, the build is marked as broken.
4. **Fix broken builds immediately.** A red build is the team's top priority. The longer a broken build sits, the more it blocks everyone.

**What CI catches:**

| Problem | Without CI | With CI |
|---------|-----------|---------|
| Merge conflicts | Discovered days later during a big merge | Caught within minutes of the conflicting push |
| Broken tests | Found during a manual QA phase weeks later | Found immediately, tied to the exact commit |
| Lint violations | Caught in code review (maybe) | Caught automatically before code review |
| Build failures | Discovered when someone tries to deploy | Caught on every push |

**CI in the context of TaskFlow:**

When you push code to the TaskFlow repository, the CI pipeline will:
1. Install Node.js on a build agent
2. Run `npm ci` to install dependencies
3. Run `npm run lint` to check code style
4. Run `npm test` to execute unit tests
5. Run `npm run build` to produce the `dist/` folder

If any step fails, the pipeline stops and reports the failure. This is CI.

### Continuous Delivery (CD -- Delivery)

Continuous Delivery extends CI by ensuring that every successful build produces a deployable artifact and that the software *can* be released to production at any time.

The key word is "can." In Continuous Delivery, deployment to production still requires a manual approval step -- a human presses the button. But the software is always in a state where pressing that button is safe.

**What Continuous Delivery adds to CI:**

- The build artifact (e.g., the `dist/` folder or a Docker image) is packaged and stored.
- The artifact is deployed to a staging or pre-production environment automatically.
- Automated tests run against the staging environment (integration tests, smoke tests).
- If everything passes, the artifact is *ready* for production. A human decides when.

```
Code Push --> Build --> Test --> Package --> Deploy to Staging --> [Manual Gate] --> Production
```

### Continuous Deployment (CD -- Deployment)

Continuous Deployment goes one step further: every change that passes all automated tests is deployed to production automatically, with no human intervention.

```
Code Push --> Build --> Test --> Package --> Deploy to Staging --> Auto-deploy to Production
```

**Continuous Delivery vs. Continuous Deployment:**

| Aspect | Continuous Delivery | Continuous Deployment |
|--------|--------------------|-----------------------|
| **Production deployment** | Manual trigger (human decision) | Fully automated |
| **Confidence required** | High test coverage recommended | Very high test coverage required |
| **Release frequency** | On-demand (could be daily, weekly) | Every passing commit |
| **Risk level** | Lower -- human review before release | Requires robust monitoring and rollback |
| **Common in** | Regulated industries, enterprise teams | SaaS companies, startups with strong testing |

Neither is inherently better. The right choice depends on the organization's risk tolerance, regulatory requirements, and test maturity. Many teams start with Continuous Delivery and evolve toward Continuous Deployment as their confidence in their test suite grows.

### Benefits of CI/CD

**Faster feedback:** Developers learn about problems within minutes, not days. This reduces the cost of fixing bugs because the context is still fresh.

**Smaller, safer changes:** Frequent, incremental deployments mean each release contains fewer changes. When something breaks, the blast radius is small and the cause is easy to identify.

**Reduced manual effort:** Automated pipelines eliminate repetitive tasks like running tests, building artifacts, and copying files to servers. Engineers spend time on creative work, not toil.

**Higher confidence:** A green pipeline means the code compiles, tests pass, and the artifact is deployable. The team can trust the process.

**Faster time to market:** Features reach users sooner. The business can respond to market changes quickly rather than waiting for a quarterly release window.

### Pipeline as Code

In early CI/CD systems, pipeline configurations were defined through web UIs -- clicking through forms to set up build steps. This approach had serious problems:

- **No version control.** Pipeline changes were not tracked. If someone broke the pipeline config, there was no way to diff or revert.
- **No code review.** Pipeline changes bypassed the team's review process.
- **No reproducibility.** Setting up a new project meant manually clicking through the same forms again.

**Pipeline-as-code** solves all of these by defining the pipeline in a file (YAML, typically) that lives alongside the application code in the same repository.

```yaml
# This file IS the pipeline definition
# It is version-controlled, reviewable, and reproducible
trigger:
  - main

pool:
  vmImage: "ubuntu-latest"

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "18.x"

  - script: npm ci
    displayName: "Install dependencies"

  - script: npm test
    displayName: "Run tests"

  - script: npm run build
    displayName: "Build application"
```

**Advantages of pipeline-as-code:**

1. **Version controlled:** The pipeline definition has a full Git history. You can see who changed it, when, and why.
2. **Peer reviewed:** Pipeline changes go through the same pull request process as application code.
3. **Portable:** The YAML file can be used to set up the same pipeline in a new project in seconds.
4. **Self-documenting:** The pipeline file describes exactly what happens during a build. There is no hidden configuration in a web UI.
5. **Branch-aware:** Different branches can have different pipeline configurations, enabling experimentation without affecting other teams.

### The CI/CD Pipeline as a Safety Net

Think of a CI/CD pipeline as a series of gates. Code must pass through each gate before it can proceed:

```
Gate 1: Compile/Build       --> Does the code even produce a valid output?
Gate 2: Lint                --> Does the code follow style and quality rules?
Gate 3: Unit Tests          --> Do individual functions behave correctly?
Gate 4: Integration Tests   --> Do components work together?
Gate 5: Security Scan       --> Are there known vulnerabilities?
Gate 6: Package/Artifact    --> Can we produce a deployable bundle?
Gate 7: Deploy to Staging   --> Does it run in a real environment?
Gate 8: Approval (optional) --> Does a human say "go"?
Gate 9: Deploy to Production
```

Not every pipeline has all of these gates, and the specific gates depend on the project. But the principle is the same: automate everything you can, and make the pipeline the single path from code to production.

## Code Example

A more complete pipeline-as-code example for the TaskFlow application, showing the progression from CI to CD:

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: "ubuntu-latest"

# --- CI Stage ---
stages:
  - stage: Build
    displayName: "Build and Test"
    jobs:
      - job: BuildJob
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
            displayName: "Unit tests"

          - script: npm run build
            displayName: "Build"

          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: "dist"
              artifactName: "taskflow-build"
            displayName: "Publish build artifact"

  # --- CD Stage (Delivery) ---
  - stage: Deploy
    displayName: "Deploy to Staging"
    dependsOn: Build
    jobs:
      - deployment: DeployStaging
        environment: "staging"
        strategy:
          runOnce:
            deploy:
              steps:
                - script: echo "Deploying to staging..."
                  displayName: "Deploy artifact to staging environment"
```

The `Build` stage is CI. The `Deploy` stage is CD. Together, they form the pipeline.

## Summary

- **Continuous Integration (CI)** automates building and testing code on every commit, catching problems early.
- **Continuous Delivery** ensures that every successful build is deployable to production, with a manual approval gate.
- **Continuous Deployment** removes the manual gate, deploying every passing change automatically.
- **Pipeline-as-code** defines the CI/CD process in a YAML file stored in the repository, making it version-controlled, reviewable, and portable.
- The pipeline is a series of automated gates that provide confidence in every release.

## Additional Resources
- [Microsoft Learn -- What is CI/CD?](https://learn.microsoft.com/en-us/devops/deliver/what-is-continuous-delivery)
- [Martin Fowler -- Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)
- [Azure Pipelines YAML Schema Reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)
