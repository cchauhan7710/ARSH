import express from "express";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { detectPriority } from "../utils/autoPriority.js";
import { detectCategory } from "../utils/autoCategory.js";

const router = express.Router();

/* ======================================================
   ✅ API KEY SECURITY (POSTMAN COMPATIBLE)
====================================================== */
function verifyApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"]; // ✅ MUST BE THIS IN POSTMAN

  if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
    console.log("❌ Received API Key:", apiKey);
    console.log("✅ Expected API Key:", process.env.EXTERNAL_API_KEY);
    return res.status(401).json({ message: "❌ Invalid API Key" });
  }

  next();
}

/* ======================================================
   ✅ CREATE TICKET FROM POSTMAN / OTHER PLATFORM
====================================================== */
router.post("/external/create-ticket", verifyApiKey, async (req, res) => {
  try {
    console.log("✅ Incoming Body:", req.body);

    const { title, description, userEmail, userName } = req.body;

    // ✅ Validation
    if (!title || !description || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "❌ title, description & userEmail are required"
      });
    }

    // ✅ Find or create user
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = await User.create({
        name: userName || "External User",
        email: userEmail,
        password: "external_login_disabled",
        role: "employee",
      });
    }

    // ✅ Auto detection
    const combinedText = title + " " + description;
    const priority = detectPriority(combinedText);
    const category = detectCategory(combinedText);

    // ✅ Create Ticket
    const ticket = new Ticket({
      title,
      description,
      priority,
      category,
      status: "Pending",
      user: user._id,
      source: "External API",
    });

    await ticket.save();

    return res.status(201).json({
      success: true,
      message: "✅ Ticket created successfully via External API",
      ticketId: ticket._id,
      priority,
      category,
    });

  } catch (err) {
    console.error("❌ External Ticket API Error:", err.message);
    return res.status(500).json({ message: "❌ Server Error" });
  }
});

export default router;
