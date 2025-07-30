"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppPrimaryGoal = seedAppPrimaryGoal;
const db_1 = __importDefault(require("../config/db"));
const seedDataAppPrimaryGoal = [
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
async function seedAppPrimaryGoal() {
    console.log("🌱 Seeding AppPrimaryGoal...");
    for await (const data of seedDataAppPrimaryGoal) {
        const existing = await db_1.default.appPrimaryGoal.findFirst({
            where: { name: data.name },
        });
        if (existing) {
            console.log(`⏭️  Dilewati: ${data.name}`);
            continue;
        }
        await db_1.default.appPrimaryGoal.create({ data });
        console.log(`✔️  Ditambahkan: ${data.name}`);
    }
}
