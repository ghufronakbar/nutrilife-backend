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
import { FoodSchemaType } from "src/validators/FoodValidator";
import { FoodLog } from ".prisma/client";

export class FoodController extends BaseController {
  constructor() {
    super();
  }

  getLogs = async (req: Request, res: Response) => {
    try {
      const userId = req?.user?.id;

      const data = await db.foodLog.findMany({
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
      const grouped = data.reduce((acc: Record<string, FoodLog[]>, log) => {
        const date = moment(log.createdAt)
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = [];
        acc[date].push(log);
        return acc;
      }, {});

      // Ubah menjadi array
      const result = Object.keys(grouped).map((date) => ({
        date,
        foods: grouped[date],
      }));

      return this.sendSuccess(res, result);
    } catch (err) {
      return this.sendError(res, err);
    }
  };

  createLog = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const data = req.body as FoodSchemaType;

      const { id, type, portions } = data;

      // Waktu sekarang Indonesia (WIB)
      const now = moment().tz("Asia/Jakarta");
      const startOfDay = now.clone().startOf("day").toDate();
      const endOfDay = now.clone().endOf("day").toDate();

      let calories = 0;
      let carbs = 0;
      let protein = 0;
      let fat = 0;
      let size = 0;
      let name = "";

      if (type === "food") {
        const check = await db.appFood.findUnique({
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
          return this.sendError(
            res,
            new Error("Data makanan tidak ditemukan"),
            400
          );
        }
        calories = check.calories * portions;
        carbs = check.carbs * portions;
        protein = check.protein * portions;
        fat = check.fat * portions;
        size = check.size * portions;
        name = check.name;
      } else {
        const check = await db.appMenu.findUnique({
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
          return this.sendError(
            res,
            new Error("Data menu tidak ditemukan"),
            400
          );
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

      if (!user || !user?.userPreferences?.length) {
        return this.sendError(res, new Error("Data user tidak ditemukan"), 400);
      }

      const food = await db.foodLog.create({
        data: {
          calories,
          carbs,
          fat,
          name,
          portions,
          protein,
          size: portions,
          userPreferencesId: user?.userPreferences?.[0].id,
          createdAt: now.toDate(),
          updatedAt: now.toDate(),
        },
      });

      return this.sendSuccess(res, food, "Berhasil menambahkan log makanan");
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  deleteLog = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const check = await db.foodLog.findUnique({
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

      const food = await db.foodLog.delete({
        where: {
          id: id,
        },
      });

      return this.sendSuccess(res, food, "Berhasil menghapus log makanan");
    } catch (error) {
      return this.sendError(res, error);
    }
  };
}
