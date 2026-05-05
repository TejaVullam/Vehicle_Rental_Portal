import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerSchema, loginSchema } from "@p2p/types";

export class AuthController {
  static async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req.body);
    const result = await AuthService.register(validatedData);
    res.status(201).json({ success: true, data: result });
  }

  static async login(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);
    res.status(200).json({ success: true, data: result });
  }

  static async getMe(req: Request, res: Response) {
    // req.user is set by the requireAuth middleware
    const userId = req.user!.id;
    const user = await AuthService.getMe(userId);
    res.status(200).json({ success: true, data: user });
  }
}
