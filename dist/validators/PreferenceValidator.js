"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceSchema = void 0;
const zod_1 = require("zod");
exports.PreferenceSchema = zod_1.z.object({
    activityLevelId: zod_1.z.string(),
    primaryGoalId: zod_1.z.string(),
    weight: zod_1.z.number().min(1, "Berat badan minimal 1 kg"),
    height: zod_1.z.number().min(1, "Tinggi badan minimal 1 cm"),
});
