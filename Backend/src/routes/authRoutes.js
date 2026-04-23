import express from "express";
import { requestSignupOtp, verifySignupOtp, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup/request-otp", requestSignupOtp);
router.post("/signup/verify-otp", verifySignupOtp);
router.post("/login", login);

export default router;
