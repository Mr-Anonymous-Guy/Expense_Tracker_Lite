# AI and RAG Architecture

FinSmart uses local-first AI through Ollama and LangChain JS.

## Models

- Primary chat model: `qwen3:8b`
- Fallback model: `llama3.1:8b`
- Embeddings: `nomic-embed-text`

## AI Worker Endpoints

- `GET /health`
- `POST /analyze-expenses`
- `POST /budget-advice`
- `POST /chat`
- `POST /knowledge/search`

## Upgrade Path

The model registry in `apps/ai-worker/src/modelRegistry.ts` centralizes model construction so future Ollama, OpenAI, Anthropic, or local server adapters can be added without rewriting app features.
