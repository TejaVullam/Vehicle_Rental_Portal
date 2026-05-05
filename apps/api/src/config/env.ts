import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(3001),
    JWT_SECRET: z
      .string()
      .min(32)
      .default("super-secret-jwt-key-for-development-only-change-in-prod"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    // Additional backend env vars will go here
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
