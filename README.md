# test-app

Minimal Vue 3 app for testing the platform-db-manager deploy pipeline.

## Purpose

This app exists solely to validate the end-to-end deploy flow:
1. Push to a public Git repo
2. Use the Create App wizard in platform-db-manager
3. Deploy via "Build from Dockerfile" strategy
4. Verify the app is running and healthy

## What it does

- Serves a single page showing app status, build time, and uptime
- Exposes `/health` endpoint (JSON) for health checks
- Runs on port 3000

## Local development

```bash
yarn install
yarn dev
```

## Docker

```bash
docker build -t test-app:latest .
docker run -p 3000:3000 test-app:latest
```

Then open http://localhost:3000 and check http://localhost:3000/health.
