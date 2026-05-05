import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { authRouter } from "../routes/auth.routes";

// Setup app just for auth router to test
const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("Auth Integration Tests", () => {
  const randomEmail = `test-auto-${Date.now()}@example.com`;
  const password = "Password123!";

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: randomEmail,
      password,
      firstName: "Test",
      lastName: "User",
      role: "USER",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user.email).toBe(randomEmail);
    expect(res.body.data.token).toBeDefined();
  });

  it("should not register duplicate user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: randomEmail,
      password,
      firstName: "Test2",
      lastName: "User2",
      role: "USER",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Email already registered/);
  });

  it("should login the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: randomEmail,
      password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(randomEmail);
    expect(res.body.data.token).toBeDefined();
  });

  it("should reject invalid password login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: randomEmail,
      password: "WrongPassword!",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
