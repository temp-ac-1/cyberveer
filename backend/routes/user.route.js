import express from "express";
import { registerUser, loginUser, verifyOtp, getMe, logoutUser } from "../controllers/user.controller.js";
import { loginLimiter, otpLimiter } from "../middlewares/rateLimiter.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", otpLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/verify-otp", otpLimiter, verifyOtp);
router.get('/me', protect, getMe);
router.get('/logout', protect, logoutUser);

export default router;
