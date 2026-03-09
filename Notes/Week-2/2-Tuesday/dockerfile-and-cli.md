# Dockerfile and CLI

## Learning Objectives
- Write a Dockerfile using core instructions: FROM, WORKDIR, COPY, RUN, EXPOSE, and CMD
- Execute essential Docker CLI commands: build, run, ps, stop, rm, images, push, and pull
- Understand multi-stage builds and why they produce smaller, more secure images
- Publish images to Docker Hub and Azure Container Registry

## Why This Matters

The Dockerfile is the blueprint for your container. Every line in it defines a layer of the environment your application runs in. Mastering the Dockerfile and the Docker CLI gives you the ability to containerize any application -- not just follow a recipe for TaskFlow, but understand why each instruction exists so you can adapt it to any project. Today's demo will walk through writing a Dockerfile for TaskFlow live; this reading prepares you to understand every line.

## The Concept

### What Is a Dockerfile?

A Dockerfile is a text file containing a series of instructions that Docker uses to build an image. Each instruction creates a layer in the image. The file is conventionally named `Dockerfile` (capital D, no extension) and placed in the root of the project.

### Core Dockerfile Instructions

#### FROM

Sets the base image. Every Dockerfile must start with `FROM`. The base image provides the operating system and any pre-installed tools.

```dockerfile
FROM node:18-alpine
```

- `node` is the image name (maintained by the Node.js team on Docker Hub).
- `18` is the Node.js version.
- `alpine` is the variant -- Alpine Linux, a minimal distribution (~5 MB) that produces smaller images.

**Choosing a base image:**

| Variant | Size | Use When |
|---------|------|----------|
| `node:18` | ~350 MB | You need a full Debian environment with all system tools |
| `node:18-slim` | ~80 MB | You need some system tools but want a smaller image |
| `node:18-alpine` | ~50 MB | You want the smallest possible image (most production use cases) |

#### WORKDIR

Sets the working directory inside the container. All subsequent commands (`COPY`, `RUN`, `CMD`) execute relative to this directory. If the directory does not exist, `WORKDIR` creates it.

```dockerfile
WORKDIR /app
```

#### COPY

Copies files from the host machine (your project directory) into the image filesystem.

```dockerfile
COPY package.json package-lock.json ./
```

This copies `package.json` and `package-lock.json` from your project into `/app/` inside the image (because `WORKDIR` was set to `/app`).

**Why copy package files separately?** Docker caches layers. If you copy `package.json` first and run `npm ci`, Docker can cache the `node_modules` layer. On subsequent builds, if `package.json` has not changed, Docker skips the `npm ci` step entirely -- saving minutes.

#### RUN

Executes a command during the image build process. The result is baked into a new image layer.

```dockerfile
RUN npm ci
```

Common uses:
- Installing dependencies (`npm ci`, `pip install`, `dotnet restore`)
- Compiling code (`npm run build`)
- Installing system packages (`apk add --no-cache curl`)

**Note:** `RUN` executes at **build time**, not at container start time.

#### EXPOSE

Documents which port the application inside the container listens on. This is informational -- it does not actually open the port. The port is opened at runtime using the `-p` flag.

```dockerfile
EXPOSE 80
```

Think of `EXPOSE` as documentation for the person who will run the container: "This container expects traffic on port 80."

#### CMD

Specifies the default command to run when a container starts from this image. There can be only one `CMD` in a Dockerfile (the last one wins).

```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```

- `CMD` uses the **exec form** (JSON array) for clarity and proper signal handling.
- This command runs at **container start time**, not build time (unlike `RUN`).

**RUN vs. CMD:**

| | RUN | CMD |
|-|-----|-----|
| **When** | Build time | Container start time |
| **Purpose** | Install dependencies, compile code | Start the application |
| **Frequency** | Runs once when building the image | Runs every time a container starts |

### Writing a Complete Dockerfile

Here is a Dockerfile for a static React/TypeScript application like TaskFlow, with each line annotated:

```dockerfile
# Stage 1: Build the application
# Use Node.js 18 on Alpine Linux as the build environment
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package.json package-lock.json ./

# Install dependencies using clean install (respects lock file exactly)
RUN npm ci

# Copy all source code into the container
COPY . .

# Build the production bundle (outputs to dist/)
RUN npm run build

# Stage 2: Serve the built application
# Use Nginx on Alpine Linux as the production web server
FROM nginx:alpine

# Copy the built files from Stage 1 into Nginx's serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Document that this container serves on port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
```

### Multi-Stage Builds

The Dockerfile above uses a **multi-stage build** -- two `FROM` instructions in one file. This is a critical technique for production images.

**Why multi-stage?**

A single-stage build that installs Node.js, copies source code, runs `npm ci`, and builds the app would produce an image containing:
- Node.js runtime (~50 MB)
- `node_modules/` (~200+ MB)
- Source code (~5 MB)
- Built `dist/` output (~2 MB)

