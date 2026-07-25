import { getEmbeddingModel } from "./modelRegistry.js";
const chunks = [
    {
        id: "kb-1",
        title: "Budgeting 50/30/20",
        content: "A beginner budget often divides income into 50% needs, 30% wants, and 20% savings or debt repayment."
    },
    {
        id: "kb-2",
        title: "Emergency Fund",
        content: "Students and young professionals should build three to six months of essential expenses in liquid savings."
    },
    {
        id: "kb-3",
        title: "SIP Investing",
        content: "Systematic investment plans help reduce timing risk and build long-term compounding discipline."
    }
];
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
    const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}
export async function retrieveContext(query, limit = 3) {
    try {
        const embeddings = getEmbeddingModel();
        const queryEmbedding = await embeddings.embedQuery(query);
        const indexed = await Promise.all(chunks.map(async (chunk) => ({
            ...chunk,
            embedding: chunk.embedding ?? (await embeddings.embedQuery(chunk.content))
        })));
        return indexed
            .map((chunk) => ({ ...chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding ?? []) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    catch {
        return chunks.slice(0, limit).map((chunk) => ({ ...chunk, score: 0 }));
    }
}
