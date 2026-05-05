import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireVerified } from "../middleware/requireVerified";

const router: Router = Router();

// Protected routes (Requires Auth and Verification)
router.post("/", requireAuth, requireVerified, BookingController.createBooking);
router.get("/", requireAuth, BookingController.getBookings);
router.patch(
  "/:id/status",
  requireAuth,
  requireVerified,
  BookingController.updateBookingStatus,
);

export { router as bookingRouter };
