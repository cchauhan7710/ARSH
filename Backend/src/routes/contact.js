import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,       // Your Gmail ID
        pass: process.env.EMAIL_PASS,  // App Password (IMPORTANT)
      },
    });

    // Email options
    await transporter.sendMail({
      from: `"SetuHub Contact" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: "New Contact Form Submission",
      text: `
📩 New Contact Message:

Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    res.status(200).json({ msg: "Message Sent Successfully!" });
  } catch (error) {
    console.error("CONTACT ERROR:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default router;
