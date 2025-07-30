import { $Enums } from ".prisma/client";
import db from "../config/db";

export async function seedAppPlanningMenu() {
  console.log("🌱 Seeding AppPlanningMenu...");

  const DAYS: number[] = [1, 2, 3, 4, 5, 6, 7];
  const TYPES: $Enums.MealType[] = ["BREAKFAST", "LUNCH", "SNACK", "DINNER"];

  const data = DAYS.flatMap((day) =>
    TYPES.map((type) => ({
      day,
      type,
    }))
  );
  
  const appPrimaryGoals = await db.appPrimaryGoal.findMany();

  const result = await db.appPlanningMenu.createManyAndReturn({
    data,
  });

  let count = 0;
  for await (const planningMenu of result) {
   for await (const appPrimaryGoal of appPrimaryGoals) {
     count++;
     const connected = await db.appPlanningMenu.update({
       where: {
         id: planningMenu.id,
       },
       data: {
         appPrimaryGoals: {
           connect: {
             id: appPrimaryGoal.id,
           },
         },
       },
     })
     console.log(`${count} | ${planningMenu.id} | ditambahkan`)
    }
  }

  console.log("✅ Seeding AppPlanningMenu completed.");
}
