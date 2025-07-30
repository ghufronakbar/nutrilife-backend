import db from "../config/db";
import { $Enums, Prisma } from "@prisma/client";

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

const seedDataAppFood: Prisma.AppFoodCreateInput[] = [
  {
    name: "Nasi Putih",
    calories: 175,
    carbs: 40,
    protein: 2,
    fat: 0.3,
    size: 150,
  },
  {
    name: "Telur Rebus",
    calories: 68,
    carbs: 0.5,
    protein: 6,
    fat: 5,
    size: 60,
  },
  {
    name: "Ayam Panggang",
    calories: 165,
    carbs: 0,
    protein: 31,
    fat: 3.6,
    size: 100,
  },
  {
    name: "Sayur Bayam",
    calories: 35,
    carbs: 7,
    protein: 2,
    fat: 0.5,
    size: 100,
  },
];

async function seedAppActivityLevel() {
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

async function seedAppPrimaryGoal() {
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

async function seedAppFood() {
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

async function seedAppMenu() {
  console.log("🌱 Seeding AppMenu...");
  const allFoods = await db.appFood.findMany();

  const menus = [
    {
      name: "Menu Sarapan Sehat",
      description: "Menu ringan dan bergizi untuk sarapan.",
      foodNames: ["Nasi Putih", "Telur Rebus", "Sayur Bayam"],
    },
    {
      name: "Menu Makan Siang",
      description: "Menu seimbang untuk makan siang.",
      foodNames: ["Nasi Putih", "Ayam Panggang", "Sayur Bayam"],
    },
  ];

  for await (const menu of menus) {
    const existing = await db.appMenu.findFirst({
      where: { name: menu.name },
    });

    if (existing) {
      console.log(`⏭️  Dilewati: ${menu.name}`);
      continue;
    }

    const relatedFoods = allFoods.filter((f) =>
      menu.foodNames.includes(f.name)
    );

    const menuCreated = await db.appMenu.create({
      data: {
        name: menu.name,
        description: menu.description,
        appFoods: {
          connect: relatedFoods.map((f) => ({ id: f.id })),
        },
      },
    });

    console.log(`✔️  Ditambahkan: ${menuCreated.name}`);
  }
}

async function seedAppPlanningMenu() {
  console.log("🌱 Seeding AppPlanningMenu...");

  const allMenus = await db.appMenu.findMany();
  const allGoals = await db.appPrimaryGoal.findMany();

  const planningMenus = [
    {
      type: "BREAKFAST",
      day: 1,
      menuNames: ["Menu Sarapan Sehat"],
      goalNames: [
        "Menurunkan Berat Badan",
        "Menjaga Berat Badan",
        "Menaikkan Berat Badan",
      ],
    },
    {
      type: "LUNCH",
      day: 1,
      menuNames: ["Menu Makan Siang"],
      goalNames: ["Menjaga Berat Badan", "Meningkatkan Massa Otot"],
    },
  ];

  for await (const item of planningMenus) {
    const existing = await db.appPlanningMenu.findFirst({
      where: {
        type: item.type as $Enums.MealType,
        day: item.day,
      },
    });

    if (existing) {
      console.log(`⏭️  Dilewati: ${item.type} Hari ${item.day}`);
      continue;
    }

    const relatedMenus = allMenus.filter((m) =>
      item.menuNames.includes(m.name)
    );
    const relatedGoals = allGoals.filter((g) =>
      item.goalNames.includes(g.name)
    );

    const planning = await db.appPlanningMenu.create({
      data: {
        type: item.type as Prisma.AppPlanningMenuCreateInput["type"],
        day: item.day,
        appMenus: {
          connect: relatedMenus.map((m) => ({ id: m.id })),
        },
        appPrimaryGoals: {
          connect: relatedGoals.map((g) => ({ id: g.id })),
        },
      },
    });

    console.log(
      `✔️  Ditambahkan: Menu Perencanaan Hari ${item.day} - ${item.type}`
    );
  }
}

async function main() {
  console.log("🚀 Mulai proses seeding...");
  await seedAppActivityLevel();
  await seedAppPrimaryGoal();
  await seedAppFood();
  await seedAppMenu();
  await seedAppPlanningMenu();
  console.log("✅ Proses seeding selesai.");
}

main()
  .catch((e) => {
    console.error("❌ Gagal seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
