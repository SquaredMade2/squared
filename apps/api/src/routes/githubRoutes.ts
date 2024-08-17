import { Router } from "express";
import { handleOAuthCallback } from "../controllers/githubControllers";

const router = Router();

// OAuth callback route
router.get("/callback", handleOAuthCallback);

export default router;
