import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { PrismaClient } from ".prisma/client";

export class PreferenceController extends BaseController {
  constructor(private db: PrismaClient) {
    super();
  }

  editPreferences = async (req: Request, res: Response) => {
  };

  // calculate (by pref and food log) and return user preferences, like goals, streak and another
  getPreferences = async (req: Request, res: Response) => {
  };
}
