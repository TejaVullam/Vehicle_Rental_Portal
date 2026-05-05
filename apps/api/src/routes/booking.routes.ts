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

// Phase 2: Cancellation Management
router.post("/:bookingId/cancel", requireAuth, BookingController.cancelBooking);

// Phase 2: Booking Checkpoints (Pickup/Return Tracking)
router.post(
  "/:bookingId/checkpoints",
  requireAuth,
  BookingController.createCheckpoint,
);
router.get(
  "/:bookingId/checkpoints",
  requireAuth,
  BookingController.getCheckpoints,
);

// Phase 2: Damage Reporting
router.post(
  "/:bookingId/damage-reports",
  requireAuth,
  BookingController.reportDamage,
);
router.post(
  "/damage-reports/:damageReportId/media",
  requireAuth,
  BookingController.addDamageMedia,
);
router.get(
  "/:bookingId/damage-reports",
  requireAuth,
  BookingController.getDamageReports,
);

// Phase 2: Notifications
router.get(
  "/notifications/list",
  requireAuth,
  BookingController.getNotifications,
);
router.post(
  "/notifications/:notificationId/read",
  requireAuth,
  BookingController.markNotificationAsRead,
);
router.get(
  "/notifications/unread/count",
  requireAuth,
  BookingController.getUnreadCount,
);

export { router as bookingRouter };
