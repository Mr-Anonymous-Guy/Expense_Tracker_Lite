# FinSmart Architecture

FinSmart is a modular monorepo with three runnable applications:

- `apps/web`: React, TypeScript, Vite, TailwindCSS, shadcn-style UI, TanStack Query, Recharts
- `apps/api`: Flask REST API, JWT authentication, validation, PostgreSQL access, OpenAPI contract
- `apps/ai-worker`: LangChain JS, Ollama, local embeddings, RAG, AI copilot endpoints

Shared packages provide database schema, reusable UI primitives, shared types, and configuration helpers.

## Request Flow

```txt
Browser
  -> React Router protected routes
  -> TanStack Query API calls
  -> Flask REST API
  -> Validation / Auth / Rate Limit
  -> Repository / PostgreSQL
  -> AI Worker when recommendations are requested
  -> Ollama + RAG context
```

## Clean Architecture

The API is organized by route modules today and is ready to grow into:

- `repositories`: database persistence
- `services`: business logic
- `schemas`: validation contracts
- `middleware`: security, rate limiting, audit
- `ai`: gateway client to AI worker

Business logic should remain independent of Flask request objects.
