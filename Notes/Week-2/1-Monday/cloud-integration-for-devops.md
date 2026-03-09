# Cloud Integration for DevOps

## Learning Objectives
- Explain how Azure Cloud services integrate with Azure Pipelines for build, test, and deploy workflows
- Identify the Azure services relevant to deploying a web application: App Service, Container Registry, and Resource Groups
- Understand the role of resource groups in organizing and managing cloud resources
- Recognize the importance of free-tier resources and cleanup procedures to avoid unexpected charges

## Why This Matters

DevOps without cloud infrastructure is like having a factory assembly line with no loading dock. You can build and test software efficiently, but it has nowhere to go. Cloud platforms like Azure provide the compute, storage, and networking resources that your CI/CD pipeline deploys to. This week, you will deploy the TaskFlow application to Azure App Service -- making it publicly accessible on the internet. Understanding how Azure services fit into the pipeline is essential for making that happen.

## The Concept

### Cloud and DevOps: The Connection

DevOps practices and cloud computing are deeply intertwined. The cloud provides three capabilities that make DevOps practical at scale:

**1. On-Demand Infrastructure**
Instead of purchasing, racking, and configuring physical servers, you provision cloud resources in minutes through a web portal, CLI, or code. This speed is essential for DevOps, where environments are created and destroyed as part of the pipeline.

**2. Pay-As-You-Go Pricing**
You pay only for what you use. This aligns with DevOps' emphasis on experimentation -- you can spin up a staging environment for testing, run your pipeline, and tear it down when you are done.

**3. Managed Services**
Cloud providers manage the underlying infrastructure (patching OS, scaling servers, ensuring uptime). This frees DevOps teams to focus on application delivery rather than server maintenance.

### Azure Services You Will Use This Week

This section covers the specific Azure services relevant to deploying TaskFlow. These are the services your pipeline will interact with.

#### Azure App Service

Azure App Service is a fully managed platform for hosting web applications. You deploy your code or container, and Azure handles the web server, scaling, TLS certificates, and operating system patches.

**Key characteristics:**

| Feature | Details |
|---------|---------|
| **What it hosts** | Web apps, REST APIs, mobile backends |
| **Supported runtimes** | .NET, Node.js, Python, Java, PHP, Ruby, and custom containers |
| **Free tier** | F1 plan: 60 CPU minutes/day, 1 GB RAM, shared infrastructure |
| **Custom domains** | Supported on paid tiers |
| **Deployment methods** | Azure Pipelines, GitHub Actions, FTP, local Git, Docker container |

For TaskFlow, you will deploy a Docker container to App Service using the **Web App for Containers** option. This means your pipeline builds the Docker image, pushes it to a registry, and tells App Service to pull and run it.

**The deployment flow:**

```
Pipeline builds Docker image
    |
    v
Image pushed to Azure Container Registry
    |
    v
App Service pulls the image and runs the container
    |
    v
TaskFlow is live at https://your-app.azurewebsites.net
```

#### Azure Container Registry (ACR)

Azure Container Registry is a private Docker registry hosted in Azure. It stores your Docker images so that other Azure services (like App Service) can pull and run them.

Think of ACR as a private version of Docker Hub, but integrated into the Azure ecosystem with Azure Active Directory authentication.

**Why use ACR instead of Docker Hub?**
- **Private by default:** Your images are not publicly accessible unless you explicitly allow it.
- **Integrated authentication:** Azure services authenticate to ACR automatically using managed identities.
- **Geographic proximity:** Your registry is in the same Azure region as your App Service, reducing image pull times.
- **Pipeline integration:** Azure Pipelines has built-in tasks for pushing to ACR.

**Free-tier note:** ACR's Basic tier costs approximately $0.17/day. For training purposes, you will create a registry, use it for the demo, and delete it afterward to minimize costs. Cleanup instructions are included in every demo and exercise.

#### Resource Groups

A **resource group** is a logical container for Azure resources. Every Azure resource (App Service, Container Registry, database, storage account) must belong to a resource group.

```
Resource Group: "taskflow-demo-rg"
    |-- App Service: "taskflow-demo-app"
    |-- App Service Plan: "taskflow-demo-plan"
    |-- Container Registry: "taskflowdemoacr"
```

**Why resource groups matter for this training:**

1. **Organization:** All resources for a project are grouped together and easy to find.
2. **Cost tracking:** You can see the cost of an entire resource group at once.
3. **Cleanup:** Deleting a resource group deletes all resources inside it. This is the fastest and safest way to ensure you are not billed for forgotten resources.

