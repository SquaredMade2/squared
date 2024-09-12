import { Router } from "express";
import {
	handleOAuthCallback,
	handleWebhook,
} from "../controllers/githubControllers";

const router = Router();

// OAuth callback route
router.get("/callback", handleOAuthCallback);

// Webhook route
router.post("/webhooks", handleWebhook);

export default router;
