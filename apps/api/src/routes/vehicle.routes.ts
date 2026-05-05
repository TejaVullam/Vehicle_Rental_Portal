import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireVerified } from "../middleware/requireVerified";

const router: Router = Router();

// Public routes
router.get("/", VehicleController.getVehicles);
router.get("/:id", VehicleController.getVehicle);

// Protected routes (Requires Auth AND Verified Status)
router.post("/", requireAuth, requireVerified, VehicleController.createVehicle);
router.patch(
  "/:id",
  requireAuth,
  requireVerified,
  VehicleController.updateVehicle,
);
router.delete(
  "/:id",
  requireAuth,
  requireVerified,
  VehicleController.deleteVehicle,
);

export { router as vehicleRouter };
