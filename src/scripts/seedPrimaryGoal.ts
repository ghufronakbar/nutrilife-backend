import { Prisma } from ".prisma/client";
import db from "../config/db";

const seedDataAppPrimaryGoal: Prisma.AppPrimaryGoalCreateInput[] = [
  {
    name: "Menurunkan Berat Badan",
    factor: 0.8,
  },
  {
    name: "Menjaga Berat Badan",
    factor: 1.0,
  },
  {
    name: "Menaikkan Berat Badan",
    factor: 1.15,
  },
  {
    name: "Meningkatkan Massa Otot",
    factor: 1.2,
  },
];

export async function seedAppPrimaryGoal() {
  console.log("🌱 Seeding AppPrimaryGoal...");
  for await (const data of seedDataAppPrimaryGoal) {
    const existing = await db.appPrimaryGoal.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      console.log(`⏭️  Dilewati: ${data.name}`);
      continue;
    }

    await db.appPrimaryGoal.create({ data });
    console.log(`✔️  Ditambahkan: ${data.name}`);
  }
}
