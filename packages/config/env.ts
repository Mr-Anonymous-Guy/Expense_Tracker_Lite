import { z } from "zod";

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(24),
  SECRET_KEY: z.string().min(24),
  OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
  AI_WORKER_URL: z.string().url().default("http://localhost:8787")
});

export const webEnvSchema = z.object({
  VITE_API_URL: z.string().url().default("http://127.0.0.1:5000/api")
});
