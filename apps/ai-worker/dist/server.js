import cors from "cors";
import express from "express";
import { adviseBudget, analyzeExpenses, chatWithCopilot, financePayloadSchema } from "./chains.js";
import { env } from "./config.js";
import { retrieveContext } from "./rag.js";
const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_request, response) => {
    response.json({ status: "ok", service: "FinSmart AI Worker", model: env.OLLAMA_CHAT_MODEL });
});
app.post("/analyze-expenses", async (request, response, next) => {
    try {
        const payload = financePayloadSchema.parse(request.body);
        response.json({ result: await analyzeExpenses(payload), model: env.OLLAMA_CHAT_MODEL });
    }
    catch (error) {
        next(error);
    }
});
app.post("/budget-advice", async (request, response, next) => {
    try {
        const payload = financePayloadSchema.parse(request.body);
        response.json({ result: await adviseBudget(payload), model: env.OLLAMA_CHAT_MODEL });
    }
    catch (error) {
        next(error);
    }
});
app.post("/chat", async (request, response, next) => {
    try {
        const payload = financePayloadSchema.parse(request.body);
        response.json({ result: await chatWithCopilot(payload), model: env.OLLAMA_CHAT_MODEL });
    }
    catch (error) {
        next(error);
    }
});
app.post("/knowledge/search", async (request, response, next) => {
    try {
        const query = String(request.body?.query ?? "");
        response.json({ chunks: await retrieveContext(query) });
    }
    catch (error) {
        next(error);
    }
});
app.use((error, _request, response, _next) => {
    response.status(400).json({ error: error instanceof Error ? error.message : "AI worker request failed" });
});
app.listen(env.PORT, () => {
    console.log(`FinSmart AI Worker listening on http://127.0.0.1:${env.PORT}`);
});
