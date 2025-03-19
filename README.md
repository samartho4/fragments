# Fragments API

A microservice for storing, retrieving, and transforming content fragments. The Fragments API allows users to store and manage text and binary content in various formats, with built-in transformation capabilities.

## Overview

This project provides a RESTful API for managing content fragments with the following features:

- Create, read, and delete content fragments
- Authentication support using HTTP Basic Auth or AWS Cognito
- Support for various content types (text/plain, text/markdown, text/html, application/json, etc.)
- Format conversion between supported content types
- Comprehensive test suite and CI/CD integrations

## Setup and Installation

### Prerequisites

Before running the application, make sure you have:

- Node.js (LTS version recommended)
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/samartho4/fragments.git
  cd fragments

**

Install dependencies:
bashCopynpm install

Create a .env file for local development:
bashCopy# HTTP Port (defaults to 8080)
PORT=8080

# Log level (debug, info, warn, error)
LOG_LEVEL=info

# Authentication options - choose one:

# Option 1: HTTP Basic Auth
HTPASSWD_FILE=tests/.htpasswd

# Option 2: AWS Cognito (for production)
# AWS_COGNITO_POOL_ID=your-cognito-pool-id
# AWS_COGNITO_CLIENT_ID=your-cognito-client-id


Usage
Running the Application
Start the server in different modes:
bashCopy# Production mode
npm start

# Development mode (with automatic restart on file changes)
npm run dev

# Debug mode (with inspector)
npm run debug
API Endpoints
Authentication
All API endpoints are protected and require authentication.
Base URL
By default, the API is available at http://localhost:8080
Health Check

GET /: Returns basic information about the service.

Fragments API (v1)

GET /v1/fragments: Lists all fragments for the current user.
POST /v1/fragments: Creates a new fragment.
GET /v1/fragments/:id: Retrieves a fragment by ID.
GET /v1/fragments/:id/info: Retrieves metadata about a fragment.
GET /v1/fragments/:id.:ext: Retrieves a fragment in a converted format specified by the extension.

Working with Fragments
Creating a Fragment
bashCopycurl -X POST \
  -H "Content-Type: text/plain" \
  -d "This is a plain text fragment" \
  -u "user1@email.com:password1" \
  http://localhost:8080/v1/fragments
Listing Fragments
bashCopy# Get list of IDs
curl -u "user1@email.com:password1" \
  http://localhost:8080/v1/fragments

# Get expanded fragment data
curl -u "user1@email.com:password1" \
  http://localhost:8080/v1/fragments?expand=1
Getting a Fragment
bashCopycurl -u "user1@email.com:password1" \
  http://localhost:8080/v1/fragments/{id}
Getting Fragment Metadata
bashCopycurl -u "user1@email.com:password1" \
  http://localhost:8080/v1/fragments/{id}/info
Converting a Fragment
bashCopy# Convert markdown to HTML
curl -u "user1@email.com:password1" \
  http://localhost:8080/v1/fragments/{id}.html
Development
Code Structure
The project is organized as follows:

src/: Main source code

app.js: Express application setup
server.js: HTTP server configuration
auth/: Authentication modules
model/: Data models and storage implementations
routes/: API routes and handlers
utils/: Utility functions


tests/: Test suite

unit/: Unit tests
.htpasswd: Test user credentials for Basic Auth



Available Scripts

npm start: Start the server in production mode
npm run dev: Start the server in development mode with auto-reload
npm run debug: Start the server in debug mode
npm test: Run tests
npm run test:watch: Run tests in watch mode
npm run coverage: Run tests with coverage report
npm run lint: Run ESLint checks

Docker Support
The project includes Docker configuration for containerized deployment:
bashCopy# Build the Docker image
docker build -t fragments .

# Run the container
docker run -p 8080:8080 --env-file .env fragments
Continuous Integration/Deployment
This project uses GitHub Actions for CI/CD:

Continuous Integration: Runs tests, linting, and security checks on every pull request
Continuous Deployment: Builds and pushes Docker images to Docker Hub and AWS ECR when tags are created

Supported Content Types

text/plain: Plain text fragments
text/markdown: Markdown fragments (can be converted to HTML)
text/html: HTML fragments
application/json: JSON fragments
Image types (planned): PNG, JPEG, WebP, GIF

Conversions
The following conversions are supported:

text/plain → text/html
text/markdown → text/html, text/plain
text/html → text/plain
application/json → text/plain

License
This project is licensed under the UNLICENSED license.
Author
Samarth Sharma
**
