import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type UserLoginSchemaType = z.infer<typeof UserLoginSchema>;

export const UserRegisterSchema = z.object({
  personalInformation: z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    email: z.string().email("Email tidak valid"),
    dateOfBirth: z.coerce.date(),
    gender: z.enum(["M", "L"], {
      message: "Jenis kelamin tidak valid",
    }),
  }),
  physicalStats: z.object({
    weight: z.number().min(1, "Berat badan minimal 1 kg"),
    height: z.number().min(1, "Tinggi badan minimal 1 cm"),
  }),
  lifestyle: z.object({
    activityLevelId: z.string(),
    primaryGoalId: z.string(),
  }),
});

export type UserRegisterSchemaType = z.infer<typeof UserRegisterSchema>;

export const UserEditSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  picture: z.string().url().nullable(),
});

export type UserEditSchemaType = z.infer<typeof UserEditSchema>;
