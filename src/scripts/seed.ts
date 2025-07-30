import db from "../config/db";
import { seedAppActivityLevel } from "./seedActivityLevel";
import { seedAppPrimaryGoal } from "./seedPrimaryGoal";
import { seedAppFood } from "./seedAppFood";
import { seedAppMenu } from "./seedAppMenu";
import { seedAppPlanningMenu } from "./seedAppPlanningMenu";

async function main() {
  console.log("🚀 Mulai proses seeding...");

  await db.appFood.deleteMany({
    where: {
      id: {
        not: "",
      },
    },
  });

  console.log("App Food Deleted");

  await db.appMenu.deleteMany({
    where: {
      id: {
        not: "",
      },
    },
  });

  console.log("App Menu Deleted");

  await db.appPlanningMenu.deleteMany({
    where: {
      id: {
        not: "",
      },
    },
  });

  console.log("App Planning Menu Deleted");

  await seedAppActivityLevel();
  await seedAppPrimaryGoal();
  await seedAppPlanningMenu();
  await seedAppFood();
  await seedAppMenu();
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
