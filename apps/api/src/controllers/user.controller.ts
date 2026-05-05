import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { updateProfileSchema, verifyProfileSchema } from "@p2p/types";

export class UserController {
  static async getMe(req: Request, res: Response) {
    const userId = req.user!.id;
    const profile = await UserService.getProfile(userId);
    res.status(200).json({ success: true, data: profile });
  }

  static async updateMe(req: Request, res: Response) {
    const userId = req.user!.id;
    const validatedData = updateProfileSchema.parse(req.body);
    const profile = await UserService.updateProfile(userId, validatedData);
    res.status(200).json({ success: true, data: profile });
  }

  static async verifyMe(req: Request, res: Response) {
    const userId = req.user!.id;
    const validatedData = verifyProfileSchema.parse(req.body);
    const profile = await UserService.verifyProfile(userId, validatedData);
    res.status(200).json({ success: true, data: profile });
  }

  static async getPublicProfile(req: Request, res: Response) {
    const { id } = req.params;
    const profile = await UserService.getPublicProfile(id);
    res.status(200).json({ success: true, data: profile });
  }
}
