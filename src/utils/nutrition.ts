import { Gender } from "@prisma/client";
import dayjs from "dayjs";

export function calculateAge(dateOfBirth: Date): number {
  return dayjs().diff(dayjs(dateOfBirth), "year");
}

export function calculateBMR(
  gender: Gender,
  weight: number,
  height: number,
  age: number
): number {
  if (gender === "M") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activityMultiplier: number): number {
  return bmr * activityMultiplier;
}

export function calculateDailyCalories(
  tdee: number,
  goalMultiplier: number
): number {
  return tdee * goalMultiplier;
}

export function calculateMacros(dailyCalories: number): {
  carbsGoal: number;
  proteinGoal: number;
  fatGoal: number;
} {
  const proteinCalories = 0.3 * dailyCalories;
  const fatCalories = 0.25 * dailyCalories;
  const carbsCalories = 0.45 * dailyCalories;

  return {
    proteinGoal: proteinCalories / 4, // 4 cal per gram
    fatGoal: fatCalories / 9, // 9 cal per gram
    carbsGoal: carbsCalories / 4, // 4 cal per gram
  };
}
