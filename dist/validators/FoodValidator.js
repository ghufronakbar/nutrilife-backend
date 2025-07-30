"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodSchema = void 0;
const zod_1 = require("zod");
exports.FoodSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(["menu", "food"]),
    portions: zod_1.z.number().min(0, "Portion minimal 1"),
});
