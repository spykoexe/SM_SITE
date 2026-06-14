"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
// Middlewares
app.use((0, helmet_1.default)({
    contentSecurityPolicy: env_1.env.NODE_ENV === "production",
    crossOriginEmbedderPolicy: env_1.env.NODE_ENV === "production",
}));
app.use((0, cors_1.default)({ origin: env_1.env.NODE_ENV === "development" ? "http://localhost:5173" : "*", credentials: true }));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimiter_1.apiLimiter);
// Static files
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), env_1.env.UPLOAD_DIR)));
// Health check
app.get("/health", async (_req, res) => {
    const dbOk = await database_1.prisma.$queryRaw `SELECT 1`.then(() => true).catch(() => false);
    res.json({ status: dbOk ? "healthy" : "degraded", timestamp: new Date().toISOString() });
});
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/public", publicRoutes_1.default);
// Real-time
io.on("connection", (socket) => {
    logger_1.logger.debug(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () => logger_1.logger.debug(`Socket disconnected: ${socket.id}`));
});
// Global error handler
app.use(errorHandler_1.errorHandler);
// 404
app.use((_req, res) => res.status(404).json({ success: false, message: "Route non trouvée" }));
// Start
const PORT = parseInt(env_1.env.PORT, 10);
httpServer.listen(PORT, () => {
    logger_1.logger.info(`Server running on port ${PORT} in ${env_1.env.NODE_ENV} mode`);
});
// Graceful shutdown
process.on("SIGTERM", async () => {
    logger_1.logger.info("SIGTERM received, shutting down gracefully");
    await database_1.prisma.$disconnect();
    httpServer.close(() => process.exit(0));
});
//# sourceMappingURL=server.js.map