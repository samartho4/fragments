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
