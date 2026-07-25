import { PrismaClient, InvestmentKind, Priority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "aarav@finsmart.app" },
    update: {},
    create: {
      name: "Aarav Sharma",
      username: "aarav",
      email: "aarav@finsmart.app",
      passwordHash: "replace-with-flask-generated-hash"
    }
  });

  const dining = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: "Dining" } },
    update: {},
    create: { userId: user.id, name: "Dining" }
  });

  const investing = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: "Investment" } },
    update: {},
    create: { userId: user.id, name: "Investment" }
  });

  await prisma.expense.createMany({
    data: [
      { userId: user.id, categoryId: dining.id, merchant: "Swiggy", amount: "1280", spentAt: new Date("2026-05-27") },
      { userId: user.id, categoryId: investing.id, merchant: "Zerodha Coin", amount: "15000", spentAt: new Date("2026-05-22") }
    ],
    skipDuplicates: true
  });

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Emergency fund",
      targetAmount: "300000",
      currentAmount: "226000",
      deadline: new Date("2026-12-31"),
      priority: Priority.HIGH
    }
  });

  await prisma.investment.create({
    data: {
      userId: user.id,
      asset: "Nifty 50 Index Fund",
      kind: InvestmentKind.MUTUAL_FUND,
      units: "128.7",
      currentValue: "284000",
      monthlySip: "15000",
      goal: "Retirement corpus"
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
