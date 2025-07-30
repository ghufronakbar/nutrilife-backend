"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const BaseController_1 = require("./BaseController");
const db_1 = __importDefault(require("../config/db"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class ContentController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.getAppPrimaryGoals = async (req, res) => {
            try {
                const data = await db_1.default.appPrimaryGoal.findMany();
                return this.sendSuccess(res, data, "Berhasil mendapatkan data");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        this.getAppActivityLevels = async (req, res) => {
            try {
                const data = await db_1.default.appActivityLevel.findMany();
                return this.sendSuccess(res, data, "Berhasil mendapatkan data");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        this.getAppFoods = async (req, res) => {
            try {
                const [appFoods, appMenus] = await Promise.all([
                    db_1.default.appFood.findMany(),
                    db_1.default.appMenu.findMany({
                        include: {
                            appFoods: true,
                        },
                    }),
                ]);
                const mappedFoods = appFoods.map((food) => ({
                    id: food.id,
                    name: food.name,
                    description: null,
                    calories: food.calories,
                    protein: food.protein,
                    carbs: food.carbs,
                    fat: food.fat,
                    type: "food",
                }));
                const mappedMenus = appMenus.map((menu) => ({
                    id: menu.id,
                    name: menu.name,
                    description: menu.description,
                    calories: menu.appFoods.reduce((total, food) => total + food.calories, 0),
                    protein: menu.appFoods.reduce((total, food) => total + food.protein, 0),
                    carbs: menu.appFoods.reduce((total, food) => total + food.carbs, 0),
                    fat: menu.appFoods.reduce((total, food) => total + food.fat, 0),
                    type: "menu",
                }));
                const data = {
                    foods: mappedFoods,
                    menus: mappedMenus,
                };
                return this.sendSuccess(res, data, "Berhasil mendapatkan data");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        this.getSuggestedMenus = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                const user = await db_1.default.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        userPreferences: {
                            take: 1,
                            where: {
                                endedAt: null,
                            },
                            orderBy: {
                                startedAt: "desc",
                            },
                            select: {
                                appPrimaryGoal: {
                                    select: {
                                        appPlanningMenus: {
                                            include: {
                                                appMenus: {
                                                    include: {
                                                        appFoods: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!user || user.userPreferences.length === 0) {
                    return this.sendError(res, new Error("User not found"), 400);
                }
                const suggestedMenus = user.userPreferences[0].appPrimaryGoal.appPlanningMenus;
                const defaultDayNames = {
                    1: "Senin",
                    2: "Selasa",
                    3: "Rabu",
                    4: "Kamis",
                    5: "Jumat",
                    6: "Sabtu",
                    7: "Minggu",
                };
                // Hitung hari saat ini dan besok di Asia/Jakarta
                const now = (0, moment_timezone_1.default)().tz("Asia/Jakarta");
                const today = now.isoWeekday(); // 1 (Senin) - 7 (Minggu)
                const tomorrow = now.clone().add(1, "day").isoWeekday();
                const result = [];
                // Urutkan hari dimulai dari hari ini
                const orderedDays = [];
                for (let i = 0; i < 7; i++) {
                    let day = (((today + i - 1) % 7) + 1);
                    orderedDays.push(day);
                }
                for (const day of orderedDays) {
                    const menusForDay = suggestedMenus.filter((menu) => menu.day === day);
                    const types = [];
                    ["BREAKFAST", "LUNCH", "DINNER", "SNACK"].forEach((type) => {
                        const filteredMenus = menusForDay
                            .filter((m) => m.type === type)
                            .flatMap((m) => m.appMenus);
                        if (filteredMenus.length > 0) {
                            types.push({
                                type: type,
                                time: this.getTime(type),
                                menus: filteredMenus.map((m) => ({
                                    id: m.id,
                                    name: m.name,
                                    description: m.description,
                                    calories: m.appFoods.reduce((total, food) => total + food.calories, 0),
                                    protein: m.appFoods.reduce((total, food) => total + food.protein, 0),
                                    carbs: m.appFoods.reduce((total, food) => total + food.carbs, 0),
                                    fat: m.appFoods.reduce((total, food) => total + food.fat, 0),
                                })),
                            });
                        }
                    });
                    // Tentukan nama hari dinamis
                    let dayName = defaultDayNames[day];
                    if (day === today) {
                        dayName = "Hari Ini";
                    }
                    else if (day === tomorrow) {
                        dayName = "Besok";
                    }
                    result.push({
                        day,
                        dayName,
                        types,
                    });
                }
                return this.sendSuccess(res, result, "Berhasil mendapatkan data");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
    }
    getTime(time) {
        switch (time) {
            case "BREAKFAST":
                return "7:00 AM";
            case "LUNCH":
                return "12:00 PM";
            case "DINNER":
                return "6:00 PM";
            case "SNACK":
                return "9:00 PM";
        }
    }
}
exports.ContentController = ContentController;
