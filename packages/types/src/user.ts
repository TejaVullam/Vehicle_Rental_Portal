import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const verifyProfileSchema = z.object({
  documentUrl: z.string().url("Must be a valid URL"),
});

export type VerifyProfileInput = z.infer<typeof verifyProfileSchema>;
