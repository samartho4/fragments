# Fragments Back-End API

## Overview
This project is a Node.js-based REST API using Express, focused on backend microservices. The lab setup involves:

- Setting up development tools and environment.
- Creating and managing a GitHub repository.
- Configuring ESLint, Prettier, and structured logging.
- Building an initial API server with logging and debugging tools.

---

## Getting Started

### Prerequisites
Ensure the following tools are installed and properly configured:

- **Node.js**: Install the latest LTS version.
- **VSCode**: Install the following extensions:
  - ESLint
  - Prettier - Code Formatter
  - Code Spell Checker
- **git CLI**
- **curl**: Use `curl.exe` instead of `curl` in PowerShell on Windows to avoid alias conflicts.
- **jq**: For JSON formatting in the terminal.
- **WSL2** (Windows users): For Unix tools support.

---

## Scripts
The following scripts are defined in `package.json`:

### `lint`
Runs ESLint to check for code issues.
```bash
npm run lint
```
Ensure this script runs without errors before proceeding.

### `start`
Starts the server in normal mode.
```bash
npm start
```
Server will be available at [http://localhost:8080](http://localhost:8080).

### `dev`
Starts the server in development mode with `nodemon`.
```bash
npm run dev
```
Automatically restarts the server upon file changes. Logs will be in debug mode.

### `debug`
Starts the server in debug mode with `nodemon` and the Node.js inspector.
```bash
npm run debug
```
Allows attaching a debugger (e.g., in VSCode).

---

## Debugging

### VSCode Setup
To debug with VSCode:

1. Add the following to `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug via npm run debug",
         "request": "launch",
         "cwd": "${workspaceFolder}",
         "runtimeExecutable": "npm",
         "runtimeArgs": ["run-script", "debug"],
         "skipFiles": ["<node_internals>/**"],
         "type": "node"
       }
     ]
   }
   ```
2. Set a breakpoint in `src/app.js` (e.g., `res.status(200).json({`).
3. Start debugging by selecting `Debug via npm run debug` in the debugger menu.
4. Use `curl` or a browser to access [http://localhost:8080](http://localhost:8080).

### LOG_LEVEL=debug
When running with `LOG_LEVEL=debug`, environment variables will be printed for debugging. Modify `src/logger.js` as follows:

```javascript
if (process.env.LOG_LEVEL === 'debug') {
  console.log('Environment Variables:', process.env);
}
```
Start the server with:
```bash
LOG_LEVEL=debug npm run dev
```
Ensure sensitive data is not exposed unless in debugging mode.

---

## Testing API Server

### Browser Access
- Navigate to [http://localhost:8080](http://localhost:8080) to test the server.
- The JSON response should include `status`, `author`, `githubUrl`, and `version`.

### curl Access
Run the following command:
```bash
curl -s localhost:8080 | jq
```
Output:
```json
{
  "status": "ok",
  "author": "Your Name",
  "githubUrl": "https://github.com/YOUR_GITHUB_USERNAME/fragments",
  "version": "0.0.1"
}
```

### HTTP Headers
Check headers with:
```bash
curl -i localhost:8080
```
Ensure headers include:
- `Cache-Control: no-cache`
- `Access-Control-Allow-Origin: *`

---
