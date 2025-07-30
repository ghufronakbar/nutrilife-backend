import { z } from "zod";

export const FoodSchema = z.object({
  id: z.string(),
  type: z.enum(["menu", "food"]),
  portions: z.number().min(0, "Portion minimal 1"),
});

export type FoodSchemaType = z.infer<typeof FoodSchema>;
