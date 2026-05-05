import { prisma } from "@p2p/database";
import { CreateVehicleInput, UpdateVehicleInput } from "@p2p/types";
import { NotFoundError, ForbiddenError } from "@p2p/shared";

export class VehicleService {
  static async createVehicle(ownerId: string, data: CreateVehicleInput) {
    return prisma.vehicle.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  static async updateVehicle(
    vehicleId: string,
    ownerId: string,
    data: UpdateVehicleInput,
  ) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new NotFoundError("Vehicle not found");
    if (vehicle.ownerId !== ownerId)
      throw new ForbiddenError("Not authorized to update this vehicle");

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data,
    });
  }

  static async deleteVehicle(vehicleId: string, ownerId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new NotFoundError("Vehicle not found");

    // Allow owner OR an admin to delete it. Since we only pass ownerId here, we just check ownerId.
    if (vehicle.ownerId !== ownerId)
      throw new ForbiddenError("Not authorized to delete this vehicle");

    return prisma.vehicle.delete({
      where: { id: vehicleId },
    });
  }

  static async getVehicles(filters?: {
    type?: "CAR" | "BIKE";
    isAvailable?: boolean;
  }) {
    // Basic filtering without complex pagination/geosearch for now
    return prisma.vehicle.findMany({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.isAvailable !== undefined && {
          isAvailable: filters.isAvailable,
        }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
          },
        },
      },
    });
  }

  static async getVehicleById(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            createdAt: true,
          },
        },
        media: true,
        reviews: {
          include: {
            author: {
              select: { id: true, firstName: true },
            },
          },
        },
      },
    });

    if (!vehicle) throw new NotFoundError("Vehicle not found");
    return vehicle;
  }
}
