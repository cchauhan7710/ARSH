import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  console.log("Loaded email credentials:", process.env.EMAIL || "❌ missing");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,      // ✅ updated
      pass: process.env.EMAIL_PASS, // ✅ updated
    },
  });

  await transporter.sendMail({
    from: `"SAMADHAN" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
  });
};
