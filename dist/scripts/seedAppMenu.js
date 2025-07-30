"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppMenu = seedAppMenu;
const db_1 = __importDefault(require("../config/db"));
async function seedAppMenu() {
    console.log("🌱 Seeding AppMenu...");
    const allFoods = await db_1.default.appFood.findMany();
    const menus = [
        {
            name: "Salad Ayam Panggang",
            description: "Sayuran campur dengan ayam panggang dan alpukat",
            foodNames: ["Brokoli", "Dada Ayam", "Alpukat"],
            type: "BREAKFAST",
        },
        {
            name: "Nasi Merah dengan Daging Sapi",
            description: "Nasi merah hangat dengan daging sapi giling dan sayur",
            foodNames: ["Nasi Merah", "Daging Sapi Giling Tanpa Lemak", "Bayam"],
            type: "LUNCH",
        },
        {
            name: "Smoothie Stroberi Blueberry",
            description: "Smoothie buah segar campuran stroberi dan blueberry",
            foodNames: ["Stroberi", "Blueberry", "Yogurt Yunani"],
            type: "SNACK",
        },
        {
            name: "Roti Gandum dengan Selai Kacang",
            description: "Sarapan cepat dengan roti gandum dan selai kacang",
            foodNames: ["Roti Gandum Utuh", "Selai Kacang"],
            type: "BREAKFAST",
        },
        {
            name: "Salmon Panggang dan Quinoa",
            description: "Fillet salmon panggang disajikan dengan quinoa dan wortel",
            foodNames: ["Fillet Salmon", "Quinoa", "Wortel"],
            type: "DINNER",
        },
        {
            name: "Telur Rebus dan Bayam",
            description: "Telur rebus dengan bayam tumis dan paprika",
            foodNames: ["Telur (Besar)", "Bayam", "Paprika"],
            type: "BREAKFAST",
        },
        {
            name: "Oatmeal Pisang",
            description: "Oatmeal lembut dengan topping pisang dan almond",
            foodNames: ["Oatmeal", "Pisang", "Almond"],
            type: "BREAKFAST",
        },
        {
            name: "Quinoa Salad",
            description: "Salad sehat dengan quinoa, alpukat, dan paprika",
            foodNames: ["Quinoa", "Alpukat", "Paprika"],
            type: "LUNCH",
        },
        {
            name: "Snack Kacang dan Apel",
            description: "Camilan sehat dengan kenari dan potongan apel",
            foodNames: ["Kenari", "Apel"],
            type: "SNACK",
        },
        {
            name: "Dada Ayam dengan Sayuran",
            description: "Dada ayam panggang dengan brokoli dan wortel",
            foodNames: ["Dada Ayam", "Brokoli", "Wortel"],
            type: "DINNER",
        },
        {
            name: "Selai Kacang dan Pisang",
            description: "Camilan energi tinggi dengan selai kacang dan pisang",
            foodNames: ["Selai Kacang", "Pisang"],
            type: "SNACK",
        },
        {
            name: "Salad Bayam dan Alpukat",
            description: "Salad segar dengan bayam, alpukat, dan telur rebus",
            foodNames: ["Bayam", "Alpukat", "Telur (Besar)"],
            type: "LUNCH",
        },
        {
            name: "Nasi Merah dan Ayam",
            description: "Nasi merah dengan potongan dada ayam dan paprika",
            foodNames: ["Nasi Merah", "Dada Ayam", "Paprika"],
            type: "DINNER",
        },
        {
            name: "Stroberi dan Yogurt",
            description: "Yogurt Yunani dengan topping stroberi dan chia",
            foodNames: ["Yogurt Yunani", "Stroberi", "Biji Chia"],
            type: "SNACK",
        },
        {
            name: "Roti Alpukat Telur",
            description: "Roti gandum dengan alpukat dan telur rebus",
            foodNames: ["Roti Gandum Utuh", "Alpukat", "Telur (Besar)"],
            type: "BREAKFAST",
        },
        {
            name: "Salmon dan Sayur Panggang",
            description: "Salmon panggang dengan brokoli dan bayam",
            foodNames: ["Fillet Salmon", "Brokoli", "Bayam"],
            type: "DINNER",
        },
        {
            name: "Bubur Oat dengan Buah",
            description: "Oatmeal hangat dengan topping apel dan blueberry",
            foodNames: ["Oatmeal", "Apel", "Blueberry"],
            type: "BREAKFAST",
        },
        {
            name: "Quinoa dan Ayam",
            description: "Quinoa hangat dengan potongan dada ayam dan paprika",
            foodNames: ["Quinoa", "Dada Ayam", "Paprika"],
            type: "LUNCH",
        },
        {
            name: "Minyak Zaitun dan Sayuran",
            description: "Sayuran kukus dengan sedikit minyak zaitun",
            foodNames: ["Wortel", "Brokoli", "Minyak Zaitun"],
            type: "DINNER",
        },
        {
            name: "Chia Bowl",
            description: "Bowl sehat dengan biji chia, pisang, dan blueberry",
            foodNames: ["Biji Chia", "Pisang", "Blueberry"],
            type: "SNACK",
        },
    ];
    for await (const menu of menus) {
        const existing = await db_1.default.appMenu.findFirst({
            where: { name: menu.name },
        });
        if (existing) {
            console.log(`⏭️  Dilewati: ${menu.name}`);
            continue;
        }
        const relatedFoods = allFoods.filter((f) => menu.foodNames.includes(f.name));
        const menuCreated = await db_1.default.appMenu.create({
            data: {
                name: menu.name,
                description: menu.description,
                appFoods: {
                    connect: relatedFoods.map((f) => ({ id: f.id })),
                },
            },
        });
        const plans = await db_1.default.appPlanningMenu.findMany({
            where: {
                type: menu.type,
            },
        });
        for await (const plan of plans) {
            const connectPlan = await db_1.default.appMenu.update({
                where: {
                    id: menuCreated.id,
                },
                data: {
                    appPlaningMenus: {
                        connect: {
                            id: plan.id,
                        },
                    },
                },
                select: {
                    appPlaningMenus: {
                        take: 1,
                        where: {
                            id: plan.id,
                        },
                        select: {
                            day: true,
                            type: true,
                        },
                    },
                    name: true,
                },
            });
            console.log(`✔️  Ditambahkan: ${connectPlan.name} ke hari ${connectPlan.appPlaningMenus[0].day} ${connectPlan.appPlaningMenus[0].type}`);
        }
    }
}
