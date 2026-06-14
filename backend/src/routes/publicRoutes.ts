import { Router } from "express";
import * as publicController from "../controllers/publicController";

const router = Router();

router.get("/reviews", publicController.getReviews);
router.post("/reviews", publicController.createReview);
router.post("/tickets", publicController.createTicket);
router.get("/stats", publicController.getStats);
router.get("/servers", publicController.getServers);
router.post("/servers/update", publicController.updateServerStats);

export default router;
