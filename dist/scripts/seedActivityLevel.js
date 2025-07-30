"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppActivityLevel = seedAppActivityLevel;
const db_1 = __importDefault(require("../config/db"));
const seedDataAppActivityLevel = [
    {
        name: "Tidak Aktif",
        description: "Hampir tidak pernah berolahraga atau melakukan aktivitas fisik",
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
async function seedAppActivityLevel() {
    console.log("🌱 Seeding AppActivityLevel...");
    for await (const data of seedDataAppActivityLevel) {
        const existing = await db_1.default.appActivityLevel.findFirst({
            where: { name: data.name },
        });
        if (existing) {
            console.log(`⏭️  Dilewati: ${data.name}`);
            continue;
        }
        await db_1.default.appActivityLevel.create({ data });
        console.log(`✔️  Ditambahkan: ${data.name}`);
    }
}
