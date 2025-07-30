"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = calculateAge;
exports.calculateBMR = calculateBMR;
exports.calculateTDEE = calculateTDEE;
exports.calculateDailyCalories = calculateDailyCalories;
exports.calculateMacros = calculateMacros;
const dayjs_1 = __importDefault(require("dayjs"));
function calculateAge(dateOfBirth) {
    return (0, dayjs_1.default)().diff((0, dayjs_1.default)(dateOfBirth), "year");
}
function calculateBMR(gender, weight, height, age) {
    if (gender === "M") {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}
function calculateTDEE(bmr, activityMultiplier) {
    return bmr * activityMultiplier;
}
function calculateDailyCalories(tdee, goalMultiplier) {
    return tdee * goalMultiplier;
}
function calculateMacros(dailyCalories) {
    const proteinCalories = 0.3 * dailyCalories;
    const fatCalories = 0.25 * dailyCalories;
    const carbsCalories = 0.45 * dailyCalories;
    return {
        proteinGoal: proteinCalories / 4, // 4 cal per gram
        fatGoal: fatCalories / 9, // 9 cal per gram
        carbsGoal: carbsCalories / 4, // 4 cal per gram
    };
}
