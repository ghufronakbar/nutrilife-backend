import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import {
  UserEditSchemaType,
  UserLoginSchemaType,
  UserRegisterSchemaType,
} from "src/validators/UserValidator";
import db from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constant/auth";
import { $Enums } from ".prisma/client";
import {
  calculateAge,
  calculateBMR,
  calculateTDEE,
  calculateDailyCalories,
  calculateMacros,
} from "../utils/nutrition";

export class UserController extends BaseController {
  constructor() {
    super();
  }

  login = async (req: Request, res: Response) => {
    try {
      const data = req.body as UserLoginSchemaType;
      const user = await db.user.findUnique({
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
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        return this.sendError(res, new Error("Password salah"), 400);
      }
      const accessToken = jwt.sign({ id: user.id }, JWT_SECRET);
      return this.sendSuccess(
        res,
        {
          ...user,
          accessToken,
        },
        "Login berhasil"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const data = req.body as UserRegisterSchemaType;
      const { lifestyle, personalInformation, physicalStats } = data;
      const { activityLevelId, primaryGoalId } = lifestyle;
      const { height, weight } = physicalStats;
      const { dateOfBirth, email, gender, name, password } =
        personalInformation;

      const [checkEmail, checkActivityLevel, checkPrimaryGoal] =
        await Promise.all([
          db.user.findUnique({
            where: {
              email,
            },
          }),
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
        ]);

      if (checkEmail) {
        return this.sendError(res, new Error("Email sudah terdaftar"), 400);
      }

      if (!checkActivityLevel || !checkPrimaryGoal) {
        return this.sendError(res, new Error("Data tidak valid"), 400);
      }

      const hashedPassword = await bcrypt.hash(
        data.personalInformation.password,
        10
      );

      const age = calculateAge(dateOfBirth);
      const bmr = calculateBMR(gender as $Enums.Gender, weight, height, age);
      const tdee = calculateTDEE(bmr, checkActivityLevel.weight);
      const dailyCalories = calculateDailyCalories(
        tdee,
        checkPrimaryGoal.weight
      );
      const { carbsGoal, proteinGoal, fatGoal } =
        calculateMacros(dailyCalories);

      const user = await db.user.create({
        data: {
          password: hashedPassword,
          dateOfBirth,
          email,
          gender: gender as $Enums.Gender,
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

      const accessToken = jwt.sign({ id: user?.id }, JWT_SECRET);
      
      return this.sendSuccess(
        res,
        {
          ...user,
          accessToken,
        },
        "Pengguna berhasil didaftarkan"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  editProfile = async (req: Request, res: Response) => {
    try {
      const data = req.body as UserEditSchemaType;
      const userId = req?.user.id;
      const checkEmail = await db.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (checkEmail && checkEmail.id !== userId) {
        return this.sendError(res, new Error("Email sudah terdaftar"), 400);
      }
      const user = await db.user.update({
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

      const accessToken = jwt.sign({ id: user.id }, JWT_SECRET);

      return this.sendSuccess(
        res,
        { ...user, accessToken },
        "Profil berhasil diubah"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req?.user.id;
      const user = await db.user.findUnique({
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

      const accessToken = jwt.sign({ id: user.id }, JWT_SECRET);

      return this.sendSuccess(
        res,
        { ...user, accessToken },
        "Profil berhasil diambil"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };
}
