# Webpack Overview

## Learning Objectives
- Define Webpack and explain its role as a module bundler
- Understand the core concepts: entry, output, loaders, and plugins
- Recognize how Webpack fits into a React + TypeScript development workflow

## Why This Matters

Modern front-end applications are not single files. A React project consists of hundreds of modules -- components, utilities, stylesheets, images, and third-party libraries. The browser cannot natively resolve `import` statements across all of these. Webpack is the tool that takes your entire module graph and bundles it into optimized files the browser can load. Understanding Webpack's fundamentals helps you debug build issues, optimize performance, and configure custom build pipelines.

## The Concept

### What Is Webpack?

Webpack is a **static module bundler** for JavaScript applications. It processes your application starting from one or more entry points, builds a dependency graph of every module your project needs, and outputs one or more bundles.

```
  src/index.tsx
       |
  imports App.tsx, styles.css, utils.ts, react, axios...
       |
  Webpack builds a dependency graph
       |
  Output: bundle.js (+ style chunks, assets)
```

### Core Concepts

#### 1. Entry

The entry point tells Webpack where to start building its dependency graph. For a React app, this is typically `src/index.tsx`:

```javascript
// webpack.config.js
module.exports = {
  entry: "./src/index.tsx",
};
```

You can have multiple entry points for multi-page applications, but most React SPAs use a single entry.

#### 2. Output

The output configuration tells Webpack where to write the bundled files and how to name them:

```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
  },
};
```

The `[contenthash]` placeholder generates a unique hash based on the file content, enabling effective browser caching -- when the code changes, the filename changes, forcing the browser to fetch the new version.

#### 3. Loaders

Webpack natively understands only JavaScript and JSON. **Loaders** teach Webpack how to process other file types -- TypeScript, CSS, images, fonts, and more.

Loaders are configured in the `module.rules` array:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,          // Match .ts and .tsx files
        use: "ts-loader",         // Use the TypeScript loader
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,           // Match .css files
        use: ["style-loader", "css-loader"], // Process CSS and inject into DOM
      },
      {
        test: /\.(png|svg|jpg)$/, // Match image files
        type: "asset/resource",   // Emit as separate files
      },
    ],
  },
};
```

**How loaders work:** When Webpack encounters an `import "./styles.css"` statement, it checks the rules, finds a match for `.css`, and passes the file through the specified loaders (right to left: `css-loader` parses the CSS, then `style-loader` injects it into the page).

#### 4. Plugins

While loaders transform individual files, **plugins** perform broader tasks: optimizing bundles, injecting environment variables, generating HTML files, and more.

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Generate an HTML file that includes the bundle
    }),
  ],
};
```

Common plugins:

| Plugin | Purpose |
|---|---|
| `HtmlWebpackPlugin` | Generates an HTML file that includes your script tags |
| `MiniCssExtractPlugin` | Extracts CSS into separate files for production |
| `DefinePlugin` | Defines compile-time environment variables |
| `CleanWebpackPlugin` | Removes old build files before each build |

### A Minimal Webpack Configuration for React + TypeScript

```javascript
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Resolve these extensions automatically
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,        // Enable Hot Module Replacement
    open: true,       // Open browser on start
  },
};
```

### Webpack Dev Server

During development, you do not build to disk. Instead, Webpack Dev Server serves your application from memory with **Hot Module Replacement (HMR)** -- when you edit a file, only the changed module is replaced in the browser without a full page reload.

```bash
npx webpack serve --mode development
```

### Webpack vs. Vite

Vite is a newer build tool that has gained significant adoption in the React ecosystem. The key differences:

| Aspect | Webpack | Vite |
|---|---|---|
| Dev Server | Bundles everything, then serves | Serves modules directly via native ESM |
| Speed (development) | Slower for large projects | Significantly faster startup |
| Configuration | Extensive, flexible | Minimal by default |
| Maturity | Very mature, massive plugin ecosystem | Newer, growing rapidly |
| Production Build | Webpack bundler | Rollup under the hood |

Many new React projects choose Vite for its speed. Webpack remains important because it powers a large share of existing projects and offers unmatched configurability.

### Mode: Development vs. Production

Webpack supports two modes that optimize for different goals:

```javascript
module.exports = {
  mode: "development", // or "production"
};
```

- **Development:** Faster builds, source maps for debugging, no minification.
- **Production:** Minified output, tree-shaking (removing unused code), optimized chunks.

## Code Example

The relationship between source files and bundled output:

```
Project Structure:
  src/
    index.tsx        (entry point)
    App.tsx          (root component)
    components/
      Header.tsx
      TaskList.tsx
    styles/
      app.css

After Webpack:
  dist/
    bundle.a1b2c3.js  (all JS/TS compiled and bundled)
    index.html         (generated by HtmlWebpackPlugin)
```

## Summary

- Webpack is a module bundler that takes your project's dependency graph and outputs optimized bundles.
- The four core concepts are **entry** (starting point), **output** (where bundles go), **loaders** (transform non-JS files), and **plugins** (perform broad build tasks).
- Webpack Dev Server with HMR provides a fast development feedback loop.
- Vite is a modern alternative that is faster in development; both are valid choices.
- Understanding Webpack helps you debug build issues and customize your pipeline.

## Additional Resources
- [Webpack Official Documentation -- Concepts](https://webpack.js.org/concepts/)
- [Webpack Getting Started Guide](https://webpack.js.org/guides/getting-started/)
- [Vite Official Documentation](https://vitejs.dev/guide/)
