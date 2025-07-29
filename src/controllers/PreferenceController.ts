import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { PreferenceSchemaType } from "src/validators/PreferenceValidator";
import db from "../config/db";
import {
  calculateAge,
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
  calculateMacros,
} from "../utils/nutrition";
import moment from "moment-timezone";

export class PreferenceController extends BaseController {
  constructor() {
    super();
  }

  editPreference = async (req: Request, res: Response) => {
    try {
      const data = req.body as PreferenceSchemaType;
      const userId = req.user.id;
      const { activityLevelId, height, primaryGoalId, weight } = data;

      const [checkActivity, checkGoal, checkUser] = await Promise.all([
        db.appActivityLevel.findUnique({
          where: {
            id: activityLevelId,
          },
        }),
        db.appPrimaryGoal.findUnique({
          where: {
            id: primaryGoalId,
          },
        }),
        db.user.findUnique({
          where: {
            id: userId,
          },
        }),
      ]);

      if (!checkActivity || !checkGoal) {
        return this.sendError(
          res,
          new Error("Data activity level atau goal tidak ditemukan"),
          400
        );
      }

      if (!checkUser) {
        return this.sendError(res, new Error("Data user tidak ditemukan"), 400);
      }

      const age = calculateAge(checkUser.dateOfBirth);
      const bmr = calculateBMR(checkUser.gender, weight, height, age);
      const tdee = calculateTDEE(bmr, checkActivity.weight);
      const dailyCalories = calculateDailyCalories(tdee, checkGoal.weight);

      const { carbsGoal, proteinGoal, fatGoal } =
        calculateMacros(dailyCalories);

      await db.userPreference.updateMany({
        where: {
          AND: [
            {
              userId: userId,
            },
            {
              endedAt: null,
            },
          ],
        },
        data: {
          endedAt: new Date(),
        },
      });

      const preference = await db.userPreference.create({
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

      return this.sendSuccess(
        res,
        preference,
        "Berhasil mengubah preferensi pengguna"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  // calculate (by pref and food log) and return user preferences, like goals, streak and another

  getPreference = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      // Waktu sekarang Indonesia (WIB)
      const now = moment().tz("Asia/Jakarta");
      const startOfDay = now.clone().startOf("day").toDate();
      const endOfDay = now.clone().endOf("day").toDate();

      const user = await db.user.findUnique({
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
      const total = pref.foodLogs.reduce(
        (acc, log) => {
          const portionMultiplier = log.portions || 1;
          acc.calories += log.calories * portionMultiplier;
          acc.carbs += log.carbs * portionMultiplier;
          acc.protein += log.protein * portionMultiplier;
          acc.fat += log.fat * portionMultiplier;
          return acc;
        },
        { calories: 0, carbs: 0, protein: 0, fat: 0 }
      );

      const progress = {
        calories: {
          current: total.calories,
          need: pref.dailyCalories,
          percentage: Math.min(
            (total.calories / pref.dailyCalories) * 100,
            100
          ),
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

      return this.sendSuccess(
        res,
        {
          preference: {
            bmr: pref.bmr,
            tdee: pref.tdee,
            dailyCalories: pref.dailyCalories,
            proteinGoal: pref.proteinGoal,
            carbsGoal: pref.carbsGoal,
            fatGoal: pref.fatGoal,
          },
          progress,
        },
        "Berhasil mengambil data preferensi dan progress pengguna"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };
}
