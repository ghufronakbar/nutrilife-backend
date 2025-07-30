"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const constant_1 = require("./constant");
const index_1 = __importDefault(require("./routes/index"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ limit: "100mb", extended: true }));
// Routes
app.get("/", async (req, res) => {
    try {
        const appData = await db_1.default.appActivityLevel.findMany();
        return res.json({
            message: "Welcome to " + constant_1.APP_NAME,
            db: {
                status: "connected",
                appDataLen: appData.length,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
app.use("/api", index_1.default);
// Start server
app.listen(constant_1.PORT, () => {
    console.log(`Server is running on port ${constant_1.PORT}`);
    console.log(constant_1.BASE_URL);
});
