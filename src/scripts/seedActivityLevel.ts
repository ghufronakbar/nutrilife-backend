import { Prisma } from ".prisma/client";
import db from "../config/db";

const seedDataAppActivityLevel: Prisma.AppActivityLevelCreateInput[] = [
  {
    name: "Tidak Aktif",
    description:
      "Hampir tidak pernah berolahraga atau melakukan aktivitas fisik",
    factor: 1.2,
  },
  {
    name: "Ringan",
    description: "Berolahraga ringan 1–3 kali dalam seminggu",
    factor: 1.375,
  },
  {
    name: "Sedang",
    description: "Berolahraga sedang 3–5 kali dalam seminggu",
    factor: 1.55,
  },
  {
    name: "Aktif",
    description: "Berolahraga berat 6–7 kali seminggu",
    factor: 1.725,
  },
  {
    name: "Sangat Aktif",
    description: "Latihan intensif setiap hari dan pekerjaan fisik berat",
    factor: 1.9,
  },
];

export async function seedAppActivityLevel() {
  console.log("🌱 Seeding AppActivityLevel...");
  for await (const data of seedDataAppActivityLevel) {
    const existing = await db.appActivityLevel.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      console.log(`⏭️  Dilewati: ${data.name}`);
      continue;
    }

    await db.appActivityLevel.create({ data });
    console.log(`✔️  Ditambahkan: ${data.name}`);
  }
}
