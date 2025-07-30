"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodController = void 0;
const BaseController_1 = require("./BaseController");
const db_1 = __importDefault(require("../config/db"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class FoodController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.getLogs = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                const data = await db_1.default.foodLog.findMany({
                    where: {
                        userPreferences: {
                            userId: userId,
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                // Kelompokkan berdasarkan tanggal (Asia/Jakarta)
                const grouped = data.reduce((acc, log) => {
                    const date = (0, moment_timezone_1.default)(log.createdAt)
                        .tz("Asia/Jakarta")
                        .format("YYYY-MM-DD");
                    if (!acc[date])
                        acc[date] = [];
                    acc[date].push(log);
                    return acc;
                }, {});
                // Ubah menjadi array
                const result = Object.keys(grouped).map((date) => ({
                    date,
                    foods: grouped[date],
                }));
                return this.sendSuccess(res, result);
            }
            catch (err) {
                return this.sendError(res, err);
            }
        };
        this.createLog = async (req, res) => {
            var _a, _b;
            try {
                const userId = req.user.id;
                const data = req.body;
                const { id, type, portions } = data;
                // Waktu sekarang Indonesia (WIB)
                const now = (0, moment_timezone_1.default)().tz("Asia/Jakarta");
                const startOfDay = now.clone().startOf("day").toDate();
                const endOfDay = now.clone().endOf("day").toDate();
                let calories = 0;
                let carbs = 0;
                let protein = 0;
                let fat = 0;
                let size = 0;
                let name = "";
                if (type === "food") {
                    const check = await db_1.default.appFood.findUnique({
                        where: {
                            id: id,
                        },
                        select: {
                            calories: true,
                            carbs: true,
                            fat: true,
                            protein: true,
                            name: true,
                            size: true,
                        },
                    });
                    if (!check) {
                        return this.sendError(res, new Error("Data makanan tidak ditemukan"), 400);
                    }
                    calories = check.calories * portions;
                    carbs = check.carbs * portions;
                    protein = check.protein * portions;
                    fat = check.fat * portions;
                    size = check.size * portions;
                    name = check.name;
                }
                else {
                    const check = await db_1.default.appMenu.findUnique({
                        where: {
                            id: id,
                        },
                        select: {
                            appFoods: {
                                select: {
                                    calories: true,
                                    carbs: true,
                                    fat: true,
                                    protein: true,
                                    size: true,
                                },
                            },
                            name: true,
                        },
                    });
                    if (!check) {
                        return this.sendError(res, new Error("Data menu tidak ditemukan"), 400);
                    }
                    check.appFoods.forEach((f) => {
                        calories += f.calories * portions;
                        carbs += f.carbs * portions;
                        protein += f.protein * portions;
                        fat += f.fat * portions;
                        size += f.size * portions;
                    });
                    name = check.name;
                }
                const user = await db_1.default.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        userPreferences: {
                            where: {
                                endedAt: null,
                            },
                            include: {
                                foodLogs: {
                                    where: {
                                        createdAt: {
                                            gte: startOfDay,
                                            lte: endOfDay,
                                        },
                                    },
                                },
                            },
                            take: 1,
                        },
                    },
                });
                if (!user || !((_a = user === null || user === void 0 ? void 0 : user.userPreferences) === null || _a === void 0 ? void 0 : _a.length)) {
                    return this.sendError(res, new Error("Data user tidak ditemukan"), 400);
                }
                const food = await db_1.default.foodLog.create({
                    data: {
                        calories,
                        carbs,
                        fat,
                        name,
                        portions,
                        protein,
                        size: portions,
                        userPreferencesId: (_b = user === null || user === void 0 ? void 0 : user.userPreferences) === null || _b === void 0 ? void 0 : _b[0].id,
                        createdAt: now.toDate(),
                        updatedAt: now.toDate(),
                    },
                });
                return this.sendSuccess(res, food, "Berhasil menambahkan log makanan");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        this.deleteLog = async (req, res) => {
            try {
                const { id } = req.params;
                const check = await db_1.default.foodLog.findUnique({
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                    },
                });
                if (!check) {
                    return this.sendError(res, new Error("Data log tidak ditemukan"), 400);
                }
                const food = await db_1.default.foodLog.delete({
                    where: {
                        id: id,
                    },
                });
                return this.sendSuccess(res, food, "Berhasil menghapus log makanan");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
    }
}
exports.FoodController = FoodController;
