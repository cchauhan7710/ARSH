import { detectPriority } from "../utils/autoPriority.js";
import { sendUserResolvedEmail } from "../utils/sendUserResolvedEmail.js";
import { sendTechnicianEmail } from "../utils/sendTechnicianEmail.js";
import express from "express";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";

const router = express.Router();

/* ======================================================
   ✅ EMAIL CONFIG
====================================================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

/* ======================================================
   ✅ USER — GET THEIR OWN TICKETS
====================================================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error("Get user tickets error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ======================================================
   ✅ ADMIN — GET ALL TICKETS
====================================================== */
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email role")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error("Get all tickets error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ======================================================
   ✅ TECHNICIAN — GET ONLY ASSIGNED TICKETS
====================================================== */
router.get("/assigned/my", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error("Technician tickets error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ======================================================
   ✅ TECHNICIAN — UPDATE STATUS + MESSAGE + EMAIL ✅✅✅
====================================================== */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status, comment } = req.body; // ✅ ACCEPT COMMENT

    const ticket = await Ticket.findById(req.params.id).populate("user");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // ✅ SAVE SOLUTION MESSAGE
    if (comment) {
      ticket.solutionComment = comment;
    }

    // ✅ DECREASE TECH LOAD + SEND EMAIL ON RESOLVE
    if (status === "Resolved" && ticket.assignedTo) {
      const tech = await User.findById(ticket.assignedTo);

      if (tech) {
        tech.activeTickets = Math.max((tech.activeTickets || 1) - 1, 0);
        await tech.save();
      }

      // ✅ SEND EMAIL WITH SOLUTION MESSAGE
      if (ticket.user?.email) {
        await sendUserResolvedEmail(ticket.user.email, {
          ...ticket.toObject(),
          solutionComment: ticket.solutionComment,
        });
      }
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error("❌ Status update error:", err.message);
    res.status(500).json({ message: "Status update failed" });
  }
});

/* ======================================================
   ✅ MANUAL TECH ASSIGN + COUNT + EMAIL ✅
====================================================== */
/* ======================================================
   ✅ TECHNICIAN — UPDATE STATUS + MESSAGE + EMAIL ✅✅✅
====================================================== */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status, solutionComment } = req.body; // ✅ FIX NAME

    const ticket = await Ticket.findById(req.params.id).populate("user");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // ✅ SAVE SOLUTION MESSAGE
    if (solutionComment) {
      ticket.solutionComment = solutionComment;
    }

    // ✅ DECREASE TECH LOAD + SEND EMAIL ON RESOLVE
    if (status === "Resolved" && ticket.assignedTo) {
      const tech = await User.findById(ticket.assignedTo);

      if (tech) {
        tech.activeTickets = Math.max((tech.activeTickets || 1) - 1, 0);
        await tech.save();
      }

      // ✅ SEND EMAIL WITH SOLUTION MESSAGE
      if (ticket.user?.email) {
        await sendUserResolvedEmail(ticket.user.email, {
          ...ticket.toObject(),
          solutionComment: ticket.solutionComment,
        });
      }
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error("❌ Status update error:", err.message);
    res.status(500).json({ message: "Status update failed" });
  }
});


/* ======================================================
   ✅ AUTO-ASSIGN CREATE TICKET (SAFE)
====================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, category, image } = req.body;

    const autoPriority = detectPriority(title + " " + description);

    const ticket = new Ticket({
      title,
      description,
      priority: autoPriority,
      category: category || "General",
      status: "Pending",
      user: req.user.id,
    });

    await ticket.save();

    const techList = await User.find({ role: "technician" }).sort({
      activeTickets: 1,
    });

    let assignedTech = null;

    if (techList.length > 0) {
      assignedTech = techList[0];

      ticket.assignedTo = assignedTech._id;
      ticket.status = "In Progress";

      assignedTech.activeTickets = (assignedTech.activeTickets || 0) + 1;

      await assignedTech.save();
      await ticket.save();

      if (assignedTech.email) {
        try {
          await sendTechnicianEmail(assignedTech.email, ticket);
        } catch (err) {
          console.log("⚠️ Auto-assign email failed:", err.message);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "✅ Ticket created & auto-assigned",
      ticket,
      assignedTechnician: assignedTech ? assignedTech.name : null,
    });
  } catch (err) {
    console.error("❌ Ticket creation failed:", err.message);
    res.status(500).json({
      success: false,
      message: "Ticket creation failed",
    });
  }
});

/* ======================================================
   ✅ ADMIN — DELETE TICKET
====================================================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error("Delete ticket error:", err.message);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
