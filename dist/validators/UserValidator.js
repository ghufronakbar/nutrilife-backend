"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEditSchema = exports.UserRegisterSchema = exports.UserLoginSchema = void 0;
const zod_1 = require("zod");
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email tidak valid"),
    password: zod_1.z.string().min(6, "Password minimal 6 karakter"),
});
exports.UserRegisterSchema = zod_1.z.object({
    personalInformation: zod_1.z.object({
        name: zod_1.z.string().min(3, "Nama minimal 3 karakter"),
        password: zod_1.z.string().min(6, "Password minimal 6 karakter"),
        email: zod_1.z.string().email("Email tidak valid"),
        dateOfBirth: zod_1.z.coerce.date(),
        gender: zod_1.z.enum(["M", "L"], {
            message: "Jenis kelamin tidak valid",
        }),
    }),
    physicalStats: zod_1.z.object({
        weight: zod_1.z.number().min(1, "Berat badan minimal 1 kg"),
        height: zod_1.z.number().min(1, "Tinggi badan minimal 1 cm"),
    }),
    lifestyle: zod_1.z.object({
        activityLevelId: zod_1.z.string(),
        primaryGoalId: zod_1.z.string(),
    }),
});
exports.UserEditSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Nama minimal 3 karakter"),
    email: zod_1.z.string().email("Email tidak valid"),
    picture: zod_1.z.string().url().nullable(),
});
