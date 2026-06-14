import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { env } from "./config/env";
import { prisma } from "./config/database";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import publicRoutes from "./routes/publicRoutes";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Middlewares
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === "production",
  crossOriginEmbedderPolicy: env.NODE_ENV === "production",
}));
app.use(cors({ origin: env.NODE_ENV === "development" ? "http://localhost:5173" : "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(apiLimiter);

// Static files
app.use("/uploads", express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// Health check
app.get("/health", async (_req, res) => {
  const dbOk = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
  res.json({ status: dbOk ? "healthy" : "degraded", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

// Real-time
io.on("connection", (socket) => {
  logger.debug(`Socket connected: ${socket.id}`);
  socket.on("disconnect", () => logger.debug(`Socket disconnected: ${socket.id}`));
});

// Global error handler
app.use(errorHandler);

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: "Route non trouvée" }));

// Start
const PORT = parseInt(env.PORT, 10);
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  httpServer.close(() => process.exit(0));
});
