import { describe, expect, it } from "vitest";
import { financePayloadSchema } from "./chains.js";
describe("financePayloadSchema", () => {
    it("provides safe defaults", () => {
        const payload = financePayloadSchema.parse({});
        expect(payload.expenses).toEqual([]);
        expect(payload.budgets).toEqual([]);
    });
});
