import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { createBookingSchema, updateBookingStatusSchema } from "@p2p/types";

export class BookingController {
  static async createBooking(req: Request, res: Response) {
    const userId = req.user!.id;
    const validatedData = createBookingSchema.parse(req.body);
    const booking = await BookingService.createBooking(userId, validatedData);
    res.status(201).json({ success: true, data: booking });
  }

  static async getBookings(req: Request, res: Response) {
    const userId = req.user!.id;
    const role = req.user!.role;
    const bookings = await BookingService.getBookings(userId, role);
    res.status(200).json({ success: true, data: bookings });
  }

  static async updateBookingStatus(req: Request, res: Response) {
    const userId = req.user!.id;
    const { id } = req.params;
    const validatedData = updateBookingStatusSchema.parse(req.body);
    const booking = await BookingService.updateBookingStatus(
      id,
      userId,
      validatedData,
    );
    res.status(200).json({ success: true, data: booking });
  }
}
