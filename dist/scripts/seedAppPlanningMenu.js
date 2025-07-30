"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppPlanningMenu = seedAppPlanningMenu;
const db_1 = __importDefault(require("../config/db"));
async function seedAppPlanningMenu() {
    console.log("🌱 Seeding AppPlanningMenu...");
    const DAYS = [1, 2, 3, 4, 5, 6, 7];
    const TYPES = ["BREAKFAST", "LUNCH", "SNACK", "DINNER"];
    const data = DAYS.flatMap((day) => TYPES.map((type) => ({
        day,
        type,
    })));
    const appPrimaryGoals = await db_1.default.appPrimaryGoal.findMany();
    const result = await db_1.default.appPlanningMenu.createManyAndReturn({
        data,
    });
    let count = 0;
    for await (const planningMenu of result) {
        for await (const appPrimaryGoal of appPrimaryGoals) {
            count++;
            const connected = await db_1.default.appPlanningMenu.update({
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
            });
            console.log(`${count} | ${planningMenu.id} | ditambahkan`);
        }
    }
    console.log("✅ Seeding AppPlanningMenu completed.");
}
