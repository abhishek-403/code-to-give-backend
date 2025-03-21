import express from "express";
import requireUserMiddleware from "./middleware/auth.middleware";
import { googleLogin } from "./controller/user.controller";
const router = express.Router();

// User Routes
router.post("/user/google-login", requireUserMiddleware, googleLogin);

export default router;
