import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireHeadAdmin } from "../middleware/roleMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ HEAD ADMIN → Create any user (MANUAL PASSWORD)
router.post(
  "/create-user",
  authMiddleware,
  requireHeadAdmin,
  async (req, res) => {
    const { name, email, role, password } = req.body; // ✅ password added

    try {
      // ✅ Validation
      if (!name || !email || !role || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // ✅ Check if email already exists
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // ✅ MANUAL PASSWORD HASHING (bcrypt)
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword, // ✅ manual password saved securely
        role,
        verified: true, // ✅ unchanged
      });

      res.json({
        message: "User created successfully",
        user: newUser, // ✅ unchanged
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create user" });
    }
  }
);

export default router;
