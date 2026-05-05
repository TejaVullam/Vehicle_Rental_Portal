import { prisma } from "@p2p/database";
import { CreateBookingInput, UpdateBookingStatusInput } from "@p2p/types";
import { NotFoundError, ForbiddenError, BadRequestError } from "@p2p/shared";

export class BookingService {
  static async createBooking(renterId: string, data: CreateBookingInput) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });
    if (!vehicle) throw new NotFoundError("Vehicle not found");
    if (!vehicle.isAvailable)
      throw new BadRequestError("Vehicle is not available");
    if (vehicle.ownerId === renterId)
      throw new BadRequestError("You cannot book your own vehicle");

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    // Check for double booking
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (overlappingBooking) {
      throw new BadRequestError(
        "Vehicle is already booked for the selected dates",
      );
    }

    // Calculate total price (simplified logic using hours)
    const hours = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60),
    );
    let totalPrice = 0;

    // In a real app, logic would be more complex (daily vs hourly rates)
    // For simplicity, we'll just use hourly rate * hours if under 24h, else daily
    if (hours < 24) {
      totalPrice = vehicle.pricePerHour * hours;
    } else {
      const days = Math.ceil(hours / 24);
      totalPrice = vehicle.pricePerDay * days;
    }

    return prisma.booking.create({
      data: {
        vehicleId: vehicle.id,
        renterId,
        startTime: start,
        endTime: end,
        totalPrice,
        status: "PENDING",
      },
      include: {
        vehicle: true,
      },
    });
  }

  static async getBookings(userId: string, role: string) {
    if (role === "OWNER" || role === "ADMIN") {
      // Return bookings for vehicles owned by this user, AND bookings made by this user
      return prisma.booking.findMany({
        where: {
          OR: [{ renterId: userId }, { vehicle: { ownerId: userId } }],
        },
        include: {
          vehicle: { include: { owner: { select: { firstName: true } } } },
          renter: { select: { firstName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // For RENTERS, just return their bookings
    return prisma.booking.findMany({
      where: { renterId: userId },
      include: {
        vehicle: { include: { owner: { select: { firstName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateBookingStatus(
    bookingId: string,
    userId: string,
    data: UpdateBookingStatusInput,
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundError("Booking not found");

    const isOwner = booking.vehicle.ownerId === userId;
    const isRenter = booking.renterId === userId;

    if (!isOwner && !isRenter) {
      throw new ForbiddenError("Not authorized to update this booking");
    }

    // State machine logic
    if (data.status === "CONFIRMED" || data.status === "COMPLETED") {
      if (!isOwner)
        throw new ForbiddenError(
          "Only the owner can confirm or complete a booking",
        );
    }

    if (data.status === "CANCELLED") {
      if (booking.status === "COMPLETED")
        throw new BadRequestError("Cannot cancel a completed booking");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: data.status as any },
      include: {
        vehicle: true,
        renter: { select: { firstName: true, email: true } },
      },
    });
  }
}