But in production, you only need the `dist/` output and a web server. Everything else is build tooling that has no business in the production image.

Multi-stage builds solve this:

```
Stage 1 (build): node:18-alpine + source code + node_modules + dist/
                                                                  |
                                      COPY --from=build /app/dist |
                                                                  v
Stage 2 (production): nginx:alpine + dist/    <-- This is the final image
```

**Size comparison:**

| Approach | Image Size |
|----------|-----------|
| Single stage (Node + source + deps + dist) | ~300 MB |
| Multi-stage (Nginx + dist only) | ~25 MB |

The multi-stage image is 12x smaller, starts faster, has a smaller attack surface, and costs less to store and transfer.

### Essential Docker CLI Commands

#### Building Images

```bash
# Build an image from the Dockerfile in the current directory
docker build -t taskflow:local .
# -t: Tag the image with a name:tag
# . : Context directory (where Docker looks for the Dockerfile and files)

# Build with a specific Dockerfile
docker build -f Dockerfile.prod -t taskflow:prod .
```

#### Running Containers

```bash
# Run a container in the foreground
docker run -p 8080:80 taskflow:local
# -p host:container: Map host port 8080 to container port 80

# Run in the background (detached mode)
docker run -d -p 8080:80 --name taskflow-app taskflow:local
# -d: Detached mode
# --name: Assign a name to the container
```

#### Managing Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a running container
docker stop taskflow-app

# Remove a stopped container
docker rm taskflow-app

# Stop and remove in one step
docker rm -f taskflow-app
```

#### Managing Images

```bash
# List local images
docker images

# Remove an image
docker rmi taskflow:local

# Remove unused images, containers, and networks
docker system prune
```

#### Working with Registries

```bash
# Log in to Docker Hub
docker login

# Log in to Azure Container Registry
docker login myregistry.azurecr.io

# Tag an image for a registry
docker tag taskflow:local myregistry.azurecr.io/taskflow:v1.0

# Push an image to a registry
docker push myregistry.azurecr.io/taskflow:v1.0

# Pull an image from a registry
docker pull myregistry.azurecr.io/taskflow:v1.0
```

### Publishing to Azure Container Registry

To push an image to ACR, you need:

1. An ACR instance (created via Azure CLI or portal).
2. Authentication to ACR.
3. A properly tagged image.

```bash
# Authenticate to ACR
az acr login --name taskflowdemoacr

# Tag the image with the ACR login server
docker tag taskflow:local taskflowdemoacr.azurecr.io/taskflow:latest

# Push the image
docker push taskflowdemoacr.azurecr.io/taskflow:latest

# Verify the image is in ACR
az acr repository list --name taskflowdemoacr --output table
```

### The .dockerignore File

Just as `.gitignore` prevents files from being tracked by Git, `.dockerignore` prevents files from being included in the Docker build context. This keeps images small and prevents sensitive files from leaking into images.

```
# .dockerignore
node_modules
dist
.git
.env
*.md
.vscode
```

**Critical:** Always exclude `node_modules` from the build context. The `RUN npm ci` step inside the Dockerfile installs fresh dependencies. Copying your local `node_modules` would be redundant, slow, and could introduce platform-specific binaries.

### Command Reference Table

| Command | Purpose |
|---------|---------|
| `docker build -t name:tag .` | Build an image from a Dockerfile |
| `docker run -p host:container image` | Run a container from an image |
| `docker run -d` | Run in detached (background) mode |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker stop name` | Stop a container |
| `docker rm name` | Remove a container |
| `docker images` | List local images |
| `docker rmi name:tag` | Remove an image |
| `docker tag source target` | Create an alias (tag) for an image |
| `docker push name:tag` | Upload an image to a registry |
| `docker pull name:tag` | Download an image from a registry |
| `docker login` | Authenticate to a registry |
| `docker system prune` | Clean up unused resources |

## Summary

- A **Dockerfile** defines the image: `FROM` sets the base, `WORKDIR` sets the directory, `COPY` adds files, `RUN` executes build commands, `EXPOSE` documents ports, and `CMD` starts the application.
- **Multi-stage builds** use multiple `FROM` instructions to separate build tooling from the production image, dramatically reducing size.
- **Docker CLI** commands manage the image lifecycle: `build`, `run`, `stop`, `rm`, `push`, and `pull`.
- Always use a **`.dockerignore`** file to exclude `node_modules`, `.git`, and sensitive files from the build context.
- **Azure Container Registry** is the target registry for this week's pipeline, authenticated via `az acr login`.

## Additional Resources
- [Docker Documentation -- Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- [Docker Documentation -- Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Documentation -- CLI Reference](https://docs.docker.com/reference/cli/docker/)
