import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BaseController } from "../controllers/BaseController";

export const validate =
  (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (err: any) {
      const controller = new BaseController();
      return res.status(400).json({
        metaData: controller.metaData(400),
        responseMessage: "Harap lengkapi form dengan benar",
        errors: err?.errors || err,
      });
    }
  };
