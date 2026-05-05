import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";
import { createVehicleSchema, updateVehicleSchema } from "@p2p/types";

export class VehicleController {
  static async createVehicle(req: Request, res: Response) {
    const userId = req.user!.id;
    const validatedData = createVehicleSchema.parse(req.body);
    const vehicle = await VehicleService.createVehicle(userId, validatedData);
    res.status(201).json({ success: true, data: vehicle });
  }

  static async updateVehicle(req: Request, res: Response) {
    const userId = req.user!.id;
    const { id } = req.params;
    const validatedData = updateVehicleSchema.parse(req.body);
    const vehicle = await VehicleService.updateVehicle(
      id,
      userId,
      validatedData,
    );
    res.status(200).json({ success: true, data: vehicle });
  }

  static async deleteVehicle(req: Request, res: Response) {
    const userId = req.user!.id;
    const { id } = req.params;
    await VehicleService.deleteVehicle(id, userId);
    res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  }

  static async getVehicles(req: Request, res: Response) {
    const { type, isAvailable } = req.query;

    const filters: any = {};
    if (type === "CAR" || type === "BIKE") filters.type = type;
    if (isAvailable === "true") filters.isAvailable = true;
    if (isAvailable === "false") filters.isAvailable = false;

    const vehicles = await VehicleService.getVehicles(filters);
    res.status(200).json({ success: true, data: vehicles });
  }

  static async getVehicle(req: Request, res: Response) {
    const { id } = req.params;
    const vehicle = await VehicleService.getVehicleById(id);
    res.status(200).json({ success: true, data: vehicle });
  }
}
