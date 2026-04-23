import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";


// Create transporter function (ensures .env is always loaded BEFORE SMTP creation)
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });


// 🧩 Step 1: Request OTP during signup
export const requestSignupOtp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    // OTP MUST BE STRING
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const otpExpires = Date.now() + 10 * 60 * 1000;
    const hashedPassword = await bcrypt.hash(password, 10);
    

    // Find user
    let user = await User.findOne({ email });

    if (user) {
      if (user.verified)
        return res.status(400).json({ message: "User already exists" });

      // Update existing
      user.name = name;
      user.password = hashedPassword;
      user.role = role;
      user.otp = otp; // STORE AS STRING
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // New user
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        otp,
        otpExpires,
        verified: false,
      });
      await user.save();
    }

    // Send Email AFTER saving
    await createTransporter().sendMail({
      from: `"SetuHub" <${process.env.EMAIL}>`,
      to: email,
      subject: "SetuHub Account Verification",
      html: `
        <h2>Welcome to SetuHub 🎉</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="letter-spacing:5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};



// 🧩 Step 2: Verify OTP & activate account
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpClean = String(otp).trim();

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.verified) return res.json({ message: "Already verified" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired, please request a new one" });

    if (String(user.otp).trim() !== otpClean)
      return res.status(400).json({ message: "Invalid OTP" });

    user.verified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "Account verified successfully!" });

  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};



// 🧩 Step 3: Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.verified)
      return res.status(400).json({ message: "Please verify your account first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};


console.log("Loaded email credentials:", process.env.EMAIL, process.env.EMAIL_PASS ? "✅" : "❌");
