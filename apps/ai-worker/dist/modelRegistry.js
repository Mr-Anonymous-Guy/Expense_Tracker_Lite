import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { env } from "./config.js";
export function getChatModel(purpose = "chat") {
    const model = purpose === "fallback" ? env.OLLAMA_FALLBACK_MODEL : env.OLLAMA_CHAT_MODEL;
    return new ChatOllama({
        baseUrl: env.OLLAMA_BASE_URL,
        model,
        temperature: purpose === "analysis" ? 0.2 : 0.4
    });
}
export function getEmbeddingModel() {
    return new OllamaEmbeddings({
        baseUrl: env.OLLAMA_BASE_URL,
        model: env.OLLAMA_EMBEDDING_MODEL
    });
}
