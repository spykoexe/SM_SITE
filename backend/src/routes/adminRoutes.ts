import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/rbac";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/users", adminController.getUsers);
router.post("/users", adminController.createUser);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.post("/users/:id/reset-password", adminController.resetUserPassword);
router.get("/activity-logs", adminController.getActivityLogs);
router.get("/health", adminController.getSystemHealth);
router.post("/announcements", adminController.createAnnouncement);

export default router;
