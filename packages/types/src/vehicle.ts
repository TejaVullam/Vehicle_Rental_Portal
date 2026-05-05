import { z } from "zod";

export const createVehicleSchema = z.object({
  type: z.enum(["CAR", "BIKE"]),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  description: z.string().min(10, "Description must be at least 10 characters"),
  licensePlate: z.string().min(1, "License plate is required"),
  pricePerHour: z.number().positive("Price must be positive"),
  pricePerDay: z.number().positive("Price must be positive"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
