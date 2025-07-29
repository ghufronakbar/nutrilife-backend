import dotenv from "dotenv";
dotenv.config();

export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const PORT = process.env.PORT || 3000;
export const APP_NAME = process.env.APP_NAME || "Nutrilife";