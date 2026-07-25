import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { getChatModel } from "./modelRegistry.js";
import { retrieveContext } from "./rag.js";
export const financePayloadSchema = z.object({
    expenses: z.array(z.record(z.unknown())).default([]),
    budgets: z.array(z.record(z.unknown())).default([]),
    goals: z.array(z.record(z.unknown())).default([]),
    investments: z.array(z.record(z.unknown())).default([]),
    question: z.string().optional()
});
export async function analyzeExpenses(payload) {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are FinSmart, a precise financial analyst for students and young professionals. Return concise JSON."],
        ["user", "Analyze these expenses and explain what happened, why it happened, and what to do next: {data}"]
    ]);
    const model = getChatModel("analysis");
    const result = await prompt.pipe(model).invoke({ data: JSON.stringify(payload) });
    return String(result.content);
}
export async function adviseBudget(payload) {
    const context = await retrieveContext("budgeting savings emergency fund");
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are FinSmart's budget advisor. Use the provided knowledge base context and return practical advice."],
        ["user", "Context: {context}\nFinancial data: {data}"]
    ]);
    const model = getChatModel("chat");
    const result = await prompt.pipe(model).invoke({
        context: context.map((item) => `${item.title}: ${item.content}`).join("\n"),
        data: JSON.stringify(payload)
    });
    return String(result.content);
}
export async function chatWithCopilot(payload) {
    const question = payload.question ?? "What should I do next financially?";
    const context = await retrieveContext(question);
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a local-first AI financial copilot. Be specific, cautious, and educational. Do not claim to be a licensed advisor."],
        ["user", "Question: {question}\nContext: {context}\nUser finance snapshot: {data}"]
    ]);
    const model = getChatModel("chat");
    const result = await prompt.pipe(model).invoke({
        question,
        context: context.map((item) => `${item.title}: ${item.content}`).join("\n"),
        data: JSON.stringify(payload)
    });
    return String(result.content);
}
