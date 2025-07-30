"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceController = void 0;
const BaseController_1 = require("./BaseController");
const db_1 = __importDefault(require("../config/db"));
const nutrition_1 = require("../utils/nutrition");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class PreferenceController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.editPreference = async (req, res) => {
            try {
                const data = req.body;
                const userId = req.user.id;
                const { activityLevelId, height, primaryGoalId, weight } = data;
                const [checkActivity, checkGoal, checkUser] = await Promise.all([
                    db_1.default.appActivityLevel.findUnique({
                        where: {
                            id: activityLevelId,
                        },
                    }),
                    db_1.default.appPrimaryGoal.findUnique({
                        where: {
                            id: primaryGoalId,
                        },
                    }),
                    db_1.default.user.findUnique({
                        where: {
                            id: userId,
                        },
                    }),
                ]);
                if (!checkActivity || !checkGoal) {
                    return this.sendError(res, new Error("Data activity level atau goal tidak ditemukan"), 400);
                }
                if (!checkUser) {
                    return this.sendError(res, new Error("Data user tidak ditemukan"), 400);
                }
                const age = (0, nutrition_1.calculateAge)(checkUser.dateOfBirth);
                const bmr = (0, nutrition_1.calculateBMR)(checkUser.gender, weight, height, age);
                const tdee = (0, nutrition_1.calculateTDEE)(bmr, checkActivity.factor);
                const dailyCalories = (0, nutrition_1.calculateDailyCalories)(tdee, checkGoal.factor);
                const { carbsGoal, proteinGoal, fatGoal } = (0, nutrition_1.calculateMacros)(dailyCalories);
                const now = (0, moment_timezone_1.default)().tz("Asia/Jakarta");
                await db_1.default.userPreference.updateMany({
                    where: {
                        AND: [
                            {
                                userId: userId,
                            },
                            {
                                endedAt: now.toDate(),
                            },
                        ],
                    },
                    data: {
                        endedAt: new Date(),
                    },
                });
                const preference = await db_1.default.userPreference.create({
                    data: {
                        userId,
                        appActivityLevelId: data.activityLevelId,
                        appPrimaryGoalId: data.primaryGoalId,
                        bmr,
                        carbsGoal,
                        dailyCalories,
                        fatGoal,
                        height,
                        proteinGoal,
                        tdee,
                        weight,
                    },
                });
                return this.sendSuccess(res, preference, "Berhasil mengubah preferensi pengguna");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        // calculate (by pref and food log) and return user preferences, like goals, streak and another
        this.getPreference = async (req, res) => {
            try {
                const userId = req.user.id;
                // Waktu sekarang Indonesia (WIB)
                const now = (0, moment_timezone_1.default)().tz("Asia/Jakarta");
                const startOfDay = now.clone().startOf("day").toDate();
                const endOfDay = now.clone().endOf("day").toDate();
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
                                appActivityLevel: true,
                                appPrimaryGoal: true,
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
                if (!user || !user.userPreferences.length) {
                    return this.sendError(res, new Error("Data user tidak ditemukan"), 400);
                }
                const pref = user.userPreferences[0];
                // Total konsumsi hari ini
                const total = pref.foodLogs.reduce((acc, log) => {
                    const portionMultiplier = log.portions || 1;
                    acc.calories += log.calories * portionMultiplier;
                    acc.carbs += log.carbs * portionMultiplier;
                    acc.protein += log.protein * portionMultiplier;
                    acc.fat += log.fat * portionMultiplier;
                    return acc;
                }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
                const progress = {
                    calories: {
                        current: total.calories,
                        need: pref.dailyCalories,
                        percentage: Math.min((total.calories / pref.dailyCalories) * 100, 100),
                    },
                    protein: {
                        current: total.protein,
                        need: pref.proteinGoal,
                        percentage: Math.min((total.protein / pref.proteinGoal) * 100, 100),
                    },
                    carbs: {
                        current: total.carbs,
                        need: pref.carbsGoal,
                        percentage: Math.min((total.carbs / pref.carbsGoal) * 100, 100),
                    },
                    fat: {
                        current: total.fat,
                        need: pref.fatGoal,
                        percentage: Math.min((total.fat / pref.fatGoal) * 100, 100),
                    },
                };
                return this.sendSuccess(res, {
                    preference: {
                        bmr: pref.bmr,
                        tdee: pref.tdee,
                        dailyCalories: pref.dailyCalories,
                        proteinGoal: pref.proteinGoal,
                        carbsGoal: pref.carbsGoal,
                        fatGoal: pref.fatGoal,
                    },
                    progress,
                }, "Berhasil mengambil data preferensi dan progress pengguna");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
    }
}
exports.PreferenceController = PreferenceController;
