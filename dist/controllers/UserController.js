"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const BaseController_1 = require("./BaseController");
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../constant/auth");
const nutrition_1 = require("../utils/nutrition");
class UserController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.login = async (req, res) => {
            try {
                const data = req.body;
                const user = await db_1.default.user.findUnique({
                    where: {
                        email: data.email,
                    },
                    include: {
                        userPreferences: {
                            where: {
                                endedAt: null,
                            },
                            take: 1,
                        },
                    },
                });
                if (!user) {
                    return this.sendError(res, new Error("Pengguna tidak ditemukan"), 400);
                }
                const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
                if (!isMatch) {
                    return this.sendError(res, new Error("Password salah"), 400);
                }
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, auth_1.JWT_SECRET);
                return this.sendSuccess(res, {
                    ...user,
                    accessToken,
                }, "Login berhasil");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        this.register = async (req, res) => {
            try {
                const data = req.body;
                const { lifestyle, personalInformation, physicalStats } = data;
                const { activityLevelId, primaryGoalId } = lifestyle;
                const { height, weight } = physicalStats;
                const { dateOfBirth, email, gender, name, password } = personalInformation;
                const [checkEmail, checkActivityLevel, checkPrimaryGoal] = await Promise.all([
                    db_1.default.user.findUnique({
                        where: {
                            email,
                        },
                    }),
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
                ]);
                if (checkEmail) {
                    return this.sendError(res, new Error("Email sudah terdaftar"), 400);
                }
                if (!checkActivityLevel || !checkPrimaryGoal) {
                    return this.sendError(res, new Error("Data tidak valid"), 400);
                }
                const hashedPassword = await bcryptjs_1.default.hash(data.personalInformation.password, 10);
                const age = (0, nutrition_1.calculateAge)(dateOfBirth);
                const bmr = (0, nutrition_1.calculateBMR)(gender, weight, height, age);
                const tdee = (0, nutrition_1.calculateTDEE)(bmr, checkActivityLevel.factor);
                const dailyCalories = (0, nutrition_1.calculateDailyCalories)(tdee, checkPrimaryGoal.factor);
                const { carbsGoal, proteinGoal, fatGoal } = (0, nutrition_1.calculateMacros)(dailyCalories);
                const user = await db_1.default.user.create({
                    data: {
                        password: hashedPassword,
                        dateOfBirth,
                        email,
                        gender: gender,
                        name,
                        picture: null,
                        userPreferences: {
                            create: {
                                bmr,
                                carbsGoal,
                                dailyCalories,
                                fatGoal,
                                proteinGoal,
                                tdee,
                                height,
                                weight,
                                appPrimaryGoalId: primaryGoalId,
                                appActivityLevelId: activityLevelId,
                                endedAt: null,
                            },
                        },
                    },
                    include: {
                        userPreferences: true,
                    },
                });
                const accessToken = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id }, auth_1.JWT_SECRET);
                return this.sendSuccess(res, {
                    ...user,
                    accessToken,
                }, "Pengguna berhasil didaftarkan");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        this.editProfile = async (req, res) => {
            try {
                const data = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.user.id;
                const checkEmail = await db_1.default.user.findUnique({
                    where: {
                        email: data.email,
                    },
                });
                if (checkEmail && checkEmail.id !== userId) {
                    return this.sendError(res, new Error("Email sudah terdaftar"), 400);
                }
                const user = await db_1.default.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        email: data.email,
                        picture: data.picture || null,
                        name: data.name,
                    },
                    include: {
                        userPreferences: {
                            where: {
                                endedAt: null,
                            },
                            take: 1,
                        },
                    },
                });
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, auth_1.JWT_SECRET);
                return this.sendSuccess(res, { ...user, accessToken }, "Profil berhasil diubah");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const userId = req === null || req === void 0 ? void 0 : req.user.id;
                const user = await db_1.default.user.findUnique({
                    where: {
                        id: userId,
                    },
                    include: {
                        userPreferences: {
                            where: {
                                endedAt: null,
                            },
                            include: {
                                appActivityLevel: true,
                                appPrimaryGoal: true,
                                foodLogs: {
                                    orderBy: {
                                        createdAt: "desc",
                                    },
                                },
                            },
                            take: 1,
                        },
                    },
                });
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, auth_1.JWT_SECRET);
                return this.sendSuccess(res, { ...user, accessToken }, "Profil berhasil diambil");
            }
            catch (error) {
                return this.sendError(res, error);
            }
        };
    }
}
exports.UserController = UserController;
