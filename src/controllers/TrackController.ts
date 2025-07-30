import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import db from "../config/db";
import moment from "moment-timezone";

export class TrackController extends BaseController {
  constructor() {
    super();
  }

  getProgress = async (req: Request, res: Response) => {
    try {
      const userId = req?.user?.id;

      const foodLogs = await db.foodLog.findMany({
        where: {
          userPreferences: {
            userId: userId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Ambil tanggal unik dari foodLogs (Asia/Jakarta)
      const dateSet = new Set<string>();
      foodLogs.forEach((log) => {
        const date = moment(log.createdAt)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD");
        dateSet.add(date);
      });

      const dayTracked = dateSet.size;

      // Hitung streak
      let streak = 0;
      let current = moment().tz("Asia/Jakarta").startOf("day");

      while (true) {
        const formatted = current.format("YYYY-MM-DD");
        if (dateSet.has(formatted)) {
          streak++;
          current = current.subtract(1, "day");
        } else {
          break;
        }
      }

      const caloriesTracked = foodLogs.reduce(
        (acc, log) => acc + log.calories,
        0
      );

      const data = {
        dayStreak: streak,
        dayTracked,
        caloriesTracked,
      };

      return this.sendSuccess(res, data, "Berhasil mendapatkan data");
    } catch (error) {
      return this.sendError(res, error);
    }
  };
  getAchievement = async (req: Request, res: Response) => {
    try {
      const userId = req?.user?.id;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          createdAt: true,
          userPreferences: {
            where: {
              endedAt: null,
            },
            take: 1,
            select: {
              dailyCalories: true,
              proteinGoal: true,
              foodLogs: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          },
        },
      });

      if (!user || !user.userPreferences.length) {
        return this.sendError(res, new Error("User not found"), 404);
      }

      const { dailyCalories, proteinGoal, foodLogs } = user.userPreferences[0];

      // Grouping foodLogs by day
      const dailyMap: Record<
        string,
        { calories: number; protein: number; date: Date }
      > = {};

      foodLogs.forEach((log) => {
        const dateStr = moment(log.createdAt)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD");
        if (!dailyMap[dateStr]) {
          dailyMap[dateStr] = {
            calories: 0,
            protein: 0,
            date: log.createdAt,
          };
        }
        dailyMap[dateStr].calories += log.calories;
        dailyMap[dateStr].protein += log.protein;
      });

      const dates = Object.keys(dailyMap);

      // Logging Legend (7 hari log)
      const loggingLegendUnlocked = dates.length >= 7;
      const loggingLegendDate = loggingLegendUnlocked
        ? dailyMap[dates[6]].date
        : null;

      // Health Hero (30 hari log)
      const healthHeroUnlocked = dates.length >= 30;
      const healthHeroDate = healthHeroUnlocked
        ? dailyMap[dates[29]].date
        : null;

      // Protein Power (5 hari protein terpenuhi)
      const proteinDays = dates.filter(
        (d) => dailyMap[d].protein >= proteinGoal
      );
      const proteinPowerUnlocked = proteinDays.length >= 5;
      const proteinPowerDate = proteinPowerUnlocked
        ? dailyMap[proteinDays[4]].date
        : null;

      // Balanced Life (10 hari kalori sesuai ±10%)
      const balancedDays = dates.filter((d) => {
        const cal = dailyMap[d].calories;
        return cal >= dailyCalories * 0.9 && cal <= dailyCalories * 1.1;
      });
      const balancedLifeUnlocked = balancedDays.length >= 10;
      const balancedLifeDate = balancedLifeUnlocked
        ? dailyMap[balancedDays[9]].date
        : null;

      const data = [
        {
          title: "First Step",
          description: "Anda telah melakukan langkah pertama",
          color: "#22C55E",
          unlocked: true,
          unlockedDate: user.createdAt,
        },
        {
          title: "Logging Legend",
          description: "Catat pola makan untuk 7 hari",
          color: "#3B82F6",
          unlocked: loggingLegendUnlocked,
          unlockedDate: loggingLegendDate,
        },
        {
          title: "Protein Power",
          description: "Penuhi protein harian untuk 5 hari",
          color: "#F97316",
          unlocked: proteinPowerUnlocked,
          unlockedDate: proteinPowerDate,
        },
        {
          title: "Balanced Life",
          description: "Penuhi kalori harian untuk 10 hari",
          color: "#8B5CF6",
          unlocked: balancedLifeUnlocked,
          unlockedDate: balancedLifeDate,
        },
        {
          title: "Health Hero",
          description: "Catat pola makan untuk 30 hari",
          color: "#EF4444",
          unlocked: healthHeroUnlocked,
          unlockedDate: healthHeroDate,
        },
      ];

      return this.sendSuccess(res, data, "Berhasil mendapatkan data");
    } catch (error) {
      return this.sendError(res, error);
    }
  };
}
