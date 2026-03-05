# Cloud Computing Service Types

## Learning Objectives
- Define IaaS, PaaS, SaaS, and FaaS
- Identify real-world provider examples for each service type
- Understand the shared responsibility model across service types

## Why This Matters

Cloud service types determine how much infrastructure you manage versus how much the provider handles. Choosing the right service type affects development speed, operational burden, cost, and flexibility. As a React developer deploying to the cloud, understanding these layers helps you choose the right platform for your application.

## The Concept

### The Cloud Service Stack

Cloud services are layered, from raw infrastructure at the bottom to fully managed applications at the top:

```
+-------------------------------------------+
| SaaS (Software as a Service)              |  Gmail, Slack, Salesforce
+-------------------------------------------+
| FaaS (Function as a Service)              |  AWS Lambda, Azure Functions
+-------------------------------------------+
| PaaS (Platform as a Service)              |  Heroku, Azure App Service
+-------------------------------------------+
| IaaS (Infrastructure as a Service)        |  AWS EC2, Azure VMs, GCP Compute
+-------------------------------------------+
| On-Premises (You manage everything)       |  Your own servers
+-------------------------------------------+
```

As you move up the stack, the provider manages more; you manage less.

### IaaS: Infrastructure as a Service

The provider supplies virtualized computing resources (servers, storage, networking). You manage the operating system, middleware, runtime, and application.

| What Provider Manages | What You Manage |
|---|---|
| Physical hardware, data centers | Operating system |
| Networking, virtualization | Runtime environment |
| Storage infrastructure | Application code |
| | Security patches, scaling |

**Examples:**
- AWS EC2 (virtual machines)
- Azure Virtual Machines
- Google Compute Engine
- DigitalOcean Droplets

**Use case:** You need full control over the server environment. Example: running a custom Docker container with specific system-level dependencies.

### PaaS: Platform as a Service

The provider manages the infrastructure and runtime. You deploy your application code; the platform handles scaling, patching, and server management.

| What Provider Manages | What You Manage |
|---|---|
| Everything in IaaS, plus: | Application code |
| Operating system | Application configuration |
| Runtime environment | Data |
| Middleware, scaling | |

**Examples:**
- Heroku
- Azure App Service
- Google App Engine
- Vercel (for front-end applications)
- Netlify

**Use case:** Deploying a React application or a Node.js API without managing servers. You push code; the platform builds and serves it.

### SaaS: Software as a Service

The provider delivers a complete application over the internet. You use it via a browser or API; you manage nothing about the infrastructure.

| What Provider Manages | What You Manage |
|---|---|
| Everything -- infrastructure, platform, application | Your data and user accounts |
| Updates, scaling, security | Configuration and usage |

**Examples:**
- Google Workspace (Gmail, Docs, Drive)
- Microsoft 365
- Slack
- Salesforce
- GitHub

**Use case:** Using a tool as a consumer. You do not build or deploy anything; you subscribe and use the service.

### FaaS: Function as a Service (Serverless)

You deploy individual functions. The provider runs them in response to events (HTTP requests, database changes, file uploads). You pay only for execution time.

| What Provider Manages | What You Manage |
|---|---|
| Everything in PaaS, plus: | Individual function code |
| Scaling to zero | Function configuration |
| Event routing | |
| Execution environment | |

**Examples:**
- AWS Lambda
- Azure Functions
- Google Cloud Functions
- Cloudflare Workers

**Use case:** Running a small API endpoint that processes a webhook, resizes an image, or sends a notification. No server runs when there are no requests.

### The Shared Responsibility Model

As you move up the service stack, the provider takes on more responsibility:

```
                    You Manage    Provider Manages
On-Premises:       Everything    Nothing
IaaS:              OS + App      Hardware + Networking
PaaS:              App Only      OS + Runtime + Infra
FaaS:              Functions     Everything else
SaaS:              Data + Use    Everything
```

### Comparison Table

| Aspect | IaaS | PaaS | FaaS | SaaS |
|---|---|---|---|---|
| **Control** | High | Medium | Low | None |
| **Management burden** | High | Medium | Low | None |
| **Scalability** | Manual or auto-config | Automatic | Automatic (to zero) | Provider handles |
| **Cost model** | Per VM/hour | Per app/resource | Per function invocation | Per seat/month |
| **Cold start** | N/A | N/A | Yes (milliseconds) | N/A |
| **Best for** | Custom infrastructure | Web apps, APIs | Event-driven tasks | End-user tools |

### How This Relates to React

As a React developer, you will most commonly interact with:

- **PaaS** (Vercel, Netlify, Azure App Service) for deploying your React front-end.
- **FaaS** (AWS Lambda, Azure Functions) for serverless API endpoints that your React app calls.
- **SaaS** (GitHub, Jira, Figma) as tools in your development workflow.
- **IaaS** (EC2, Docker on a VM) when your team needs custom server configurations.

## Summary

- **IaaS** gives you virtual infrastructure; you manage the OS and everything above it.
- **PaaS** manages the platform; you deploy application code only.
- **SaaS** is a complete application delivered as a service; you are a consumer.
- **FaaS** runs individual functions on demand with automatic scaling to zero.
- The higher up the stack, the less you manage -- but the less control you have.

## Additional Resources
- [AWS -- Types of Cloud Computing](https://aws.amazon.com/types-of-cloud-computing/)
- [Azure -- Cloud Service Types](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-are-private-public-hybrid-clouds/)
- [NIST Cloud Computing Definition](https://csrc.nist.gov/publications/detail/sp/800-145/final)
