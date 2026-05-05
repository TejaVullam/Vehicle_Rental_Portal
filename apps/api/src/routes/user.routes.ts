import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/requireAuth";

const router: Router = Router();

// Private routes
router.get("/me", requireAuth, UserController.getMe);
router.patch("/me", requireAuth, UserController.updateMe);
router.post("/me/verify", requireAuth, UserController.verifyMe);

// Public routes
router.get("/:id", UserController.getPublicProfile);

export { router as userRouter };
