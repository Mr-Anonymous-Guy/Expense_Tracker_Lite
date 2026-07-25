import { writeFileSync } from "node:fs";
import { join } from "node:path";

const documents = [
  {
    title: "Budgeting Basics",
    content: "Track needs, wants, savings, debt, and investing separately to understand financial behavior."
  },
  {
    title: "Financial Health",
    content: "A strong score weighs savings rate, budget utilization, emergency runway, and investing consistency."
  }
];

writeFileSync(join(process.cwd(), "docs", "knowledge-seed.json"), JSON.stringify(documents, null, 2));
console.log("Knowledge seed written to docs/knowledge-seed.json");
