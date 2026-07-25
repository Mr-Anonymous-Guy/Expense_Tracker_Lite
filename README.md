# FinSmart

FinSmart is an AI-powered personal finance intelligence platform built as the flagship project of this repository. It is structured as a production-style SaaS monorepo with a React dashboard, Flask API, PostgreSQL/Prisma data model, JWT authentication, and a local Ollama/LangChain AI worker.

## Vision

FinSmart is not only an expense tracker. It is a financial intelligence platform for students, beginners, and young professionals. It answers:

- What happened?
- Why did it happen?
- What should I do next?

## Monorepo Architecture

```text
FinSmart/
  apps/
    web/          React + TypeScript + Vite + TailwindCSS + TanStack Query
    api/          Flask REST API + JWT + validation + OpenAPI
    ai-worker/    LangChain JS + Ollama + local RAG
  packages/
    database/     Prisma schema, SQL schema, seed data
    shared/       shared TypeScript contracts
    config/       environment validation helpers
    ui/           shadcn-style reusable primitives
  docs/           architecture, API, AI/RAG, security, roadmap
  docker/         Docker support folders
  scripts/        automation and ingestion scripts
```

## Features

- Authentication with JWT
- Expense management
- Budget planning
- Goal planner
- Investment tracking and SIP projections
- Financial dashboard
- Financial health score
- AI expense analyzer
- AI budget advisor
- AI financial chatbot
- Weekly AI insights and reports
- RAG knowledge base with local embeddings
- Dark responsive SaaS UI
- OpenAPI documentation
- Docker, CI, tests, linting, formatting, Makefile, run scripts

## Tech Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, shadcn-style UI, TanStack Query, React Router, Recharts
- Backend: Flask, Python, JWT, Pydantic, PostgreSQL
- Database: Prisma schema, PostgreSQL SQL schema, normalized relational model
- AI: Ollama, LangChain JS, Qwen3:8B, Llama3.1:8B, local embeddings, RAG
- DevOps: Docker Compose, GitHub Actions, Makefile, shell and Windows runners

## Quick Start

```bash
cd FinSmart
npm install
python -m pip install -r apps/api/requirements.txt
npm run build
npm test
```

Run all services:

```bash
./run.sh
```

Windows:

```bat
run.bat
```

Manual service commands:

```bash
npm run dev:web
cd apps/api && python run.py
npm run dev:ai
```

## Docker

```bash
docker compose up -d --build
```

Services:

- Web: `http://127.0.0.1:5174`
- API: `http://127.0.0.1:5000`
- AI worker: `http://127.0.0.1:8787`
- Ollama: `http://127.0.0.1:11434`
- PostgreSQL: `localhost:5432`

Pull local models before using full AI flows:

```bash
ollama pull qwen3:8b
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

## Environment

API:

```text
SECRET_KEY=replace-with-a-long-random-secret
JWT_SECRET=replace-with-a-long-random-jwt-secret
DATABASE_URL=postgresql://finsmart:finsmart@localhost:5432/finsmart
AI_WORKER_URL=http://127.0.0.1:8787
OLLAMA_BASE_URL=http://localhost:11434
CORS_ORIGINS=http://127.0.0.1:5174,http://localhost:5174
```

AI worker:

```text
PORT=8787
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=qwen3:8b
OLLAMA_FALLBACK_MODEL=llama3.1:8b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

## API Documentation

OpenAPI contract:

```text
GET /api/openapi.json
```

Core endpoints:

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Service health and env warnings |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Create JWT session |
| GET/POST | `/api/expenses` | Yes | Expense management |
| GET/POST | `/api/budgets` | Yes | Budget planning |
| GET/POST | `/api/goals` | Yes | Goal planning |
| GET/POST | `/api/investments` | Yes | Investment tracking |
| GET | `/api/analytics/overview` | Yes | Dashboard analytics |
| GET | `/api/ai/insights` | Yes | Weekly AI insights |
| POST | `/api/ai/chat` | Yes | AI financial copilot |
| GET | `/api/reports` | Yes | Generated reports |

## Database

Prisma schema:

```text
packages/database/prisma/schema.prisma
```

SQL schema:

```text
packages/database/schema.sql
```

Key models:

- `users`
- `sessions`
- `categories`
- `expenses`
- `budgets`
- `investments`
- `goals`
- `financial_health_scores`
- `ai_insights`
- `chat_threads`
- `chat_messages`
- `knowledge_documents`
- `knowledge_chunks`
- `reports`
- `audit_logs`

## Verification

Commands used during implementation:

```bash
npm run build
npm test
npm run db:generate
python -m pytest tests -p no:cacheprovider
```

## Screenshots

![FinSmart desktop auth](screenshots/auth.png)

![FinSmart mobile auth](screenshots/auth-mobile.png)

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [AI and RAG](docs/ai-rag.md)
- [Security](docs/security.md)
- [Roadmap](docs/roadmap.md)

## Skills Demonstrated

- Frontend engineering
- Backend engineering
- Database design
- Authentication and security
- AI integration
- RAG architecture
- DevOps and CI
- System design
- Dashboard engineering
- FinTech product design
