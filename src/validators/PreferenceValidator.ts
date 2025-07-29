import { z } from "zod";

export const PreferenceSchema = z.object({
  activityLevelId: z.string(),
  primaryGoalId: z.string(),
  weight: z.number().min(1, "Berat badan minimal 1 kg"),
  height: z.number().min(1, "Tinggi badan minimal 1 cm"),
});

export type PreferenceSchemaType = z.infer<typeof PreferenceSchema>;
