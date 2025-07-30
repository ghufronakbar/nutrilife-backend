import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { APP_NAME, BASE_URL, PORT } from "./constant";
import router from "./routes/index";
import morgan from "morgan";
import db from "./config/db";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Routes
app.get("/", async (req, res) => {
  try {
    const appData = await db.appActivityLevel.findMany();
    return res.json({
      message: "Welcome to " + APP_NAME,
      db: {
        status: "connected",
        appDataLen: appData.length,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

app.use("/api", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(BASE_URL);
});
