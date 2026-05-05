import { z } from "zod";

export const createBookingSchema = z
  .object({
    vehicleId: z.string().uuid("Invalid vehicle ID"),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
