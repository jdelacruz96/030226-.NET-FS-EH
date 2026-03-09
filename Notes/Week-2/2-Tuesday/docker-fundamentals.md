# Docker Fundamentals

## Learning Objectives
- Describe Docker's architecture: the daemon, the client, and registries
- Explain the relationship between images, containers, and layers
- Understand the image lifecycle: build, run, push, and pull
- Identify when to use Docker in a development and deployment workflow

## Why This Matters

Docker is the industry-standard tool for building and running containers. When someone says "containerize the application," they almost always mean "use Docker." Understanding Docker's architecture -- how images are built, how containers run, and how registries store images -- is essential before you write a Dockerfile or add Docker steps to your pipeline. This document gives you the mental model; the next reading (`dockerfile-and-cli.md`) gives you the practical commands.

## The Concept

### What Is Docker?

Docker is a platform for building, shipping, and running applications in containers. It provides:

1. A **format** for packaging applications (Docker images).
2. A **runtime** for executing those packages (Docker containers).
3. A **distribution mechanism** for sharing packages (Docker registries).

Docker was released in 2013 and rapidly became the de facto standard for containerization. While alternatives exist (Podman, containerd), Docker's toolchain remains the most widely used and documented.

### Docker Architecture

Docker uses a client-server architecture:

```
Docker Client (CLI)            Docker Daemon (dockerd)
-------------------            -----------------------
docker build ...    -------->  Builds images
docker run ...      -------->  Creates and runs containers
docker push ...     -------->  Pushes images to registries
docker pull ...     -------->  Pulls images from registries
                                  |
                                  v
                          Container Runtime
                          (manages container lifecycle)
```

**Docker Client:** The command-line tool (`docker`) you interact with. Every `docker build`, `docker run`, and `docker push` command is a request from the client to the daemon.

**Docker Daemon (`dockerd`):** A background process that manages images, containers, networks, and volumes. It does the actual work. The client and daemon can run on the same machine (typical for local development) or on different machines.

**Docker Registry:** A storage service for Docker images. When you `docker push` an image, it goes to a registry. When you `docker pull`, it comes from a registry. Examples include Docker Hub (public, default), Azure Container Registry (private, Azure-integrated), and GitHub Container Registry.

### Images

A **Docker image** is a read-only template that contains everything needed to run an application: code, runtime, libraries, and configuration. Think of an image as a snapshot of a fully configured environment.

**Key properties of images:**

- **Immutable:** Once built, an image does not change. If you need to modify something, you build a new image.
- **Portable:** An image works the same way on any machine with a compatible Docker runtime.
- **Tagged:** Images are identified by a name and tag, e.g., `taskflow:v1.0` or `nginx:alpine`. The tag typically indicates the version.
- **Layered:** Images are composed of layers (explained below).

### Containers

A **container** is a running instance of an image. If an image is a class, a container is an object (an instance of that class).

```
Image: taskflow:v1.0        -->  Container 1 (running)
                             -->  Container 2 (running)
                             -->  Container 3 (stopped)
```

You can create multiple containers from the same image. Each container is isolated -- its filesystem, processes, and network are separate from other containers and the host.

**Container lifecycle:**

```
Image --> docker run --> Container (running)
                              |
                    docker stop --> Container (stopped)
                              |
                    docker start --> Container (running again)
                              |
                    docker rm --> Container (deleted)
```

A stopped container retains its filesystem state. A deleted container is gone. The image remains untouched regardless of what happens to containers created from it.

### Layers

Docker images are built in **layers**. Each instruction in a Dockerfile creates a new layer on top of the previous one. Layers are cached and shared between images, which makes builds faster and images smaller.

**Example: How layers work:**

```dockerfile
FROM node:18-alpine          # Layer 1: Base operating system + Node.js
WORKDIR /app                 # Layer 2: Set working directory
COPY package*.json ./        # Layer 3: Copy package files
RUN npm ci                   # Layer 4: Install dependencies
COPY . .                     # Layer 5: Copy application code
RUN npm run build            # Layer 6: Build the application
```

```
Layer 6: npm run build output    (unique to this image)
Layer 5: Application source code (unique to this image)
Layer 4: node_modules            (cached if package.json unchanged)
Layer 3: package.json            (cached if file unchanged)
Layer 2: /app directory          (cached)
Layer 1: node:18-alpine          (shared with any image using this base)
```

**Why layers matter:**

1. **Caching:** If a layer has not changed since the last build, Docker reuses it from cache. This is why you `COPY package*.json` *before* `COPY . .` -- the dependency install layer is cached unless `package.json` changes, even if source code changes.

