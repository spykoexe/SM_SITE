import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/2fa/verify", authLimiter, authController.verify2FA);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/2fa/setup", authenticate, authController.setup2FA);
router.post("/2fa/confirm", authenticate, authController.confirm2FA);
router.post("/2fa/disable", authenticate, authLimiter, authController.disable2FA);

export default router;