### Cloud Integration in the Pipeline

Here is how Azure cloud services plug into the CI/CD pipeline:

```
Stage 1: Build (CI)                  Stage 2: Push Image              Stage 3: Deploy (CD)
-----------------------              -------------------              ---------------------
- Install Node.js                    - Build Docker image             - Deploy container to
- npm ci                             - Push to Azure                    Azure App Service
- npm run lint                         Container Registry             - App is live at
- npm test                                                              *.azurewebsites.net
- npm run build
- Publish artifact
```

The pipeline uses **service connections** to authenticate with Azure. A service connection is a stored credential in Azure DevOps that allows the pipeline to interact with your Azure subscription without you manually entering passwords.

**Creating a service connection (conceptual):**

1. In Azure DevOps, go to Project Settings > Service Connections.
2. Create a new "Azure Resource Manager" connection.
3. Authenticate with your Azure account.
4. Select the subscription and resource group the pipeline should have access to.
5. The pipeline can now use this connection in tasks like `Docker@2` and `AzureWebAppContainer@1`.

### Free-Tier Strategy and Cost Awareness

Azure provides generous free tiers for learning and experimentation, but some services have costs even at the lowest tier. Here is the cost profile for what you will use this week:

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Azure DevOps | Basic (5 users) | Free | Includes Repos, Boards, Pipelines (1 parallel job) |
| Azure App Service | F1 (Free) | Free | 60 CPU minutes/day, 1 GB memory, no custom domain |
| Azure Container Registry | Basic | ~$5/month | Lowest paid tier; no free tier available |
| Microsoft-hosted agents | 1 parallel job | Free | Limited free minutes for private projects |

**Cost mitigation rules for this training:**

1. **Create resources at the start of the exercise, delete them at the end.** Do not leave resources running overnight.
2. **Use a single resource group.** This makes cleanup a one-command operation: `az group delete --name taskflow-demo-rg --yes --no-wait`.
3. **Verify deletion.** After cleanup, check the Azure portal to confirm the resource group no longer appears.

### Infrastructure as Code (Preview)

While you will create Azure resources through the portal and CLI this week, it is worth noting that in production environments, resources are often defined in code -- just like the pipeline itself. Tools for this include:

- **Azure CLI scripts** (what you will use)
- **ARM Templates** (Azure-native JSON/Bicep)
- **Terraform** (multi-cloud infrastructure-as-code)

We will not go deep into Infrastructure as Code this week, but the principle is the same as pipeline-as-code: define everything in version-controlled files, not through manual portal clicks.

## Code Example

Here is how the Azure CLI is used to create the resources your pipeline will deploy to:

```bash
# Create a resource group (the container for everything)
az group create \
  --name taskflow-demo-rg \
  --location eastus

# Create an Azure Container Registry
az acr create \
  --resource-group taskflow-demo-rg \
  --name taskflowdemoacr \
  --sku Basic \
  --admin-enabled true

# Create an App Service Plan (free tier)
az appservice plan create \
  --resource-group taskflow-demo-rg \
  --name taskflow-demo-plan \
  --is-linux \
  --sku F1

# Create a Web App for Containers
az webapp create \
  --resource-group taskflow-demo-rg \
  --plan taskflow-demo-plan \
  --name taskflow-demo-app \
  --deployment-container-image-name taskflowdemoacr.azurecr.io/taskflow:latest

# ========================
# CLEANUP (run after demo)
# ========================
az group delete --name taskflow-demo-rg --yes --no-wait
```

These commands create everything needed for deployment. The final command destroys everything in one step.

## Summary

- Azure Cloud services provide the infrastructure that DevOps pipelines deploy to.
- **Azure App Service** hosts the running application for public access (free F1 tier available).
- **Azure Container Registry** stores Docker images privately within the Azure ecosystem.
- **Resource Groups** organize all resources for a project and enable one-command cleanup.
- **Service connections** in Azure DevOps allow pipelines to authenticate with Azure securely.
- Always use free or minimal-cost tiers for training, and always run cleanup commands (`az group delete`) to avoid charges.

## Additional Resources
- [Microsoft Learn -- Azure App Service Overview](https://learn.microsoft.com/en-us/azure/app-service/overview)
- [Microsoft Learn -- Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro)
- [Microsoft Learn -- Manage Resource Groups](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)
