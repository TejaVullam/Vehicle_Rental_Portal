import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { httpLogger } from "./middleware/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import { vehicleRouter } from "./routes/vehicle.routes";
import { bookingRouter } from "./routes/booking.routes";
import { uploadRouter } from "./routes/upload.routes";

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(httpLogger);

// Health check endpoint (Observability)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: env.NODE_ENV });
});

// Example route testing async errors
app.get("/error-test", async (_req, _res) => {
  throw new Error("This is a test error!");
});

// Static files
import path from "path";
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/upload", uploadRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(
    `API server listening on port ${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