2. **Sharing:** Multiple images that use the same base (e.g., `node:18-alpine`) share that base layer on disk. Storage is not duplicated.

3. **Efficiency:** Only changed layers need to be rebuilt and re-pushed to a registry.

### The Image Lifecycle

The complete lifecycle of a Docker image in a DevOps workflow:

```
1. BUILD    Developer or pipeline creates the image from a Dockerfile
            docker build -t taskflow:v1.0 .

2. TAG      The image may be tagged with additional names
            docker tag taskflow:v1.0 myregistry.azurecr.io/taskflow:v1.0

3. PUSH     The image is uploaded to a registry for storage and distribution
            docker push myregistry.azurecr.io/taskflow:v1.0

4. PULL     Another machine (or service) downloads the image from the registry
            docker pull myregistry.azurecr.io/taskflow:v1.0

5. RUN      The image is instantiated as a running container
            docker run -p 8080:80 myregistry.azurecr.io/taskflow:v1.0
```

In a CI/CD pipeline, steps 1-3 happen during the build stage (automated). Steps 4-5 happen during the deploy stage (also automated). The image is the artifact that flows through the pipeline.

### Docker Hub vs. Azure Container Registry

| Feature | Docker Hub | Azure Container Registry (ACR) |
|---------|-----------|-------------------------------|
| **Hosting** | Public cloud (Docker, Inc.) | Azure cloud (Microsoft) |
| **Public images** | Free, unlimited | Not designed for public images |
| **Private images** | Free (1 private repo) or paid | Private by default (all tiers) |
| **Authentication** | Docker Hub credentials | Azure Active Directory, managed identity |
| **Integration** | Universal | Deep integration with Azure services |
| **Use case** | Sharing open-source images | Enterprise/team private images, Azure deployments |

For this week's training, you will use **Azure Container Registry** because it integrates directly with Azure Pipelines and Azure App Service. When you `docker push` to ACR, Azure App Service can `docker pull` from it automatically using managed identity -- no credential management required.

### When to Use Docker

Docker is the right tool when:

- You want **consistent environments** across development, CI/CD, staging, and production.
- You are building **microservices** that need independent deployment and scaling.
- Your CI/CD pipeline needs to produce a **single, immutable artifact** that is the same everywhere.
- You want to **standardize deployment.** `docker run` works the same regardless of what is inside the container.

Docker is not necessary when:

- You are running a single monolithic application directly on a VM with no portability needs.
- Your application has deep OS-level dependencies that require a full VM.
- The overhead of learning and maintaining Docker does not justify the benefit (very small, single-developer projects).

## Code Example

A quick demonstration of Docker's core concepts in action:

```bash
# Pull a pre-built image from Docker Hub
docker pull nginx:alpine

# Run a container from that image
docker run -d -p 8080:80 --name my-nginx nginx:alpine
# -d: Run in detached mode (background)
# -p 8080:80: Map host port 8080 to container port 80
# --name: Give the container a human-readable name

# Verify the container is running
docker ps
# CONTAINER ID   IMAGE          PORTS                  NAMES
# a1b2c3d4e5f6   nginx:alpine   0.0.0.0:8080->80/tcp   my-nginx

# Visit http://localhost:8080 in your browser -- Nginx welcome page appears

# Stop the container
docker stop my-nginx

# Remove the container
docker rm my-nginx

# The image is still available locally
docker images
# REPOSITORY   TAG      IMAGE ID       SIZE
# nginx        alpine   abc123def456   23.5MB
```

This sequence illustrates the full container lifecycle: pull an image, run a container, interact with it, and clean up. Tomorrow you will do this same sequence with TaskFlow instead of the default Nginx page.

## Summary

- Docker uses a client-server architecture: the CLI client sends commands to the Docker daemon, which manages images and containers.
- An **image** is a read-only template containing everything needed to run an application. Images are immutable, portable, and tagged.
- A **container** is a running instance of an image. Multiple containers can be created from the same image.
- Images are built in **layers** that are cached and shared, making builds fast and storage efficient.
- The image lifecycle is Build, Tag, Push, Pull, Run -- automated through CI/CD pipelines.
- **Azure Container Registry** is a private Docker registry integrated with Azure services, used for team and enterprise deployments.

## Additional Resources
- [Docker Documentation -- Get Started](https://docs.docker.com/get-started/)
- [Docker Documentation -- Docker Architecture](https://docs.docker.com/get-started/docker-overview/#docker-architecture)
- [Microsoft Learn -- Introduction to Docker](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/container-docker-introduction/docker-defined)
