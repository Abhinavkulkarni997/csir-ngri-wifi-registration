import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import registrationRoutes from "./routes/registration.routes";
import authRoutes from "./routes/auth.routes";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5010;

/*
 * Middleware
 */
const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5174";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

/*
 * Health check
 */
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "NGRI Wi-Fi Registration API is running",
  });
});

/*
 * Registration routes
 */
app.use("/api/registrations", registrationRoutes);
app.use(
  "/api/auth",
  authRoutes,
);

/*
 * Start server
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();