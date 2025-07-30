"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const seedActivityLevel_1 = require("./seedActivityLevel");
const seedPrimaryGoal_1 = require("./seedPrimaryGoal");
const seedAppFood_1 = require("./seedAppFood");
const seedAppMenu_1 = require("./seedAppMenu");
const seedAppPlanningMenu_1 = require("./seedAppPlanningMenu");
async function main() {
    console.log("🚀 Mulai proses seeding...");
    await db_1.default.appFood.deleteMany({
        where: {
            id: {
                not: "",
            },
        },
    });
    console.log("App Food Deleted");
    await db_1.default.appMenu.deleteMany({
        where: {
            id: {
                not: "",
            },
        },
    });
    console.log("App Menu Deleted");
    await db_1.default.appPlanningMenu.deleteMany({
        where: {
            id: {
                not: "",
            },
        },
    });
    console.log("App Planning Menu Deleted");
    await (0, seedActivityLevel_1.seedAppActivityLevel)();
    await (0, seedPrimaryGoal_1.seedAppPrimaryGoal)();
    await (0, seedAppPlanningMenu_1.seedAppPlanningMenu)();
    await (0, seedAppFood_1.seedAppFood)();
    await (0, seedAppMenu_1.seedAppMenu)();
    console.log("✅ Proses seeding selesai.");
}
main()
    .catch((e) => {
    console.error("❌ Gagal seeding:", e);
    process.exit(1);
})
    .finally(async () => {
    await db_1.default.$disconnect();
});
