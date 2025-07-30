"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../constant/auth");
const requireAuth = (req, res, next) => {
    var _a, _b;
    const authHeader = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || "Bearer ";
    if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
        const token = (_b = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")) === null || _b === void 0 ? void 0 : _b[1];
        try {
            const payload = jsonwebtoken_1.default.verify(token, auth_1.JWT_SECRET);
            req.user = payload;
            return next();
        }
        catch (_c) {
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
exports.requireAuth = requireAuth;
