import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import { bookingRouter } from "../routes/booking.routes";
import { userRouter } from "../routes/user.routes";
import { vehicleRouter } from "../routes/vehicle.routes";
import { authRouter } from "../routes/auth.routes";
import { PrismaClient } from "@p2p/database";

const prisma = new PrismaClient();

// Setup app with all routers
const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/bookings", bookingRouter);

describe("Booking Phase 2 Integration Tests", () => {
  let renterToken: string;
  let ownerToken: string;
  let renterId: string;
  let ownerId: string;
  let vehicleId: string;
  let bookingId: string;

  const randomSuffix = Date.now();
  const renterEmail = `test-renter-${randomSuffix}@example.com`;
  const ownerEmail = `test-owner-${randomSuffix}@example.com`;
  const password = "Password123!";

  // Setup: Create test users and vehicle
  beforeAll(async () => {
    // Register renter
    const renterRes = await request(app).post("/api/auth/register").send({
      email: renterEmail,
      password,
      firstName: "Test",
      lastName: "Renter",
      role: "USER",
    });
    renterToken = renterRes.body.data.token;
    renterId = renterRes.body.data.user.id;

    // Register owner
    const ownerRes = await request(app).post("/api/auth/register").send({
      email: ownerEmail,
      password,
      firstName: "Test",
      lastName: "Owner",
      role: "OWNER",
    });
    ownerToken = ownerRes.body.data.token;
    ownerId = ownerRes.body.data.user.id;

    // Verify owner account
    await prisma.user.update({
      where: { id: ownerId },
      data: { verified: true },
    });

    // Create test vehicle
    const vehicleRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        title: "Test Bike",
        type: "BIKE",
        description: "A test bike for Phase 2 tests",
        location: "123 Test St",
        pricePerDay: 50,
        imageUrl: "https://example.com/bike.jpg",
      });
    vehicleId = vehicleRes.body.data.id;

    // Create test booking
    const bookingRes = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${renterToken}`)
      .send({
        vehicleId,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: "123 Test St",
      });
    bookingId = bookingRes.body.data.id;

    // Confirm booking
    await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ status: "CONFIRMED" });
  });

  // Cleanup
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "test-",
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("Booking Cancellation", () => {
    let cancelBookingId: string;

    beforeAll(async () => {
      // Create a new booking for cancellation test
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${renterToken}`)
        .send({
          vehicleId,
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: "123 Test St",
        });
      cancelBookingId = res.body.data.id;
    });

    it("should cancel booking with full refund", async () => {
      const res = await request(app)
        .post(`/api/bookings/${cancelBookingId}/cancel`)
        .set("Authorization", `Bearer ${renterToken}`)
        .send({
          reason: "Change of plans",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("CANCELLED");
      expect(res.body.data.refundAmount).toBeGreaterThan(0);
    });

    it("should not allow owner to cancel confirmed booking", async () => {
      const res = await request(app)
        .post(`/api/bookings/${bookingId}/cancel`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
          reason: "Owner cancellation",
        });

      expect(res.status).toBe(403);
    });
  });

  describe("Booking Checkpoints (Pickup/Return Tracking)", () => {
    it("should create pickup checkpoint", async () => {
      const res = await request(app)
        .post(`/api/bookings/${bookingId}/checkpoints`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
          type: "PICKUP",
          notes: "Vehicle ready for pickup at location",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.type).toBe("PICKUP");
      expect(res.body.data.notes).toBe("Vehicle ready for pickup at location");
    });

    it("should create return checkpoint", async () => {
      const res = await request(app)
        .post(`/api/bookings/${bookingId}/checkpoints`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
          type: "RETURN",
          notes: "Vehicle returned in good condition",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.type).toBe("RETURN");
    });

    it("should get bookings with checkpoints", async () => {
      const res = await request(app)
        .get("/api/bookings")
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      const booking = res.body.data.find(
        (b: { id: string }) => b.id === bookingId
      );
      expect(booking.checkpoints).toBeDefined();
      expect(booking.checkpoints.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Damage Reporting", () => {
    it("should report damage on booking", async () => {
      const res = await request(app)
        .post(`/api/bookings/${bookingId}/damage-reports`)
        .set("Authorization", `Bearer ${renterToken}`)
        .send({
          description: "Scratches on the frame",
          severity: "MINOR",
          estimatedCost: 50,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.description).toBe("Scratches on the frame");
      expect(res.body.data.severity).toBe("MINOR");
      expect(res.body.data.estimatedCost).toBe(50);
    });

    it("should get damage reports for booking", async () => {
      const res = await request(app)
        .get(`/api/bookings/${bookingId}/damage-reports`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty("description");
        expect(res.body.data[0]).toHaveProperty("severity");
      }
    });

    it("should reject invalid damage severity", async () => {
      const res = await request(app)
        .post(`/api/bookings/${bookingId}/damage-reports`)
        .set("Authorization", `Bearer ${renterToken}`)
        .send({
          description: "Some damage",
          severity: "INVALID_SEVERITY",
          estimatedCost: 100,
        });

      expect(res.status).toBe(400);
    });
  });

  describe("Advanced Booking Search & Filtering", () => {
    it("should search bookings by status", async () => {
      const res = await request(app)
        .get("/api/bookings/search")
        .set("Authorization", `Bearer ${renterToken}`)
        .query({
          status: "CONFIRMED",
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      res.body.data.forEach((booking: { status: string }) => {
        expect(booking.status).toBe("CONFIRMED");
      });
    });

    it("should search bookings by vehicle type", async () => {
      const res = await request(app)
        .get("/api/bookings/search")
        .set("Authorization", `Bearer ${ownerToken}`)
        .query({
          vehicleType: "BIKE",
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      res.body.data.forEach(
        (booking: { vehicle: { type: string } }) => {
          expect(booking.vehicle.type).toBe("BIKE");
        }
      );
    });

    it("should search bookings by date range", async () => {
      const startDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

      const res = await request(app)
        .get("/api/bookings/search")
        .set("Authorization", `Bearer ${renterToken}`)
        .query({
          startDateFrom: startDate.toISOString(),
          endDateTo: endDate.toISOString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should search with multiple filters", async () => {
      const res = await request(app)
        .get("/api/bookings/search")
        .set("Authorization", `Bearer ${renterToken}`)
        .query({
          status: "CONFIRMED",
          vehicleType: "BIKE",
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return empty array for non-matching filters", async () => {
      const res = await request(app)
        .get("/api/bookings/search")
        .set("Authorization", `Bearer ${renterToken}`)
        .query({
          status: "CANCELLED",
          vehicleType: "CAR",
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Notifications", () => {
    it("should get user notifications", async () => {
      const res = await request(app)
        .get("/api/users/notifications")
        .set("Authorization", `Bearer ${renterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should mark notification as read", async () => {
      // First get notifications
      const notificationsRes = await request(app)
        .get("/api/users/notifications")
        .set("Authorization", `Bearer ${renterToken}`);

      if (notificationsRes.body.data.length > 0) {
        const notificationId = notificationsRes.body.data[0].id;

        const res = await request(app)
          .patch(`/api/users/notifications/${notificationId}/read`)
          .set("Authorization", `Bearer ${renterToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.read).toBe(true);
      }
    });

    it("should filter unread notifications", async () => {
      const res = await request(app)
        .get("/api/users/notifications")
        .set("Authorization", `Bearer ${renterToken}`)
        .query({
          unreadOnly: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      res.body.data.forEach((notification: { read: boolean }) => {
        expect(notification.read).toBe(false);
      });
    });
  });

  describe("Refund Policies", () => {
    it("should have refund policy for vehicle", async () => {
      const res = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set("Authorization", `Bearer ${renterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("refundPolicy");
    });
  });
});
