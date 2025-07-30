import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import db from "../config/db";
import { $Enums, AppMenu } from ".prisma/client";
import moment from "moment-timezone";

export class ContentController extends BaseController {
  constructor() {
    super();
  }

  getAppPrimaryGoals = async (req: Request, res: Response) => {
    try {
      const data = await db.appPrimaryGoal.findMany();
      return this.sendSuccess(res, data, "Berhasil mendapatkan data");
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  getAppActivityLevels = async (req: Request, res: Response) => {
    try {
      const data = await db.appActivityLevel.findMany();
      return this.sendSuccess(res, data, "Berhasil mendapatkan data");
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  getAppFoods = async (req: Request, res: Response) => {
    try {
      const [appFoods, appMenus] = await Promise.all([
        db.appFood.findMany(),
        db.appMenu.findMany({
          include: {
            appFoods: true,
          },
        }),
      ]);

      const mappedFoods: MappedFoods[] = appFoods.map((food) => ({
        id: food.id,
        name: food.name,
        description: null,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        type: "food",
      }));

      const mappedMenus: MappedFoods[] = appMenus.map((menu) => ({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        calories: menu.appFoods.reduce(
          (total, food) => total + food.calories,
          0
        ),
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
    } catch (error) {
      return this.sendError(res, error);
    }
  };
  getSuggestedMenus = async (req: Request, res: Response) => {
    try {
      const userId = req?.user?.id;

      const user = await db.user.findUnique({
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

      const suggestedMenus =
        user.userPreferences[0].appPrimaryGoal.appPlanningMenus;

      const defaultDayNames: Record<number, string> = {
        1: "Senin",
        2: "Selasa",
        3: "Rabu",
        4: "Kamis",
        5: "Jumat",
        6: "Sabtu",
        7: "Minggu",
      };

      // Hitung hari saat ini dan besok di Asia/Jakarta
      const now = moment().tz("Asia/Jakarta");
      const today = now.isoWeekday(); // 1 (Senin) - 7 (Minggu)
      const tomorrow = now.clone().add(1, "day").isoWeekday();

      const result: {
        day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
        dayName: string;
        types: {
          type: $Enums.MealType;
          time: string;
          menus: {
            id: string;
            name: string;
            description: string;
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
          }[];
        }[];
      }[] = [];

      // Urutkan hari dimulai dari hari ini
      const orderedDays: (1 | 2 | 3 | 4 | 5 | 6 | 7)[] = [];
      for (let i = 0; i < 7; i++) {
        let day = (((today + i - 1) % 7) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
        orderedDays.push(day);
      }

      for (const day of orderedDays) {
        const menusForDay = suggestedMenus.filter((menu) => menu.day === day);

        const types: {
          type: $Enums.MealType;
          time: string;
          menus: {
            id: string;
            name: string;
            description: string;
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
          }[];
        }[] = [];

        ["BREAKFAST", "LUNCH", "DINNER", "SNACK"].forEach((type) => {
          const filteredMenus = menusForDay
            .filter((m) => m.type === type)
            .flatMap((m) => m.appMenus);

          if (filteredMenus.length > 0) {
            types.push({
              type: type as $Enums.MealType,
              time: this.getTime(type as $Enums.MealType),
              menus: filteredMenus.map((m) => ({
                id: m.id,
                name: m.name,
                description: m.description,
                calories: m.appFoods.reduce(
                  (total, food) => total + food.calories,
                  0
                ),
                protein: m.appFoods.reduce(
                  (total, food) => total + food.protein,
                  0
                ),
                carbs: m.appFoods.reduce(
                  (total, food) => total + food.carbs,
                  0
                ),
                fat: m.appFoods.reduce((total, food) => total + food.fat, 0),
              })),
            });
          }
        });

        // Tentukan nama hari dinamis
        let dayName = defaultDayNames[day];
        if (day === today) {
          dayName = "Hari Ini";
        } else if (day === tomorrow) {
          dayName = "Besok";
        }

        result.push({
          day,
          dayName,
          types,
        });
      }

      return this.sendSuccess(res, result, "Berhasil mendapatkan data");
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  private getTime(time: $Enums.MealType): string {
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

interface MappedFoods {
  id: string;
  name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: "food" | "menu";
}
