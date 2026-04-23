import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/* ======================================================
   ✅ TECHNICIAN → CREATE AGENT (ID + PASSWORD)
====================================================== */
router.post("/create-agent", authMiddleware, async (req, res) => {
  try {
    // ✅ Only technician can create agents
    if (req.user.role !== "technician") {
      return res.status(403).json({
        message: "Access denied. Only technicians can create agents.",
      });
    }

    const { name, email, password } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email and Password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Check duplicate agent
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "Agent with this email already exists",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create Agent (CORRECT FIELD USED ✅)
    const agent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "agent",
      parentTechnician: req.user.id, // ✅ FINAL FIX
      activeTickets: 0,
      onLeave: false,
      verified: true,
    });

    res.status(201).json({
      message: "✅ Agent created successfully",
      agentId: agent._id,
      agentName: agent.name,
      agentEmail: agent.email,
      loginPassword: password, // ✅ show ONCE only
    });
  } catch (err) {
    console.error("❌ Agent creation error:", err.message);
    res.status(500).json({
      message: "❌ Agent creation failed",
    });
  }
});

/* ======================================================
   ✅ TECHNICIAN → VIEW THEIR OWN AGENTS
====================================================== */
router.get("/my-agents", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "technician") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const agents = await User.find({
      role: "agent",
      parentTechnician: req.user.id, // ✅ FINAL FIX
    }).select("name email activeTickets onLeave");

    res.json(agents);
  } catch (err) {
    console.error("❌ Get agents error:", err.message);
    res.status(500).json({
      message: "Failed to fetch agents",
    });
  }
});

export default router;
