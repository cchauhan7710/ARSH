import { matchFromKB } from "../utils/kbMatcher.js";
import { detectPriority } from "../utils/autoPriority.js";
import { detectCategory } from "../utils/autoCategory.js";
import { sendEmail } from "../utils/sendEmail.js";

import express from "express";
import axios from "axios";
import Chat from "../models/Chat.js";
import auth from "../middleware/authMiddleware.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

const router = express.Router();

/* =========================================
   ✅ IN-MEMORY FLOW STORE
========================================= */
const ticketFlow = new Map();

/* =========================================
   ✅ AI FALLBACK
========================================= */
async function groqReply(prompt) {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are an IT Helpdesk Assistant." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch {
    return "⚠️ AI service is currently unavailable.";
  }
}

/* =========================================
   ✅ SAVE CHAT
========================================= */
async function saveChat(userId, sender, text) {
  let chat = await Chat.findOne({ user: userId });
  if (!chat) chat = await Chat.create({ user: userId, messages: [] });

  chat.messages.push({ sender, text });
  if (chat.messages.length > 30) chat.messages.shift();
  await chat.save();
}

/* =========================================
   ✅ AUTO TECHNICIAN ASSIGN
========================================= */
async function getLeastLoadedTechnician() {
  return await User.findOne({ role: "technician" }).sort({ activeTickets: 1 });
}

/* =========================================
   ✅ MAIN CHAT ROUTE
========================================= */
router.post("/chat", auth, async (req, res) => {
  try {
    const text = req.body.message?.trim();
    const lowerText = text.toLowerCase();
    const userId = req.user.id;

    if (!text) return res.json({ reply: "Please type a message." });

    await saveChat(userId, "user", text);

    /* -----------------------------------------
       ✅ PASSWORD RESET → SHOW PDF
    ------------------------------------------ */
    if (lowerText.includes("reset") && lowerText.includes("password")) {
      const reply = `✅ Hi! I will help you step by step.

📄 Open the Password Reset Manual:
http://localhost:5173/Password%20Reset%20Manual.pdf

✅ Follow the steps in the document.
If your problem continues, I can create a support ticket for you.`;

      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }
// ✅ PASSWORD RESET PDF HANDLER
if (lowerText.includes("reset password") || lowerText.includes("password reset")) {
  const reply = `
✅ Hi! I will help you step by step.

📄 Open the official Password Reset Manual here:
👉 http://localhost:5173/Password%20Reset%20Manual.pdf

✅ After reading the document:
Reply **YES** to create a support ticket  
Reply **NO** to cancel

⚠️ Important: This guide contains the full recovery process as per IT policy.
`;

  await saveChat(userId, "bot", reply);
  return res.json({ reply, openInNewTab: true });
}

    /* -----------------------------------------
       ✅ STEP 1: ANSWER BY KB FIRST
    ------------------------------------------ */
    const kbMatch = matchFromKB(text);

    if (kbMatch) {
      const reply = `✅ Solution Found

📌 Issue: ${kbMatch.question}
📂 Category: ${kbMatch.category}
🔥 Suggested Priority: ${kbMatch.suggested_priority}

✅ Solution:
${kbMatch.answer}

👉 Do you want me to create a support ticket for this issue?
Reply **YES** or **NO**`;

      ticketFlow.set(userId, {
        step: "confirm",
        title: kbMatch.question,
        description: kbMatch.answer
      });

      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    /* -----------------------------------------
       ✅ STEP 2: MANUAL CREATE COMMAND
    ------------------------------------------ */
    if (lowerText.includes("create ticket")) {
      ticketFlow.set(userId, { step: "title" });

      const reply = "✅ Please enter the ticket title.";
      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    const flow = ticketFlow.get(userId);

    /* -----------------------------------------
       ✅ STEP 3: TITLE
    ------------------------------------------ */
    if (flow?.step === "title") {
      ticketFlow.set(userId, { step: "description", title: text });

      const reply = "✅ Now enter the ticket description.";
      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    /* -----------------------------------------
       ✅ STEP 4: DESCRIPTION → CONFIRM
    ------------------------------------------ */
    if (flow?.step === "description") {
      ticketFlow.set(userId, {
        step: "confirm",
        title: flow.title,
        description: text
      });

      const reply = `✅ Confirm Ticket Creation

📌 Title: ${flow.title}
📝 Description: ${text}

Reply **YES** to confirm or **NO** to cancel.`;

      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    /* -----------------------------------------
       ✅ STEP 5: CONFIRM → CREATE + ASSIGN + EMAIL
    ------------------------------------------ */
    if (flow?.step === "confirm" && lowerText === "yes") {
      const combined = `${flow.title} ${flow.description}`;

      const priority = detectPriority(combined);
      const category = detectCategory(combined);

      const technician = await getLeastLoadedTechnician();

      const ticket = new Ticket({
        title: flow.title,
        description: flow.description,
        priority,
        category,
        status: "Pending",
        user: userId,
        technician: technician?._id
      });

      await ticket.save();

      if (technician) {
        technician.activeTickets += 1;
        await technician.save();

        await sendEmail(
          technician.email,
          "🛠️ New Ticket Assigned",
          `A new ticket has been assigned to you:

Title: ${ticket.title}
Priority: ${ticket.priority}
Category: ${ticket.category}
Ticket ID: ${ticket._id}`
        );
      }

      ticketFlow.delete(userId);

      const reply = `✅ Ticket Created & Assigned!

🎫 Ticket ID: ${ticket._id}
📂 Category: ${category}
🔥 Priority: ${priority}
👨‍🔧 Technician: ${technician?.name || "Pending"}

✅ Technician has been notified by email.`;

      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    /* -----------------------------------------
       ✅ STEP 6: CANCEL
    ------------------------------------------ */
    if (flow?.step === "confirm" && lowerText === "no") {
      ticketFlow.delete(userId);

      const reply = "❎ Ticket creation cancelled.";
      await saveChat(userId, "bot", reply);
      return res.json({ reply });
    }

    /* -----------------------------------------
       ✅ STEP 7: AI FALLBACK
    ------------------------------------------ */
    const aiReply = await groqReply(text);
    await saveChat(userId, "bot", aiReply);
    return res.json({ reply: aiReply });

  } catch (err) {
    console.error("Chatbot Error:", err);
    return res.status(500).json({ reply: "❌ Server error" });
  }
});

/* =========================================
   ✅ CHAT HISTORY
========================================= */
router.get("/chat/history", auth, async (req, res) => {
  const chat = await Chat.findOne({ user: req.user.id }).lean();
  res.json({ messages: chat?.messages || [] });
});

export default router;
