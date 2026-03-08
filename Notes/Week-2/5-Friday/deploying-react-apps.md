# Deploying React Applications

## Learning Objectives
- Understand the React build process (from source to static assets)
- Survey common deployment targets (Vercel, Netlify, AWS S3, Docker)
- Configure environment variables for different environments

## Why This Matters

A React application is useless if it only runs on localhost. Understanding how to build for production and deploy to a hosting platform is the final step in the development lifecycle. This reading covers what happens when you run `npm run build`, where the output goes, and how to get it to users.

## The Concept

### The Build Process

When you run `npm run build` in a Vite (or CRA) project, the build tool:

1. **Transpiles** TypeScript/JSX to standard JavaScript.
2. **Bundles** all modules into a small number of files.
3. **Minifies** the code (removes whitespace, shortens variable names).
4. **Tree-shakes** unused code (removes dead imports).
5. **Generates** static assets in the `dist/` (Vite) or `build/` (CRA) directory.

```bash
npm run build
# Output:
# dist/
#   index.html
#   assets/
#     index-abc123.js     (your application code)
#     index-def456.css    (your styles)
#     vendor-ghi789.js    (third-party libraries)
```

The output is a set of **static files** -- HTML, CSS, and JavaScript. No server-side runtime is needed. Any static file host can serve them.

### Deployment Targets

| Platform | Type | Best For |
|---|---|---|
| **Vercel** | Managed hosting | Next.js and React apps with Git integration |
| **Netlify** | Managed hosting | Static sites and SPAs with CI/CD |
| **AWS S3 + CloudFront** | Cloud infrastructure | Enterprise, custom CDN configuration |
| **GitHub Pages** | Free static hosting | Open-source projects and demos |
| **Docker** | Containerized | Teams with existing container infrastructure |

### Deploying to Vercel (Example)

```bash
# Install Vercel CLI:
npm install -g vercel

# Deploy from the project root:
vercel
# Follow the prompts. Vercel detects the framework and builds automatically.
```

### Deploying with Docker

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t my-react-app .
docker run -p 8080:80 my-react-app
```

### Environment Variables

Vite uses environment variables prefixed with `VITE_`:

```bash
# .env (local development)
VITE_API_URL=http://localhost:3001/api

# .env.production (production build)
VITE_API_URL=https://api.myapp.com
```

Access them in code:

```typescript
const API_URL: string = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/tasks`);
```

**Security note:** Environment variables in client-side code are embedded in the JavaScript bundle. Never put secrets (API keys, passwords) in `VITE_` variables -- they are visible to anyone who inspects the bundle.

### SPA Routing in Production

Single-page applications use client-side routing, but the server needs to be configured to serve `index.html` for all routes. Otherwise, refreshing on `/dashboard` returns a 404.

**Nginx configuration:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Netlify (`_redirects` file):**
```
/*  /index.html  200
```

**Vercel (`vercel.json`):**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Production Checklist

- [ ] Run `npm run build` and verify the output starts without errors
- [ ] Test all routes in production mode (client-side routing works)
- [ ] Environment variables are set for the target environment
- [ ] Assets are served with cache headers and a CDN
- [ ] Error tracking is configured (e.g., Sentry)
- [ ] HTTPS is enabled

## Summary

- `npm run build` produces optimized static files (HTML, CSS, JS) ready for deployment.
- React apps can be deployed to any static hosting platform (Vercel, Netlify, S3, Docker + Nginx).
- Use `VITE_`-prefixed environment variables for configuration; never embed secrets.
- Configure the server to redirect all routes to `index.html` for SPA routing.

## Additional Resources
- [Vite -- Building for Production](https://vitejs.dev/guide/build.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker -- Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
