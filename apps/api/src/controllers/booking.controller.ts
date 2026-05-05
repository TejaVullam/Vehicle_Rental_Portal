import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { createBookingSchema, updateBookingStatusSchema } from "@p2p/types";
import { prisma } from "@p2p/database";

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

  // Phase 2: Cancellation Management
  static async cancelBooking(req: Request, res: Response) {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    // Only renter or vehicle owner can cancel
    const vehicleOwnerId = booking.vehicle.ownerId;
    if (booking.renterId !== userId && vehicleOwnerId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const cancellation = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancellation: {
          create: {
            reason: reason as any,
            refundAmount: booking.totalPrice * 0.5, // 50% refund for demo
            refundPercentage: 50,
            cancellationTime: new Date(),
            processedAt: new Date(),
          },
        },
      },
      include: { cancellation: true },
    });

    res.json({ success: true, data: cancellation });
  }

  // Phase 2: Booking Checkpoints (Pickup/Return Tracking)
  static async createCheckpoint(req: Request, res: Response) {
    const { bookingId } = req.params;
    const { type, notes } = req.body;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    const vehicleOwnerId = booking.vehicle.ownerId;
    if (vehicleOwnerId !== userId) {
      return res
        .status(403)
        .json({ error: "Only owner can create checkpoints" });
    }

    const checkpoint = await prisma.bookingCheckpoint.create({
      data: {
        bookingId,
        type: type as any,
        notes,
        timestamp: new Date(),
      },
    });

    res.status(201).json({ success: true, data: checkpoint });
  }

  static async getCheckpoints(req: Request, res: Response) {
    const { bookingId } = req.params;

    const checkpoints = await prisma.bookingCheckpoint.findMany({
      where: { bookingId },
      orderBy: { timestamp: "asc" },
    });

    res.json({ success: true, data: checkpoints });
  }

  // Phase 2: Damage Reporting
  static async reportDamage(req: Request, res: Response) {
    const { bookingId } = req.params;
    const { description, severity, estimatedCost } = req.body;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    const vehicleOwnerId = booking.vehicle.ownerId;
    if (vehicleOwnerId !== userId) {
      return res.status(403).json({ error: "Only owner can report damage" });
    }

    const damageReport = await prisma.damageReport.create({
      data: {
        bookingId,
        vehicleId: booking.vehicleId,
        reportedBy: userId,
        description,
        severity: severity as any,
        estimatedCost,
      },
    });

    res.status(201).json({ success: true, data: damageReport });
  }

  static async addDamageMedia(req: Request, res: Response) {
    const { damageReportId } = req.params;
    const { url, type } = req.body;

    const media = await prisma.damageMedia.create({
      data: {
        damageReportId,
        url,
        type: type as any,
      },
    });

    res.status(201).json({ success: true, data: media });
  }

  static async getDamageReports(req: Request, res: Response) {
    const { bookingId } = req.params;

    const damageReports = await prisma.damageReport.findMany({
      where: { bookingId },
      include: { media: true },
    });

    res.json({ success: true, data: damageReports });
  }

  // Phase 2: Notifications
  static async getNotifications(req: Request, res: Response) {
    const userId = req.user!.id;
    const { unreadOnly } = req.query;

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly === "true" && { read: false }),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ success: true, data: notifications });
  }

  static async markNotificationAsRead(req: Request, res: Response) {
    const { notificationId } = req.params;
    const userId = req.user!.id;

    const notification = await prisma.notification.findUniqueOrThrow({
      where: { id: notificationId },
    });

    if (notification.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    res.json({ success: true, data: updated });
  }

  static async getUnreadCount(req: Request, res: Response) {
    const userId = req.user!.id;

    const count = await prisma.notification.count({
      where: { userId, read: false },
    });

    res.json({ success: true, data: { unreadCount: count } });
  }
}
