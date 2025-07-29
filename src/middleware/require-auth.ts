import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constant/auth";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  const authHeader = req.headers?.authorization || "Bearer ";
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader?.split(" ")?.[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string };
      req.user = payload;
      return next();
    } catch {
      return res.status(401).json({
        metaData: { code: 401, message: "Unauthorized" },
        responseMessage: "Unauthorized",
      });
    }
  }

  return res.status(401).json({
    metaData: { code: 401, message: "Unauthorized" },
    responseMessage: "Unauthorized",
  });
};
