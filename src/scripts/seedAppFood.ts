import { Prisma } from ".prisma/client";
import db from "../config/db";

const seedDataAppFood: Prisma.AppFoodCreateInput[] = [
  // Protein
  {
    name: "Dada Ayam",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    size: 100,
  },
  {
    name: "Fillet Salmon",
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    size: 100,
  },
  {
    name: "Yogurt Yunani",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    size: 100,
  },
  {
    name: "Telur (Besar)",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    size: 2,
  },
  {
    name: "Daging Sapi Giling Tanpa Lemak",
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 15,
    size: 100,
  },

  // Karbohidrat
  {
    name: "Nasi Merah",
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    size: 100,
  },
  {
    name: "Quinoa",
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    size: 100,
  },
  {
    name: "Ubi Jalar",
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    size: 100,
  },
  {
    name: "Oatmeal",
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    size: 100,
  },
  {
    name: "Roti Gandum Utuh",
    calories: 247,
    protein: 13,
    carbs: 41,
    fat: 4.2,
    size: 100,
  },

  // Sayuran
  {
    name: "Brokoli",
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    size: 100,
  },
  {
    name: "Bayam",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    size: 100,
  },
  {
    name: "Paprika",
    calories: 31,
    protein: 1,
    carbs: 7,
    fat: 0.3,
    size: 100,
  },
  {
    name: "Wortel",
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    size: 100,
  },
  {
    name: "Alpukat",
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    size: 100,
  },

  // Buah-buahan
  {
    name: "Pisang",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    size: 1,
  },
  {
    name: "Apel",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    size: 1,
  },
  {
    name: "Blueberry",
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
    size: 100,
  },
  {
    name: "Jeruk",
    calories: 47,
    protein: 0.9,
    carbs: 12,
    fat: 0.1,
    size: 1,
  },
  {
    name: "Stroberi",
    calories: 32,
    protein: 0.7,
    carbs: 8,
    fat: 0.3,
    size: 100,
  },

  // Kacang & Biji-bijian
  {
    name: "Almond",
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    size: 100,
  },
  {
    name: "Kenari",
    calories: 654,
    protein: 15,
    carbs: 14,
    fat: 65,
    size: 100,
  },
  {
    name: "Biji Chia",
    calories: 486,
    protein: 17,
    carbs: 42,
    fat: 31,
    size: 100,
  },
  {
    name: "Selai Kacang",
    calories: 588,
    protein: 25,
    carbs: 20,
    fat: 50,
    size: 100,
  },
  {
    name: "Minyak Zaitun",
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    size: 100,
  },
];

export async function seedAppFood() {
  console.log("🌱 Seeding AppFood...");
  
  for await (const data of seedDataAppFood) {
    const existing = await db.appFood.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      console.log(`⏭️  Dilewati: ${data.name}`);
      continue;
    }

    await db.appFood.create({ data });
    console.log(`✔️  Ditambahkan: ${data.name}`);
  }
}
