import express from "express";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcrypt";
import { requireHeadAdmin, requireAdminOrHead } from "../middleware/roleMiddleware.js";
import { sendTechnicianEmail } from "../utils/sendTechnicianEmail.js"; // ✅ EMAIL

const router = express.Router();

/* ================= USERS ================= */

// Get all users (Admin + Head Admin)
router.get(
  "/users",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);

// ✅ GET ALL TECHNICIANS (FOR MANUAL ASSIGN DROPDOWN)
router.get(
  "/technicians",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      const techs = await User.find({ role: "technician" }).select(
        "name email activeTickets"
      );
      res.json(techs);
    } catch {
      res.status(500).json({ message: "Failed to fetch technicians" });
    }
  }
);

// Promote user → technician (Admin + Head Admin)
router.patch(
  "/users/promote/:id",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { role: "technician" });
      res.json({ message: "User promoted to technician" });
    } catch {
      res.status(500).json({ error: "Promotion failed" });
    }
  }
);

// Promote user → admin (Only Head Admin)
router.patch(
  "/users/promote-admin/:id",
  authMiddleware,
  requireHeadAdmin,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { role: "admin" });
      res.json({ message: "User promoted to Admin" });
    } catch {
      res.status(500).json({ error: "Promotion failed" });
    }
  }
);

// Delete ANY user (Only Head Admin)
router.delete("/users/:id", authMiddleware, requireHeadAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ BLOCK deleting Admin & HeadAdmin
    if (user.role === "admin" || user.role === "headadmin") {
      return res.status(403).json({
        message: "Admins and Head Admin cannot be deleted",
      });
    }

    // ✅ ALLOW ONLY: employee + technician
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Delete failed" });
  }
});


/* ================= CREATE USER ================= */
router.post(
  "/create-user",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      const { name, email, role, password } = req.body;

      if (req.user.role === "admin" && role === "admin") {
        return res.status(403).json({ message: "Only Head Admin can create admins" });
      }

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });

      if (!password || password.length < 6)
        return res.status(400).json({ message: "Password must be at least 6 characters" });

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashed,
        role,
        verified: true,
      });

      res.json({
        message: "User created successfully",
        user,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Create user failed" });
    }
  }
);

/* ================= TICKETS ================= */

// Get ALL tickets (Admin + Head Admin)
router.get(
  "/tickets",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate("user", "name email")
        .populate("assignedTo", "name email");
      res.json(tickets);
    } catch {
      res.status(500).json({ error: "Could not fetch tickets" });
    }
  }
);

// ✅ ✅ ✅ FINAL MANUAL ASSIGN SYSTEM
router.patch(
  "/tickets/assign/:id",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      const { technicianId } = req.body;

      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });

      const technician = await User.findById(technicianId);
      if (!technician || technician.role !== "technician") {
        return res.status(400).json({ message: "Invalid technician" });
      }

      // ✅ REMOVE PREVIOUS TECH LOAD
      if (ticket.assignedTo) {
        const oldTech = await User.findById(ticket.assignedTo);
        if (oldTech) {
          oldTech.activeTickets = Math.max((oldTech.activeTickets || 1) - 1, 0);
          await oldTech.save();
        }
      }

      // ✅ ASSIGN NEW TECH
      ticket.assignedTo = technicianId;
      // ✅ Keep ticket Pending even after assignment
// ✅ Keep Pending even after assignment
ticket.status = "Pending";

      await ticket.save();

      technician.activeTickets = (technician.activeTickets || 0) + 1;
      await technician.save();

      // ✅ SEND EMAIL
      await sendTechnicianEmail(technician.email, ticket);

      res.json({
        message: "Ticket manually assigned successfully",
        technician: technician.name,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Manual assignment failed" });
    }
  }
);

// Update ticket status
router.patch(
  "/tickets/status/:id",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    const { status } = req.body;

    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });

      // ✅ AUTO REMOVE LOAD WHEN RESOLVED
      if (status === "Resolved" && ticket.assignedTo) {
        const tech = await User.findById(ticket.assignedTo);
        if (tech) {
          tech.activeTickets = Math.max((tech.activeTickets || 1) - 1, 0);
          await tech.save();
        }
      }

      ticket.status = status;
      await ticket.save();

      res.json({ message: `Ticket marked as ${status}` });
    } catch {
      res.status(500).json({ error: "Status update failed" });
    }
  }
);

// Delete ticket
router.delete(
  "/tickets/:id",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      await Ticket.findByIdAndDelete(req.params.id);
      res.json({ message: "Ticket deleted" });
    } catch {
      res.status(500).json({ error: "Ticket delete failed" });
    }
  }
);

// Dashboard stats
router.get(
  "/tickets/stats",
  authMiddleware,
  requireAdminOrHead,
  async (req, res) => {
    try {
      const total = await Ticket.countDocuments();
      const pending = await Ticket.countDocuments({ status: "Pending" });
      const resolved = await Ticket.countDocuments({ status: "Resolved" });

      res.json({ total, pending, resolved });
    } catch {
      res.status(500).json({ error: "Stats fetch failed" });
    }
  }
);

export default router;
