import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/profile", authenticate, userController.getProfile);
router.patch("/profile", authenticate, userController.updateProfile);
router.post("/change-password", authenticate, userController.changePassword);
router.get("/sessions", authenticate, userController.getSessions);
router.delete("/sessions/:sessionId", authenticate, userController.revokeSession);
router.get("/activity", authenticate, userController.getActivity);
router.get("/notifications", authenticate, userController.getNotifications);
router.get("/notifications/unread-count", authenticate, userController.getUnreadCount);
router.patch("/notifications/:id/read", authenticate, userController.markNotificationRead);
router.patch("/notifications/read-all", authenticate, userController.markAllRead);

export default router;
